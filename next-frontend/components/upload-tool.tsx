"use client";
// Trigger Vercel deploy

import { useCallback, useRef, useState, useEffect } from "react";
import {
  Upload,
  Loader2,
  Download,
  FileImage
} from "lucide-react";
import { postRemoveBackground } from "@/lib/api";

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
  const [mounted, setMounted] = useState(false);
  const [outputFormat, setOutputFormat] = useState<"PNG" | "JPG" | "WEBP">("PNG");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);


  const onFiles = useCallback(async (files: FileList | null) => {
    if (!files || !files[0]) return;

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

    try {
      const json = await postRemoveBackground({ image: dataUrl, format: outputFormat });

      if (!json.image) throw new Error(json.error || "No image returned");

      setOutputDataUrl(json.image);
    } catch (e: unknown) {
      console.error("Background removal error:", e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(String(e));
      }
    } finally {
      setIsLoading(false);
    }
  }, [outputFormat]);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      onFiles(e.dataTransfer.files);
    },
    [onFiles]
  );



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
    <div className="w-full max-w-4xl mx-auto bg-surface border border-border rounded-3xl p-8 shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-primary">Upload Image</h2>
        <p className="mt-2 text-foreground/60">Drag & drop or click to select</p>
      </div>


      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`mt-8 block cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300
          ${dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-surface"}`}
      >
        <div className="mx-auto flex max-w-md flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface border border-border shadow-sm">
            <Upload className="h-6 w-6 text-foreground/70" />
          </div>
          <div>
            <p className="text-lg font-medium">Click or drag image</p>
            <p className="text-sm text-foreground/40 mt-1">PNG, JPG, WebP up to 10MB</p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full bg-primary text-background px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            Select Image
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

        </div>
      )}

      {/* Preview */}
      {(inputDataUrl || outputDataUrl) && (
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-primary mb-2">Your Results</h3>
            <p className="text-sm text-foreground/50">Compare the original and processed images</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Original */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-foreground/20" />
                  <span className="text-sm font-medium text-foreground/70 uppercase tracking-wide">Original</span>
                </div>
              </div>
              <div
                className="relative overflow-hidden rounded-2xl border-2 border-border/50 aspect-[4/3] flex items-center justify-center shadow-sm hover:shadow-md transition-shadow bg-surface"
              >
                {inputDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={inputDataUrl}
                    alt="Original"
                    className="w-full h-full object-contain p-1 rounded-2xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-border">
                    <FileImage className="h-12 w-12 mb-2" />
                    <span className="text-xs">No image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Result */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      <span className="text-sm font-medium text-primary uppercase tracking-wide">Processing...</span>
                    </>
                  ) : (
                    <>
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm font-medium text-primary uppercase tracking-wide">Result</span>
                    </>
                  )}
                </div>
                {outputDataUrl && (
                  <a
                    href={outputDataUrl}
                    download={`background-removed.${outputFormat.toLowerCase()}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </a>
                )}
              </div>
              <div
                className="relative overflow-hidden rounded-2xl border-2 border-primary/20 aspect-[4/3] flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
                  `,
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  backgroundColor: '#ffffff'
                }}
              >
                {outputDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={outputDataUrl}
                    alt="Result"
                    className="w-full h-full object-contain p-1 relative z-10 rounded-2xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-12">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-12 w-12 animate-spin text-primary/50 mb-3" />
                        <span className="text-xs text-foreground/40">Removing background...</span>
                      </>
                    ) : (
                      <>
                        <FileImage className="h-12 w-12 text-border mb-2" />
                        <span className="text-xs text-foreground/40">Processed image will appear here</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {outputDataUrl && (
                <div className="space-y-4 pt-2">
                  {/* Format Selector */}
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-xs font-medium text-foreground/50 uppercase tracking-wide">Download Format</span>
                    <div className="inline-flex items-center gap-2 p-1 rounded-full bg-surface border border-border">
                      {(["PNG", "JPG", "WEBP"] as const).map((format) => (
                        <button
                          key={format}
                          onClick={() => setOutputFormat(format)}
                          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${outputFormat === format
                            ? "bg-primary text-background shadow-sm"
                            : "text-foreground/60 hover:text-foreground/80"
                            }`}
                        >
                          {format}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Download Button */}
                  <div className="flex justify-center">
                    <a
                      href={outputDataUrl}
                      download={`background-removed.${outputFormat.toLowerCase()}`}
                      className="inline-flex items-center gap-2 rounded-full bg-primary text-background px-8 py-3 text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                    >
                      <Download className="h-4 w-4" />
                      Download {outputFormat}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


    </div>
  );
}