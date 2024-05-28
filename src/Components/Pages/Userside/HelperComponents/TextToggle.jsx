import React, { useState } from 'react';

const TextToggle = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const firstFiveWords = text.split(' ').slice(0, 5).join(' ');

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className='px-3 md:text-xs text-[11px] max-w-full'>
      <p className="inline">
        {isExpanded ? text : `${firstFiveWords}...`}
      </p>
      <button 
        onClick={toggleText} 
        className="text-blue-500 hover:text-blue-700 ml-2"
      >
        {isExpanded ? 'show less' : 'more'}
      </button>
    </div>
  );
};

export default TextToggle;
