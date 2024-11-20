import { DatePicker } from "antd";
import { useSelector } from "react-redux";
import React, { useContext } from "react";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

const rangePresets = [
  {
    label: "Today",
    value: [
      dayjs().startOf("day"),
      dayjs().endOf("day"),
    ],
  },
  {
    label: "Yesterday",
    value: [
      dayjs().subtract(1, "day").startOf("day"),
      dayjs().subtract(1, "day").endOf("day"),
    ],
  },
  {
    label: "Last 7 days",
    value: [
      dayjs().subtract(7, "day"),
      dayjs().endOf("day"),
    ],
  },
  {
    label: "Last 15 days",
    value: [
      dayjs().subtract(15, "day"),
      dayjs().endOf("day"),
    ],
  },
  {
    label: "Last 30 days",
    value: [
      dayjs().subtract(30, "day"),
      dayjs().endOf("day"),
    ],
  },
  {
    label: "This Month",
    value: [
      dayjs().startOf("month"),
      dayjs().endOf("month"),
    ],
  },
  {
    label: "Last Month",
    value: [
      dayjs().subtract(1, "month").startOf("month"),
      dayjs().subtract(1, "month").endOf("month"),
    ],
  },
];

function DashboardTopBar({ updateDashboardPeriod, dateValue, selectedMerchantCode }) {
  const userData = useContext(PermissionContext);
  const merchantData = useSelector((state) => state.merchant.data);
  const merchantOptions = merchantData
    ?.filter(
      (merchant) =>
        (!merchant.is_deleted && !userData?.code?.length) ||
        userData?.code.includes(merchant.code)
    )

  if (selectedMerchantCode.length === 1) {
    const merchant = merchantOptions.find(option => option.code === selectedMerchantCode[0])
    console.log(merchant)
  }

  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      const startDate = dayjs(dates[0])
        .utc()
        .add(5, 'hour')
        .add(30, 'minute')
        .startOf("day")
        .toDate();
      const endDate = dayjs(dates[1])
        .utc()
        .add(5, 'hour')
        .add(30, 'minute')
        .endOf("day")
        .toDate();


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
          defaultValue={[
            dayjs(dateValue.startDate).utc().add(5, 'hour').add(30, 'minute'),
            dayjs(dateValue.endDate).utc().add(5, 'hour').add(30, 'minute'),
          ]}
          presets={rangePresets}
          onChange={onRangeChange}
          disabledDate={(current) => {
            const today = dayjs().endOf("day"); // End of today
            if (selectedMerchantCode.length === 1) {
              const merchant = merchantOptions.find(option => option.code === selectedMerchantCode[0])
              const minDate = dayjs(merchant.createdAt).utc().add(5, 'hour').add(30, 'minute'); // Replace with your minimum date
              return (
                current && (current.isBefore(minDate, "day") && current.isAfter(today))
              );
            }
            else {
              return (
                current && (current.isAfter(today))
              );
            }
          }}
        />
      </div>
    </div>
  );
}

export default DashboardTopBar;
