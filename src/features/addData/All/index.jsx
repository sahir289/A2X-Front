import { useEffect, useState, useContext } from "react";
import { getApi } from "../../../redux/api";
import TableComponent from "../components/Table";
import WebSockets from "../../../components/WebSockets/WebSockets";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";

function All() {
  const [tableData, setTableData] = useState([]);
  const userData = useContext(PermissionContext)
  const [filterValues, setFilterValues] = useState({
    loggedInUserRole: userData.role,
    sno: "",
    status: "/success",
    amount: "",
    amount_code: "",
    utr: "",
    bankName:"",
    page: 1,
    pageSize: 20,
  });
  const [isFetchBanksLoading, setIsFetchBanksLoading] = useState(false);

  useEffect(() => {
    fetchUsersData();
  }, [filterValues]);

  const fetchUsersData = async () => {
    setIsFetchBanksLoading(true);
    const botMessage = await getApi("/get-message", filterValues);
    setIsFetchBanksLoading(false);
    if (botMessage.error) {

      return;
    }
    setTableData(botMessage?.data?.data);
  };

  return (
    <div className="">
      <WebSockets fetchUsersData={fetchUsersData} /> {/*  to get the message from backend when the api is hit. */}
      <TableComponent
        data={tableData}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        isFetchBanksLoading={isFetchBanksLoading}
      />
    </div>
  );
}

export default All;
