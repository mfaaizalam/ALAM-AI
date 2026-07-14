// Small reusable loading spinner. `label` renders beside it when provided.
export default function Loader({ size = 20, label, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="inline-block rounded-full border-2 border-accent-500/30 border-t-accent-500 animate-spin"
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      {label && <span className="text-sm text-ink-600">{label}</span>}
    </span>
  );
}
