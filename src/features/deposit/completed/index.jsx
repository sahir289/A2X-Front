import { useEffect, useState } from "react";
import { getApi } from '../../../redux/api';
import TableComponent from '../components/Table';


function Completed() {

  const [tableData, setTableData] = useState([])

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);

  const [filterValues, setFilterValues] = useState({
    sno: '',
    upiShortCode: '',
    confirmed: '',
    amount: '',
    merchantOrderId: '',
    merchantCode: '',
    userId: '',
    userSubmittedUtr: '',
    utr: '',
    payInId: '',
    dur: '',
    bank: '',
    status: 'SUCCESS',
    pageSize: 20,   // initial size
    page: 1,  // initial size
  })
  const [isFetchUsersLoading, setIsFetchUsersLoading] = useState(false)

  // const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)  for modal
  console.log("🚀 ~ Completed ~ filterValues:", filterValues)
  useEffect(() => {

    fetchUsersData()
  }, [filterValues, currentPage])

  useEffect(() => {
    setFilterValues(prevValues => ({
      ...prevValues,
      pageSize,
      page: currentPage
    }));
  }, [pageSize, currentPage]);

  const fetchUsersData = async () => {
    setIsFetchUsersLoading(true)
    const payInDataRes = await getApi('/get-payInData', filterValues)
    setIsFetchUsersLoading(false)
    if (payInDataRes.error) {
      return;
    }
    setTableData(payInDataRes?.data?.data?.payInData)
    setTotalRecords(payInDataRes?.data?.data?.totalRecords)
    console.log("first", payInDataRes?.data?.data?.totalRecords)
  }
  // for modal
  // const handleOk = () => {
  //   setIsAddUserModalOpen(false)
  // }

  // const handleCancel = () => {
  //   setIsAddUserModalOpen(false)
  // }


  const tableChangeHandler = (pagination) => {
    console.log(" kk", pagination)
    setTotalRecords(pagination.total);
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
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
          completedTable={true}
        />
      </div>
    </>
  )
}


export default Completed
