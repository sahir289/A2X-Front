import { DatePicker } from "antd";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

const rangePresets = [
  {
    label: "Today",
    value: [
      dayjs().add(0, "day").startOf("day"),
      dayjs().add(0, "day").endOf("day"),
    ],
  },
  {
    label: "Yesterday",
    value: [
      dayjs().add(-1, "day").startOf("day"),
      dayjs().add(-1, "day").endOf("day"),
    ],
  },
  {
    label: "Last 7 days",
    value: [dayjs().add(-7, "d"), dayjs().endOf("day")],
  },
  {
    label: "Last 30 days",
    value: [dayjs().add(-30, "d"), dayjs().endOf("day")],
  },
  {
    label: "This Month",
    value: [dayjs().startOf("month"), dayjs().endOf("month")],
  },
  {
    label: "Last Month",
    value: [
      dayjs().add(-1, "month").startOf("month"),
      dayjs().add(-1, "month").endOf("month"),
    ],
  },
];

function VendorBoardTopBar({ updateVendorBoardPeriod, dateValue }) {
  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      let startDate = new Date(dateStrings[0]);
      let endDate = new Date(dateStrings[1]);
      endDate.setHours(23, 59, 59, 999);
      const newRange = {
        startDate: startDate,
        endDate: endDate,
      };
      updateVendorBoardPeriod(newRange);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="">
        <RangePicker
          className="w-72 h-12"
          defaultValue={[dateValue.startDate, dateValue.endDate]}
          presets={rangePresets}
          onChange={onRangeChange}
        />
      </div>
    </div>
  );
}

export default VendorBoardTopBar;
