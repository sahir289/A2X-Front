
import React, { useEffect, useState } from 'react'
import TableComponent from './components/Table'
import axios from 'axios';
import { getApi } from '../../redux/api';
import TableHeaderCompennet from './TableHeader';
import AddUserModal from './AddUserModalCompoenet';

const RolesComponent = () => {

  const [tableData,setTableData]=useState([])
  const [filterValues,setFilterValues]=useState({
    name:'',
    userName:'',
    role:''
  })
  const[isFetchUsersLoading,setIsFetchUsersLoading]=useState(false)

  const [isAddUserModalOpen,setIsAddUserModalOpen]=useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(()=>{
    fetchUsersData()
  },[filterValues,pageSize,currentPage])

  const fetchUsersData=async()=>{
    setIsFetchUsersLoading(true)
    try{
      const usersApiRes = await getApi('/getall-users',{filterValues,pageSize,page:currentPage})

      setTableData(usersApiRes?.data?.data?.users)
      setTotalRecords(usersApiRes?.data?.data?.totalRecords)
      console.log("first", usersApiRes)

    }catch(error){
      console.log(error)
    }
    finally{
      setIsFetchUsersLoading(false)
    }

  }

  const handleOk=()=>{
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
  return (<>
    <div style={{marginBottom:'10px',fontWeight:400}}>Roles</div>
    <TableHeaderCompennet setIsAddUserModalOpen={setIsAddUserModalOpen}/>
    <div className="overflow-x-auto w-full">
      <TableComponent data={tableData} totalRecords={totalRecords}
        currentPage={currentPage}
        pageSize={pageSize} filterValues={filterValues} tableChangeHandler={tableChangeHandler} setFilterValues={setFilterValues }/>
    </div>
    <AddUserModal isAddUserModalOpen={isAddUserModalOpen} handleOk={handleOk} handleCancel={handleCancel}/>
  </>

  )
}

export default RolesComponent
