import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero illustration */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 pt-12"
        style={{ background: 'linear-gradient(180deg, #FDF0E0 0%, #ffffff 60%)' }}
      >
        {/* Illustration */}
        <div className="w-72 h-64 relative mb-8">
          <svg viewBox="0 0 288 256" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Background circle */}
            <circle cx="144" cy="128" r="110" fill="#F9DFC6" opacity="0.5" />

            {/* Building */}
            <rect x="64" y="100" width="160" height="120" rx="8" fill="#8FA0D8" opacity="0.8" />
            <rect x="80" y="116" width="30" height="40" rx="4" fill="white" opacity="0.6" />
            <rect x="129" y="116" width="30" height="40" rx="4" fill="white" opacity="0.6" />
            <rect x="178" y="116" width="30" height="40" rx="4" fill="white" opacity="0.6" />
            {/* Door */}
            <rect x="114" y="170" width="60" height="50" rx="4" fill="white" opacity="0.8" />
            {/* Ramp */}
            <polygon points="64,220 104,220 64,236" fill="#FF8400" opacity="0.9" />

            {/* Person in wheelchair */}
            <circle cx="168" cy="76" r="14" fill="#FF8400" opacity="0.9" />
            <circle cx="168" cy="62" r="8" fill="#0B0829" opacity="0.8" />
            {/* Wheelchair */}
            <circle cx="155" cy="92" r="7" fill="none" stroke="#FF8400" strokeWidth="2.5" />
            <circle cx="181" cy="92" r="7" fill="none" stroke="#FF8400" strokeWidth="2.5" />
            <path d="M162 78 L155 92" stroke="#FF8400" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M155 92 L181 92" stroke="#FF8400" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M168 78 L168 92" stroke="#FF8400" strokeWidth="2.5" strokeLinecap="round" />

            {/* Score badges */}
            <circle cx="220" cy="55" r="18" fill="#22C55E" />
            <text x="220" y="61" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">A</text>
            <circle cx="100" cy="68" r="15" fill="#EAB308" />
            <text x="100" y="73" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">B</text>

            {/* Accessibility icons */}
            <circle cx="52" cy="140" r="14" fill="#FF8400" opacity="0.15" />
            <text x="52" y="146" textAnchor="middle" fontSize="14">♿</text>
            <circle cx="236" cy="130" r="14" fill="#8FA0D8" opacity="0.2" />
            <text x="236" y="136" textAnchor="middle" fontSize="14">👁️</text>
            <circle cx="40" cy="172" r="12" fill="#22C55E" opacity="0.15" />
            <text x="40" y="177" textAnchor="middle" fontSize="12">👂</text>
          </svg>
        </div>

        {/* Text */}
        <h1
          className="text-3xl font-bold text-center mb-3"
          style={{ color: '#0B0829' }}
        >
          Bienvenue sur{' '}
          <span style={{ color: '#FF8400' }}>AccesSite</span>
          <span style={{ color: '#0B0829' }}>!</span>
        </h1>
        <p className="text-base text-gray-500 text-center leading-relaxed max-w-xs">
          Trouvez des lieux accessibles et réservez du matériel d'aide en Hauts-de-France.
        </p>
      </div>

      {/* Action buttons */}
      <div className="px-6 pb-10 pt-6 flex flex-col gap-3">
        <button
          onClick={() => navigate('/visiteur')}
          className="w-full py-4 rounded-2xl font-bold text-white text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-between px-6"
          style={{ backgroundColor: '#FF8400', boxShadow: '0 8px 24px rgba(255,132,0,0.3)' }}
        >
          <span>Je suis visiteur</span>
          <ChevronRight size={24} />
        </button>

        <button
          onClick={() => navigate('/gestionnaire')}
          className="w-full py-4 rounded-2xl font-bold text-lg active:scale-95 transition-transform flex items-center justify-between px-6 border-2"
          style={{ color: '#0B0829', borderColor: '#8FA0D8', backgroundColor: '#F9DFC6' }}
        >
          <span>Je suis gestionnaire</span>
          <ChevronRight size={24} />
        </button>

        <button
          onClick={() => navigate('/auditeur')}
          className="w-full py-4 rounded-2xl font-bold text-lg active:scale-95 transition-transform flex items-center justify-between px-6 border-2"
          style={{ color: '#0B0829', borderColor: '#0B0829', backgroundColor: 'white' }}
        >
          <span>Je suis auditeur</span>
          <ChevronRight size={24} />
        </button>

        <p className="text-center text-xs text-gray-400 mt-2">
          AccesSite · Hauts-de-France · Accessibilité pour tous
        </p>
      </div>
    </div>
  );
}
