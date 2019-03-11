import React, { Component } from "react";
import "./DashboardComponent.css";
import MatrixCardComponent from "../MatrixCardComponent/MatrixCardComponent";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import { socket } from "../../App.js";

class DashboardComponent extends Component {
  componentDidMount() {
    socket.emit("startMonitoring");
  }

  render() {
    return (
      <div className="app-container">
        <HeaderComponent heading="Dashboard" />
        <h1>DB Headline Goes Here</h1>
        <hr />
        <div className="upper-cards">
          <MatrixCardComponent heading="Memory Matrix" />
          <MatrixCardComponent heading="Number Of Clients Matrix" />
        </div>
        <div className="upper-cards">
          <MatrixCardComponent heading="Performance Matrix" />
          <MatrixCardComponent heading="Hit-Ratio Matrix" />
        </div>
      </div>
    );
  }
}

export default DashboardComponent;
