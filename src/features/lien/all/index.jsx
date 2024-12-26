import { useEffect, useState, useContext } from "react";
import { getApi } from "../../../redux/api";
import TableComponent from "../components/Table";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";

function All() {
  const [tableData, setTableData] = useState([]);
  const userData = useContext(PermissionContext)
  const [filterValues, setFilterValues] = useState({
    sno: "",
    merchantCode: `${userData?.code || ""}`,
    merchant_order_id: "",
    user_id: "",
    amount: "",
    page: 1,
    pageSize: 20,
  });
  const [isFetchBanksLoading, setIsFetchBanksLoading] = useState(false);

  useEffect(() => {
    fetchUsersData();
  }, [filterValues]);

  const fetchUsersData = async () => {
    setIsFetchBanksLoading(true);
    const lienMessage = await getApi("/get-lien", filterValues);
    setIsFetchBanksLoading(false);
    if (lienMessage.error) {

      return;
    }
    setTableData(lienMessage?.data?.data);
  };

  return (
    <div className="">
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
