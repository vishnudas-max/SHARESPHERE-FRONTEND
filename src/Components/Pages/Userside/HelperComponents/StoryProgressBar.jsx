import React, { useState, useEffect } from 'react';

const ProgressBar = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWidth((prevWidth) => {
        if (prevWidth >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevWidth + 1;
      });
    }, 50); // 50ms interval to complete in 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-transparent h-[3px] rounded">
      <div
        className="bg-blue-700 h-[3px] rounded transition-width duration-5000 ease-linear"
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
