import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Role = 'gestionnaire' | 'auditeur';

const roleConfig: Record<Role, {
  label: string;
  sublabel: string;
  color: string;
  bg: string;
  hint: string;
  emailHint: string;
  passwordHint: string;
}> = {
  gestionnaire: {
    label: 'Espace Gestionnaire',
    sublabel: 'Accès réservé aux lieux partenaires AccesSite',
    color: '#8FA0D8',
    bg: '#F9DFC6',
    hint: 'Votre accès vous a été envoyé par AccesSite à la signature du partenariat.',
    emailHint: 'jean-pierre@musee-beaux-arts.fr',
    passwordHint: 'AccesSite2024',
  },
  auditeur: {
    label: 'Espace Auditeur',
    sublabel: 'Accès réservé à l\'équipe AccesSite',
    color: '#0B0829',
    bg: '#0B0829',
    hint: 'Compte créé par l\'administrateur AccesSite.',
    emailHint: 'sara@accessite.fr',
    passwordHint: 'Audit2024',
  },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = (searchParams.get('role') as Role) || 'gestionnaire';
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const config = roleConfig[role];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 600)); // simulate network

    const ok = login(email, password, role);
    setLoading(false);

    if (ok) {
      navigate(`/${role}`);
    } else {
      setError('Identifiants incorrects. Vérifiez votre email et votre mot de passe.');
    }
  };

  const isAuditeur = role === 'auditeur';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: isAuditeur ? '#0B0829' : '#F9DFC6' }}>
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-6">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-full"
          style={{ backgroundColor: isAuditeur ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)' }}
        >
          <ArrowLeft size={22} color={isAuditeur ? 'white' : '#0B0829'} />
        </button>
      </div>

      {/* Top section */}
      <div className="px-6 pb-8">
        {/* Logo badge */}
        <div className="mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: isAuditeur ? 'rgba(255,255,255,0.1)' : 'white' }}
          >
            <Lock size={28} color={isAuditeur ? 'white' : '#0B0829'} />
          </div>
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-1"
            style={{ color: isAuditeur ? '#8FA0D8' : '#FF8400' }}
          >
            AccesSite
          </p>
          <h1
            className="text-2xl font-bold leading-tight"
            style={{ color: isAuditeur ? 'white' : '#0B0829' }}
          >
            {config.label}
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: isAuditeur ? 'rgba(255,255,255,0.55)' : '#6B7280' }}
          >
            {config.sublabel}
          </p>
        </div>
      </div>

      {/* Form card */}
      <div
        className="flex-1 rounded-t-3xl px-6 pt-8 pb-10"
        style={{ backgroundColor: 'white' }}
      >
        <h2 className="text-xl font-bold mb-1" style={{ color: '#0B0829' }}>
          Connexion
        </h2>
        <p className="text-sm text-gray-400 mb-6">{config.hint}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
              Email professionnel
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder={config.emailHint}
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm outline-none transition-all"
                style={{
                  borderColor: error ? '#EF4444' : '#E5E7EB',
                  backgroundColor: '#F9FAFB',
                }}
                onFocus={e => e.target.style.borderColor = '#FF8400'}
                onBlur={e => e.target.style.borderColor = error ? '#EF4444' : '#E5E7EB'}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
              Mot de passe
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-12 py-3.5 rounded-xl border text-sm outline-none transition-all"
                style={{
                  borderColor: error ? '#EF4444' : '#E5E7EB',
                  backgroundColor: '#F9FAFB',
                }}
                onFocus={e => e.target.style.borderColor = '#FF8400'}
                onBlur={e => e.target.style.borderColor = error ? '#EF4444' : '#E5E7EB'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-start gap-2 px-4 py-3 rounded-xl text-sm"
              style={{ backgroundColor: '#FEF2F2', color: '#EF4444' }}
            >
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Forgot password */}
          <button
            type="button"
            className="text-sm text-right"
            style={{ color: '#FF8400' }}
          >
            Mot de passe oublié ?
          </button>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-white text-base mt-2 active:scale-95 transition-all disabled:opacity-70"
            style={{
              backgroundColor: '#FF8400',
              boxShadow: '0 8px 24px rgba(255,132,0,0.3)',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Connexion…
              </span>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        {/* Hint */}
        <div className="mt-8 px-4 py-3 rounded-xl" style={{ backgroundColor: '#F9DFC6' }}>
          <p className="text-xs text-gray-600 leading-relaxed">
            <span className="font-semibold">Pas encore de compte ?</span> Contactez AccesSite à{' '}
            <span style={{ color: '#FF8400' }}>contact@accessite.fr</span> pour obtenir vos accès.
          </p>
        </div>
      </div>
    </div>
  );
}
