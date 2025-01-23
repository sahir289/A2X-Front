import { Checkbox, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useNavigate } from "react-router-dom";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";
import { getApi } from "../../../redux/api";
import { invalidText } from "../../../utils/utils";

const MerchantCodeSelectBox = ({
  selectedMerchantCode,
  setSelectedMerchantCode,
  setIncludeSubMerchantFlag,
}) => {
  const userData = useContext(PermissionContext);
  const [merchantCodeOptions, setMerchantCodeOptions] = useState([]);
  const [includeSubMerchant, setIncludeSubMerchant] = useState(false);
  const context = useContext(PermissionContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleChange = (value) => {
    localStorage.setItem("selectedMerchantCode", JSON.stringify(value));
    const selectedMerchantSortedList = [...value].sort((a, b) =>
      a.localeCompare(b)
    );
    setSelectedMerchantCode(selectedMerchantSortedList);
    setDropdownOpen(false);
  };

  useEffect(() => {
    fetchMerchantData();
  }, [includeSubMerchant]);

  const fetchMerchantData = async () => {
    let merchantCodes;
    const groupingRoles = ["TRANSACTIONS", "OPERATIONS", "MERCHANT_ADMIN"];
    let endpoint = "/getall-merchant";
    if (userData.role === "ADMIN") {
      endpoint = "/getall-merchant-grouping";
    } else if (groupingRoles.includes(userData.role)) {
      if (!includeSubMerchant) {
        endpoint = `/getall-merchant-grouping?merchantCode=${userData.code}`;
      }
    }
    merchantCodes = await getApi(endpoint);

    if (merchantCodes.error?.error?.response?.status === 401) {
      NotificationManager.error(merchantCodes?.error?.message, 401);
      localStorage.clear();
      navigate("/");
    }

    if (!Array.isArray(merchantCodes?.data?.data?.merchants)) return;

    if (context?.code && !invalidText(context?.code)) {
      const formattedMerchantCodes = merchantCodes?.data?.data?.merchants
        ?.filter((merchant) => context?.code?.includes(merchant.code)) // Filter merchants that match the code
        .map((merchant) => ({
          label: merchant.code,
          value: merchant.code,
        }));
      const merchants = formattedMerchantCodes?.map((item) => item.value);
      localStorage.setItem("selectedMerchantCode", JSON.stringify(merchants));
      const sortedList = [...formattedMerchantCodes].sort((a, b) =>
        a.label.localeCompare(b.label)
      );
      setMerchantCodeOptions(sortedList);
      const selectedMerchantSortedList = [...merchants].sort((a, b) =>
        a.localeCompare(b)
      );
      setSelectedMerchantCode(selectedMerchantSortedList);
    } else {
      const formattedMerchantCodes = merchantCodes?.data?.data?.merchants
        ?.filter((merchant) => !merchant.is_deleted)
        .map((merchant) => ({
          label: merchant.code,
          value: merchant.code,
        }));
      const merchants = formattedMerchantCodes?.map((item) => item.value);
      localStorage.setItem("selectedMerchantCode", JSON.stringify(merchants));
      const sortedList = [...formattedMerchantCodes].sort((a, b) =>
        a.label.localeCompare(b.label)
      );
      setMerchantCodeOptions(sortedList);
      const selectedMerchantSortedList = [...merchants].sort((a, b) =>
        a.localeCompare(b)
      );
      setSelectedMerchantCode(selectedMerchantSortedList);
    }
  };

  return (
    <>
      <div className="grid lg:grid-cols-2 mt-4 md:grid-cols-1 grid-cols-1">
        <div className="w-full flex">
          <div className="w-44">
            <span className="text-red-800">*</span> Merchant code:
          </div>
          <div className="w-full">
            <Select
              mode={userData?.role === "MERCHANT_ADMIN" ? "multiple" : "tags"}
              showSearch={userData?.role === "MERCHANT_ADMIN" ? false : true}
              size={"large"}
              placeholder="Please select"
              onChange={handleChange}
              // onDropdownVisibleChange={(open) => setDropdownOpen(open)}
              // open={dropdownOpen}
              style={{
                width: "98%",
              }}
              disabled={
                userData?.role === "MERCHANT" ||
                userData?.role === "MERCHANT_OPERATIONS"
              }
              // Selecting and Locking the merchant name while logged in user is merchant
              options={merchantCodeOptions}
              value={selectedMerchantCode}
              allowClear
            />
          </div>
        </div>
        <NotificationContainer />
        <div className="flex" style={{ alignSelf: "end" }}>
          {(userData.role === "ADMIN" ||
            userData.role === "TRANSACTIONS" ||
            userData.role === "OPERATIONS" ||
            userData.role === "MERCHANT_ADMIN") && (
            <Checkbox
              onClick={() => {
                setIncludeSubMerchant((prevState) => !prevState);
                setIncludeSubMerchantFlag((prevState) => !prevState);
              }}
            >
              <span style={{ color: "cornflowerblue" }}>
                Include Sub Merchant
              </span>
            </Checkbox>
          )}
        </div>
      </div>
    </>
  );
};

export default MerchantCodeSelectBox;
