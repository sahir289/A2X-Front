import DashboardStats from "./components/DashboardStats";

import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import { useDispatch } from "react-redux";
import BarChart from "./components/BarChart";
import DashboardTopBar from "./components/DashboardTopBar";
// import {showNotification} from ''
import { useEffect, useRef, useState } from "react";
import { getApi } from "../../redux/api";
import { showNotification } from "../../redux/slice/headerSlice";
import { formatCurrency } from "../../utils/utils";
import MerchantCodeSelectBox from "./components/MerchantCodeSelectBox";
import dayjs from "dayjs";

function Dashboard() {
  const [selectedMerchantCode, setSelectedMerchantCode] = useState([]);
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
  const [intervalDeposit, setIntervalDeposit] = useState("24h");
  const [intervalWithdraw, setIntervalWithdraw] = useState("24h");
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().add(0, "day").startOf("day"),
    endDate: dayjs().add(0, "day").endOf("day"),
  });
  const dispatch = useDispatch();
  const debounceRef = useRef();

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchPayInDataMerchant, 400);
  }, [selectedMerchantCode, dateRange]);

  const updateDashboardPeriod = (newRange) => {
    setDateRange({
      startDate: newRange.startDate,
      endDate: newRange.endDate,
    });
    setIntervalDeposit("");
    setIntervalWithdraw("");
    dispatch(
      showNotification({
        message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`,
        status: 1,
      })
    );
  };

  const fetchPayInDataMerchant = async () => {
    try {
      let query = selectedMerchantCode
        .map((code) => "merchantCode=" + encodeURIComponent(code))
        .join("&");

      const payInOutData = await getApi(
        `/get-payInDataMerchant?${query}`,
        dateRange
      );
      if (payInOutData.error) {
        return;
      }

      const payInData = payInOutData?.data?.data?.payInOutData?.payInData;
      const payOutData = payInOutData?.data?.data?.payInOutData?.payOutData;
      const settlementData =
        payInOutData?.data?.data?.payInOutData?.settlementData;

      setDepositData(payInData);
      setWithdrawData(payOutData);

      let payInAmount = 0;
      let payInCommission = 0;
      let payInCount = 0;
      let payOutAmount = 0;
      let payOutCommission = 0;
      let payOutCount = 0;
      let settlementAmount = 0;

      payInData?.forEach((data) => {
        payInAmount += Number(data.amount);
        payInCommission += Number(data.payin_commission);
        payInCount += 1;
      });

      payOutData?.forEach((data) => {
        payOutAmount += Number(data.amount);
        payOutCommission += Number(data.payout_commision); // name changed to handle the spelling err.
        payOutCount += 1;
      });

      settlementData?.forEach((data) => {
        settlementAmount += Number(data.amount);
      });

      setPayInOutData([
        {
          title: "Deposit",
          value: payInAmount,
          icon: <UserGroupIcon className="w-8 h-8" />,
          count: payInCount,
        },
        {
          title: "Deposit %",
          value: payInCommission,
          icon: <UserGroupIcon className="w-8 h-8" />,
        },
        {
          title: "Withdraw",
          value: payOutAmount,
          icon: <UserGroupIcon className="w-8 h-8" />,
          count: payOutCount,
        },
        {
          title: "Withdraw %",
          value: payOutCommission,
          icon: <UserGroupIcon className="w-8 h-8" />,
        },
        {
          title: "Commission",
          value: payInCommission + payOutCommission,
          icon: <UserGroupIcon className="w-8 h-8" />,
        },
        {
          title: "Settlement",
          value: settlementAmount,
          icon: <UserGroupIcon className="w-8 h-8" />,
        },
        {
          title: "Net Balance",
          // FORMULA (NET BALANCE = DEPOSIT - (WITHDRAWAL + COMMISSION(BOTH PAYIN COMMISION + PAYOUT COMMISSION)) - SETTLEMENT)
          value:
            payInAmount -
            (payOutAmount + (payInCommission + payOutCommission)) -
            settlementAmount,
          icon: <UserGroupIcon className="w-8 h-8" />,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/*------------------------ Merchant Code --------------------------------- */}
      <MerchantCodeSelectBox
        selectedMerchantCode={selectedMerchantCode}
        setSelectedMerchantCode={setSelectedMerchantCode}
      />

      {/** ---------------------- Different stats content 1 ------------------------- */}
      <div className="grid lg:grid-cols-2 mt-4 md:grid-cols-1 grid-cols-1 gap-6">
        <div className="grid grid-row-1 md:grid-cols-2 gap-6">
          {payInOutData.map((data, index) => {
            return (
              data.title !== "Commission" &&
              data.title !== "Net Balance" &&
              data.title !== "Settlement" && (
                <DashboardStats key={index} {...data} colorIndex={index} />
              )
            );
          })}
        </div>
        {/** ---------------------- Select Period Content ------------------------- */}
        <div className="grid grid-row-1">
          <DashboardTopBar
            updateDashboardPeriod={updateDashboardPeriod}
            dateValue={dateRange}
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
        interval={intervalDeposit}
        setInterval={setIntervalDeposit}
        currentCateRange={dateRange}
      />
      <BarChart
        title={`Withdraw`}
        data={withdrawData}
        interval={intervalWithdraw}
        setInterval={setIntervalWithdraw}
        currentCateRange={dateRange}
      />
    </>
  );
}

export default Dashboard;
