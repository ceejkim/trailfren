import { HandlerEvent, HandlerContext } from "@netlify/functions";
import GoTrue from 'gotrue-js';

interface LoginBody {
  email: string;
  password: string;
}

exports.handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  if (!event.body) {
    return { statusCode: 400, error: 'Invalid request body' };
  }
  const { email, password } = JSON.parse(event.body) as LoginBody;

  if (!email || !password) {
    return { statusCode: 400, error: 'Email and password are required' };
  }

  // Initialize a new GoTrue client
  const auth = new GoTrue({
    APIUrl: `${process.env.NETLIFY_IDENTITY_API_URL}/.netlify/identity`,
    setCookie: true,
  });


  try {
    // Log in the user with the provided email and password
    const user = await auth.login(email, password);
    return { statusCode: 200, message: 'Login successful', user };
  } catch (error) {
    return { statusCode: 401, error: 'Invalid email or password' };
  }
}