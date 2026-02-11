"use client";

import { motion } from "framer-motion";
import {
  Zap,
  FileImage,
  Sparkles,
  Check
} from "lucide-react";
import { UploadTool } from "@/components/upload-tool";

const features = [
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "AI Precision",
    description: "Pixel-perfect edge detection"
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Instant",
    description: "Processed in seconds"
  },
  {
    icon: <FileImage className="h-5 w-5" />,
    title: "HD Quality",
    description: "Full resolution output"
  },
  {
    icon: <Check className="h-5 w-5" />,
    title: "Free",
    description: "No limits or watermarks"
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-primary mb-6">
              Backgrounds, <br className="hidden sm:block" />
              <span className="opacity-40">Gone.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-foreground/60 max-w-lg mx-auto leading-relaxed">
              Upload an image. We handle the rest. <br />
              No sign-up. No cost. Just clean edges.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tool Section */}
      <section id="tool" className="mx-auto max-w-5xl px-4 sm:px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <UploadTool />
        </motion.div>
      </section>

      {/* Minimal Features Grid */}
      <section id="features" className="py-24 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center md:text-left group"
              >
                <div className="mb-4 inline-flex items-center justify-center h-10 w-10 rounded-full bg-surface border border-border text-primary group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-primary">{feature.title}</h3>
                <p className="mt-1 text-sm text-foreground/50">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}