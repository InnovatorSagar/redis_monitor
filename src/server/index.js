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

const port = process.env.PORT || "4000";
server.listen(port, () => {
  console.log(
    "Listening to port",
    port,
    process.env.PORT,
    process.env.PORT_NUMBER
  );
});
let rclient = null;
app.use(express.static(path.join(__dirname, "../../build")));

//testing the server on index.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + "./index.html");
});

app.get("/port_address", function(req, res) {
  return res.send(process.env.PORT);
});

class Record {
  constructor(date, data) {
    this.date = date;
    this.data = data;
  }
}

//socket On when user connected to localhost 4000
io.sockets.on("connection", function(socket) {
  //socket for saving the threshold values of the user config settings to mongodb
  socket.on("user-config", function(userConfig, callback) {
    insertIntoUser(userConfig, function(res) {
      if (res) callback(true);
      else callback(false);
    });
  });

  socket.on("d", function(f) {
    f("hello");
  });
  //socket for updating user configuration
  socket.on("update-user-config", function(userconfig, callback) {
    updateUserConfig(userconfig, function(res) {
      callback(res);
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
  socket.on("startMonitoring", () => {
    getUserData(function(thresholdValues) {
      getinfo(thresholdValues, socket);
    });
    // mongoClient.connect(url, { useNewUrlParser: true }, function(err, user) {
    //   //connecting the mongoclient
    //   if (err) throw err;
    //   var databaseObject = user.db("RDBAlert"); //creating the database Obje
    //   databaseObject
    //     .collection("startmonitoring")
    //     .find()
    //     .toArray()
    //     .then(res => {
    //       if (res.length === 0) {
    //         databaseObject
    //           .collection("startmonitoring")
    //           .insertOne({ inserted: 1 })
    //           .then(res => {
    //             console.log("Inserted one valeu");
    //             getUserData(function(thresholdValues) {
    //               getinfo(thresholdValues, socket);
    //             });
    //           });
    //       }
    //     });
    // });
  });

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
    user: "aloowalia22@gmail.com",
    pass: "asdfg@123"
  }
});

//function to send the mail to developer if alert is triggered
function sendMail(mailOptions) {
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
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
  mongoClient.connect(url, { useNewUrlParser: true }, function(err, user) {
    //connecting the mongoclient
    if (err) throw err;
    var databaseObject = user.db("rdbalert");
    var newConfig = newUserConfig;
    databaseObject.collection("userconfig").drop();
    databaseObject
      .collection("userconfig")
      .insertOne(newConfig, function(err, res) {
        if (err) callback(null);
        else callback(res);
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
    var databaseObject = user.db("adbalert");
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
              console.log("Error found", res, notifyData);
              throw err;
            } else console.log("Inserted in datewala", notifyData);
            datemetric.close();
            callback(true);
          });
      });
  });
}

function getinfo(userData, socket) {
  if (rclient === null) {
    rclient = redis.createClient(userData.port, userData.databaseHost);
    console.log(
      "Server infor ports and ip ",
      rclient.connection_options.port,
      userData.port
    );
    console.log(
      "Server infor ports and ip ",
      rclient.connection_options.host,
      userData.databaseHost
    );
  } else if (
    parseInt(userData.port) !== rclient.connection_options.port ||
    userData.databaseHost !== rclient.connection_options.host
  ) {
    rclient = redis.createClient(userData.port, userData.databaseHost);
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
  setInterval(() => {
    var data = {
      metrics: {
        performanceData: rclient.server_info.used_cpu_sys,
        numberOfClient: rclient.server_info.connected_clients,
        maximumMemory: rclient.server_info.maxmemory,
        usedMemory: rclient.server_info.used_memory,
        keySpaceHit: rclient.server_info.keySpaceHit,
        keySpaceMiss: rclient.server_info.keySpaceMiss
      },
      flags: {
        performanceFlag: 0,
        memoryFlag: 0,
        numberOfClientsFlag: 0
      }
    };

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

    if (moment().format("HH:mm:ss") == "00:00:00") {
      notifyData._id = i;
      notifyData.createdAt = moment()
        .add(i, "days")
        .format("YYYY/MM/DD");
      i += 1;
      insertdataintoDateMetricDatabase(notifyData, function(insert) {
        if (insert) console.log("Inserte data date wala");
        else console.log("Not inserted");
      });
    }

    //insertng into the metric database
    insertIntoMetricesDb(metrics, function(insert) {
      if (insert) console.log("Data isnerted");
      else console.log("Duplicate data");
    });

    //condition checking for checking the performance of cpu
    if (
      data.metrics.performanceData >
        parseInt(userData.thresholdCpuPerformance) &&
      sendMailFlag == 0
    ) {
      data.flags.performanceFlag = 1;
      var mailOptions = {
        from: "aloowalia22@gmail.com",
        to: userData.email,
        subject: "Performance Alert regarding redis database",
        text: "PERFORMANCE ALERT"
      };
      sendMail(mailOptions);
      sendMailFlag = 1;
    }

    //condition for checking the used memory by redis
    if (
      data.metrics.usedMemory > parseInt(userData.thresholdMemory) &&
      sendMailFlag == 0
    ) {
      data.flags.memoryFlag = 1;
      var mailOptions = {
        from: "aloowalia22@gmail.com",
        to: userData.email,
        subject: "Memory Alert regarding redis database",
        text: "MEMORY ALERT"
      };
      sendMail(mailOptions);
      sendMailFlag = 1;
    }
    //condition for checking the no of clients alert
    if (
      data.metrics.numberOfClient > parseInt(userData.thresholdNoOfClients) &&
      sendMailFlag == 0
    ) {
      data.flags.numberOfClientsFlag = 1;
      var mailOptions = {
        from: "aloowalia22@gmail.com",
        to: userData.email,
        subject: "No of Clients Alert regarding redis database",
        text: "NO OF CLIENTS ALERT"
      };
      sendMail(mailOptions);
      sendMailFlag = 1;
    }

    //condition for checking the hit ratio alert
    if (
      data.metrics.keySpaceHit /
        (data.metrics.keySpaceHit + data.metrics.keySpaceMiss) >
        4 &&
      data.metrics.keySpaceHit > 0 &&
      data.metrics.keySpaceHit /
        (data.metrics.keySpaceHit + data.metrics.keySpaceMiss) <
        parseInt(userData.thresholdHitRatio)
    ) {
      data.flags.hitRatioFlag = 1;
      var mailOptions = {
        from: "aloowalia22@gmail.com",
        to: userData.email,
        subject: "Hit Ratio Alert regarding redis database",
        text: "Hit Ratio ALERT"
      };
      sendMail(mailOptions);
      sendMailFlag = 1;
    }

    //socket for sending the notify data to notification
    socket.on("get-data-for-notification", function(callback) {
      getUserData(done => {
        callback(notifyData, done);
      });
    });

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
