import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql, StaticQuery } from 'gatsby'
import { Row, Col, Card, CardBody } from 'reactstrap'

import BlogTag from './BlogTag'

function BlogRoll({ data: { allMarkdownRemark } }) {
  const posts = allMarkdownRemark.edges

  return (
    <Row>
      {posts &&
        posts.map(({ node: { id, frontmatter, fields, excerpt } }) => (
          <Col sm="12" md="6" lg="4" key={fields.slug}>
            <Card className="mb-2">
              <CardBody>
                <Link className="card-title h4 text-dark" to={fields.slug}>
                  {frontmatter.title}
                </Link>
                <br />
                <span className="card-text">
                  <span className="text-muted">{frontmatter.date}</span>
                  <br />
                  {frontmatter.tags.map(tagName => (
                    <BlogTag tagName={tagName} key={tagName} />
                  ))}
                </span>
              </CardBody>

              <CardBody style={{ overflowX: `auto`, wordWrap: `break-word` }}>
                {frontmatter.description || excerpt}
                <br />
                <br />
                <Link className="button" to={fields.slug}>
                  Keep Reading →
                </Link>
              </CardBody>
            </Card>
          </Col>
        ))}
    </Row>
  )
}

BlogRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query BlogRollQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
        ) {
          edges {
            node {
              excerpt(pruneLength: 400)
              id
              fields {
                slug
              }
              frontmatter {
                title
                templateKey
                date(formatString: "MMMM DD, YYYY")
                description
                tags
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <BlogRoll data={data} count={count} />}
  />
)
