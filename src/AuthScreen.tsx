import { Apple, ArrowRight, Bird, Loader2, Mail, Phone, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { sendPhoneOtp, signInWithProvider, supabaseAuthConfigured, verifyPhoneOtp } from "./auth";

type AuthScreenProps = {
  allowDemoPreview: boolean;
  authReady: boolean;
  onDemoPreview: () => void;
};

type SubmitState = "idle" | "submitting";

function getAuthError(error: unknown) {
  return error instanceof Error ? error.message : "Authentication failed. Please try again.";
}

export function AuthScreen({ allowDemoPreview, authReady, onDemoPreview }: AuthScreenProps) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const busy = submitState === "submitting" || !authReady;

  async function runAuth(action: () => Promise<void>) {
    setSubmitState("submitting");
    setError("");
    setMessage("");
    try {
      await action();
    } catch (authError) {
      setError(getAuthError(authError));
    } finally {
      setSubmitState("idle");
    }
  }

  function startProvider(provider: "apple" | "google") {
    void runAuth(() => signInWithProvider(provider));
  }

  function submitPhone(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedPhone = phone.trim();
    const normalizedOtp = otp.trim();
    if (!normalizedPhone) return;

    void runAuth(async () => {
      if (!otpSent) {
        await sendPhoneOtp(normalizedPhone);
        setOtpSent(true);
        setMessage("Code sent.");
        return;
      }

      if (!normalizedOtp) {
        setError("Enter the code we sent.");
        return;
      }

      await verifyPhoneOtp(normalizedPhone, normalizedOtp);
    });
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel" aria-label="Sign in">
        <div className="auth-brand">
          <span>
            <Bird size={24} />
          </span>
          <div>
            <strong>Flock BirdWatch</strong>
            <small>Secure camera and league access</small>
          </div>
        </div>

        <div className="auth-heading">
          <p className="eyebrow">Welcome back</p>
          <h1>Sign in</h1>
        </div>

        {!supabaseAuthConfigured && (
          <div className="auth-config-note" role="status">
            <ShieldCheck size={18} />
            <span>Add the Supabase environment variables to enable live sign in.</span>
          </div>
        )}

        <div className="auth-provider-grid">
          <button disabled={busy || !supabaseAuthConfigured} onClick={() => startProvider("google")} type="button">
            <Mail size={18} />
            Continue with Gmail
          </button>
          <button disabled={busy || !supabaseAuthConfigured} onClick={() => startProvider("apple")} type="button">
            <Apple size={18} />
            Continue with Apple
          </button>
        </div>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <form className="phone-auth-form" onSubmit={submitPhone}>
          <label>
            <span>Phone number</span>
            <input
              autoComplete="tel"
              disabled={busy || !supabaseAuthConfigured}
              inputMode="tel"
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+1 555 123 4567"
              value={phone}
            />
          </label>
          {otpSent && (
            <label>
              <span>Code</span>
              <input
                autoComplete="one-time-code"
                disabled={busy || !supabaseAuthConfigured}
                inputMode="numeric"
                onChange={(event) => setOtp(event.target.value)}
                placeholder="123456"
                value={otp}
              />
            </label>
          )}
          <button className="primary-button" disabled={busy || !supabaseAuthConfigured} type="submit">
            {busy ? <Loader2 className="spin-icon" size={17} /> : <Phone size={17} />}
            {otpSent ? "Verify code" : "Send code"}
          </button>
        </form>

        {(message || error) && <p className={error ? "auth-error" : "auth-message"}>{error || message}</p>}

        {allowDemoPreview && (
          <button className="demo-preview-button" onClick={onDemoPreview} type="button">
            Preview local demo
            <ArrowRight size={17} />
          </button>
        )}
      </section>

      <aside className="auth-art" aria-hidden="true">
        <div>
          <span>Private by default</span>
          <strong>Motion clips stay in review until you share them.</strong>
        </div>
      </aside>
    </main>
  );
}
