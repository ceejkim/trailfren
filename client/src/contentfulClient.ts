import { createClient } from 'contentful';
import env from '../env';

const contentfulClient = createClient({
  space: env.CONTENTFUL_SPACE_ID,
  accessToken: env.CONTENTFUL_DELIVERY_ACCESS_TOKEN,
});

export default contentfulClient;