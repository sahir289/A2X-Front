import { Button } from 'antd';
import React from 'react';
import { PlusOutlined } from "@ant-design/icons";

const TableHeaderCompennet = ({ setIsAddUserModalOpen }) => {
  return (<>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>AdminUsers List</span>
      {/* <Button onClick={()=>{setIsAddUserModalOpen(true);console.log("llll")}}>add</Button> */}
      <Button
        icon={<PlusOutlined />}
        type='primary'
        className="bg-green-600 hover:!bg-green-600"
        onClick={() => { setIsAddUserModalOpen(true)}}
      >
        Add Users
      </Button>
    </div>
  </>
  )
}

export default TableHeaderCompennet
