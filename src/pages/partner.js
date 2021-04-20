import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout/Layout"
import Hero from "../components/HeroImage/HeroImage"

const PartnerPage = (props) => (
  <Layout>
    <Hero imageData={props.data.heroImage.gatsbyImageData}>
      <h1>
        get. in. touch. with. us <br /> WE WANT MORE FRENS <br /> WE HAVE NO FRENS
      </h1>
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
      <h1 style={{ margin: "2rem" }}>
        Are you an organization the facilitates the fun zone? Do you want funds so you can create
        more fun? Do you want funds from your frens?{" "}
      </h1>
      <h1 style={{ margin: "2rem" }}>
        We will make you QR codes, bank accounts, landing pages, and designs. All you have to do is
        print out our fun signs and place them at your trail head.{" "}
      </h1>
    </div>
  </Layout>
)

export default PartnerPage

export const partnerPageQuery = graphql`
  query {
    heroImage: contentfulAsset(title: { eq: "dogs-hero-image" }) {
      gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH)
    }
  }
`
