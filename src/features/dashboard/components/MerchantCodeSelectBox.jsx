import { Select } from "antd";
import React, { useEffect, useState } from "react";
import { getApi } from "../../../redux/api";

const MerchantCodeSelectBox = ({
  selectedMerchantCode,
  setSelectedMerchantCode,
}) => {
  const [merchantCodeOptions, setMerchantCodeOptions] = useState([]);

  const handleChange = (value) => {
    localStorage.setItem("selectedMerchantCode", JSON.stringify(value));
    setSelectedMerchantCode(value);
  };

  useEffect(() => {
    const storedMerchantCode = localStorage.getItem("selectedMerchantCode");
    if (storedMerchantCode) {
      setSelectedMerchantCode(JSON.parse(storedMerchantCode));
    } else {
      setSelectedMerchantCode([]);
    }
    fetchMerchantData();
  }, []);

  const fetchMerchantData = async () => {
    const merchantCodes = await getApi("/getall-merchant");
    if (merchantCodes.error) {
      setMerchantCodeOptions([]);
      return;
    }

    setMerchantCodeOptions([]); // clear the options to avoid duplication
    merchantCodes?.data?.data?.merchants?.forEach((merchant) => {
      setMerchantCodeOptions((prev) => [
        ...prev,
        {
          value: merchant.code,
          label: merchant.code,
        },
      ]);
    });
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
    </div>
  );
};

export default MerchantCodeSelectBox;
