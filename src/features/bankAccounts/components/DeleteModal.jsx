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
    setIsLoading(true);
    const formData = {
      bankAccountId: record?.bankAccountId,
      merchantId: record?.merchantId,
    };

    try {
      const deleteBankMerchant = await deleteApiWithData(
        "/delete-bank-merchant",
        formData
      );

      if (deleteBankMerchant.status === 200) {
        handleTableChange({ current: 1, pageSize: 10 });

        if (
          deleteBankMerchant.data.data.count &&
          deleteBankMerchant.data.data.count === 1 &&
          !Array.isArray(record?.merchantId)
        ) {
          setDeletedId(record?.merchantId);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsDeletePanelOpen(false);
    }
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
