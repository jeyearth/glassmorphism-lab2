import { create } from 'zustand';

export type PatternType = 'stripe' | 'checkerboard' | 'sine';

interface BackgroundState {
  pattern: PatternType;
  spatialFrequency: number; // パターンの細かさ (px)
  scrollSpeed: number; // スクロール速度 (0-10)
  isAutoScroll: boolean; // 自動スクロールのON/OFF
}

interface GlassMorphismState {
  blurStrength: number; // px
  opacity: number; // 0.0 - 1.0
  borderOpacity: number; // 0.0 - 1.0
  width: number; // px
  height: number; // px
  borderRadius: number; // px
  positionX: number; // %
  positionY: number; // %
}

interface GlassStore {
  background: BackgroundState;
  glassMorphism: GlassMorphismState;
  
  // Background actions
  setPattern: (pattern: PatternType) => void;
  setSpatialFrequency: (frequency: number) => void;
  setScrollSpeed: (speed: number) => void;
  setAutoScroll: (enabled: boolean) => void;
  
  // GlassMorphism actions
  setBlurStrength: (blur: number) => void;
  setOpacity: (opacity: number) => void;
  setBorderOpacity: (opacity: number) => void;
  setGlassSize: (width: number, height: number) => void;
  setBorderRadius: (radius: number) => void;
  setGlassPosition: (x: number, y: number) => void;
}

export const useGlassStore = create<GlassStore>((set) => ({
  background: {
    pattern: 'stripe',
    spatialFrequency: 50,
    scrollSpeed: 1,
    isAutoScroll: true,
  },
  
  glassMorphism: {
    blurStrength: 10,
    opacity: 0.3,
    borderOpacity: 0.2,
    width: 300,
    height: 200,
    borderRadius: 20,
    positionX: 50,
    positionY: 50,
  },
  
  // Background actions
  setPattern: (pattern) =>
    set((state) => ({
      background: { ...state.background, pattern },
    })),
  
  setSpatialFrequency: (frequency) =>
    set((state) => ({
      background: { ...state.background, spatialFrequency: frequency },
    })),
  
  setScrollSpeed: (speed) =>
    set((state) => ({
      background: { ...state.background, scrollSpeed: speed },
    })),
  
  setAutoScroll: (enabled) =>
    set((state) => ({
      background: { ...state.background, isAutoScroll: enabled },
    })),
  
  // GlassMorphism actions
  setBlurStrength: (blur) =>
    set((state) => ({
      glassMorphism: { ...state.glassMorphism, blurStrength: blur },
    })),
  
  setOpacity: (opacity) =>
    set((state) => ({
      glassMorphism: { ...state.glassMorphism, opacity },
    })),
  
  setBorderOpacity: (opacity) =>
    set((state) => ({
      glassMorphism: { ...state.glassMorphism, borderOpacity: opacity },
    })),
  
  setGlassSize: (width, height) =>
    set((state) => ({
      glassMorphism: { ...state.glassMorphism, width, height },
    })),
  
  setBorderRadius: (radius) =>
    set((state) => ({
      glassMorphism: { ...state.glassMorphism, borderRadius: radius },
    })),
  
  setGlassPosition: (x, y) =>
    set((state) => ({
      glassMorphism: { ...state.glassMorphism, positionX: x, positionY: y },
    })),
}));
