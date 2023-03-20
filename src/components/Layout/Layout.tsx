import React, { FunctionComponent, useState } from "react";
import { Helmet } from "react-helmet";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/200.css";

import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

import "../base.css";
import LoginModal from "../LoginModal/LoginModal";

interface LayoutProps {
  page: string;
  children: React.ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ page, children }) => {
  const [loginModalVisible, setLoginModalVisible] = useState(true);

  const handleLoginModal = () => {
    setLoginModalVisible(!loginModalVisible);
  };
  return (
    <div className="body" style={{ maxWidth: "1600px", margin: "auto" }}>
      <Helmet title="trailfren" />
      <Navbar page={page} handleLoginModal={handleLoginModal} />
      <LoginModal showModal={loginModalVisible} />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
