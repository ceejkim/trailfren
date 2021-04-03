const Promise = require('bluebird')
const path = require('path')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const landingPageTemplate = path.resolve('./src/templates/landing-page.js')
    resolve(
      graphql(
        `
          {
            allContentfulAffiliate {
              edges {
                node {
                  affiliateName
                  landingPagePath
                }
              }
            }
          }
        `
      ).then((result) => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        console.log(result)

        const affiliatePages = result.data.allContentfulAffiliate.edges
        affiliatePages.forEach((page) => {
          createPage({
            path: `/${page.node.landingPagePath}/`,
            component: landingPageTemplate,
            context: {
              landingPagePath: page.node.landingPagePath,
            },
          })
        })
      })
    )
  })
}
