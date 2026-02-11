"use client";

import { motion } from "framer-motion";
import { Scan, Cpu } from "lucide-react";

export function CompareDemo() {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl h-[400px] w-full flex items-center justify-center group">
            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="relative h-48 w-48 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl shadow-primary/20">
                    {/* Core AI Icon */}
                    <div className="relative z-10">
                        <Cpu className="h-20 w-20 text-white/80 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
                        />
                    </div>

                    {/* Scanning Line */}
                    <motion.div
                        animate={{ top: ["-10%", "110%"] }}
                        transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.8)] z-20"
                    />

                    {/* Scanning Beam */}
                    <motion.div
                        animate={{ top: ["-10%", "110%"] }}
                        transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                        className="absolute left-0 right-0 h-24 bg-gradient-to-b from-cyan-400/10 to-transparent z-10"
                    />

                    {/* Circuit Patterns */}
                    <div className="absolute inset-0 opacity-20 bg-[url('/grid-pattern.svg')]"></div>
                </div>

                <div className="text-center space-y-3 relative z-20">
                    <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 tracking-tight drop-shadow-sm">
                        AI PROCESSING
                    </h3>
                    <div className="inline-flex items-center gap-2 justify-center text-xs font-bold text-cyan-300 bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-500/20 backdrop-blur-sm">
                        <Scan className="h-3 w-3 animate-pulse" />
                        <span className="tracking-wide uppercase">Scanning Subject</span>
                    </div>
                </div>
            </div>

            {/* Decor Background */}
            <div className="absolute inset-0 -z-10 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/60"></div>
        </div>
    );
}
