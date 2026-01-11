"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  motion,
  easeOut,
  easeIn,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { ThemeToggle } from "@/lib/theme/toggle";
import { navigationLinks } from "@/data/config";

const MOBILE_MENU_ID = "site-mobile-menu";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState(0);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Animation variants for mobile menu container
  const menuContainerVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: menuHeight,
      opacity: 1,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : {
            height: { duration: 0.3, ease: easeOut },
            opacity: { duration: 0.2 },
          },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : {
            height: { duration: 0.25, ease: easeIn },
            opacity: { duration: 0.15, delay: 0.1 },
          },
    },
  };

  // Animation variants for menu items
  const menuItemVariants = {
    hidden: { x: prefersReducedMotion ? 0 : -20, opacity: 0 },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : {
            delay: 0.2 + i * 0.05, // Start during expansion with 0.2s delay, 0.05s stagger
            duration: 0.2,
            ease: easeOut,
          },
    }),
    exit: {
      x: prefersReducedMotion ? 0 : -20,
      opacity: 0,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : {
            duration: 0.15,
            ease: easeIn,
          },
    },
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  // Measure menu content height when opening
  useEffect(() => {
    if (menuOpen) {
      // Use requestAnimationFrame to ensure DOM is updated
      const animationFrame = requestAnimationFrame(() => {
        if (menuContentRef.current) {
          const height = menuContentRef.current.scrollHeight;
          setMenuHeight(height > 0 ? height : 200); // Fallback to 200px if measurement fails
        }
      });
      return () => cancelAnimationFrame(animationFrame);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMenuHeight(0);
    }
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="fixed top-4 left-4 right-4 z-40 mx-4 rounded-lg border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <span className="text-xl font-logo font-bold">AJ</span>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="link-foreground hover:text-accent transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={MOBILE_MENU_ID}
            onClick={toggleMenu}
          >
            <FontAwesomeIcon
              icon={menuOpen ? faTimes : faBars}
              className="text-lg"
            />
          </button>
          <ThemeToggle />
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id={MOBILE_MENU_ID}
            className="md:hidden bg-background/95 overflow-hidden"
            variants={menuContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ willChange: "height" }}
          >
            <motion.div
              ref={menuContentRef}
              className="container flex flex-col space-y-4 py-6"
            >
              {navigationLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  custom={index}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Link
                    href={link.href}
                    className="block px-4 py-2 text-base font-medium link-foreground hover:text-accent transition-colors duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
