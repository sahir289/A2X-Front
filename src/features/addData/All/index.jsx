import { useEffect, useState } from "react";
import { getApi } from "../../../redux/api";
import TableComponent from "../components/Table";

function All() {
  const [tableData, setTableData] = useState([]);
  const [filterValues, setFilterValues] = useState({
    status: "",
    amount: "",
    amount_code: "",
    utr: "",
    page: 1,
    pageSize: 20,
  });
  const [isFetchBanksLoading, setIsFetchBanksLoading] = useState(false);

  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    setIsFetchBanksLoading(true);
    try {
      const botMessage = await getApi("/get-message", filterValues);

      console.log("first", botMessage);
      setTableData(botMessage?.data?.data);
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
