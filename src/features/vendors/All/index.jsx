import { useEffect, useState } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useNavigate } from "react-router-dom";
import { getApi } from "../../../redux/api";
import TableComponent from "../components/Table";

function All() {
  const [tableData, setTableData] = useState([]);
  const [filterValues, setFilterValues] = useState({
    page: 1,
    pageSize: 20,
  });
  const [isFetchDataLoading, setIsFetchDataLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsersData();
  }, [filterValues]);

  const fetchUsersData = async () => {
    setIsFetchDataLoading(true);
    const data = await getApi("/getall-vendor", filterValues);
    // console.log(data);
    setIsFetchDataLoading(false);
    if (data.error?.error?.response?.status === 401) {
      NotificationManager.error(data?.error?.message, 401);
      localStorage.clear();
      navigate("/");
    }
    setTableData(data?.data?.data);
  };

  return (
    <div className="">
      <TableComponent
        data={tableData}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        isFetchDataLoading={isFetchDataLoading}
      />
      <NotificationContainer />
    </div>
  );
}

export default All;
