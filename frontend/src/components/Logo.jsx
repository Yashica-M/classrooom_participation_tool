import React from 'react';

const Logo = ({ size = 32, showText = true, textStyle = {} }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="syncPollLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="28" fill="url(#syncPollLogoGrad)" />
        <path d="M30 65V55M43 72V40M57 72V28M70 65V50" stroke="white" strokeWidth="8" strokeLinecap="round" />
        <circle cx="57" cy="22" r="5" fill="#22D3EE" />
      </svg>
      {showText && (
        <span style={{ fontSize: '20px', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.3px', ...textStyle }}>
          Sync<span style={{ color: '#22D3EE' }}>Poll</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
