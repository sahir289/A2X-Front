import {  Select } from "antd";
import { useState } from "react";

function SelectDropdown({
  labelTitle,
  labelStyle,
  mode,
  containerStyle,
  defaultValue,
  placeholder,
  updateFormValue,
  updateType,
  options,
  size
}) {
  const [value, setValue] = useState(defaultValue);

  const updateInputValue = (val) => {
    setValue(val);
    updateFormValue({ updateType, value: val });
  };

  return (
    <>
      <div className={`form-control w-full ${containerStyle}`}>
        <label className="label">
          <span className={"label-text text-base-content " + labelStyle}>
            {labelTitle}
          </span>
        </label>
        {(
          <Select
            value={value}
            mode={mode ?? undefined}
            placeholder={placeholder || ""}
            onChange={(value) => updateInputValue(value)}
            // className="input  input-bordered w-full "
            size={size?? 'large'}
            options={options}
          />
        ) }
      </div>
    </>
  );
}

export default SelectDropdown;
