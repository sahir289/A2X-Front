import DashboardStats from "./components/DashboardStats";

import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import { useDispatch } from "react-redux";
import BarChart from "./components/BarChart";
import DashboardTopBar from "./components/DashboardTopBar";
// import {showNotification} from ''
import { useEffect, useState } from "react";
import { getApi } from "../../redux/api";
import { showNotification } from "../../redux/slice/headerSlice";
import { formatCurrency } from "../../utils/utils";
import MerchantCodeSelectBox from "./components/MerchantCodeSelectBox";

const statsData = [
  {
    title: "New Users",
    value: "34.7k",
    icon: <UserGroupIcon className="w-8 h-8" />,
    description: "↗︎ 2300 (22%)",
  },
  // {
  //   title: "Total Sales",
  //   value: "$34,545",
  //   icon: <CreditCardIcon className="w-8 h-8" />,
  //   description: "Current month",
  // },
];

function Dashboard() {
  const [selectedMerchantCode, setSelectedMerchantCode] = useState("");
  const [payInOutData, setPayInOutData] = useState([]);
  const [depositData, setDepositData] = useState([]);
  const [withdrawData, setWithdrawData] = useState([]);
  const dispatch = useDispatch();

  const updateDashboardPeriod = (newRange) => {
    // Dashboard range changed, write code to refresh your values
    dispatch(
      showNotification({
        message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`,
        status: 1,
      })
    );
  };

  useEffect(() => {
    fetchPayInDataMerchant();
  }, [selectedMerchantCode]);

  const fetchPayInDataMerchant = async () => {
    try {
      const payInOutData = await getApi(
        `/get-payInDataMerchant?merchantCode=${selectedMerchantCode}`
      );

      const payInData = payInOutData?.data?.data?.payInOutData?.payInData;
      const payOutData = payInOutData?.data?.data?.payInOutData?.payOutData;
      const settlementData =
        payInOutData?.data?.data?.payInOutData?.settlementData;

      setDepositData(payInData);
      setWithdrawData(payOutData);

      let payInAmount = 0;
      let payInCommission = 0;
      let payIncount = 0;
      let payOutAmount = 0;
      let payOutCommission = 0;
      let payOutcount = 0;
      let settlementAmount = 0;

      payInData?.forEach((data) => {
        payInAmount += Number(data.amount);
        payInCommission += Number(data.payin_commission);
        payIncount += 1;
      });

      payOutData?.forEach((data) => {
        payOutAmount += Number(data.amount);
        payOutCommission += Number(data.payout_commission);
        payOutcount += 1;
      });

      settlementData?.forEach((data) => {
        settlementAmount += Number(data.amount);
      });

      setPayInOutData([
        {
          title: "Deposit",
          value: payInAmount,
          icon: <UserGroupIcon className="w-8 h-8" />,
          count: payIncount,
        },
        {
          title: "Deposit %",
          value: parseFloat(payInAmount * (payInCommission / 100)).toFixed(2),
          icon: <UserGroupIcon className="w-8 h-8" />,
        },
        {
          title: "Withdraw",
          value: payOutAmount,
          icon: <UserGroupIcon className="w-8 h-8" />,
          count: payOutcount,
        },
        {
          title: "Withdraw %",
          value: parseFloat(payOutAmount * (payOutCommission / 100)).toFixed(2),
          icon: <UserGroupIcon className="w-8 h-8" />,
        },
        {
          title: "Settlement",
          value: settlementAmount,
          icon: <UserGroupIcon className="w-8 h-8" />,
        },
        {
          title: "Net Balance",
          value: payInAmount - payOutAmount,
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
              data.title !== "Net Balance" &&
              data.title !== "Settlement" && (
                <DashboardStats key={index} {...data} colorIndex={index} />
              )
            );
          })}
        </div>
        {/** ---------------------- Select Period Content ------------------------- */}
        <div className="grid grid-row-1">
          <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod} />
          <div className="stats shadow col-span-2">
            <div className="stat">
              {payInOutData.map((data, index) => {
                return (
                  <div key={index}>
                    {data.title === "Deposit" && (
                      <div className="flex justify-between">
                        <p>Deposit</p>
                        <p>{formatCurrency(data.value)}</p>
                      </div>
                    )}
                    {data.title === "Withdraw" && (
                      <div className="flex justify-between">
                        <p>Withdraw</p>
                        <p>{formatCurrency(data.value)}</p>
                      </div>
                    )}
                    {data.title === "Withdraw %" && (
                      <div className="flex justify-between">
                        <p>Commission</p>
                        <p>{formatCurrency(data.value)}</p>
                      </div>
                    )}
                    {data.title === "Settlement" && (
                      <div className="flex justify-between">
                        <p>Settlement</p>
                        <p>{formatCurrency(data.value)}</p>
                      </div>
                    )}
                    {data.title === "Net Balance" && (
                      <div className="flex justify-between">
                        <p>Net Balance</p>
                        <p>{formatCurrency(data.value)}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/** ---------------------- Different charts ------------------------- */}
      <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
        {/* <LineChart /> */}
        <BarChart title={`Deposit`} data={depositData} />
        <BarChart title={`Withdraw`} data={withdrawData} />
      </div>

      {/** ---------------------- Different stats content 2 ------------------------- */}

      {/* <div className="grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6">
        <AmountStats />
        <PageStats />
      </div> */}

      {/** ---------------------- User source channels table  ------------------------- */}

      {/* <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
        <UserChannels />
        <DoughnutChart />
      </div> */}
    </>
  );
}

export default Dashboard;
