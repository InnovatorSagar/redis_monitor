const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const redis = require("redis");
const url = process.env.MONGOLAB_URI || "mongodb://localhost:27017/";
const mongoClient = require("mongodb").MongoClient; //url on which the mongodb is giving services
const nodemailer = require("nodemailer");
const moment = require("moment");
var sendMailFlag = 0; //variable used for sending the mail only once
let blink = 1;
let infoInterval = null;
let u = { port: null, host: null, password: null };
let rclient = null;
let flag = false;
var data = {
  metrics: {
    performanceData: 0,
    numberOfClient: 1,
    maximumMemory: 0,
    usedMemory: 0,
    keySpaceHit: 0,
    keySpaceMiss: 0
  },
  flags: {
    performanceFlag: 0,
    memoryFlag: 0,
    numberOfClientsFlag: 0,
    hitRatioFlag: 0
  }
};
app.use(express.static(path.join(__dirname, "../../build")));

//testing the server on index.html
app.get("*", function(req, res) {
  res.sendFile(__dirname + "./index.html");
});
app.get("/home", function(req, res) {
  res.sendFile(__dirname + "./index.html");
});
class Record {
  constructor(date, data) {
    this.date = date;
    this.data = data;
  }
}

//socket On when user connected to localhost 4000
io.sockets.on("connection", function(socket) {
  socket.setMaxListeners(0);

  //socket for saving the threshold values of the user config settings to mongodb
  socket.on("user-config", function(userConfig, callback) {
    var client = redis.createClient({
      port: userConfig.port,
      host: userConfig.databaseHost,
      password: userConfig.databasePass
    });

    client.on("error", function(err, res) {
      if (err) {
        console.log(err);
        callback(false);
        client.end(false);
      }
    });

    client.on("ready", function(err, res) {
      insertIntoUser(userConfig, function(res) {});
      u = userConfig;
      //sending true as callback
      callback(true);
      client.end(false);
    });
  });

  //socket for updating user configuration
  socket.on("update-user-config", function(userConfig, callback) {
    var client = redis.createClient({
      port: userConfig.port,
      host: userConfig.databaseHost,
      password: userConfig.databasePass
    });

    client.on("error", function(err, res) {
      if (err) {
        callback(false);
        client.end(false);
      }
    });

    client.on("ready", function(err, res) {
      updateUserConfig(userConfig, function(res) {
        u = userConfig;
        //setting the flags value to 0
        data.flags.performanceFlag = 0;
        data.flags.hitRatioFlag = 0;
        data.flags.memoryFlag = 0;
        data.flags.numberOfClientsFlag = 0;
        sendMailFlag = 0;
        // console.log("updated flags to ", data.flags);
        // console.log("Updated user config", res);
        callback(true);
        client.end(false);
      });
    });
  });

  //returning number of slaves
  socket.on("get-master-slave", function(callback) {
    var slaves = [];
    var client = redis.createClient({
      port: u.port,
      host: u.databaseHost,
      password: u.databasePass
    });

    client.on("error", function(err, res) {
      if (err) {
        callback(slaves);
        client.end(false);
      }
    });

    client.on("ready", function(err, res) {
      //first  element will be the master
      slaves.push({
        id: 0,
        port: parseInt(u.port)
      });
      //checking for clients
      if (client.server_info.connected_slaves > 0) {
        let i;
        for (i = 0; i < client.server_info.connected_slaves; i++) {
          console.log(
            client["server_info"]["slave" + i.toString()]
              .match(/port=\d+/i)[0]
              .split("=")[1]
          );
          slaves.push({
            id: i + 1,
            port: parseInt(
              client["server_info"]["slave" + i.toString()]
                .match(/port=\d+/i)[0]
                .split("=")[1]
            )
          });
        }
      }
      //sending the list of slaves
      callback(slaves);

      //closing the client
      client.end(false);
    });
  });

  //socket for getting the user info from the database
  socket.on("get-user-data", function(callback) {
    getUserData(function(values) {
      callback(values);
    });
  });

  //socket for sending the data to frontend when he click on user setting
  socket.on("send-data", function(callback) {
    countNoOfDocuments(callback);
  });

  //socket for starting the monitoring on the dashboard
  socket.on("startMonitoring", (id, port) => {
    getUserData(function(thresholdValues) {
      //console.log("ID AND PORT THST CSMR IS : ", port, id);
      getinfo(thresholdValues, id, port, socket);
    });
  });

  //socket disconection
  socket.on("disconnect", () => {});
  //socket for getting the data between two dates
  socket.on("get-data-between-two-dates", function(
    startDate,
    endDate,
    type,
    returnToFrontEnd
  ) {
    getDataBetweenTwoDates(startDate, endDate, callback => {
      let arr = new Array(callback.length);
      let data = { date: "", data: "" };
      for (let i = 0; i < callback.length; i++) {
        data.date = callback[i].createdAt;
        if (type === 1) data.data = callback[i].maxUsedMemory;
        else if (type === 2) data.data = callback[i].maxNumberOfClient;
        else if (type === 3) data.data = callback[i].maxPerformanceData;
        else data.data = callback[i].maxHitRatio;
        let record = new Record(data.date, data.data);
        arr[i] = record;
      }
      returnToFrontEnd(arr);
    });
  });
});

