import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import { useDispatch } from "react-redux";
import BarChart from "./components/BarChart";
import VendorBoardStats from "./components/VendorBoardStats";
import VendorBoardTopBar from "./components/VendorBoardTopBar";
import { useEffect, useState } from "react";
import { showNotification } from "../../redux/slice/headerSlice";
import { formatCurrency } from "../../utils/utils";

function VendorBoard() {
  const [payInOutData, setPayInOutData] = useState([
    {
      title: "Deposit",
      value: 0,
      icon: <UserGroupIcon className="w-8 h-8" />,
      count: 0,
    },
    {
      title: "Deposit %",
      value: 0,
      icon: <UserGroupIcon className="w-8 h-8" />,
    },
    {
      title: "Withdraw",
      value: 0,
      icon: <UserGroupIcon className="w-8 h-8" />,
      count: 0,
    },
    {
      title: "Withdraw %",
      value: 0,
      icon: <UserGroupIcon className="w-8 h-8" />,
    },
    {
      title: "Commission",
      value: 0,
      icon: <UserGroupIcon className="w-8 h-8" />,
    },
    {
      title: "Settlement",
      value: 0,
      icon: <UserGroupIcon className="w-8 h-8" />,
    },
    {
      title: "Net Balance",
      // FORMULA (NET BALANCE = DEPOSIT - (WITHDRAWAL + COMMISSION(BOTH PAYIN COMMISION + PAYOUT COMMISSION)) - SETTLEMENT)
      value: 0,
      icon: <UserGroupIcon className="w-8 h-8" />,
    },
  ]);
  const [depositData, setDepositData] = useState([]);
  const [withdrawData, setWithdrawData] = useState([]);
  const [interval, setInterval] = useState("15d");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const dispatch = useDispatch();

  useEffect(() => {
    setDateRange({
      startDate: new Date(new Date().setDate(new Date().getDate() - 15)),
      endDate: new Date(),
    });
  }, []);

  const updateVendorBoardPeriod = (newRange) => {
    setDateRange({
      startDate: new Date(newRange.startDate),
      endDate: new Date(newRange.endDate),
    });
    setInterval("");
    dispatch(
      showNotification({
        message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`,
        status: 1,
      })
    );
  };

  return (
    <>
      <div className="grid lg:grid-cols-2 mt-4 md:grid-cols-1 grid-cols-1 gap-6">
        <div className="grid grid-row-1 md:grid-cols-2 gap-6">
          {payInOutData.map((data, index) => {
            return (
              data.title !== "Commission" &&
              data.title !== "Net Balance" &&
              data.title !== "Settlement" && (
                <VendorBoardStats key={index} {...data} colorIndex={index} />
              )
            );
          })}
        </div>

        <div className="grid grid-row-1">
          <VendorBoardTopBar
            updateVendorBoardPeriod={updateVendorBoardPeriod}
          />
          <div className="stats shadow col-span-2">
            <div className="stat">
              {payInOutData.map((data, index) => {
                return (
                  <div key={index}>
                    {data.title === "Deposit" && (
                      <div className="flex justify-between">
                        <p>Deposit</p>
                        <p className="font-bold">
                          {formatCurrency(data.value)}
                        </p>
                      </div>
                    )}
                    {data.title === "Withdraw" && (
                      <div className="flex justify-between">
                        <p>Withdraw</p>
                        <p className="font-bold">
                          {formatCurrency(data.value)}
                        </p>
                      </div>
                    )}
                    {data.title === "Commission" && (
                      <div className="flex justify-between">
                        <p>Commission</p>
                        <p className="font-bold">
                          {formatCurrency(data.value)}
                        </p>
                      </div>
                    )}
                    {data.title === "Settlement" && (
                      <div className="flex justify-between">
                        <p>Settlement</p>
                        <p className="font-bold">
                          {formatCurrency(data.value)}
                        </p>
                      </div>
                    )}
                    {data.title === "Net Balance" && (
                      <div className="flex justify-between">
                        <p>Net Balance</p>
                        <p className="font-bold">
                          {formatCurrency(data.value)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <BarChart
        title={`Deposit`}
        data={depositData}
        interval={interval}
        setInterval={setInterval}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <BarChart
        title={`Withdraw`}
        data={withdrawData}
        interval={interval}
        setInterval={setInterval}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
    </>
  );
}

export default VendorBoard;
