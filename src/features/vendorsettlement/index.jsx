import { PlusOutlined, RedoOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, notification, Pagination, Select } from 'antd';
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getApi, postApi, putApi } from "../../redux/api";
import { getQueryFromObject, reasonOptions, RequiredRule } from "../../utils/utils";
import TableComponent, { methodOptions, walletOptions } from './components/Table';
import { useNavigate } from "react-router-dom";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { PermissionContext } from "../../components/AuthLayout/AuthLayout";


export default function Settlement() {

  const [form] = Form.useForm();
  const [api, notificationContext] = notification.useNotification();
  const [modal, contextHolder] = Modal.useModal();
  const method = Form.useWatch("method", form);
  const timer = useRef(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editSettlement, setEditSettlement] = useState(null);
  const [settlements, setSettlements] = useState({
    data: [],
    total: 0,
  })
  const userData = useContext(PermissionContext)
  const [filters, setFilters] = useState({
    code: userData?.vendorCode ? userData?.vendorCode : null,

  });
  const [vendorOptions,setVendorOptions]=useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    take: 20,
  })
  const { data, total } = settlements;
  // const merchants = useSelector(state => state?.merchant?.data);
  const navigate = useNavigate()

  // useEffect(() => {
  //   handleGetSettlements();
  // }, []);

  // useEffect(() => {
  //   // reset the pagination
  //   // if anything changes in filters
  //   setPagination({
  //     page: 1,
  //     take: 20,
  //   })
  // }, [filters]);

  useEffect(() => {
    handleGetSettlements({
      ...pagination,
      ...filters,
    }, false);
  }, [pagination, filters])

  const handleGetSettlements = (queryObj = {}, debounced = false) => {
    if (!debounced) {
      getSettlementList({
        ...queryObj,
        // code: String(userData?.vendorCode) || queryObj.code || null,
        code: queryObj.code || "",

      });
      return;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      getSettlementList({
        ...queryObj,
        // code: String(userData?.vendorCode) || queryObj.code || null,
        code: queryObj.code || "",
      });
    }, 1500);
  }

  const getSettlementList = async (queryObj) => {
    const query = getQueryFromObject(queryObj);
    setIsLoading(true);
    const res = await getApi(`/getall-vendorsettlement${query}`);
    setIsLoading(false);
    if (res?.error?.error?.response?.status === 401) {
      NotificationManager.error(res?.error?.message, 401);
      localStorage.clear();
      navigate('/')
    }
    const data = res?.data?.data;
    setSettlements({
      data: data?.data || [],
      total: data?.totalRecords || 0,
    })
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

    setAddLoading(true);
    const res = await postApi("/create-vendorsettlement", data);
    setAddLoading(false);
    if (res.error) {
      api.error({ description: res.error.message });
      return;
    }
    handleToggleModal();
    getSettlementList();

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

    setEditSettlement({
      ...data.record,
      key: data.key
    });
  }

  const handleResetSettlement = async (id) => {
    const isReset = await modal.confirm({
      title: "Confirmation",
      type: "confirm",
      content: "Are you sure you want to reset your settlement?",
    });

    if (isReset) {
      handelUpdateSettlement({
        status: "INITIATED"
      }, id);
    }
  }

  const handelUpdateSettlement = async (data, id) => {
    const settlementId = editSettlement?.id || id;
    if (!settlementId) {
      return;
    }
    setIsLoading(true);
    const res = await putApi(`/update-vendorsettlement/${settlementId}`, data);
    setIsLoading(false);
    if (res.error) {
      return;
    }
    setEditSettlement(null);
    handleGetSettlements();
  }
useEffect(()=>{
  getAllVendors()
},[])


  const getAllVendors=async ()=>{
    const vendors = await getApi('/getall-vendor')
    const merchantOptions = vendors?.data?.data
      ?.filter(merchant => !userData?.vendorCode || merchant?.vendor_code === userData?.vendorCode)
    .map(merchant => ({
      label: merchant.vendor_code,
      value: merchant.vendor_code,
    }));
    setVendorOptions(merchantOptions)
  }

  const labelCol = { span: 6 };
  //reset search fields
  const handleResetSearchFields = () => {
    setFilters({})
  }

  return (
    <section className=''>
      {contextHolder}
      {notificationContext}
      <div className='bg-white rounded-[8px] p-[8px]'>
        <div className='flex justify-between mb-[10px] max-[500px]:flex-col max-[500px]:gap-[10px]'>
          <p className='text-lg font-medium p-[5px]'>Vendor Settlement List</p>
          <div className='flex items-start gap-4 max-[500px]:justify-end'>
            <div className='flex flex-col items-start'>
              <Button
                icon={<PlusOutlined />}
                type='primary'
                onClick={handleToggleModal}
              >
                New Settlement
              </Button>
              <Button className='mt-2 w-full' onClick={handleResetSearchFields}>Reset</Button>
            </div>
            <Button type="text" className='rounded-full h-[40px] w-[40px] p-[0px]' onClick={() => handleGetSettlements({ ...pagination, ...filters })}>
              <RedoOutlined size={24} className="rotate-[-90deg]" />
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <TableComponent
            loading={isLoading}
            data={data}
            merchantOptions={vendorOptions}
            filters={filters}
            onFilterChange={onFilterChange}
            updateSettlementStatus={updateSettlementStatus}
            userData={userData}
          />
        </div>
        <div className='flex justify-end mt-[10px]'>
          <Pagination
            total={total}
            pageSize={pagination.take}
            current={pagination.page}
            showTotal={handleShowTotal}
            onChange={handlePageChange}
            pageSizeOptions={[20, 50, 100]}
            showSizeChanger
          />
        </div>
      </div>

      <Modal
        title="Settlement"
        open={!!editSettlement}
        onCancel={() => setEditSettlement(null)}
        footer={false}
        destroyOnClose
      >
        <Form layout="vertical" onFinish={handelUpdateSettlement}>
          {
            editSettlement?.key == "approve" ?
              <Form.Item name="refrence_id" label="UTR Number" rules={RequiredRule}>
                <Input size="large" />
              </Form.Item> :
              <Form.Item name="rejected_reason" label="Reason" rules={RequiredRule}>
                <Select
                  options={reasonOptions}
                />
              </Form.Item>
          }
          <Button
            type="primary"
            htmlType="submit"
          >
            {
              editSettlement?.key == "approve" ? "Approve" : "Reject"
            }
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
            label="Vendor"
            rules={RequiredRule}
          >
            <Select
              options={vendorOptions}
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
      <NotificationContainer />
    </section>
  );
}
