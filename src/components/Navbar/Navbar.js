import React from 'react'
import {Link} from 'gatsby'

import * as styles from "./Navbar.module.css"

export default function(){
  return (
    <nav className={`navbar navbar-expand-md ${styles.navbar}`}>
      <div className={styles.logoSection}>
        <Link to="/" className={`${styles.logo}`}>
          trailfren
        </Link>
      </div>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i className={`bi bi-list ${styles.navbarToggleIcon}`}></i>
      </button>{" "}
      <div
        className="collapse navbar-collapse"
        id="navbarSupportedContent"
        style={{ justifyContent: "flex-end" }}
      >
        <ul className={styles.linkSection}>
          <li className="">
            <Link to="/partner" className={styles.navLink}>
              Become a Partner
            </Link>
          </li>
          <li className="">
            <Link to="/faq" className={styles.navLink}>
              FAQ
            </Link>
          </li>
          <li className="">
            <Link to="/contact" className={styles.navLink}>
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}