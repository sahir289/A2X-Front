import { Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { getApi } from "../../../redux/api";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";
import { invalidText } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";
import { NotificationContainer, NotificationManager } from 'react-notifications';


const MerchantCodeSelectBox = ({
  selectedMerchantCode,
  setSelectedMerchantCode,
}) => {
  const [merchantCodeOptions, setMerchantCodeOptions] = useState([]);
  const context = useContext(PermissionContext);
  const navigate = useNavigate()


  const handleChange = (value) => {
    localStorage.setItem("selectedMerchantCode", JSON.stringify(value));
    setSelectedMerchantCode(value);
  };

  const storedMerchantCode = localStorage.getItem("selectedMerchantCode");
  useEffect(() => {
    if (storedMerchantCode) {
      setSelectedMerchantCode(JSON.parse(storedMerchantCode));
    } else {
      setSelectedMerchantCode([]);
    }
  }, [storedMerchantCode]);

  useEffect(() => {
    if (context?.code && !invalidText(context?.code)) {
      const selectedValue = context?.code;
      localStorage.setItem(
        "selectedMerchantCode",
        JSON.stringify(selectedValue)
      );
    }
    fetchMerchantData();
  }, []);

  const fetchMerchantData = async () => {
    const merchantCodes = await getApi("/getall-merchant");

    if (merchantCodes.error?.error?.response?.status === 401) {
      NotificationManager.error(merchantCodes?.error?.message, 401);
      localStorage.clear();
      navigate('/')
    }

    if (context?.code && !invalidText(context?.code)) {
      const formattedMerchantCodes = merchantCodes?.data?.data?.merchants
        // ?.filter(merchant => merchant.code === context.code)  // Filter merchants that match the code
        ?.filter(merchant => context.code.includes(merchant.code))  // Filter merchants that match the code
        .map(merchant => ({
          label: merchant.code,
          value: merchant.code,
        }));
      setMerchantCodeOptions(formattedMerchantCodes);
    } else {
      const formattedMerchantCodes = merchantCodes?.data?.data?.merchants?.map(
        (merchant) => ({
          label: merchant.code,
          value: merchant.code,
        })
      );
      setMerchantCodeOptions(formattedMerchantCodes);
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
            style={{
              width: "98%",
            }}
            options={merchantCodeOptions}
            value={selectedMerchantCode}
          />
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default MerchantCodeSelectBox;
