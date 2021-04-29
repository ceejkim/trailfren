import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout/Layout"
import Hero from "../components/HeroImage/HeroImage"

const PartnerPage = (props) => (
  <Layout page="partner">
    <Hero imageData={props.data.heroImage.gatsbyImageData}>
      <h1>
        Partner with us
      </h1>
    </Hero>
    <div
      style={{
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: "800px",
        margin: "200px auto",
      }}
    >
      <h1 style={{ margin: "2rem", lineHeight: "1.3" }}>
        We create your QR codes, bank accounts, landing pages, and sign designs. All you have to do
        is post our recognizable trailfren signs at your trailheads to receive contributions.
      </h1>
    </div>
  </Layout>
)

export default PartnerPage

export const partnerPageQuery = graphql`
  query {
    heroImage: contentfulAsset(title: { eq: "guy-fishing" }) {
      gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH)
    }
  }
`
