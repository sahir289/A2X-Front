import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { getApi, postApi } from "../../../redux/api";
import DeleteModal from "./DeleteModal";

const UpdateMerchant = ({
  record,
  allMerchants,
  isAddMerchantModalOpen,
  setIsAddMerchantModalOpen,
  handleTableChange,
}) => {
  const [deleteRecord, setDeleteRecord] = useState({});
  const [isDeletePanelOpen, setIsDeletePanelOpen] = useState(false);
  const [deletedId, setDeletedId] = useState(null);
  const [newMerchant, setNewMerchant] = useState(null);
  const [form] = Form.useForm();

  const handleModalOk = () => {
    setIsAddMerchantModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsAddMerchantModalOpen(false);
  };

  const onUpdateMerchant = async (values) => {
    const formData = {
      bankAccountId: record?.id,
      merchantId: values?.merchantId,
    };


    const addBankMerchant = await postApi("/add-bank-merchant", formData);
    if (addBankMerchant.error) {
      return;
    }

    await getBankMerchant(addBankMerchant?.data?.data?.merchantId);

    handleTableChange({ current: 1, pageSize: 10 });

    form.resetFields();

  };

  const getBankMerchant = async (id) => {
    const getMerchantBank = await getApi("/get-merchant", { id });
    if (getMerchantBank.error) {
      return;
    }

    setNewMerchant(getMerchantBank.data.data);
  };

  const deleteMerchant = (merchant) => {
    const deleteData = {
      bankAccountId: record?.id,
      merchantId: merchant?.id,
      merchantCode: merchant?.code,
    };
    setDeleteRecord(deleteData);
    setIsDeletePanelOpen(true);
  };

  useEffect(() => {
    if (deletedId) {
      const updatedMerchant = record?.merchant?.filter(
        (merchant) => merchant?.id !== deletedId
      );
      record.merchant = updatedMerchant;
    }
  }, [deletedId]);

  useEffect(() => {
    if (newMerchant) {
      if (record.merchant) {
        record.merchant.push(newMerchant);
      } else {
        record.merchant = [newMerchant];
      }
    }
  }, [newMerchant]);

  return (
    <>
      <Modal
        title="Merchant List"
        open={isAddMerchantModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={[
          <Button key="back" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>
            Update
          </Button>,
        ]}
      >
        <div className="flex flex-col gap-2">
          {record?.merchant?.map((merchant) => (
            <div key={merchant?.id} className="flex justify-between">
              <div>{merchant?.code}</div>
              <Button
                type="text"
                icon={<DeleteOutlined />}
                title="Delete"
                onClick={() => {
                  deleteMerchant(merchant);
                }}
              />
            </div>
          ))}
        </div>
        <Form
          form={form}
          name="edit_merchant"
          onFinish={onUpdateMerchant}
          autoComplete="off"
          className="flex gap-2 py-5"
        >
          <Form.Item
            name="merchantId"
            className="flex-1"
            rules={[
              {
                required: true,
                message: "Please select merchant!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Search to Select"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={allMerchants?.map((merchant) => ({
                value: merchant?.id,
                label: merchant?.code,
              }))}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
              Add Item
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <DeleteModal
        record={deleteRecord}
        isDeletePanelOpen={isDeletePanelOpen}
        setIsDeletePanelOpen={setIsDeletePanelOpen}
        modalTitle="Delete Merchant"
        deleteMessage="Are you sure you want to delete this merchant account "
        displayItem={deleteRecord?.merchantCode}
        handleTableChange={handleTableChange}
        deletedId={deletedId}
        setDeletedId={setDeletedId}
      />
    </>
  );
};

export default UpdateMerchant;
