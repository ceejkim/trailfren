import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"
import Layout from "../components/Layout/Layout"
import Hero from "../components/HeroImage/HeroImage"

export default (props) => (
  <Layout>
    {console.log(props.data.image1)}
    <Hero imageData={props.data.heroImage.gatsbyImageData} text="SUPPORT WHAT YOU LOVE" />
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
      <div className="row">
        <Img fluid={props.data.image1.fluid} />
      </div>
    </div>
  </Layout>
)

export const indexPageQuery = graphql`
  query {
    heroImage: contentfulAsset(title: { eq: "hammock-hero-image" }) {
      gatsbyImageData(
        placeholder: BLURRED
      )
    }
    image1: contentfulAsset(title: { eq: "walking-on-log" }) {
      gatsbyImageData
    }
  }
`
