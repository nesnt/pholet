import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { PHOLET_FAQS } from '../../data/landing/photographyData';
import { playDialTick } from '../../utils/audio';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    playDialTick();
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-[#082032] border-b border-[#334756] relative tracking-wide">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2C394B] border border-[#334756] text-xs font-mono-camera text-[#FF4C29] uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>STUDIO INTELLIGENCE & POLICIES</span>
          </div>
          <h2 className="font-formal text-3xl sm:text-4xl font-bold text-white tracking-tight uppercase">
            FREQUENTLY <span className="text-[#FF4C29]">ASKED</span> QUESTIONS
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mt-2 tracking-wide">
            Everything you need to know regarding studio commissions, camera arsenal, darkroom workflow, and international club access.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {PHOLET_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`bg-[#2C394B] border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? 'border-[#FF4C29] pholet-shadow-sm'
                    : 'border-[#334756] hover:border-[#E4D6A9]'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus-pholet"
                  aria-expanded={isOpen}
                >
                  <span className="font-formal font-semibold text-base sm:text-lg text-white tracking-normal">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-[#FF4C29] text-white rotate-180'
                        : 'bg-[#082032] border border-[#334756] text-gray-300'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-gray-300 leading-relaxed border-t border-[#334756]/50 tracking-wide">
                    <p className="bg-[#082032] p-4 rounded-xl border border-[#334756] tracking-wide">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
