import { FunctionComponent } from "react";
import { graphql } from "gatsby";
// import { useContentfulImage } from "gatsby-source-contentful/hooks";

// import * as styles from "./landing-page.module.css";

interface LandingPageProps {
  data: {
    contentfulFren: {
      name: string;
      websiteUrl: string;
      aboutUs: {
        aboutUs: string;
      };
      logo: {
        gatsbyImageData: any;
      };
      stripeAccountId: string;
      landingPagePath: string;
    };
    contentfulLandingPage: {
      donationAmounts: string[];
      contributionDeets: {
        contributionDeets: string;
      };
    };
  };
}

const AccountPageTemplate: FunctionComponent<LandingPageProps> = (props) => {
  // const frenData = get(props, "data.contentfulFren");
  // const pageData = get(props, "data.contentfulLandingPage");

  // // for some reason useContentfulImage() doesn't accept webp images or https:
  // // so I correct for this here
  // const urlOne = frenData.logo.gatsbyImageData.images.sources[0].srcSet.replace(
  //   "https:",
  //   ""
  // );
  // const index = indexOf(urlOne, "?");
  // const url = urlOne.slice(0, index);

  // const dynamicImage = useContentfulImage({
  //   image: {
  //     url,
  //     height: 150,
  //     width: 150,
  //   },
  // });

  return (
    <div>test</div>
    // <div className={styles.background}>
    //   <Helmet title={`pay ${frenData.name} with trailfren`} />
    //   <div className={styles.logo}>
    //     {/* <div className={styles.logo}> */}
    //     <GatsbyImage image={dynamicImage} alt="" />
    //   </div>
    //   {frenData.stripeAccountId ? (
    //     <DonationBox
    //       donationAmounts={pageData.donationAmounts.map((num) => Number(num))}
    //       accountId={frenData.stripeAccountId}
    //       landingPagePath={frenData.landingPagePath}
    //     />
    //   ) : (
    //     <div className={styles.noPaymentSetup}>
    //       {frenData.name} has not yet set up their account to receive payments,
    //       please check back in later
    //     </div>
    //   )}
    //   <div className={styles.aboutSection}>
    //     {pageData.contributionDeets && (
    //       <div>
    //         <h4>How we will use your contribution</h4>
    //         <p>{pageData.contributionDeets.contributionDeets}</p>
    //       </div>
    //     )}

    //     <h4>About us</h4>
    //     <p>{frenData.aboutUs.aboutUs}</p>
    //     <p>
    //       Find out more by visiting{" "}
    //       <a
    //         href={frenData.websiteUrl}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         our website
    //       </a>
    //     </p>
    //   </div>
    //   <div className={styles.footer}>
    //     <p>
    //       Powered by <Link to="/">Trailfren</Link>
    //     </p>
    //   </div>
    // </div>
  );
};

export default AccountPageTemplate;

export const pageQuery = graphql`
  query FrenPageQuery($frenId: String!, $landingPageId: String!) {
    contentfulFren(id: { eq: $frenId }) {
      name
      websiteUrl
      aboutUs {
        aboutUs
      }
      logo {
        gatsbyImageData(layout: FULL_WIDTH)
      }
      stripeAccountId
    }
    contentfulLandingPage(id: { eq: $landingPageId }) {
      contributionDeets {
        contributionDeets
      }
      donationAmounts
      landingPagePath
    }
  }
`;
