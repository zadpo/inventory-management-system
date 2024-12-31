import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1">{label}</label>
      <input className="border rounded p-2" {...props} />
    </div>
  );
};

export default FormInput;
