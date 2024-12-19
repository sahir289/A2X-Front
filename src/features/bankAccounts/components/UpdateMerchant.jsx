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
  const [merchantRecord, setRecord] = useState([]);
  const [deleteRecord, setDeleteRecord] = useState({});
  const [isDeletePanelOpen, setIsDeletePanelOpen] = useState(false);
  const [deletedId, setDeletedId] = useState(null);
  const [newMerchant, setNewMerchant] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState([]);
  const [selectedDeletedMerchantIDs, setSelectedDeletedMerchantIDs] = useState([]);
  const [selectedDeletedMerchantCodes, setSelectedDeletedMerchantCodes] = useState([]);
  const [selectedDeletedMerchant, setSelectedDeletedMerchant] = useState([]);
  const [loading,setLoading]=useState(false)
  const [form] = Form.useForm();

  useEffect(() => {
    setRecord({ ...record });
  }, [record]);

  const handleModalCancel = () => {
    setIsAddMerchantModalOpen(false);
    setSelectedMerchant([]);
    setSelectedDeletedMerchant([]);
    setSelectedDeletedMerchantIDs([]);
    setSelectedDeletedMerchantCodes([]);
    form.resetFields();
  };

  const handleSelectMerchant = async (values) => {
    const merchantIds = values?.merchantId || [];

    setSelectedMerchant((prev) => [
      ...prev,
      ...merchantIds.map((id) => ({
        id,
        code: allMerchants.find((merchant) => merchant?.id === id)?.code,
      })),
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
    const formData = {
      bankAccountId: record?.id,
      merchantId: selectedMerchant.map((merchant) => merchant?.id),
      includeSubMerchant
    };

    if (!formData) {
      setLoading(false)
      return;
    }

    // for (const element of formData) {
    //   if (!element?.merchantId) {
    //     return;
    //   }

    //   const data = {
    //     bankAccountId: element?.bankAccountId,
    //     merchantId: element?.merchantId,
    //     includeSubMerchant
    //   }

      await postApi("/add-bank-merchant", formData).then(async(res) => {
        if (res?.error) {
          return;
        }
        await getBankMerchant(res?.data?.data?.merchantId);
        setSelectedMerchant((prev) =>
          prev.filter((prevMerchant) => !formData?.merchantId.includes(prevMerchant))
        );
      }).catch((err) => {
        console.log("🚀 ~ addBankMerchant ~ err:", err)
      }).finally(async() => {
        setLoading(false)
        handleModalCancel()
      });
    // }

    handleTableChange({ current: 1, pageSize: 20 });
  };

  const getBankMerchant = async (id) => {
    const getMerchantBank = await getApi("/get-merchant", { id });
    if (getMerchantBank.error) {
      return;
    }

    setNewMerchant(getMerchantBank.data.data);
  };

  const setMerchantToDelete = (merchant) => {
    setSelectedDeletedMerchant((prevSelected) => [...prevSelected, merchant])
    setSelectedDeletedMerchantIDs((prevSelected) => [...prevSelected, merchant.id])
    setSelectedDeletedMerchantCodes((prevSelected) => [...prevSelected, merchant.code])
  };

  useEffect(() => {
    if (selectedDeletedMerchantIDs?.length) {
      setRecord((prevRecord) => {
        const updatedMerchants = prevRecord.merchants.filter(
          (merchant) => !selectedDeletedMerchantIDs.includes(merchant?.id)
        );
        return { ...prevRecord, merchants: updatedMerchants };
      });
    }
  }, [selectedDeletedMerchantIDs]);

  const deleteMerchant = (merchantIds, merchantCodes) => {
    const deleteData = {
      bankAccountId: record?.id,
      merchantId: merchantIds,
      merchantCode: merchantCodes,
    };
    setDeleteRecord(deleteData);
    setIsDeletePanelOpen(true);
  };

  useEffect(() => {
    if (deletedId?.length) {
      const updatedMerchant = record?.merchants?.filter(
        (merchant) => !deletedId.includes(merchant?.id)
      );

      record.merchants = updatedMerchant;

      setSelectedDeletedMerchant([]);
      setSelectedDeletedMerchantIDs([]);
      setSelectedDeletedMerchantCodes([]);
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
          {merchantRecord?.merchants?.map((merchant) => (
            <div key={merchant?.id} className="flex justify-between">
              <div>{merchant?.code}</div>
              <Button
                type="text"
                icon={<DeleteOutlined />}
                title="Delete"
                onClick={() => {
                  setMerchantToDelete(merchant);
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
              mode="multiple"
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
              <div>Selected Merchants To Add</div>
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
        {selectedDeletedMerchant?.length > 0 && (
          <Button type="primary" danger htmlType="submit" icon={<DeleteOutlined />} className="flex justify-self-end" onClick={() => { deleteMerchant(selectedDeletedMerchantIDs, selectedDeletedMerchantCodes); }}>
            Batch Delete
          </Button>
        )}
        {selectedDeletedMerchant?.length > 0 && (
          <>
            <div className="flex justify-between">
              <div>Selected Merchants To Delete</div>
              <Button
                type="text"
                icon={<DeleteOutlined />}
                title="Delete"
                onClick={() => {
                  setSelectedDeletedMerchant([]);
                  setSelectedDeletedMerchantIDs([]);
                  setSelectedDeletedMerchantCodes([]);
                }}
              />
            </div>
            <hr />
          </>
        )}
        {selectedDeletedMerchant?.map((merchant) => (
          <div key={merchant?.id} className="flex justify-between">
            <div>{merchant?.code}</div>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              title="Delete"
              onClick={() => {
                setSelectedDeletedMerchant((prevMerchants) =>
                  prevMerchants.filter((item) => item !== merchant)
                );
                setSelectedDeletedMerchantIDs((prevMerchants) =>
                  prevMerchants.filter((item) => item.id !== merchant.id)
                );
                setSelectedDeletedMerchantCodes((prevMerchants) =>
                  prevMerchants.filter((item) => item.code !== merchant.code)
                );
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
        deleteMessage={
          Array.isArray(deleteRecord?.merchantCode)
            ? "Are you sure you want to delete this merchants "
            : "Are you sure you want to delete this merchant "
        }
        displayItem={
          Array.isArray(deleteRecord?.merchantCode)
            ? deleteRecord?.merchantCode.join(', ')
            : deleteRecord?.merchantCode
        }
        handleTableChange={handleTableChange}
        deletedId={deletedId}
        setDeletedId={setDeletedId}
      />
    </>
  );
};

export default UpdateMerchant;
