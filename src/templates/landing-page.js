import React from "react"
import { graphql, Link } from "gatsby"
import { Helmet } from "react-helmet"
import get from "lodash/get"
import Img from "gatsby-image"

import DonationBox from "../components/DonationBox/DonationBox";

import * as styles from "./landing-page.module.css"

class LandingPageTemplate extends React.Component {

  render() {
    const frenData = get(this.props, "data.contentfulFren")
    const pageData = get(this.props, "data.contentfulLandingPage")
    return (
      <div className={styles.background}>
        <Helmet title={`Donate to ${frenData.name}`} />
        <div className={styles.logo}>
          <Img className={styles.logoImage} alt={frenData.name} fixed={frenData.logo.fixed} />
        </div>
        {frenData.stripeAccountId ? (
          <DonationBox
            donationAmounts={pageData.donationAmounts.map((num) => Number(num))}
            accountId={frenData.stripeAccountId}
            landingPagePath={frenData.landingPagePath}
          />
        ) : (
          <div className={styles.noPaymentSetup}>
            {frenData.name} has not yet set up their account to receive payments, please check back
            in later
          </div>
        )}
        <div className={styles.aboutSection}>
          {pageData.contributionDeets && (
            <div>
              <h4>How we will use your contribution</h4>
              <p>{pageData.contributionDeets.contributionDeets}</p>
            </div>
          )}

          <h4>About us</h4>
          <p>{frenData.aboutUs.aboutUs}</p>
          <p>
            Find out more by visiting{" "}
            <a href={frenData.websiteUrl} target="_blank" rel="noopener noreferrer">
              our website
            </a>
          </p>
        </div>
        <div className={styles.footer}>
          <p>
            Powered by <Link to="/">Trailfren</Link>
          </p>
        </div>
      </div>
    )
  }
}

export default LandingPageTemplate

export const pageQuery = graphql`
  query FrenPageQuery($frenId: String!, $landingPageId: String!) {
    contentfulFren(id: { eq: $frenId }) {
      name
      websiteUrl
      aboutUs {
        aboutUs
      }
      logo {
        fixed(height: 150) {
          ...GatsbyContentfulFixed_tracedSVG
        }
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
`
