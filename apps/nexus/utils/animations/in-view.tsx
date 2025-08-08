export const list = {
  hidden: {
    opacity: 0,
    transition: {
      when: `afterChildren`,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

export const item = {
  hidden: {
    background: `#C0CAF5`,
    filter: `blur(8px)`,
    opacity: 0,
    rotateZ: 10,
    y: 100,
  },
  visible: { filter: `blur(0px)`, opacity: 1, rotateZ: 0, y: 0 },
};
