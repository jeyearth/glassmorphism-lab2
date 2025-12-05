import React from 'react';

interface PhoneFrameProps {
  children?: React.ReactNode;
}

const PHONE_FRAME_RATIO = 85;

export const PHONE_FRAME_SIZE = {
  width: (393 / 100) * PHONE_FRAME_RATIO,
  height: (852 / 100) * PHONE_FRAME_RATIO,
} as const;

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="relative">
      <div
        className="relative bg-gray-900 rounded-[3rem] shadow-2xl border-[14px] border-gray-900"
        style={{
          width: `${PHONE_FRAME_SIZE.width}px`,
          height: `${PHONE_FRAME_SIZE.height}px`,
        }}
      >
        <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PhoneFrame;
