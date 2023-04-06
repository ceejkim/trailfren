"use client";

import {
  ReactEventHandler,
  useState,
  FunctionComponent,
  useRef,
  useEffect,
  useContext,
} from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

import Input from "./input";
import { TrailfrenContext } from "../routes";
import { app } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  setModalVisible: (value: boolean) => void;
  visible: boolean;
}

type FormTypes = "signIn" | "createAccount" | "forgotPassword";

const defaultForm = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  confirmPassword: "",
  createPassword: "",
  retypePassword: "",
};

const LoginModal: FunctionComponent<LoginModalProps> = (props) => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const { sdk } = useContext(TrailfrenContext);

  const modalContentRef = useRef<HTMLDivElement>(null);

  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [formType, setFormType] = useState<FormTypes>("signIn");
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target)
      ) {
        props.setModalVisible(false);
      }
    };
    if (props.visible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [props.visible]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignIn: ReactEventHandler = async (event) => {
    event.preventDefault();
    setFormError(undefined);
    try {
      setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      // Signed in
      const user = userCredential.user;
      props.setModalVisible(false);
      navigate("/account");
    } catch (error: any) {
      console.error(error);
      setFormError("user not found");
    }
  };

  const handleCreateAccount: ReactEventHandler = async (event) => {
    event.preventDefault();
    setFormError(undefined);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      // Signed in
      const user = userCredential.user;
      props.setModalVisible(false);
      navigate("/account");
    } catch (error: any) {
      setFormError(error || "unknown error");
    }
  };

  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    try {
      await sendPasswordResetEmail(auth, formData.email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error: any) {
      setFormError(`Error: ${error?.message} || unknown error`);
    }
  };

  const header = () => {
    if (formType === "forgotPassword")
      return (
        <h2 className="text-2xl font-normal text-gray-800">Reset Password</h2>
      );
    if (formType === "createAccount")
      return (
        <h2 className="text-2xl font-normal text-gray-800">Create Account</h2>
      );
    return (
      <h2 className="text-2xl font-normal text-gray-800">
        Welcome to trailfren
      </h2>
    );
  };

  const form = () => {
    switch (formType) {
      case "createAccount":
        return (
          <>
            <div className="flex w-full flex-row justify-between gap-2">
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                style="bottom-border"
              />
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                style="bottom-border"
              />
            </div>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              style="bottom-border"
            />
            <Input
              name="createPassword"
              value={formData.createPassword}
              onChange={handleChange}
              placeholder="Create Password"
              type="password"
              style="bottom-border"
            />
            <Input
              name="retypePassword"
              value={formData.retypePassword}
              onChange={handleChange}
              placeholder="Re-type Password"
              type="password"
              style="bottom-border"
            />
          </>
        );

      case "forgotPassword":
        return (
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            style="bottom-border"
          />
        );
      default:
        return (
          <>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              style="bottom-border"
            />
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              style="bottom-border"
            />
          </>
        );
    }
  };

  const buttons = () => {
    switch (formType) {
      case "forgotPassword":
        return (
          <>
            <button
              className="px-4 block w-full rounded-md bg-gray-800 py-3 text-xs font-medium text-white hover:bg-gray-800"
              onClick={handleForgotPassword}
            >
              Send Reset Link
            </button>
            <div className="flex w-full flex-row justify-center space-x-2.5">
              <button
                className="mt-1 block border-none bg-white/0 p-0 text-xs leading-5 text-gray-800"
                onClick={(e) => {
                  e.preventDefault();
                  setFormType("signIn");
                }}
              >
                Back to sign in
              </button>
            </div>
          </>
        );

      case "createAccount":
        return (
          <>
            <button
              className="block w-full rounded-md bg-gray-800 py-3 text-sm font-medium text-white hover:bg-gray-800"
              onClick={handleCreateAccount}
            >
              Create Account
            </button>
            <div className="flex w-full flex-row justify-center space-x-0.5">
              <button
                disabled
                className="block border-none p-0 text-xs leading-5 text-gray-800"
              >
                Already have an account?
              </button>
              <button
                className="block border-none p-0 text-xs leading-5 text-gray-800"
                onClick={(e) => {
                  e.preventDefault();
                  setFormType("forgotPassword");
                }}
              >
                Sign in
              </button>
            </div>
          </>
        );

      default:
        return (
          <>
            <button
              className="block w-full rounded-md bg-gray-800 py-3 text-sm font-medium uppercase text-white hover:bg-gray-800"
              onClick={handleSignIn}
            >
              Sign In
            </button>
            <div className="flex w-full flex-row justify-center space-x-2.5">
              <button
                className="mt-6 block border-none bg-white/0 p-0 text-xs capitalize leading-5 text-gray-800"
                onClick={(e) => {
                  e.preventDefault();
                  setFormType("forgotPassword");
                }}
              >
                Forgot Password?
              </button>
              <button
                className="mt-6 block border-none bg-white/0 p-0 text-xs capitalize leading-5 text-gray-800"
                onClick={(e) => {
                  e.preventDefault();
                  setFormType("createAccount");
                }}
              >
                Create account
              </button>
            </div>
          </>
        );
    }
  };
  return props.visible ? (
    <div className="fixed inset-0 z-10 flex h-full w-full items-center justify-center bg-black/50 pt-11">
      <div
        ref={modalContentRef}
        className="relative w-full max-w-md rounded-sm bg-white p-11 pb-6 text-center shadow-md"
      >
        <button
          className="absolute font-arial text-2xl top-5 right-5 cursor-pointer"
          onClick={() => props.setModalVisible(false)}
        >
          ×
        </button>
        {header()}
        <form className="mt-5 flex flex-col items-center">
          {form()}
          <p className="m-0 h-0 text-xs">{message}</p>
          <p className="m-0 h-0 text-xs text-red">{formError}</p>
          <div className="mt-6">{buttons()}</div>
        </form>
      </div>
    </div>
  ) : null;
};

export default LoginModal;
