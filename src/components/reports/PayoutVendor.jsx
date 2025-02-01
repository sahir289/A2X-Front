import { notification } from "antd";
import { json2csv } from "json-2-csv";
import React, { useState } from "react";
import { postApi } from "../../redux/api";
import { formatDate, payoutInOutStatusOptions } from "../../utils/utils";
import PayDesign from "./index";

const PayoutComponent = () => {
    const [loading, setLoading] = useState(false);
    const [api, notificationContext] = notification.useNotification();

    const handlePayOut = async (data) => {
      const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
      const formattedDates = data.range.map((date) => new Date(date));
      delete data.range;
      const startDate = formattedDates[0];
      const endDate = formattedDates[1];

      const adjustedStartDate = new Date(startDate.getTime() - istOffset);
      const adjustedEndDate = new Date(endDate.getTime() - istOffset);

      adjustedStartDate.setUTCDate(adjustedStartDate.getUTCDate());
      adjustedEndDate.setUTCDate(adjustedEndDate.getUTCDate() + 1);

      adjustedStartDate.setUTCHours(18, 30, 0, 0);
      adjustedEndDate.setUTCHours(18, 29, 59, 999);

      const completeData = {
        ...data
      };

      setLoading(true);
      console.log(completeData, "Complete Data for API");

      const res = await postApi("/get-all-vendor-payouts", completeData);
      console.log(res, "response from API");

      setLoading(false);

      if (res.error) {
        api.error({ description: res.error.message });
        return;
      }

      if (!res.data.data?.length) {
        api.warning({ description: "No data found!" });
        return;
      }


      const filteredData = res.data.data.filter(el =>
        (!data.status || data.status === "All" || el.status === data.status) &&
        (new Date(el.createdAt) >= adjustedStartDate) &&
        (new Date(el.createdAt) <= adjustedEndDate)
      );

      console.log(filteredData, "Filtered Data");


      if (!filteredData.length) {
        api.warning({ description: "No data found!" });
        return;
      }

      const formatSetting = filteredData.map((el) => ({
        Vendor: el.vendor_code,
        Status: el.status,
        // Method: el.method || "manual",
        "Amount": el.amount || "",
        "Initiated At": formatDate(el.createdAt) || "",
        "Confirmed At":
          el.status === "SUCCESS" ? formatDate(el.approved_at) :
          el.status === "REJECTED" ? formatDate(el.rejected_at) :
          formatDate(el.updatedAt) || "",
      }));

      try {
        const csv = await json2csv(formatSetting);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        const fileName = `payout-${data.status}-${formatDate(Date.now())}`.toLowerCase();
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error converting data to CSV:", error);
      }
    };




    const options = payoutInOutStatusOptions.map((el) => {
      if (el.label == "All") {
        return {
          label: "All",
          value: "All",
        };
      }
      return el;
    });

  return (
    <>
      {notificationContext}
      <PayDesign
        handleFinish={handlePayOut}
        title="Vendor Payouts"
        loading={loading}
        statusOptions={options}
      />
    </>
  );
};

export default PayoutComponent;
