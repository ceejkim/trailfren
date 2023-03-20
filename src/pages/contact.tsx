import React, {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  ReactEventHandler,
} from "react";
import { graphql, navigate } from "gatsby";
import Layout from "../components/Layout/Layout";
// import Hero from "../components/HeroImage/HeroImage";

function encode(data: any) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

interface ContactPageProps {
  data: {
    heroImage: {
      gatsbyImageData: any;
    };
  };
}

const ContactPage: FunctionComponent<ContactPageProps> = (props) => {
  const [state, setState] = React.useState({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": form.getAttribute("name"),
        ...state,
      }),
    })
      .then(() => navigate(form.getAttribute("action") || "/"))
      .catch((error: Error) => alert(error));
  };

  return (
    <Layout page="contact">
      {/* <Hero imageData={props.data.heroImage.gatsbyImageData}> */}
      <h1>dont leave frens hanging</h1>
      {/* </Hero> */}
      <div className="row" style={{ padding: "4rem 2rem" }}>
        <div className="col-md-5">
          <h1>We'll wait</h1>
        </div>
        <div className="col-md-7">
          <form
            name="contact"
            method="post"
            action="/"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
          >
            {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
            <input type="hidden" name="form-name" value="contact" />
            <p hidden>
              <label>
                Don’t fill this out:{" "}
                <input name="bot-field" onChange={handleChange} />
              </label>
            </p>
            <div className="row">
              <div className="form-group py-3 col">
                <label htmlFor="firstName">First Name*:</label>
                <input
                  className="form-control form-control-lg"
                  type="text"
                  name="firstName"
                  id="firstname"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group py-3 col">
                <label htmlFor="lastName">Last Name*:</label>
                <input
                  className="form-control form-control-lg"
                  type="text"
                  name="lastName"
                  id="lastName"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group py-3">
              <label htmlFor="email">Your Email*:</label>
              <input
                className="form-control form-control-lg"
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div className="form-group py-3">
              <label htmlFor="message">Message*:</label>
              <textarea
                className="form-control form-control-lg"
                name="message"
                id="message"
                onChange={handleChange}
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
  );
};

export default ContactPage;

export const contactPageQuery = graphql`
  query {
    heroImage: contentfulAsset(title: { eq: "happy-doggy" }) {
      gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH)
    }
  }
`;
