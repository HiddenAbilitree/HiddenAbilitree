import { useEffect, useState } from 'react';

export const useIsReady = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, [setIsReady]);

  return isReady;
};
