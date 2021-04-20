import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout/Layout"
import Hero from "../components/HeroImage/HeroImage"

const ContactPage = (props) => (
  <Layout>
    <Hero imageData={props.data.heroImage.gatsbyImageData}>
      <h1>dont leave frens hanging</h1>
    </Hero>
    <div className="row" style={{ padding: "4rem" }}>
      <div class="col col-lg-6">
        <h1>We'll wait</h1>
      </div>
      <div className="col col-lg-6">
        <form name="contact" method="POST" data-netlify="true">
          <div className="row">
            <div className="form-group py-3 col">
              <label for="firstName" htmlFor="firstName">
                First Name*:
              </label>
              <input
                className="form-control form-control-lg"
                type="text"
                name="firstName"
                id="firstname"
              />
            </div>
            <div className="form-group py-3 col">
              <label for="lastName" htmlFor="lastName">Last Name*:</label>
              <input
                className="form-control form-control-lg"
                type="text"
                name="lastName"
                id="lastName"
              />
            </div>
          </div>
          <div className="form-group py-3">
            <label for="email" htmlFor="email">Your Email*:</label>
            <input className="form-control form-control-lg" type="email" name="email" id="email" />
          </div>
          <div className="form-group py-3">
            <label for="message" htmlFor="message">Message*:</label>
            <textarea
              className="form-control form-control-lg"
              type="text"
              name="message"
              id="message"
            />
          </div>{" "}
          <p>
            <button type="submit" className="btn btn-lg btn-primary">
              Send
            </button>
          </p>
        </form>
      </div>
    </div>
  </Layout>
)

export default ContactPage

export const contactPageQuery = graphql`
  query {
    heroImage: contentfulAsset(title: { eq: "happy-doggy" }) {
      gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH)
    }
  }
`
