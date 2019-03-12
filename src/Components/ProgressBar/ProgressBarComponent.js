import React, { Component } from 'react';
import Filler from '../FillerComponent/FillerComponent';
import './ProgressBarComponent.css';

class ProgressBarComponent extends Component {
    render() {
        const { percentage } = this.props;
        let percent = 460*(percentage/100);
        return (
            <div className="progress-bar">
              <Filler percentage={percent} />
            </div>
        )
    }
}

export default ProgressBarComponent;