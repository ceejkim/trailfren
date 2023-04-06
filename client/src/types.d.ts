declare namespace Contentful {
  interface AffiliateSys {
    space?: {
      sys: Sys;
    };
    id: string;
    type: string;
    linkType?: string;
    createdAt?: string;
    updatedAt?: string;
    environment?: {
      sys: Sys;
    };
    revision?: number;
    contentType?: {
      sys: Sys;
    };
    locale?: string;
  }

  interface AffiliateMetadata {
    tags: any[];
  }

  interface AffiliateLandingPage {
    fields: {
      name: string;
      landingPagePath: string;
      contributionDeets: string;
      donationAmounts: string[];
    }
  }

  interface AffiliateLogo {
    metadata: {
      tags: string[];
    };
    sys: {
      space: {
        sys: {
          type: string;
          linkType: string;
          id: string;
        };
      };
      id: string;
      type: string;
      createdAt: string;
      updatedAt: string;
      environment: {
        sys: {
          id: string;
          type: string;
          linkType: string;
        };
      };
      revision: number;
      locale: string;
    };
    fields: {
      title: string;
      file: {
        url: string;
        details: {
          size: number;
          image: {
            width: number;
            height: number;
          };
        };
        fileName: string;
        contentType: string;
      };
    };
  }

  export interface AffiliateField {
    title?: string;
    description?: string;
    file?: {
      url: string;
      details: {
        size: number;
        image: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
    name?: string;
    logo?: Logo;
    aboutUs?: string;
    websiteUrl?: string;
    stripeAccountId?: string;
    landingPagePath?: string;
    contributionDeets?: string;
    donationAmounts?: string[];
    landingPages?: AffiliateLandingPage[];
  }

  export interface LandingPageField {
    name: string;
    landingPagePath: string;
    contributionDeets: string;
  }
};
export as namespace Contentful;