import React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import get from "lodash/get"
import Img from "gatsby-image"

import * as styles from "./landing-page.module.css"

class LandingPageTemplate extends React.Component {
  
  constructor(props){
    super(props)
    this.state = {
      selectedAmount: ``,
      donationOptions: [2,5,10]
    }
  }

  render() {
    const affiliateData = get(this.props, "data.contentfulAffiliate")

    return (
      <div className={styles.background}>
        <Helmet title={`${affiliateData.affiliateName}`} />
        <h1 className={styles.banner}>Thank you for contributing!</h1>
        <div className={styles.logo}>
          <Img
            className={styles.logoImage}
            alt={affiliateData.affiliateName}
            fixed={affiliateData.logo.fixed}
          />
        </div>
        <div className={styles.selectAmountSection}>
          <div className={styles.selectAmountHeader}>Choose an amount to contribute</div>
          <div className={styles.selectAmountButtons}>
            {this.state.donationOptions.map((donationAmount) => (
              <button
                key={donationAmount}
                className={
                  this.state.selectedAmount === donationAmount
                    ? styles.buttonSelected
                    : styles.selectAmountButton
                }
                onClick={() => this.setState({ selectedAmount: donationAmount })}
              >
                ${donationAmount}
              </button>
            ))}
          </div>
        </div>
        {this.state.selectedAmount && (
          <div className={styles.goToPayment}>
            <button className={styles.applePayButton}>Apple Pay</button>
            <button className={styles.otherPayButton}>Credit Card</button>
          </div>
        )}
        <div className={styles.aboutSection}>
          {affiliateData.contributionDeets && (
            <div>
              <h4>How we will use your contribution</h4>
              <p>{affiliateData.contributionDeets.contributionDeets}</p>
            </div>
          )}

          <h4>About us</h4>
          <p>{affiliateData.aboutUs.aboutUs}</p>
          <p>
            Find out more by visiting{" "}
            <a href={affiliateData.affiliateWebsiteLink} target="_blank" rel="noopener noreferrer">
              our website
            </a>
          </p>
        </div>
      </div>
    )
  }
}

export default LandingPageTemplate

export const pageQuery = graphql`
  query AffiliatePageQuery($landingPagePath: String!) {
    contentfulAffiliate(landingPagePath: { eq: $landingPagePath }) {
      affiliateName
      affiliateWebsiteLink
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
    }
  }
`
