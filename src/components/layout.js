import React from 'react'
import './base.css'
import Container from './container'

class Template extends React.Component {
  render() {
    const { children } = this.props

    return (
      <Container>
        {children}
      </Container>
    )
  }
}

export default Template
