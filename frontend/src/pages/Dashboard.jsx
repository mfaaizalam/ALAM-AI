import { useNavigate } from "react-router-dom";
import { FiPlay, FiClock, FiFileText } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import AppShell from "../components/AppShell";
import Button from "../components/Button";

// Local interview history — the backend doesn't expose a "list sessions"
// endpoint yet, so we track completed session ids the user has visited
// on this device and let them jump back to a result.
function getLocalHistory() {
  try {
    return JSON.parse(localStorage.getItem("alam_ai_history") || "[]");
  } catch {
    return [];
  }
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const history = getLocalHistory();

  return (
    <AppShell wide>
      <div className="animate-fade-up">
        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-navy-950">
          Welcome{user?.email ? `, ${user.email.split("@")[0]}` : ""} 👋
        </h1>
        <p className="mt-1 text-ink-600">
          Ready to sharpen your interview skills with an AI interviewer?
        </p>

        <div className="mt-8 grid sm:grid-cols-2 gap-5">
          <div className="card card-hover p-6 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-navy-950 flex items-center justify-center text-white">
                <FiPlay size={18} />
              </div>
              <h2 className="mt-4 font-display font-semibold text-lg text-navy-950">
                Start a new interview
              </h2>
              <p className="mt-1.5 text-sm text-ink-600">
                Upload your CV and let Alam or Zainab tailor questions to your experience.
              </p>
            </div>
            <Button
              variant="primary"
              className="mt-6 w-full"
              onClick={() => navigate("/upload-cv")}
            >
              Start Interview
            </Button>
          </div>

          <div className="card card-hover p-6 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-accent-500 flex items-center justify-center text-white">
                <FiClock size={18} />
              </div>
              <h2 className="mt-4 font-display font-semibold text-lg text-navy-950">
                Previous interviews
              </h2>
              <p className="mt-1.5 text-sm text-ink-600">
                Review scores and feedback from interviews you've already completed.
              </p>
            </div>
            <Button
              variant="ghost"
              className="mt-6 w-full"
              disabled={history.length === 0}
              onClick={() => history[0] && navigate(`/result/${history[0].sessionId}`)}
            >
              {history.length === 0 ? "No interviews yet" : "View Previous Interviews"}
            </Button>
          </div>
        </div>

        {history.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-ink-600 uppercase tracking-wide mb-3">
              Interview history
            </h3>
            <div className="card divide-y divide-line">
              {history.map((h) => (
                <button
                  key={h.sessionId}
                  onClick={() => navigate(`/result/${h.sessionId}`)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-muted transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <div className="flex items-center gap-3">
                    <FiFileText className="text-ink-400" />
                    <div>
                      <p className="text-sm font-medium text-navy-950">
                        Session #{h.sessionId}
                      </p>
                      <p className="text-xs text-ink-400">{h.date}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-accent-600">
                    {h.score != null ? `${h.score}/100` : "View"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
