import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Shared shell (top bar + content container) for authenticated pages.
export default function AppShell({ children, wide = false }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="sticky top-0 z-10 border-b border-line bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-navy-950 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className="font-display font-semibold text-navy-950 tracking-tight">
              Alam AI
            </span>
          </button>

          <div className="flex items-center gap-4">
            {user?.email && (
              <span className="hidden sm:inline text-sm text-ink-600">{user.email}</span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-navy-950 transition-colors"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className={`mx-auto ${wide ? "max-w-6xl" : "max-w-4xl"} px-4 sm:px-6 py-8`}>
        {children}
      </main>
    </div>
  );
}
