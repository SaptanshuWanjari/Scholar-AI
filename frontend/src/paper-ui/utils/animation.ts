export const paperTransitions = {
  spring: {
    type: 'spring',
    stiffness: 400,
    damping: 25,
  },
  bounce: {
    type: 'spring',
    stiffness: 400,
    damping: 15,
  },
  ease: {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.2,
  },
} as const

export const paperVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  slideUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  },
} as const
