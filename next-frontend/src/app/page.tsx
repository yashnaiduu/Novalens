"use client";
import { motion } from "framer-motion";
import { 
  UploadIcon, 
  Zap, 
  Image, 
  FileImage, 
  Rocket, 
  Crown,
  Sparkles,
  Stars,
  BadgeCheck,
  ShieldCheck
} from "lucide-react";
import { UploadTool } from "@/components/upload-tool";
import { PricingSection } from "@/components/pricing-section";
import { PremiumFeatures } from "@/components/premium-features";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Lightning Fast",
    description: "Process images in seconds with our optimized AI engine"
  },
  {
    icon: <Image className="h-6 w-6" />,
    title: "High Quality",
    description: "Pixel-perfect results with transparent backgrounds"
  },
  {
    icon: <FileImage className="h-6 w-6" />,
    title: "Multiple Formats",
    description: "Support for PNG, JPG, and WebP output formats"
  },
  {
    icon: <Rocket className="h-6 w-6" />,
    title: "Easy to Use",
    description: "Simple drag-and-drop interface for instant results"
  }
];

export default function HomePage() {
  return (
    <main>
      <section className="relative isolate overflow-hidden py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                <BadgeCheck className="h-4 w-4" />
                AI-Powered Background Removal
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Remove Backgrounds with <span className="text-primary">AI Precision</span>
              </h1>
              <p className="mt-6 max-w-prose text-lg opacity-90">
                Transform your images instantly with our world-class AI technology. Perfect for e-commerce, photography, and design professionals.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#tool"
                  className="gradient-border rounded-xl px-8 py-4 text-base font-semibold text-[--foreground] shadow-lg hover:shadow-xl transition-all"
                >
                  <span className="relative z-10 block rounded-[calc(theme(borderRadius.xl)-2px)] bg-[--surface] px-8 py-4">
                    Try It Free
                  </span>
                </a>
                <a 
                  href="#pricing" 
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-4 text-base font-semibold text-amber-50 hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Go Premium
                  </span>
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm opacity-80">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>99.9% Accuracy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Instant Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>10k+ Happy Users</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass rounded-3xl p-8 soft-shadow border border-white/20"
            >
              <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="mx-auto h-20 w-20 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                    <UploadIcon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">See It In Action</h3>
                  <p className="text-base opacity-80 max-w-md mx-auto">
                    Upload your image to experience pixel-perfect background removal with our advanced AI technology
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span>Premium Quality</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Stars className="h-4 w-4 text-blue-500" />
                      <span>AI-Powered</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-[-10%] h-80 w-80 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1.2 }}
          style={{ background: "radial-gradient(closest-side, var(--primary), transparent)" }}
        />
      </section>

      <section id="features" className="py-20 bg-[color-mix(in_oklab,var(--surface)_50%,transparent)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Powerful Features</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg opacity-80">
              Everything you need for professional background removal
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass rounded-2xl p-6 soft-shadow border border-white/10 hover:border-primary/30 transition-all duration-300 text-center"
              >
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm opacity-80">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="tool" className="mx-auto mt-16 max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight">Background Remover Tool</h2>
          <p className="mt-3 text-lg opacity-80">Upload an image and see the magic happen</p>
        </motion.div>
        <UploadTool />
      </section>

      <PremiumFeatures />
      <PricingSection />
      <AboutSection />
      <ContactSection />
    </main>
  );
}