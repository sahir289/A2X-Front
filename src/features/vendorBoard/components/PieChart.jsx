import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React from "react";
import { Pie } from "react-chartjs-2";
import TitleCard from "../../../components/Cards/TitleCard";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ pieValues, title }) => {
  // Labels for the pie chart (e.g., ["SUCCESS", "REJECTED", "INITIAL", "REVERSED"])
    const labels = pieValues.map((item) => item.title);
    const data = pieValues.map((item)=>item.value)
  // Assuming data is an array of arrays where each inner array contains two values
  // const data = [
  //   [1, 2],     // First item: [1, 2]
  //   [33, 40],   // Second item: [33, 40]
  //   [60, 70],   // Third item: [60, 70]
  //   [80, 90]    // Fourth item: [80, 90]
  // ];
  // console.log(data)
  // console.log(labels);
  const generateColors = (num) => {
    const colors = [];
    const baseColors = [
      "#32CD32", // Green
      "#36A2EB", // Blue
      "#FF0000", // Red
      "#FFCE56", // Yellow
      "#4BC0C0", // Teal
      "#9966FF", // Purple
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
      "#F0E68C", // Khaki
    ];

    for (let i = 0; i < num; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  };

  const logScaleData = data.map(item => {
    const value = item?.[1];
    return value > 100 ? Math.log10(value) : value;
  });


  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "",
        data: logScaleData,
        backgroundColor: generateColors(data.length),
        borderWidth: 0
      },
    ],
  };


  // Options for the pie chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "left",
      },
      tooltip: {
        backgroundColor: "#333", // Dark background
        borderColor: "#fff", // White border
        borderWidth: 1, // Border width
        titleFont: {
          family: "'Arial', sans-serif", // Title font
          size: 14, // Title font size
          weight: 'bold', // Title font weight
          color: '#fff', // Title font color
        },
        bodyFont: {
          family: "'Arial', sans-serif", // Body font
          size: 12, // Body font size
          color: '#fff', // Body font color
        },
        padding: 10, // Padding inside the tooltip
        caretSize: 8, // Size of the arrow/caret pointing to the chart
        displayColors: false,
        callbacks: {
          label: function (context) {
            const currentIndex = context.dataIndex;
            const firstValue = data[currentIndex][0];
            const thirdValue = data[currentIndex][2];
            const secondValue = context.raw;
            if(thirdValue!=undefined){
             if(title=="Deposit Status"){
              return `Manual : ${(firstValue)}, RazorPay : ${(secondValue)}, Ratio : ${(thirdValue)}%`;
             }
             else{
              return `Manual : ${(firstValue)}, Eko : ${(secondValue)}, Ratio : ${(thirdValue)}%`;
             }
            }
            else{
              if(title=="Deposit Status"){
                return `Manual : ${(firstValue)}, RazorPay : ${(secondValue)}`;
               }
               else{
                return `Manual : ${(firstValue)}, Eko : ${(secondValue)}`;
               }
            }
          },
        },
      },
    },
  };

  // Generate colors for pie chart segments

  return (
    <TitleCard title={title}>
      <div className="h-[400px] w-full max-w-[500px] mx-auto">
        <Pie data={chartData} options={options} />
      </div>
    </TitleCard>
  );
};

export default PieChart;
