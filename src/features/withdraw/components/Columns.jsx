import { BellTwoTone, CheckSquareTwoTone, CloseSquareTwoTone, CopyOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Input, Select, Tag, Tooltip } from "antd";
import Column from "antd/es/table/Column";
import { NotificationManager } from 'react-notifications';
import { postApi } from "../../../redux/api";
import { formatCurrency, formatDate, WithDrawAllOptions, WithDrawCompletedOptions, WithDrawInProgressOptions } from "../../../utils/utils";
const renderStatusTag = (status) => {
  let color = "";
  switch (status) {
    case "INITIATED":
      color = "grey";
      break;
    case "SUCCESS":
      color = "green";
      break;
    // Add other statuses and colors as needed
    default:
      color = "default"; // Fallback color

  }

  return (
    <Tag
      color={color}
      icon={status === "INITIATED" && <ExclamationCircleOutlined />}
    >
      {status}
    </Tag>
  );
};

const ColumnSearch = ({ name, filters, onChange, ...props }) => {
  return (
    <Input
      {...props}
      value={filters[name]}
      name={name}
      className="w-full"
      onChange={(e) => {
        onChange(name, e.target.value);
      }}
      allowClear
    />
  );
};

const ColumnSelect = ({ name, options, filters, onChange, ...props }) => {
  return (
    <Select
      {...props}
      name={name}
      options={options}
      className="w-full"
      value={filters[name]}
      onChange={(v) => {
        onChange(name, v);
      }}
      allowClear
      showSearch
    />
  );
};

