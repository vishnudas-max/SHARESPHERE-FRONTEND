// Loading.js
import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen absolute top-0 w-screen backdrop-blur-md bg-black/90 z-50">
      <div className='flex-col justify-center items-center '>
        <div className="size-7 border-4 border-dashed rounded-full animate-spin border-blue-500 mt-3"></div>
      </div>

    </div>
  );
};

export default Loading;
