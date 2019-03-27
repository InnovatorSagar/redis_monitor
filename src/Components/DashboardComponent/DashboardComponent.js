import React, { Component } from "react";
import "./DashboardComponent.css";
import MatrixCardComponent from "../MatrixCardComponent/MatrixCardComponent";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import { socket } from "../../index.js";

class DashboardComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevperformanceFlag: 0,
      prevmemoryFlag: 0,
      prevhitRatioFlag: 0,
      prevnumberOfClientsFlag: 0,
      performanceFlag: 0,
      memoryFlag: 0,
      hitRatioFlag: 0,
      numberOfClientsFlag: 0,
      id: this.props.location.state.id,
      port: this.props.location.state.port
    };
  }
  componentWillUnmount() {
    socket.disconnect();
    socket.connect();
  }
  componentDidMount() {
    socket.disconnect();
    socket.connect();
    socket.emit("startMonitoring", this.state.id, this.state.port);
    socket.on("get-data-for-blinking-notification", data => {
      if (
        this.state.prevperformanceFlag !== data.performanceFlag ||
        this.state.prevmemoryFlag !== data.memoryFlag ||
        this.state.prevnumberOfClientsFlag !== data.numberOfClientsFlag ||
        this.state.prevhitRatioFlag !== data.hitRatioFlag
      ) {
        this.setState(
          {
            performanceFlag: data.performanceFlag,
            hitRatioFlag: data.hitRatioFlag,
            numberOfClientsFlag: data.numberOfClientsFlag,
            memoryFlag: data.memoryFlag,
            prevperformanceFlag: data.performanceFlag,
            prevhitRatioFlag: data.hitRatioFlag,
            prevnumberOfClientsFlag: data.numberOfClientsFlag,
            prevmemoryFlag: data.memoryFlag
          },
          () => {
            //console.log(this.state);
          }
        );
      }
    });
  }

  render() {
    // if(this.state.performanceFlag) {
    //   this.screenshot(); }
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
