declare module '*.module.css';

// gatsby-source-contentful are currently mocked in the npm package
declare module 'gatsby-source-contentful/hooks';

// this is now deprecated. intersection-observer should be supported by all browsers now
declare module 'intersection-observer';