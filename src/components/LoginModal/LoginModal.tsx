import { FunctionComponent, ReactEventHandler, useState } from "react";
import * as styles from "./LoginModal.module.css";

interface ModalProps {
  showModal: boolean;
}

const Modal: FunctionComponent<ModalProps> = ({ showModal }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [forgotPasswordClicked, setForgotPasswordClicked] =
    useState<boolean>(false);

  const handleSignIn: ReactEventHandler = (event) => {
    event.preventDefault();
    // Handle sign in logic here
  };

  const handleCreateAccount: ReactEventHandler = (event) => {
    event.preventDefault();
    // Handle create account logic here
  };

  const handleForgotPassword: ReactEventHandler = (event) => {
    event.preventDefault();
    // Handle forgot password logic here
  };

  console.log("showModal", showModal);

  return (
    <div>
      {showModal ? (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.header}>Welcome to trailfren</h2>
            <form className={styles.form}>
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              {forgotPasswordClicked ? (
                <button
                  className={styles.mainButton}
                  onClick={handleForgotPassword}
                >
                  Send Reset Link
                </button>
              ) : (
                <button className={styles.mainButton} onClick={handleSignIn}>
                  Sign In
                </button>
              )}
              {forgotPasswordClicked ? (
                <div className={styles.secondaryButtonContainer}>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => setForgotPasswordClicked(false)}
                  >
                    Back to sign in
                  </button>
                </div>
              ) : (
                <div className={styles.secondaryButtonContainer}>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => setForgotPasswordClicked(true)}
                  >
                    Forgot Password?
                  </button>
                  <button
                    className={styles.secondaryButton}
                    onClick={handleCreateAccount}
                  >
                    Create account
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Modal;
