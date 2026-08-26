import React, { useState, useRef } from 'react';
import { Sliders, Camera, RotateCcw, Download, Sparkles, Upload, Flame, Aperture, Eye } from 'lucide-react';
import { playDialTick, playShutterSound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface DarkroomPlaygroundProps {
  onClose?: () => void;
  isStandaloneModal?: boolean;
}

const SAMPLE_DARKROOM_IMAGES = [
  {
    name: 'Berlin Sprinter',
    url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'Velodrome Track',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'Boxing Ring',
    url: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'Paris Fashion',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
  }
];

export const DarkroomPlayground: React.FC<DarkroomPlaygroundProps> = ({
  onClose,
  isStandaloneModal = false,
}) => {
  const [selectedImage, setSelectedImage] = useState(SAMPLE_DARKROOM_IMAGES[0].url);
  const [contrast, setContrast] = useState(125);
  const [brightness, setBrightness] = useState(105);
  const [saturation, setSaturation] = useState(115);
  const [sepia, setSepia] = useState(10);
  const [blur, setBlur] = useState(0);
  const [grainOpacity, setGrainOpacity] = useState(35);
  const [vignette, setVignette] = useState(45);
  const [monochrome, setMonochrome] = useState(false);
  const [isExported, setIsExported] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    playDialTick();
    setContrast(125);
    setBrightness(105);
    setSaturation(115);
    setSepia(10);
    setBlur(0);
    setGrainOpacity(35);
    setVignette(45);
    setMonochrome(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          playShutterSound();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetApply = (mode: 'chrome' | 'trix' | 'amber') => {
    playDialTick();
    if (mode === 'chrome') {
      setContrast(140);
      setBrightness(100);
      setSaturation(120);
      setSepia(15);
      setGrainOpacity(40);
      setVignette(50);
      setMonochrome(false);
    } else if (mode === 'trix') {
      setContrast(160);
      setBrightness(105);
      setSaturation(0);
      setSepia(0);
      setGrainOpacity(65);
      setVignette(60);
      setMonochrome(true);
    } else if (mode === 'amber') {
      setContrast(130);
      setBrightness(110);
      setSaturation(145);
      setSepia(35);
      setGrainOpacity(25);
      setVignette(40);
      setMonochrome(false);
    }
  };

  const handleSnapshot = () => {
    playShutterSound();
    setIsExported(true);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FF4C29', '#E4D6A9', '#082032'],
    });
    setTimeout(() => setIsExported(false), 2500);
  };

  return (
    <section id="darkroom-section" className="py-16 sm:py-24 bg-[#082032] border-b border-[#334756] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2C394B] border border-[#334756] text-xs font-mono-camera text-[#FF4C29] uppercase mb-3">
              <Aperture className="w-3.5 h-3.5" />
              <span>INTERACTIVE DARKROOM ENGINE</span>
            </div>
            <h2 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase">
              PHOLET <span className="text-[#FF4C29]">DARKROOM</span> SIMULATOR
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl mt-2">
              Tune exposure parameters, inject 35mm grain, and test our signature cobalt shadow tone curve directly in your browser.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#2C394B] hover:bg-[#334756] border border-[#334756] hover:border-[#E4D6A9] text-white text-xs font-mono-camera rounded-xl transition-all focus-pholet"
            >
              <Upload className="w-3.5 h-3.5 text-[#E4D6A9]" />
              <span>UPLOAD OWN PHOTO</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-[#2C394B] hover:bg-[#334756] border border-[#334756] text-gray-300 hover:text-white text-xs font-mono-camera rounded-xl transition-all focus-pholet"
              title="Reset all darkroom dials"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
          </div>
        </div>

        {/* Quick Film Profiles */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-mono-camera text-[#978F66] uppercase mr-2">
            APPLY PROFILE:
          </span>
          <button
            onClick={() => handlePresetApply('chrome')}
            className="px-3 py-1.5 rounded-lg bg-[#2C394B] border border-[#334756] hover:border-[#FF4C29] text-xs font-mono-camera text-white focus-pholet"
          >
            ● Pholet Chrome '94
          </button>
          <button
            onClick={() => handlePresetApply('trix')}
            className="px-3 py-1.5 rounded-lg bg-[#2C394B] border border-[#334756] hover:border-[#FF4C29] text-xs font-mono-camera text-[#E4D6A9] focus-pholet"
          >
            ● Tri-X 400 Silver Push
          </button>
          <button
            onClick={() => handlePresetApply('amber')}
            className="px-3 py-1.5 rounded-lg bg-[#2C394B] border border-[#334756] hover:border-[#FF4C29] text-xs font-mono-camera text-[#FF4C29] focus-pholet"
          >
            ● Kinetic Amber High-Velocity
          </button>
        </div>

        {/* Main Darkroom Canvas & Dials */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#2C394B] border-2 border-[#334756] rounded-2xl p-4 sm:p-8 pholet-shadow-lg">
          {/* Left Canvas Preview */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black border-2 border-[#334756] flex items-center justify-center">
              {/* Processed Image with live CSS tone curves */}
              <div
                className="w-full h-full relative overflow-hidden"
                style={{
                  filter: `contrast(${contrast}%) brightness(${brightness}%) saturate(${
                    monochrome ? 0 : saturation
                  }%) sepia(${sepia}%) blur(${blur}px)`,
                }}
              >
                <img
                  src={selectedImage}
                  alt="Darkroom Working Canvas"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Vignette Shadow Overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 ${vignette * 3}px rgba(8, 32, 50, ${vignette / 100})`,
                }}
              ></div>

              {/* Viewfinder reticle overlay */}
              <div className="absolute inset-0 pointer-events-none border border-[#FF4C29]/30 m-4 rounded flex items-center justify-center">
                <div className="w-4 h-4 border-t border-l border-[#FF4C29] absolute top-2 left-2"></div>
                <div className="w-4 h-4 border-t border-r border-[#FF4C29] absolute top-2 right-2"></div>
                <div className="w-4 h-4 border-b border-l border-[#FF4C29] absolute bottom-2 left-2"></div>
                <div className="w-4 h-4 border-b border-r border-[#FF4C29] absolute bottom-2 right-2"></div>
              </div>

              {/* Watermark badge */}
              <div className="absolute bottom-3 left-3 bg-[#082032]/85 backdrop-blur-sm border border-[#334756] rounded px-2.5 py-1 text-[10px] font-mono-camera text-[#E4D6A9]">
                PHOLET DARKROOM LAB • REALTIME 16-BIT PROCESSED
              </div>
            </div>

            {/* Quick Sample Selector strip */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono-camera text-[#978F66]">TEST SAMPLES:</span>
              <div className="flex items-center gap-2 overflow-x-auto">
                {SAMPLE_DARKROOM_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      playDialTick();
                      setSelectedImage(img.url);
                    }}
                    className={`px-2.5 py-1 rounded bg-[#082032] border text-[11px] font-mono-camera whitespace-nowrap transition-all ${
                      selectedImage === img.url
                        ? 'border-[#FF4C29] text-[#FF4C29]'
                        : 'border-[#334756] text-gray-300 hover:text-white'
                    }`}
                  >
                    {img.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Fine-Tuning Dials & Sliders */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between border-b border-[#334756] pb-3">
              <h3 className="font-syne font-bold text-lg text-white">
                ANALOG CURVE PARAMETERS
              </h3>
              <span className="font-mono-camera text-xs text-[#FF4C29]">DEV TANK 01</span>
            </div>

            <div className="space-y-4">
              {/* Contrast */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono-camera">
                  <span className="text-gray-300">CONTRAST & TONAL DENSITY</span>
                  <span className="text-[#FF4C29] font-bold">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-[#FF4C29] bg-[#082032] rounded-lg cursor-pointer h-2"
                />
              </div>

              {/* Brightness */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono-camera">
                  <span className="text-gray-300">EXPOSURE GAIN</span>
                  <span className="text-[#E4D6A9] font-bold">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-[#FF4C29] bg-[#082032] rounded-lg cursor-pointer h-2"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono-camera">
                  <span className="text-gray-300">COLOR SATURATION</span>
                  <span className="text-[#978F66] font-bold">{monochrome ? '0 (B&W)' : `${saturation}%`}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  disabled={monochrome}
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full accent-[#FF4C29] bg-[#082032] rounded-lg cursor-pointer h-2 disabled:opacity-30"
                />
              </div>

              {/* Amber / Warmth Sepia */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono-camera">
                  <span className="text-gray-300">AMBER HALATION WARMTH</span>
                  <span className="text-[#E4D6A9] font-bold">{sepia}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="70"
                  value={sepia}
                  onChange={(e) => setSepia(Number(e.target.value))}
                  className="w-full accent-[#FF4C29] bg-[#082032] rounded-lg cursor-pointer h-2"
                />
              </div>

              {/* Vignette Depth */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono-camera">
                  <span className="text-gray-300">NAVY VIGNETTE FALLOFF</span>
                  <span className="text-[#978F66] font-bold">{vignette}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={vignette}
                  onChange={(e) => setVignette(Number(e.target.value))}
                  className="w-full accent-[#FF4C29] bg-[#082032] rounded-lg cursor-pointer h-2"
                />
              </div>

              {/* Monochrome Toggle */}
              <div className="pt-2 flex items-center justify-between bg-[#082032] p-3 rounded-xl border border-[#334756]">
                <span className="text-xs font-mono-camera text-gray-200">
                  SILVER GELATIN MONOCHROME
                </span>
                <button
                  onClick={() => {
                    playDialTick();
                    setMonochrome(!monochrome);
                  }}
                  className={`px-3 py-1 rounded text-xs font-mono-camera font-bold transition-all ${
                    monochrome
                      ? 'bg-[#FF4C29] text-white'
                      : 'bg-[#2C394B] text-gray-400 border border-[#334756]'
                  }`}
                >
                  {monochrome ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#334756] flex items-center justify-between gap-4">
              <button
                onClick={handleSnapshot}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#FF4C29] hover:bg-[#ff360f] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all pholet-shadow-md focus-pholet"
              >
                <Camera className="w-4 h-4" />
                <span>{isExported ? 'Processed Master Snapshot!' : 'Capture Processed Frame'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
