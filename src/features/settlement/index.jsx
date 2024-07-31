import { PlusOutlined, RedoOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Pagination, Select } from 'antd';
import { useEffect, useRef, useState } from "react";
import { getApi, postApi, putApi } from "../../redux/api";
import { getQueryFromObject } from "../../utils/utils";
import TableComponent, { methodOptions, walletOptions } from './components/Table';


export default function Settlement() {

  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const method = Form.useWatch("method", form);
  const timer = useRef(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [merchants, setMerchants] = useState([]);
  const [editSettlement, setEditSettlement] = useState(null);
  const [settlements, setSettlements] = useState({
    data: [],
    total: 0,
  })
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    take: 10,
  })

  const { data, total } = settlements;

  useEffect(() => {
    handleGetMerchants();
    handleGetSettlements();
  }, []);

  useEffect(() => {
    // reset the pagination
    // if anything changes in filters
    setPagination({
      page: 1,
      take: 10,
    })
  }, [filters]);

  useEffect(() => {
    handleGetSettlements({
      ...pagination,
      ...filters,
    }, true);
  }, [pagination, filters])

  const handleGetSettlements = (queryObj = {}, debounced = false) => {
    if (!debounced) {
      getSettlementList(queryObj);
      return;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      getSettlementList(queryObj);
    }, 1500);
  }

  const getSettlementList = async (queryObj) => {
    setIsLoading(true);
    try {
      const query = getQueryFromObject(queryObj);
      const res = await getApi(`/getall-settlement${query}`);
      const data = res.data.data;
      setSettlements({
        data: data?.data || [],
        total: data?.totalRecords || 0,
      })
      setIsLoading(false);
    } catch (err) {
      console.log("ERROR", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleGetMerchants = async () => {
    try {
      const res = await getApi("/getall-merchant");
      setMerchants(res.data?.data?.merchants || []);
    } catch (err) {

    }
  }

  const handleToggleModal = () => {
    setOpen(!open);
    form.resetFields();
  };

  const handlePageChange = (page, pageSize) => {
    setPagination({
      page,
      take: pageSize,
    })
  }

  const handleShowTotal = (total, range) => {
    if (!total) {
      return;
    }
    return (
      <p className='text-base'>
        {range[0]}-{range[1]} of {total} items
      </p>
    )
  }

  const handleSubmit = async (data) => {
    try {
      setAddLoading(true);
      await postApi("/create-settlement", data);
      handleToggleModal();
      getSettlementList();
    } catch (err) {
      const errorMessage = err?.response?.data?.error?.message || err.message;
      alert(errorMessage);
    } finally {
      setAddLoading(false);
    }
  }

  const onFilterChange = async (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const updateSettlementStatus = (data) => {
    if (data.reset) {
      return handleResetSettlement(data.record?.id);
    }

    if (data.approve) {
      setEditSettlement(data.record);
      return;
    }
  }

  const handleResetSettlement = async (id) => {
    const isReset = await modal.confirm({
      title: "Confirmation",
      type: "confirm",
      content: "Are you to reset the settlement",
    });

    if (isReset) {
      handelUpdateSettlement({
        status: "INITIATED"
      }, id);
    }
  }

  const handelUpdateSettlement = async (data, id) => {
    try {
      const settlementId = editSettlement?.id || id;
      if (!settlementId) {
        return;
      }
      setIsLoading(true);
      await putApi(`/update-settlement/${settlementId}`, data);
      setEditSettlement(null);
      handleGetSettlements();
    } catch (err) {
      setIsLoading(false);
      console.log("ERROR", err);
    }
  }


  const merchantOptions = merchants
    .map(el => ({
      value: el.code,
      label: el.code
    }))

  const labelCol = { span: 6 };
  const RequiredRule = [
    {
      required: true,
      message: "${label} is Required!",
    }
  ]

  return (
    <section className=''>
      {contextHolder}
      <div className='bg-white rounded-[8px] p-[8px]'>
        <div className='flex justify-between mb-[10px] max-[500px]:flex-col max-[500px]:gap-[10px]'>
          <p className='text-lg font-medium p-[5px]'>Settlement List</p>
          <div className='flex items-center gap-4 max-[500px]:justify-end'>
            <Button
              icon={<PlusOutlined />}
              type='primary'
              onClick={handleToggleModal}
              className="bg-green-600 hover:!bg-green-600"
            >
              New Settlement
            </Button>
            <Button type="text" className='rounded-full h-[40px] w-[40px] p-[0px]' onClick={() => handleGetSettlements({ ...pagination, ...filters })}>
              <RedoOutlined size={24} className="rotate-[-90deg]" />
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <TableComponent
            loading={isLoading}
            data={data}
            merchantOptions={merchantOptions}
            filters={filters}
            onFilterChange={onFilterChange}
            updateSettlementStatus={updateSettlementStatus}
          />
        </div>
        <div className='flex justify-end mt-[10px]'>
          <Pagination
            total={total}
            pageSize={pagination.take}
            current={pagination.page}
            showTotal={handleShowTotal}
            onChange={handlePageChange}
            showSizeChanger
          />
        </div>
      </div>

      <Modal
        title="Approve"
        open={!!editSettlement}
        onCancel={() => setEditSettlement(null)}
        footer={false}
        destroyOnClose
      >
        <Form layout="vertical" onFinish={handelUpdateSettlement}>
          <Form.Item name="refrence_id" label="UTR Number" rules={RequiredRule}>
            <Input size="large" />
          </Form.Item>
          <Button
            type="primary"
            className="bg-green-600 hover:!bg-green-600"
            htmlType="submit"
          >
            Approve
          </Button>
        </Form>
      </Modal>

      <Modal title="Add Settlement" onCancel={handleToggleModal} open={open} footer={false}>
        <Form
          form={form}
          className='pt-[10px]'
          labelAlign='left'
          labelCol={labelCol}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="code"
            label="Merchant"
            rules={RequiredRule}
          >
            <Select
              options={merchantOptions}
            />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={RequiredRule}
          >
            <Input type="number" min={1} addonAfter="₹" />
          </Form.Item>
          <Form.Item
            name="method"
            label="Method"
            rules={RequiredRule}
          >
            <Select
              options={methodOptions}
            />
          </Form.Item>
          {
            method === "BANK" &&
            <>
              <Form.Item name="acc_name" label="Name" rules={RequiredRule}>
                <Input />
              </Form.Item>
              <Form.Item name="acc_no" label="Bank Details" rules={RequiredRule}>
                <Input />
              </Form.Item>
              <Form.Item name="ifsc" label="IFSC" rules={RequiredRule}>
                <Input />
              </Form.Item>
            </>
          }
          {
            method === "CRYPTO" &&
            <>
              <Form.Item name="wallet" label="Wallet" rules={RequiredRule}>
                <Select options={walletOptions} />
              </Form.Item>
              <Form.Item name="wallet_address" label="Wallet Address" rules={RequiredRule}>
                <Input />
              </Form.Item>
            </>
          }
          <div className='flex justify-end'>
            <Button type='primary' loading={addLoading} htmlType='submit'>
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </section>
  );
}

