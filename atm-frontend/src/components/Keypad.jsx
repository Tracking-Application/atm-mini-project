import React from 'react';
import { Delete } from 'lucide-react';

const Keypad = ({ onKeyPress, onDelete, onClear }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Clear', '0'];

  return (
    <div className="keypad">
      {keys.map((key) => (
        <div
          key={key}
          className={`key glass-interactive ${key === 'Clear' ? 'special' : ''}`}
          onClick={() => (key === 'Clear' ? onClear() : onKeyPress(key))}
        >
          {key}
        </div>
      ))}
      <div className="key glass-interactive special" onClick={onDelete}>
        <Delete size={24} />
      </div>
    </div>
  );
};

export default Keypad;
