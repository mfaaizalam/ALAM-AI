import { useCallback, useEffect, useRef, useState } from "react";

// Common name fragments used by most browsers/OSes to label their built-in
// voices. Used to pick a male- or female-sounding voice for each interviewer.
const FEMALE_HINTS = ["female", "zira", "samantha", "victoria", "susan", "karen", "moira", "tessa", "fiona", "google uk english female", "google us english"];
const MALE_HINTS = ["male", "david", "mark", "daniel", "alex", "fred", "george", "google uk english male"];

function pickVoice(voices, gender) {
  if (!voices?.length) return null;
  const hints = gender === "Female" ? FEMALE_HINTS : MALE_HINTS;
  // Prefer an English voice matching a name hint for the requested gender.
  const byHint = voices.find(
    (v) => v.lang?.toLowerCase().startsWith("en") &&
      hints.some((h) => v.name.toLowerCase().includes(h))
  );
  if (byHint) return byHint;
  // Fall back to any voice matching the hint regardless of language.
  const anyHint = voices.find((v) => hints.some((h) => v.name.toLowerCase().includes(h)));
  if (anyHint) return anyHint;
  // Last resort: just use the first/last English voice so male/female at least differ.
  const english = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  if (english.length) {
    return gender === "Female" ? english[0] : english[english.length - 1];
  }
  return voices[0];
}

// Wraps the browser's built-in SpeechSynthesis API (no paid TTS service).
export default function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const utteranceRef = useRef(null);
  const voicesRef = useRef([]);

  // Voice lists load asynchronously in most browsers — cache them once ready.
  useEffect(() => {
    if (!supported) return;
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, [supported]);

  // `interviewer` = { gender: "Male" | "Female", voice: { pitch, rate } }
  const speak = useCallback(
    (text, interviewer) => {
      if (!supported || !text) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const matchedVoice = pickVoice(voicesRef.current, interviewer?.gender);
      if (matchedVoice) utterance.voice = matchedVoice;

      utterance.rate = interviewer?.voice?.rate ?? 1;
      utterance.pitch = interviewer?.voice?.pitch ?? 1;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [supported]
  );

  const cancel = useCallback(() => {
    if (supported) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  useEffect(() => () => cancel(), [cancel]);

  return { speak, cancel, speaking, supported };
}