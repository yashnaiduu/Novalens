"use client";

import { motion } from "framer-motion";
import { SquishyCard } from "@/components/squishy-card";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Great to try the tool",
    features: ["4 images/day", "PNG output", "Standard model"],
    cta: "Get started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9/mo",
    description: "For creators and sellers",
    features: ["Unlimited images", "PNG/JPG/WebP", "Alpha matting", "Priority engine"],
    cta: "Go Pro",
    popular: true,
  },
  {
    name: "Team",
    price: "$39/mo",
    description: "Small teams & startups",
    features: ["3 seats", "Usage analytics", "Priority support"],
    cta: "Start team",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Pricing</h2>
        <p className="mt-2 opacity-80">Simple, transparent plans that scale with you.</p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ y: 12, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: idx * 0.05 }}
            className={`glass rounded-2xl p-6 soft-shadow border ${
              plan.popular ? "border-[--primary]/40" : "border-white/10"
            }`}
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              {plan.popular && (
                <span className="rounded-full border border-[--primary]/30 bg-[--primary]/10 px-3 py-1 text-xs text-[--foreground]">
                  Most popular
                </span>
              )}
            </div>
            <div className="mt-3 text-3xl font-bold">{plan.price}</div>
            <p className="mt-1 text-sm opacity-80">{plan.description}</p>
            <ul className="mt-5 space-y-2 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="opacity-90">• {f}</li>
              ))}
            </ul>
            <a
              href="#tool"
              className={`mt-6 inline-block rounded-xl px-5 py-2 text-sm font-medium transition ${
                plan.popular
                  ? "gradient-border text-[--foreground]"
                  : "border hover:bg-white/5"
              }`}
            >
              <span className="relative z-10 block rounded-[calc(theme(borderRadius.xl)-2px)] bg-[--surface] px-5 py-2">
                {plan.cta}
              </span>
            </a>
          </motion.div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <SquishyCard onBuy={() => alert("Redirect to payment provider for $30 one-time.")} />
      </div>
    </section>
  );
}
