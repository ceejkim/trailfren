const getAffiliateFromPath = (affiliates: Contentful.AffiliateField[], path: string) => {
  for (const affiliate of affiliates) {
    for (const landingPage of affiliate.landingPages || []) {
      if (`/${landingPage.fields.landingPagePath}` === path) {
        return affiliate
      }
    }
  }
}
const getLandingPageFromPath = (landingPages: Contentful.LandingPageField[], path: string) => {
  for (const landingPage of landingPages) {
    if (`/${landingPage.landingPagePath}` === path) {
      return landingPage
    }
  }
}

export {
  getAffiliateFromPath,
  getLandingPageFromPath,
}