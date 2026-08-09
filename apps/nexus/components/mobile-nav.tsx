"use client";

import { AnimatePresence, motion } from "motion/react";
import { ReactNode, useEffect, useRef, useState } from "react";

export const MobileNav = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onResize = () => window.innerWidth > 640 && setOpen(false);
    globalThis.addEventListener(`resize`, onResize);
    return () => globalThis.removeEventListener(`resize`, onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? `hidden` : ``;
    return () => {
      document.body.style.overflow = ``;
    };
  }, [open]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;

    const handleNavClick = (event: globalThis.MouseEvent) => {
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest(`a`);
      if (!link) return;

      const href = link.getAttribute(`href`) ?? `/`;
      setOpen(false);

      if (href.startsWith(`#`)) {
        event.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: `smooth` });
      }
    };

    nav.addEventListener(`click`, handleNavClick);
    return () => nav.removeEventListener(`click`, handleNavClick);
  }, [open]);

  return (
    <>
      <button
        aria-label={open ? `Close navigation menu` : `Open navigation menu`}
        aria-expanded={open}
        className="bg-tns-black z-50 flex size-10 items-center justify-center rounded-full border-2 hover:cursor-pointer focus:ring sm:hidden"
        onClick={() => setOpen(!open)}
      >
        <motion.span
          animate={{
            borderColor: open ? `var(--tns-red)` : `var(--tns-green)`,
            borderRadius: open ? `100%` : `25%`,
          }}
          className="size-4 border-2"
          initial={{
            borderColor: open ? `var(--tns-red)` : `var(--tns-green)`,
            borderRadius: open ? `100%` : `25%`,
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            animate={{ opacity: 1 }}
            className="bg-tns-black/50 fixed inset-0 z-40 bg-clip-content backdrop-blur-sm backdrop-brightness-50"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="nav"
          >
            <nav className="flex flex-col gap-4 px-4 pt-18" ref={navRef}>
              <div className="w-full rounded-full border" />
              {children}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
