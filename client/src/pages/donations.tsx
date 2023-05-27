import { useContext, useEffect, useState } from "react";

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
  const [affiliate, setAffiliate] = useState<Contentful.AffiliateField | null>(
    null
  );
  const [landingPage, setLandingPage] =
    useState<Contentful.LandingPageFields | null>(null);

  useEffect(() => {
    if (affiliates.length) {
      const newAffiliate = getAffiliateFromPath(
        affiliates,
        window.location.pathname
      )!;
      setAffiliate(newAffiliate);
    }
  }, [affiliates]);

  useEffect(() => {
    if (affiliate) {
      const newLandingPage = getLandingPageFromPath(
        affiliate,
        window.location.pathname
      );
      setLandingPage(newLandingPage);
    }
  }, [affiliate]);

  document.title = `Pay ${affiliate?.name} with Trailfren`;

  return (
    <div className="w-full">
      <div className="w-full flex justify-start pl-12 pt-10">
        <p className="text-4xl text-black no-underline">trailfren</p>
      </div>
      <div className="max-w-[500px] mx-auto my-12 md:px-0 px-10 -mb-20">
        <div className="w-full flex justify-center">
          <img
            className="w-40 h-40"
            src={handleContentfulImage(affiliate?.logo?.fields.file.url)}
          />
        </div>
        {affiliate?.stripeAccountId ? (
          <DonationBox />
        ) : (
          <div
            className={`${
              affiliate?.color
                ? `text-[${affiliate?.color}]`
                : "text-salmon-400"
            } p-4 text-3xl text-center`}
          >
            {affiliate?.name} has not yet set up their account to receive
            payments, please check back in later
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
          <p>{affiliate?.aboutUs}</p>
          <p className="my-5">
            Find out more by visiting{" "}
            <a
              href={affiliate?.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 font-medium underline hover:text-blue-600"
            >
              our website
            </a>
          </p>
        </div>
        <FooterDonations />
      </div>
    </div>
  );
};
