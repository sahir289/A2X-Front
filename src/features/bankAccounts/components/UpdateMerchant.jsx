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
  includeSubMerchant
}) => {
  const [deleteRecord, setDeleteRecord] = useState({});
  const [isDeletePanelOpen, setIsDeletePanelOpen] = useState(false);
  const [deletedId, setDeletedId] = useState(null);
  const [newMerchant, setNewMerchant] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState([]);
  const [loading,setLoading]=useState(false)
  const [form] = Form.useForm();

  const handleModalCancel = () => {
    setIsAddMerchantModalOpen(false);
    setSelectedMerchant([]);
    form.resetFields();
  };

  const handleSelectMerchant = async (values) => {
    setSelectedMerchant((prev) => [
      ...prev,
      {
        id: values?.merchantId,
        code: allMerchants.find(
          (merchant) => merchant?.id === values?.merchantId
        )?.code,
      },
    ]);
    form.resetFields();
  };

  const deleteSelectedMerchant = (merchant) => {
    setSelectedMerchant((prev) =>
      prev.filter((prevMerchant) => prevMerchant?.id !== merchant?.id)
    );
  };

  const onUpdateMerchant = async () => {
    setLoading(true)
    const formData = selectedMerchant.map((merchant) => ({
      bankAccountId: record?.id,
      merchantId: merchant?.id,
    }));

    if (formData.length === 0) {
      setLoading(false)
      return;
    }

    for (const element of formData) {
      if (!element?.merchantId) {
        return;
      }

      const data = {
        bankAccountId: element?.bankAccountId,
        merchantId: element?.merchantId,
        includeSubMerchant
      }

      await postApi("/add-bank-merchant", data).then(async(res) => {
        if (res?.error) {
          return;
        }
        await getBankMerchant(res?.data?.data?.merchantId);
        setSelectedMerchant((prev) =>
          prev.filter((prevMerchant) => prevMerchant?.id !== element?.merchantId)
        );
      }).catch((err) => {
        console.log("🚀 ~ addBankMerchant ~ err:", err)
      }).finally(async() => {
        setLoading(false)
        handleModalCancel()
      });
    }

    handleTableChange({ current: 1, pageSize: 20 });
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
      const updatedMerchant = record?.merchants?.filter(
        (merchant) => merchant?.id !== deletedId
      );
      record.merchants = updatedMerchant;
    }
  }, [deletedId]);

  useEffect(() => {
    if (newMerchant) {
      if (record.merchants) {
        record.merchants.push(newMerchant);
      } else {
        record.merchants = [newMerchant];
      }
    }
  }, [newMerchant]);

  return (
    <>
      <Modal
        title="Merchant List"
        open={isAddMerchantModalOpen}
        onCancel={handleModalCancel}
        footer={[
          <Button key="back" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={onUpdateMerchant} loading={loading}>
            Update
          </Button>,
        ]}
      >
        <div className="flex flex-col gap-2">
          {record?.merchants?.map((merchant) => (
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
          onFinish={handleSelectMerchant}
          autoComplete="off"
          className="flex gap-2 py-2"
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
              options={allMerchants
                ?.filter((filter) => {
                  return (
                    !filter.is_deleted && !record?.merchants?.find(
                      (merchant) => merchant?.id === filter?.id
                    ) &&
                    !selectedMerchant?.find(
                      (merchant) => merchant?.id === filter?.id
                    )
                  );
                })
                ?.map((merchant) => ({
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
        {selectedMerchant?.length > 0 && (
          <>
            <div className="flex justify-between">
              <div>Selected Merchants</div>
              <Button
                type="text"
                icon={<DeleteOutlined />}
                title="Delete"
                onClick={() => {
                  setSelectedMerchant([]);
                }}
              />
            </div>
            <hr />
          </>
        )}
        {selectedMerchant?.map((merchant) => (
          <div key={merchant?.id} className="flex justify-between">
            <div>{merchant?.code}</div>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              title="Delete"
              onClick={() => {
                deleteSelectedMerchant(merchant);
              }}
            />
          </div>
        ))}
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
