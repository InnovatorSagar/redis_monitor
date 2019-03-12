import React, { Component } from "react";
import Modal from "react-awesome-modal";
import { Link } from "react-router-dom";
import "./ModalComponent.css";

class FormDataConfirmationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true
    };
  }
  componentWillReceiveProps(newProps) {
    if (newProps.variableInProps === this.props.variableInProps) {
      this.setState({
        visible: newProps.visiblity
      });
    }
  }

  openModal() {
    this.setState({ visible: true });
  }

  render() {
    var heading = "CONFIGURATION LOGGED!!";
    var content =
      "Your Threshold Configuration has been successfully submitted!";
    var button = "Continue to Dashboard!";
    if (!this.props.sentData) {
      heading = "FAILED TO LOG YOUR CONFIGURATIONS!";
      content = "Something went wrong!! Please try again.";
      button = "Try again!";
    } else if (this.props.haveData) {
      heading = "CONFIGURATION UPDATED";
      content = " Your Threshold Configuration has been updated!!";
    }

    const { visible, closeModal, sentData } = this.props;

    return (
      <section>
        <Modal visible={visible} width="600" height="200" effect="fadeInUp">
          <h1>{heading}</h1>
          <hr />
          <p className="modalmssg">{content}</p>
          {sentData && (
            <Link to="/dashboard">
              <button
                type="submit"
                className="continuebutton"
                onClick={closeModal}
              >
                {button}
              </button>
            </Link>
          )}
          {!sentData && (
            <button
              type="submit"
              className="continuebutton"
              onClick={closeModal}
            >
              {button}
            </button>
          )}
        </Modal>
      </section>
    );
  }
}

export default FormDataConfirmationModal;
