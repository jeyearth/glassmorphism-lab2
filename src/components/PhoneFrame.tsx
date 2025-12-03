import React from 'react';

interface PhoneFrameProps {
  children?: React.ReactNode;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  // iPhone 14 Pro のサイズを参考 (393 x 852 px)
  return (
    <div className="relative">
      {/* Phone outer frame */}
      <div 
        className="relative bg-gray-900 rounded-[3rem] shadow-2xl border-[14px] border-gray-900"
        style={{
          width: '393px',
          height: '852px',
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-8 bg-gray-900 rounded-b-3xl z-10"></div>
        
        {/* Screen */}
        <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
          {children}
        </div>
        
        {/* Power button */}
        <div className="absolute right-[-16px] top-[200px] w-1 h-20 bg-gray-800 rounded-r"></div>
        
        {/* Volume buttons */}
        <div className="absolute left-[-16px] top-[150px] w-1 h-12 bg-gray-800 rounded-l"></div>
        <div className="absolute left-[-16px] top-[180px] w-1 h-12 bg-gray-800 rounded-l"></div>
      </div>
    </div>
  );
};

export default PhoneFrame;
