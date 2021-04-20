import React from "react"
import "@fontsource/poppins"
import { Helmet } from "react-helmet"

import Navbar from "../Navbar/Navbar"
import Footer from '../Footer/Footer'

import bootstrap from "!raw-loader!bootstrap/dist/css/bootstrap.min.css"
import bootstrapIcons from "!raw-loader!bootstrap-icons/font/bootstrap-icons.css"
import baseCss from "../base.css"

import "bootstrap/dist/js/bootstrap.min.js"
import "@popperjs/core/dist/umd/popper.min.js"

export default function Layout({children}){
  return (
    <div className="body" style={{maxWidth: "1600px", margin: "auto"}}>
      <Helmet title="trailfren">
        <style>{bootstrap}</style>
        <style>{bootstrapIcons}</style>
        <style>{baseCss}</style>
      </Helmet>
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}