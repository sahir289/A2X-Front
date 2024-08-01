import { useEffect, useState } from "react";
import { getApi } from "../../../redux/api";
import TableComponent from "../components/Table";

function All() {
  const [tableData, setTableData] = useState([]);
  const [filterValues, setFilterValues] = useState({
    ac_name: "",
    ac_no: "",
    upi_id: "",
    page: 1,
    pageSize: 10,
  });
  const [isFetchBanksLoading, setIsFetchBanksLoading] = useState(false);

  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);

  useEffect(() => {
    const getData = setTimeout(() => {
      fetchUsersData();
    }, 1000);

    return () => clearTimeout(getData);
  }, [filterValues]);

  const fetchUsersData = async () => {
    setIsFetchBanksLoading(true);
    try {
      const backAccount = await getApi("/getall-bank", filterValues);

      console.log("first", backAccount);
      setTableData(backAccount?.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetchBanksLoading(false);
    }
  };

  const handleOk = () => {
    setIsAddBankModalOpen(false);
  };

  const handleCancel = () => {
    setIsAddBankModalOpen(false);
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
