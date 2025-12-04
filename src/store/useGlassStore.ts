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
  isShadowEnabled: boolean; // ドロップシャドウのON/OFF
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
  setShadowEnabled: (isEnabled: boolean) => void;
  
  // Reset actions
  resetAll: () => void;
  resetBackground: () => void;
  resetGlassMorphism: () => void;
}

// デフォルト値を定数として定義
const DEFAULT_BACKGROUND: BackgroundState = {
  pattern: 'stripe',
  spatialFrequency: 50,
  scrollSpeed: 1,
  isAutoScroll: true,
};

const DEFAULT_GLASSMORPHISM: GlassMorphismState = {
  blurStrength: 10,
  opacity: 0.3,
  borderOpacity: 0.0,
  width: 300,
  height: 200,
  borderRadius: 20,
  positionX: 50,
  positionY: 50,
  isShadowEnabled: false,
};

export const useGlassStore = create<GlassStore>((set) => ({
  background: DEFAULT_BACKGROUND,
  glassMorphism: DEFAULT_GLASSMORPHISM,
  
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

  setShadowEnabled: (isEnabled) =>
    set((state) => ({
      glassMorphism: { ...state.glassMorphism, isShadowEnabled: isEnabled },
    })),
  
  // Reset actions
  resetAll: () =>
    set(() => ({
      background: { ...DEFAULT_BACKGROUND },
      glassMorphism: { ...DEFAULT_GLASSMORPHISM },
    })),
  
  resetBackground: () =>
    set((state) => ({
      background: { ...DEFAULT_BACKGROUND },
      glassMorphism: state.glassMorphism,
    })),
  
  resetGlassMorphism: () =>
    set((state) => ({
      background: state.background,
      glassMorphism: { ...DEFAULT_GLASSMORPHISM },
    })),
}));
