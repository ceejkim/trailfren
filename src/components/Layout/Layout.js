import React from "react"
import "@fontsource/poppins"
import { Helmet } from "react-helmet"

import Navbar from "../Navbar/Navbar"
import Footer from '../Footer/Footer'

import "../base.css"

export default function Layout({page, children}){
  return (
    <div className="body" style={{ maxWidth: "1600px", margin: "auto" }}>
      <Helmet title="trailfren" />
      <Navbar page={page} />
      {children}
      <Footer />
    </div>
  )
}