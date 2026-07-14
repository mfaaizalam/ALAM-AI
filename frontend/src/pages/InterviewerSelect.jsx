import { useState } from "react";
import { setInterviewer } from "../services/interviewService";
import { useNavigate, useLocation } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import AppShell from "../components/AppShell";
import Button from "../components/Button";
import { INTERVIEWERS } from "../utils/interviewers";

// Lets the candidate pick Alam or Zainab before the interview screen.
// Expects session data ({ sessionId, question, questionNumber }) via router state.
export default function InterviewerSelect() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionData = location.state;
  const [selected, setSelected] = useState(INTERVIEWERS[0].id);

  const handleContinue = async () => {
  try {
    console.log("Session Data:", sessionData);

    const interviewer = INTERVIEWERS.find(
      (i) => i.id === selected
    );

    const sessionId =
      sessionData.sessionId || sessionData.session_id;

    console.log("Using Session ID:", sessionId);
    console.log("Interviewer:", interviewer.name);

    const data = await setInterviewer(
      sessionId,
      interviewer.name
    );

    navigate("/interview", {
      state: {
        ...sessionData,
        sessionId,
        interviewerId: selected,
        question: data.question,
      },
    });

  } catch (err) {
    console.log("STATUS:", err.response?.status);
   console.log(JSON.stringify(err.response?.data, null, 2));
    console.log("ERROR:", err);
  }
};

  return (
    <AppShell>
      <div className="animate-fade-up">
        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-navy-950">
          Choose your interviewer
        </h1>
        <p className="mt-1 text-ink-600">
          Both ask the same structured question set — pick whichever presence feels right.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 gap-5">
          {INTERVIEWERS.map((interviewer) => {
            const isSelected = selected === interviewer.id;
            return (
              <button
                key={interviewer.id}
                onClick={() => setSelected(interviewer.id)}
                className={`card p-6 text-left transition-all relative ${
                  isSelected
                    ? "ring-2 ring-accent-500 border-transparent"
                    : "hover:shadow-lg"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-4 right-4 w-6 h-6 rounded-full bg-accent-500 text-white flex items-center justify-center">
                    <FiCheck size={14} />
                  </span>
                )}
                <img
                  src={interviewer.avatar}
                  alt={interviewer.name}
                  className="w-20 h-20 rounded-2xl object-cover border border-line"
                />
                <h2 className="mt-4 font-display font-semibold text-lg text-navy-950">
                  {interviewer.name}
                </h2>
                <p className="text-xs uppercase tracking-wide text-ink-400">
                  {interviewer.gender}
                </p>
                <p className="mt-2 text-sm text-ink-600">{interviewer.blurb}</p>
              </button>
            );
          })}
        </div>

        <Button variant="primary" className="mt-8 w-full sm:w-auto" onClick={handleContinue}>
          Continue with {INTERVIEWERS.find((i) => i.id === selected)?.name}
        </Button>
      </div>
    </AppShell>
  );
}
