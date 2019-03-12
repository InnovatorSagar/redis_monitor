import React, { Component } from "react";
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
      numberOfClientsFlag: 0
    };
  }

  componentDidMount() {
    socket.disconnect();
    socket.connect();
    socket.emit("startMonitoring");
    socket.on("get-data-for-blinking-notification", data => {
      console.log(data);
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
    console.log("After component did mount", this.state);
    return (
      <div className="app-container">
        <HeaderComponent heading="Dashboard" />
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
    );
  }
}

export default DashboardComponent;
