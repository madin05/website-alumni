import React from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { FeaturesGrid } from './FeaturesGrid';
import { AboutTracer } from './AboutTracer';
import { ReportSection } from './ReportSection';
import { LegalBases } from './LegalBases';
import { NewsSection } from './NewsSection';
import { FaqSection } from './FaqSection';
import { Footer } from './Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar with Direct Login Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Grid & About Tracer Study with continuous wavy illustration */}
      <div className="relative overflow-hidden bg-[#f8fafc]/50">
        {/* Continuous Background Wavy Decoration */}
        <div className="absolute top-0 -left-20 w-[1050px] sm:w-[1300px] lg:w-[130%] min-w-[1050px] sm:min-w-0 max-w-none opacity-[0.08] pointer-events-none z-0">
          <img
            src="/background-decoration.svg"
            alt="Background Decoration"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Features Grid ("Bersama Membangun Masa Depan Lulusan") */}
        <ScrollReveal>
          <FeaturesGrid />
        </ScrollReveal>

        {/* About Tracer Study */}
        <ScrollReveal>
          <AboutTracer />
        </ScrollReveal>

        {/* Interactive Tracer Study Report & Statistics */}
        <ScrollReveal>
          <ReportSection />
        </ScrollReveal>
      </div>

      {/* Dasar Hukum & Berita Sections with continuous background sweeping from top-right to bottom-left */}
      <div className="relative overflow-hidden bg-white">
        {/* Background Wavy Decoration from Top-Right down to Bottom-Left */}
        <div className="absolute -top-10 -right-24 w-[1050px] sm:w-[1300px] lg:w-[135%] min-w-[1050px] sm:min-w-0 max-w-none opacity-[0.08] pointer-events-none z-0 transform -scale-x-100">
          <img
            src="/background-decoration.svg"
            alt="Background Decoration"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Legal Bases SK */}
        <ScrollReveal>
          <LegalBases />
        </ScrollReveal>

        {/* News Section */}
        <ScrollReveal>
          <NewsSection />
        </ScrollReveal>
      </div>

      {/* FAQ & Service Section */}
      <ScrollReveal>
        <FaqSection />
      </ScrollReveal>

      {/* Footer */}
      <Footer />
    </div>
  );
};
