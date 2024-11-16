import React from "react";
import Header from "./_components/main-page/Header";
import HeroSection from "./_components/main-page/HeroSection";
import AboutSection from "./_components/main-page/AboutSection";
import Footer from "./_components/main-page/FooterSection";
import BackToTopButton from "./_components/main-page/BacktoTopComponent";
export default function page() {
  return (
    <div>
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <HeroSection />
      {/* About Section */}
      <AboutSection />
      {/* Footer */}
      <Footer />
      <BackToTopButton />
    </div>
  );
}
