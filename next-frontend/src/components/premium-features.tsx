import { motion } from "framer-motion";
import { 
  Zap, 
  Image, 
  FileImage, 
  Rocket, 
  Crown, 
  CheckCircle,
  Download,
  Timer,
  Stars,
  BadgeCheck,
  ShieldCheck
} from "lucide-react";

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Unlimited Usage",
    description: "Remove backgrounds from as many images as you need, forever."
  },
  {
    icon: <Image className="h-6 w-6" />,
    title: "All Output Formats",
    description: "Download your images in PNG, JPG, or WebP formats."
  },
  {
    icon: <FileImage className="h-6 w-6" />,
    title: "High Resolution",
    description: "Process images up to 4K resolution with perfect quality."
  },
  {
    icon: <Rocket className="h-6 w-6" />,
    title: "Priority Processing",
    description: "Get faster results with our priority processing queue."
  },
  {
    icon: <Crown className="h-6 w-6" />,
    title: "Commercial Use",
    description: "Use the output images for commercial purposes without restrictions."
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: "Premium Support",
    description: "Get dedicated support for any issues or questions."
  },
  {
    icon: <Download className="h-6 w-6" />,
    title: "Bulk Processing",
    description: "Upload and process multiple images at once."
  },
  {
    icon: <Timer className="h-6 w-6" />,
    title: "No Watermarks",
    description: "Clean, professional results without any watermarks."
  }
];

export function PremiumFeatures() {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-500 mb-4">
          <Stars className="h-4 w-4" />
          Premium Features
        </div>
        
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Everything You Need for Professional Results
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg opacity-80">
          Unlock the full power of our AI technology with premium features
        </p>
      </motion.div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="glass rounded-2xl p-6 soft-shadow border border-white/10 hover:border-amber-500/30 transition-all duration-300"
          >
            <div className="text-amber-500">
              {feature.icon}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm opacity-80">{feature.description}</p>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 text-amber-50 font-bold shadow-lg">
          <Crown className="h-5 w-5" />
          <span>Lifetime access for just $30</span>
        </div>
        
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm opacity-80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <span>Secure Payments</span>
          </div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-blue-500" />
            <span>Money-Back Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Stars className="h-5 w-5 text-amber-500" />
            <span>Trusted by 10,000+ Users</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}