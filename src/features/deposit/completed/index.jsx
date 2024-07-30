import { useEffect, useState } from "react"
import TableComponent from '../components/Table'



function Completed() {
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
      status: 'Completed',
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
      status: 'Completed',
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
      status: 'Completed',
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
      status: 'Completed',
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
      <div className="overflow-x-auto w-full">
        <TableComponent data={filteredData} />
      </div>
    </>
  )
}

export default Completed
