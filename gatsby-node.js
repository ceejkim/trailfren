const Promise = require("bluebird")
const path = require("path")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const landingPageTemplate = path.resolve("./src/templates/landing-page.js")

  if (process.env.NODE_ENV === "production") {
    const result = await graphql(
      `
        {
          allContentfulFren {
            edges {
              node {
                name
                landingPagePath
              }
            }
          }
        }
      `
    )

    if (result.errors) {
      throw new Error(result.errors)
    }

    const frenPages = result.data.allContentfulFren.edges
    frenPages.forEach((page) => {
      createPage({
        path: `/${page.node.landingPagePath}/`,
        component: landingPageTemplate,
        context: {
          landingPagePath: page.node.landingPagePath,
        },
      })
    })
  } else {
    createPage({
      path: "/demo/",
      component: landingPageTemplate,
      context: {
        landingPagePath: "demo",
        testStripeAccountId: "acct_1IC4oRI0MvyIqA12",
      },
    })
  }
}
