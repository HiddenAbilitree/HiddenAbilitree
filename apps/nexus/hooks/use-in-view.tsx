import { useInView } from 'motion/react';
import { RefObject } from 'react';

export const useIsCentered = (container: RefObject<Element | null>) =>
  useInView(container, {
    margin: '-20% 0px -10% 0px',
  });
