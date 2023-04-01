"use client";

import { FormEvent, FunctionComponent, useState } from "react";
import Button from "./button";

interface FooterProps {}

const Footer: FunctionComponent<FooterProps> = ({}) => {
  const [emailAddress, setEmailAddress] = useState<string>("");

  const handleEmailAddress = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmailAddress(e.target.value);
  };

  const handleSignUp = (e: FormEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    console.log("emailAddress", emailAddress);
  };

  const footerPaths = ["/", "/faq"];
  const pathname = window.location.pathname;
  if (footerPaths.includes(pathname) === false) return <div />;

  return (
    <section className="mb-14 mt-36 h-64 text-center">
      <div className="text-4xl font-medium text-black">trailfren</div>
      <div className="my-10 text-base text-black">
        Sign up with your email address to receive news and updates.
      </div>
      <div className="mx-auto flex w-full max-w-[470px] flex-row justify-between">
        <input
          name="emailAddress"
          id="emailAddress"
          placeholder="Email Address"
          // onChange={handleEmailAddress}
          className=".placeholder:text-gray-400 h-16 w-[300px] rounded-none border border-gray-100 pl-5"
        />
        <Button onChange={handleSignUp}>Sign Up</Button>
      </div>
    </section>
  );
};

export default Footer;
