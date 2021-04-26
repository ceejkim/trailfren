import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout/Layout"
import Hero from "../components/HeroImage/HeroImage"

const PartnerPage = (props) => (
  <Layout>
    <Hero imageData={props.data.heroImage.gatsbyImageData}>
      <h1>Frens Asking Questions</h1>
    </Hero>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: "800px",
        margin: "100px auto",
      }}
    >
      <h4 style={{ margin: "2rem", fontWeight: 600 }}>What is trailfren? </h4>
      <h4 style={{ margin: "2rem", fontWeight: "lighter" }}>
        Trailfren is an organization that uses basic QR code technology in the outdoors. Our signs
        allow people to donate to the organizations that make their outdoor activity possible
        through trail maintenance and conservation. Contributions as little as $2 per bike ride make
        a big difference for the spaces you enjoy.
      </h4>
      <div style={{ height: "50px" }} />
      <h4 style={{ margin: "2rem", fontWeight: 600 }}>Where does my money go?</h4>
      <h4 style={{ margin: "2rem", fontWeight: "lighter" }}>
        The organization receiving your contribution will be shown in our signage. After you scan
        the QR code you will be taken to a landing page which will also provide a description of the
        organization and provide an option to contribute.
      </h4>
      <div style={{ height: "50px" }} />
      <h4 style={{ margin: "2rem", fontWeight: 600 }}>
        Can anyone join trailfren and receive money?
      </h4>
      <h4 style={{ margin: "2rem", fontWeight: "lighter" }}>
        Yes! If you are an organization that provides for the public you can become a trailfren
        organization.
      </h4>
    </div>
  </Layout>
)

export default PartnerPage

export const partnerPageQuery = graphql`
  query {
    heroImage: contentfulAsset(title: { eq: "woods-hero-image" }) {
      gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH, height: 400)
    }
  }
`
