import { useContext, useEffect, useState } from "react";
import { getApi, putApi } from "../../../redux/api";
import TableComponent from "../components/Table";
import { useNavigate } from "react-router-dom";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";

function All() {
  const [tableData, setTableData] = useState([]);
  const userData = useContext(PermissionContext)
  const [filterValues, setFilterValues] = useState({
    ac_name: "",
    ac_no: "",
    upi_id: "",
    createdBy:`${userData?.userId}`,
    role:`${userData?.role}`,
    page: 1,
    pageSize: 20,
  });
  const [isFetchBanksLoading, setIsFetchBanksLoading] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    fetchBankData();
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
    setIsFetchBanksLoading(true);
    const BankApiRes = await putApi("/update-bank-states", {
      id: data.id,
      fieldName: data.fieldName,
      value: data.value,
    });
    setIsFetchBanksLoading(false);
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
