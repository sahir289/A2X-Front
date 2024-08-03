import { useEffect, useState } from "react";
import { getApi } from "../../../redux/api";
import TableComponent from "../components/Table";

function All() {
  const [tableData, setTableData] = useState([]);
  const [filterValues, setFilterValues] = useState({
    page: 1,
    pageSize: 10,
  });
  const [isFetchBanksLoading, setIsFetchBanksLoading] = useState(false);

  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    setIsFetchBanksLoading(true);
    try {
      const backAccount = await getApi("/getall-merchant", filterValues);

      console.log("first", backAccount);
      setTableData(backAccount?.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetchBanksLoading(false);
    }
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
