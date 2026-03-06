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

  // パターンB用: スムーズ線形補間状態
  const smoothBlurRef = useRef(glassMorphism.blurStrength);
  const smoothOpacityRef = useRef(glassMorphism.opacity);
  const [smoothBlur, setSmoothBlur] = useState(glassMorphism.blurStrength);
  const [smoothOpacity, setSmoothOpacity] = useState(glassMorphism.opacity);

  // 手動スクロール速度の計測
  const lastScrollOffsetRef = useRef(0);
  const lastScrollTimeRef = useRef(Date.now());
  const [manualVelocity, setManualVelocity] = useState(0);

  // ホイールスクロール中かどうか
  const isWheelScrollingRef = useRef(false);
  const wheelTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!background.isAutoScroll || background.scrollSpeed === 0 || isDragging) return;

    let animationFrameId: number;
    let lastTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      setScrollOffset((prev) => prev + background.scrollSpeed * (deltaTime / 16));

      // パターンB: 線形補間によるスムーズ遷移（自動スクロール時）
      if (glassMorphism.scrollVariationMode === 'binary') {
        const isScrolling = background.scrollSpeed > 0;
        const tBlur = isScrolling ? glassMorphism.targetBlurStrength : glassMorphism.blurStrength;
        const tOpacity = isScrolling ? glassMorphism.targetOpacity : glassMorphism.opacity;
        const factor = 1 - Math.exp(-deltaTime / 200);
        smoothBlurRef.current += (tBlur - smoothBlurRef.current) * factor;
        smoothOpacityRef.current += (tOpacity - smoothOpacityRef.current) * factor;
        setSmoothBlur(smoothBlurRef.current);
        setSmoothOpacity(smoothOpacityRef.current);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [background.scrollSpeed, background.isAutoScroll, glassMorphism.scrollVariationMode, glassMorphism.targetBlurStrength, glassMorphism.targetOpacity, glassMorphism.blurStrength, glassMorphism.opacity, isDragging]);

  useEffect(() => {
    if (background.isAutoScroll || glassMorphism.scrollVariationMode !== 'binary') return;

    let animationFrameId: number;
    let lastTime = Date.now();

    const lerp = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const isScrolling = isDraggingRef.current || isWheelScrollingRef.current;
      const tBlur = isScrolling ? glassMorphism.targetBlurStrength : glassMorphism.blurStrength;
      const tOpacity = isScrolling ? glassMorphism.targetOpacity : glassMorphism.opacity;
      const factor = 1 - Math.exp(-deltaTime / 200);
      smoothBlurRef.current += (tBlur - smoothBlurRef.current) * factor;
      smoothOpacityRef.current += (tOpacity - smoothOpacityRef.current) * factor;
      setSmoothBlur(smoothBlurRef.current);
      setSmoothOpacity(smoothOpacityRef.current);

      animationFrameId = requestAnimationFrame(lerp);
    };

    animationFrameId = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(animationFrameId);
  }, [background.isAutoScroll, glassMorphism.scrollVariationMode, glassMorphism.targetBlurStrength, glassMorphism.targetOpacity, glassMorphism.blurStrength, glassMorphism.opacity]);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  useEffect(() => {
    if (background.isAutoScroll) return;
    const now = Date.now();
    const dt = Math.max(now - lastScrollTimeRef.current, 1);
    const velocity = Math.abs(scrollOffset - lastScrollOffsetRef.current) / dt * 1000; // px/s
    setManualVelocity(velocity);
    lastScrollOffsetRef.current = scrollOffset;
    lastScrollTimeRef.current = now;
  }, [scrollOffset, background.isAutoScroll]);

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
    isWheelScrollingRef.current = true;
    clearTimeout(wheelTimeoutRef.current);
    wheelTimeoutRef.current = setTimeout(() => {
      isWheelScrollingRef.current = false;
    }, 300);
  };

  const getEffectiveValues = () => {
    switch (glassMorphism.scrollVariationMode) {
      case 'proportional': {
        const autoVelocity = background.scrollSpeed * (1000 / 16); // px/s換算
        const currentVelocity = background.isAutoScroll ? autoVelocity : manualVelocity;
        const t = Math.min(currentVelocity / glassMorphism.maxProportionalSpeed, 1);

        return {
          blur: glassMorphism.blurStrength + (glassMorphism.targetBlurStrength - glassMorphism.blurStrength) * t,
          opacity: glassMorphism.opacity + (glassMorphism.targetOpacity - glassMorphism.opacity) * t,
        };
      }
      case 'binary':
        return { blur: smoothBlur, opacity: smoothOpacity };
      default:
        return { blur: glassMorphism.blurStrength, opacity: glassMorphism.opacity };
    }
  };
  const { blur: displayBlur, opacity: displayOpacity } = getEffectiveValues();

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
              backdropFilter: `blur(${displayBlur}px)`,
              WebkitBackdropFilter: `blur(${displayBlur}px)`,
              backgroundColor: `rgba(255, 255, 255, ${displayOpacity})`,
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
