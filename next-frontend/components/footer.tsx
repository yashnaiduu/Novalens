import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">

        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
          Ready to remove backgrounds?
        </h2>

        <div className="flex justify-center gap-6 mb-8">
          <a
            href="https://github.com/yashnaiduu"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white/5 p-3 hover:bg-white/10 transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-6 w-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/yash-naidu-b08055219"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white/5 p-3 hover:bg-white/10 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-6 w-6" />
          </a>
          <a
            href="mailto:yashnnaidu@gmail.com"
            className="rounded-full bg-white/5 p-3 hover:bg-white/10 transition-colors"
            aria-label="Email"
          >
            <Mail className="h-6 w-6" />
          </a>
        </div>

        <div className="text-sm opacity-60">
          <p>Made with ❤️ by <span className="font-semibold text-primary">Yash Naidu</span></p>
          <p className="mt-2 text-xs">© {new Date().getFullYear()} Background Remover Pro</p>
        </div>

      </div>
    </footer>
  );
}