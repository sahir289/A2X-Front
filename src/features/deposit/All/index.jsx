import { useEffect, useState } from "react"
import { getApi } from '../../../redux/api'
import TableComponent from '../components/Table'


function All() {

  const [tableData, setTableData] = useState([])

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);

  const [filterValues, setFilterValues] = useState({
    sno: '',
    upiShortCode: '',
    amount: '',
    merchantOrderId: '',
    merchantCode: '',
    userId: '',
    utr: '',
    payInId: '',
    dur: '',
    bank: '',
    status: '',
    pageSize:20   // initial size
  })
  const [isFetchUsersLoading, setIsFetchUsersLoading] = useState(false)

  // const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)  for modal
  useEffect(() => {

    fetchUsersData()
  }, [filterValues,currentPage])

  useEffect(() => {
    setFilterValues(prevValues => ({
      ...prevValues,
      pageSize
    }));
  }, [pageSize]);

  const fetchUsersData = async () => {
    setIsFetchUsersLoading(true)
    try {
      const payInDataRes = await getApi('/get-payInData', filterValues)

      setTableData(payInDataRes?.data?.data?.payInData)
      setTotalRecords(payInDataRes?.data?.data?.totalRecords)
      console.log("first", payInDataRes?.data?.data?.totalRecords)

    } catch (error) {
      console.log(error)
    }
    finally {
      setIsFetchUsersLoading(false)
    }

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
        />
      </div>
    </>
  )
}


export default All
