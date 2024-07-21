import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import { useEffect, useState } from "react"
import TitleCard from '../../../components/Cards/TitleCard'
import SearchBar from "../../../components/Input/SearchBar"
import TableComponent from '../components/Table'
import InputText from '../components/inputText'

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

function Dropped() {
  const [formData, setFormData] = useState({
    payinUUID: '',
    merchantOrderId: '',
    utr: '',
  })

  const [filteredData, setFilteredData] = useState([]);

  const data = [
    {
      id: 1,
      amount: 150.75,
      code: 'A123',
      status: 'Dropped',
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
      status: 'Dropped',
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
      status: 'Dropped',
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
    }
  ];

  const updateFormValue = ({ updateType, value }) => {
    setFormData({ ...formData, [updateType]: value });
  };

  const filterData = () => {
    let filtered = data;
    if (formData.payinUUID) {
      filtered = filtered.filter(item => item.payingUUID.includes(formData.payinUUID));
    }
    if (formData.merchantOrderId) {
      filtered = filtered.filter(item => item.merchantOrderId.includes(formData.merchantOrderId));
    }
    if (formData.utr) {
      filtered = filtered.filter(item => item.utr && item.utr.includes(formData.utr));
    }
    setFilteredData(filtered);
  };

  useEffect(() => {
    filterData();
  }, []);

  return (
    <>
      <div className='bg-white p-4'>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
          <InputText
            labelTitle="Payin UUID"
            value={formData.payinUUID}
            updateFormValue={updateFormValue}
            updateType="payinUUID"
            type={"text"}
            placeholder={"Enter payin uuid"}
          />

          <InputText
            labelTitle="Merchant Order ID"
            value={formData.merchantOrderId}
            updateFormValue={updateFormValue}
            updateType="merchantOrderId"
            type={"text"}
            placeholder={"Enter merchant order id"}
          />
          <InputText
            labelTitle="UTR"
            value={formData.utr}
            updateFormValue={updateFormValue}
            updateType="utr"
            type={"text"}
            placeholder={"Enter utr"}
          />
        </div>
        <div className='flex justify-end items-center p-2 gap-4 mt-2'>
          <button className='btn border btn-sm' onClick={() => setFormData({ payinUUID: '', merchantOrderId: '', utr: '' })}>Reset</button>
          <button className='btn btn-sm btn-primary' onClick={filterData}>Submit</button>
          <button className='btn border btn-sm'>Collapse</button>
        </div>
      </div>

      <TitleCard title="Recent Transactions" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
        {/* Team Member list in table format loaded constant */}
        <div className="overflow-x-auto w-full">
          <TableComponent data={filteredData} />
        </div>
      </TitleCard>
    </>
  )
}

export default Dropped;
