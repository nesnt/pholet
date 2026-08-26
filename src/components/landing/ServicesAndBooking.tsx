import React from 'react';
import { Camera, Check, Clock, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { StudioService } from '../../types';
import { PHOLET_SERVICES } from '../../data/landing/photographyData';
import { playShutterSound } from '../../utils/audio';

interface ServicesAndBookingProps {
  onSelectService: (service: StudioService) => void;
}

export const ServicesAndBooking: React.FC<ServicesAndBookingProps> = ({
  onSelectService,
}) => {
  return (
    <section id="services" className="py-16 sm:py-24 bg-[#082032] border-b border-[#334756] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2C394B] border border-[#334756] text-xs font-mono-camera text-[#FF4C29] uppercase mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>COMMISSIONS & STUDIO SESSIONS</span>
          </div>
          <h2 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase">
            STUDIO <span className="text-[#FF4C29]">SERVICES</span> & PRODUCTION
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mt-2">
            Fully equipped athletic cycloramas, high-speed Profoto flash rigs, and archival silver gelatin darkroom facilities.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PHOLET_SERVICES.map((service) => (
            <div
              key={service.id}
              className={`bg-[#2C394B] border-2 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${
                service.popular
                  ? 'border-[#FF4C29] pholet-shadow-orange ring-1 ring-[#FF4C29]/30'
                  : 'border-[#334756] hover:border-[#E4D6A9] pholet-shadow-md'
              }`}
            >
              <div>
                {/* Visual Thumbnail with Badge */}
                <div className="relative aspect-[16/9] overflow-hidden bg-black">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C394B] via-transparent to-transparent"></div>

                  {service.badge && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#FF4C29] text-white text-[10px] font-mono-camera font-bold uppercase shadow">
                      {service.badge}
                    </div>
                  )}

                  <div className="absolute bottom-2 right-3 font-mono-camera text-xs text-[#E4D6A9]">
                    CODE: {service.code}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-syne font-extrabold text-2xl text-white">
                      {service.title}
                    </h3>
                    <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                      {service.subtitle}
                    </p>
                  </div>

                  {/* Pricing & Duration */}
                  <div className="bg-[#082032] border border-[#334756] rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono-camera text-[#978F66]">SESSION INVESTMENT</div>
                      <div className="text-3xl font-extrabold font-syne text-[#FF4C29]">
                        {service.price}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono-camera text-[#E4D6A9] font-bold">
                        {service.duration}
                      </div>
                      <div className="text-[10px] font-mono-camera text-gray-400 mt-0.5">
                        {service.turnaround}
                      </div>
                    </div>
                  </div>

                  {/* Included Features */}
                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-mono-camera text-[#978F66] uppercase tracking-wider">
                      PACKAGE SPECIFICATIONS:
                    </div>
                    <ul className="space-y-2">
                      {service.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-200">
                          <Check className="w-3.5 h-3.5 text-[#FF4C29] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => {
                    playShutterSound();
                    onSelectService(service);
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all focus-pholet ${
                    service.popular
                      ? 'bg-[#FF4C29] hover:bg-[#ff360f] text-white pholet-shadow-md'
                      : 'bg-[#082032] hover:bg-[#334756] border border-[#334756] hover:border-[#FF4C29] text-white'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>Reserve {service.code}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
