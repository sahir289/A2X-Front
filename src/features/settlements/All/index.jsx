import { useEffect, useState } from "react"
import { getApi } from '../../../redux/api'
import TableComponent from "../components/Table"


function All() {

  const [tableData, setTableData] = useState([
    {
      account_name: 'Bob',
      bank_details: 'Fast food',
      account_number: 32423453345,
      limmts: {
        lower: '100',
        upper: '100000'
      },
      upi_id: '1243095h@',
      balance: 3252345,
      allow_qr: true,
      show_bank: true,
      status: true,
      last_scheduled: '2024-07-30 14:47:50'
    }
  ])
  const [filterValues, setFilterValues] = useState({
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
  })
  const [isFetchUsersLoading, setIsFetchUsersLoading] = useState(false)

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)

  useEffect(() => {
    fetchUsersData()
  }, [filterValues])

  const fetchUsersData = async () => {
    setIsFetchUsersLoading(true)
    const payInDataRes = await getApi('/get-payInData', filterValues)
    setIsFetchUsersLoading(false)
    if (payInDataRes.error) {
      return;
    }

    setTableData(payInDataRes?.data?.data?.payInData)
    console.log("first", payInDataRes)

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
