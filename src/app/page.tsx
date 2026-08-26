"use client";

import React, { useState } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { HeroCartoonVideoBackground } from '../components/landing/HeroCartoonVideoBackground';
import { ClientRosterAndReviews } from '../components/landing/ClientRosterAndReviews';
import { ProjectOverviewSection } from '../components/landing/ProjectOverviewSection';
import { Footer } from '../components/landing/Footer';
import { BookingModal } from '../components/landing/BookingModal';
import { AuthModal } from '../components/landing/AuthModal';
import { StudioService, ClubPass, PhotoItem } from '../types';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedService, setSelectedService] = useState<StudioService | null>(null);
  const [selectedPass, setSelectedPass] = useState<ClubPass | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<PhotoItem | null>(null);

  const handleOpenBooking = (service?: StudioService, pass?: ClubPass, photo?: PhotoItem) => {
    setSelectedService(service || null);
    setSelectedPass(pass || null);
    setSelectedStyle(photo || null);
    setIsBookingOpen(true);
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#082032] text-white flex flex-col selection:bg-[#FF4C29] selection:text-white">
      {/* 1. Primary Navigation Header */}
      <Navbar onOpenAuth={handleOpenAuth} />

      {/* 2. Main Landing Page Content */}
      <main className="flex-1">
        {/* Sticky Video Container across Section 1 & Section 2 */}
        <div className="relative">
          {/* Pinned / Sticky Video Layer covering Section 1 and Section 2 */}
          <div className="sticky top-0 h-screen w-full overflow-hidden z-0 pointer-events-none">
            <HeroCartoonVideoBackground />
          </div>

          {/* Foreground Scrollable Content: Section 1 (Hero) & Section 2 (Why Pholet & Reviews) */}
          <div className="relative z-10 -mt-[100vh]">
            {/* Section 1: Hero Section */}
            <HeroSection
              onOpenBooking={() => handleOpenBooking()}
            />

            {/* Section 2: Why Pholet Stepper & Director Reviews */}
            <ClientRosterAndReviews />
          </div>
        </div>

        {/* Section 3: Project Overview & Description */}
        <ProjectOverviewSection />
      </main>

      {/* 3. Large Editorial Footer */}
      <Footer />

      {/* 4. Interactive Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedService(null);
          setSelectedPass(null);
          setSelectedStyle(null);
        }}
        initialService={selectedService}
        initialPass={selectedPass}
        initialPhotoStyle={selectedStyle}
      />

      {/* 5. Login & Register Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}