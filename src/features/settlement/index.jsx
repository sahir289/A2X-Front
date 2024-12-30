import { PlusOutlined, RedoOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Pagination,
  Select,
  notification,
} from "antd";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useNavigate } from "react-router-dom";
import { PermissionContext } from "../../components/AuthLayout/AuthLayout";
import { getApi, postApi, putApi } from "../../redux/api";
import {
  RequiredRule,
  getQueryFromObject,
  reasonOptions,
} from "../../utils/utils";
import TableComponent, { methodOptions } from "./components/Table";

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
  const [includeSubMerchant, setIncludeSubMerchant] = useState(false);
  const [settlements, setSettlements] = useState({
    data: [],
    total: 0,
  });
  const userData = useContext(PermissionContext);
  const [filters, setFilters] = useState({
    code: userData?.code?.length ? userData?.code : null,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    take: 20,
  });
  const { data, total } = settlements;
  // const merchants = useSelector(state => state?.merchant?.data);
  const navigate = useNavigate();
  const [merchantOptions, setMerchantOptions] = useState([]);

  useEffect(() => {
    handleGetSettlements(
      {
        ...pagination,
        ...filters,
      },
      false
    );
  }, [pagination, filters]);

  useEffect(() => {
    let isMounted = true; // To avoid state updates on unmounted components
    const fetchMerchants = async () => {
      try {
        let merchant;
        if (
          userData.role === "ADMIN" ||
          userData.role === "TRANSACTIONS" ||
          userData.role === "OPERATIONS"
        ) {
          if (!includeSubMerchant) {
            merchant = await getApi("/getall-merchant-grouping", {
              page: 1,
              pageSize: 1000,
            });
          } else {
            merchant = await getApi("/getall-merchant", {
              page: 1,
              pageSize: 1000,
            });
          }
        } else {
          merchant = await getApi("/getall-merchant", {
            page: 1,
            pageSize: 1000,
          });
        }

        if (isMounted) {
          const options = merchant?.data?.data?.merchants
            ?.filter(
              (merchant) =>
                !merchant.is_deleted &&
                (!userData?.code?.length ||
                  userData?.code?.includes(merchant?.code))
            )
            .map((merchant) => ({
              label: merchant.code,
              value: merchant.code,
            }))
            .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by the label

          setMerchantOptions(options); // Update state
        }
      } catch (error) {
        console.error("Error fetching merchants:", error);
      }
    };

    fetchMerchants();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [includeSubMerchant]);

  const handleGetSettlements = (queryObj = {}, debounced = false) => {
    if (!debounced) {
      getSettlementList({
        ...queryObj,
        // code: queryObj?.code || String(userData?.code[0]),
        code: queryObj?.code || "",
      });
      return;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      getSettlementList({
        ...queryObj,
        // code: queryObj?.code || String(userData?.code[0]),
        code: queryObj?.code || "",
      });
    }, 1500);
  };

  const getSettlementList = async (queryObj) => {
    const query = getQueryFromObject(queryObj);
    setIsLoading(true);
    const res = await getApi(
      `/getall-settlement${query}&includeSubMerchant=${includeSubMerchant}`
    );
    setIsLoading(false);
    if (res?.error?.error?.response?.status === 401) {
      NotificationManager.error(res?.error?.message, 401);
      localStorage.clear();
      navigate("/");
    }
    const data = res?.data?.data;
    setSettlements({
      data: data?.data || [],
      total: data?.totalRecords || 0,
    });
  };

  const handleToggleModal = () => {
    setOpen(!open);
    form.resetFields();
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

  // Function to validate IFSC code using an API
  const validateIfscCode = async (ifsc) => {
    try {
      const response = await axios.get(`https://ifsc.razorpay.com/${ifsc}`);
      return response.data;
    } catch (error) {
      return null; // If invalid IFSC or error in API request
    }
  };

  const handleSubmit = async (data) => {
    setAddLoading(true);
    // Validate the IFSC code before proceeding

    if (data?.method === "BANK") {
      const ifscValidation = await validateIfscCode(data?.ifsc);
      if (!ifscValidation) {
        setAddLoading(false);
        api.error({
          message: "Invalid IFSC Code",
          description: "Please enter a valid IFSC code.",
        });
        return;
      }
    }

    const res = await postApi("/create-settlement", data);
    if (res?.error) {
      api.error({ description: res.error.message });
      return;
    }
    setAddLoading(false);
    handleToggleModal();
    getSettlementList();
    handleResetSearchFields();
  };

  const onFilterChange = async (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const updateSettlementStatus = (data) => {
    if (data.reset) {
      return handleResetSettlement(data.record?.id);
    }

    setEditSettlement({
      ...data.record,
      key: data.key,
    });
  };

  const handleResetSettlement = async (id) => {
    const isReset = await modal.confirm({
      title: "Confirmation",
      type: "confirm",
      content: "Are you sure you want to reset your settlement?",
    });

    if (isReset) {
      handelUpdateSettlement(
        {
          status: "INITIATED",
        },
        id
      );
    }
  };

  const handelUpdateSettlement = async (data, id) => {
    const settlementId = editSettlement?.id || id;
    if (!settlementId) {
      return;
    }
    if (editSettlement?.key == "approve" && editSettlement?.method !== "BANK") {
      data = {
        refrence_id: " ",
      };
    }
    setIsLoading(true);
    const res = await putApi(`/update-settlement/${settlementId}`, data);
    setIsLoading(false);
    if (res.error) {
      return;
    }
    setEditSettlement(null);
    handleResetSearchFields();
    handleGetSettlements();
  };

  const labelCol = { span: 6 };
  //reset search fields
  const handleResetSearchFields = () => {
    setFilters({});
  };

  return (
    <section className="">
      {contextHolder}
      {notificationContext}
      <div className="bg-white rounded-[8px] p-[8px]">
        <div className="flex justify-between mb-[10px] max-[500px]:flex-col max-[500px]:gap-[10px]">
          <p className="text-lg font-medium p-[5px]">Settlement List</p>
          <div className="flex items-start gap-4 max-[500px]:justify-end">
            <div className="flex flex-col items-start">
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={handleToggleModal}
              >
                New Settlement
              </Button>
              <Button className="mt-2 w-full" onClick={handleResetSearchFields}>
                Reset
              </Button>
            </div>
            <Button
              type="text"
              className="rounded-full h-[40px] w-[40px] p-[0px]"
              onClick={() =>
                handleGetSettlements({ ...pagination, ...filters })
              }
            >
              <RedoOutlined size={24} className="rotate-[-90deg]" />
            </Button>
          </div>
        </div>
        <div
          className="flex"
          style={{ justifySelf: "end", marginRight: "40px" }}
        >
          {(userData.role === "ADMIN" ||
            userData.role === "TRANSACTIONS" ||
            userData.role === "OPERATIONS") && (
            <Checkbox
              onClick={() => {
                setIncludeSubMerchant((prevState) => !prevState);
              }}
            >
              <span style={{ color: "cornflowerblue" }}>
                Include Sub Merchant
              </span>
            </Checkbox>
          )}
        </div>
        <div className="overflow-x-auto">
          <TableComponent
            loading={isLoading}
            data={data}
            merchantOptions={merchantOptions}
            filters={filters}
            onFilterChange={onFilterChange}
            updateSettlementStatus={updateSettlementStatus}
            userData={userData}
          />
        </div>
        <div className="flex justify-end mt-[10px]">
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
          {editSettlement?.key == "approve" ? (
            editSettlement?.method == "BANK" ? (
              <Form.Item
                name="refrence_id"
                label="UTR Number"
                rules={[{ RequiredRule }]}
              >
                <Input size="large" />
              </Form.Item>
            ) : null
          ) : (
            <Form.Item
              name="rejected_reason"
              label="Reason"
              rules={RequiredRule}
            >
              <Select options={reasonOptions} />
            </Form.Item>
          )}
          {editSettlement?.key == "approve" &&
          editSettlement?.method !== "BANK" ? (
            <div>
              <h5> Are you sure to approve? </h5>
            </div>
          ) : null}
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {editSettlement?.key == "approve" ? "Approve" : "Reject"}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Add Settlement"
        onCancel={handleToggleModal}
        open={open}
        footer={false}
      >
        <Form
          form={form}
          className="pt-[10px]"
          labelAlign="left"
          labelCol={labelCol}
          onFinish={handleSubmit}
        >
          <Form.Item name="code" label="Merchant" rules={RequiredRule}>
            <Select showSearch options={merchantOptions} />
          </Form.Item>
          <Form.Item name="amount" label="Amount" rules={RequiredRule}>
            <Input type="number" addonAfter="₹" />
          </Form.Item>
          <Form.Item name="method" label="Method" rules={RequiredRule}>
            <Select options={methodOptions} />
          </Form.Item>
          {method === "BANK" && (
            <>
              <Form.Item name="acc_name" label="Name" rules={RequiredRule}>
                <Input />
              </Form.Item>
              <Form.Item
                name="acc_no"
                label="Bank Details"
                rules={RequiredRule}
              >
                <Input />
              </Form.Item>
              <Form.Item name="ifsc" label="IFSC" rules={RequiredRule}>
                <Input />
              </Form.Item>
            </>
          )}
          {method === "CRYPTO" && (
            <>
              <Form.Item name="wallet" label="Wallet" rules={RequiredRule}>
                <Input />
              </Form.Item>
              <Form.Item
                name="wallet_address"
                label="Wallet Address"
                rules={RequiredRule}
              >
                <Input />
              </Form.Item>
            </>
          )}
          <div className="flex justify-end">
            <Button type="primary" loading={addLoading} htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>
      <NotificationContainer />
    </section>
  );
}
