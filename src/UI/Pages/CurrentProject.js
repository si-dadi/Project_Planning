import React from "react";
import { PieChart } from "react-minimal-pie-chart";

class Project extends React.Component {
  formatIndianCost(cost) {
    const formattedCost = cost.toLocaleString("en-IN");
    return formattedCost;
  }
  render() {
    const { project } = this.props;
    const { id, name, progress, daysLeft, totalCost } = project;

    const chartData = [
      { value: progress, color: "#3E82F7" },
      { value: 100 - progress, color: "#E4E7EB" },
    ];

    // Determine the color class for daysLeft
    const daysLeftColorClass = daysLeft < 3 ? "bg-red-400" : "bg-green-400";

    return (
      <div className="flex flex-row items-center bg-white rounded-lg shadow-md p-4 m-2">
        <div className="flex items-center justify-center">
          {/* Pie Chart */}
          <div style={{ width: "50px", height: "50px" }}>
            <PieChart
              data={chartData}
              totalValue={100}
              lineWidth={20}
              label={({}) => `${chartData[0].value}%`}
              labelStyle={{
                fontSize: "28px",
                fontWeight: "bold",
                fill: "#333333",
              }}
              labelPosition={0}
              animate={true}
            />
          </div>
        </div>
        <div className="flex-1 text-left flex flex-col ml-4">
          <h1 className=" text-base font-semibold">{name}</h1>
          <p className="text-slate-500 text-sm">{`Total Cost: Rs. ${this.formatIndianCost(totalCost)}`}</p>
        </div>
        <div className={`ml-auto text-xs px-3 py-1 rounded ${daysLeftColorClass}`}>
          <p>{`${daysLeft} ${daysLeft > 1 ? "days" : "day"} left`}</p>
        </div>
      </div>
    );
  }
}

export default Project;
