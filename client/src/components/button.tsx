"use client";

import { FormEvent, FunctionComponent, useState } from "react";

interface ButtonProps {
  children: string;
  width?: string;
  loading?: boolean;
  type?: "secondary" | "primary";
  onClick?: (e: FormEvent<HTMLButtonElement>) => void;
}

const Button: FunctionComponent<ButtonProps> = (props) => {
  const classes = {
    primary: `bg-salmon-400 px-4 h-16 w-[${
      props.width || "150px"
    }] rounded-none border-none p-2 text-center text-white hover:cursor-pointer hover:opacity-80 disabled:shadow-none${
      props.loading ? "opacity-50 cursor-not-allowed" : ""
    }`,
    secondary: `bg-white px-4 h-16 w-[${
      props.width || "150px"
    }] rounded-none border-none p-2 text-center text-salmon-400 hover:cursor-pointer hover:opacity-80 disabled:shadow-none${
      props.loading ? "opacity-50 cursor-not-allowed" : ""
    }`,
  };
  return (
    <button
      onClick={props.onClick}
      className={classes[props.type || "primary"]}
    >
      {props.children}
    </button>
  );
};

export default Button;
