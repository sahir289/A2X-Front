import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import { useEffect, useState } from "react"
import TitleCard from '../../../components/Cards/TitleCard'
import SearchBar from "../../../components/Input/SearchBar"
import TableComponent from '../components/Table'

const TopSideButtons = ({ applyFilter, applySearch }) => {

  const [filterParam, setFilterParam] = useState("")
  const [searchText, setSearchText] = useState("")
  const locationFilters = ["Paris", "London", "Canada", "Peru", "Tokyo"]

  const showFiltersAndApply = (params) => {
    applyFilter(params)
    setFilterParam(params)
  }

  const removeAppliedFilter = () => {
    setFilterParam("")
    setSearchText("")
  }

  useEffect(() => {
    if (searchText == "") {
      removeAppliedFilter()
    } else {
      applySearch(searchText)
    }
  }, [searchText])

  return (
    <div className="inline-block float-right">
      <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText} />
      {filterParam != "" && <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">{filterParam}<XMarkIcon className="w-4 ml-2" /></button>}

    </div>
  )
}


function All() {

  const data = [
    {
      id: 1,
      amount: 150.75,
      code: 'A123',
      status: 'Assigned',
      user: 'John Doe',
      merchant: 'Amazon',
      merchantOrderId: 'M123456',
      payingUUID: 'UUID12345',
      lastUpdated: '2024-05-30T10:30:00Z'
    },
    {
      id: 2,
      amount: 89.99,
      code: 'B456',
      status: 'Dropped',
      user: 'Jane Smith',
      merchant: 'Ebay',
      merchantOrderId: 'M654321',
      payingUUID: 'UUID67890',
      lastUpdated: '2024-06-01T14:45:00Z'
    },
    {
      id: 3,
      amount: 299.99,
      code: 'C789',
      status: 'Completed',
      user: 'Alice Johnson',
      merchant: 'Walmart',
      merchantOrderId: 'M112233',
      payingUUID: 'UUID11223',
      lastUpdated: '2024-06-02T09:15:00Z'
    },
    {
      id: 4,
      amount: 49.99,
      code: 'D012',
      status: 'Assigned',
      user: 'Bob Brown',
      merchant: 'Best Buy',
      merchantOrderId: 'M445566',
      payingUUID: 'UUID33445',
      lastUpdated: '2024-05-29T11:30:00Z'
    },
    {
      id: 5,
      amount: 120.00,
      code: 'E345',
      status: 'Dropped',
      user: 'Charlie Davis',
      merchant: 'Target',
      merchantOrderId: 'M778899',
      payingUUID: 'UUID55667',
      lastUpdated: '2024-06-03T16:00:00Z'
    },
    {
      id: 6,
      amount: 199.99,
      code: 'F678',
      status: 'Completed',
      user: 'Emma Wilson',
      merchant: 'Nike',
      merchantOrderId: 'M990011',
      payingUUID: 'UUID77889',
      lastUpdated: '2024-06-04T09:30:00Z'
    },
    {
      id: 7,
      amount: 79.95,
      code: 'G910',
      status: 'Assigned',
      user: 'Frank Martinez',
      merchant: 'Adidas',
      merchantOrderId: 'M223344',
      payingUUID: 'UUID99001',
      lastUpdated: '2024-06-03T13:15:00Z'
    },
    {
      id: 8,
      amount: 299.50,
      code: 'H234',
      status: 'Dropped',
      user: 'Grace Thompson',
      merchant: 'Gap',
      merchantOrderId: 'M556677',
      payingUUID: 'UUID11234',
      lastUpdated: '2024-06-02T17:45:00Z'
    },
    {
      id: 9,
      amount: 99.00,
      code: 'I567',
      status: 'Assigned',
      user: 'Henry Garcia',
      merchant: 'Macy\'s',
      merchantOrderId: 'M889900',
      payingUUID: 'UUID33456',
      lastUpdated: '2024-06-01T11:30:00Z'
    },
    {
      id: 10,
      amount: 149.95,
      code: 'J890',
      status: 'Completed',
      user: 'Isabella Lee',
      merchant: 'Zara',
      merchantOrderId: 'M001122',
      payingUUID: 'UUID55678',
      lastUpdated: '2024-05-31T14:00:00Z'
    },
    {
      id: 11,
      amount: 69.99,
      code: 'K123',
      status: 'Dropped',
      user: 'Jack Harris',
      merchant: 'H&M',
      merchantOrderId: 'M334455',
      payingUUID: 'UUID77889',
      lastUpdated: '2024-05-30T10:30:00Z'
    },
    {
      id: 12,
      amount: 129.00,
      code: 'L456',
      status: 'Assigned',
      user: 'Lily Brown',
      merchant: 'Forever 21',
      merchantOrderId: 'M667788',
      payingUUID: 'UUID99001',
      lastUpdated: '2024-05-29T14:45:00Z'
    },
    {
      id: 13,
      amount: 299.99,
      code: 'M789',
      status: 'Completed',
      user: 'Michael Johnson',
      merchant: 'Tommy Hilfiger',
      merchantOrderId: 'M112233',
      payingUUID: 'UUID11223',
      lastUpdated: '2024-05-28T09:15:00Z'
    },
    {
      id: 14,
      amount: 59.95,
      code: 'N012',
      status: 'Dropped',
      user: 'Natalie Clark',
      merchant: 'Old Navy',
      merchantOrderId: 'M445566',
      payingUUID: 'UUID33445',
      lastUpdated: '2024-05-27T16:00:00Z'
    },
    {
      id: 15,
      amount: 199.50,
      code: 'O345',
      status: 'Assigned',
      user: 'Oliver Davis',
      merchant: 'American Eagle',
      merchantOrderId: 'M778899',
      payingUUID: 'UUID55667',
      lastUpdated: '2024-05-26T09:30:00Z'
    },
  ];
  return (
    <>

      <TitleCard title="Recent Transactions" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>

        {/* Team Member list in table format loaded constant */}
        <div className="overflow-x-auto w-full">
          <TableComponent data={data} />
        </div>
      </TitleCard>
    </>
  )
}


export default All
