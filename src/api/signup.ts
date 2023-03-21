import { HandlerEvent, HandlerContext } from "@netlify/functions";
import GoTrue from 'gotrue-js';

interface SignupBody {
  email: string;
  password: string;
}

exports.handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    if (!event.body) {
      return { statusCode: 400, error: 'Invalid request body' };
    }
    console.log('event.body', event.body);
    const { email, password } = JSON.parse(event.body) as SignupBody;

    console.log('email', email);
    console.log('password', password);

    if (!email || !password) {
      return { statusCode: 400, error: 'Email and password are required' };
    }

    // Initialize a new GoTrue client
    const auth = new GoTrue({
      APIUrl: `${process.env.NETLIFY_IDENTITY_API_URL}/.netlify/identity`,
      setCookie: true,
    });

    // Sign up the user with the provided email and password
    const user = await auth.signup(email, password);
    console.log('user', user);
    return { statusCode: 200, message: 'Signup successful', user };
  } catch (error) {
    return { statusCode: 500, error: 'Failed to sign up user' };
  }
}