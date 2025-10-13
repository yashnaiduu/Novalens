"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  ImageIcon, 
  Loader2, 
  Download, 
  Crown, 
  Sparkles,
  Wand2,
  Zap,
  FileImage,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { postRemoveBackground } from "@/lib/api";
import { useTrial } from "@/hooks/use-trial";
import { useAuth } from "@/hooks/use-auth";
import { PaymentModal } from "@/components/payment-modal";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function UploadTool() {
  const [dragActive, setDragActive] = useState(false);
  const [inputDataUrl, setInputDataUrl] = useState<string | null>(null);
  const [outputDataUrl, setOutputDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [outputFormat, setOutputFormat] = useState<"PNG" | "JPG" | "WEBP">("PNG");
  const [processingProgress, setProcessingProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { remaining, isExhausted, increment, isTrialExpired, trialStartTime, trialPeriodHours } = useTrial();
  const { user, token, refreshUser } = useAuth();

  const trackUsage = useCallback(async (file: File, result: unknown) => {
    if (!token) return;
    
    try {
      await fetch("/api/usage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "background_removal",
          metadata_json: {
            timestamp: new Date().toISOString(),
            file_type: file.type,
            file_size: file.size,
            output_format: result && typeof result === 'object' && 'format' in result ? (result as {format: string}).format : "PNG",
            engine_used: result && typeof result === 'object' && 'engine' in result ? (result as {engine: string}).engine : "unknown",
            processing_time: result && typeof result === 'object' && 'processingTime' in result ? (result as {processingTime: number}).processingTime : 0,
          },
        }),
      });
    } catch (error) {
      console.error("Failed to track usage:", error);
    }
  }, [token]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPremium = user?.is_premium;

  const onFiles = useCallback(async (files: FileList | null) => {
    if (!files || !files[0]) return;
    
    if (isExhausted && !isPremium) {
      setError("Free trial exceeded. Please purchase to continue.");
      return;
    }
    
    const file = files[0];
    
    if (!file.type.match('image.*')) {
      setError("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit. Please upload a smaller image.");
      return;
    }
    
    setError(null);
    setOutputDataUrl(null);
    const dataUrl = await fileToDataUrl(file);
    setInputDataUrl(dataUrl);
    setIsLoading(true);
    setProcessingProgress(0);
    
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);
    
    try {
      const startTime = Date.now();
      const json = await postRemoveBackground({ image: dataUrl, format: outputFormat });
      const processingTime = Date.now() - startTime;
      
      clearInterval(progressInterval);
      setProcessingProgress(100);
      
      if (!json.image) throw new Error(json.error || "No image returned");
      
      const resultWithTime = {
        ...json,
        processingTime
      };
      
      setOutputDataUrl(json.image);
      increment();
      trackUsage(file, resultWithTime);
    } catch (e: unknown) {
      console.error("Background removal error:", e);
      clearInterval(progressInterval);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(String(e));
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => setProcessingProgress(0), 1000);
    }
  }, [increment, isExhausted, isPremium, trackUsage, outputFormat]);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      onFiles(e.dataTransfer.files);
    },
    [onFiles]
  );

  const borderClass = useMemo(
    () =>
      dragActive
        ? "border-transparent bg-gradient-to-r from-[--primary]/20 to-[--secondary]/20"
        : "border-white/15",
    [dragActive]
  );

  const handlePaymentSuccess = useCallback(() => {
    refreshUser();
    setShowPaymentModal(false);
  }, [refreshUser]);

  if (!mounted) {
    return (
      <div className="glass rounded-2xl p-6 soft-shadow">
        <h2 className="text-2xl font-semibold tracking-tight">Background Remover</h2>
        <p className="mt-2 opacity-80">Drag & drop an image or click to upload.</p>
        <p className="mt-1 text-xs opacity-70">Loading...</p>

        <div className="mt-6 block cursor-pointer rounded-xl border border-white/15 p-8 text-center">
          <div className="mx-auto flex max-w-md flex-col items-center gap-3">
            <div className="relative">
              <div className="gradient-border rounded-2xl p-4">
                <div className="rounded-xl bg-[--surface] p-4">
                  <Upload className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Drop your image here</p>
              <p className="text-xs opacity-70">PNG, JPG, WebP up to ~10MB</p>
            </div>
            <button
              type="button"
              className="rounded-lg border px-4 py-2 text-sm hover:bg-white/5"
            >
              Choose file
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 soft-shadow">
      <h2 className="text-2xl font-semibold tracking-tight">Background Remover</h2>
      <p className="mt-2 opacity-80">Drag & drop an image or click to upload.</p>
      <p className="mt-1 text-xs opacity-70">
        {isPremium ? (
          <span className="text-primary">Unlimited access</span>
        ) : (
          <span>Free trial remaining: {remaining}</span>
        )}
      </p>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`mt-6 block cursor-pointer rounded-xl border ${borderClass} p-8 text-center transition-colors`}
      >
        <div className="mx-auto flex max-w-md flex-col items-center gap-3">
          <motion.div
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: dragActive ? 1.05 : 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative"
          >
            <div className="gradient-border rounded-2xl p-4">
              <div className="rounded-xl bg-[--surface] p-4">
                <Upload className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
          <div>
            <p className="text-sm font-medium">Drop your image here</p>
            <p className="text-xs opacity-70">PNG, JPG, WebP up to ~10MB</p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-white/5"
          >
            Choose file
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
        </div>
      </label>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
          {!isPremium && error.includes("Free trial exceeded") && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="mt-2 text-amber-300 hover:text-amber-200 font-medium"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      )}

      {/* Preview */}
      {(inputDataUrl || outputDataUrl) && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm opacity-80">
              <ImageIcon className="h-4 w-4" /> Original
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={inputDataUrl ?? ""} alt="Original" className="block max-h-[360px] w-full object-contain bg-black/5 dark:bg-white/5" />
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm opacity-80">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />} Result
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={outputDataUrl ?? ""} alt="Result" className="block max-h-[360px] w-full object-contain bg-transparent" />
            </div>
            {outputDataUrl && (
              <a
                href={outputDataUrl}
                download={`background-removed.${outputFormat.toLowerCase()}`}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-white/5"
              >
                <Download className="h-4 w-4" /> Download {outputFormat}
              </a>
            )}
          </div>
        </div>
      )}

      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        onPaymentSuccess={handlePaymentSuccess} 
      />
    </div>
  );
}