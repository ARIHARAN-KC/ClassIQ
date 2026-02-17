import React from "react";
import Hero from "./Hero.jsx";
import Navbar from "../Navbar.jsx";
import FeaturesSection from "../../components/FeaturesSection.jsx";

function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturesSection />
    </div>
  );
}

export default Home;
