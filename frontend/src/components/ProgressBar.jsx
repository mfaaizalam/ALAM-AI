// Simple labeled horizontal progress bar.
export default function ProgressBar({ value = 0, label }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1 text-sm text-ink-600">
          <span>{label}</span>
          <span className="font-medium text-navy-950">{clamped}%</span>
        </div>
      )}
      <div className="h-2.5 w-full rounded-full bg-line overflow-hidden">
        <div
          className="h-full rounded-full bg-accent-500"
          style={{ width: `${clamped}%`, transition: "width 0.8s ease" }}
        />
      </div>
    </div>
  );
}
