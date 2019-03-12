import React, { Component } from "react";
import Memory from "./Memory";
import "../Chart.css";
import { socket } from "../../index";

class MemoryChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lineChartData: {
        labels: [],
        datasets: [
          {
            type: "line",
            label: "Memory of System",
            backgroundColor: ["blue"],
            borderWidth: "2",
            lineTension: 0.45,
            percentage: 0,
            data: []
          }
        ]
      },
      lineChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10
              }
            }
          ],
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
      memory: (d / (1024 * 1024) / 15.5) * 100
    }));
  }

  componentDidMount() {
    socket.on("info", data => {
      this.change(data.metrics.usedMemory);
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
        memory: {this.state.memory}
        <Memory
          data={this.state.lineChartData}
          options={this.state.lineChartOptions}
          height={this.state.height}
        />
      </div>
    );
  }
}

export default MemoryChart;
