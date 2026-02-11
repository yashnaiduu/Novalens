"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise((r) => setTimeout(r, 1000));
        setLoading(false);
        setSent(true);
    }

    return (
        <main className="container mx-auto px-6 py-24 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                    <p className="text-lg text-muted-foreground">
                        Have questions or feedback? We&apos;d love to hear from you.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-3xl p-8 sm:p-10 soft-shadow border border-white/10"
                >
                    {sent ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 text-green-500 mb-6">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                            <p className="text-muted-foreground">
                                Thanks for reaching out. We&apos;ll get back to you shortly.
                            </p>
                            <button
                                onClick={() => setSent(false)}
                                className="mt-8 text-primary font-medium hover:underline"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">First Name</label>
                                    <input
                                        required
                                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="Jane"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                                    <input
                                        required
                                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="jane@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-primary text-white font-semibold rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
                            >
                                {loading ? (
                                    <span className="animate-pulse">Sending...</span>
                                ) : (
                                    <>
                                        Send Message <Send className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
