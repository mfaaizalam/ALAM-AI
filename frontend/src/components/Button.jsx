import Loader from "./Loader";

// Shared button with primary/accent/ghost variants and a built-in loading state.
export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-transform disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "btn-primary",
    accent: "btn-accent",
    ghost: "bg-transparent text-navy-950 border border-line hover:bg-surface-muted",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {loading && <Loader size={16} />}
      {children}
    </button>
  );
}
