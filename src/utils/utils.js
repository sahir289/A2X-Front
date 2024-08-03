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
    if (obj[name]) {
      queryParams.push(`${name}=${obj[name]}`);
    }
  }
  return `?${queryParams.join("&")}`
}

export const statusOptions = [
  { value: '', label: 'Select' },
  { value: 'INITIATED', label: 'INITIATED' },
  { value: 'ASSIGNED', label: 'ASSIGNED' },
  { value: 'SUCCESS', label: 'SUCCESS' },
  { value: 'DROPPED', label: 'DROPPED' },
  { value: 'DUPLICATE', label: 'DUPLICATE' },
  { value: 'DISPUTE', label: 'DISPUTE' },
  { value: 'IMG_PENDING', label: 'IMG_PENDING' },
];

export const reasonOptions = ["Insufficient Fund", "Invalid Bank Details", "Other"].map(el => ({ value: el, label: el }));


export const RequiredRule = [
  {
    required: true,
    message: "${label} is Required!",
  }
]


export const parseErrorFromAxios = (err) => {
  return err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || "Unknown Error";
}
