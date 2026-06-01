import React, { useState } from 'react';
import { Eye, Ear, Brain, Accessibility, HandMetal, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AccessibilityMode {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const modes: AccessibilityMode[] = [
  { id: 'moteur', label: 'Moteur', icon: <Accessibility size={16} />, color: '#FF8400' },
  { id: 'vision', label: 'Vision', icon: <Eye size={16} />, color: '#8FA0D8' },
  { id: 'auditif', label: 'Auditif', icon: <Ear size={16} />, color: '#22C55E' },
  { id: 'cognitif', label: 'Cognitif', icon: <Brain size={16} />, color: '#EAB308' },
  { id: 'lsf', label: 'LSF', icon: <HandMetal size={16} />, color: '#EF4444' },
  { id: 'autres', label: 'Autres', icon: <Zap size={16} />, color: '#8B5CF6' },
];

interface AccessibilityBarProps {
  onModeChange?: (modeId: string | null) => void;
}

export default function AccessibilityBar({ onModeChange }: AccessibilityBarProps) {
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const { c } = useTheme();

  const handleModeClick = (modeId: string) => {
    const newMode = activeMode === modeId ? null : modeId;
    setActiveMode(newMode);
    onModeChange?.(newMode);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {modes.map((mode) => {
        const isActive = activeMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => handleModeClick(mode.id)}
            className="flex flex-col items-center gap-1 flex-shrink-0 transition-all"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{
                backgroundColor: isActive ? mode.color : c.bgSurface,
                color: isActive ? 'white' : c.textMuted,
                boxShadow: isActive ? `0 4px 12px ${mode.color}40` : 'none',
              }}
            >
              {mode.icon}
            </div>
            <span
              className="text-[10px] font-medium"
              style={{ color: isActive ? mode.color : c.textMuted }}
            >
              {mode.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
