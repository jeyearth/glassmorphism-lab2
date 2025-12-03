import React, { useState, useEffect } from 'react';
import PhoneFrame from './PhoneFrame';
import BackgroundPattern from './BackgroundPattern';
import { useGlassStore } from '../store/useGlassStore';

const PreviewPanel: React.FC = () => {
  const { background, glassMorphism } = useGlassStore();
  const [scrollOffset, setScrollOffset] = useState(0);

  // 自動スクロールアニメーション
  useEffect(() => {
    if (!background.isAutoScroll || background.scrollSpeed === 0) return;

    let animationFrameId: number;
    let lastTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      setScrollOffset((prev) => prev + background.scrollSpeed * (deltaTime / 16));
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [background.scrollSpeed, background.isAutoScroll]);

  return (
    <div className="w-full h-full bg-gray-900 flex items-center justify-center p-8">

      <PhoneFrame>
        {/* 背景パターン */}
        <BackgroundPattern
          pattern={background.pattern}
          spatialFrequency={background.spatialFrequency}
          scrollOffset={scrollOffset}
        />

        {/* グラスモーフィズムUI */}
        <div
          className="absolute"
          style={{
            width: `${glassMorphism.width}px`,
            height: `${glassMorphism.height}px`,
            left: `${glassMorphism.positionX}%`,
            top: `${glassMorphism.positionY}%`,
            transform: 'translate(-50%, -50%)',
            backdropFilter: `blur(${glassMorphism.blurStrength}px)`,
            backgroundColor: `rgba(255, 255, 255, ${glassMorphism.opacity})`,
            borderRadius: `${glassMorphism.borderRadius}px`,
            border: `1px solid rgba(255, 255, 255, ${glassMorphism.borderOpacity})`,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          <div className="w-full h-full flex items-center justify-center p-6">
            <div className="text-center">
              <h3 className="text-gray-800 text-lg font-bold mb-2">Glass UI</h3>
              <p className="text-gray-600 text-sm">グラスモーフィズム</p>
            </div>
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
};

export default PreviewPanel;
