import React, { Component } from "react";
import HitRatio from "./HitRatio";
import "../Chart.css";
import { socket } from "../../index";

class HitRatioChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lineChartData: {
        labels: [],
        datasets: [
          {
            type: "line",
            label: "Hit-Ratio",
            borderColor: "#00BFFF",
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
        }
      },
      height: 160,
      memory: null
    };
  }
  change(d) {
    this.setState(prevState => ({
      memory: d
    }));
  }

  componentDidMount() {
    socket.on("info", data => {
      let hitRatio = data.metrics.keySpaceHit/(data.metrics.keySpaceHit + data.metrics.keySpaceMiss);
      if(isNaN(hitRatio)) {
        hitRatio = 0;
      }
      this.change(hitRatio);
      this.setState({ percentage: this.state.memory });
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
        Hit-Ratio: {this.state.memory}
        <HitRatio
          data={this.state.lineChartData}
          options={this.state.lineChartOptions}
          height={this.state.height}
        />
      </div>
    );
  }
}

export default HitRatioChart;
