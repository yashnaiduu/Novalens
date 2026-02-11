"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <main className="container mx-auto px-6 py-24 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium mb-6">
                        <span>Our Mission</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60">
                        Empowering Creators with AI
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        We believe that high-quality visual editing should be accessible to everyone. Our advanced AI handles the complexity, so you can focus on creativity.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 pt-12">
                    {[
                        {
                            title: "Innovation First",
                            desc: "We continuously refine our neural networks to deliver the most precise edge detection in the industry."
                        },
                        {
                            title: "Privacy Focused",
                            desc: "Your images are processed securely and deleted automatically after 1 hour. We never sell your data."
                        },
                        {
                            title: "Community Driven",
                            desc: "Built for developers, designers, and creators. We listen to feedback to ship features that matter."
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-3xl bg-surface border border-white/5 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
