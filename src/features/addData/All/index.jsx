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

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const getData = setTimeout(() => {
      fetchUsersData();
    }, 1000);

    return () => clearTimeout(getData);
  }, [filterValues]);

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

  const handleOk = () => {
    setIsAddModalOpen(false);
  };

  const handleCancel = () => {
    setIsAddModalOpen(false);
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
