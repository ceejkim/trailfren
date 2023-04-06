"use client";

import { FunctionComponent, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TrailfrenContext } from "../routes";

interface NavbarProps {
  setModalVisible: (value: boolean) => void;
}

const style = {
  active:
    "mr-2 border-b-2 border-white text-base font-light text-white no-underline",
  inactive: "mr-2 text-base font-light text-white no-underline",
};

const Navbar: FunctionComponent<NavbarProps> = (props) => {
  const { user } = useContext(TrailfrenContext);
  const location = useLocation();
  const navigate = useNavigate();

  const navbarPaths = ["/", "/faq", "/account"];
  const pathname = location.pathname;
  if (navbarPaths.includes(pathname) === false) return <div />;

  console.log('user', user);

  return (
    <nav className="flex w-full flex-col md:flex-row justify-between bg-black px-16 py-12 h-[142px]">
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
        {user.username ? (
          <Link
            to="/account"
            className={`mr-2 text-lg font-light text-white${
              pathname === "/account" ? style.active : style.inactive
            }`}
          >
            Account
          </Link>
        ) : (
          <button
            className="rounded-md px-4 py-0 text-lg font-light text-white no-underline"
            onClick={() => props.setModalVisible(true)}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
