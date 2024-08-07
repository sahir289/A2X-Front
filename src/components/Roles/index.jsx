
import React, { useEffect, useState } from 'react';
import { getApi, putApi } from '../../redux/api';
import AddUserModal from './AddUserModalCompoenet';
import TableComponent from './components/Table';
import TableHeaderCompennet from './TableHeader';

const RolesComponent = () => {

  const [tableData, setTableData] = useState([])
  const [filterValues, setFilterValues] = useState({
    name: '',
    userName: '',
    role: ''
  })
  const [isFetchUsersLoading, setIsFetchUsersLoading] = useState(false)

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    fetchUsersData()
  }, [filterValues, pageSize, currentPage])

  const fetchUsersData = async () => {
    setIsFetchUsersLoading(true)
    const usersApiRes = await getApi('/getall-users', { filterValues, pageSize, page: currentPage })
    setIsFetchUsersLoading(false)
    if (usersApiRes.error) {
      console.log(usersApiRes.error)
      return;
    }
    setTableData(usersApiRes?.data?.data?.users)
    setTotalRecords(usersApiRes?.data?.data?.totalRecords)
    console.log("first", usersApiRes)

  }

  const handleOk = () => {
    setIsAddUserModalOpen(false)
  }

  const handleCancel = () => {
    setIsAddUserModalOpen(false)
  }
  const tableChangeHandler = (pagination, filters, sorter) => {
    console.log(" kk", pagination)
    setTotalRecords(pagination.total);
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    // setSortOrder(
    //   sorter?.order === 'ascend' ? 'asc' : sorter?.order ? 'desc' : ''
    // );
    // setSortField(sorter.field);
  };

  const handleUserStatusChange = async (data) => {
    setIsFetchUsersLoading(true)
    const usersApiRes = await putApi('/update-status', { id: data.id, status: data.status })
    setIsFetchUsersLoading(false)
    if (usersApiRes.error) {
      return;
    }
    fetchUsersData()

  }
  return (<>
    <div style={{ marginBottom: '10px', fontWeight: 400 }}>Roles</div>
    <TableHeaderCompennet setIsAddUserModalOpen={setIsAddUserModalOpen} setFilterValues={setFilterValues} />
    <div className="overflow-x-auto w-full">
      <TableComponent data={tableData} totalRecords={totalRecords}
        currentPage={currentPage}
        handleUserStatusChange={handleUserStatusChange}
        pageSize={pageSize} filterValues={filterValues} tableChangeHandler={tableChangeHandler} setFilterValues={setFilterValues} />
    </div>
    <AddUserModal isAddUserModalOpen={isAddUserModalOpen} handleOk={handleOk} handleCancel={handleCancel} fetchUsersData={fetchUsersData} />
  </>

  )
}

export default RolesComponent
