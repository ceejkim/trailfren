import { graphql } from "gatsby";
import Layout from "../components/Layout/Layout";

const IndexPage = () => (
  <Layout page="index">
    <div style={{ backgroundColor: "black", padding: "200px 0" }}>
      <div
        style={{
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "850px",
          margin: "auto",
        }}
      >
        <h1
          style={{
            color: "#df7c6d",
            fontSize: 66,
          }}
        >
          Setup payments for your trail / non-profit organization in 10 minutes
          or less
        </h1>
        <div style={{ justifyContent: "center", display: "flex" }}>
          <button
            style={{
              backgroundColor: "#df7c6d",
              color: "white",
              border: "none",
              width: "143px",
              height: "61px",
            }}
          >
            Set Up Now
          </button>
        </div>
      </div>
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        padding: "50px",
      }}
    >
      <div
        style={{
          fontSize: "64px",
          fontWeight: "bold",
          color: "black",
          backgroundColor: "#F4EBEA",
          width: "100%",
          maxWidth: "733px",
          marginBottom: "50px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <p>With our trailfren QR codes you can:</p>
      </div>
      <div
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          color: "black",
          backgroundColor: "#F4EBEA",
          width: "100%",
          maxWidth: "733px",
          marginBottom: "50px",
          padding: "50px",
        }}
      >
        <ul>
          <li style={{ marginBottom: 15 }}>
            Setup digital payments in 10 minutes or less
          </li>
          <li style={{ marginBottom: 15 }}>
            Access Apple Pay, Google Pay, Venmo, Paypal and CC options in one
            place
          </li>
          <li style={{ marginBottom: 15 }}>
            No app downloads or technical knowledge required
          </li>
          <li style={{ marginBottom: 15 }}>No subscription fees, no hassle</li>
          <li style={{ marginBottom: 15 }}>
            Perfect for volunteer run-events & small business
          </li>
        </ul>
      </div>
    </div>
  </Layout>
);

export default IndexPage;

export const indexPageQuery = graphql`
  query {
    heroImage: contentfulAsset(title: { eq: "hammock-hero-image" }) {
      gatsbyImageData(
        placeholder: BLURRED
        layout: FULL_WIDTH
        cropFocus: CENTER
        formats: [AUTO, WEBP]
      )
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
    image5: contentfulAsset(title: { eq: "biking-taking-pick" }) {
      gatsbyImageData(aspectRatio: 1.5)
    }
    image6: contentfulAsset(title: { eq: "fishing-in-pine-forest" }) {
      gatsbyImageData(aspectRatio: 1.5)
    }
  }
`;
