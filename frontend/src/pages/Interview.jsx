import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { FiSend } from "react-icons/fi";
import AppShell from "../components/AppShell";
import ChatBubble from "../components/ChatBubble";
import MicButton from "../components/MicButton";
import Loader from "../components/Loader";
import ErrorBanner from "../components/ErrorBanner";
import useSpeechSynthesis from "../hooks/useSpeechSynthesis";
import { submitAnswer } from "../services/interviewService";
import { getInterviewer } from "../utils/interviewers";
import { addToHistory } from "../utils/history";

export default function Interview() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const interviewer = getInterviewer(state?.interviewerId);
  const [sessionId] = useState(state?.sessionId);

  const [messages, setMessages] = useState(() =>
    state?.question ? [{ role: "assistant", text: state.question }] : []
  );
  const [currentQuestion, setCurrentQuestion] = useState(state?.question || "");
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef(null);

  const { speak, speaking, supported: ttsSupported } = useSpeechSynthesis();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Redirect back if this page was reached without a valid session.
  useEffect(() => {
    if (!sessionId) {
      navigate("/upload-cv", { replace: true });
    }
  }, [sessionId, navigate]);

  // Keep the text box in sync with live speech recognition while listening.
  useEffect(() => {
    if (listening) setAnswer(transcript);
  }, [transcript, listening]);

  // Speak the current question aloud whenever it changes, using a voice
  // that matches the selected interviewer's gender (Alam = male, Zainab = female).
  useEffect(() => {
    if (currentQuestion && ttsSupported) {
      speak(currentQuestion, interviewer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion]);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const micStatus = listening ? "Recording…" : "Tap to speak";

  const toggleMic = useCallback(() => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      setAnswer("");
      SpeechRecognition.startListening({ continuous: true });
    }
  }, [listening, resetTranscript]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = answer.trim();
    if (!trimmed || submitting) return;

    if (listening) SpeechRecognition.stopListening();

    setMessages((prev) => [...prev, { role: "candidate", text: trimmed }]);
    setAnswer("");
    resetTranscript();
    setSubmitting(true);
    setError("");

    try {
      const data = await submitAnswer(sessionId, trimmed);
      if (data.completed) {
        addToHistory(sessionId, data.result?.overall_score ?? null);
        navigate(`/result/${sessionId}`, { state: { result: data.result } });
      } else {
        setCurrentQuestion(data.question);
        setMessages((prev) => [...prev, { role: "assistant", text: data.question }]);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || "Couldn't submit your answer. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!sessionId) return null;

  return (
    <AppShell wide>
      <div className="flex flex-col h-[calc(100vh-8.5rem)] animate-fade-up">
        {/* Interviewer header */}
        <div className="flex items-center gap-3 pb-4 border-b border-line">
          <img
            src={interviewer.avatar}
            alt={interviewer.name}
            className="w-12 h-12 rounded-xl object-cover border border-line"
          />
          <div>
            <p className="font-display font-semibold text-navy-950">{interviewer.name}</p>
            <p className="text-xs text-ink-400">
              {speaking ? "Speaking…" : "AI Interviewer"}
            </p>
          </div>
        </div>

        {/* Current question, large and readable */}
        <div className="py-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-600 mb-2">
            Question {messages.filter((m) => m.role === "assistant").length}
          </p>
          <h1 className="text-xl sm:text-2xl font-display font-semibold text-navy-950 max-w-2xl mx-auto leading-snug">
            {currentQuestion}
          </h1>
        </div>

        {/* Conversation */}
        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-4 px-1 py-2">
          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} text={m.text} avatar={interviewer.avatar} />
          ))}
          <div ref={chatEndRef} />
        </div>

        {error && <div className="mt-2"><ErrorBanner message={error} /></div>}

        {/* Input area */}
        <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-line">
          <div className="flex items-end gap-3">
            <MicButton
              listening={listening}
              supported={browserSupportsSpeechRecognition}
              onClick={toggleMic}
              status={micStatus}
            />
            <div className="flex-1">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Speak or type your answer — you can edit it before submitting."
                rows={2}
                className="w-full resize-none rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              {listening && (
                <p className="mt-1 text-xs text-accent-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
                  Listening… speak naturally, then review the text before sending.
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={!answer.trim() || submitting}
              aria-label="Submit answer"
              className="w-14 h-14 shrink-0 rounded-full bg-accent-600 text-white flex items-center justify-center hover:bg-accent-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? <Loader size={18} /> : <FiSend size={20} />}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
