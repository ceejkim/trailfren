import React from "react"
import "@fontsource/poppins"
import { Helmet } from "react-helmet"

import Navbar from "../Navbar/Navbar"

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"
import "@popperjs/core/dist/umd/popper.min.js"
import "bootstrap-icons/font/bootstrap-icons.css"
import "../base.css"

export default function Layout({children}){
  return (
    <div className="body">
      <Helmet title="trailfren" />
      <Navbar />
      {children}
    </div>
  )
}