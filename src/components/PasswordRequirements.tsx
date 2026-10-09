import React from 'react';
import { Check } from 'lucide-react';
import { PasswordValidationResult } from '../utils/validation';

interface PasswordRequirementsProps {
  validation: PasswordValidationResult;
  className?: string;
}

/**
 * Komponen indikator checklist persyaratan kata sandi (minimal 8 karakter dan minimal 1 karakter unik).
 */
export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  validation,
  className = '',
}) => {
  return (
    <div
      className={`mt-2.5 p-3 bg-[#082032]/85 border border-[#334756] rounded-xl space-y-1.5 text-xs animate-fade-in ${className}`}
    >
      <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1">
        Syarat Kata Sandi:
      </div>
      <div
        className={`flex items-center gap-2 transition-colors ${
          validation.hasMinLength ? 'text-emerald-400' : 'text-gray-400'
        }`}
      >
        {validation.hasMinLength ? (
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        ) : (
          <div className="w-3.5 h-3.5 rounded-full border border-gray-500 shrink-0" />
        )}
        <span>Minimal 8 karakter</span>
      </div>
      <div
        className={`flex items-center gap-2 transition-colors ${
          validation.hasSpecialChar ? 'text-emerald-400' : 'text-gray-400'
        }`}
      >
        {validation.hasSpecialChar ? (
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        ) : (
          <div className="w-3.5 h-3.5 rounded-full border border-gray-500 shrink-0" />
        )}
        <span>Minimal 1 karakter unik / simbol (!@#$%^&*)</span>
      </div>
    </div>
  );
};
