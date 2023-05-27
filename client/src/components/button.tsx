"use client";

import { FormEvent, FunctionComponent, useState } from "react";

interface ButtonProps {
  children: string;
  width?: string;
  loading?: boolean;
  type?: "secondary" | "primary";
  color?: string;
  onClick?: (e: FormEvent<HTMLButtonElement>) => void;
}

const TrailfrenButton = (props: ButtonProps) => {
  const classes = {
    primary: `px-4 h-16 w-[${
      props.width || "150px"
    }] rounded-none border-none p-2 text-center text-white hover:cursor-pointer hover:opacity-80 disabled:shadow-none${
      props.loading ? "opacity-50 hover:cursor-default" : ""
    }`,
    secondary: `px-4 h-16 w-[${
      props.width || "150px"
    }] rounded-none border-none p-2 text-center text-salmon-400 hover:cursor-pointer hover:opacity-80 disabled:shadow-none${
      props.loading ? "opacity-50 hover:cursor-default" : ""
    }`,
  };

  let color = "#ffffff";
  let backgroundColor = props?.color ? `#${props?.color}` : "#df7c6d";
  if (props.type === "secondary") {
    color = props?.color ? `${props?.color}` : "#df7c6d";
    backgroundColor = "#ffffff";
  }
  if (props.loading) {
    backgroundColor = "#CCCCCC";
  }
  return (
    <button
      onClick={props.onClick}
      className={classes[props.type || "primary"]}
      disabled={props.loading}
      style={{
        color,
        backgroundColor,
      }}
    >
      {props.children}
    </button>
  );
};

export default TrailfrenButton;
