import { HandlerEvent, HandlerContext } from "@netlify/functions";
import GoTrue from 'gotrue-js';

interface PasswordResetBody {
  email: string;
}

exports.handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    if (!event.body) {
      return { statusCode: 400, error: 'Invalid request body' };
    }

    const { email } = JSON.parse(event.body) as PasswordResetBody;

    if (!email) {
      return { statusCode: 400, error: 'Email is required' };
      return;
    }

    // Initialize a new GoTrue client
    const auth = new GoTrue({
      APIUrl: `${process.env.NETLIFY_IDENTITY_API_URL}/.netlify/identity`,
      setCookie: true,
    });

    // Send a password reset email to the user
    await auth.requestPasswordRecovery(email);
    return { statusCode: 200, message: 'Password reset email sent' };
  } catch (error) {
    return { statusCode: 500, error: 'Failed to send password reset email' };
  }
}