"use client";

import { motion } from "framer-motion";
import { Crown } from "lucide-react";

export const SquishyCard = ({ onBuy }: { onBuy: () => void }) => {
  return (
    <section className="bg-background px-4 py-8">
      <div className="mx-auto w-fit">
        <Card onBuy={onBuy} />
      </div>
    </section>
  );
};

const Card = ({ onBuy }: { onBuy: () => void }) => {
  return (
    <motion.div
      whileHover="hover"
      transition={{ duration: 1, ease: "backInOut" }}
      variants={{ hover: { scale: 1.03 } }}
      className="relative h-80 w-72 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary to-secondary p-6"
    >
      <div className="relative z-10 text-white">
        <div className="flex items-center justify-between">
          <span className="block w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-light text-white">
            Lifetime Access
          </span>
          <Crown className="h-5 w-5 text-yellow-300" />
        </div>
        
        <motion.div
          initial={{ scale: 0.85 }}
          variants={{ hover: { scale: 1 } }}
          transition={{ duration: 1, ease: "backInOut" }}
          className="my-4"
        >
          <span className="block font-mono text-5xl font-black leading-[1.2]">
            $30
          </span>
          <p className="mt-2 text-sm opacity-90">One-time payment</p>
        </motion.div>
        
        <ul className="space-y-1.5 text-sm">
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>Unlimited usage</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>All output formats</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>Priority processing</span>
          </li>
        </ul>
      </div>
      
      <button
        onClick={onBuy}
        className="absolute bottom-4 left-4 right-4 z-20 rounded-lg border-2 border-white bg-white py-2.5 text-center font-semibold uppercase text-neutral-800 backdrop-blur transition-colors hover:bg-white/90"
      >
        Get Lifetime Access
      </button>
      
      <Background />
    </motion.div>
  );
};

const Background = () => {
  return (
    <motion.svg
      width="288"
      height="320"
      viewBox="0 0 288 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 z-0"
      variants={{ hover: { scale: 1.3 } }}
      transition={{ duration: 1, ease: "backInOut" }}
    >
      <motion.circle
        variants={{ hover: { scaleY: 0.5, y: -25 } }}
        transition={{ duration: 1, ease: "backInOut", delay: 0.2 }}
        cx="144"
        cy="100"
        r="80"
        fill="rgba(255,255,255,0.1)"
      />
      <motion.ellipse
        variants={{ hover: { scaleY: 2.25, y: -25 } }}
        transition={{ duration: 1, ease: "backInOut", delay: 0.2 }}
        cx="144"
        cy="220"
        rx="80"
        ry="35"
        fill="rgba(255,255,255,0.1)"
      />
    </motion.svg>
  );
};

const CheckIcon = () => (
  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);