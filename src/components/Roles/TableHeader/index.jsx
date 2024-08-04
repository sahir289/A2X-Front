import { Button } from 'antd';
import React from 'react';

const TableHeaderCompennet = ({ setIsAddUserModalOpen }) => {
  return (<>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>AdminUsers List</span>
      <Button onClick={() => { setIsAddUserModalOpen(true); console.log("llll") }}>add</Button>
    </div>
  </>
  )
}

export default TableHeaderCompennet
