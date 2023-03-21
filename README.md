# TrailFren main site

## Tech Stack

1. Built with Gatsby
2. Hosted on Netlify
3. Content managed with Contentful

## Getting Started

1. create .env file in the root directory with the following variables

        ``` shell
        STRIPE_SECRET_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        GATSBY_STRIPE_PUBLIC_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        CONTENTFUL_HOST=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        CONTENTFUL_SPACE_ID=XXXXXXXX
        CONTENTFUL_PREVIEW_ACCESS_TOKEN=XXXXXXXX
        CONTENTFUL_ENVIRONMENT=XXXXXXXX
        ```

2. run `pnpm install`
3. run `pnpm run dev`

## To Do

1. handle email in Footer.tsx
2. login form - same as Squarespace.
3. signup form - same as Squarespace.
4. account page - allow for initial setup and editing of account details.
5. if any information is missing then disable their page and show a message to the user to complete the form.
