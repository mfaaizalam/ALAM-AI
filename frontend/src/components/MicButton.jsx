import { FiMic, FiMicOff } from "react-icons/fi";

// Large circular microphone control. `status` drives the visual state and
// the caption shown underneath (Listening... / Recording... / Stopped).
export default function MicButton({ listening, supported, onClick, status }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={onClick}
        disabled={!supported}
        aria-pressed={listening}
        aria-label={listening ? "Stop microphone" : "Start microphone"}
        className={`relative flex items-center justify-center w-16 h-16 rounded-full shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
          listening
            ? "bg-red-500 text-white animate-pulse-ring"
            : "bg-navy-950 text-white hover:bg-navy-800"
        }`}
      >
        {supported ? (
          listening ? <FiMicOff size={24} /> : <FiMic size={24} />
        ) : (
          <FiMicOff size={24} />
        )}
      </button>
      <span className="text-xs font-medium text-ink-600 min-h-[16px]">
        {supported ? status : "Mic not supported"}
      </span>
    </div>
  );
}
