import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React from "react";
import { Pie } from "react-chartjs-2";
import TitleCard from "../../../components/Cards/TitleCard";
import { formatCurrency } from "../../../utils/utils";
// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);
const PieChart = ({ pieValues ,title }) => {
  // console.log("pieValues:", pieValues);
const labels = pieValues.map((item) => item.title);
const data = pieValues.map((item) => item.value);
  // const data=[90,60,50,60,40,20,10];
  // console.log(data);
  // Debugging: Log the processed labels and data
  // console.log("labels:", labels);
  // console.log("data:", data);
  // Define the chart data
  const generateColors = (num) => {
    const colors = [];
    const baseColors = [
      "#FF6384", // Red
      "#36A2EB", // Blue
      "#FFCE56", // Yellow
      "#4BC0C0", // Teal
      "#9966FF", // Purple
      "#008000", // Green
      "#FF9F40", // Orange
      "#FFB6C1", // Light Pink
      "#FFD700", // Gold
      "#ADFF2F", // Green Yellow
      "#E6E6FA", // Lavender
      "#F08080", // Light Coral
      "#20B2AA", // Light Sea Green
      "#DDA0DD", // Plum
      "#98FB98", // Pale Green
      "#D3D3D3", // Light Gray
      "#F0E68C", 
    ];

  for (let i = 0; i < num; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "(₹)",
        data: data,
        backgroundColor: generateColors(data.length),
        borderWidth: 1,
      },
    ],
  };
  // console.log(chartData.datasets[0].data,"data in chart")
  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "left",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return title === "Transactions Overview"
              ? `  ${formatCurrency(context.raw)}`
              : ` Count: ${context.raw}`;
          },
        },
      },
    },
  };
  // console.log(options);
  return (
    <TitleCard title={title}>
     <div className="h-[400px] w-full max-w-[500px] mx-auto">
  <Pie data={chartData} options={options} />
</div>
    </TitleCard>
  );
};

export default PieChart;
