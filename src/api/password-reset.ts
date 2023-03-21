import { GatsbyFunctionRequest, GatsbyFunctionResponse } from 'gatsby';
import GoTrue from 'gotrue-js';

interface PasswordResetBody {
  email: string;
}

export default async function handlePasswordReset(req: GatsbyFunctionRequest<PasswordResetBody>, res: GatsbyFunctionResponse) {
  const { email } = req.body;

  if (!email) {
    res.status(400).send({ error: 'Email is required' });
    return;
  }

  // Initialize a new GoTrue client
  const auth = new GoTrue({
    APIUrl: `${process.env.NETLIFY_IDENTITY_API_URL}/.netlify/identity`,
    setCookie: true,
  });

  try {
    // Send a password reset email to the user
    await auth.requestPasswordRecovery(email);
    res.status(200).send({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to send password reset email' });
  }
}