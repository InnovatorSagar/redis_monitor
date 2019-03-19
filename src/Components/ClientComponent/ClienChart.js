import React, { Component } from "react";
import Client from "./Client";
import "../Chart.css";
import { socket } from "../../index";
import DetailChart from "../DetailedChart/DetailedChart";


class ClientChart extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      values: [],
      val:[],
      redirect:false,
      lineChartData: {
        labels: [],
        datasets: [
          {
            type: "line",
            label: "Number of Clients of System",
            borderColor: "orange",
            borderWidth: "2",
            lineTension: 0.45,
            data: []
          }
        ]
      },
      lineChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                min: 0
              }
            }
          ]
        },
    },
    height: 160,
    memory: null
  };
}
  handleClick = () =>{
    const val = [...this.state.values];
    this.setState({ val: val});
    this.setState({ redirect: true});
  }
  handleClose = () =>{
    this.setState({ redirect: false});
  }
  change(d, u) {
    this.setState(prevState => ({
      max: u,
      memory: d,
    }));
  }
  componentDidMount() {
    socket.on("info", data => {
      this.change(data.metrics.numberOfClient, data.metrics);
      this.state.values.push(data.metrics.numberOfClient);
      const oldDataSet = this.state.lineChartData.datasets[0];
      const newDataSet = { ...oldDataSet };
      newDataSet.data.push(this.state.memory);
      if (newDataSet.data.length % 8 === 0) {
        newDataSet.data.shift();
      }
      const newChartData = {
        ...this.state.lineChartData,
        datasets: [newDataSet],
        labels: this.state.lineChartData.labels.concat(
          new Date().toLocaleTimeString()
        )
      };
      if (newChartData.labels.length % 8 === 0) {
        newChartData.labels.shift();
      }
      this.setState({ lineChartData: newChartData });
    });
  }

  render() {
    return (
      <div className="chart_size">
        Number of Clients: {this.state.memory}
        <Client
          data={this.state.lineChartData}
          options={this.state.lineChartOptions}
          height={this.state.height}
        />
        <button onClick={this.handleClick}>Press</button>
        {this.state.redirect && <DetailChart values={this.state.val} />}
        <button onClick={this.handleClose}>Close</button> 
      </div>
    );
  }
}

export default ClientChart;
