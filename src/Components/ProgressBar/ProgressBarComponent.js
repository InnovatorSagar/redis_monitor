import React, { Component } from "react";
import Filler from "../FillerComponent/FillerComponent";
import "./ProgressBarComponent.css";

class ProgressBarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lessthan80: true,
      morethan80: false,
      percentag: this.props.percentage
    };
  }

  componentDidMount() {
    if (this.state.percentag > 80 && this.props.percentag <= 100) {
      this.setState({
        morethan80: true
      });
    } else if (this.state.percentag > 100) {
      this.setState({
        percentag: 100
      });
    }
  }

  render() {
    let percent = 460 * (this.state.percentag / 100);
    return (
      <div className="progress-bar">
        {this.state.lessthan80 && <Filler percentage={percent} />}
        {this.state.morethan80 && <Filler percentage={percent} />}
      </div>
    );
  }
}

export default ProgressBarComponent;
