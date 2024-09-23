import { useContext, useEffect, useState } from "react";
import { getApi } from "../../../redux/api";
import TableComponent from "../components/Table";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";

function All() {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);
  const userData = useContext(PermissionContext);

  const initialFilterValues = {
    sno: "",
    upiShortCode: "",
    confirmed: "",
    amount: "",
    merchantOrderId: "",
    merchantCode: `${userData?.code || ""}`,
    vendorCode: `${userData?.vendorCode || ""}`,
    userId: "",
    userSubmittedUtr: "",
    utr: "",
    payInId: "",
    dur: "",
    bank: "",
    status: "",
    pageSize: 20, // initial size
    page: 1, // initial size
  };

  const [filterValues, setFilterValues] = useState(initialFilterValues);
  const [isFetchUsersLoading, setIsFetchUsersLoading] = useState(false);

  useEffect(() => {
    fetchUsersData();
  }, [filterValues, currentPage]);

  useEffect(() => {
    setFilterValues((prevValues) => ({
      ...prevValues,
      pageSize,
      page: currentPage,
    }));
  }, [pageSize, currentPage]);

  const fetchUsersData = async () => {
    setIsFetchUsersLoading(true);

    const payInDataRes = await getApi("/get-payInData", filterValues)
      .then((res) => {
        if (res?.error) {
          return;
        }
        setTableData(res?.data?.data?.payInData);
        setTotalRecords(res?.data?.data?.totalRecords);
      })
      .finally(() => {
        setIsFetchUsersLoading(false);
      });
  };

  const tableChangeHandler = (pagination) => {
    setTotalRecords(pagination.total);
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleResetSearchFields = () => {
    setFilterValues(initialFilterValues);
  };

  return (
    <>
      <div className="">
        <TableComponent
          data={tableData}
          filterValues={filterValues}
          setFilterValues={setFilterValues}
          totalRecords={totalRecords}
          currentPage={currentPage}
          pageSize={pageSize}
          tableChangeHandler={tableChangeHandler}
          fetchUsersData={fetchUsersData}
          allTable={true}
          isFetchUsersLoading={isFetchUsersLoading}
          handleResetSearchFields={handleResetSearchFields}
        />
      </div>
    </>
  );
}

export default All;
