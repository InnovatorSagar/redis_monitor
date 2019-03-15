import React, { Component } from 'react';
import Filler from '../FillerComponent/FillerComponent';
import './ProgressBarComponent.css';

class ProgressBarComponent extends Component {
    render() {
        const { percentage } = this.props;
        let percentag = percentage;
        let lessthan80 = true;
        let morethan80 = false;
        if(percentag > 80) {
            morethan80 = true;
            lessthan80 = false;
        }
        if(percentag > 100) {
            percentag = 100;
        }
        let percent = 460*(percentag/100);
        return (
            <div className="progress-bar">
                {lessthan80 && <Filler percentage={percent} color="blue" />}
                {morethan80 && <Filler percentage={percent} color="red" />}
            </div>
        )
    }
}

export default ProgressBarComponent;