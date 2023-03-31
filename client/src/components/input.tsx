"use client";

import { ChangeEvent, FunctionComponent } from "react";

interface InputProps {
  name: string;
  placeholder: string;
  type?: 'email' | 'password';
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input: FunctionComponent<InputProps> = (props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e);
  };
  return (
    <input
      className="h-9 w-full border-b border-gray-300 px-2 py-1 text-xs transition-opacity duration-1000 ease-out focus:border-b-2 focus:border-white focus:bg-gray-100 focus:outline-black"
      type={props.type || "text"}
      name={props.name}
      value={props.value}
      onChange={handleChange}
      placeholder={props.placeholder}
    />
  );
};

export default Input;
