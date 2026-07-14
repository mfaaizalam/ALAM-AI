import { FiAlertCircle } from "react-icons/fi";

// Inline error banner used for form/API errors across the app.
export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <FiAlertCircle className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
