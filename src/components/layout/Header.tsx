"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/lib/theme/toggle";
import { navigationLinks } from "@/data/config";

const MOBILE_MENU_ID = "site-mobile-menu";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Map navigation links to numbered format
  const numberedLinks = [
    { num: "01", ...navigationLinks[0] }, // Home
    { num: "02", ...navigationLinks[1] }, // Blog
    { num: "03", ...navigationLinks[2] }, // Work
    { num: "04", ...navigationLinks[3] }, // Photos (external)
  ];

  return (
    <header className="sticky top-0 z-50 border-b-4 border-foreground bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Using Nippo font */}
          <Link 
            href="/" 
            className="font-nippo text-2xl font-bold"
          >
            [ AJ ]
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {numberedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1 font-mono text-sm font-bold uppercase tracking-wide link-foreground hover:text-accent transition-colors"
              >
                <span className="text-accent">{link.num}.</span>
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right side: Theme toggle (visible on all screens) + Mobile menu button */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center brutalist-border hover:bg-accent transition-colors md:hidden"
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
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Fixed position overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id={MOBILE_MENU_ID}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden fixed top-[64px] left-0 right-0 border-b-4 border-foreground bg-background/95 backdrop-blur-sm z-40"
          >
            <div className="px-4 py-6 space-y-4 max-w-7xl mx-auto">
              {numberedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 font-mono text-base font-bold uppercase link-foreground hover:text-accent transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="text-accent">{link.num}.</span>
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
