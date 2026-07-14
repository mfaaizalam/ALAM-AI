// Renders a single message in the interview conversation thread.
// role: "assistant" | "candidate"
export default function ChatBubble({ role, text, avatar }) {
  const isAssistant = role === "assistant";
  return (
    <div className={`flex items-end gap-2.5 ${isAssistant ? "justify-start" : "justify-end"}`}>
      {isAssistant && (
        <img
          src={avatar}
          alt=""
          className="w-8 h-8 rounded-full object-cover border border-line shrink-0"
        />
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed animate-fade-up ${
          isAssistant
            ? "bg-white border border-line text-ink-900 rounded-bl-sm"
            : "bg-navy-950 text-white rounded-br-sm"
        }`}
      >
        {text}
      </div>
    </div>
  );
}
