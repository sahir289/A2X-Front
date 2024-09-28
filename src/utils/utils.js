function getISTOffsetForUser() {
  // Get user's current time zone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Get current time in IST
  const istDate = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });

  // Get current time in user's time zone
  const userDate = new Date().toLocaleString("en-US", {
    timeZone: userTimeZone,
  });

  // Convert both times to Date objects
  const istTime = new Date(istDate);
  const userTime = new Date(userDate);

  // Calculate the time difference in milliseconds
  const timeDifference = istTime - userTime;

  // Convert the difference to hours and minutes
  const diffHours = Math.floor(timeDifference / (1000 * 60 * 60));
  const diffMinutes = Math.abs(Math.floor((timeDifference / (1000 * 60)) % 60));

  // Format the offset
  const offsetHours = (Math.abs(diffHours) + 2).toString();
  const offsetMinutes = (diffMinutes + 20).toString().padStart(2, "0");

  return {
    userTimeZone: userTimeZone,
    istOffset: `${offsetHours}.${offsetMinutes}`,
  };
}
const IST_OFFSET = getISTOffsetForUser();

export function formatDate(inputDate) {
  // const date = new Date(inputDate);

  // const day = String(date.getUTCDate()).padStart(2, '0');
  // const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  // const year = date.getUTCFullYear();
  // const hours = String(date.getUTCHours()).padStart(2, '0');
  // const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  // const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const date = new Date(inputDate);
  const utcTime = date.getTime();
  const istTime = utcTime + IST_OFFSET.istOffset * 60 * 60 * 1000; // Convert hours to milliseconds and add the offset
  const istDate = new Date(istTime);

  const day = String(istDate.getDate()).padStart(2, "0");
  const month = String(istDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = istDate.getFullYear();
  const hours = String(istDate.getHours()).padStart(2, "0");
  const minutes = String(istDate.getMinutes()).padStart(2, "0");
  const seconds = String(istDate.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} at ${hours}:${minutes}:${seconds}`;
}

export function formatCurrency(amount) {
  // Check if the amount is null or undefined
  if (amount == null) {
    return "₹0.00";
  }

  // Convert the amount to a number if it's not already
  const numberAmount = Number(amount);

  // Use toFixed to ensure two decimal places
  const formattedAmount = numberAmount.toFixed(2);

  // Add the currency symbol
  return `₹${formattedAmount}`;
}

export const getQueryFromObject = (obj = {}) => {
  const queryParams = [];
  for (const name in obj) {
    const value = obj[name];
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      (!Array.isArray(value) || value.length > 0)
    ) {
      queryParams.push(
        `${name}=${Array.isArray(value) ? value.join(",") : value}`
      );
    }
  }
  return queryParams.length ? `?${queryParams.join("&")}` : "";
};

export function invalidText(value) {
  return (
    value == null || value == undefined || value.toString().trim().length == 0
  );
}

export const roleOptions = [
  { label: "Admin", value: "ADMIN" },
  { label: "Merchant", value: "MERCHANT" },
  { label: "Transactions", value: "TRANSACTIONS" },
  { label: "Operations", value: "OPERATIONS" },
  { label: "Vendor", value: "VENDOR" },
  { label: "Merchant Operations", value: "MERCHANT_OPERATIONS" },
  { label: "Vendor Operations", value: "VENDOR_OPERATIONS" },
];

export const statusOptions = [
  { value: "", label: "All" },
  { value: "INITIATED", label: "INITIATED" },
  { value: "ASSIGNED", label: "ASSIGNED" },
  { value: "SUCCESS", label: "SUCCESS" },
  { value: "DROPPED", label: "DROPPED" },
  { value: "DUPLICATE", label: "DUPLICATE" },
  { value: "DISPUTE", label: "DISPUTE" },
  { value: "PENDING", label: "PENDING" },
  { value: "IMG_PENDING", label: "IMG_PENDING" },
];

//Pay out status options list.
export const payoutInOutStatusOptions = [
  { value: "INITIATED", label: "INITIATED" },
  { value: "SUCCESS", label: "SUCCESS" },
  { value: "FAILED", label: "FAILED" },
];

//With draw all status options list.
export const WithDrawAllOptions = [
  { value: "", label: "All" },
  { value: "INITIATED", label: "INITIATED" },
  { value: "SUCCESS", label: "SUCCESS" },
  { value: "FAILED", label: "FAILED" },
  { value: "REJECTED", label: "REJECTED" },
  { value: "REVERSED", label: "REVERSED" },
];
export const WithDrawCompletedOptions = [
  { value: "SUCCESS", label: "SUCCESS" },
];
export const WithDrawInProgressOptions = [
  { value: "INITIATED", label: "INITIATED" },
];
export const reasonOptions = [
  "Insufficient Fund",
  "Invalid Bank Details",
  "Other",
].map((el) => ({ value: el, label: el }));

export const RequiredRule = [
  {
    required: true,
    message: "${label} is Required!",
  },
];

export const parseErrorFromAxios = (err) => {
  return {
    error: err,
    message:
      err?.response?.data?.error?.message ||
      err?.response?.data?.message ||
      err?.message ||
      "Unknown Error",
  };
};

export function formatString(input) {
  return input
    ?.split("_") // Split the string by underscores
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
    ?.join(" "); // Join the words with spaces
}

export const validateNumberField = {
  validator: (_, value) => {
    if (!/^[0-9]*$/.test(value)) {
      return Promise.reject(new Error("${label} must contain only numbers."));
    }
    return Promise.resolve();
  },
};
