import { createClient } from 'contentful';
import { createClient as createClientManagement } from 'contentful-management';

const contentfulClientManagement = createClientManagement({
  space: env.CONTENTFUL_SPACE_ID,
  accessToken: env.CONTENTFUL_PERSONAL_ACCESS_TOKEN,
});
import env from '../env';

const contentfulClient = createClient({
  space: env.CONTENTFUL_SPACE_ID,
  accessToken: env.CONTENTFUL_DELIVERY_ACCESS_TOKEN,
});

export { contentfulClient, contentfulClientManagement };