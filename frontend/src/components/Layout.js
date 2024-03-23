import React from "react";
import { Helmet } from "react-helmet";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ title, isLandingPage = false, children }) {
  if (title && typeof document !== "undefined") {
    document.title = isLandingPage ? "IntelliScan" : `${title} | IntelliScan`;
  }
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          {isLandingPage ? "IntelliScan" : `${title} | IntelliScan`}
        </title>
      </Helmet>
      <Navbar />
      <div id="wrapper">{children}</div>
      <Footer />
    </>
  );
}
