import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

class DetailChart extends Component {
  constructor(props) {
      super(props);
      this.state = {
          values: this.props.values
      }
  }

  componentDidMount() {
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.paddingRight = 20;
    let dataforchart = [];
    let fdates = new Date(2018,11,24,0,0,0,0);
    let len = this.state.values.length;
    console.log("length of array", len);
    for (let i = 1; i < len; i++) {
    let ndate = new Date(fdates);
    ndate.setSeconds(i);
    dataforchart.push({ date: ndate, value: this.state.values[i] });
    }

    chart.data = dataforchart;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = {
      "timeUnit": "second",
      "count": 1
    };

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    dateAxis.title.text = "TIME";
    valueAxis.renderer.minWidth = 35;

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";

    series.tooltipText = "{valueY.value}";
     series.fillOpacity = 0.3;
    chart.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    this.chart = chart;
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    console.log(this.state);
    return (
      <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
    );
  }
}

export default DetailChart;