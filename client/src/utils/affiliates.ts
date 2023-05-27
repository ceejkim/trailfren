const getAffiliateFromPath = (
  affiliates: Contentful.AffiliateField[],
  path: string
) => {
  const modifiedPath = path.replace(/\/$/, "") + "/";
  for (const affiliate of affiliates) {
    for (const landingPage of affiliate.landingPages || []) {
      if (`/${landingPage.fields.landingPagePath}` === modifiedPath) {
        return affiliate;
      }
    }
  }
};
const getLandingPageFromPath = (
  affiliate: Contentful.AffiliateField,
  path: string
): Contentful.AffiliateLandingPage["fields"] | null => {
  for (const landingPage of affiliate.landingPages || []) {
    if (landingPage.fields.landingPagePath === path) {
      return landingPage.fields;
    }
  }
  return null;
};

export { getAffiliateFromPath, getLandingPageFromPath };
