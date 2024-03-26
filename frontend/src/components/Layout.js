import React from "react";
import { Helmet } from "react-helmet";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ title, isLandingPage = false, children }) {
  if (title && typeof document !== "undefined") {
    document.title = isLandingPage ? "IntelliScan" : `${title} | IntelliScan`;
  }

  const showNavFoot = !(title === "Login" || title === "Signup");

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          {isLandingPage ? "IntelliScan" : `${title} | IntelliScan`}
        </title>
      </Helmet>
      {showNavFoot && <Navbar />}
      {showNavFoot ? <div id="wrapper">{children}</div> : children}
      {showNavFoot && <Footer />}
    </>
  );
}
