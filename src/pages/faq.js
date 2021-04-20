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
        padding: "150px 50px",
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      <h4 style={{ margin: "2rem", fontWeight: 600 }}>Where does my money go?</h4>
      <h4 style={{ margin: "2rem", fontWeight: "lighter" }}>
        To your frens! Your money will go to the organization that maintains the exact trail you are
        using. The organization will be listed in our signage at the trailhead. After you scan the
        QR code you will be taken to a landing page which will also provide a description of the
        organization and provide an option to contribute.
      </h4>
      <div style={{ height: "50px" }} />
      <h4 style={{ margin: "2rem", fontWeight: 600 }}>
        How do I know this money is going to protect the trails?
      </h4>
      <h4 style={{ margin: "2rem", fontWeight: "lighter" }}>
        Trailfren vets every organization to make sure that there is appropriate governance that
        allows for public input. If an organization does not meet our requirements, we will not
        partner with them.{" "}
      </h4>
      <div style={{ height: "50px" }} />
      <h4 style={{ margin: "2rem", fontWeight: 600 }}>
        If I am a representative of an organization that maintains trails, how do I sign up?
      </h4>
      <h4 style={{ margin: "2rem", fontWeight: "lighter" }}>
        Please contact us! We want more frens.
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
