import { PlusOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Pagination, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getApi, postApi, putApi } from '../../redux/api';
import { RequiredRule, getQueryFromObject, parseErrorFromAxios, reasonOptions } from '../../utils/utils';
import Table from './components/Table';

const Withdraw = ({ type }) => {

  const timer = useRef(null);
  const [modal, contextHolder] = Modal.useModal();
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addWithdraw, setAddWithdraw] = useState(false);
  const [editWithdraw, setEditWithdraw] = useState(null);
  const [selectedUTRMethod, setSelectedUTRMethod] = useState('manual');
  const [withdraws, setWithdraws] = useState({
    data: [],
    total: 0,
  })
  const [pagination, setPagination] = useState({
    page: 1,
    take: 10,
  })

  const merchants = useSelector(state => state.merchant.data);

  useEffect(() => {
    setPagination({
      page: 1,
      take: 10,
    })
  }, [filters]);

  useEffect(() => {
    handleGetWithdraws({
      ...pagination,
      ...filters,
    }, true);
  }, [pagination, filters])

  const handleToggleModal = () => {
    setAddWithdraw(!addWithdraw)
  }

  const handleGetWithdraws = async (queryObj = {}, debounced = false) => {
    if (!debounced) {
      getPayoutList(queryObj);
      return;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      getPayoutList(queryObj);
    }, 1500);
  }

  const getPayoutList = async (queryObj) => {
    setIsLoading(true);
    try {
      const queryObject = {
        ...queryObj
      }
      if (!queryObject.status) {
        queryObject.status = type == "In Progress" ? "INITIATED" : type == "Completed" ? "SUCCESS" : "";
      }
      console.log(queryObject.status, queryObject)
      const query = getQueryFromObject(queryObject);
      const res = await getApi(`/getall-payout${query}`);
      const data = res.data.data;
      setWithdraws({
        data: data?.data || [],
        total: data?.totalRecords || 0,
      })
    } catch (err) {
      console.log("ERROR", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpdateWithdraw = async (data) => {
    if (!data?.record?.id) {
      return;
    }
    if (data.reset) {
      return handleResetWithdraws(data.record.id);
    }

    setEditWithdraw({
      ...data.record,
      key: data.key,
    });
  }

  const updateWithdraw = async (data, id) => {
    try {
      const withdrawId = editWithdraw?.id || id;
      if (!withdrawId) {
        return;
      }
      setIsLoading(true);
      await putApi(`/update-payout/${withdrawId}`, data);
      setEditWithdraw(null);
      handleGetWithdraws();
    } catch (err) {
      setIsLoading(false);
      console.log("ERROR", err);
    }
  }

  const handleResetWithdraws = async (id) => {
    const isReset = await modal.confirm({
      title: "Confirmation",
      type: "confirm",
      content: "Are you to reset the withdraw?",
    });

    if (isReset) {
      updateWithdraw({
        status: "INITIATED"
      }, id);
    }
  }

  const onFilterChange = async (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    })
  }

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
      const res = await postApi("/create-payout", data);
      handleToggleModal();
      handleGetWithdraws();
    } catch (err) {
      const msg = parseErrorFromAxios(err);
      alert(msg);
    } finally {
      setAddLoading(false);
    }
  }

  const merchantOptions = merchants
    .map(el => ({
      value: el.code,
      label: el.code
    }))

  //Select UTR Method
  const handleSelectUTRMethod = (selectedMethod) => {
    setSelectedUTRMethod(selectedMethod);
  };


  return (
    <section>
      {contextHolder}
      <div className='bg-white rounded-[8px] p-[8px]'>
        <div className='flex justify-between mb-[10px] max-[500px]:flex-col max-[500px]:gap-[10px]'>
          <p className='text-lg font-medium p-[5px]'>Withdraws {type}</p>
          <div className='flex items-center gap-4 max-[500px]:justify-end'>
            <Button
              icon={<PlusOutlined />}
              type='primary'
              onClick={handleToggleModal}
              className="bg-green-600 hover:!bg-green-600"
            >
              New Payout
            </Button>
            <Button type="text" className='rounded-full h-[40px] w-[40px] p-[0px]' onClick={() => handleGetWithdraws({ ...pagination, ...filters })}>
              <RedoOutlined size={24} className="rotate-[-90deg]" />
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <Table
            loading={isLoading}
            data={withdraws.data}
            filters={filters}
            merchantOptions={merchantOptions}
            onFilterChange={onFilterChange}
            updateWithdraw={handleUpdateWithdraw}
            type={type}
          />
        </div>
        <div className='flex justify-end mt-[10px]'>
          <Pagination
            total={withdraws.total}
            pageSize={pagination.take}
            current={pagination.page}
            showTotal={handleShowTotal}
            onChange={handlePageChange}
            showSizeChanger
          />
        </div>
      </div>

      <Modal
        title="Withdraw"
        open={!!editWithdraw}
        onCancel={() => setEditWithdraw(null)}
        footer={false}
        destroyOnClose
      >
        <Form layout="vertical" onFinish={updateWithdraw}>
          {
            selectedUTRMethod === 'manual' && editWithdraw?.key == "approve" &&
            <>
              <Form.Item>
                <Select options={[{ value: 'manual', key: 'manual' }, { value: 'accure', key: 'accure' }]}
                  onChange={handleSelectUTRMethod}
                  defaultValue={selectedUTRMethod}
                />
              </Form.Item>
              <Form.Item name="utr_id" label="UTR Number" rules={RequiredRule}>
                <Input />
              </Form.Item>
            </>
          }
          {
            editWithdraw?.key == "reject" &&
            <>
              <Form.Item name="rejected_reason" label="Reason" rules={RequiredRule}>
                <Select
                  options={reasonOptions}
                />
              </Form.Item>
            </>
          }
          <Button
            type="primary"
            className="bg-green-600 hover:!bg-green-600"
            htmlType="submit"
          >
            {
              editWithdraw?.key == "approve" ? "Approve" : "Reject"
            }
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Payout"
        open={addWithdraw}
        onCancel={handleToggleModal}
        footer={false}
        width={600}
        destroyOnClose
      >
        <Form labelAlign="left" labelCol={{ span: 8 }} onFinish={handleSubmit}>
          <Form.Item name="code" label="Merchant Code" rules={RequiredRule}>
            <Select
              options={merchantOptions}
            />
          </Form.Item>
          <Form.Item name="user_id" label="User ID (Account)" rules={RequiredRule}>
            <Input />
          </Form.Item>
          <Form.Item name="bank_name" label="Bank Name">
            <Input />
          </Form.Item>
          <Form.Item name="acc_no" label="Account Number" rules={RequiredRule}>
            <Input />
          </Form.Item>
          <Form.Item name="acc_holder_name" label="Account Holder Name" rules={RequiredRule}>
            <Input />
          </Form.Item>
          <Form.Item
            name="ifsc_code"
            label="IFSC code"
            rules={RequiredRule}
          >
            <Input />
          </Form.Item>
          <Form.Item name="amount" label="Amount" rules={RequiredRule}>
            <Input addonAfter="₹" />
          </Form.Item>
          <div className='flex justify-end items-center gap-2'>
            <Button>
              Cancel
            </Button>
            <Button
              type='primary'
              loading={addLoading}
              htmlType='submit'
            >
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </section>
  )
}

export default Withdraw
