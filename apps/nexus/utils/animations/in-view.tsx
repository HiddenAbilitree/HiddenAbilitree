export const list = {
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
    },
  },
};

export const item = {
  visible: { opacity: 1, y: 0, rotateZ: 0, filter: 'blur(0px)' },
  hidden: {
    opacity: 0,
    y: 100,
    rotateZ: 10,
    background: '#C0CAF5',
    filter: 'blur(8px)',
  },
};
