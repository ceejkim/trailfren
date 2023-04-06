import { FormEvent, FunctionComponent, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import Button from "./button";
import { app } from "../firebaseConfig";

interface FooterProps {}

const FooterDonations: FunctionComponent<FooterProps> = ({}) => {
  const auth = getAuth(app);
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleEmailAddress = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handleSignUp = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setMessage("");

    try {
      const randomPassword = uuidv4(); // Generate a random UUID as the password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        randomPassword
      );
      const user = userCredential.user;
      await sendEmailVerification(user);

      setMessage(
        "A verification email has been sent to your email address. Please check your inbox."
      );
    } catch (error: any) {
      console.error("Error during sign up:", error);
      setError(error.message);
    }
  };

  // const footerPaths = ["/", "/faq", "/account"];
  // const pathname = window.location.pathname;
  // if (footerPaths.includes(pathname) === false) return <div />;

  return (
    <section className="mb-80 md:mb-14 px-3 md:px-0 md:mt-36 h-64 text-center">
      <div className="text-4xl font-medium text-black">trailfren</div>
      {message ? (
        <div className=" my-4">{message}</div>
      ) : (
        <>
          <div className="my-10 text-base text-black">
            Sign up with your email address to receive news and updates.
          </div>
          <form
            onSubmit={handleSignUp}
            className="mx-auto flex w-full max-w-[470px] flex-row justify-between"
          >
            <input
              name="emailAddress"
              id="emailAddress"
              type="email" // Add the email input type for better validation
              placeholder="Email Address"
              onChange={handleEmailAddress}
              className=".placeholder:text-gray-400 h-16 w-[300px] rounded-none border border-gray-100 pl-5"
              required // Add the required attribute to ensure input isn't empty
            />
            <Button>Sign Up</Button>
          </form>
        </>
      )}
      {error && (
        <div className="text-red my-4">
          There was an error signing up: {error}
        </div>
      )}
    </section>
  );
};

export default FooterDonations;