mongoClient.connect(url, { useNewUrlParser: true }, function(err, metrices) {
  if (err) throw err;
  var RDBAlert = metrices.db("rdbalert");
  RDBAlert.collection("redismetric").createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 86400 },
    function(err, res) {
      if (err) throw err;
      metrices.close();
    }
  );
});

//creating transporter for mail
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  pool: true,
  auth: {
    user: "rdbalerta@gmail.com",
    pass: "Rdbalert@1"
  }
});

//function to send the mail to developer if alert is triggered
function sendMail(mailOptions) {
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      blink = 2;
      console.log("Changed blink to ", blink);
    }
  });
}

//function to insert the userconfig into the config collection in user database
function insertIntoUser(userConfig, fn) {
  mongoClient.connect(url, { useNewUrlParser: true }, function(err, user) {
    //connecting the mongoclient
    if (err) throw err;
    var databaseObject = user.db("rdbalert"); //creating the database Object
    var config = userConfig;
    databaseObject
      .collection("userconfig")
      .insertOne(config, function(err, res) {
        if (err) fn(false);
        fn(true);
        user.close();
      });
  });
}

//function to update the userconfig
function updateUserConfig(newUserConfig, callback) {
  clearInterval(infoInterval);
  mongoClient.connect(url, { useNewUrlParser: true }, function(err, user) {
    //connecting the mongoclient
    if (err) throw err;
    var databaseObject = user.db("rdbalert");
    var newConfig = newUserConfig;
    databaseObject.collection("userconfig").drop();
    databaseObject
      .collection("userconfig")
      .insertOne(newConfig, function(err, res) {
        if (err) callback(false);
        else {
          callback(res);
        }
        user.close();
      });
  });
}

//function to count the no of documents in mongoDb
function countNoOfDocuments(callback) {
  mongoClient.connect(url, { useNewUrlParser: true }, function(err, user) {
    if (err) throw err;
    var databaseObject = user.db("rdbalert");
    databaseObject
      .collection("userconfig")
      .find()
      .count()
      .then(res => {
        if (res == 0) {
          callback(0);
        } else {
          callback(1);
        }
      });
  });
}

//function to get the user Data from the Database
function getUserData(callback) {
  mongoClient.connect(url, { useNewUrlParser: true }, function(err, user) {
    if (err) throw err;
    var databaseObject = user.db("rdbalert");
    databaseObject
      .collection("userconfig")
      .find()
      .toArray()
      .then(res => {
        callback(res[0]);
      });
  });
}

//function to insert themetric into metrices database
function insertIntoMetricesDb(metric, callback) {
  mongoClient.connect(url, { useNewUrlParser: true }, function(err, metrices) {
    if (err) throw err;
    var redismetric = metrices.db("rdbalert").collection("redismetric");
    redismetric
      .find(metric)
      .limit(1)
      .toArray()
      .then(res => {
        if (res.length === 0) {
          redismetric.insertOne(metric, function(err, res) {
            if (err) throw err;
            metrices.close();
            callback(true);
          });
        } else {
          callback(false);
        }
      });
  });
}

