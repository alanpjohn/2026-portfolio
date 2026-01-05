export interface CardAnimationConfig {
  activeScale: number
  stackedScale: number
  stackedOffsetY: number
  stackedOffsetYIncrement: number
  activeOpacity: number
  stackedOpacity: number
  activeShadow: string
  stackedShadow: string
  stackedBlur: number
  transitionDuration: number
  entranceY: number
  entranceOpacity: number
}

export const defaultAnimationConfig: CardAnimationConfig = {
  activeScale: 1,
  stackedScale: 0.92,
  stackedOffsetY: -40,
  stackedOffsetYIncrement: -20,
  activeOpacity: 1,
  stackedOpacity: 0.6,
  activeShadow: 'var(--card-shadow-active)',
  stackedShadow: 'var(--card-shadow-stacked)',
  stackedBlur: 2,
  transitionDuration: 0.5,
  entranceY: 100,
  entranceOpacity: 0,
}

export const reducedMotionConfig: CardAnimationConfig = {
  ...defaultAnimationConfig,
  stackedScale: 1,
  stackedOffsetY: 0,
  stackedOffsetYIncrement: 0,
  stackedBlur: 0,
  transitionDuration: 0.01,
  entranceY: 0,
}
