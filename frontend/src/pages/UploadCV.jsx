import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud, FiFileText, FiX } from "react-icons/fi";
import AppShell from "../components/AppShell";
import Button from "../components/Button";
import ErrorBanner from "../components/ErrorBanner";
import { startInterview } from "../services/interviewService";

export default function UploadCV() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const validateAndSetFile = (candidate) => {
    if (!candidate) return;
    if (candidate.type !== "application/pdf") {
      setError("Only PDF files are supported. Please choose a .pdf resume.");
      return;
    }
    setError("");
    setFile(candidate);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    validateAndSetFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setError("");
    setProgress(0);
    setAnalyzing(true);
    try {
      const data = await startInterview(file, setProgress);
      navigate("/select-interviewer", {
        state: {
          sessionId: data.session_id,
          question: data.question,
          questionNumber: data.question_number,
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "We couldn't process your CV. Please try again with a different PDF."
      );
      setAnalyzing(false);
    }
  };

  return (
    <AppShell>
      <div className="animate-fade-up">
        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-navy-950">
          Upload your CV
        </h1>
        <p className="mt-1 text-ink-600">
          We'll analyze it to tailor interview questions to your background.
        </p>

        <div className="mt-8 card p-8">
          <ErrorBanner message={error} />

          {!analyzing ? (
            <>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`mt-4 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 text-center cursor-pointer transition-colors ${
                  dragOver ? "border-accent-500 bg-accent-500/5" : "border-line hover:border-accent-400"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-navy-950 text-white flex items-center justify-center">
                  <FiUploadCloud size={22} />
                </div>
                <p className="text-sm font-medium text-navy-950">
                  Drag & drop your resume here, or click to browse
                </p>
                <p className="text-xs text-ink-400">PDF only, up to 10MB</p>
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => validateAndSetFile(e.target.files?.[0])}
                />
              </div>

              {file && (
                <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-surface-muted px-4 py-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FiFileText className="text-accent-600 shrink-0" />
                    <span className="text-sm text-navy-950 truncate">{file.name}</span>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-ink-400 hover:text-red-500 shrink-0"
                    aria-label="Remove file"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              )}

              <Button
                variant="primary"
                className="mt-6 w-full"
                disabled={!file}
                onClick={handleSubmit}
              >
                Upload & Continue
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <div className="w-14 h-14 rounded-full border-4 border-accent-500/20 border-t-accent-500 animate-spin" />
              <div>
                <p className="font-medium text-navy-950">
                  {progress < 100 ? `Uploading… ${progress}%` : "Analyzing your CV…"}
                </p>
                <p className="mt-1 text-sm text-ink-600">
                  {progress < 100
                    ? "Sending your resume to the server."
                    : "Our AI is reading your experience and preparing questions."}
                </p>
              </div>
              <div className="w-full max-w-xs h-1.5 rounded-full bg-line overflow-hidden">
                <div
                  className="h-full bg-accent-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
