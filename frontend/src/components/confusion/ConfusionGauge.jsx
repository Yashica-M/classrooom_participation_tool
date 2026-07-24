import React from 'react';

const ConfusionGauge = ({ score = 1.0, totalResponses = 0 }) => {
  const clampedScore = Math.max(1, Math.min(5, score));
  const percentage = (clampedScore - 1) / 4;
  const angle = -90 + percentage * 180;

  let statusText = 'Clear';
  let gaugeColor = '#14B8A6';

  if (clampedScore > 3.8) {
    statusText = 'High Confusion!';
    gaugeColor = '#EF4444';
  } else if (clampedScore > 2.8) {
    statusText = 'Moderate Confusion';
    gaugeColor = '#F59E0B';
  } else if (clampedScore > 1.8) {
    statusText = 'Mostly Clear';
    gaugeColor = '#3B82F6';
  }

  return (
    <div style={{
      background: '#0F172A',
      borderRadius: '12px',
      padding: '24px',
      color: '#F1F5F9',
      textAlign: 'center',
      border: '1px solid #1E293B'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#F1F5F9' }}>
          ⚡ Confusion Speedometer Gauge
        </h3>
        <span style={{
          background: '#020617',
          border: '1px solid #1E293B',
          padding: '4px 10px',
          borderRadius: '16px',
          fontSize: '12px',
          color: '#14B8A6',
          fontWeight: 600
        }}>
          {totalResponses} {totalResponses === 1 ? 'student' : 'students'} active
        </span>
      </div>

      {/* SVG Gauge */}
      <div style={{ position: 'relative', width: '220px', height: '130px', margin: '0 auto' }}>
        <svg width="220" height="130" viewBox="0 0 200 120">
          <defs>
            <linearGradient id="gaugeGradientZen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14B8A6" />
              <stop offset="40%" stopColor="#3B82F6" />
              <stop offset="75%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>

          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1E293B"
            strokeWidth="16"
            strokeLinecap="round"
          />

          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradientZen)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          <circle cx="100" cy="100" r="10" fill="#F1F5F9" />
          <circle cx="100" cy="100" r="6" fill="#0F172A" />

          <g transform={`rotate(${angle}, 100, 100)`} style={{ transition: 'transform 0.5s ease-out' }}>
            <line x1="100" y1="100" x2="100" y2="30" stroke="#F1F5F9" strokeWidth="4" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      <div style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '32px', fontWeight: 800, color: gaugeColor, lineHeight: 1 }}>
          {clampedScore.toFixed(2)} <span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 400 }}>/ 5.0</span>
        </div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#94A3B8', marginTop: '6px' }}>
          {statusText}
        </div>
      </div>
    </div>
  );
};

export default ConfusionGauge;
