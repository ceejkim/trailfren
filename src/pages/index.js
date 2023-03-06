import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout/Layout";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

const IndexPage = (props) => (
  <Layout page="index">
    <div
      style={{
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: "850px",
        margin: "200px auto",
      }}
    >
      <h1
        style={{
          color: "#df7c6d",
          fontSize: 66,
        }}
      >
        trailfren is easiest way to receive payments for your non-profit or
        small business. It's also free!
      </h1>
      <div style={{ justifyContent: "center", display: "flex" }}>
        <button
          style={{
            backgroundColor: "#df7c6d",
            color: "white",
            border: "none",
            width: "143px",
            height: "61px",
          }}
        >
          Set Up Now
        </button>
      </div>
    </div>
    <div style={{ display: "flex" }}>
      <div className="row p-5">
        <div className="col-md-6 col-xl-4 p-3">
          <GatsbyImage
            image={getImage(props.data.image1.gatsbyImageData)}
            alt=""
          />
        </div>
        <div className="col-md-6 col-xl-4 p-3">
          <GatsbyImage
            image={getImage(props.data.image2.gatsbyImageData)}
            alt=""
          />
        </div>
        <div className="col-md-6 col-xl-4 p-3">
          <GatsbyImage
            image={getImage(props.data.image3.gatsbyImageData)}
            alt=""
          />
        </div>
        <div className="col-md-6 col-xl-4 p-3">
          <GatsbyImage
            image={getImage(props.data.image4.gatsbyImageData)}
            alt=""
          />
        </div>
        <div className="col-md-6 col-xl-4 p-3">
          <GatsbyImage
            image={getImage(props.data.image5.gatsbyImageData)}
            alt=""
          />
        </div>
        <div className="col-md-6 col-xl-4 p-3">
          <GatsbyImage
            image={getImage(props.data.image6.gatsbyImageData)}
            alt=""
          />
        </div>
      </div>
    </div>
  </Layout>
);

export default IndexPage;

export const indexPageQuery = graphql`
  query {
    heroImage: contentfulAsset(title: { eq: "hammock-hero-image" }) {
      gatsbyImageData(
        placeholder: BLURRED
        layout: FULL_WIDTH
        cropFocus: CENTER
        formats: [AUTO, WEBP]
      )
    }
    image1: contentfulAsset(title: { eq: "walking-on-log" }) {
      gatsbyImageData(aspectRatio: 1.5)
    }
    image2: contentfulAsset(title: { eq: "front-tire-on-trail" }) {
      gatsbyImageData(aspectRatio: 1.5)
    }
    image3: contentfulAsset(title: { eq: "hiking-in-mountains" }) {
      gatsbyImageData(aspectRatio: 1.5)
    }
    image4: contentfulAsset(title: { eq: "snowy-trail-in-woods" }) {
      gatsbyImageData(aspectRatio: 1.5)
    }
    image5: contentfulAsset(title: { eq: "biking-taking-pick" }) {
      gatsbyImageData(aspectRatio: 1.5)
    }
    image6: contentfulAsset(title: { eq: "fishing-in-pine-forest" }) {
      gatsbyImageData(aspectRatio: 1.5)
    }
  }
`;
