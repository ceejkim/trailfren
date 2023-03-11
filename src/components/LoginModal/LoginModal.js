import React, { useState } from "react";

import * as styles from "./LoginModal.module.css";

function Modal({ showModal }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPasswordClicked, setForgotPasswordClicked] = useState(false);

  const handleSignIn = (event) => {
    event.preventDefault();
    // Handle sign in logic here
  };

  const handleCreateAccount = (event) => {
    event.preventDefault();
    // Handle create account logic here
  };

  const handleForgotPassword = (event) => {
    event.preventDefault();
    // Handle forgot password logic here
  };
  console.log("showModal", showModal);

  return (
    <div>
      {showModal ? (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.header}>Welcome to Trailfren</h2>
            <form className={styles.form}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              {forgotPasswordClicked ? (
                <div>
                  <button onClick={handleForgotPassword}>Submit</button>
                  <button onClick={() => setForgotPasswordClicked(false)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <button onClick={handleSignIn}>Sign In</button>
                  <button onClick={handleCreateAccount}>Create Account</button>
                  <button onClick={() => setForgotPasswordClicked(true)}>
                    Forgot Password?
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Modal;
