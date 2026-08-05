import React from 'react';
import { Activity } from 'lucide-react';

const ConfusionGauge = ({ score = 1.0, totalResponses = 0 }) => {
  const clamped = Math.max(1, Math.min(5, score));
  const pct = (clamped - 1) / 4;
  const angle = -90 + pct * 180;

  const getLabel = (v) => {
    if (v <= 1.8) return { text: 'Clear', color: '#10B981' };
    if (v <= 2.8) return { text: 'Mostly clear', color: '#2563EB' };
    if (v <= 3.8) return { text: 'Some confusion', color: '#F59E0B' };
    return { text: 'Struggling', color: '#EF4444' };
  };

  const { text, color } = getLabel(clamped);

  return (
    <div className="glass-card-static" style={{ padding: '22px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ fontWeight: 700, fontSize: '15px', color: '#F1F5F9', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={17} color="#7C3AED" /> Comprehension
        </div>
        <span style={{ fontSize: '12px', color: '#64748B' }}>{totalResponses} {totalResponses === 1 ? 'student' : 'students'}</span>
      </div>

      {/* Gauge SVG */}
      <div style={{ position: 'relative', width: '200px', height: '110px', margin: '0 auto' }}>
        <svg width="200" height="110" viewBox="0 0 200 110">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#10B981" />
              <stop offset="50%"  stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          {/* Track */}
          <path d="M 18 96 A 82 82 0 0 1 182 96" fill="none" stroke="#0E1525" strokeWidth="14" strokeLinecap="round" />
          {/* Active arc */}
          <path d="M 18 96 A 82 82 0 0 1 182 96" fill="none" stroke="url(#gaugeGrad)" strokeWidth="14" strokeLinecap="round" />
          {/* Needle */}
          <g transform={`rotate(${angle}, 100, 96)`} style={{ transition: 'transform 0.6s cubic-bezier(0.34, 1.4, 0.64, 1)' }}>
            <line x1="100" y1="96" x2="100" y2="28" stroke="#F1F5F9" strokeWidth="3" strokeLinecap="round" />
            <circle cx="100" cy="96" r="6" fill="#F1F5F9" />
            <circle cx="100" cy="96" r="3" fill="#070B17" />
          </g>
        </svg>
      </div>

      <div style={{ textAlign: 'center', marginTop: '8px' }}>
        <div style={{ fontSize: '28px', fontWeight: 800, color }}>
          {clamped.toFixed(1)} <span style={{ fontSize: '13px', color: '#4B5563', fontWeight: 400 }}>/ 5</span>
        </div>
        <div style={{ fontSize: '13px', color, fontWeight: 600, marginTop: '4px' }}>{text}</div>
      </div>
    </div>
  );
};

export default ConfusionGauge;
