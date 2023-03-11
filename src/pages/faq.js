import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout/Layout";

const PartnerPage = (props) => (
  <Layout page="faq">
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: "800px",
        margin: "100px auto",
      }}
    >
      <h4 style={{ margin: "2rem 2rem 6rem", fontSize: 40, fontWeight: 600 }}>FAQs</h4>
      <p
        style={{
          margin: "0 2rem",
          lineHeight: 1.8,
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
      >
        What is trailfren?
      </p>
      <p
        style={{
          margin: "2rem",
          lineHeight: 1.8,
          fontWeight: 300,
          fontStyle: "normal",
        }}
      >
        Trailfren is the friendliest payment solution for outdoor organizations
        and non-profits. We facilitate in person transactions through QR codes.
        Our friendly user experience and low maintenance tech makes us simple to
        setup and easy to use. No training staff required!
      </p>
      <p
        style={{
          margin: "0 2rem",
          lineHeight: 1.8,
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
      >
        How do I know if trailfren is right for me?
      </p>
      <p
        style={{
          margin: "2rem",
          lineHeight: 1.8,
          fontWeight: 300,
          fontStyle: "normal",
        }}
      >
        Our QR codes can be used to sell merch, receive donations, or anything
        else you like for your non-profit or small business. We are perfect for
        a small organization that does not have the resources to invest in a POS
        system or train staff. If you have volunteer run events and sell
        t-shirts, or a small farmstand with only a few products, we are perfect
        for you!
      </p>
      <p
        style={{
          margin: "0 2rem",
          lineHeight: 1.8,
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
      >
        What are the full services trailfren offers?
      </p>
      <p
        style={{
          margin: "2rem",
          lineHeight: 1.8,
          fontWeight: 300,
          fontStyle: "normal",
        }}
      >
        We provide digital and physical QR codes, our landing pages integrate
        with credit cards, apple pay, google pay, and more! We will also provide
        a simple sales report for types and amounts of products sold.
      </p>
      <p
        style={{
          margin: "0 2rem",
          lineHeight: 1.8,
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
      >
        Is trailfren really free?
      </p>
      <p
        style={{
          margin: "2rem",
          lineHeight: 1.8,
          fontWeight: 300,
          fontStyle: "normal",
        }}
      >
        YES! Our services are offered FREE OF CHARGE to our customers. We are
        supported by an optional tipping system at the time of checkout.
      </p>
    </div>
  </Layout>
);

export default PartnerPage;

export const partnerPageQuery = graphql`
  query {
    heroImage: contentfulAsset(title: { eq: "woods-hero-image" }) {
      gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH, height: 400)
    }
  }
`;
