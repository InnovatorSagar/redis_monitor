import React, { Component } from "react";
import Modal from "react-awesome-modal";
import DetailChart from "../DetailedChart/DetailedChart";
import "./DetailChart.css";

class DetailChartModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true
    };
  }
  render() {
    const { visible, closeModal, heading } = this.props;
    return (
      <section>
        <Modal visible={visible} width="1290" height="600" effect="fadeInUp">
          <DetailChart heading={heading} />
          <button type="submit" className="continuebutton" onClick={closeModal}>
            Continue to Dashboard.
          </button>
        </Modal>
      </section>
    );
  }
}

export default DetailChartModal;
