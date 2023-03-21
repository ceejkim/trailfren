import { FunctionComponent, ReactEventHandler, useState } from "react";
import axios from "axios";

import * as styles from "./LoginModal.module.css";

interface ModalProps {
  showModal: boolean;
}

const Modal: FunctionComponent<ModalProps> = ({ showModal }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
    createPassword: "",
    retypePassword: "",
  });

  const [forgotPasswordClicked, setForgotPasswordClicked] =
    useState<boolean>(false);
  const [createAccountClicked, setCreateAccountClicked] =
    useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignIn: ReactEventHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/.netlify/functions/login", {
        email: formData.email,
        password: formData.password,
      });
      console.log(response);
      // Handle success (e.g., set user state, close modal)
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show error message)
    }
  };

  const handleCreateAccount: ReactEventHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/.netlify/functions/signup", {
        email: formData.email,
        password: formData.password,
      });
      console.log(response);
      // Handle success (e.g., set user state, close modal)
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show error message)
    }
  };

  const handleForgotPassword: ReactEventHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put("/.netlify/functions/reset-password", {
        email: formData.email,
      });
      console.log(response);
      // Handle success (e.g., show success message)
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show error message)
    }
  };

  const header = () => {
    if (forgotPasswordClicked)
      return <h2 className={styles.header}>Forgot Password</h2>;
    if (createAccountClicked)
      return <h2 className={styles.header}>Create Account</h2>;
    return <h2 className={styles.header}>Welcome to trailfren</h2>;
  };

  return (
    <div>
      {showModal ? (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {header()}
            <form className={styles.form}>
              {createAccountClicked && (
                <>
                  <div className={styles.doubleInput}>
                    <input
                      className={styles.input}
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                    />
                    <input
                      className={styles.input}
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                    />
                  </div>
                  <input
                    className={styles.input}
                    type="password"
                    name="createPassword"
                    value={formData.createPassword}
                    onChange={handleChange}
                    placeholder="Create Password"
                  />
                  <input
                    className={styles.input}
                    type="password"
                    name="retypePassword"
                    value={formData.retypePassword}
                    onChange={handleChange}
                    placeholder="Re-type Password"
                  />
                </>
              )}
              {!createAccountClicked && !forgotPasswordClicked ? (
                <>
                  <input
                    className={styles.input}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                  <input
                    className={styles.input}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                  />
                </>
              ) : null}
              {forgotPasswordClicked && (
                <input
                  className={styles.input}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              )}
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
                    onClick={(e) => {
                      e.preventDefault();
                      setForgotPasswordClicked(false);
                    }}
                  >
                    Back to sign in
                  </button>
                </div>
              ) : (
                <div className={styles.secondaryButtonContainer}>
                  <button
                    className={styles.secondaryButton}
                    onClick={(e) => {
                      e.preventDefault();
                      setForgotPasswordClicked(true);
                    }}
                  >
                    Forgot Password?
                  </button>
                  <button
                    className={styles.secondaryButton}
                    onClick={(e) => {
                      e.preventDefault();
                      setCreateAccountClicked(true);
                    }}
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
