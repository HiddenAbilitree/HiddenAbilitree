import { useEffect, useState } from 'react';

export const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, [setWindowWidth]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    globalThis.addEventListener(`resize`, handleResize);

    return () => {
      globalThis.removeEventListener(`resize`, handleResize);
    };
  });

  return windowWidth;
};
