// Split layout shared by Login and Register: a navy brand panel on the left
// (desktop), plain white form panel on the right.
export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex node-grid flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold">
            A
          </div>
          <span className="font-display font-semibold tracking-tight">Alam AI</span>
        </div>
        <div>
          <p className="text-accent-400 text-sm font-medium mb-3">{eyebrow}</p>
          <h1 className="text-4xl font-display font-semibold leading-tight max-w-md">
            {title}
          </h1>
          <p className="mt-4 text-white/60 max-w-sm">{subtitle}</p>
        </div>
        <p className="text-white/40 text-xs">
          © {new Date().getFullYear()} Alam AI — AI-powered mock interviews.
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-surface-muted">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
