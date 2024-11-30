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
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
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

dayjs.extend(utc);
dayjs.extend(timezone);

// Set default timezone globally to IST
dayjs.tz.setDefault("Asia/Kolkata");

function BarChart({ title, data, interval, setInterval, currentCateRange }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ label: "", data: [], backgroundColor: "" }],
  });
  const [istDateRange, setIstDateRange] = useState({
    startDate: dayjs().subtract(30, "day"),
    endDate: dayjs().endOf("day"),
  })

  const istStartDate = dayjs(istDateRange.startDate).isValid()
  ? dayjs(istDateRange.startDate).utc()
  : dayjs().subtract(30, "day").utc();

const istEndDate = dayjs(istDateRange.endDate).isValid()
  ? dayjs(istDateRange.endDate).utc()
  : dayjs().endOf("day").utc();

  const differenceInMs = istEndDate - istStartDate;
  const globalDifferenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

  const adjustedISTStartDate = istStartDate;
  const adjustedISTEndDate = dayjs(istEndDate).isValid()
  ? (globalDifferenceInDays === 1
      ? istEndDate
      : istEndDate.subtract(1, "day"))
  : dayjs().utc();


  const [dateRange, setDateRange] = useState({
    startDate: adjustedISTStartDate,
    endDate: adjustedISTEndDate,
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setDateRange(currentCateRange);
  }, [currentCateRange]);

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
        titleFont: {
          size: 16,
          weight: "bold",
        },
        bodyFont: {
          size: 14,
          weight: "bold",
        },
      },
    },
  };

  const getDateRangeLabels = (startDate, endDate, interval) => {
    const result = [];
    let currentDate = dayjs(startDate);

    if (interval === "24h" || dayjs(startDate).isSame(endDate, "day")) {
      const hoursInterval =
        interval === "24h" || dayjs(startDate).isSame(endDate, "day") ? 1 : 2;
      const hoursToShow = interval === "24h" ? 24 : 24;

      for (let i = 0; i < hoursToShow; i++) {
        result.push(
          dayjs(startDate)
            .add(i * hoursInterval, "hour")
            .toISOString()
        );
      }
    } else {
      while (
        currentDate.isBefore(endDate) ||
        currentDate.isSame(endDate, "day")
      ) {
        result.push(currentDate.format("YYYY-MM-DD"));
        currentDate = currentDate.add(1, "day");
      }
    }

    return result;
  };

  const formatTime = (dateString) => {
    const date = dayjs(dateString);
    let hours = date.hour();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:00 ${ampm}`;
  };

  const labels = getDateRangeLabels(
    dateRange.startDate,
    dateRange.endDate,
    interval
  ).map((date) => {
    if (
      interval === "24h" ||
      dayjs(dateRange.startDate).isSame(dateRange.endDate, "day")
    ) {
      return formatTime(date);
    }
    return date;
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const currentData = labels.map((date) => {
        let dayData;
        if (
          interval === "24" ||
          dayjs(dateRange.startDate).isSame(dateRange.endDate, "day")
        ) {
          dayData = data.filter(
            (item) =>
              dayjs(item.createdAt).startOf("hour").format("h:mm A") == date &&
              new Date(item.createdAt).getDate() ==
              new Date(dateRange.startDate).getDate()
          );
        } else {
          dayData = data.filter(
            (item) => dayjs(item.createdAt).format("YYYY-MM-DD") === date
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

    // const today = {
    //   startDate : dayjs().tz('Asia/Kolkata').startOf("day"),
    //   endDate : dayjs().tz('Asia/Kolkata').endOf("day"),
    // };

    const rangeMap = {
      "30d": { value: 30, unit: "day" },
      "15d": { value: 15, unit: "day" },
      "7d": { value: 7, unit: "day" },
      "24h": { value:0, unit: "day" },
    };

    const selectedRange = rangeMap[e.target.value];

    if (selectedRange === "24h") {
      setDateRange({
        startDate: dateRange.startDate.subtract(selectedRange.value, selectedRange.unit),
        endDate: dateRange.endDate.subtract(selectedRange.value, selectedRange.unit),
      });
    }
    else {
      setDateRange({
        startDate: dateRange.startDate.subtract(selectedRange.value, selectedRange.unit),
        endDate: dateRange.endDate,
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
          {/* <Radio.Button value="15d">15D</Radio.Button>
          <Radio.Button value="7d">7D</Radio.Button>
          <Radio.Button value="24h">24H</Radio.Button> */}
        </Radio.Group>
      </Flex>
      <Bar options={options} data={chartData} height="30px" width="100%" />
    </TitleCard>
  );
}

export default BarChart;
