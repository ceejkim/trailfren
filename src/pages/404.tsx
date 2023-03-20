import React, { FunctionComponent } from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout/Layout";
// import Hero from "../components/HeroImage/HeroImage";

interface Page404Props {
  data: {
    heroImage: {
      gatsbyImageData: any;
    };
  };
}

const Page404: FunctionComponent<Page404Props> = (props) => (
  <Layout page="faq">
    {/* <Hero imageData={props.data.heroImage.gatsbyImageData}> */}
      <h1>You've found a page that doesn't exist!</h1>
    {/* </Hero> */}
  </Layout>
);

export default Page404;

export const Page404Query = graphql`
  query {
    heroImage: contentfulAsset(title: { eq: "woods-hero-image" }) {
      gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH, height: 400)
    }
  }
`;
