import React, { Component } from 'react';
import './FillerComponent.css';

class Filler extends Component {
    render() { 
        const { percentage } = this.props;
        console.log(percentage);
        return (
            <div className="filler" style={{ width: percentage }} />
        )
    }
}

export default Filler;