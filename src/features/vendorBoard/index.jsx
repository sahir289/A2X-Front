import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import { Button } from "antd";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { PermissionContext } from "../../components/AuthLayout/AuthLayout";
import { getApi } from "../../redux/api";
import { showNotification } from "../../redux/slice/headerSlice";
import { calculateISTDateRange, formatCurrency, formatDateToISTString } from "../../utils/utils";
// import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import VendorBoardStats from "./components/VendorBoardStats";
import VendorBoardTopBar from "./components/VendorBoardTopBar";
import VendorCodeSelectBox from "./components/VendorCodeSelectBox";
dayjs.extend(utc);
dayjs.extend(timezone);

// Set default timezone globally to IST
dayjs.tz.setDefault("Asia/Kolkata");

function VendorBoard() {
  const context = useContext(PermissionContext);

  const [selectedVendorCode, setSelectedVendorCode] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
  const [pieData,setpieData]=useState([]);
  const [statusData,setStatusData] = useState([]);
  const [statusDataPayout,setStatusDataPayout] = useState([]);
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
    const fetchData = async () => {
      if (context?.role === "VENDOR" || context?.role === "VENDOR_OPERATIONS") {
        const user = await getApi("/getall-users", { userName: context.userName });
        setSelectedVendorCode([user?.data?.data?.users.filter(user => user.userName === context.userName)[0].vendor_code]);
      }
    };

    fetchData();
  }, [context?.role]);

  useEffect(() => {
    // Check if fetch has already been done
    if (!hasFetchedData.current && selectedVendorCode.length > 0) {
      fetchPayInDataVendor();
      hasFetchedData.current = true; // Set it to true after the initial fetch
    }
  }, [selectedVendorCode, dateRange]);


  const updateVendorBoardPeriod = (newRange, intervalValue) => {
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

  const fetchPayInDataVendor = async () => {
    try {
      setAddLoading(true);
      const currentVendorCode = [`${context?.vendorCode}`];
      let query = "";
      if (
        (context?.role && context?.role.toLowerCase() === "admin") ||
        (context?.role && context?.role.toLowerCase() === "operations") ||
        (context?.role && context?.role.toLowerCase() === "transactions") ||
        (context?.role &&
          context?.role.toLowerCase() === "merchant" &&
          context?.vendorCode === null)
      ) {
        query = selectedVendorCode
          .map((code) => "vendorCode=" + encodeURIComponent(code))
          .join("&");
      } else if (
        (context?.role && context?.role.toLowerCase() === "vendor") ||
        (context?.role &&
          context?.role.toLowerCase() === "vendor_operations") ||
        (context?.role &&
          context?.role.toLowerCase() === "merchant" &&
          context?.vendorCode !== null)
      ) {
        query = currentVendorCode
          .map((code) => "vendorCode=" + encodeURIComponent(code))
          .join("&");
      }

      const payInOutData = await getApi(
        `/get-payInDataVendor?${query}`,
        dateRange
      );
      const payInOutDataAll = await getApi(
        `/get-payInDataVendorALL?${query}`,
        dateRange
      );
    //  console.log(payInOutData?.data?.data?.payInOutData?.payOutData)
    const countMethodsForSuccessPayin = (data) => {
      let SuccessManual = 0;
      let SuccessOnline = 0;
      let RejectCount = 0;
      let PendingCount = 0;
      let FailedCount = 0;
      let AssignedCount = 0;
      let DroppedCount = 0;
      let DisputeCount = 0;
      let DuplicateCount = 0;
     let Bank_Mismatch = 0;

      data?.forEach((item) => {

          switch (item.status) {
              case "SUCCESS":
                  if (item.method === null) {
                      SuccessManual++;
                  } else {
                    console.log(item.method)
                      SuccessOnline++;
                  }
                  break;
              case "PENDING":
                  PendingCount++;
                  break;
              case "REJECTED":
                  RejectCount++;
                  break;
              case "FAILED":
                  FailedCount++;
                  break;
              case "ASSIGNED":
                  AssignedCount++;
                  break;
              case "DROPPED":
                  DroppedCount++;
                  break;
              case "DISPUTE":
                  DisputeCount++;
                  break;
              case "DUPLICATE":
                  DuplicateCount++;
                  break;
              case "BANK_MISMATCH":
                Bank_Mismatch++;
                break;
              default:
                  break;
          }
      });

      return {
          SuccessManual,
          SuccessOnline,
          RejectCount,
          PendingCount,
          FailedCount,
          AssignedCount,
          DroppedCount,
          DisputeCount,
          DuplicateCount,
          Bank_Mismatch,
      };
  };
 const countMethodsForSuccessPayout = (data) => {
      let SuccessManual = 0;
      let SuccessOnline = 0;
      let RejectCount = 0;
     let IntialCount = 0;
      data?.forEach((item) => {

          switch (item.status) {
              case "SUCCESS":
                  if (item.method === null) {
                      SuccessManual++;
                  } else {
                      SuccessOnline++;
                  }
                  break;
              case "REJECTED":
                  RejectCount++;
                  break;
              case "INITIAL":
                  IntialCount++;
                  break;
              default:
                  break;
          }
      });

      return {
          SuccessManual,
          SuccessOnline,
          RejectCount,
         IntialCount
      };
  };
// Example usage:
      const payInResults = countMethodsForSuccessPayin(payInOutDataAll?.data?.data?.payInOutData?.payInData || []);
      const payOutResults = countMethodsForSuccessPayout(payInOutDataAll?.data?.data?.payInOutData?.payOutData || []);
      setStatusDataPayout([
        {
          title: "Success By Manual",
          value: payOutResults.SuccessManual,
        },
        {
          title: "Success By Eko",
          value: payOutResults.SuccessOnline,
        },
        {
          title: "Rejected",
          value: payOutResults.RejectCount,
        },
        {
          title: "Status Initial",
          value: payOutResults.IntialCount,
        }
      ]);



      setStatusData([
        {
          title: "Success By Manual",
          value: payInResults.SuccessManual,
        },
        {
          title: "Success By RazorPay",
          value: payInResults.SuccessOnline,
        },
        {
          title: "Status Pending",
          value: payInResults.PendingCount,
        },
        {
          title: "Status Failed",
          value: payInResults.FailedCount,
        },
        {
          title: "Status Reject",
          value: payInResults.RejectCount,
        },
        {
          title: "Status Assigned",
          value: payInResults.AssignedCount,
        },
        {
          title: "Bank Mis_Match",
          value: payInResults.Bank_Mismatch,
        },
        {
          title: "Duplicate",
          value: payInResults.DuplicateCount,
        },
        {
          title: "Dispute",
          value: payInResults.DisputeCount,
        },
        {
          title: "Dropped",
          value: payInResults.DroppedCount,
        }
      ]);

      // Console logging the values
      console.log("PayIn - Null Method Count:", payInResults.Bank_Mismatch);


      const netBalance = await getApi(`/get-vendors-net-balance?${query}`);

      if (payInOutData.error) {
        setAddLoading(false);
        return;
      }

      let netBalanceAmount = netBalance?.data?.data;

      const payInData = payInOutData?.data?.data?.payInOutData?.payInData;
      const payOutData = payInOutData?.data?.data?.payInOutData?.payOutData;
      const reversePayOutData = payInOutData?.data?.data?.payInOutData?.reversedPayOutData;
      const settlementData = payInOutData?.data?.data?.payInOutData?.settlementData;
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
        payInAmount += Number(data.amount);
        payInCommission += Number(0);
        payInCount += 1;
      });

      payOutData?.forEach((data) => {
        payOutAmount += Number(data.amount);
        payOutCommission += Number(0); // name changed to handle the spelling err.
        payOutCount += 1;
      });


      reversePayOutData?.forEach((data) => {
        reversePayOutAmount += Number(data.amount);
        reversePayOutCommission += Number(0); // name changed to handle the spelling err.
      });

      settlementData?.forEach((data) => {
        settlementAmount += Number(data.amount);
      });

      lienData?.forEach((data) => {
        lienAmount += Number(0);
      });

      let currentBalance = payInAmount - payOutAmount - (payInCommission + payOutCommission - reversePayOutCommission) + settlementAmount + reversePayOutAmount - lienAmount

      setPayInOutData([
        {
          title: "Deposit",
          value: payInAmount,
          icon: <UserGroupIcon className="w-8 h-8" />,
          count: payInCount,
        },
        {
          title: "Deposit %",
          value: 0,
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
          value: 0,
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
          value: 0,
          icon: <UserGroupIcon className="w-8 h-8" />,
        },
        {
          title: "Net Balance",
          // FORMULA (NET BALANCE = DEPOSIT - (WITHDRAWAL + COMMISSION(BOTH PAYIN COMMISION + PAYOUT COMMISSION)) - SETTLEMENT)
          value: currentBalance *= -1,
          icon: <UserGroupIcon className="w-8 h-8" />,
        },
        {
          title: "Total Net Balance",
          value: netBalanceAmount *= -1,
          icon: <UserGroupIcon className="w-8 h-8" />,
        },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setAddLoading(false);
    }
  };
 // Function to set the pie data

useEffect(() => {
  setpieData(payInOutData.filter(item =>
    ["Deposit","Withdraw","Reversed Withdraw","Settlement","Lien","Net Balance","Total Net Balance"].includes(item.title)
  ));
}, [payInOutData]);
// console.log(pieData,"this is piedata values");


  return (
    <>
      {/* {!(context?.role=="VENDOR" || context?.role=="VENDOR_OPERATIONS" ) */}
      {!(context?.role === "VENDOR" || context?.role === "VENDOR_OPERATIONS") && (
        <VendorCodeSelectBox
          selectedVendorCode={selectedVendorCode}
          setSelectedVendorCode={setSelectedVendorCode}
        />
      )}

      <div className="grid lg:grid-cols-2 mt-4  md:grid-cols-1 grid-cols-1 gap-6">
        <div className="grid grid-row-1 md:grid-cols-2 gap-6">
          {payInOutData.map((data, index) => {
            return (
              data.title !== "Commission" &&
              data.title !== "Net Balance" &&
              data.title !== "Lien" &&
              data.title !== "Reversed Withdraw" &&
              data.title !== "Settlement" &&
              data.title !== "Total Net Balance" && (
                <VendorBoardStats key={index} {...data} colorIndex={index} />
              )
            );
          })}
        </div>

        <div className="grid grid-row-1 ">
          <VendorBoardTopBar
            updateVendorBoardPeriod={updateVendorBoardPeriod}
            dateValue={dateRange}
          />
          <Button type='primary'
            loading={addLoading}
            htmlType='submit'
            onClick={fetchPayInDataVendor}
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
                          {formatCurrency(0)}
                        </p>
                      </div>
                    )}
                    {data.title === "Settlement" && (
                      <div className="flex justify-between">
                        <p>Vendor Settlement</p>
                        <p className="font-bold">
                          {formatCurrency(data.value)}
                        </p>
                      </div>
                    )}
                    {data.title === "Lien" && (
                      <div className="flex justify-between">
                        <p className="font-bold">ChargeBack</p>
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
                        <div className="flex justify-between text-4xl" style={{ color: "cornflowerblue" }}>
                          <p className="font-bold" >Net Balance</p>
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

      {/* <BarChart
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
      /> */}
<PieChart pieValues={pieData} title="Transactions Overview" />
<div className="flex flex-col md:flex-row justify-between space-y-6 md:space-y-0 md:space-x-6">
  <div className="w-full md:w-1/2">
  <PieChart pieValues={statusDataPayout} title="Withdraw Status" />
  </div>
  <div className="w-full md:w-1/2">
    <PieChart pieValues={statusData} title="Deposit Status" />
  </div>
</div>
    </>
  );
}

export default VendorBoard;