export const Columns = (
  merchantOptions,
  vendorOptions, // vendor options
  payOutBankOptions, // payout bank options
  filters,
  onChange,
  updateWithdraw,
  type,
  userData,
  setVerification,
  setSelectedRecord,
  form
) => {

  const handleCopy = (values) => {
    navigator.clipboard.writeText(values);
    NotificationManager.success("Copied to clipboard")
  };

  const openEditModal = (record) => {
    form.setFieldsValue({ utr_id: record.utr_id });
    setSelectedRecord(record);
    setVerification(true);
  };
  const setNotified = async (data) => {
    const response = await postApi(`/update-payment-notified-status/${data}`, { type: 'payout' })
    if (response.data.statusCode === 200) {
      NotificationManager.success("Merchant Notified successfully");
    }
  }

  const handleRejected = (r) => {
    if (r.method !== "manual") {
      return "Rejected from the portal"
    }
    else {
      if (r.approved_at && r.rejected_at) {
        return `Rejected due to ${r.rejected_reason}`
      }
      else {
        return "Rejected due to Invalid Credentials"
      }
    }
  }

  return (
    <>
      <Column
        title="ID"
        dataIndex="sno"
        ellipsis
        width="80px"
        render={(v, r, i) => {
          if (i) {
            return v;
          }
          return (
            <ColumnSearch
              name="sno"
              min="1"
              onChange={onChange}
              filters={filters}
              isNumeric={true}
            />
          );
        }}
      />
      {(userData?.role === "ADMIN" || userData?.role === "TRANSACTIONS" || userData?.role === "OPERATIONS" || userData?.role === "VENDOR" || userData?.role === "VENDOR_OPERATIONS") &&
        <Column
          title="Action"
          width="155px"
          render={(v, r, i) => {
            if (!i) {
              return null;
            }
            if (r.status == "INITIATED") {
              return (
                // UI change of Approve and Reject Buttons
                <>
                  <CheckSquareTwoTone
                    style={{
                      fontSize: '40px',
                      marginRight: '7px',
                    }}
                    twoToneColor="#52c41a"
                    onClick={() =>
                      updateWithdraw({
                        record: r,
                        key: "approve",
                      })
                    }

                  />
                  <CloseSquareTwoTone
                    style={{
                      fontSize: '40px',
                      marginLeft: '7px',
                    }}
                    twoToneColor="#ff0000"
                    onClick={() =>
                      updateWithdraw({
                        record: r,
                        key: "reject",
                      })
                    }
                  />
                </>
              );
            }
            return (
              <>
                <Button
                  disabled={r.status === "REJECTED"}
                  hidden={(userData?.role === "VENDOR" || userData?.role === "VENDOR_OPERATIONS")}
                  onClick={() =>
                    updateWithdraw({
                      record: r,
                      reset: true,
                    })
                  }
                >
                  Reset
                </Button>
                {(userData?.role === "ADMIN" || userData?.role === "TRANSACTIONS" || userData?.role === "OPERATIONS") && (<BellTwoTone className="ml-2" style={{ fontSize: '20px' }} onClick={() => setNotified(r.id)} />)}
              </>
            );
          }}
        />}
      {(userData?.role === "VENDOR" ||
        userData?.role === "VENDOR_OPERATIONS") ? " " :
        <Column
          title="Merchant Order Id"
          dataIndex="merchant_order_id"
          width="380px"
          ellipsis
          render={(v, r, i) => {
            if (i) {
              return <>{v}&nbsp;&nbsp;<CopyOutlined className='cursor-pointer text-blue-400 hover:text-blue-600' onClick={() => handleCopy(v)} /> </>;
            }
            return (
              <ColumnSearch
                name="merchant_order_id"
                onChange={onChange}
                filters={filters}
              />
            );
          }}
        />}
      {(userData?.role === "VENDOR" ||
        userData?.role === "VENDOR_OPERATIONS") ? " " :
        <Column
          title="Merchant"
          dataIndex="Merchant"
          width="150px"
          ellipsis
          render={(v, r, i) => {
            if (i) {
              return <>{v?.code}&nbsp;&nbsp;<CopyOutlined className='cursor-pointer text-blue-400 hover:text-blue-600' onClick={() => handleCopy(v?.code)} /> </>;
            }
            return (
              <ColumnSelect
                name="code"
                options={merchantOptions}
                onChange={onChange}
                filters={filters}
                disabled={[
                  "MERCHANT",
                  "MERCHANT_OPERATIONS",
                ].includes(userData?.role)}
              />
            );
          }}
        />}
      {(userData?.role === "ADMIN" ||
        userData?.role === "TRANSACTIONS" || userData?.role === "OPERATIONS") ?
        <Column
          title="Vendor"
          dataIndex="vendor_code"
          width="140px"
          ellipsis
          render={(v, r, i) => {
            if (i) {
              return v;
            }
            return (
              <ColumnSelect
                name="vendor_code"
                options={vendorOptions}
                onChange={onChange}
                filters={filters}
              />
            );
          }}
        />
        : " "}
      <Column
        title="Bank Details"
        dataIndex="acc_no"
        width="180px"
        ellipsis
        render={(v, r, i) => {
          if (i) {
            return (
              <div>
                <p>{r?.bank_name}</p>
                <p>{r?.acc_holder_name}</p>
                <p>{r?.acc_no}</p>
                <p>{r?.ifsc_code}</p>
              </div>
            );
          }
          return (
            <ColumnSearch name="acc_no" onChange={onChange} filters={filters} />
          );
        }}
      />
      <Column
        title="Amount"
        dataIndex="amount"
        width="130px"
        ellipsis
        render={(v, r, i) => {
          if (i) {
            return formatCurrency(v);
          }
          return (
            <ColumnSearch name="amount" onChange={onChange} filters={filters} />
          );
        }}
      />
      {type == "Completed" && (
        <Column
          title="Commission"
          dataIndex="payout_commision"
          hidden={
            userData?.role === "VENDOR" ||
            userData?.role === "VENDOR_OPERATIONS"
          }
          width="100px"
          ellipsis
          render={(v, r, i) => {
            if (i) {
              return formatCurrency(v);
            }
            return (
              <ColumnSearch
                name="commission"
                onChange={onChange}
                filters={filters}
              />
            );
          }}
        />
      )}
      <Column
        title="Status"
        dataIndex="status"
        width="140px"
        ellipsis
        render={(v, r, i) => {
          if (i) {
            return (
              <>
                {renderStatusTag(v)}

                {v === "REJECTED" && (

                  <Tooltip
                    color="white"
                    //  style={{marginRight:"4px"}}
                    placement="bottomRight"
                    title={
                      <div className="flex flex-col gap-1 text-black p-2">

                        {handleRejected(r)}
                      </div>
                    }
                  >
                    <ExclamationCircleOutlined style={{ fontSize: "12px" }} />
                  </Tooltip>
                )}
              </>
            );
          }
          return (
            <ColumnSelect
              name="status"
              disabled={type === "Completed" || type === "In Progress" ? true : false}
              defaultValue={type === "Completed" ? WithDrawCompletedOptions[0].value : type === "In Progress" ? WithDrawInProgressOptions[0].value : WithDrawAllOptions[0].label}
              options={type === "Completed" ? WithDrawCompletedOptions : type === "In Progress" ? WithDrawInProgressOptions : WithDrawAllOptions}
              onChange={onChange}
              filters={filters}
            />
          );
        }}
      />
      {(type == "All" || type == "Completed") && (
        <Column
          title="UTR Id"
          dataIndex="utr_id"
          width="180px"
          ellipsis
          render={(v, r, i) => {
            if (i) {
              return (
                <div style={{ whiteSpace: "normal", wordWrap: "break-word", wordBreak: "break-word" }}>
                  {v || "-"}
                  {(v && userData?.role === "ADMIN") && (
                    <>
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(r)}
                      />
                    </>
                  )}
                </div>
              );
            }
            return (
              <ColumnSearch
                name="utr_id"
                onChange={onChange}
                filters={filters}
              />
            );
          }}
        />
      )}
      {(userData?.role === "VENDOR" || userData?.role === "VENDOR_OPERATIONS") ? " " :
        <Column
          title="User"
          dataIndex="user_id"
          width="130px"
          ellipsis
          render={(v, r, i) => {
            if (i) {
              return v;
            }
            return (
              <ColumnSearch
                name="user_id"
                onChange={onChange}
                filters={filters}
              />
            );
          }}
        />}
      {(userData?.role === "ADMIN" || userData?.role === "TRANSACTIONS" || userData?.role === "OPERATIONS") ? <Column
        title="Method"
        dataIndex="method"
        width="180px"
        ellipsis
        render={(v, r, i) => {
          if (i) {
            return v || "-";
          }
          return (
            <ColumnSearch
              name="method"
              onChange={onChange}
              filters={filters}
            />
          );
        }}
      /> : " "}
      {/* Colunm to display the selected payout bank and it's filter */}
      {(userData?.role === "ADMIN" ||
        userData?.role === "TRANSACTIONS" || userData?.role === "OPERATIONS") ? <Column
        title="From Bank"
        dataIndex="from_bank"
        width="130px"
        ellipsis
        render={(v, r, i) => {
          if (i) {
            return v;
          }
          return (
            <ColumnSelect
              name="from_bank"
              options={payOutBankOptions}
              onChange={onChange}
              filters={filters}
            />
          );
        }}
      /> : " "}
      <Column
        title="Payout UUID"
        dataIndex="id"
        width="380px"
        ellipsis
        render={(v, r, i) => {
          if (i) {
            return <>{v}&nbsp;&nbsp;<CopyOutlined className='cursor-pointer text-blue-400 hover:text-blue-600' onClick={() => handleCopy(v)} /> </>;
          }
          return (
            <ColumnSearch name="id" onChange={onChange} filters={filters} />
          );
        }}
      />
      <Column
        title="Last Updated"
        dataIndex="updatedAt"
        width="240px"
        ellipsis
        render={(v) => (v ? formatDate(v) : "")}
      />
    </>
  );
};
