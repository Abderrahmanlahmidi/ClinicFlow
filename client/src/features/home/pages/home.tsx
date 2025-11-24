import React from "react";
import Navbar from "../sections/navbar";
import Hero from "../sections/hero";
import About from "../sections/about";
import Services from "../sections/services";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About/>
      <Services/>
    </div>
  );
}
