"use client";

import { FormEvent, FunctionComponent, useState } from "react";

interface ButtonProps {
  children: string;
  onChange: (e: FormEvent<HTMLButtonElement>) => void;
}

const Button: FunctionComponent<ButtonProps> = (props) => {
  return (
    <button
      onChange={props.onChange}
      className="bg-salmon-400 mx-auto h-16 w-[137px] rounded-none border-none py-2 text-center text-white hover:cursor-pointer hover:opacity-80 disabled:shadow-none"
    >
      {props.children}
    </button>
  );
};

export default Button;
