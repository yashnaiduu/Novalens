export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="inline-flex items-center gap-2">
              <span className="inline-block h-6 w-6 rounded-md" style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }} />
              <span className="font-bold text-lg">BG Remover</span>
            </div>
            <p className="mt-4 max-w-xs text-sm opacity-70">
              AI-powered background removal tool for professionals and creators.
            </p>
          </div>
          
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80">Product</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#features" className="text-sm opacity-70 hover:opacity-100 transition">Features</a></li>
              <li><a href="#pricing" className="text-sm opacity-70 hover:opacity-100 transition">Pricing</a></li>
              <li><a href="#tool" className="text-sm opacity-70 hover:opacity-100 transition">Try It Free</a></li>
            </ul>
          </div>
          
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#about" className="text-sm opacity-70 hover:opacity-100 transition">About</a></li>
              <li><a href="#contact" className="text-sm opacity-70 hover:opacity-100 transition">Contact</a></li>
              <li><a href="#" className="text-sm opacity-70 hover:opacity-100 transition">Privacy</a></li>
              <li><a href="#" className="text-sm opacity-70 hover:opacity-100 transition">Terms</a></li>
            </ul>
          </div>
          
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80">Connect</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-sm opacity-70 hover:opacity-100 transition">Twitter</a></li>
              <li><a href="#" className="text-sm opacity-70 hover:opacity-100 transition">Facebook</a></li>
              <li><a href="#" className="text-sm opacity-70 hover:opacity-100 transition">LinkedIn</a></li>
              <li><a href="#" className="text-sm opacity-70 hover:opacity-100 transition">Instagram</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-70">© {new Date().getFullYear()} Background Remover. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm opacity-70 hover:opacity-100 transition">Privacy Policy</a>
            <a href="#" className="text-sm opacity-70 hover:opacity-100 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}