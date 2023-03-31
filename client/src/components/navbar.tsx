"use client";

import { FunctionComponent, useContext } from "react";
import { Link } from "react-router-dom";
// import { MyContext } from "../routes";

interface NavbarProps {
  setModalVisible: (value: boolean) => void;
}

const style = {
  active:
    "mr-2 border-b-2 border-white text-base font-light text-white no-underline",
  inactive: "mr-2 text-base font-light text-white no-underline",
};

const Navbar: FunctionComponent<NavbarProps> = (props) => {
  // const { sdk } = useContext(MyContext);
  const pathname = window.location.pathname;

  return (
    <nav className="flex w-full flex-row justify-between bg-black px-16 py-12">
      <div>
        <Link to="/" className="text-4xl text-white no-underline">
          trailfren
        </Link>
      </div>
      <div className="flex w-56 flex-row justify-between pt-4">
        <Link
          to="/"
          className={`mr-2 text-lg font-light text-white underline-offset-8 ${
            pathname === "/" ? style.active : style.inactive
          }`}
        >
          Home
        </Link>
        <Link
          to="/faq"
          className={`mr-2 text-lg font-light text-white${
            pathname === "/faq" ? style.active : style.inactive
          }`}
        >
          FAQ
        </Link>
        <button
          className="rounded-md px-4 py-0 text-lg font-light text-white no-underline"
          onClick={() => props.setModalVisible(true)}
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
