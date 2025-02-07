import { EyeInvisibleOutlined, EyeTwoTone, PlusOutlined, RedoOutlined } from "@ant-design/icons";
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
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PermissionContext } from "../../components/AuthLayout/AuthLayout";
import { getApi, postApi, postApiForWithdrawCreation, putApi } from "../../redux/api";
import {
  RequiredRule,
  getQueryFromObject,
  reasonOptions,
  withdrawlMethods,
} from "../../utils/utils";
import Table from "./components/Table";

const Withdraw = ({ type }) => {
  const style = {
    width: "calc(100% - 256px)",
  };

  const timer = useRef(null);
  const userData = useContext(PermissionContext);
  const navigate = useNavigate();


  const [modal, contextHolder] = Modal.useModal();
  const [api, notificationContext] = notification.useNotification();
  const [filters, setFilters] = useState({
    code: `${userData?.code || ""}`,
    vendorCode: `${userData?.vendorCode || ""}`,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addWithdraw, setAddWithdraw] = useState(false);
  const [addVendor, setAddVendor] = useState(false);
  const [editWithdraw, setEditWithdraw] = useState(null);
  const [editWithdrawALL, setEditWithdrawALL] = useState(null);

  const [selectedUTRMethod, setSelectedUTRMethod] = useState("manual");
  const [includeSubMerchant, setIncludeSubMerchant] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [verification, setVerification] = useState(false);
  const [selectdatapayout,setSelectdatapayout] = useState(false);
  const [withdraws, setWithdraws] = useState({
    data: [],
    total: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    take: 20,
  });
  const [selectedMerchant, setSelectedMerchant] = useState("");
  const [ekoBalance, setEkoBalance] = useState(0);
  const merchantData = useSelector((state) => state.merchant.data);
  const [merchantOptions, setMerchantOptions] = useState([]);
  const [form] = Form.useForm();
  const [verificationForm] = Form.useForm();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const labelCol = { span: 10 };

  useEffect(() => {
    let isMounted = true; // To avoid state updates on unmounted components
    const fetchMerchants = async () => {
      try {
        let merchant;
        const groupingRoles = ["TRANSACTIONS", "OPERATIONS", "ADMIN"];
        const merchantRoles = ["MERCHANT", "MERCHANT_OPERATIONS", "MERCHANT_ADMIN"];
        const options = { page: 1, pageSize: 1000 };

        let endpoint = "";

        const merchantCodeParam = userData.code?.[0] ? `?merchantCode=${userData.code[0]}` : "";

        if (!includeSubMerchant) {
          endpoint = groupingRoles.includes(userData.role)
            ? "/getall-merchant-grouping"
            : `/getall-merchant${userData.role === "MERCHANT_ADMIN" ? `-grouping${merchantCodeParam}` : merchantCodeParam}`;
        } else {
          endpoint = merchantRoles.includes(userData.role)
            ? `/getall-merchant${merchantCodeParam}`
            : "/getall-merchant";
        }

        merchant = await getApi(endpoint, options);

        if (isMounted) {
          let options;
          if (userData.role === "MERCHANT_ADMIN" && includeSubMerchant) {
            const mergedMerchants = merchant.data.data.merchants.flatMap(merchant => {
              return [merchant, ...(merchant.subMerchants || [])];
            });
            options = mergedMerchants
              ?.filter(
                (merchant) =>
                  !merchant.is_deleted &&
                  (!userData?.code?.length || userData?.code?.includes(merchant?.code))
              )
              .map((merchant) => ({
                label: merchant.code,
                value: merchant.code,
              }))
              .sort((a, b) => a.label.localeCompare(b.label));
          }
          else {
            options = merchant?.data?.data?.merchants
              ?.filter(
                (merchant) =>
                  !merchant.is_deleted &&
                  (!userData?.code?.length || userData?.code?.includes(merchant?.code))
              )
              .map((merchant) => ({
                label: merchant.code,
                value: merchant.code,
              }))
              .sort((a, b) => a.label.localeCompare(b.label));
          }

          setMerchantOptions(options); 
        }
      } catch (error) {
        console.error("Error fetching merchants:", error);
      }
    };

    const allowedRoles = ["MERCHANT", "MERCHANT_OPERATIONS", "MERCHANT_ADMIN", "ADMIN", "TRANSACTIONS", "OPERATIONS"]
    if (userData.role && allowedRoles.includes(userData.role)) {
      fetchMerchants();
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [includeSubMerchant]);

  const [vendorData, setVendorData] = useState([]);
  const vendorOptions = vendorData
    ?.map((vendor) => ({
      label: vendor.vendor_code,
      value: vendor.vendor_code,
    }))
    .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by the label
  // State to store the payout banks
  const [payOutBankData, setPayOutBankData] = useState([]);
  const payOutBankOptions = payOutBankData?.map((payOutBank) => ({
    label: payOutBank.ac_name,
    value: payOutBank.ac_name,
  }));
  const [filterValues, setFilterValues] = useState({
    vendor_code: `${userData?.vendorCode}`,
  });

  const methodOptions =
    userData?.role === "ADMIN" ||
      userData?.role === "TRANSACTIONS" ||
      userData?.role === "OPERATIONS"
      ? withdrawlMethods
      : [{ value: "manual", label: "Manual", key: "manual" }];

  useEffect(() => {
    handleGetWithdraws();
    const allowedRoles = ["VENDOR", "VENDOR_OPERATIONS", "ADMIN", "TRANSACTIONS", "OPERATIONS"]
    if (userData.role && allowedRoles.includes(userData.role)) {
      fetchUsersData();
    }
    const allowedRole1 = ["VENDOR", "VENDOR_OPERATIONS", "ADMIN", "TRANSACTIONS", "OPERATIONS"]
    if (userData.role && allowedRole1.includes(userData.role)) {
      fetchPayoutBankData(); // get payout bank data
    }
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

  const handleToggleVerificationModal = () => {
    setVerification(!verification);
    verificationForm.resetFields();
  }

  const handleToggleAddVendorModal = () => {
    setAddVendor(!addVendor);
  };

  const handleGetWithdraws = async (queryObj = {}, debounced = false) => {
    if (!debounced) {
      getPayoutList({
        ...queryObj,
        code: userData?.code || queryObj.code || null,
        vendorCode: userData?.vendorCode || queryObj.vendorCode || null,
      });
      return;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const isAdminOrTransactions =
        userData.role === "ADMIN" ||
        userData.role === "TRANSACTIONS" ||
        userData.role === "OPERATIONS";
      const isMerchantAdmin = userData.role === "MERCHANT_ADMIN";

      const updatedQuery = {
        ...queryObj,
        code: isAdminOrTransactions
          ? queryObj.code || null
          : isMerchantAdmin
            ? queryObj.code || userData?.code
            : userData?.code || queryObj.code || null,
        ...(isAdminOrTransactions
          ? {}
          : {
            vendorCode: userData?.vendorCode || queryObj.vendorCode || null,
          }),
      };
      getPayoutList(updatedQuery);
    }, 1500);
  };

  const fetchUsersData = async () => {
    let res = "";

    if (userData.role === "VENDOR" || userData.role === "VENDOR_OPERATION") {
      res = await getApi(`/getall-vendor?vendor_code=${userData.vendorCode}`)
    }
    else {
      res = await getApi("/getall-vendor")
    }
    setVendorData(res?.data?.data);
  };

  //Function to fetch all the payout banks
  const fetchPayoutBankData = async () => {
    const res = await getApi("/get-payout-bank", filterValues);
    setPayOutBankData(res?.data?.data);
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
    if (queryObj?.vendor_code) {
      queryObject.vendorCode = queryObj.vendor_code;
      delete queryObject.vendor_code;
    }
    queryObject.includeSubMerchant = includeSubMerchant;
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
    if (!data?.record?.id||data.ids) {
      return;
    }
    if (data.reset) {
      return handleResetWithdraws(data.record.id);
    }
    // setSelectedUTRMethod("manual");
    setEditWithdraw({
      ...data.record,
      key: data.key,
    });

  };
 useEffect(()=>{

 },[selectedData])
  const updateWithdrawALL = async (data) => {
    // console.log(data, "dta from modal");
    // console.log(editWithdrawALL?.record, "ids from editWithdrawALL");
    const withdrawIds = editWithdrawALL?.record;
    if (!withdrawIds) {
      // console.log("No withdrawIds found");
      return;
    }
    const result = withdrawIds.map(item => ({
      id: item,
      method: "eko"
    }));

    // console.log(result, "Formatted result for API");

    setIsLoading(true);

    try {
      const res = await putApi("/update-all-payout", result);
      setIsLoading(false);

      // console.log(res, "response from API");

      if (res && !res.error) {
        console.log("Successfully updated payout");
        setSelectdatapayout(true);
        setEditWithdrawALL(null);
        setSelectedData([]);
        setSelectedUTRMethod("manual");
        handleGetWithdraws({ ...pagination, ...filters }, true);
      } else {
        console.error("Error from API", res.error);
      }
    } catch (error) {
      console.error("API call failed", error);
      setIsLoading(false);
    }
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
    setSelectedUTRMethod("manual");
    handleGetWithdraws({ ...pagination, ...filters }, true);
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
          status: "REJECTED",
          rejected_reason: "Invalid Bank Details",
          rejected_at: new Date()
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
    const ifscValidation = true;
    // await validateIfscCode(data?.ifsc_code);
    if (!ifscValidation) {
      setAddLoading(false);
      api.error({
        message: "Invalid IFSC Code",
        description: "Please enter a valid IFSC code.",
      });
      return;
    }
    const payOutAmount = parseFloat(data.amount);
    const merchant = merchantData.find((element) => element.code === data.code);

    // Validate if the amount is within the ranges
    const minPayout = parseFloat(merchant.min_payout);
    const maxPayout = parseFloat(merchant.max_payout);
    // Check if the amount is within the valid range
    if (payOutAmount < minPayout || payOutAmount > maxPayout) {
      notification.error({
        message: `Amount must be between ${minPayout} and ${maxPayout}!`,
      });

      setAddLoading(false);
      return;
    }

    const merchantList = ['DHM', 'APPLE', 'CB', 'RK', 'MafiaMundeer', 'BERU', 'luna', 'Bita', 'treX']
    // if (merchantList.includes(merchant.code)) {
    //   const res = await getApi(
    //     `/get-merchants-net-balance?merchantCode=${merchant.code}`,
    //   );
    //   const balance = res?.data?.data?.totalNetBalance;
    //   const ekoRes = await getApi("/eko-wallet-balance-enquiry");
    //   const ekoBalance1 = ekoRes?.data?.data?.balance;

    //   if (balance <= 0 && payOutAmount <= balance) {
    //     notification.error({
    //       message: `Insufficient Balance!`,
    //     });

    //     setAddLoading(false);
    //     return;
    //   }
    //   else if (payOutAmount < ekoBalance1) {
    //     notification.error({
    //       message: `Insufficient Balance!`,
    //     });

    //     setAddLoading(false);
    //     return;
    //   }
    // }

    const res = await postApiForWithdrawCreation(
      "/create-payout",
      { ...data, vendor_code: userData?.vendorCode },
      { "x-api-key": `${selectedMerchant?.api_key}` }
    )
      .then((res) => {
        if (res?.error) {
          api.error({ description: res.error.message });
          return;
        }
        else if (merchantList.includes(merchant.code)) {
          const data = { method: 'eko' };
          const id = res?.data?.data?.payoutId;
          updateWithdraw(data, id);
          handleGetWithdraws({ ...pagination, ...filters }, true);
        }
      })
      .catch((err) => { })
      .finally(() => {
        setAddLoading(false);
        handleToggleModal();
        handleGetWithdraws();
        setSelectedMerchant("");
      });
  };

  const handleAddVendor = async (data) => {
    setAddLoading(true);
    let apiData = {
      withdrawId: selectedData,
      // here i have changed code to vendor code.
      vendorCode: data.vendorCode.toString(),
    };

    const res = await putApi("/update-vendor-code", apiData);
    setAddLoading(false);
    if (res.error) {
      api.error({ description: res.error.message });
      return;
    }
    handleToggleAddVendorModal();
    setSelectedData([]);
    handleGetWithdraws();
  };

  const handleData = (data) => {
    setSelectedData(data);
  };

  //Select UTR Method
  const handleSelectUTRMethod = (selectedMethod) => {
    setSelectedUTRMethod(selectedMethod);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (selectedUTRMethod === "eko") {
        try {
          const res = await getApi("/eko-wallet-balance-enquiry");
          setEkoBalance(Number(res?.data?.data?.data?.balance));
        } catch (error) {
          console.error("Error fetching API:", error);
        }
      }
    };

    fetchData();
  }, [selectedUTRMethod]);

  //reset search fields
  const handleResetSearchFields = () => {
    setFilters({});
    setSelectedUTRMethod("manual");
  };
  const handleDownloadExcel = () => { };
  const hasSelected = selectedData.length > 0;
  ///total amount from selected rows
  const AmountEko = selectedData.reduce((sum, item) => sum + parseFloat(item[1]), 0);
  ///selected ids
  const idsArray = selectedData.map(item => item[0]);
//   console.log(idsArray,"id from eko");
// console.log(AmountEko,"sum from eko");
  const handleEditSubmit = async () => {
    setAddLoading(true);
    try {
      const updatedValues = await form.validateFields();
      const updatedData = {
        utr_id: updatedValues.utr_id,
        status: selectedRecord.status
      };
      const res = await putApi(`/update-payout/${selectedRecord.id}`, updatedData);
      setAddLoading(false);
      if (res?.data?.statusCode === 200) {
        NotificationManager.success(res?.data?.message);
      }
      setIsEditModalVisible(false);
      handleGetWithdraws({ ...pagination, ...filters }, true);
    } catch (error) {
      console.log("Edit failed:", error);
    }
  }

  const verifyPassword = async (data) => {
    setAddLoading(true);
    const verifyPasswordData = {
      userName: userData.userName,
      password: data.password,
    };
    const res = await postApi("/verify-password", verifyPasswordData);
    setAddLoading(false);
    if (res?.data?.statusCode === 200) {
      setIsEditModalVisible(true);
      handleToggleVerificationModal();
    } else {
      NotificationManager.error(res?.error?.message);
    }
  };

  return (
    <section>
      {contextHolder}
      {notificationContext}
      <div className="bg-white rounded-[8px] p-[8px] font-serif">
        <div className="flex justify-between mb-[10px] max-[500px]:flex-col max-[500px]:gap-[10px]">
          <p className="text-lg font-medium p-[5px]">{type}</p>
          <div className="flex items-start gap-4 max-[500px]:justify-end">
            <div className="flex flex-col items-end">
              {!(
                userData?.role === "VENDOR" ||
                userData?.role === "VENDOR_OPERATIONS"
              ) && (
                  <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={handleToggleModal}
                  >
                    New Payout
                  </Button>
                )}
              <div className="flex gap-2">
                <Button
                  className="mt-2 w-full"
                  onClick={handleResetSearchFields}
                >
                  Reset
                </Button>
                <Button
                  className="mt-2 w-full"
                  type="primary"
                  onClick={handleDownloadExcel}
                >
                  Download Excel
                </Button>
              </div>
            </div>
            <Button
              type="text"
              className="rounded-full h-[40px] w-[40px] p-[0px] flex items-center justify-center"
              onClick={() => {
                handleGetWithdraws({ ...pagination, ...filters }, true);
                setSelectedUTRMethod("manual");
              }}
            >
              <RedoOutlined size={24} className="rotate-[-90deg]" />
            </Button>
          </div>
        </div>
        <div className="flex" style={{ justifySelf: "end", marginRight: "40px" }}>
          {(userData.role === "ADMIN" || userData.role === "TRANSACTIONS" || userData.role === "OPERATIONS" || userData.role === "MERCHANT_ADMIN") && <Checkbox
            onClick={() => {
              setIncludeSubMerchant((prevState) => !prevState);
            }}
          >
            <span style={{ color: "cornflowerblue" }}>Include Sub Merchant</span>
          </Checkbox>}
        </div>
        <div className="overflow-x-auto">
          <Table
            loading={isLoading}
            data={withdraws.data}
            filters={filters}
            merchantOptions={merchantOptions}
            vendorOptions={vendorOptions}
            payOutBankOptions={payOutBankOptions} // Sending options of payout banks
            onFilterChange={onFilterChange}
            updateWithdraw={handleUpdateWithdraw}
            type={type}
            userData={userData}
            setSelectedData={handleData}
            selectedData={selectedData}
            selectdatapayout={selectdatapayout}
            setVerification={setVerification}
            setSelectedRecord={setSelectedRecord}
            form={form}
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
      </div>

      {hasSelected && selectedData.length>0 ? (
        <div className="fixed bottom-0 w-full z-99" style={style}>
          <div className="bg-white p-[8px] font-serif">
            <div className="flex justify-between">
              <div className="ml-[10px] text-black">
                <a className="font-semibold">{selectedData.length} </a>
                item has been selected
              </div>

            <div>
            <Button
              className="mr-[10px]"
              // icon={<PlusOutlined />}
              type="primary"
              onClick={() => {
                setEditWithdrawALL({
                  record: idsArray,
                  key: "approve",
                  amount: AmountEko,
                });
              }}
            >
              Approve
            </Button>

              <Button
                className="mr-[10px]"
                // icon={<PlusOutlined />}
                type="primary"
                onClick={handleToggleAddVendorModal}
              >
              Add Vendor
              </Button>
            </div>
            </div>
          </div>
        </div>
      ) : null}
  <Modal
  title="Withdraw"
  open={editWithdrawALL}
  onCancel={() => {
    setEditWithdrawALL(null);
    setSelectedUTRMethod("eko");
  }}
  footer={false}
  destroyOnClose
  getContainer={false}
>
  <Form
    layout="vertical"
    onFinish={updateWithdrawALL}
    initialValues={{
      // Do not include method here
    }}
  >
    {editWithdrawALL?.key === "approve" && (
      <>
        <Form.Item
          name="method"
          label="Method"
          rules={[
            {
              required: true,
              message: "Please select Withdrawal Method",
            },
          ]}
        >
          <Select
            options={methodOptions.filter(option => option.value === "eko")} // Filter to only show "eko"
            onChange={handleSelectUTRMethod}
          />
        </Form.Item>

        {selectedUTRMethod === "eko" && (
          <>
            <Form.Item label="Available Balance">
              <Input disabled={true} value={ekoBalance} />
              {editWithdrawALL.amount > ekoBalance && (
                <span className="text-red-600">
                  Insufficient Balance!
                </span>
              )}
            </Form.Item>
          </>
        )}
      </>
    )}

    {editWithdrawALL?.key === "reject" && (
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

    <Button
      type="primary"
      loading={isLoading}
      htmlType="submit"
      disabled={
        editWithdrawALL?.key === "approve" &&
        selectedUTRMethod === "eko" &&
        editWithdrawALL.amount > ekoBalance
      }
    >
      {editWithdrawALL?.key === "approve" ? "Approve" : "Reject"}
    </Button>
  </Form>
</Modal>


      <Modal
        title="Withdraw"
        open={editWithdraw}
        onCancel={() => {
          setEditWithdraw(null);
          setSelectedUTRMethod("manual");
        }}
        footer={false}
        destroyOnClose
        getContainer={false}

      >
        <Form
          layout="vertical"
          onFinish={updateWithdraw}
          initialValues={{
            method: selectedUTRMethod, // Set initial value for the "method" field
          }}
        >
          {editWithdraw?.key == "approve" && (
            <>
              <Form.Item
                name="method"
                label="Method"
                rules={[
                  {
                    required: true,
                    message: "Please select Withdrawal Method",
                  },
                ]}
              >
                <Select
                  options={methodOptions}
                  onChange={handleSelectUTRMethod}
                />
              </Form.Item>
              {selectedUTRMethod === "manual" && (
                <>
                  {/* Select to choose payout bank */}
                  <Form.Item name="from_bank" label="Select Bank">
                    <Select options={payOutBankOptions} />
                  </Form.Item>
                  <Form.Item
                    name="utr_id"
                    label="UTR Number"
                    rules={[
                      {
                        required: true,
                        message: "Please enter UTR no",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </>
              )}
              {selectedUTRMethod === "eko" && (
                <>
                  <Form.Item label="Available Balance">
                    <Input disabled={true} value={ekoBalance} />
                    {editWithdraw.amount > ekoBalance && (
                      <span className="text-red-600">
                        Insufficient Balance!
                      </span>
                    )}
                  </Form.Item>
                </>
              )}
              {/* {selectedUTRMethod === "blazepe"} */}
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
          <Button
            type="primary"
            loading={isLoading}
            htmlType="submit"
            disabled={
              editWithdraw?.key == "approve" &&
              selectedUTRMethod === "eko" &&
              editWithdraw.amount > ekoBalance
            }
          >
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
            <Select
              showSearch
              placeholder={""}
              defaultActiveFirstOption={false}
              options={merchantOptions}
              onSelect={(e) => {
                setSelectedMerchant(
                  merchantData?.find((item) => item.code === e)
                );
              }}
            />
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
          <Form.Item name="acc_no" label="Account Number">
            <Input
              type="number"
              onKeyUp={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>
          <Form.Item
            name="acc_holder_name"
            label="Account Holder Name"
            rules={[
              ...RequiredRule,
              {
                validator: (_, value) => {
                  if (!/^[A-Za-z\s]*$/.test(value)) {
                    return Promise.reject(
                      new Error("Name must contain only alphabets.")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              onKeyDown={(e) => {
                if (!/[A-Za-z\s]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>

          <Form.Item name="ifsc_code" label="IFSC code" rules={RequiredRule}>
            <Input />
          </Form.Item>
          <Form.Item name="amount" label="Amount" rules={RequiredRule}>
            <Input addonAfter="₹" min={1} />
          </Form.Item>
          <div className="flex justify-end items-center gap-2">
            <Button onClick={handleToggleModal}>Cancel</Button>
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
        <Form
          labelAlign="left"
          labelCol={{ span: 8 }}
          onFinish={handleAddVendor}
        >
          <Form.Item name="vendorCode" label="Vendor Code" rules={RequiredRule}>
            <Select options={vendorOptions} />
          </Form.Item>
          <div className="flex justify-end items-center gap-2">
            <Button type="primary" loading={addLoading} htmlType="submit">
              Add
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Edit UTR"
        open={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="UTR"
            name="utr_id"
            rules={[{ required: true, message: "Please enter UTR" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Password Verification"
        onCancel={handleToggleVerificationModal}
        open={verification}
        footer={false}
      >
        <Form
          form={verificationForm}
          className="pt-[10px]"
          labelAlign="left"
          labelCol={labelCol}
          onFinish={verifyPassword}
        >
          <Form.Item
            name="password"
            label="Enter your password"
            rules={RequiredRule}
          >
            <Input.Password
              type="password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <div className="flex justify-end">
            <Button type="primary" loading={addLoading} htmlType="submit">
              Verify
            </Button>
          </div>
        </Form>
      </Modal>

      <NotificationContainer />
    </section>
  );
};

export default Withdraw;
