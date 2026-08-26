import React from 'react';
import { HeroCartoonVideoBackground } from './HeroCartoonVideoBackground';

interface HeroSectionProps {
  onOpenBooking?: () => void;
  onOpenDarkroom?: () => void;
  onExploreGallery?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  return (
    <section id="hero" className="relative min-h-[95vh] bg-transparent border-b border-[#334756]/40 overflow-hidden flex flex-col justify-end pt-28 sm:pt-32 pb-12 sm:pb-16">
      {/* Main Hero Content Area positioned at the bottom of the section */}
      <div id="hero-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mt-auto mb-0 py-4 sm:py-6">
        <div className="max-w-3xl">
          <h1 className="font-cartoon-title text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-wide uppercase leading-[1.15] drop-shadow-lg">
            <span className="block">CAPTURE &amp;</span>
            <span className="block text-[#FF4C29]">
              CHERISH
            </span>
            <span className="block whitespace-nowrap">TIMELESS </span>
            <span className="block whitespace-nowrap">MOMENTS.</span>
          </h1>
        </div>
      </div>
    </section>
  );
};
