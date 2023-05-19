import { useContext } from "react";

import { TrailfrenContext } from "../routes";
import DonationBox from "../components/donations-box";
import {
  getAffiliateFromPath,
  getLandingPageFromPath,
} from "../utils/affiliates";
import { handleContentfulImage } from "../utils/contentful";
import FooterDonations from "../components/footer-donations";

export const DonationsPage = () => {
  const { affiliates } = useContext(TrailfrenContext);
  const affiliate = getAffiliateFromPath(affiliates, window.location.pathname)!;
  const landingPage = getLandingPageFromPath(
    affiliate,
    window.location.pathname
  );

  document.title = `Pay ${affiliate.name} with Trailfren`;

  return (
    <div className="max-w-[500px] mx-auto my-12 md:px-0 px-10 -mb-20">
      <div className="w-full flex justify-center">
        {/* <div className={styles.logo}> */}
        <img
          className="w-40 h-40"
          src={handleContentfulImage(affiliate?.logo?.fields.file.url)}
        />
      </div>
      {affiliate.stripeAccountId ? (
        <DonationBox />
      ) : (
        <div
          className={`${
            affiliate.color ? `text-[${affiliate.color}]` : "text-salmon-400"
          } p-4 text-3xl text-center`}
        >
          {affiliate.name} has not yet set up their account to receive payments,
          please check back in later
        </div>
      )}
      <div>
        {landingPage?.contributionDeets && (
          <div>
            <h4>How we will use your contribution</h4>
            <p>{landingPage?.contributionDeets}</p>
          </div>
        )}

        <h4>About us</h4>
        <p>{affiliate.aboutUs}</p>
        <p className="my-5">
          Find out more by visiting{" "}
          <a
            href={affiliate.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 font-medium underline hover:text-blue-600"
          >
            our website
          </a>
        </p>
      </div>
      <FooterDonations />
      {/* <div className="text-gray-500 text-center border-t border-gray-500 italic">
        <p>
          Powered by{" "}
          <Link className="text-salmon-400 underline" to="/">
            Trailfren
          </Link>
        </p>
      </div> */}
    </div>
  );
};
