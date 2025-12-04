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
        {/* Screen */}
        <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PhoneFrame;
