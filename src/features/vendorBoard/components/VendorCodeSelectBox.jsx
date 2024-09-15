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

const VendorCodeSelectBox = ({ selectedVendorCode, setSelectedVendorCode }) => {
  const [vendorCodeOptions, setVendorCodeOptions] = useState([]);
  const context = useContext(PermissionContext);
  const navigate = useNavigate();

  const handleChange = (value) => {
    localStorage.setItem("selectedVendorCode", JSON.stringify(value));
    setSelectedVendorCode(value);
  };

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    const vendorCodes = await getApi("/getall-vendor");

    if (vendorCodes.error?.error?.response?.status === 401) {
      NotificationManager.error(vendorCodes?.error?.message, 401);
      localStorage.clear();
      navigate("/");
    }

    if (context?.code && !invalidText(context?.code)) {
      const formattedVendorCodes = vendorCodes?.data?.data
        ?.filter((vendor) => context?.code?.includes(vendor.vendor_code)) // Filter vendors that match the code
        .map((vendor) => ({
          label: vendor.vendor_code,
          value: vendor.vendor_code,
        }));
      localStorage.setItem(
        "selectedVendorCode",
        JSON.stringify(formattedVendorCodes?.map((item) => item.value))
      );
      setVendorCodeOptions(formattedVendorCodes);
      setSelectedVendorCode(formattedVendorCodes?.map((item) => item.value));
    } else {
      const formattedVendorCodes = vendorCodes?.data?.data?.map((vendor) => ({
        label: vendor.vendor_code,
        value: vendor.vendor_code,
      }));
      localStorage.setItem(
        "selectedVendorCode",
        JSON.stringify(formattedVendorCodes?.map((item) => item.value))
      );
      setVendorCodeOptions(formattedVendorCodes);
      setSelectedVendorCode(formattedVendorCodes?.map((item) => item.value));
    }
  };

  return (
    <div className="grid lg:grid-cols-2 mt-4 md:grid-cols-1 grid-cols-1">
      <div className="w-full flex">
        <div className="w-44">
          <span className="text-red-800">*</span> Vendor code:
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
            options={vendorCodeOptions}
            value={selectedVendorCode}
          />
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default VendorCodeSelectBox;
