"use client";

import { useEffect } from "react";
import Button from "../components/button";

interface Props {
  setModalVisible: (value: boolean) => void;
}

export default function Home(props: Props) {
  useEffect(() => {
    if (window.location.pathname !== "/") {
      window.location.pathname = "/";
    }
  }, []);

  return (
    <>
      <div className="bg-black py-52">
        <div className=" pl-3 mx-auto flex max-w-4xl flex-col justify-center text-left">
          <h1 className="text-5xl md:text-6xl mb-12 font-medium leading-tight text-salmon-400">
            Setup payments for your <br />
            outdoor / non-profit <br /> organization in 10 minutes or less
          </h1>
          <div style={{ justifyContent: "center", display: "flex" }}>
            <Button onClick={() => props.setModalVisible(true)}>
              Set Up Now
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center bg-white p-3 md:p-40">
        <div className=" text-5xl md:block mb-3 md:mb-20 w-full max-w-3xl bg-salmon-100 px-6 py-20 text-center md:text-7xl font-normal text-black">
          <p>With our trailfren QR codes you can:</p>
        </div>
        <div className="mb-20 w-full md:max-w-3xl bg-salmon-100 pl-10 pr-3 md:px-24 py-16 text-2xl font-bold text-black">
          <ul className="list-disc">
            <li className="mb-4 text-3xl md:text-4xl font-medium">
              Setup digital payments in 10 minutes or less
            </li>
            <li className="mb-4 text-3xl md:text-4xl font-medium">
              Access Apple Pay, Google Pay, Venmo, Paypal and CC options in one
              place
            </li>
            <li className="mb-4 text-3xl md:text-4xl font-medium">
              No app downloads or technical knowledge required
            </li>
            <li className="mb-4 text-3xl md:text-4xl font-medium">
              No subscription fees, no hassle
            </li>
            <li className="mb-4 text-3xl md:text-4xl font-medium">
              Perfect for volunteer run-events & small business
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
