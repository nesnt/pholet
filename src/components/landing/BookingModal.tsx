import React, { useState } from 'react';
import { X, Camera, Calendar, MapPin, Check, Sparkles, Clock, Layers, ShieldCheck, Mail, Phone, User, Film } from 'lucide-react';
import { StudioService, ClubPass, PhotoItem } from '../../types';
import { PHOLET_SERVICES } from '../../data/landing/photographyData';
import { playDialTick, playShutterSound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: StudioService | null;
  initialPass?: ClubPass | null;
  initialPhotoStyle?: PhotoItem | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialService,
  initialPass,
  initialPhotoStyle,
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialService ? initialService.id : PHOLET_SERVICES[0].id
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [locationPref, setLocationPref] = useState('Berlin Studio (Cyclorama A)');
  const [filmAddon, setFilmAddon] = useState(false);
  const [droneAddon, setDroneAddon] = useState(false);
  const [rushDelivery, setRushDelivery] = useState(false);
  const [notes, setNotes] = useState(
    initialPhotoStyle ? `Inquiring for aesthetic style matching frame #${initialPhotoStyle.id.toUpperCase()} (${initialPhotoStyle.title})` : ''
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRefId, setBookingRefId] = useState('');

  if (!isOpen) return null;

  const currentService = PHOLET_SERVICES.find((s) => s.id === selectedServiceId) || PHOLET_SERVICES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playShutterSound();
    const randomRef = 'PHL-' + Math.floor(100000 + Math.random() * 900000);
    setBookingRefId(randomRef);
    setIsSubmitted(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#FF4C29', '#E4D6A9', '#978F66', '#082032'],
    });
  };

  const handleResetModal = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div
      id="booking-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#082032]/95 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#2C394B] border-2 border-[#334756] rounded-2xl overflow-hidden pholet-shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#082032] border-b border-[#334756]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2C394B] border border-[#FF4C29] flex items-center justify-center">
              <Camera className="w-4 h-4 text-[#FF4C29]" />
            </div>
            <div>
              <h3 className="font-syne font-extrabold text-lg text-white uppercase">
                {initialPass ? `JOIN ${initialPass.name}` : 'COMMISSION STUDIO SESSION'}
              </h3>
              <div className="text-[11px] font-mono-camera text-[#978F66]">
                PHOLET ATHLETIC CLUB • RESERVATION DESK
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playDialTick();
              onClose();
            }}
            className="p-2 rounded-lg bg-[#2C394B] border border-[#334756] hover:border-[#FF4C29] text-gray-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#FF4C29]/20 border-2 border-[#FF4C29] text-[#FF4C29] flex items-center justify-center mx-auto pholet-shadow-sm">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-syne text-3xl font-extrabold text-white uppercase">
                SESSION RESERVATION RECEIVED
              </h2>
              <p className="text-sm text-gray-300 max-w-md mx-auto">
                Thank you, <strong className="text-white">{name || 'Creator'}</strong>. Our production director will review your equipment requirements and contact you within 12 hours.
              </p>
            </div>

            <div className="bg-[#082032] border border-[#334756] rounded-xl p-5 max-w-md mx-auto text-left space-y-3 font-mono-camera text-xs">
              <div className="flex justify-between border-b border-[#334756] pb-2">
                <span className="text-[#978F66]">BOOKING REFERENCE:</span>
                <span className="text-[#FF4C29] font-bold">{bookingRefId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#978F66]">PACKAGE:</span>
                <span className="text-white font-bold">{currentService.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#978F66]">LOCATION:</span>
                <span className="text-[#E4D6A9]">{locationPref}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#978F66]">PREFERRED DATE:</span>
                <span className="text-[#E4D6A9]">{date || 'To Be Confirmed'}</span>
              </div>
            </div>

            <button
              onClick={handleResetModal}
              className="px-8 py-3 bg-[#FF4C29] hover:bg-[#ff360f] text-white font-bold text-xs uppercase tracking-wider rounded-xl pholet-shadow-md"
            >
              Return to Archives
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Step 1: Package Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-mono-camera font-bold text-[#E4D6A9] uppercase">
                1. SELECT STUDIO COMMISSION PACKAGE:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PHOLET_SERVICES.map((srv) => (
                  <button
                    type="button"
                    key={srv.id}
                    onClick={() => {
                      playDialTick();
                      setSelectedServiceId(srv.id);
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      selectedServiceId === srv.id
                        ? 'bg-[#082032] border-[#FF4C29] ring-2 ring-[#FF4C29]/40 pholet-shadow-sm'
                        : 'bg-[#2C394B] border-[#334756] hover:border-[#E4D6A9]'
                    }`}
                  >
                    <div>
                      <div className="text-[10px] font-mono-camera text-[#978F66]">{srv.code}</div>
                      <div className="font-syne font-bold text-sm text-white mt-0.5">{srv.title}</div>
                    </div>
                    <div className="text-base font-extrabold font-syne text-[#FF4C29] mt-2">
                      {srv.price}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Contact Details */}
            <div className="space-y-4">
              <label className="block text-xs font-mono-camera font-bold text-[#E4D6A9] uppercase">
                2. PRODUCER & CLIENT DETAILS:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono-camera text-gray-300 mb-1">
                    FULL NAME / BRAND NAME *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full bg-[#082032] border border-[#334756] focus:border-[#FF4C29] rounded-xl px-4 py-2.5 text-sm text-white focus-pholet"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono-camera text-gray-300 mb-1">
                    OFFICIAL EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="elena@studio.com"
                    className="w-full bg-[#082032] border border-[#334756] focus:border-[#FF4C29] rounded-xl px-4 py-2.5 text-sm text-white focus-pholet"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono-camera text-gray-300 mb-1">
                    PHONE / WHATSAPP (OPTIONAL)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+49 30 12345678"
                    className="w-full bg-[#082032] border border-[#334756] focus:border-[#FF4C29] rounded-xl px-4 py-2.5 text-sm text-white focus-pholet"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono-camera text-gray-300 mb-1">
                    PREFERRED SESSION DATE
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#082032] border border-[#334756] focus:border-[#FF4C29] rounded-xl px-4 py-2.5 text-sm text-white focus-pholet font-mono-camera"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Location Studio Preference */}
            <div className="space-y-2">
              <label className="block text-xs font-mono-camera font-bold text-[#E4D6A9] uppercase">
                3. STUDIO OR ON-LOCATION FACILITY:
              </label>
              <select
                value={locationPref}
                onChange={(e) => setLocationPref(e.target.value)}
                className="w-full bg-[#082032] border border-[#334756] focus:border-[#FF4C29] rounded-xl px-4 py-2.5 text-sm text-white focus-pholet font-mono-camera"
              >
                <option value="Berlin Studio (Cyclorama A & B)">Berlin Studio (Cyclorama A & B — Mitte)</option>
                <option value="Tokyo Studio (Izu Oval High-Speed Stage)">Tokyo Studio (Izu Oval High-Speed Stage)</option>
                <option value="New York Studio (Brooklyn Navy Yard Loft)">New York Studio (Brooklyn Navy Yard Loft)</option>
                <option value="Paris Studio (8ème Arrondissement)">Paris Studio (8ème Arrondissement)</option>
                <option value="On-Location Global Commission">On-Location Global Commission (Travel Required)</option>
              </select>
            </div>

            {/* Step 4: Optional Production Add-ons */}
            <div className="space-y-2">
              <label className="block text-xs font-mono-camera font-bold text-[#E4D6A9] uppercase">
                4. TECHNICAL ARSENAL ADD-ONS:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-camera">
                <button
                  type="button"
                  onClick={() => {
                    playDialTick();
                    setFilmAddon(!filmAddon);
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    filmAddon
                      ? 'bg-[#082032] border-[#FF4C29] text-[#FF4C29]'
                      : 'bg-[#2C394B] border-[#334756] text-gray-300'
                  }`}
                >
                  <span>+ 35mm & 120 Film Lab</span>
                  <span className="font-bold">+$350</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playDialTick();
                    setDroneAddon(!droneAddon);
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    droneAddon
                      ? 'bg-[#082032] border-[#FF4C29] text-[#FF4C29]'
                      : 'bg-[#2C394B] border-[#334756] text-gray-300'
                  }`}
                >
                  <span>+ FPV High-Speed Chase</span>
                  <span className="font-bold">+$480</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playDialTick();
                    setRushDelivery(!rushDelivery);
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    rushDelivery
                      ? 'bg-[#082032] border-[#FF4C29] text-[#FF4C29]'
                      : 'bg-[#2C394B] border-[#334756] text-gray-300'
                  }`}
                >
                  <span>+ 24H Rush Selects</span>
                  <span className="font-bold">+$250</span>
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="block text-[11px] font-mono-camera text-gray-300">
                CREATIVE MOODBOARD / SPECIAL SPECIFICATIONS
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe lighting mood, athletes, styling, or reference frames..."
                className="w-full bg-[#082032] border border-[#334756] focus:border-[#FF4C29] rounded-xl p-3 text-sm text-white focus-pholet"
              ></textarea>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-[#334756] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-mono-camera text-gray-300">
                TOTAL BASE: <strong className="text-[#FF4C29] text-base">{currentService.price}</strong>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#FF4C29] hover:bg-[#ff360f] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all pholet-shadow-md focus-pholet"
              >
                Confirm & Dispatch Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
