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

function BarChart({
  title,
  data,
  interval,
  setInterval,
  dateRange,
  setDateRange,
}) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ label: "", data: [], backgroundColor: "" }],
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const options = {
    responsive: true,
    plugins: {
      legend: {
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

  const getDateRangeLabels = (startDate, endDate, interval) => {
    const result = [];
    const currentDate = new Date(startDate);

    if (
      interval === "12h" ||
      startDate.toISOString().split("T")[0] ===
      endDate.toISOString().split("T")[0]
    ) {
      // If the interval is "12h" or the start and end dates are the same, create hourly labels
      const hoursInterval = interval === "12h" ? 1 : 2; // 1-hour intervals for 12h and 2-hour intervals for the same date
      const hoursToShow = interval === "12h" ? 12 : 24;

      for (let i = 0; i < hoursToShow; i++) {
        const date = new Date(startDate);
        date.setHours(date.getHours() - (hoursToShow - 1 - i) * hoursInterval);
        result.push(date.toISOString());
      }
    } else {
      // Create daily labels
      while (currentDate <= endDate) {
        result.push(new Date(currentDate).toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return result;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours || 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const labels = getDateRangeLabels(
    dateRange.startDate,
    dateRange.endDate,
    interval
  ).map((date) => {
    if (
      interval === "12h" ||
      dateRange.startDate.toISOString().split("T")[0] ===
      dateRange.endDate.toISOString().split("T")[0]
    ) {
      return formatTime(date); // Format time as human-readable
    }
    return date;
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const currentData = labels.map((date) => {
        let dayData;
        if (
          interval === "12h" ||
          dateRange.startDate.toISOString().split("T")[0] ===
          dateRange.endDate.toISOString().split("T")[0]
        ) {
          dayData = data.filter(
            (item) =>
              new Date(item.updatedAt).getHours() ===
              new Date(date).getHours() &&
              new Date(item.updatedAt).toISOString().split("T")[0] ===
              new Date(date).toISOString().split("T")[0]
          );
        } else {
          dayData = data.filter(
            (item) => item.updatedAt.split("T")[0] === date
          );
        }
        const total = dayData.reduce(
          (sum, item) => sum + parseFloat(item.amount),
          0
        );
        return { total, count: dayData.length };
      });

      const amounts = currentData.map((item) => item.total);
      const counts = currentData.reduce((sum, item) => sum + item.count, 0);

      setChartData({
        labels,
        datasets: [
          {
            label: "Amount",
            data: amounts,
            backgroundColor: "rgba(53, 162, 235, 1)",
          },
        ],
      });

      setTotalAmount(amounts.reduce((sum, item) => sum + item, 0));
      setTotalCount(counts);
    } else {
      setChartData({
        labels,
        datasets: [
          {
            label: "Amount",
            data: Array(labels.length).fill(0),
            backgroundColor: "rgba(53, 162, 235, 1)",
          },
        ],
      });
      setTotalAmount(0);
      setTotalCount(0);
    }
  }, [data, interval, dateRange]);

  const onChange = (e) => {
    setInterval(e.target.value);
    if (e.target.value === "15d") {
      setDateRange({
        startDate: new Date(new Date().setDate(new Date().getDate() - 15)),
        endDate: new Date(),
      });
    } else if (e.target.value === "7d") {
      setDateRange({
        startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
        endDate: new Date(),
      });
    }
  };

  return (
    <TitleCard
      title={
        <div className="flex justify-between">
          <h4 className="text-lg font-semibold">{title}</h4>
          <p className="text-sm text-gray-500">
            {formatCurrency(totalAmount)}
            <br />
            Amount
          </p>
          <p className="text-sm text-gray-500">
            {totalCount}
            <br />
            Count
          </p>
        </div>
      }
    >
      <Flex vertical gap="middle" className="mb-2">
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          onChange={onChange}
          defaultValue={interval}
          value={interval}
        >
          <Radio.Button value="15d">15D</Radio.Button>
          <Radio.Button value="7d">7D</Radio.Button>
          <Radio.Button value="12h">12H</Radio.Button>
        </Radio.Group>
      </Flex>
      <Bar options={options} data={chartData} height="30px" width="100%" />
    </TitleCard>
  );
}

export default BarChart;
