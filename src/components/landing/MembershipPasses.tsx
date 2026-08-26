import React from 'react';
import { Shield, Check, Sparkles, ArrowRight, Zap, Crown, Key } from 'lucide-react';
import { ClubPass } from '../../types';
import { PHOLET_PASSES } from '../../data/landing/photographyData';
import { playShutterSound } from '../../utils/audio';

interface MembershipPassesProps {
  onSelectPass: (pass: ClubPass) => void;
}

export const MembershipPasses: React.FC<MembershipPassesProps> = ({
  onSelectPass,
}) => {
  return (
    <section id="membership" className="py-16 sm:py-24 bg-[#082032] border-b border-[#334756] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2C394B] border border-[#334756] text-xs font-mono-camera text-[#FF4C29] uppercase mb-3">
            <Crown className="w-3.5 h-3.5" />
            <span>THE PHOLET ATHLETIC GUILD</span>
          </div>
          <h2 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase">
            CLUB <span className="text-[#FF4C29]">MEMBERSHIP</span> & PASSES
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mt-2">
            Join an international network of photographers, visual directors, and darkroom practitioners with studio access in Berlin, Tokyo, and New York.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PHOLET_PASSES.map((pass) => (
            <div
              key={pass.id}
              className={`bg-[#2C394B] border-2 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${
                pass.highlighted
                  ? 'border-[#FF4C29] pholet-shadow-orange ring-2 ring-[#FF4C29]/30 relative'
                  : 'border-[#334756] hover:border-[#E4D6A9] pholet-shadow-md'
              }`}
            >
              <div className="space-y-6">
                {/* Top Badge & Tier */}
                <div className="flex items-center justify-between">
                  <span className="font-mono-camera text-xs text-[#978F66] uppercase font-bold">
                    {pass.tier}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#082032] border border-[#334756] text-[10px] font-mono-camera text-[#E4D6A9] font-bold uppercase">
                    {pass.badge}
                  </span>
                </div>

                {/* Plan Name & Price */}
                <div>
                  <h3 className="font-syne font-extrabold text-2xl text-white">
                    {pass.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="text-4xl font-extrabold font-syne text-[#FF4C29]">
                      {pass.price}
                    </span>
                    <span className="text-xs font-mono-camera text-gray-400">
                      {pass.period}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                    {pass.description}
                  </p>
                </div>

                {/* Perks List */}
                <div className="space-y-3 pt-4 border-t border-[#334756]">
                  <div className="text-[11px] font-mono-camera text-[#978F66] uppercase tracking-wider">
                    INCLUDED PRIVILEGES:
                  </div>
                  <ul className="space-y-2.5">
                    {pass.perks.map((perk, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-200">
                        <Check className="w-4 h-4 text-[#FF4C29] shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button
                  onClick={() => {
                    playShutterSound();
                    onSelectPass(pass);
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all focus-pholet ${
                    pass.highlighted
                      ? 'bg-[#FF4C29] hover:bg-[#ff360f] text-white pholet-shadow-md'
                      : 'bg-[#082032] hover:bg-[#334756] border border-[#334756] hover:border-[#FF4C29] text-white'
                  }`}
                >
                  <Key className="w-4 h-4" />
                  <span>Join {pass.name}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
