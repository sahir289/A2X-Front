import React from 'react'
import Modal from 'antd/es/modal/Modal'

const AddUserModal = (props) => {

  const {isAddUserModalOpen,handleOk,handleCancel}=props
  return (
   <>
      <Modal title="Basic Modal" open={isAddUserModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal></>
  )
}

export default AddUserModal
