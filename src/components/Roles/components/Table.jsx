import { CopyOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Switch, Table, Tag } from 'antd';
import Column from 'antd/es/table/Column';
import React, { useEffect, useState } from 'react';
import {formatDate} from '../../../../src/utils/utils.js'
import {Input} from 'antd';

const TableComponent = ({ data, handleUserStatusChange, filterValues, setFilterValues, tableChangeHandler, totalRecords, currentPage, pageSize }) => {

  // const handleCopy = (values) => {
  //   navigator.clipboard.writeText(values);
  // };

  const handleFilterValuesChange=(value,filedName)=>{
    setFilterValues((prev)=>({...prev,[filedName]:value}))
  }
  const handleStatusChange = (e, data) => {
    console.log("first jj",e)
    console.log("first jj", data)
    handleUserStatusChange({id:data.id,status:e})
  }

  return (
    <Table dataSource={data} rowKey="id" onChange={tableChangeHandler} pagination={{
      total: totalRecords,
      current: currentPage,
      pageSize: pageSize,
      showSizeChanger: false,
      // onShowSizeChange: pageSizeHandler,
      pageSizeOptions: [10, 20, 50, 100, 200],
    }}>

      <Column
        title={<>
          <span>AdminUser name</span>
          <br />
          <Input
            value={filterValues.name}
            onChange={(e)=>{handleFilterValuesChange(e.target.value,'name')}}/>
        </>}
        dataIndex="fullName"
        key="fullName"
        className="bg-white"
        width={"15%"}
      />
      <Column
        title={<>
          <span>User Name</span>
          <br />
          <Input
            value={filterValues.userName}
            onChange={(e) => { handleFilterValuesChange(e.target.value, 'userName') }} />
        </>}
        dataIndex="userName"
        key="userName"
        className="bg-white"
        width={"10%"}
      />
      <Column
        title={<>
          <span>Role</span>
          <br />
          {/* <Input
            value={filterValues.role}
            onChange={(e) => { handleFilterValuesChange(e.target.value, 'role') }} /> */}
        </>}
        dataIndex="role"
        key="role"
        className="bg-white"
        width={"10%"}
      />
      <Column
        title="Enabled"
        dataIndex="isEnabled"
        key="isEnabled"
        className="bg-white"
        width={"15%"}
        render={(value,data)=>{
          return <>
          <Switch
          defaultValue={value?true :false}
          onChange={(e)=>{handleStatusChange(e,data)}}
          >

          </Switch>
          </>
        }}
      />
      <Column
        title="Last logged in (IST)"
        dataIndex="last_login"
        key="last_login"
        className="bg-white"
        width={"10%"}
        render={(value) => (formatDate(value))}
      />

    </Table>
  );
};


export default TableComponent;
