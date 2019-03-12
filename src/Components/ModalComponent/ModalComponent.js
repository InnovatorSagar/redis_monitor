import React, { Component } from "react";
import Modal from "react-awesome-modal";
import { Link } from "react-router-dom";
import "./ModalComponent.css";

class ModalComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true
    };
  }

  openModal() {
    this.setState({ visible: true });
  }

  closeModal() {
    this.setState({ visible: false });
  }

  render() {
    return (
      <section>
        <Modal
          visible={this.state.visible}
          width="600"
          height="200"
          effect="fadeInUp"
        >
          <h1>ENTER REDIS-SERVER CONFIGURATION!!</h1>
          <hr />
          <p className="modalmssg">
            Please Enter Configuration of <strong>REDIS-SERVER</strong> you want
            to monitor!!
          </p>
          <Link to="/Configure">
            <button
              type="submit"
              className="continuebutton"
              onClick={() => this.closeModal()}
            >
              Let's Set Configuration.
            </button>
          </Link>
        </Modal>
      </section>
    );
  }
}

export default ModalComponent;
