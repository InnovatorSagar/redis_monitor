import React, { Component } from "react";
import Filler from "../FillerComponent/FillerComponent";
import "./ProgressBarComponent.css";

class ProgressBarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lessthan80: true,
      morethan80: false
    };
  }

  render() {
    const { percentage } = this.props;
    let percentag = percentage;
    if (percentag > 80 && percentag <= 100) {
      this.setState({ morethan80: true });
    } else if (percentag > 100) {
      percentag = 100;
    }
    let percent = 460 * (percentag / 100);
    return (
      <div className="progress-bar">
        {this.state.lessthan80 && <Filler percentage={percent} />}
        {this.state.morethan80 && <Filler percentage={percent} />}
      </div>
    );
  }
}

export default ProgressBarComponent;
