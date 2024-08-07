import { PlusOutlined } from "@ant-design/icons";
import { Button } from 'antd';
import React from 'react';

const TableHeaderCompennet = ({ setIsAddUserModalOpen, setFilterValues }) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <span>AdminUsers List</span>
        <div className="flex items-center gap-2">
          {/* <Button onClick={()=>{setIsAddUserModalOpen(true);console.log("llll")}}>add</Button> */}
          <Button onClick={() => setFilterValues({})}>Reset</Button>
          <Button
            icon={<PlusOutlined />}
            type='primary'
            className="bg-green-600 hover:!bg-green-600"
            onClick={() => { setIsAddUserModalOpen(true) }}
          >
            Add Users
          </Button>

        </div>
      </div>
    </>
  )
}

export default TableHeaderCompennet
