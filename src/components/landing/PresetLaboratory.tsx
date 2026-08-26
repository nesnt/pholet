import React, { useState, useRef } from 'react';
import { Sparkles, Sliders, ArrowRight, Download, Check, Layers, Disc, Flame } from 'lucide-react';
import { PHOLET_PRESETS } from '../../data/landing/photographyData';
import { playDialTick, playShutterSound } from '../../utils/audio';
import confetti from 'canvas-confetti';

export const PresetLaboratory: React.FC = () => {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPreset = PHOLET_PRESETS[activePresetIndex];

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleDownload = () => {
    playShutterSound();
    setDownloaded(true);
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF4C29', '#E4D6A9', '#978F66', '#2C394B'],
    });
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <section id="presets" className="py-16 sm:py-24 bg-[#082032] border-b border-[#334756] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2C394B] border border-[#334756] text-xs font-mono-camera text-[#FF4C29] uppercase mb-3">
            <Sliders className="w-3.5 h-3.5" />
            <span>COLOR LAB & LUT ENGINE</span>
          </div>
          <h2 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase">
            SIGNATURE <span className="text-[#FF4C29]">LUT & PRESET</span> LABORATORY
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mt-2">
            Drag the comparison slider to test our camera profiles. Developed to inject deep cobalt navy shadows, warm skin halation, and high-velocity contrast.
          </p>
        </div>

        {/* Preset Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {PHOLET_PRESETS.map((preset, idx) => (
            <button
              key={preset.id}
              onClick={() => {
                playDialTick();
                setActivePresetIndex(idx);
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-xs sm:text-sm font-mono-camera font-bold transition-all focus-pholet ${
                activePresetIndex === idx
                  ? 'bg-[#FF4C29] border-[#FF4C29] text-white pholet-shadow-md'
                  : 'bg-[#2C394B] border-[#334756] text-gray-300 hover:border-[#E4D6A9] hover:text-white'
              }`}
            >
              <Disc className={`w-4 h-4 ${activePresetIndex === idx ? 'animate-spin' : ''}`} />
              <span>{preset.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#082032] text-[#E4D6A9]">
                {preset.code}
              </span>
            </button>
          ))}
        </div>

        {/* Main Interactive Before/After Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#2C394B] border-2 border-[#334756] rounded-2xl p-4 sm:p-8 pholet-shadow-lg">
          {/* Left: Interactive Before/After Slider */}
          <div className="lg:col-span-7">
            <div
              ref={containerRef}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative aspect-[16/10] rounded-xl overflow-hidden cursor-ew-resize select-none border-2 border-[#334756]"
            >
              {/* After Image (Graded) - Full Background */}
              <img
                src={currentPreset.afterImage}
                alt={`${currentPreset.name} Graded`}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded bg-[#FF4C29] text-white text-[11px] font-mono-camera font-bold uppercase shadow">
                PHOLET GRADED
              </div>

              {/* Before Image (Raw) - Clipped by Slider Position */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={currentPreset.beforeImage}
                  alt="Raw Capture"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
                />
                <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded bg-[#082032]/90 border border-[#334756] text-[#E4D6A9] text-[11px] font-mono-camera font-bold uppercase">
                  RAW ORIGINAL
                </div>
              </div>

              {/* Draggable Divider Line & Knob */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-[#FF4C29] cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#FF4C29] border-2 border-[#E4D6A9] text-white flex items-center justify-center pholet-shadow-sm">
                  <Sliders className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Micro hint */}
            <div className="flex items-center justify-between text-xs font-mono-camera text-[#978F66] mt-3">
              <span>← SLIDE TO REVEAL RAW SENSOR</span>
              <span>SLIDE TO REVEAL PHOLET PROFILE →</span>
            </div>
          </div>

          {/* Right: Preset Specs & Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono-camera text-[#FF4C29] font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>PROFILE SPECS: {currentPreset.code}</span>
              </div>
              <h3 className="font-syne text-2xl sm:text-3xl font-extrabold text-white">
                {currentPreset.name}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {currentPreset.description}
              </p>
            </div>

            {/* Technical Tonal Mapping Metrics */}
            <div className="space-y-3 bg-[#082032] border border-[#334756] rounded-xl p-4">
              <div className="flex items-center justify-between text-xs font-mono-camera">
                <span className="text-[#978F66]">SHADOW COBALT CURVE:</span>
                <span className="text-[#E4D6A9] font-bold">{currentPreset.shadows}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono-camera">
                <span className="text-[#978F66]">HIGHLIGHT ROLLOFF:</span>
                <span className="text-[#E4D6A9] font-bold">{currentPreset.highlights}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono-camera">
                <span className="text-[#978F66]">EMULATED GRAIN:</span>
                <span className="text-[#FF4C29] font-bold">{currentPreset.grainLevel}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono-camera pt-2 border-t border-[#334756]">
                <span className="text-gray-400">COMMUNITY DOWNLOADS:</span>
                <span className="text-white font-bold">{currentPreset.downloads.toLocaleString()}+</span>
              </div>
            </div>

            {/* Price and Download Action */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <div>
                <div className="text-[10px] font-mono-camera text-[#978F66]">LIFETIME PACK LICENSE</div>
                <div className="text-2xl font-extrabold font-syne text-[#E4D6A9]">{currentPreset.price}</div>
              </div>

              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3.5 bg-[#FF4C29] hover:bg-[#ff360f] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all pholet-shadow-md focus-pholet"
              >
                {downloaded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Pack Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Acquire LUT Pack</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
