import { GatsbyFunctionRequest, GatsbyFunctionResponse } from 'gatsby';
import GoTrue from 'gotrue-js';

interface SignupBody {
  email: string;
  password: string;
}

export default async function handleSignup(req: GatsbyFunctionRequest<SignupBody>, res: GatsbyFunctionResponse) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ error: 'Email and password are required' });
    return;
  }

  // Initialize a new GoTrue client
  const auth = new GoTrue({
    APIUrl: `${process.env.NETLIFY_IDENTITY_API_URL}/.netlify/identity`,
    setCookie: true,
  });

  try {
    // Sign up the user with the provided email and password
    const user = await auth.signup(email, password);
    res.status(200).send({ message: 'Signup successful', user });
  } catch (error) {
    res.status(500).send({ error: 'Failed to sign up user' });
  }
}