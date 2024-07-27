import React, { useState } from "react";

function InputText({
  labelTitle,
  labelStyle,
  type,
  containerStyle,
  defaultValue,
  placeholder,
  updateFormValue,
  updateType,
  disabled,
  value,
  upperCase = false,
  radius,
  readOnly = false,
  width = "w-full",
  onBlur,
  emailValidate,
}) {
  const [error, setError] = useState("");

  const validateInput = (enteredValue) => {
    if (
      (type === "number" || type === "phone") &&
      !/^\d+(\.\d+)?$/.test(enteredValue)
    ) {
      setError("Please enter a valid number");
    } else if (type === "email" && !/\S+@\S+\.\S+/.test(enteredValue)) {
      setError("Please enter a valid email address");
    } else {
      setError(""); // Clear error if validation passes
    }
  };

  const handleInputChange = (e) => {
    let enteredValue = e.target.value;
    if (upperCase) {
      enteredValue = enteredValue.toUpperCase(); // Convert entered value to uppercase
    }

    // Remove commas from the entered value if the type is "number" and not "phone"
    if (type === "number" && type !== "phone") {
      enteredValue = enteredValue.replace(/,/g, "");
    }

    validateInput(enteredValue);
    updateFormValue({ updateType, value: enteredValue });
  };

  const formattedValue =
    type === "number"
      ? value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : value;

  return (
    <div className={`form-control ${width} ${containerStyle}`}>
      <label className={`label ${labelStyle}`}>
        <span className={"label-text text-base-content " + labelStyle}>
          {labelTitle}
        </span>
      </label>
      <input
        autoComplete={"off"}
        type={"text"}
        value={formattedValue} // Use formattedValue for the input's value
        placeholder={placeholder || ""}
        onChange={handleInputChange}
        className={`input input-bordered w-full ${radius}`}
        disabled={disabled}
        style={{ textTransform: upperCase ? "uppercase" : "none" }} // Set text transform style
        readOnly={readOnly}
        onBlur={onBlur}
      />
      {!emailValidate && error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  );
}

export default InputText;
