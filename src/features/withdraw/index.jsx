import { PlusOutlined, RedoOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  notification,
  Pagination,
  Select,
} from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PermissionContext } from "../../components/AuthLayout/AuthLayout";
import { getApi, postApi, putApi } from "../../redux/api";
import {
  getQueryFromObject,
  reasonOptions,
  RequiredRule,
} from "../../utils/utils";
import Table from "./components/Table";

const Withdraw = ({ type }) => {
  const timer = useRef(null);
  const userData = useContext(PermissionContext);
  const navigate = useNavigate();

  const [modal, contextHolder] = Modal.useModal();
  const [api, notificationContext] = notification.useNotification();
  const [filters, setFilters] = useState({
    code: userData?.code || "",
    vendorCode:userData?.vendorCode || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addWithdraw, setAddWithdraw] = useState(false);
  const [addVendor, setAddVendor] = useState(false);
  const [editWithdraw, setEditWithdraw] = useState(null);
  const [selectedUTRMethod, setSelectedUTRMethod] = useState();
  const [selectedData, setSelectedData] = useState([]);
  const [withdraws, setWithdraws] = useState({
    data: [],
    total: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    take: 20,
  });

  const merchantData = useSelector((state) => state.merchant.data);
  const merchantOptions = merchantData
    ?.filter(merchant => !userData?.code?.length || userData?.code.includes(merchant.code))
    .map(merchant => ({
      label: merchant.code,
      value: merchant.code,
    }));


  useEffect(() => {
    handleGetWithdraws();
  }, []);

  useEffect(() => {
    setPagination({
      page: 1,
      take: 20,
    });
  }, [filters]);

  useEffect(() => {
    handleGetWithdraws(
      {
        ...pagination,
        ...filters,
      },
      true
    );
  }, [pagination, filters]);

  const handleToggleModal = () => {
    setAddWithdraw(!addWithdraw);
  };

  const handleToggleAddVendorModal = () => {
    setAddVendor(!addVendor);
  };

  const handleGetWithdraws = async (queryObj = {}, debounced = false) => {
    if (!debounced) {
      getPayoutList({
        ...queryObj,
        code: userData?.code || queryObj.code || null,
        vendorCode:userData?.vendorCode || queryObj.code || null,
      });
      return;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      getPayoutList({
        ...queryObj,
        code: userData?.code || queryObj.code || null,
        vendorCode:userData?.vendorCode || queryObj.code || null,
      });
    }, 1500);
  };

  const getPayoutList = async (queryObj) => {
    const queryObject = {
      ...queryObj,
    };
    if (!queryObject.status) {
      queryObject.status =
        type == "In Progress"
          ? "INITIATED"
          : type == "Completed"
            ? "SUCCESS"
            : "";
    }
    const query = getQueryFromObject(queryObject);
    setIsLoading(true);
    const res = await getApi(`/getall-payout${query}`);
    setIsLoading(false);
    if (res?.error?.error?.response?.status === 401) {
      NotificationManager.error(res?.error?.message, 401);
      localStorage.clear();
      navigate("/");
    }
    const data = res?.data?.data;
    setWithdraws({
      data: data?.data || [],
      total: data?.totalRecords || 0,
    });
  };

  const handleUpdateWithdraw = async (data) => {
    if (!data?.record?.id) {
      return;
    }
    if (data.reset) {
      return handleResetWithdraws(data.record.id);
    }
    setSelectedUTRMethod("manual");
    setEditWithdraw({
      ...data.record,
      key: data.key,
    });
  };

  const updateWithdraw = async (data, id) => {
    const withdrawId = editWithdraw?.id || id;
    if (!withdrawId) {
      return;
    }
    setIsLoading(true);
    const res = await putApi(`/update-payout/${withdrawId}`, data);
    setIsLoading(false);
    if (res.error) {
      return;
    }
    setEditWithdraw(null);
    handleGetWithdraws();
  };

  const handleResetWithdraws = async (id) => {
    const isReset = await modal.confirm({
      title: "Confirmation",
      type: "confirm",
      content: "Are you sure you want to reset your withdrawal?",
    });

    if (isReset) {
      updateWithdraw(
        {
          status: "INITIATED",
        },
        id
      );
    }
  };

  const onFilterChange = async (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handlePageChange = (page, pageSize) => {
    setPagination({
      page,
      take: pageSize,
    });
  };

  const handleShowTotal = (total, range) => {
    if (!total) {
      return;
    }
    return (
      <p className="text-base">
        {range[0]}-{range[1]} of {total} items
      </p>
    );
  };

  const handleSubmit = async (data) => {
    setAddLoading(true);

    const res = await postApi("/create-payout", { ...data, vendor_code: userData?.vendorCode });
    setAddLoading(false);
    if (res.error) {
      api.error({ description: res.error.message });
      return;
    }
    handleToggleModal();
    handleGetWithdraws();
  };

  const handleAddVendor = async (data) => {
    setAddLoading(true);
    let apiData = {
      vendorCode: data.code,
      merchantCode: {selectedData}
    }

    const res = await postApi("/update-vendor-code", apiData);
    setAddLoading(false);
    if (res.error) {
      api.error({ description: res.error.message });
      return;
    }
    handleToggleAddVendorModal();
  };

  const handleData = (data) => {
    setSelectedData(data)
  // console.log("🚀 ~ selectedData:", selectedData)
  }

  //Select UTR Method
  const handleSelectUTRMethod = (selectedMethod) => {
    setSelectedUTRMethod(selectedMethod);
  };

  //reset search fields
  const handleResetSearchFields = () => {
    setFilters({});
  };

  const hasSelected = selectedData.length > 0;

  return (
    <section>
      {contextHolder}
      {notificationContext}
      <div className="bg-white rounded-[8px] p-[8px] font-serif">
        <div className="flex justify-between mb-[10px] max-[500px]:flex-col max-[500px]:gap-[10px]">
          <p className="text-lg font-medium p-[5px]">{type}</p>
          <div className="flex items-start gap-4 max-[500px]:justify-end">
            <div className="flex flex-col items-start">
              {!(userData?.role === "VENDOR" || userData?.role === "VENDOR_OPERATIONS") &&
                (<Button
                  icon={<PlusOutlined />}
                  type="primary"
                  onClick={handleToggleModal}
                >
                  New Payout
                </Button>)}

              <Button className="mt-2 w-full" onClick={handleResetSearchFields}>
                Reset
              </Button>
            </div>
            <Button
              type="text"
              className="rounded-full h-[40px] w-[40px] p-[0px] flex items-center justify-center"
              onClick={() => handleGetWithdraws({ ...pagination, ...filters })}
            >
              <RedoOutlined size={24} className="rotate-[-90deg]" />
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table
            loading={isLoading}
            data={withdraws.data}
            filters={filters}
            merchantOptions={merchantOptions}
            onFilterChange={onFilterChange}
            updateWithdraw={handleUpdateWithdraw}
            type={type}
            userData={userData}
            setSelectedData={handleData}
          />
        </div>
        <div className="flex justify-end mt-[10px]">
          <Pagination
            total={withdraws.total}
            pageSize={pagination.take}
            current={pagination.page}
            showTotal={handleShowTotal}
            onChange={handlePageChange}
            pageSizeOptions={[20, 50, 100]}
            showSizeChanger
          />
        </div>
        <div className="flex justify-end mt-[10px]">
          {hasSelected ? `${selectedData.length} item has been selected` : null}

          <Button
            className="ml-[20px]"
            icon={<PlusOutlined />}
            type="primary"
            onClick={handleToggleAddVendorModal}
          >
            Add Vendor
          </Button>
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
          {editWithdraw?.key == "approve" && (
            <>
              <Form.Item name="method" label="Method">
                <Select
                  options={[
                    { value: "manual", key: "manual" },
                    { value: "accure", key: "accure" },
                  ]}
                  onChange={handleSelectUTRMethod}
                  defaultValue={selectedUTRMethod}
                />
              </Form.Item>
              {selectedUTRMethod === "manual" && (
                <Form.Item
                  name="utr_id"
                  label="UTR Number"
                  rules={RequiredRule}
                >
                  <Input />
                </Form.Item>
              )}
            </>
          )}
          {editWithdraw?.key == "reject" && (
            <>
              <Form.Item
                name="rejected_reason"
                label="Reason"
                rules={RequiredRule}
              >
                <Select options={reasonOptions} />
              </Form.Item>
            </>
          )}
          <Button type="primary" htmlType="submit">
            {editWithdraw?.key == "approve" ? "Approve" : "Reject"}
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
            <Select options={merchantOptions} />
          </Form.Item>
          <Form.Item
            name="user_id"
            label="User ID (Account)"
            rules={RequiredRule}
          >
            <Input />
          </Form.Item>
          <Form.Item name="bank_name" label="Bank Name">
            <Input />
          </Form.Item>
          <Form.Item name="acc_no" label="Account Number" rules={RequiredRule}>
            <Input />
          </Form.Item>
          <Form.Item
            name="acc_holder_name"
            label="Account Holder Name"
            rules={RequiredRule}
          >
            <Input />
          </Form.Item>
          <Form.Item name="ifsc_code" label="IFSC code" rules={RequiredRule}>
            <Input />
          </Form.Item>
          <Form.Item name="amount" label="Amount" rules={RequiredRule}>
            <Input addonAfter="₹" />
          </Form.Item>
          <div className="flex justify-end items-center gap-2">
            <Button>Cancel</Button>
            <Button type="primary" loading={addLoading} htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Add Vendor"
        open={addVendor}
        onCancel={handleToggleAddVendorModal}
        footer={false}
        width={600}
        destroyOnClose
      >
        <Form labelAlign="left" labelCol={{ span: 8 }} onFinish={handleAddVendor}>
          <Form.Item name="code" label="Vendor Code" rules={RequiredRule}>
            <Select options={merchantOptions} mode="multiple"/>
          </Form.Item>
          <div className="flex justify-end items-center gap-2">
            <Button>Cancel</Button>
            <Button type="primary" loading={addLoading} htmlType="submit">
              Add
            </Button>
          </div>
        </Form>
      </Modal>
      <NotificationContainer />
    </section>
  );
};

export default Withdraw;
