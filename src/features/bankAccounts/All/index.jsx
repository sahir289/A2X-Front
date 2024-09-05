import { useEffect, useState } from "react";
import { getApi, putApi } from "../../../redux/api";
import TableComponent from "../components/Table";

function All() {
  const [tableData, setTableData] = useState([]);
  const [filterValues, setFilterValues] = useState({
    ac_name: "",
    ac_no: "",
    upi_id: "",
    page: 1,
    pageSize: 20,
  });
  const [isFetchBanksLoading, setIsFetchBanksLoading] = useState(false);

  useEffect(() => {
    fetchBankData();
  }, [filterValues]);

  const fetchBankData = async () => {
    setIsFetchBanksLoading(true);
    const backAccount = await getApi("/getall-bank", filterValues);
    setIsFetchBanksLoading(false);
    if (backAccount.error) {
      return;
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
    </div>
  );
}

export default All;
