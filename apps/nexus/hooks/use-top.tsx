import { useEffect, useState } from 'react';

export const useIsTop = () => {
  const [isTop, setIsTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    globalThis.addEventListener('scroll', handleScroll);

    return () => {
      globalThis.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return isTop;
};
