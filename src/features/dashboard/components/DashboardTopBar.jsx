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

function DashboardTopBar({ updateDashboardPeriod, dateValue }) {
  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      let startDate = new Date(dateStrings[0]);
      startDate.setHours(0, 0, 0, 0)
      let endDate = new Date(dateStrings[1]);
      endDate.setHours(23, 59, 59, 999);
      const newRange = {
        startDate: startDate,
        endDate: endDate,
      };
      console.log("🚀 ~ onRangeChange ~ newRange:", newRange)
      updateDashboardPeriod(newRange);
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
        {/* <Datepicker
                containerClassName="w-64 "
                value={dateValue}
                theme={"light"}
                inputClassName="input input-bordered w-72"
                popoverDirection={"down"}
                toggleClassName="invisible"
                onChange={handleDatePickerValueChange}
                showShortcuts={true}
                primaryColor={"white"}

            /> */}
        {/* <SelectBox
                options={periodOptions}
                labelTitle="Period"
                placeholder="Select date range"
                containerStyle="w-72"
                labelStyle="hidden"
                defaultValue="TODAY"
                updateFormValue={updateSelectBoxValue}
            /> */}
      </div>
      {/* <div className="text-right ">
                <button className="btn btn-ghost btn-sm normal-case"><ArrowPathIcon className="w-4 mr-2"/>Refresh Data</button>
                <button className="btn btn-ghost btn-sm normal-case  ml-2"><ShareIcon className="w-4 mr-2"/>Share</button>

                <div className="dropdown dropdown-bottom dropdown-end  ml-2">
                    <label tabIndex={0} className="btn btn-ghost btn-sm normal-case btn-square "><EllipsisVerticalIcon className="w-5"/></label>
                    <ul tabIndex={0} className="dropdown-content menu menu-compact  p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a><EnvelopeIcon className="w-4"/>Email Digests</a></li>
                        <li><a><ArrowDownTrayIcon className="w-4"/>Download</a></li>
                    </ul>
                </div>
            </div> */}
    </div>
  );
}

export default DashboardTopBar;
