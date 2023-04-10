declare namespace Contentful {
  interface AffiliateEntry {
    contactFirstName: {
      "en-US": string;
    };
    contactLastName: {
      "en-US": string;
    };
    organizationName: {
      "en-US": string;
    };
    email: {
      "en-US": string;
    };
    aboutUs: {

      "en-US": string;
    };
    contributionDetails: {
      "en-US": string;
    };
    website: {
      "en-US": string;
    };
    landingPages: {
      "en-US": {
        sys: {
          id: string;
          linkType: string;
          type: string;
        };
      }[];
    };
  }

  interface SysSpace {
    type: string;
    linkType: string;
    id: string;
  }

  interface SysEnvironment {
    id: string;
    type: string;
    linkType: string;
  }

  interface SysContentType {
    type: string;
    linkType: string;
    id: string;
  }

  interface Sys {
    space: {
      sys: SysSpace;
    };
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    environment: {
      sys: SysEnvironment;
    };
    revision: number;
    contentType: {
      sys: SysContentType;
    };
    locale: string;
  }

  interface AffiliateLandingPage {
    metadata: {
      tags: any[];
    };
    sys: Sys;
    fields: LandingPageFields;
  }

  interface LandingPageFields {
    name: string;
    landingPagePath: string;
    contributionDeets: string;
    donationAmounts: string[];
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
    contactFirstName: string;
    contactLastName: string;
    treasurerEmail: string;
    adminFirebaseEmail: string;
    logo?: Logo;
    aboutUs?: string;
    websiteUrl?: string;
    stripeAccountId?: string;
    landingPagePath?: string;
    contributionDeets?: string;
    donationAmounts?: string[];
    landingPages?: AffiliateLandingPage[];
  }
};
export as namespace Contentful;