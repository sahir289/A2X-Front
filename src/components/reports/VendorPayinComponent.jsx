import { notification } from "antd";
import { json2csv } from "json-2-csv";
import React, { useState } from "react";
import { postApi } from "../../redux/api";
import { formatDate, formatDateToISTString, VendorPayinOptions } from "../../utils/utils";
import PayDesign from "./index";

const VendorPayinComponent = () => {
  const [loading, setLoading] = useState(false);
  const [api, notificationContext] = notification.useNotification();
  const [includeSubMerchant, setIncludeSubMerchant] = useState(false);

  //handlePayInFunction
  const handlePayIn = async (data) => {
    const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
    const formattedDates = data.range.map((date) => new Date(date));
    delete data.range;

    const startDate = formattedDates[0];
    const endDate = formattedDates[1];

    const adjustedStartDate = new Date(startDate.getTime()-istOffset);
    const adjustedEndDate = new Date(endDate.getTime()-istOffset);

    adjustedStartDate.setUTCDate(adjustedStartDate.getUTCDate());
    adjustedEndDate.setUTCDate(adjustedEndDate.getUTCDate() + 1);

    adjustedStartDate.setUTCHours(18, 30, 0, 0);
    adjustedEndDate.setUTCHours(18, 29, 59, 999);

    const completeData = {
      ...data,
      startDate: formatDateToISTString(adjustedStartDate),
      endDate: formatDateToISTString(adjustedEndDate),
      includeSubMerchant,
    };

    setLoading(true);
    const res = await postApi(`/get-all-payins`, completeData);
    setLoading(false);
    if (res.error) {
      api.error({ description: res.error.message });
      return;
    }
    if (!res.data.data?.length) {
      api.warning({ description: "No data found!" });
      return;
    }
    const formatSetting = res.data.data.map((el) => ({
      ID: el.sno || "",
      Vendor: el?.vendor_code || "",
      UTR: el.utr || "",
      "Amount": el.amount || "",
      Status: el.is_used === true ? "Used" : el.is_used === false ? "Unused" : "" || "",
      Bank: el.bankName || "",
      "Initiated At": formatDate(el.createdAt) || "",
    }));
    try {
      const csv = await json2csv(formatSetting);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      const fileName = `vendor-payin-${data.status}-${formatDate(
        Date.now()
      )}`.toLowerCase();
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error converting data to CSV:", error);
    }
  };

  return (
    <>
      {notificationContext}
      <PayDesign
        handleFinish={handlePayIn}
        setIncludeSubMerchantFlag={setIncludeSubMerchant}
        title="Vendor Payins"
        loading={loading}
        statusOptions={VendorPayinOptions}
      />
    </>
  );
};

export default VendorPayinComponent;
