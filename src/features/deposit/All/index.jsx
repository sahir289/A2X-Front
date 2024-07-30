import { useEffect, useState } from "react"
import { getApi } from '../../../redux/api'
import TableComponent from '../components/Table'


function All() {

  const [tableData, setTableData] = useState([])
  const [filterValues, setFilterValues] = useState({
    upiShortCode: '',
    amount: '',
    merchantOrderId: '',
    merchantCode: '',
    userId:'',
    utr:'',
    payInId:'',
    dur:'',
    bank:'',
    status:'',
  })
  const [isFetchUsersLoading, setIsFetchUsersLoading] = useState(false)

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)

  useEffect(() => {
    fetchUsersData()
  }, [filterValues])

  const fetchUsersData = async () => {
    setIsFetchUsersLoading(true)
    try {
      const payInDataRes = await getApi('/get-payInData', filterValues)

      setTableData(payInDataRes?.data?.data?.payInData)
      console.log("first", payInDataRes)

    } catch (error) {
      console.log(error)
    }
    finally {
      setIsFetchUsersLoading(false)
    }

  }

  const handleOk = () => {
    setIsAddUserModalOpen(false)
  }

  const handleCancel = () => {
    setIsAddUserModalOpen(false)
  }
  return (
    <>
      <div className="">
        <TableComponent data={tableData} filterValues={filterValues} setFilterValues={setFilterValues} />
      </div>
    </>
  )
}


export default All
