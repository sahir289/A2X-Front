
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

  useEffect(()=>{
    fetchUsersData()
  },[filterValues])

  const fetchUsersData=async()=>{
    setIsFetchUsersLoading(true)
    try{
      const usersApiRes = await getApi('/getall-users',filterValues)

      setTableData(usersApiRes?.data?.data?.users)
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
  return (<>
    <div style={{marginBottom:'10px',fontWeight:400}}>Roles</div>
    {JSON.stringify(isAddUserModalOpen)}
    <TableHeaderCompennet setIsAddUserModalOpen={setIsAddUserModalOpen}/>
    <div className="overflow-x-auto w-full">
      <TableComponent data={tableData} filterValues={filterValues} setFilterValues={setFilterValues }/>
    </div>
    <AddUserModal isAddUserModalOpen={isAddUserModalOpen} handleOk={handleOk} handleCancel={handleCancel}/>
  </>

  )
}

export default RolesComponent
