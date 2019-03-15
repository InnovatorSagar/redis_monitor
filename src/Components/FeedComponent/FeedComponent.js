import React, { Component } from "react";
import HeaderComponent from '../HeaderComponent/HeaderComponent';
import { Redirect } from 'react-router-dom';
import './FeedComponent.css';

class FeedComponent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            noOfSlaves: 8,
            slaves: false,
            dashboard: false,
            arrofSlaves: []
        }
    }
    handleClick = () => {
        this.setState({ dashboard: true});
    }

    componentDidMount() {
        this.setState({ noOfSlaves: 8});
        var arr = [];
        let noOfSlaves = this.state.noOfSlaves;
        for(let i = 0; i < noOfSlaves; i++) {
            arr.push({ "host": "127.0.0.1",
                       "port": "6379"});
        }
        this.setState({ arrofSlaves: arr});
    }
    render() {
        if(this.state.dashboard) {
            return <Redirect to="/dashboard" />
        }
        return (
            <div className="feed-container">
               <HeaderComponent heading="Feed" />
               <h1>Welcome to Feed of the Redis Server</h1>
               <div className="feed-container-cardcontainer">
                    <div className="grid">
                        <div className="feed-card-cards" onClick={this.handleClick}>
                            <h3>Master</h3>
                            <hr />
                            <p>Host: 127.0.0.1</p>
                            <p>Port: 6379</p>
                        </div>
                    </div>
                    <hr />
                    <div className="slave-grid">
                    {this.state.arrofSlaves.map((res, index) => (
                        <div className="feed-card-cards" onClick={this.handleClick}>
                            <h3>Slave {index+1}</h3>
                            <hr />
                            <p>Host: {res.host}</p>
                            <p>Port: {res.port}</p>
                        </div>
                    ))}
                    </div>
               </div>
            </div>
        );
    }
}
export default FeedComponent;