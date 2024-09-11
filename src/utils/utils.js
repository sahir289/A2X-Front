export function formatDate(inputDate) {
  const date = new Date(inputDate);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} at ${hours}:${minutes}:${seconds}`;
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


// export const getQueryFromObject = (obj = {}) => {
//   console.log("🚀 ~ getQueryFromObject ~ obj:", obj)
//   const queryParams = [];
//   for (const name in obj) {
//     if (obj[name] !== undefined && obj[name] !== null && obj[name] !== "" ) {
//       queryParams.push(`${name}=${obj[name]}`);
//     }
//   }
//   return `?${queryParams.join("&")}`
// }

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
  { value: 'IMG_PENDING', label: 'IMG_PENDING' },
];

//Pay out status options list.
export const payoutInOutStatusOptions = [
  { value: 'INITIATED', label: 'INITIATED' },
  { value: 'SUCCESS', label: 'SUCCESS' },
  { value: 'FAILED', label: 'FAILED' },
]

//With draw all status options list.
export const WithDrawAllOptions = [
  { value: 'INITIATED', label: 'INITIATED' },
  { value: 'SUCCESS', label: 'SUCCESS' },
  { value: 'FAILED', label: 'FAILED' },
  { value: 'REVERSED', label: 'REVERSED' },

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
