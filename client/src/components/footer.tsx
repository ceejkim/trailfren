import {
  FormEvent,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import Button from "./button";
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { app } from "../firebaseConfig";
import { TrailfrenContext } from "../routes";
import { getAffiliateFromPath } from "../utils/affiliates";

interface FooterProps {}

const Footer: FunctionComponent<FooterProps> = ({}) => {
  const auth = getAuth(app);
  const { user, affiliates } = useContext(TrailfrenContext);
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Call the function to handle sign-in with email link when the component mounts
  useEffect(() => {
    handleSignInWithEmailLink();
  }, []);

  const handleEmailAddress = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handleSignUp = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    try {
      const actionCodeSettings = {
        url: window.location.href, // Use the current URL or any URL you want to redirect the user to after they click the email link
        handleCodeInApp: true, // This must be true to handle the sign-in link within the app
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // Show a message to the user that the sign-in link was sent
      setMessage(
        "A sign-in link was sent to your email. Please check your inbox."
      );

      // Save the email address to localStorage so that it can be used when the user clicks the link
      window.localStorage.setItem("emailForSignIn", email);
    } catch (error: any) {
      console.error("Error sending sign-in link:", error);
      setError(error.message);
    }
  };

  const handleSignInWithEmailLink = async () => {
    try {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem("emailForSignIn");
        if (!email) {
          email = prompt("Please provide your email for confirmation.");
        }
        const result = await signInWithEmailLink(
          auth,
          email!,
          window.location.href
        );
        console.log("Signed in as:", result.user);

        // Clear the email from localStorage
        window.localStorage.removeItem("emailForSignIn");
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      setError(error.message);
    }
  };
  const footerPaths = ["/", "/faq", "/account"];
  const pathname = window.location.pathname;

  const affiliate = getAffiliateFromPath(affiliates, pathname);

  if (footerPaths.includes(pathname) === false) return <div />;

  return (
    <section
      className={`${
        !!user ? "h-10" : "h-64"
      } md:mb-14 px-3 md:px-0 md:mt-36 text-center`}
    >
      <div className="text-4xl font-medium text-black">trailfren</div>
      {message ? (
        <div className=" my-4">{message}</div>
      ) : (
        <div className={!!user ? " hidden" : ""}>
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
            <Button color={affiliate?.color}>Sign Up</Button>
          </form>
        </div>
      )}
      {error && (
        <div className="text-red my-4">
          There was an error signing up: {error}
        </div>
      )}
    </section>
  );
};

export default Footer;
