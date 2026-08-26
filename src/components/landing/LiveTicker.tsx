import React from 'react';
import { Camera, Sparkles, Disc, Radio } from 'lucide-react';

export const LiveTicker: React.FC = () => {
  return (
    <div id="live-ticker" className="bg-[#082032] border-b border-[#334756] text-xs font-mono-camera text-[#E4D6A9] py-2 overflow-hidden select-none">
      <div className="flex items-center animate-marquee whitespace-nowrap gap-12 tracking-wider">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4C29] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4C29]"></span>
          </span>
          <span className="text-[#FF4C29] font-bold">PHOLET LIVE:</span> BERLIN STUDIO OPEN • CYCLORAMA STAGE A
        </span>

        <span className="text-[#978F66]">///</span>

        <span className="flex items-center gap-2 text-white">
          <Camera className="w-3.5 h-3.5 text-[#FF4C29]" />
          NEW EDITORIAL DROP: <strong className="text-[#E4D6A9]">VOL. 09 TOKYO DUSK</strong> ARCHIVED
        </span>

        <span className="text-[#978F66]">///</span>

        <span className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-[#978F66]" />
          ANALOG LAB STATUS: <span className="text-[#978F66]">KODAK TRI-X 400 BATCH RUNNING</span>
        </span>

        <span className="text-[#978F66]">///</span>

        <span className="flex items-center gap-2 text-white">
          <Disc className="w-3.5 h-3.5 text-[#FF4C29]" />
          PHOLET PRESET LAB 2026 EDITION ACTIVE • 35MM GRAIN ENGINE V4
        </span>

        <span className="text-[#978F66]">///</span>

        <span className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#E4D6A9]" />
          GLOBAL RESIDENCY: NEW YORK • BERLIN • TOKYO • PARIS
        </span>

        <span className="text-[#978F66]">///</span>

        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4C29] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4C29]"></span>
          </span>
          <span className="text-[#FF4C29] font-bold">PHOLET LIVE:</span> BERLIN STUDIO OPEN • CYCLORAMA STAGE A
        </span>

        <span className="text-[#978F66]">///</span>

        <span className="flex items-center gap-2 text-white">
          <Camera className="w-3.5 h-3.5 text-[#FF4C29]" />
          NEW EDITORIAL DROP: <strong className="text-[#E4D6A9]">VOL. 09 TOKYO DUSK</strong> ARCHIVED
        </span>
      </div>
    </div>
  );
};
