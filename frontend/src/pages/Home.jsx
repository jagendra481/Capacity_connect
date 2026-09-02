import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import ValueStatement from '../components/landing/ValueStatement';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import AudienceSection from '../components/landing/AudienceSection';
import CapacityRadarPreview from '../components/landing/CapacityRadarPreview';
import CTASection from '../components/landing/CTASection';
import LandingFooter from '../components/landing/LandingFooter';

export const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* Top Landing Navigation Bar */}
      <LandingNavbar />

      {/* Main Landing Sections */}
      <main>
        <HeroSection />
        <ValueStatement />
        <FeaturesSection />
        <HowItWorks />
        <AudienceSection />
        <CapacityRadarPreview />
        <CTASection />
      </main>

      {/* Landing Footer */}
      <LandingFooter />
    </div>
  );
};

export default Home;
