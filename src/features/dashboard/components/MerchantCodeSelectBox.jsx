import { Select } from "antd";
import React from "react";

const MerchantCodeSelectBox = () => {
  const handleChange = (value) => {
    console.log(`Selected: ${value}`);
  };

  const merchantCodeOptions = [
    {
      value: "mc-sandbox",
      label: "mc-sandbox",
    },
    {
      value: "zetto test",
      label: "zetto test",
    },
    {
      value: "wolf test",
      label: "wolf test",
    },
  ];
  return (
    <>
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
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MerchantCodeSelectBox;
