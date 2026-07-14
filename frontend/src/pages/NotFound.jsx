import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-muted text-center px-6">
      <p className="text-6xl font-display font-semibold text-navy-950">404</p>
      <p className="mt-2 text-ink-600">This page doesn't exist.</p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex rounded-xl btn-primary px-5 py-2.5 text-sm font-semibold"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
