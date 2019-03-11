import React, { Component } from "react";
import Performance from "./Performance";
import { connect } from "react-redux";
import { fetchNewData, set } from "../../actions/dataActions";
import { socket } from "../../index";

class ChangeValue extends Component {
  componentDidMount() {
    socket.on("info", data => {
      this.props.fetchNewData(data);
      const oldBtcDataSet = this.props.lineChartData.datasets[0];
      const newBtcDataSet = { ...oldBtcDataSet };
      newBtcDataSet.data.push(this.props.performanceData);
      if (newBtcDataSet.data.length % 8 === 0) {
        newBtcDataSet.data.shift();
      }

      const newChartData = {
        ...this.props.lineChartData,
        datasets: [newBtcDataSet],
        labels: this.props.lineChartData.labels.concat(
          new Date().toLocaleTimeString()
        )
      };
      if (newChartData.labels.length % 8 === 0) {
        newChartData.labels.shift();
      }
      this.props.set(newChartData);
    });
  }

  render() {
    return (
      <div className="chart_size">
        CPU Performance: {this.props.performanceData}
        <Performance
          data={this.props.lineChartData}
          options={this.props.lineChartOptions}
          height={this.props.height}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  performanceData: state.data.performanceData,
  lineChartData: state.data.lineChartData,
  lineChartOptions: state.data.lineChartOptions,
  height: state.data.height
});

export default connect(
  mapStateToProps,
  { fetchNewData, set }
)(ChangeValue);
