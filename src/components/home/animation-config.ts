export interface CardAnimationConfig {
  activeScale: number;
  stackedScale: number;
  zOffset: number;
  zScaleReduction: number;
  activeShadow: string;
  stackedShadow: string;
  blurAmount: number;
  transitionDuration: number;
  springStiffness: number;
  springDamping: number;
  entranceY: number;
  entranceOpacity: number;
  borderRadius: number;
}

export const defaultAnimationConfig: CardAnimationConfig = {
  activeScale: 1,
  stackedScale: 0.85,
  zOffset: -100,
  zScaleReduction: 0.05,
  activeShadow: "var(--card-shadow-active)",
  stackedShadow: "var(--card-shadow-stacked)",
  blurAmount: 0,
  transitionDuration: 0.5,
  entranceY: 0,
  entranceOpacity: 0,
  borderRadius: 24,
  springStiffness: 100,
  springDamping: 30,
};

export const reducedMotionConfig: CardAnimationConfig = {
  ...defaultAnimationConfig,
  stackedScale: 1,
  zOffset: 0,
  zScaleReduction: 0,
  blurAmount: 0,
  transitionDuration: 0.01,
  entranceY: 0,
};
