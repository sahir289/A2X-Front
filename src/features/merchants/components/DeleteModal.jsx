import { Modal } from "antd";
import React, { useState } from "react";
import { deleteApiWithData } from "../../../redux/api";

const DeleteModal = ({
  isDeletePanelOpen,
  setIsDeletePanelOpen,
  modalTitle,
  deleteMessage,
  displayItem,
  record,
  handleTableChange,
  deletedId,
  setDeletedId,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOk = async () => {
    const formData = {
      merchantId: record?.merchantId,
    };

    setIsLoading(true);
    const deleteMerchant = await deleteApiWithData(
      "/delete-merchant",
      formData
    );
    setIsLoading(false);

    if (deleteMerchant.error) {
      return;
    }

    handleTableChange({ current: 1, pageSize: 20 });

    if (
      deleteMerchant.data.data.count &&
      deleteMerchant.data.data.count === 1 &&
      !Array.isArray(record?.merchantId)
    ) {
      setDeletedId(record?.merchantId);
    }
    setIsDeletePanelOpen(false);
  };

  const handleCancel = () => {
    setIsDeletePanelOpen(false);
  };
  return (
    <Modal
      title={modalTitle}
      open={isDeletePanelOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isLoading}
    >
      <p>
        {deleteMessage}
        {displayItem}
      </p>
    </Modal>
  );
};

export default DeleteModal;
