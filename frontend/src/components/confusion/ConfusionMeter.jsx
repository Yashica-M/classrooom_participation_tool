import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './ConfusionMeter.css';

const ConfusionMeter = ({ sessionId, onSubmitConfusion }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const confusionLevels = [
    { level: 1, label: 'Clear', color: '#4caf50' },
    { level: 2, label: 'Mostly Clear', color: '#8bc34a' },
    { level: 3, label: 'Somewhat Confused', color: '#ffc107' },
    { level: 4, label: 'Confused', color: '#ff9800' },
    { level: 5, label: 'Very Confused', color: '#f44336' }
  ];

  const handleConfusionSubmit = async (level) => {
    if (!user) return;
    
    setSelectedLevel(level);
    setIsSubmitting(true);
    
    try {
      await onSubmitConfusion({
        level,
        sessionId,
        userId: user.id,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error submitting confusion level:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <p>Please log in to use the confusion meter.</p>;
  }

  return (
    <div className="confusion-meter">
      <h3>How well are you understanding the material?</h3>
      <p className="confusion-instructions">Select your current understanding level:</p>
      
      <div className="confusion-buttons">
        {confusionLevels.map(({ level, label, color }) => (
          <button
            key={level}
            onClick={() => handleConfusionSubmit(level)}
            disabled={isSubmitting}
            className={`confusion-level-button ${selectedLevel === level ? 'selected' : ''}`}
            style={{ 
              backgroundColor: color,
              opacity: selectedLevel === level ? 1 : 0.7
            }}
          >
            {label}
          </button>
        ))}
      </div>
      
      {selectedLevel && (
        <p className="confusion-feedback">
          Your response has been recorded. You can update it at any time.
        </p>
      )}
    </div>
  );
};

export default ConfusionMeter;