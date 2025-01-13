
export function formatDate(utcDate) {
  const date = new Date(utcDate);

  // Extract the UTC components directly
  const utcYear = date.getUTCFullYear();
  const utcMonth = date.getUTCMonth();
  const utcDay = date.getUTCDate();
  const utcHours = date.getUTCHours();
  const utcMinutes = date.getUTCMinutes();
  const utcSeconds = date.getUTCSeconds();

  // Apply IST offset (5 hours and 30 minutes ahead of UTC)
  const istDate = new Date(Date.UTC(utcYear, utcMonth, utcDay, utcHours, utcMinutes + 30, utcSeconds));
  istDate.setHours(istDate.getHours() + 5);

  // Format the IST date as "DD/MM/YYYY at HH:MM:SS AM/PM"
  const day = String(istDate.getUTCDate()).padStart(2, '0');
  const month = String(istDate.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = istDate.getUTCFullYear();
  let hours = istDate.getUTCHours();
  const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
  const seconds = String(istDate.getUTCSeconds()).padStart(2, '0');

  // Determine AM or PM and convert hours to 12-hour format
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM and handle other hours

  return `${day}/${month}/${year} at ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
}

export function formatDate1(utcDate) {
  const date = new Date(utcDate);

  // Extract the UTC components directly
  const utcYear = date.getUTCFullYear();
  const utcMonth = date.getUTCMonth();
  const utcDay = date.getUTCDate();
  const utcHours = date.getUTCHours();
  const utcMinutes = date.getUTCMinutes();
  const utcSeconds = date.getUTCSeconds();

  // Apply IST offset (5 hours and 30 minutes ahead of UTC)
  const istDate = new Date(Date.UTC(utcYear, utcMonth, utcDay, utcHours, utcMinutes + 30, utcSeconds));
  istDate.setHours(istDate.getHours() + 5);

  // Format the IST date as "DD/MM/YYYY at HH:MM:SS AM/PM"
  const day = String(istDate.getUTCDate()).padStart(2, '0');
  const month = String(istDate.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = istDate.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export function calculateISTDateRange() {
  const nowUTC = new Date();
  // Calculate current IST time by adding 5 hours and 30 minutes to UTC
  const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
  const nowIST = new Date(nowUTC.getTime() + istOffset);

  // extract IST date components
  const year = nowIST.getUTCFullYear();
  const month = nowIST.getUTCMonth(); // months are zero-based
  const date = nowIST.getUTCDate();

  // calculate start and end of the day in IST
  const startIST = new Date(Date.UTC(year, month, date, 0, 0, 0, 0)); // 12:00 AM IST
  const endIST = new Date(Date.UTC(year, month, date, 23, 59, 59, 999)); // 11:59 PM IST

  // convert IST to UTC for query
  const startUTC = new Date(startIST.getTime() - istOffset);
  const endUTC = new Date(endIST.getTime() - istOffset);

  return {
    startUTC,
    endUTC,
  };
}

export function formatDateToISTString(date) {
  const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' };
  return date.toLocaleString('en-US', options).replace(',', '');
}

export function formatCurrency(amount) {
  // Check if the amount is null or undefined
  if (amount == null) {
    return '₹0.00';
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
      queryParams.push(`${name}=${Array.isArray(value) ? value.join(",") : value}`);
    }
  }
  return queryParams.length ? `?${queryParams.join("&")}` : '';
}


export function invalidText(value) {
  return (
    value == null || value == undefined || value.toString().trim().length == 0
  );
}
export const statusOptions = [
  { value: '', label: 'All' },
  { value: 'INITIATED', label: 'INITIATED' },
  { value: 'ASSIGNED', label: 'ASSIGNED' },
  { value: 'SUCCESS', label: 'SUCCESS' },
  { value: 'DROPPED', label: 'DROPPED' },
  { value: 'DUPLICATE', label: 'DUPLICATE' },
  { value: 'DISPUTE', label: 'DISPUTE' },
  { value: 'PENDING', label: 'PENDING' },
  { value: 'IMG_PENDING', label: 'IMG_PENDING' },
];

//Pay out status options list.
export const payoutInOutStatusOptions = [
  { value: 'INITIATED', label: 'INITIATED' },
  { value: 'SUCCESS', label: 'SUCCESS' },
  { value: 'DROPPED', label: 'DROPPED' },
  { value: 'REJECTED', label: 'REJECTED' },
  { value : 'REVEERSED WITHDRAWL', label: 'REVERSE WITHDRAWL'}
]
export const withdrawlMethods = [
  { value: "manual", label: "Manual", key: "manual" },
  { value: "eko", label: "Eko", key: "eko" },
   // { value: "blazepe", label: "BlazePe", key: "blazepe" },
]

//With draw all status options list.
export const WithDrawAllOptions = [
  { value: '', label: 'All' },
  { value: 'INITIATED', label: 'INITIATED' },
  { value: 'SUCCESS', label: 'SUCCESS' },
  { value: 'DROPPED', label: 'DROPPED' },
  { value: 'REJECTED', label: 'REJECTED' },
  // { value: 'REVERSED', label: 'REVERSED' },
]
export const WithDrawCompletedOptions = [
  { value: 'SUCCESS', label: 'SUCCESS' },
]
export const WithDrawInProgressOptions = [
  { value: 'INITIATED', label: 'INITIATED' },
]
export const reasonOptions = ["Insufficient Fund", "Invalid Bank Details", "Other"].map(el => ({ value: el, label: el }));


export const RequiredRule = [
  {
    required: true,
    message: "${label} is Required!",
  }
]


export const parseErrorFromAxios = (err) => {
  return {
    error: err,
    message: err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || "Unknown Error",
  };
}

export function formatString(input) {
  return input?.split('_') // Split the string by underscores
    ?.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
    ?.join(' '); // Join the words with spaces
}


export const roleOptionsMap = {
  ADMIN: [
    { label: "Merchant", value: "MERCHANT" },
    { label: "Transactions", value: "TRANSACTIONS" },
    { label: "Operations", value: "OPERATIONS" },
    { label: "Vendor", value: "VENDOR" },
    { label: "Merchant-Admin", value: "MERCHANT_ADMIN" },
  ],
  VENDOR: [
    { label: "Vendor-Operations", value: "VENDOR_OPERATIONS" },
  ],
  MERCHANT: [
    { label: "Merchant-Operations", value: "MERCHANT_OPERATIONS" },
  ],
  MERCHANT_ADMIN: [
    { label: "Merchant", value: "MERCHANT" },
    { label: "Merchant-Operations", value: "MERCHANT_OPERATIONS" },
  ],
  DEFAULT: [
    { label: "Merchant", value: "MERCHANT" },
    { label: "Operations", value: "OPERATIONS" },
    { label: "Vendor", value: "VENDOR" },
    { label: "Merchant-Admin", value: "MERCHANT_ADMIN" },
  ],
};
