import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Modal from "react-awesome-modal";
import ProgressBarComponent from "../ProgressBar/ProgressBarComponent";
import "./NotificationComponent.css";

class NotificationComponent extends Component {
  render() {
    const { visible, closeModal, heading, data, changeConf } = this.props;
    console.log("Data foudn is ", data);
    var percentage, message;
    console.log("Inside render of notification");
    if (heading === "Performance Matrix") {
      console.log("in perforamnce", data);
      percentage = parseInt((data.d / data.u) * 100);
      message = `Your CPU Performance has reached ${
        data.d
      }units i.e., ${percentage}% of your provided value : ${data.u}units.`;
    } else if (heading === "Memory Matrix") {
      percentage = parseInt((data.d / data.u) * 100);
      message = `Your Memory usage has reached ${
        data.d
      }KB i.e., ${percentage}% of your provided value: ${data.u}KB.`;
    } else if (this.props.heading === "Number Of Clients Matrix") {
      percentage = parseInt((data.d / data.u) * 100);
      message = `Number of Clients on your REDIS-SERVER has reached ${
        data.d
      } i.e., ${percentage}% of your provided value: ${data.u}.`;
    } else {
      percentage = parseInt((data.d / data.u) * 100);
      message = `Hit-Ratio on your redis has reached ${
        data.d
      } i.e., ${percentage}% of your provided value: ${data.u}.`;
    }
    return (
      <section>
        <Modal visible={visible} width="500" height="270" effect="fadeInUp">
          <div className="notification-container">
            <h1>{heading}</h1>
            <hr />
            <p>{message}</p>
            <ProgressBarComponent percentage={percentage} />
            <section>
            <button className="close-btn" onClick={closeModal}>
              Close
            </button>
            {changeConf===1 && <Link to="/Configure"><button className="config-btn">Change Configuration</button></Link>}
            </section>
          </div>
        </Modal>
      </section>
    );
  }
}

export default NotificationComponent;
