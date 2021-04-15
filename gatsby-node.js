const Promise = require("bluebird")
const path = require("path")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const landingPageTemplate = path.resolve("./src/templates/landing-page.js")

  const result = await graphql(
    `
      {
        allContentfulFren {
          edges {
            node {
              id
              landingPages {
                id
                landingPagePath
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw new Error(result.errors)
  }

  const frens = result.data.allContentfulFren.edges
  frens.forEach(({ node }) => {
    if (!node.landingPages || !node.landingPages.length) return

    const frenId = node.id

    node.landingPages.forEach(({ id, landingPagePath }) => {
      createPage({
        path: `/${landingPagePath}/`,
        component: landingPageTemplate,
        context: {
          frenId,
          landingPageId: id,
        },
      })
    })
  })
}
