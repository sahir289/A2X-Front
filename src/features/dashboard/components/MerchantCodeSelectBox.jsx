import { Select } from "antd";
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
}) => {
  const userData = useContext(PermissionContext)
  const [merchantCodeOptions, setMerchantCodeOptions] = useState([]);
  const context = useContext(PermissionContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleChange = (value) => {
    localStorage.setItem("selectedMerchantCode", JSON.stringify(value));
    setSelectedMerchantCode(value);
    setDropdownOpen(false);
  };

  useEffect(() => {
    fetchMerchantData();
  }, []);

  const fetchMerchantData = async () => {
    const merchantCodes = await getApi("/getall-merchant");

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
      localStorage.setItem(
        "selectedMerchantCode",
        JSON.stringify(merchants)
      );
      setMerchantCodeOptions(formattedMerchantCodes);
      setSelectedMerchantCode(merchants);
    } else {
      const formattedMerchantCodes = merchantCodes?.data?.data?.merchants?.filter((merchant) => !merchant.is_deleted).map(
        (merchant) => ({
          label: merchant.code,
          value: merchant.code,
        })
      );
      const merchants = formattedMerchantCodes?.map((item) => item.value);
      localStorage.setItem(
        "selectedMerchantCode",
        JSON.stringify(merchants)
      );
      setMerchantCodeOptions(formattedMerchantCodes);
      setSelectedMerchantCode(merchants);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 mt-4 md:grid-cols-1 grid-cols-1">
      <div className="w-full flex">
        <div className="w-44">
          <span className="text-red-800">*</span> Merchant code:
        </div>
        <div className="w-full">
          <Select
            mode="tags"
            size={"large"}
            placeholder="Please select"
            onChange={handleChange}
            onDropdownVisibleChange={(open) => setDropdownOpen(open)} 
            open={dropdownOpen}
            style={{
              width: "98%",
            }}
            disabled={
              userData?.role === "MERCHANT" ||
              userData?.role === "OPERATIONS" ||
              userData?.role === "MERCHANT_OPERATIONS"
          } //Selecting and Locking the merchant name while logged in user is merchant
            options={merchantCodeOptions}
            value={selectedMerchantCode}
            className={userData?.role === "MERCHANT" ? "bg-white" : userData?.role === "OPERATIONS" ? "bg-white" : false}
            allowClear
          />
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default MerchantCodeSelectBox;
