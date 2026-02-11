"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`relative flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 w-full max-w-4xl 
          ${isScrolled || isMenuOpen ? "glass shadow-sm bg-surface/80" : "bg-transparent"}
        `}
      >
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-2.5">
          <div className="h-4 w-4 rounded-full bg-primary shadow-lg shadow-primary/30" />
          Novalens
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium opacity-80">
          <Link href="#tool" className="hover:text-primary hover:opacity-100 transition-colors">Tool</Link>
          <Link href="#features" className="hover:text-primary hover:opacity-100 transition-colors">Features</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-1 opacity-70 hover:opacity-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-4 right-4 p-4 rounded-2xl glass bg-surface shadow-xl md:hidden flex flex-col gap-2 text-center"
          >
            <Link
              href="#tool"
              className="py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Tool
            </Link>
            <Link
              href="#features"
              className="py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}