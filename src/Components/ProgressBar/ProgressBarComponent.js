import React, { Component } from "react";
import Filler from "../FillerComponent/FillerComponent";
import "./ProgressBarComponent.css";

class ProgressBarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      percentag: this.props.percentage
    };
  }

  render() {
    let morethan80,lessthan80,perc;
    perc = this.state.percentag;
    if(perc < 80) {
      lessthan80 = true;
    }
    else if(this.state.percentag >=80) {
      morethan80 = true;
      lessthan80 = false;
      if(perc > 100) {
        perc = 100;
      }
    }

    let percent = 460 * (perc / 100);
    return (
      <div className="progress-bar">
        {lessthan80 && <Filler percentage={percent} color="blue"/>}
        {morethan80 && <Filler percentage={percent} color="red"/>}
      </div>
    );
  }
}

export default ProgressBarComponent;