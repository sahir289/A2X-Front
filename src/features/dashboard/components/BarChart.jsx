import { Flex, Radio } from "antd";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import TitleCard from "../../../components/Cards/TitleCard";
import { formatCurrency } from "../../../utils/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarChart({ title, data }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ label: "", data: [], backgroundColor: "" }],
  });
  const [interval, setInterval] = useState("15d");
  const options = {
    responsive: true,
    plugins: {
      legend: {
        // position: "top",
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (data) {
            return formatCurrency(data.raw);
          },
        },
      },
    },
  };

  const getLastIntervals = (interval) => {
    const result = [];
    const now = new Date();

    switch (interval) {
      case "15d":
        for (let i = 14; i >= 0; i--) {
          const date = new Date();
          date.setDate(now.getDate() - i);
          result.push(date.toISOString().split("T")[0]);
        }
        break;

      case "7d":
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(now.getDate() - i);
          result.push(date.toISOString().split("T")[0]);
        }
        break;

      case "12h":
        for (let i = 11; i >= 0; i--) {
          const date = new Date();
          date.setHours(now.getHours() - i);
          result.push(date.toISOString());
        }
        break;

      default:
        throw new Error("Unsupported interval");
    }

    return result;
  };

  const labels = getLastIntervals(interval);

  useEffect(() => {
    if (data && data.length > 0) {
      const currentData = labels.map((date) => {
        let dayData;
        if (interval === "12h") {
          dayData = data.filter((item) => item.updatedAt === date);
        } else {
          dayData = data.filter(
            (item) => item.updatedAt.split("T")[0] === date
          );
        }
        const total = dayData.reduce(
          (sum, item) => sum + parseFloat(item.amount),
          0
        );

        return total;
      });

      setChartData({
        labels,
        datasets: [
          {
            label: "Amount",
            data: currentData,
            backgroundColor: "rgba(53, 162, 235, 1)",
          },
        ],
      });
    } else {
      setChartData({
        labels,
        datasets: [
          {
            label: "Amount",
            data: Array(labels.length).fill(0), // Ensure there is data for each label
            backgroundColor: "rgba(53, 162, 235, 1)",
          },
        ],
      });
    }
  }, [data, interval]);

  const onChange = (e) => {
    setInterval(e.target.value);
  };

  return (
    <TitleCard
      title={
        <div className="flex justify-between">
          <h4 className="text-lg font-semibold">{title}</h4>
          <p className="text-sm text-gray-500">
            {formatCurrency(
              data.reduce((sum, item) => sum + parseFloat(item.amount), 0)
            )}
            <br />
            Amount
          </p>
          <p className="text-sm text-gray-500">
            {data.length}
            <br />
            Count
          </p>
        </div>
      }
    >
      <Flex vertical gap="middle" className="mb-2">
        <Radio.Group onChange={onChange} defaultValue="15d">
          <Radio.Button value="15d">15D</Radio.Button>
          <Radio.Button value="7d">7D</Radio.Button>
          <Radio.Button value="12h">12H</Radio.Button>
        </Radio.Group>
      </Flex>
      <Bar options={options} data={chartData} />
    </TitleCard>
  );
}

export default BarChart;
