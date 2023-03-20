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
};

export default Modal;
