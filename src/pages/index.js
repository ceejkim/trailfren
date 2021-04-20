import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout/Layout"
import Hero from "../components/HeroImage/HeroImage"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const IndexPage = (props) => (
  <Layout>
    <Hero imageData={props.data.heroImage.gatsbyImageData}>
      <h1>SUPPORT WHAT YOU LOVE</h1>
    </Hero>
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "150px 50px",
      }}
    >
      <h1 style={{ margin: "2rem" }}>Step 1: Scan QR Code</h1>
      <h1 style={{ margin: "2rem" }}>Step 2: Select an amount</h1>
      <h1 style={{ margin: "2rem" }}>Step 3: Donate</h1>
    </div>
    <div style={{ display: "flex" }}>
      <div className="row p-5">
        <div className="col col-md-6 col-xl-4 p-3">
          <GatsbyImage image={getImage(props.data.image1.gatsbyImageData)} alt=""/>
        </div>
        <div className="col col-md-6 col-xl-4 p-3">
          <GatsbyImage image={getImage(props.data.image2.gatsbyImageData)} alt=""/>
        </div>
        <div className="col col-md-6 col-xl-4 p-3">
          <GatsbyImage image={getImage(props.data.image3.gatsbyImageData)} alt=""/>
        </div>
        <div className="col col-md-6 col-xl-4 p-3">
          <GatsbyImage image={getImage(props.data.image4.gatsbyImageData)} alt=""/>
        </div>
        <div className="col col-md-6 col-xl-4 p-3">
          <GatsbyImage image={getImage(props.data.image5.gatsbyImageData)} alt=""/>
        </div>
        <div className="col col-md-6 col-xl-4 p-3">
          <GatsbyImage image={getImage(props.data.image6.gatsbyImageData)} alt=""/>
        </div>
      </div>
    </div>
  </Layout>
)

export default IndexPage

export const indexPageQuery = graphql`
  query {
    heroImage: contentfulAsset(title: { eq: "hammock-hero-image" }) {
      gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH)
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
    image5: contentfulAsset(title: { eq: "walking-on-log" }) {
      gatsbyImageData(aspectRatio: 1.5)
    }
    image6: contentfulAsset(title: { eq: "fishing-in-pine-forest" }) {
      gatsbyImageData(aspectRatio: 1.5)
    }
  }
`
