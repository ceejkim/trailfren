import React from 'react'
import {Link} from 'gatsby'

import * as styles from "./Navbar.module.css"

const Navbar = ({page}) => {
  return (
    <nav className={`navbar navbar-expand-md ${styles.navbar}`}>
      <div>
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
        <ul className={`navbar-nav ${styles.linkSection}`}>
          <li className="nav-item">
            <Link
              to="/partner"
              className={page === "partner" ? styles.navLinkActive : styles.navLink}
            >
              Become a Partner
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/faq" className={page === "faq" ? styles.navLinkActive : styles.navLink}>
              FAQ
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/contact"
              className={page === "contact" ? styles.navLinkActive : styles.navLink}
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar