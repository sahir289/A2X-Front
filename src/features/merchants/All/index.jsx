import { useContext, useEffect, useState } from "react";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { useNavigate } from "react-router-dom";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";
import { getApi } from "../../../redux/api";
import TableComponent from "../components/Table";

function All() {
  const [tableData, setTableData] = useState([]);
  const context = useContext(PermissionContext);


  let getMerchantCodes =JSON.parse(localStorage.getItem("merchantCodes"));


  // Set initial filter values based on the context
  const [filterValues, setFilterValues] = useState({
    page: 1,
    pageSize: 100,
    code: context?.role === "MERCHANT_ADMIN" ? getMerchantCodes : null
  });

  const [isFetchBanksLoading, setIsFetchBanksLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsersData();
  }, [filterValues]);

  useEffect(() => {
    setFilterValues({
      page: 1,
      pageSize: 100,
      code: context?.role === "MERCHANT_ADMIN" ? getMerchantCodes : null
    })

  }, [context?.code, JSON.stringify(getMerchantCodes)]);

  // Fetch user data based on filter values
  const fetchUsersData = async () => {
    setIsFetchBanksLoading(true);

    // Construct the query manually if code is an array
    let url = "/getall-merchant-data";
    let params = { ...filterValues };
    // Check if code is an array and append it manually
    if (Array.isArray(filterValues.code)) {
      const codeQueryString = filterValues.code
        .map(code => `code=${encodeURIComponent(code)}`)
        .join('&');
      url = `${url}?${codeQueryString}`;
    }
    const backAccount = await getApi(url, params);

    setIsFetchBanksLoading(false);

    if (backAccount.error?.error?.response?.status === 401) {
      NotificationManager.error(backAccount?.error?.message, 401);
      localStorage.clear();
      navigate('/');
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
      <NotificationContainer />
    </div>
  );
}

export default All;
