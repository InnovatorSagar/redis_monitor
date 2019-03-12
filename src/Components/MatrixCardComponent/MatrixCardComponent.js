import React, { Component } from "react";
import ChangeValue from "../PerformanceComponent/changeValue.js";
import "./MatrixCardComponent.css";
import alert_on from "../../assets/alert_on.png";
import description from "../../assets/description.png";
import MemoryChart from "../MemoryComponent/MemoryChart.js";
import ClientChart from "../ClientComponent/ClienChart.js";
import HitRatioChart from "../HitRatioComponent/HitRatioComponent.js";
import NotificationComponent from "../NotificationComponent/NotificationComponent.js";
import DescriptionModalComponent from "../DescriptionModal/DescriptionModalComponent.js";
import { socket } from "../../index";

class MatrixCardComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      component: null,
      notificationModal: false,
      descriptionModal: false,
      notify: false,
      blink: true,
      data: null,
    };
    this.notificationModal = this.notificationModal.bind(this);
    this.descriptionModal = this.descriptionModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  

  blinkbutton = (notify) => {
    if(notify===1) {
      setTimeout(() => {this.setState({blink: !this.state.blink});},1000);
    }
    return this.state.blink;
  }

  notificationModal() {
    this.setState({ notificationModal: true });
    socket.emit("get-data-for-notification", (d, u) => {
      console.log("Data ", d);
      if (this.props.heading === "Performance Matrix") {
        d = d.maxPerformanceData;
        u = u.thresholdCpuPerformance;
      } else if (this.props.heading === "Memory Matrix") {
        d = d.maxUsedMemory;
        u = u.thersholdMemory;
      } else if (this.props.heading === "Number Of Clients Matrix") {
        d = d.maxNumberOfClient;
        u = u.thresholdNoOfClients;
      } else {
        d = d.maxHitRatio;
        u = u.thresholdHitRatio;
      }
      this.setState({ data: { d, u } });
    });
  }

  descriptionModal() {
    this.setState({ descriptionModal: true });
  }

  closeModal() {
    this.setState({
      descriptionModal: false,
      notificationModal: false,
      blink: true
    });
    this.setState({ notify: 0 });
  }

  componentWillReceiveProps(props) {
    this.setState({notify: props.notify});
}

  render() {
    const { heading } = this.props;
      return (
      <div className="card-container">
        {this.state.notificationModal && this.state.data !== null && (
          <NotificationComponent
            visible={this.state.notificationModal}
            heading={heading}
            data={this.state.data}
            closeModal={this.closeModal}
            changeConf={this.state.notify}
          />
        )}
        {this.state.descriptionModal && (
          <DescriptionModalComponent
            visible={this.state.descriptionModal}
            heading={heading}
            closeModal={this.closeModal}
          />
        )}
        <div className="card-top">
          <h3>{this.props.heading}</h3>
          <div className="buttons">
            <div className="notification" onClick={this.descriptionModal}>
              <img src={description} alt="alert" />
            </div>
            <div className="notification" onClick={this.notificationModal}>
            {this.blinkbutton(this.state.notify) && <img src={alert_on} alt="alert" />}
            </div>
          </div>
        </div>
        <div>
          <hr />
        </div>
        <div className="graph">
          {heading === "Performance Matrix" ? (
            <ChangeValue />
          ) : heading === "Memory Matrix" ? (
            <MemoryChart />
          ) : heading === "Number Of Clients Matrix" ? (
            <ClientChart />
          ) : (
            <HitRatioChart />
          )}
        </div>
      </div>
    );
  }
}

export default MatrixCardComponent;
