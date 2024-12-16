import { useContext, useEffect, useState, useRef } from "react";
import { getApi, putApi } from "../../../redux/api";
import TableComponent from "../components/Table";
import { useNavigate } from "react-router-dom";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

function All() {
  const [tableData, setTableData] = useState([]);
  const userData = useContext(PermissionContext)


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

  const [filterValues, setFilterValues] = useState({
    ac_name: "",
    ac_no: "",
    upi_id: "",
    bank_used_for: "", // bank used for filtering
    role:`${userData?.role}`,
    vendor_code: `${userData?.vendorCode || ""}`,
    code: `${userData?.code || ""}`,
    startDate: adjustedISTStartDate,
    endDate: adjustedISTEndDate,
    page: 1,
    pageSize: 20,
  });
  const [isFetchBanksLoading, setIsFetchBanksLoading] = useState(false);
  const navigate = useNavigate()
  const debounceRef = useRef();

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchBankData, 400);
  }, [filterValues]);

  const fetchBankData = async () => {
    setIsFetchBanksLoading(true);
    const backAccount = await getApi("/getall-bank", filterValues);
    setIsFetchBanksLoading(false);
    if (backAccount.error?.error?.response?.status === 401) {
      NotificationManager.error(backAccount?.error?.message, 401);
      localStorage.clear();
      navigate('/')
    }

    setTableData(backAccount?.data?.data);
  };

  const handleStatusChange = async (data) => {
    // setIsFetchBanksLoading(true);
    const BankApiRes = await putApi("/update-bank-states", {
      id: data.id,
      fieldName: data.fieldName,
      value: data.value,
    });
    // setIsFetchBanksLoading(false);
    if (BankApiRes.error) {
      return;
    }
    fetchBankData();
  };

  return (
    <div className="">
      <TableComponent
        data={tableData}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        isFetchBanksLoading={isFetchBanksLoading}
        handleStatusChange={handleStatusChange}
      />
      <NotificationContainer />
    </div>
  );
}

export default All;
