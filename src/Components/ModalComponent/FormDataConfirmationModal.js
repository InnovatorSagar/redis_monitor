import React, { Component } from "react";
import Modal from "react-awesome-modal";
import { Link } from "react-router-dom";
import "./ModalComponent.css";
import FeedComponent from "../FeedComponent/FeedComponent";

class FormDataConfirmationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      redirect: false
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({ redirect: true });
    this.props.closeModal();
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

    const { visible, closeModal, sentData, master_slave_array } = this.props;

    if (this.state.redirect) {
      console.log("loading feeecomponent with ", master_slave_array);
      return <FeedComponent master_slave_array={master_slave_array} />;
    }
    return (
      <section>
        <Modal visible={visible} width="600" height="200" effect="fadeInUp">
          <h1>{heading}</h1>
          <hr />
          <p className="modalmssg">{content}</p>
          {sentData && (
            <button
              type="submit"
              className="continuebutton"
              onClick={this.onClick}
            >
              {button}
            </button>
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
