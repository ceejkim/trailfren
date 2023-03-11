import React, { useState } from "react";

import * as styles from "./Footer.module.css";

const Footer = () => {
  const [emailAddress, setEmailAddress] = useState("");

  const handleEmailAddress = (e) => {
    setEmailAddress(e.target.value);
  };

  return (
    <div
      style={{
        height: "250px",
        textAlign: "center",
        marginBottom: "60px",
      }}
    >
      <div style={{ color: "black", fontSize: "40px" }}>trailfren</div>
      <div
        style={{
          color: "black",
          fontSize: "16px",
          marginTop: 40,
          marginBottom: 40,
        }}
      >
        Sign up with your email address to receive news and updates.
      </div>
      <div className={styles.form}>
        <input
          name="emailAddress"
          id="emailAddress"
          placeholder="Email Address"
          onChange={handleEmailAddress}
          className={styles.emailInput}
        />
        <button className={styles.submitButton}>Sign Up</button>
      </div>
    </div>
  );
};
export default Footer;
