"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Check, 
  Shield, 
  Lock, 
  Star,
  Crown,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePayment } from "@/hooks/use-payment";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export function PaymentModal({ isOpen, onClose, onPaymentSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const { user, login } = useAuth();
  const { createCheckoutSession } = usePayment();

  useEffect(() => {
    setMounted(true);
  }, []);
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email || !email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!name || name.trim().length < 2) {
      newErrors.name = "Please enter your full name";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setStep("processing");
    
    try {
      // Login or get existing user
      let currentUser = user;
      if (!currentUser) {
        currentUser = await login(email, name);
      }
      
      // Create payment record
      const paymentData = await createCheckoutSession();
      
      // Redirect to Buy Me a Coffee with pre-filled amount
      // The user can increase the tip but cannot go below $30
      const bmcUrl = `https://buymeacoffee.com/yashnaiduu?amount=30`;
      window.location.href = bmcUrl;
    } catch (error) {
      console.error("Payment error:", error);
      setStep("form");
      if (error instanceof Error) {
        setErrors({ general: `Payment failed: ${error.message}. Please try again.` });
      } else {
        setErrors({ general: "Payment failed. Please try again." });
      }
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative w-full max-w-md rounded-3xl bg-[--surface] border border-white/20 p-6 z-10 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1 hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            {step === "form" && (
              <>
                <div className="text-center mb-6">
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center mb-4">
                    <Crown className="h-8 w-8 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-bold">Premium Lifetime Access</h3>
                  <p className="mt-2 text-sm opacity-80">One-time payment. Unlimited usage forever.</p>
                  
                  <div className="mt-4 flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-2xl p-5 mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">$30</span>
                    <span className="text-sm opacity-80">one-time</span>
                  </div>
                  <p className="text-center text-sm opacity-80 mt-1">No recurring fees. No subscriptions.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errors.general && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                      {errors.general}
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[--surface] px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder="your@email.com"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="h-5 w-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[--surface] px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder="Your full name"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="h-5 w-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                  </div>
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      className="gradient-border w-full rounded-2xl px-5 py-4 font-semibold text-[--foreground] transition-all shadow-lg hover:shadow-xl"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2 rounded-[calc(theme(borderRadius.xl)-2px)] bg-[--surface] px-5 py-4">
                        <Lock className="h-5 w-5" />
                        Pay $30 with Buy Me a Coffee
                        <ArrowRight className={`h-5 w-5 transition-transform ${isHovering ? 'translate-x-1' : ''}`} />
                      </span>
                    </button>
                  </div>
                </form>
                
                <div className="mt-5 flex items-center justify-center gap-2 text-xs opacity-70">
                  <Shield className="h-4 w-4" />
                  <span>Secure payment powered by Buy Me a Coffee</span>
                </div>
              </>
            )}
            
            {step === "processing" && (
              <div className="text-center py-8">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
                <h3 className="text-2xl font-bold">Redirecting to Payment</h3>
                <p className="mt-2 text-sm opacity-80">Please wait while we redirect you to our secure payment provider...</p>
                
                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Bank-level encryption</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>PCI compliant processing</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Instant activation upon payment</span>
                  </div>
                </div>
              </div>
            )}
            
            {step === "success" && (
              <div className="text-center py-8">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-green-500/20 flex items-center justify-center mb-6">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold">Payment Successful!</h3>
                <p className="mt-2 text-sm opacity-80">You now have lifetime premium access</p>
                
                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/20">
                  <div className="flex items-center justify-center gap-2 text-amber-400">
                    <Crown className="h-5 w-5" />
                    <span className="font-medium">Premium Benefits Unlocked</span>
                  </div>
                  <ul className="mt-3 text-sm space-y-1 text-left">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Unlimited background removals
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      All output formats (PNG, JPG, WebP)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Priority processing queue
                    </li>
                  </ul>
                </div>
                
                <div className="mt-8">
                  <button
                    onClick={onPaymentSuccess}
                    className="gradient-border w-full rounded-2xl px-5 py-4 font-semibold text-[--foreground]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 rounded-[calc(theme(borderRadius.xl)-2px)] bg-[--surface] px-5 py-4">
                      <Sparkles className="h-5 w-5" />
                      Continue to App
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}