import React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import * as styles from "./HeroImage.module.css"

export default ({ imageData, text }) => {
  const image = getImage(imageData)
  return (
    <div className={styles.hero}>
      <GatsbyImage className={styles.image} image={image} />
      <div className={styles.textContainer}>
        <h1 className={styles.text}>{text}</h1>
      </div>
    </div>
  )
}
