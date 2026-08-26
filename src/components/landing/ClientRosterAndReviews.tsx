import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import {
  Sparkles,
  Camera,
  Share2,
  Infinity,
  HardDrive,
} from 'lucide-react';

export const ClientRosterAndReviews: React.FC = () => {
  // Motion value tracking scroll progress starting from the exact point hero-content touches header
  const scrollProgress = useMotionValue(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const heroContentEl = document.getElementById('hero-content');
      const headerEl = document.getElementById('main-header');

      if (!heroContentEl) return;

      const headerBottom = headerEl ? headerEl.getBoundingClientRect().bottom : 80;
      const heroRect = heroContentEl.getBoundingClientRect();

      // Distance scrolled past the exact moment hero-content touches the header bottom
      const touchDistance = headerBottom - heroRect.top;

      if (touchDistance <= 0) {
        // Before hero-content touches the header: completely hidden (0)
        scrollProgress.set(0);
      } else {
        // As user scrolls down past header touch point: smoothly progress 0 -> 1 over a wider 750px scroll range
        const animationRange = 750;
        const progress = Math.min(1, Math.max(0, touchDistance / animationRange));
        scrollProgress.set(progress);
      }
    };

    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, [scrollProgress]);

  // Section level fade-in
  const sectionOpacity = useTransform(scrollProgress, [0, 0.1], [0, 1]);

  // H2 Title transformations
  const h2Opacity = useTransform(scrollProgress, [0, 0.2], [0, 1]);
  const h2Y = useTransform(scrollProgress, [0, 0.2], [35, 0]);

  // Card 1: appears between 0.05 and 0.24 progress
  const card1Opacity = useTransform(scrollProgress, [0.05, 0.24], [0, 1]);
  const card1Y = useTransform(scrollProgress, [0.05, 0.24], [35, 0]);
  const card1Scale = useTransform(scrollProgress, [0.05, 0.24], [0.92, 1]);

  // Card 2: appears sequentially between 0.28 and 0.48 progress
  const card2Opacity = useTransform(scrollProgress, [0.28, 0.48], [0, 1]);
  const card2Y = useTransform(scrollProgress, [0.28, 0.48], [35, 0]);
  const card2Scale = useTransform(scrollProgress, [0.28, 0.48], [0.92, 1]);

  // Card 3: appears sequentially between 0.52 and 0.72 progress
  const card3Opacity = useTransform(scrollProgress, [0.52, 0.72], [0, 1]);
  const card3Y = useTransform(scrollProgress, [0.52, 0.72], [35, 0]);
  const card3Scale = useTransform(scrollProgress, [0.52, 0.72], [0.92, 1]);

  // Card 4: appears sequentially between 0.76 and 0.96 progress
  const card4Opacity = useTransform(scrollProgress, [0.76, 0.96], [0, 1]);
  const card4Y = useTransform(scrollProgress, [0.76, 0.96], [35, 0]);
  const card4Scale = useTransform(scrollProgress, [0.76, 0.96], [0.92, 1]);

  const cardTransforms = [
    { opacity: card1Opacity, y: card1Y, scale: card1Scale },
    { opacity: card2Opacity, y: card2Y, scale: card2Scale },
    { opacity: card3Opacity, y: card3Y, scale: card3Scale },
    { opacity: card4Opacity, y: card4Y, scale: card4Scale },
  ];

  const whyPholetPoints = [
    {
      name: 'Capture Important Moments',
      role: 'Preserve real action, raw athletic power, and spontaneous emotion with high-speed fidelity.',
      icon: Camera,
      accent: 'text-amber-400',
      bgAccent: 'bg-amber-400/10 border-amber-400/30',
    },
    {
      name: 'Share Your Moments',
      role: 'Instantly publish and deliver editorial-grade visuals across social feeds and team syndicates.',
      icon: Share2,
      accent: 'text-sky-400',
      bgAccent: 'bg-sky-400/10 border-sky-400/30',
    },
    {
      name: 'Preserve Forever',
      role: 'Secure, permanent cloud archiving that safeguards your high-resolution memories perpetually.',
      icon: Infinity,
      accent: 'text-emerald-400',
      bgAccent: 'bg-emerald-400/10 border-emerald-400/30',
    },
    {
      name: 'Save Your Storage',
      role: 'Intelligent lossless compression that maximizes device storage without losing an ounce of clarity.',
      icon: HardDrive,
      accent: 'text-orange-400',
      bgAccent: 'bg-orange-400/10 border-orange-400/30',
    },
  ];

  return (
    <motion.section
      id="reviews"
      style={{ opacity: sectionOpacity }}
      className="py-20 sm:py-36 bg-transparent border-b border-[#334756]/40 relative tracking-wide"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Why Pholet Connected Timeline */}
        <div className="pb-16">
          <motion.h2
            style={{ opacity: h2Opacity, y: h2Y }}
            className="text-left font-cartoon-title text-3xl sm:text-4xl lg:text-5xl text-white tracking-[0.18em] sm:tracking-[0.22em] uppercase font-bold mb-16 sm:mb-20 flex items-center gap-3.5"
          >
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-[#FF4C29] flex-shrink-0" />
            Kenapa Pholet?
          </motion.h2>

          {/* Connected Vertical Timeline Cards */}
          <div className="relative max-w-xl mr-auto ml-0">
            {/* Continuous Vertical Connecting Line */}
            <div className="absolute left-6 sm:left-7 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#FF4C29] via-[#334756] to-[#FF4C29]/40 z-0"></div>

            <div className="flex flex-col gap-24 sm:gap-36 lg:gap-44 relative z-10">
              {whyPholetPoints.map((item, i) => {
                const IconComponent = item.icon;
                const transformStyle = cardTransforms[i] || cardTransforms[0];

                return (
                  <motion.div
                    key={i}
                    style={{
                      opacity: transformStyle.opacity,
                      y: transformStyle.y,
                      scale: transformStyle.scale,
                    }}
                    className="group relative flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-[#2C394B]/90 hover:bg-[#2C394B] border border-[#334756] hover:border-[#FF4C29]/70 transition-colors duration-300 shadow-md hover:shadow-xl hover:translate-x-1.5"
                  >
                    {/* Node / Icon Circle */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${item.bgAccent}`}
                      >
                        <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${item.accent}`} />
                      </div>

                      {/* Small Status Indicator Dot */}
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FF4C29] ring-2 ring-[#2C394B]"></span>
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4 className="font-formal font-bold text-sm sm:text-base tracking-wider text-gray-200 group-hover:text-white transition-colors">
                          {item.name}
                        </h4>
                        <span className="text-[10px] font-mono-camera text-[#FF4C29] uppercase px-2 py-0.5 rounded-full bg-[#082032] border border-[#334756]">
                          0{i + 1} // REASON
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-formal mt-1 group-hover:text-gray-300 transition-colors">
                        {item.role}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
