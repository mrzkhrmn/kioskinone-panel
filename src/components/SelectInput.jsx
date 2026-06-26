import React from "react";
import Select from "react-select";

const customSelectStyles = {
  control: (base) => ({
    ...base,
    borderColor: "#d1d5db",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#AA182C",
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#AA182C"
      : state.isFocused
      ? "#f3f4f6"
      : "white",
    color: state.isSelected ? "white" : "#1f2937",
    "&:hover": {
      backgroundColor: state.isSelected ? "#AA182C" : "#f3f4f6",
    },
  }),
};

const SelectInput = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Seçiniz...",
  isClearable = true,
  ...rest
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isClearable={isClearable}
        styles={customSelectStyles}
        {...rest}
      />
    </div>
  );
};

export default SelectInput;

