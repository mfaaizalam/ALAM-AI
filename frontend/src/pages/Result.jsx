import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiAlertTriangle, FiAward, FiRefreshCw } from "react-icons/fi";
import AppShell from "../components/AppShell";
import Loader from "../components/Loader";
import ErrorBanner from "../components/ErrorBanner";
import Button from "../components/Button";
import ScoreRing from "../components/ScoreRing";
import ProgressBar from "../components/ProgressBar";
import { getInterviewResult } from "../services/interviewService";

const METRICS = [
  { key: "technical_score", label: "Technical" },
  { key: "communication_score", label: "Communication" },
  { key: "problem_solving_score", label: "Problem Solving" },
  { key: "confidence_score", label: "Confidence" },
  { key: "project_knowledge_score", label: "Project Knowledge" },
];

export default function Result() {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!location.state?.result);
  const [error, setError] = useState("");

  useEffect(() => {
    if (result) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getInterviewResult(sessionId);
        setResult(data.result || data);
      } catch (err) {
        setError(
          err.response?.data?.detail || "Couldn't load this interview's result."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId, result]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-24">
          <Loader size={32} />
          <p className="mt-4 text-ink-600">Loading your results…</p>
        </div>
      </AppShell>
    );
  }

  if (error || !result) {
    return (
      <AppShell>
        <ErrorBanner message={error || "No result available for this session."} />
        <Button variant="ghost" className="mt-4" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </AppShell>
    );
  }

  const overall = result.overall_score ?? 0;

  return (
    <AppShell wide>
      <div className="animate-fade-up">
        <div className="card p-8 flex flex-col sm:flex-row items-center gap-8">
          <ScoreRing value={overall} size={140} stroke={10} label="Overall Score" />
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">
              Interview Complete
            </p>
            <h1 className="mt-1 text-2xl font-display font-semibold text-navy-950">
              Session #{sessionId} Results
            </h1>
            <p className="mt-2 text-ink-600">{result.feedback}</p>
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {METRICS.map((m) => (
            <div key={m.key} className="card p-5">
              <ProgressBar value={result[m.key] ?? 0} label={m.label} />
            </div>
          ))}
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-5">
          <div className="card p-6">
            <div className="flex items-center gap-2 text-green-600 font-display font-semibold">
              <FiCheckCircle /> Strengths
            </div>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              {(result.strengths || []).length > 0 ? (
                result.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                    {s}
                  </li>
                ))
              ) : (
                <li className="text-ink-400">No strengths recorded.</li>
              )}
            </ul>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 text-amber-600 font-display font-semibold">
              <FiAlertTriangle /> Areas to Improve
            </div>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              {(result.weaknesses || []).length > 0 ? (
                result.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    {w}
                  </li>
                ))
              ) : (
                <li className="text-ink-400">No weaknesses recorded.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-6 card p-6">
          <div className="flex items-center gap-2 text-navy-950 font-display font-semibold">
            <FiAward /> Recommendation
          </div>
          <p className="mt-2 text-sm text-ink-600">{result.recommendation}</p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button variant="primary" onClick={() => navigate("/upload-cv")}>
            <FiRefreshCw size={16} /> Start Another Interview
          </Button>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
