'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const scrollToCenter = () => {
  const hash = globalThis.location.hash.slice(1);
  if (!hash) return;

  const element = document.querySelector(`#${CSS.escape(hash)}`);
  if (!element) return;

  const elementRect = element.getBoundingClientRect();
  const elementCenter = elementRect.top + elementRect.height / 2;
  const viewportCenter = window.innerHeight / 2;
  const scrollTarget = window.scrollY + elementCenter - viewportCenter;

  window.scrollTo({ top: scrollTarget });
};

export const HashScrollCenter = () => {
  const pathname = usePathname();

  useEffect(() => {
    scrollToCenter();
    globalThis.addEventListener(`hashchange`, scrollToCenter);
    return () => globalThis.removeEventListener(`hashchange`, scrollToCenter);
  }, [pathname]);

  return <></>;
};
