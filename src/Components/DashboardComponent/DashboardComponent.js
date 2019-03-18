import React, { Component } from "react";
//import html2canvas from 'html2canvas';
import "./DashboardComponent.css";
import MatrixCardComponent from "../MatrixCardComponent/MatrixCardComponent";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import { socket } from "../../index.js";

class DashboardComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      performanceFlag: 0,
      memoryFlag: 0,
      hitRatioFlag: 0,
      numberOfClientsFlag: 0,
      id: this.props.location.state.id,
      port: this.props.location.state.port
    };
  }
  // screenshot = () => {
  //   html2canvas(document.body).then(function(canvas) {
  //     document.body.appendChild(canvas);
  //     var imageType = 'image/png';
  //     var imageData = canvas.toDataURL(imageType);
  //     console.log(imageData);
  //   });
  // }

  componentWillUnmount() {
    socket.disconnect();
    socket.connect();
  }
  componentDidMount() {
    socket.disconnect();
    socket.connect();
    console.log(this.props.location.state.port);
    socket.emit("startMonitoring", this.state.id, this.state.port);
    socket.on("get-data-for-blinking-notification", data => {
      console.log("Blinking even", data);
      this.setState(
        {
          performanceFlag: data.performanceFlag,
          hitRatioFlag: data.hitRatioFlag,
          numberOfClientsFlag: data.numberOfClientsFlag,
          memoryFlag: data.memoryFlag
        },
        () => {
          console.log(this.state);
        }
      );
    });
  }

  render() {
    // if(this.state.performanceFlag) {
    //   this.screenshot(); }

    console.log("After component did mount", this.state);
    return (
      <div>
        <HeaderComponent heading="Dashboard" />
        <div className="app-container">
        <h1>Welcome To Database Monitoring</h1>
        <hr />
        <div className="upper-cards">
          <MatrixCardComponent
            heading="Memory Matrix"
            notify={this.state.memoryFlag}
          />
          <MatrixCardComponent
            heading="Number Of Clients Matrix"
            notify={this.state.numberOfClientsFlag}
          />
        </div>
        <div className="upper-cards">
          <MatrixCardComponent
            heading="Performance Matrix"
            notify={this.state.performanceFlag}
          />
          <MatrixCardComponent
            heading="Hit-Ratio Matrix"
            notify={this.state.hitRatioFlag}
          />
        </div>
      </div>
      </div>
    );
  }
}

export default DashboardComponent;
