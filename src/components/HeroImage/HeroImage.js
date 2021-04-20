import React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import * as styles from "./HeroImage.module.css"

const HeroImage = ({ imageData, children }) => {
  const image = getImage(imageData)
  return (
    <div className={styles.hero}>
      <GatsbyImage className={styles.image} image={image} alt="" />
      <div className={styles.textContainer}>
        <div className={styles.text}>{children}</div>
      </div>
    </div>
  )
}

export default HeroImage