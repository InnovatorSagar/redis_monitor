import { NEW_DATA, SET_DATA } from "../actions/types";

const initialState = {
  lineChartData: {
    labels: [],
    datasets: [
      {
        type: "line",
        label: "Performance of System",
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
  height: 100,
  performanceData: 0,
  numberOfClients: 0,
  usedMemory: 0,
  totalMemory: 0,
  performanceFlag: false,
  memoryFlag: false,
  numberOfClientsFlag: false,
  usedMemoryFlag: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case NEW_DATA: {
      return {
        ...state,
        performanceData: action.payload.metrics.performanceData,
        usedMemory: action.payload.metrics.usedMemory,
        numberOfClients: action.payload.metrics.numberOfClients,
        totalMemory: action.payload.metrics.totalMemory,
        performanceFlag: action.payload.flags.performanceFlag,
        memoryFlag: action.payload.flags.memoryFlag,
        numberOfClientsFlag: action.payload.numberOfClientsFlag,
        usedMemoryFlag: action.payload.usedMemoryFlag
      };
    }
    case SET_DATA:
      return {
        ...state,
        lineChartData: action.payload
      };
    default:
      return state;
  }
}
