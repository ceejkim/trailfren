import { FunctionComponent } from "react";

interface AccountPageProps {
  // data: {
  //   heroImage: {
  //     gatsbyImageData: any;
  //   };
  // };
}

const AccountPage: FunctionComponent<AccountPageProps> = () => (
  <section>
    <div className="mx-auto mt-20 flex max flex-col max-w-2xl justify-center">
      <h4 className="mx-8 my-14 text-4xl font-medium">Account</h4>
    </div>
  </section>
);

export default AccountPage;

// export const partnerPageQuery = graphql`
//   query {
//     heroImage: contentfulAsset(title: { eq: "woods-hero-image" }) {
//       gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH, height: 400)
//     }
//   }
// `;
