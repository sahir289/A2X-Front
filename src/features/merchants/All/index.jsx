import { useEffect, useState } from "react";
import { getApi } from "../../../redux/api";
import TableComponent from "../components/Table";

function All() {
  const [tableData, setTableData] = useState([]);
  const [filterValues, setFilterValues] = useState({
    page: 1,
    pageSize: 20,
  });
  const [isFetchBanksLoading, setIsFetchBanksLoading] = useState(false);

  useEffect(() => {
    fetchUsersData();
  }, [filterValues]);

  const fetchUsersData = async () => {
    setIsFetchBanksLoading(true);
    const backAccount = await getApi("/getall-merchant", filterValues);
    setIsFetchBanksLoading(false);
    if (backAccount.error) {
      return;
    }
    setTableData(backAccount?.data?.data);
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
