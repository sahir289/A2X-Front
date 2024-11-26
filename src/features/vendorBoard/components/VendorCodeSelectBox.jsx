import { Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useNavigate } from "react-router-dom";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";
import { getApi } from "../../../redux/api";

const VendorCodeSelectBox = ({ selectedVendorCode, setSelectedVendorCode }) => {
  const [vendorCodeOptions, setVendorCodeOptions] = useState([]);
  const context = useContext(PermissionContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);


  const handleChange = (value) => {
    localStorage.setItem("selectedVendorCode", JSON.stringify(value));
    const selectedVendorSortedList = [...value].sort((a, b) => a.localeCompare(b));
    setSelectedVendorCode(selectedVendorSortedList);
    setDropdownOpen(false)
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

    const formattedVendorCodes = Array.isArray(vendorCodes?.data?.data)
    ? vendorCodes?.data?.data?.map((vendor) => ({
      label: vendor.vendor_code,
      value: vendor.vendor_code,
    })) : [];

    const sortedList = [...formattedVendorCodes].sort((a, b) => a.label.localeCompare(b.label));
    setVendorCodeOptions(sortedList);

    const vendors = formattedVendorCodes?.map((item) => item.value);
    localStorage.setItem(
      "selectedVendorCode",
      JSON.stringify(vendors)
    );

    const selectedVendorSortedList = [...vendors].sort((a, b) => a.localeCompare(b));
    setSelectedVendorCode(selectedVendorSortedList);
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
            onDropdownVisibleChange={(open) => setDropdownOpen(open)}        // Manage dropdown visibility
            open={dropdownOpen}
            style={{
              width: "98%",
            }}
            options={vendorCodeOptions}
            value={selectedVendorCode}
            allowClear
          />
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default VendorCodeSelectBox;
