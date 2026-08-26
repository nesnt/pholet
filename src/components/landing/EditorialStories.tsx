import React, { useState } from 'react';
import { BookOpen, Calendar, MapPin, ArrowRight, X, Sparkles, Film, Clock } from 'lucide-react';
import { PhotoStory } from '../../types';
import { PHOLET_STORIES } from '../../data/landing/photographyData';
import { playDialTick, playShutterSound } from '../../utils/audio';

export const EditorialStories: React.FC = () => {
  const [activeStory, setActiveStory] = useState<PhotoStory | null>(null);

  return (
    <section id="stories" className="py-16 sm:py-24 bg-[#082032] border-b border-[#334756] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2C394B] border border-[#334756] text-xs font-mono-camera text-[#FF4C29] uppercase mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>VISUAL MONOGRAPHS</span>
            </div>
            <h2 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase">
              EDITORIAL <span className="text-[#FF4C29]">STORIES</span> & ESSAYS
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl mt-2">
              Multi-frame photographic investigations exploring speed, tension, light, and architectural discipline across global cities.
            </p>
          </div>

          <div className="font-mono-camera text-xs text-[#E4D6A9]">
            CURRENT EDITION: <strong className="text-[#FF4C29]">VOL. 09-11 PRINTED</strong>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PHOLET_STORIES.map((story) => (
            <div
              key={story.id}
              onClick={() => {
                playShutterSound();
                setActiveStory(story);
              }}
              className="group bg-[#2C394B] border-2 border-[#334756] hover:border-[#FF4C29] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 pholet-shadow-md hover:pholet-shadow-orange flex flex-col justify-between"
            >
              <div>
                {/* Cover Image with Volume Badge */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#082032] via-black/20 to-transparent"></div>

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#FF4C29] text-white text-[10px] font-mono-camera font-bold uppercase shadow">
                    {story.volume}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono-camera text-[#E4D6A9]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#FF4C29]" />
                      {story.location}
                    </span>
                    <span className="flex items-center gap-1 text-gray-300">
                      <Clock className="w-3.5 h-3.5 text-[#978F66]" />
                      {story.readTime}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="text-[11px] font-mono-camera text-[#978F66] uppercase">
                    {story.discipline}
                  </div>
                  <h3 className="font-syne font-extrabold text-xl text-white group-hover:text-[#FF4C29] transition-colors leading-tight">
                    {story.title}
                  </h3>
                  <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                    {story.subtitle}
                  </p>
                </div>
              </div>

              {/* Bottom Footer */}
              <div className="px-6 py-4 bg-[#082032]/60 border-t border-[#334756] flex items-center justify-between">
                <span className="text-xs font-mono-camera text-gray-400">
                  BY {story.photographer}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold font-mono-camera text-[#FF4C29] group-hover:translate-x-1 transition-transform">
                  READ ESSAY <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Detail Reader Modal */}
      {activeStory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#082032]/95 backdrop-blur-md overflow-y-auto"
          onClick={() => setActiveStory(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#2C394B] border-2 border-[#334756] rounded-2xl overflow-hidden pholet-shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#082032] border-b border-[#334756]">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-[#FF4C29] text-white text-xs font-mono-camera font-bold uppercase">
                  {activeStory.volume}
                </span>
                <span className="font-mono-camera text-xs text-[#E4D6A9]">
                  {activeStory.discipline}
                </span>
              </div>

              <button
                onClick={() => {
                  playDialTick();
                  setActiveStory(null);
                }}
                className="p-2 rounded-lg bg-[#2C394B] border border-[#334756] hover:border-[#FF4C29] text-gray-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="space-y-2">
                <h2 className="font-syne text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
                  {activeStory.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono-camera text-[#E4D6A9]">
                  <span>LOCATION: {activeStory.location}</span>
                  <span className="text-[#978F66]">/</span>
                  <span>DATE: {activeStory.date}</span>
                  <span className="text-[#978F66]">/</span>
                  <span>PHOTOGRAPHER: {activeStory.photographer}</span>
                </div>
              </div>

              <p className="text-base text-gray-200 leading-relaxed font-normal bg-[#082032] border border-[#334756] p-4 rounded-xl">
                {activeStory.synopsis}
              </p>

              {/* Monograph Gallery Grid */}
              <div className="space-y-4 pt-2">
                <h4 className="font-mono-camera text-xs font-bold text-[#FF4C29] uppercase tracking-wider">
                  MONOGRAPH CONTACT SHEET:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {activeStory.images.map((imgUrl, i) => (
                    <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden border border-[#334756] group">
                      <img
                        src={imgUrl}
                        alt={`Story frame ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#082032] border-t border-[#334756] flex items-center justify-between">
              <span className="text-xs font-mono-camera text-[#978F66]">
                PRINT MONOGRAPH AVAILABLE AT CLUBHOUSE
              </span>
              <button
                onClick={() => {
                  playDialTick();
                  setActiveStory(null);
                }}
                className="px-4 py-2 bg-[#2C394B] hover:bg-[#334756] border border-[#334756] text-white text-xs font-mono-camera rounded-lg"
              >
                Close Monograph
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
