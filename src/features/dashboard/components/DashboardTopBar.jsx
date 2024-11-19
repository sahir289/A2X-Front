import { DatePicker } from "antd";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

const rangePresets = [
  {
    label: "Today",
    value: [
      dayjs().tz("Asia/Kolkata").startOf("day"),
      dayjs().tz("Asia/Kolkata").endOf("day"),
    ],
  },
  {
    label: "Yesterday",
    value: [
      dayjs().tz("Asia/Kolkata").subtract(1, "day").startOf("day"),
      dayjs().tz("Asia/Kolkata").subtract(1, "day").endOf("day"),
    ],
  },
  {
    label: "Last 7 days",
    value: [
      dayjs().tz("Asia/Kolkata").subtract(7, "day"),
      dayjs().tz("Asia/Kolkata").endOf("day"),
    ],
  },
  {
    label: "Last 15 days",
    value: [
      dayjs().tz("Asia/Kolkata").subtract(15, "day"),
      dayjs().tz("Asia/Kolkata").endOf("day"),
    ],
  },
  {
    label: "Last 30 days",
    value: [
      dayjs().tz("Asia/Kolkata").subtract(30, "day"),
      dayjs().tz("Asia/Kolkata").endOf("day"),
    ],
  },
  {
    label: "This Month",
    value: [
      dayjs().tz("Asia/Kolkata").startOf("month"),
      dayjs().tz("Asia/Kolkata").endOf("month"),
    ],
  },
  {
    label: "Last Month",
    value: [
      dayjs().tz("Asia/Kolkata").subtract(1, "month").startOf("month"),
      dayjs().tz("Asia/Kolkata").subtract(1, "month").endOf("month"),
    ],
  },
];

function DashboardTopBar({ updateDashboardPeriod, dateValue }) {
  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      const startDate = dayjs(dates[0])
        .tz("Asia/Kolkata")
        .startOf("day")
        .toDate();
      const endDate = dayjs(dates[1]).tz("Asia/Kolkata").endOf("day").toDate();

      const selectedPreset = rangePresets.find(
        (preset) =>
          dayjs(dates[0]).isSame(preset.value[0], "day") &&
          dayjs(dates[1]).isSame(preset.value[1], "day")
      );

      const intervalMapping = {
        "Today": "24h",
        "Yesterday": "24h",
        "Last 7 days": "7d",
        "Last 15 days": "15d",
        "Last 30 days": "30d",
        "This Month": "30d",
        "Last Month": "30d"
      };

      const differenceInMs = endDate - startDate;
      const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
      const differenceInterval = differenceInDays === 1 ? "24h" : `${differenceInDays}d`

      const intervalValue = intervalMapping[selectedPreset?.label] || differenceInterval;


      const newRange = {
        startDate: startDate,
        endDate: endDate,
      };
      updateDashboardPeriod(newRange, intervalValue);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="">
        <RangePicker
          className="w-72 h-12"
          defaultValue={[dayjs(dateValue.startDate).tz("Asia/Kolkata"), dayjs(dateValue.endDate).tz("Asia/Kolkata")]}
          presets={rangePresets}
          onChange={onRangeChange}
          disabledDate={(current) =>
            current && current > new Date().setHours(23, 59, 59, 999)
          }
        />
      </div>
    </div>
  );
}

export default DashboardTopBar;
