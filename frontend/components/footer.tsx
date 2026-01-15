import { ShieldCheck, Heart } from 'lucide-react';
export default function Footer() {
  return (
    <footer className="shrink-0 w-full border-t border-white/5 bg-slate-900/80 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-slate-500 flex items-center gap-2">
          <ShieldCheck size={16} className="text-green-500" />
          <span>Built with Foundry & Next.js. Secured by Smart Contracts.</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-600">
          Made with <Heart size={12} className="text-red-500 fill-red-500" /> by
          <span className="font-bold text-slate-400 ml-1">Chitian-victor</span>
          <span className="mx-2">|</span>
          <span>© 2026 Pumpkin Protocol</span>
        </div>
      </div>
    </footer>
  );
}