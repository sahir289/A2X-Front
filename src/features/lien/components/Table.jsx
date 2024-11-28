import { Button, Input, Select, Table, Tag } from "antd";
import Column from "antd/es/table/Column";
import React, { useEffect, useState, useContext } from "react";
import { Reload } from "../../../utils/constants";
import { formatCurrency, formatDate } from "../../../utils/utils";
import AddLien from "./AddLien";
import { getApi } from "../../../redux/api";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useNavigate } from "react-router-dom";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";

const TableComponent = ({
  data,
  filterValues,
  setFilterValues,
  isFetchBanksLoading,
}) => {
  const [merchants, setMerchants] = useState([]);
  const navigate = useNavigate();
  const userData = useContext(PermissionContext);
  const handleFilterValuesChange = (value, fieldName) => {
    setFilterValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const paginationConfig = {
    current: data?.pagination?.page ?? 1,
    pageSize: data?.pagination?.pageSize ?? 20,
    total: data?.pagination?.total ?? 0,
    showSizeChanger: true,
    pageSizeOptions: ["20", "50", "100"],
    onChange: (page, size) =>
      handleTableChange({ current: page, pageSize: size }),
    onShowSizeChange: (current, size) =>
      handleTableChange({ current, pageSize: size }),
    showTotal: (total) => `Total ${total} items`,
  };

  const handleTableChange = ({ current, pageSize }) => {
    setFilterValues((prev) => ({ ...prev, page: current, pageSize }));
  };
  //reset search fields
  const handleResetSearchFields = () => {
    setFilterValues({})
  }

  const handleGetMerchants = async () => {
    const res = await getApi("/getall-merchant");
    if (res.error?.error?.response?.status === 401) {
      NotificationManager.error(res?.error?.message, 401);
      localStorage.clear();
      navigate("/");
    }

    setMerchants(res.data?.data?.merchants || []);
  };

  useEffect(() => {
    handleGetMerchants();
  }, []);

  const merchantOptions = merchants
    ?.filter(
      (merchant) =>
        !merchant.is_deleted &&
        (!userData?.code?.length || userData?.code?.includes(merchant?.code))
    )
    .map((merchant) => ({
      label: merchant.code,
      value: merchant.code,
    }))
    .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by the label

  const lastLogIn = (record) => {
    return formatDate(record?.when) || "N/A"; // Safely access nested property
  };

  const getMerchantCode = (record) => {
    return record?.Merchant?.code || "N/A"; // Safely access nested property
  };

  return (
    <>
      <div className="font-serif p-3 bg-zinc-50 rounded-lg mb-2">
        <div className="flex">
          <AddLien handleTableChange={handleTableChange} />
        </div>
      </div>
      <div className="font-serif pt-3 bg-zinc-50 rounded-lg">
        <div className="flex">
          <div className=" w-full h-12  pb-3">
            <p className="pt-4 ps-4 text-xl "> Lien</p>
          </div>
          <div className="pt-2 flex items-center gap-2">
            <Button className='' onClick={handleResetSearchFields}>Reset</Button>
            <Button
              className="mr-5 hover:bg-slate-300"
              icon={<Reload />}
              onClick={() => handleTableChange({ current: 1, pageSize: 20 })}
            />
          </div>
        </div>
        <Table
          dataSource={data.lienRes}
          rowKey={(item) => item.id}
          scroll={{
            x: "70vw",
          }}
          className="font-serif px-3"
          loading={isFetchBanksLoading}
          pagination={paginationConfig}
        >
          <Column
            title={
              <>
                <span className="whitespace-nowrap">SNO</span>
                <br />
                <Input
                  value={filterValues?.sno}
                  onChange={(e) =>
                    handleFilterValuesChange(e.target.value, "sno")
                  }
                  allowClear
                />
              </>
            }
            dataIndex="sno"
            key="sno"
            className="bg-white"
            width={"1%"}
          />
          <Column
            title={
              <>
                <span className="whitespace-nowrap">Merchant</span>
                <br />
                <Select
                  value={filterValues?.merchantCode}
                  showSearch
                  options={merchantOptions}
                  className="flex"
                  onChange={(value) =>
                    handleFilterValuesChange(value, "merchantCode")
                  }
                  allowClear
                />
              </>
            }
            dataIndex="Merchant"
            key="merchant_code"
            className="bg-white"
            width={"1%"}
            render={(text, record) => (
              <>
                {getMerchantCode(record)}
              </>
            )}
          />
          <Column
            title={
              <>
                <span className="whitespace-nowrap">Merchant Order ID</span>
                <br />
                <Input
                  value={filterValues?.merchant_order_id}
                  onChange={(e) =>
                    handleFilterValuesChange(e.target.value, "merchant_order_id}")
                  }
                  allowClear
                />
              </>
            }
            dataIndex="merchant_order_id"
            key="merchant_order_id"
            className="bg-white"
            width={"1%"}
          />
          <Column
            title={
              <>
                <span className="whitespace-nowrap">User ID</span>
                <br />
                <Input
                  value={filterValues?.userId}
                  onChange={(e) =>
                    handleFilterValuesChange(e.target.value, "userId")
                  }
                  allowClear
                />
              </>
            }
            dataIndex="user_id"
            key="user_id"
            className="bg-white"
            width={"1%"}
          />
          <Column
            title={
              <>
                <span className="whitespace-nowrap">Amount</span>
                <br />
                <Input
                  value={filterValues?.amount}
                  onChange={(e) =>
                    handleFilterValuesChange(e.target.value, "amount")
                  }
                  allowClear
                />
              </>
            }
            dataIndex="amount"
            key="amount"
            className="bg-white"
            width={"1%"}
            render={(text) => formatCurrency(text)}
          />
          <Column
            title="When (IST)"
            dataIndex="Merchant"
            key="Merchant"
            className="bg-white"
            width={"1%"}
            render={(text, record) => lastLogIn(record)}
          />
        </Table>
      </div>
    </>
  );
};

export default TableComponent;