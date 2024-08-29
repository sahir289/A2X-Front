import { useEffect, useState } from "react";
import { getApi } from "../../../redux/api";
import TableComponent from "../components/Table";
import { useNavigate } from "react-router-dom";
import { NotificationContainer, NotificationManager } from 'react-notifications';

function All() {
  const [tableData, setTableData] = useState([]);
  const [filterValues, setFilterValues] = useState({
    page: 1,
    pageSize: 20,
  });
  const [isFetchBanksLoading, setIsFetchBanksLoading] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsersData();
  }, [filterValues]);

  const fetchUsersData = async () => {
    setIsFetchBanksLoading(true);
    const backAccount = await getApi("/getall-merchant", filterValues);
    setIsFetchBanksLoading(false);
    if (backAccount.error?.error?.response?.status === 401) {
      NotificationManager.error(backAccount?.error?.message, 401);
      localStorage.clear();
      navigate('/')
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
      <NotificationContainer />
    </div>
  );
}

export default All;
