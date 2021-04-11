import React from "react"
import { graphql, Link } from "gatsby"
import { Helmet } from "react-helmet"
import get from "lodash/get"
import Img from "gatsby-image"

import DonationBox from "../components/DonationBox/DonationBox";

import * as styles from "./landing-page.module.css"

class LandingPageTemplate extends React.Component {
  
  constructor(props){
    super(props)
    this.state = {
      selectedAmount: ``
    }
  }

  render() {
    const pageData = get(this.props, "data.contentfulFren")
    return (
      <div className={styles.background}>
        <Helmet title={`Donate to ${pageData.name}`} />
        <div className={styles.logo}>
          <Img
            className={styles.logoImage}
            alt={pageData.affiliateName}
            fixed={pageData.logo.fixed}
          />
        </div>
        {pageData.stripeAccountId ? 
          <DonationBox donationAmounts={pageData.donationAmounts.map((num) => Number(num))} 
                       accountId={pageData.stripeAccountId}
                       /> :
          <div className={styles.noPaymentSetup}>{pageData.name} has not yet set up their account to receive payments, please check back in later</div>
        
        }
        <div className={styles.aboutSection}>
          {pageData.contributionDeets && (
            <div>
              <h4>How we will use your contribution</h4>
              <p>{pageData.contributionDeets.contributionDeets}</p>
            </div>
          )}

          <h4>About us</h4>
          <p>{pageData.aboutUs.aboutUs}</p>
          <p>
            Find out more by visiting{" "}
            <a href={pageData.websiteUrl} target="_blank" rel="noopener noreferrer">
              our website
            </a>
          </p>
        </div>
        <div className={styles.footer}>
          <p>
            Powered by <Link to="/">Frensies</Link>
          </p>
        </div>
      </div>
    )
  }
}

export default LandingPageTemplate

export const pageQuery = graphql`
  query AffiliatePageQuery($landingPagePath: String!) {
    contentfulFren(landingPagePath: { eq: $landingPagePath }) {
      name
      websiteUrl
      donationAmounts
      aboutUs {
        aboutUs
      }
      contributionDeets {
        contributionDeets
      }
      logo {
        fixed(height: 150) {
          ...GatsbyContentfulFixed_tracedSVG
        }
      }
      stripeAccountId
    }
  }
`
