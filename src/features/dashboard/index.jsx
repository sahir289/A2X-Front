import DashboardStats from "./components/DashboardStats";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import { useDispatch } from "react-redux";
import BarChart from "./components/BarChart";
import DashboardTopBar from "./components/DashboardTopBar";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useEffect, useRef, useState } from "react";
import { getApi } from "../../redux/api";
import { showNotification } from "../../redux/slice/headerSlice";
import {
  calculateISTDateRange,
  formatCurrency,
  formatDateToISTString,
} from "../../utils/utils";
import MerchantCodeSelectBox from "./components/MerchantCodeSelectBox";
import { Button } from "antd";

dayjs.extend(utc);
dayjs.extend(timezone);

// Set default timezone globally to IST
dayjs.tz.setDefault("Asia/Kolkata");

function Dashboard() {
  const [selectedMerchantCode, setSelectedMerchantCode] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
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
      title: "Lien",
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
  const [includeSubMerchant, setIncludeSubMerchant] = useState(false);

  const nowUTC = new Date();
  const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
  const nowIST = new Date(nowUTC.getTime() + istOffset);

  const year = nowIST.getUTCFullYear();
  const month = nowIST.getUTCMonth();
  const date = nowIST.getUTCDate();

  const startIST = new Date(Date.UTC(year, month, date, 0, 0, 0, 0)); // 12:00 AM IST
  const endIST = new Date(Date.UTC(year, month, date, 23, 59, 59, 999)); // 11:59 PM IST

  const adjustedISTStartDate = new Date(startIST.getTime() - istOffset);
  const adjustedISTEndDate = new Date(endIST.getTime() - istOffset);

  const [dateRange, setDateRange] = useState({
    startDate: adjustedISTStartDate,
    endDate: adjustedISTEndDate,
  });

  useEffect(() => {
    const { startUTC, endUTC } = calculateISTDateRange();

    setDateRange({
      startDate: formatDateToISTString(startUTC),
      endDate: formatDateToISTString(endUTC),
    });
  }, []);

  const dispatch = useDispatch();
  const debounceRef = useRef();

  const hasFetchedData = useRef(false); // Track if fetch has been done already

  useEffect(() => {
    // Check if fetch has already been done
    if (!hasFetchedData.current && selectedMerchantCode.length > 0) {
      fetchPayInDataMerchant();
      fetchPayInDataMerchantAllStatus();

      hasFetchedData.current = true; // Set it to true after the initial fetch
    }
  }, [selectedMerchantCode, dateRange, includeSubMerchant])

  const updateDashboardPeriod = (newRange, intervalValue) => {
    const startDate = newRange.startDate;
    const endDate = newRange.endDate;

    const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;

    const adjustedStartDate = new Date(startDate.getTime() - istOffset);
    const adjustedEndDate = new Date(endDate.getTime() - istOffset);

    setDateRange({
      startDate: formatDateToISTString(adjustedStartDate),
      endDate: formatDateToISTString(adjustedEndDate),
    });

    setIntervalDeposit(intervalValue);
    setIntervalWithdraw(intervalValue);

    dispatch(
      showNotification({
        message: `Period updated to ${startDate.toDateString()} to ${adjustedEndDate.toDateString()}`,
        status: 1,
      })
    );
  };

  const fetchPayInDataMerchant = async () => {
    try {
      setAddLoading(true);
      let query = selectedMerchantCode
        .map((code) => "merchantCode=" + encodeURIComponent(code))
        .join("&");

      let apidata = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        includeSubMerchant
      }
      const payInOutData = await getApi(
        `/get-payInDataMerchant?${query}`,
        apidata,
      );
      let data = {
        includeSubMerchant
      }
      const netBalance = await getApi(
        `/get-merchants-net-balance?${query}`,
        data,
      );

      if (netBalance.error) {
        setAddLoading(false);
        return;
      }

      if (payInOutData.error) {
        setAddLoading(false);
        return;
      }
   

      const netBalanceAmount = netBalance?.data?.data?.totalNetBalance;

      const payInData = payInOutData?.data?.data?.payInOutData?.payInData;
      const payOutData = payInOutData?.data?.data?.payInOutData?.payOutData;
      const reversePayOutData =
        payInOutData?.data?.data?.payInOutData?.reversedPayOutData;
      const settlementData =
        payInOutData?.data?.data?.payInOutData?.settlementData;
      const lienData = payInOutData?.data?.data?.payInOutData?.lienData;

      setDepositData(payInData);
      setWithdrawData(payOutData);

      let payInAmount = 0;
      let payInCommission = 0;
      let payInCount = 0;
      let payOutAmount = 0;
      let payOutCommission = 0;
      let reversePayOutAmount = 0;
      let reversePayOutCommission = 0;
      let payOutCount = 0;
      let settlementAmount = 0;
      let lienAmount = 0;

      payInData?.forEach((data) => {
        payInAmount += Number(data.confirmed);
        payInCommission += Number(data.payin_commission);
        payInCount += 1;
      });

      payOutData?.forEach((data) => {
        payOutAmount += Number(data.amount);
        payOutCommission += Number(data.payout_commision); // name changed to handle the spelling err.
        payOutCount += 1;
      });

      reversePayOutData?.forEach((data) => {
        reversePayOutAmount += Number(data.amount);
        reversePayOutCommission += Number(data.payout_commision); // name changed to handle the spelling err.
      });

      settlementData?.forEach((data) => {
        settlementAmount += Number(data.amount);
      });

      lienData?.forEach((data) => {
        lienAmount += Number(data.amount);
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
          title: "Reversed Withdraw",
          value: reversePayOutAmount,
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
          value: payInCommission + payOutCommission - reversePayOutCommission,
          icon: <UserGroupIcon className="w-8 h-8" />,
        },
        {
          title: "Settlement",
          value: settlementAmount,
          icon: <UserGroupIcon className="w-8 h-8" />,
        },
        {
          title: "Lien",
          value: lienAmount,
          icon: <UserGroupIcon className="w-8 h-8" />,
        },
        {
          title: "Net Balance",
          // FORMULA (NET BALANCE = DEPOSIT - (WITHDRAWAL + COMMISSION(BOTH PAYIN COMMISION + PAYOUT COMMISSION)) - SETTLEMENT)
          value:
            payInAmount -
            payOutAmount -
            (payInCommission + payOutCommission - reversePayOutCommission) -
            settlementAmount -
            lienAmount +
            reversePayOutAmount,
          icon: <UserGroupIcon className="w-8 h-8" />,
        },
        {
          title: "Total Net Balance",
          value: netBalanceAmount,
          icon: <UserGroupIcon className="w-8 h-8" />,
        },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setAddLoading(false);
    }
  };



  const fetchPayInDataMerchantAllStatus = async () => {
    try {
      setAddLoading(true);
      let query = selectedMerchantCode
        .map((code) => "merchantCode=" + encodeURIComponent(code))
        .join("&");

      let apidata = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        includeSubMerchant
      }
      const payInOutDataAllStatus = await getApi(
        `/get-payInDataMerchant-allStatus?${query}`,
        apidata,
      );

      
      let data = {
        includeSubMerchant
      }
      const netBalance = await getApi(
        `/get-merchants-net-balance?${query}`,
        data,
      );

      if (netBalance.error) {
        setAddLoading(false);
        return;
      }

      if (payInOutDataAllStatus.error) {
        setAddLoading(false);
        return;
      }
 

      
    } catch (error) {
      console.log(error);
    } finally {
      setAddLoading(false);
    }
  };







  return (
    <>
      {/* <div className="flex justify-end">
        <Button
          className={addLoading ? "mr-5 hover:bg-slate-300 bg-green-500" : "mr-5 hover:bg-slate-300"}
          icon={<Reload />}
          onClick={fetchPayInDataMerchant}
        />
      </div> */}
      {/*------------------------ Merchant Code --------------------------------- */}
      <MerchantCodeSelectBox
        selectedMerchantCode={selectedMerchantCode}
        setSelectedMerchantCode={setSelectedMerchantCode}
        setIncludeSubMerchantFlag={setIncludeSubMerchant}
      />

      {/** ---------------------- Different stats content 1 ------------------------- */}
      <div className="grid lg:grid-cols-2 mt-4 md:grid-cols-1 grid-cols-1 gap-6">
        <div className="grid grid-row-1 md:grid-cols-2 gap-6">
          {payInOutData.map((data, index) => {
            return (
              data.title !== "Commission" &&
              data.title !== "Net Balance" &&
              data.title !== "Settlement" &&
              data.title !== "Lien" &&
              data.title !== "Reversed Withdraw" &&
              data.title !== "Total Net Balance" && (
                <DashboardStats key={index} {...data} colorIndex={index} />
              )
            );
          })}
        </div>
        {/** ---------------------- Select Period Content ------------------------- */}
        <div className="grid grid-row-1">
          <DashboardTopBar
            updateDashboardPeriod={updateDashboardPeriod}
            selectedMerchantCode={selectedMerchantCode}
            dateValue={dateRange}
          />
          <Button type='primary'
            loading={addLoading}
            htmlType='submit'
            onClick={fetchPayInDataMerchant}
          >
            Search
          </Button>
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
                    {data.title === "Reversed Withdraw" && (
                      <div className="flex justify-between">
                        <p>Reversed Withdraw</p>
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
                    {data.title === "Lien" && (
                      <div className="flex justify-between">
                        <p>ChargeBack</p>
                        <p className="font-bold">
                          {formatCurrency(data.value)}
                        </p>
                      </div>
                    )}
                    {data.title === "Net Balance" && (
                      <>
                        <br />
                        <div className="flex justify-between text-xl">
                          <p className="font-bold">Current Balance</p>
                          <p className="font-bold">
                            {formatCurrency(data.value)}
                          </p>
                        </div>
                      </>
                    )}
                    {data.title === "Total Net Balance" && (
                      <>
                        <br />
                        <div
                          className="flex justify-between text-4xl"
                          style={{ color: "cornflowerblue" }}
                        >
                          <p className="font-bold">Net Balance</p>
                          <p className="font-bold">
                            {formatCurrency(data.value)}
                          </p>
                        </div>
                      </>
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