function insertdataintoDateMetricDatabase(notifyData, callback) {
  mongoClient.connect(url, { useNewUrlParser: true }, function(
    err,
    datemetric
  ) {
    if (err) throw err;
    var dateMetric = datemetric.db("rdbalert").collection("dateMetricData");
    dateMetric
      .find(notifyData)
      .limit(1)
      .toArray()
      .then(res => {
        if (res.length === 0)
          dateMetric.insertOne(notifyData, function(err, r) {
            if (err) {
              callback(false);
              throw err;
            } else {
              callback(true);
            }
            datemetric.close();
          });
      });
  });
}

//function to get the info of the redis database
function getinfo(userData, id, port, socket) {
  if (infoInterval !== null) clearInterval(infoInterval);
  //console.log(userData);
  if (rclient === null) {
    rclient = redis.createClient({
      port: port,
      host: userData.databaseHost,
      password: userData.databasePass
    });
  } else if (
    parseInt(port) !== rclient.connection_options.port ||
    userData.databaseHost !== rclient.connection_options.host
  ) {
    rclient = redis.createClient({
      port: port,
      host: userData.databaseHost,
      password: userData.databasePass
    });
  }
  // data format that will be entered at the end of day
  var notifyData = {
    _id: 1,
    createdAt: moment().format("YYYY/MM/DD"),
    maxPerformanceData: 0,
    maxNumberOfClient: 0,
    maxUsedMemory: 0,
    maxHitRatio: 0
  };
  let i = 1;
  infoInterval = setInterval(() => {
    //console.log("SENDMAIFLAG : ", sendMailFlag);
    //data format of metric which is going to added in database
    rclient.info((req, res) => {
      res.split("\n").map(line => {
        if (line.match(/used_cpu_sys:\d+\.\d+/i)) {
          //console.log("Performance Data: " + line.split(":")[1]);
          data.metrics.performanceData = parseFloat(line.split(":")[1]);
        }
        if (line.match(/used_memory:\d/i)) {
          //console.log('Used memory: ' + line.split(":")[1]);
          data.metrics.usedMemory = parseInt(line.split(":")[1]);
        }
        if (line.match(/connected_clients/i)) {
          //console.log('Clients: ' + line.split(":")[1]);
          data.metrics.numberOfClient = parseInt(line.split(":")[1]);
        }
        if (line.match(/keyspace_hits:\d/i)) {
          //console.log('keyspace_hit:'+ line.split(':'[1]))
          data.metrics.keySpaceHit = parseInt(line.split(":")[1]);
        }
        if (line.match(/keyspace_misses:\d/i)) {
          //console.log('keyspace_misses:'+ line.split(':'[1]))
          data.metrics.keySpaceMiss = parseInt(line.split(":")[1]);
        }
      });
    });

    var metrics = {
      createdAt: moment().format("YYYY/MM/DD"),
      performanceMetric: data.metrics.performanceData,
      usedMemoryMetric: data.metrics.usedMemory,
      noOfClientsMetric: data.metrics.numberOfClient,
      hitRatio:
        data.metrics.keySpaceHit /
        (data.metrics.keySpaceHit + data.metrics.keySpaceMiss)
    };

    //checking if hitratio is NaN
    if (isNaN(metrics.hitRatio)) {
      metrics.hitRatio = 0;
    }

    //condition for getting the maxperformance data per sec
    if (metrics.performanceMetric > notifyData.maxPerformanceData) {
      notifyData.maxPerformanceData = metrics.performanceMetric;
    }

    //condition for getting the max no of clients data per sec
    if (metrics.noOfClientsMetric > notifyData.maxUsedMemory) {
      notifyData.maxNumberOfClient = metrics.noOfClientsMetric;
    }

    //condition for getting the max used memory data per sec
    if (metrics.usedMemoryMetric > notifyData.maxUsedMemory) {
      notifyData.maxUsedMemory = metrics.usedMemoryMetric;
    }

    //condition for getting the max hitratio data per sec
    if (metrics.hitRatio > notifyData.maxHitRatio) {
      notifyData.maxHitRatio = metrics.performanceMetric;
    }

    //entering the max data at end of the day
    if (moment().format("HH:mm:ss") == "00:00:00") {
      notifyData._id = i;
      notifyData.createdAt = moment()
        .add(i, "days")
        .format("YYYY/MM/DD");
      i += 1;
      insertdataintoDateMetricDatabase(notifyData, function(insert) {});
    }

    //insertng into the metric database
    insertIntoMetricesDb(metrics, function(insert) {});

    var mailOptions = {
      from: "aloowalia22@gmail.com",
      to: userData.email,
      subject: "ALERT FROM RDBALERT",
      text: "Hi " + userData.name + " ,\n\n\n"
    };

    var mailFlag = 0;
    var mailOptions = {
      from: "aloowalia22@gmail.com",
      to: userData.email,
      subject: "REDIS SERVER ALERT",
      text: "Hi " + userData.name + " ,\n\n\n "
    };

    var mailFlag = 0;

    //condition checking for checking the performance of cpu
    if (
      data.metrics.performanceData > parseInt(userData.thresholdCpuPerformance)
    ) {
      data.flags.performanceFlag = 1;
      mailOptions.text +=
        "PERFORMANCE ALERT " +
        "\n Threshold Performance Data : " +
        userData.thresholdCpuPerformance +
        " \nPerformance Data : " +
        data.metrics.performanceData +
        "\n\n";
      mailFlag = 1;
    }

    //console.log(data.metrics.performanceData,userData.thresholdCpuPerformance)

    //condition for checking the used memory by redis
    if (data.metrics.usedMemory > parseInt(userData.thresholdMemory)) {
      data.flags.memoryFlag = 1;
      mailOptions.text +=
        "MEMORY ALERT " +
        "\nThreshold Memory : " +
        userData.thresholdMemory +
        "\n UsedMemory : " +
        data.metrics.usedMemory +
        "\n\n";
      mailFlag = 1;
    }

    //condition for checking the no of clients alert
    if (data.metrics.numberOfClient > parseInt(userData.thresholdNoOfClients)) {
      data.flags.numberOfClientsFlag = 1;
      mailOptions.text +=
        "NO OF CLIENTS ALERT " +
        "\nThreshold No Of Clients : " +
        userData.thresholdNoOfClients +
        "\nNo Of Clients : " +
        data.metrics.numberOfClient +
        "\n\n";
      mailFlag = 1;
    }

    //condition for checking the hit ratio alert
    if (
      data.metrics.keySpaceHit /
        (data.metrics.keySpaceHit + data.metrics.keySpaceMiss) >=
        1 ||
      (data.metrics.keySpaceHit > 0 &&
        data.metrics.keySpaceHit /
          (data.metrics.keySpaceHit + data.metrics.keySpaceMiss) <
          parseInt(userData.thresholdHitRatio))
    ) {
      data.flags.hitRatioFlag = 1;
      mailOptions.text +=
        "Hit Ratio Alert " +
        "\nThreshold Hit Ratio : " +
        userData.thresholdHitRatio +
        " \nHitratio : " +
        data.metrics.hitRatio +
        "\n";
      mailFlag = 1;
    }

    if (sendMailFlag === 0 && mailFlag === 1) {
      mailOptions.text += "\nRegards,\nRDBAlert Team";
      sendMail(mailOptions);
      sendMailFlag = 1;
    }

    //socket for sending the notify data to notification
    socket.on("get-data-for-notification", function(callback) {
      getUserData(done => {
        callback(notifyData, done);
      });
    });
    //socket for sending data to blink notification
    if (sendMailFlag === 1 && blink === 2) {
      //console.log(data.flags);
      socket.emit("get-data-for-blinking-notification", data.flags);
    }
    //socket for sending the real time data to dashboard
    socket.emit("info", data);
  }, 2000);
}

//function for getting the data between two dates
function getDataBetweenTwoDates(startDate, endDate, callback) {
  mongoClient.connect(url, { useNewUrlParser: true }, function(
    err,
    datemetric
  ) {
    if (err) throw err;
    const dateMetricData = datemetric
      .db("rdbalert")
      .collection("dateMetricData");
    dateMetricData
      .find({
        createdAt: {
          $gte: moment(startDate).format("YYYY/MM/DD"),
          $lt: moment(endDate)
            .add(1, "days")
            .format("YYYY/MM/DD")
        }
      })
      .toArray()
      .then(res => {
        callback(res);
      });
  });
}
const port = process.env.PORT || "4000";
server.listen(port, () => {
  console.log("Listening to port", port);
});
