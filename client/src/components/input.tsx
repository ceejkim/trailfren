"use client";

import { ChangeEvent, FunctionComponent } from "react";

interface InputProps {
  name: string;
  placeholder?: string;
  step?: "any" | number;
  type?: "email" | "password" | "number";
  value?: string | number;
  style: "full-border" | "bottom-border";
  size?: "large";
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const styles = {
  "full-border":
    "h-9 w-full border rounded-md border-gray-300 px-2 py-1 text-xs transition-opacity duration-1000 ease-out focus:border-b-2 focus:border-white focus:bg-gray-100 focus:outline-black",
  "bottom-border":
    "h-9 w-full border-b border-gray-300 px-2 py-1 text-xs transition-opacity duration-1000 ease-out focus:border-b-2 focus:border-white focus:bg-gray-100 focus:outline-black",
};
const largeStyles = {
  "full-border":
    "h-12 w-full border rounded-md border-gray-300 px-2 py-1 text-md transition-opacity duration-1000 ease-out focus:border-b-2 focus:border-white focus:bg-gray-100 focus:outline-black",
  "bottom-border":
    "h-12 w-full border-b border-gray-300 px-2 py-1 text-md transition-opacity duration-1000 ease-out focus:border-b-2 focus:border-white focus:bg-gray-100 focus:outline-black",
};

const Input: FunctionComponent<InputProps> = (props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e);
  };
  return (
    <input
      className={
        props.size === "large" ? largeStyles[props.style] : styles[props.style]
      }
      type={props.type || "text"}
      name={props.name}
      value={props.value || ''}
      step={props.step}
      onChange={handleChange}
      placeholder={props.placeholder}
    />
  );
};

export default Input;
