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
      bankAccountId: record?.bankAccountId,
      merchantId: record?.merchantId,
    };

    setIsLoading(true);
    const deleteBankMerchant = await deleteApiWithData(
      "/delete-bank-merchant",
      formData
    );
    setIsLoading(false);

    if (deleteBankMerchant.error) {
      return;
    }

    handleTableChange({ current: 1, pageSize: 10 });

    if (
      deleteBankMerchant.data.data.count &&
      deleteBankMerchant.data.data.count === 1 &&
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
