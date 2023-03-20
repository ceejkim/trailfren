// gatsby-node.ts
import path from 'path';
import { GatsbyNode } from 'gatsby';

interface ContentfulFren {
  id: string;
  landingPages: {
    id: string;
    landingPagePath: string;
  }[];
}

interface FrenEdge {
  node: ContentfulFren;
}

interface QueryResult {
  allContentfulFren: {
    edges: FrenEdge[];
  };
}

export const createPages: GatsbyNode['createPages'] = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const landingPageTemplate = path.resolve('./src/templates/landing-page.tsx');

  const result = await graphql<QueryResult>(
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
    `,
  );

  if (result.errors) {
    throw new Error(result.errors.toString());
  }

  const frens = result.data?.allContentfulFren.edges;
  frens?.forEach(({ node }) => {
    if (!node.landingPages || !node.landingPages.length) return;

    const frenId = node.id;

    node.landingPages.forEach(({ id, landingPagePath }) => {
      createPage({
        path: `/${landingPagePath}/`,
        component: landingPageTemplate,
        context: {
          frenId,
          landingPageId: id,
        },
      });
    });
  });
};

exports.onCreateBabelConfig = ({ actions }: { actions: any }) => {
  actions.setBabelPlugin({
    name: '@babel/plugin-transform-react-jsx',
    options: {
      runtime: 'automatic',
    },
  });
};