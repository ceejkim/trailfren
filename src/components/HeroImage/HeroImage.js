import React from "react"
import { getImage } from "gatsby-plugin-image"

import { BgImage } from "gbimage-bridge"

import * as styles from "./HeroImage.module.css"

const HeroImage = ({ imageData, children }) => {
  const image = getImage(imageData)

  return (
    <div className={styles.hero}>
      <BgImage image={image} style={{ minWidth: 200, minHeight: 500, maxWidth: 1600 }}>
        <div className={styles.textContainer}>
          <div className={styles.text}>{children}</div>
        </div>
      </BgImage>
    </div>
  )
}

export default HeroImage