import React from 'react';

// Define the Button component with inline styles
const Button = ({ children, type = 'button', onClick, disabled, className = '' }) => {
  const buttonStyle = {
    padding: '10px 15px',
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    opacity: disabled ? 0.7 : 1,
    transition: 'background-color 0.3s'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={buttonStyle}
    >
      {children}
    </button>
  );
};

// Export the Button component as default
export default Button;