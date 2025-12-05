import React, { useState, useEffect, useRef } from 'react';
import PhoneFrame from './PhoneFrame';
import BackgroundPattern from './BackgroundPattern';
import { useGlassStore } from '../store/useGlassStore';

const PreviewPanel: React.FC = () => {
  const { background, glassMorphism } = useGlassStore();
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartScroll, setDragStartScroll] = useState(0);
  const phoneFrameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!background.isAutoScroll || background.scrollSpeed === 0 || isDragging) return;

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
  }, [background.scrollSpeed, background.isAutoScroll, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (background.isAutoScroll) return;
    setIsDragging(true);
    setDragStartY(e.clientY);
    setDragStartScroll(scrollOffset);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || background.isAutoScroll) return;
    const deltaY = e.clientY - dragStartY;
    setScrollOffset(dragStartScroll - deltaY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (background.isAutoScroll) return;
    e.preventDefault();
    setScrollOffset((prev) => prev + e.deltaY * 0.5);
  };

  return (
    <div className="w-full h-full bg-gray-900 flex items-center justify-center p-8">
      <div
        ref={phoneFrameRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: background.isAutoScroll ? 'default' : isDragging ? 'grabbing' : 'grab' }}
      >
        <PhoneFrame>
          <BackgroundPattern
            pattern={background.pattern}
            spatialFrequency={background.spatialFrequency}
            scrollOffset={scrollOffset}
          />

          {/* グラスモーフィズムUIコンポーネント */}
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
              boxShadow: glassMorphism.isShadowEnabled
                ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                : 'none',
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
    </div>
  );
};

export default PreviewPanel;
