// import { useCallback, useEffect, useRef, useState } from "react";

// const FEMALE_HINTS = [
//   "female",
//   "zira",
//   "samantha",
//   "victoria",
//   "susan",
//   "karen",
//   "moira",
//   "tessa",
//   "fiona",
//   "sonia",
//   "hazel",
//   "google uk english female",
// ];

// const MALE_HINTS = [
//   "male",
//   "david",
//   "mark",
//   "daniel",
//   "alex",
//   "fred",
//   "george",
//   "ryan",
//   "guy",
//   "google uk english male",
// ];

// function pickVoice(voices, gender) {
//   if (!voices.length) return null;

//   const hints = gender === "Female" ? FEMALE_HINTS : MALE_HINTS;

//   // Find matching English voice
//   const match = voices.find(
//     (v) =>
//       v.lang.toLowerCase().startsWith("en") &&
//       hints.some((h) => v.name.toLowerCase().includes(h))
//   );

//   if (match) return match;

//   // Fallback to any English voice
//   const english = voices.find((v) =>
//     v.lang.toLowerCase().startsWith("en")
//   );

//   return english || voices[0];
// }

// export default function useSpeechSynthesis() {
//   const supported =
//     typeof window !== "undefined" &&
//     "speechSynthesis" in window;

//   const [speaking, setSpeaking] = useState(false);

//   const voicesRef = useRef([]);
//   const selectedVoiceRef = useRef(null);
//   const currentGenderRef = useRef(null);

//   useEffect(() => {
//     if (!supported) return;

//     const loadVoices = () => {
//       voicesRef.current = window.speechSynthesis.getVoices();

//       console.log(
//         "Available Voices:",
//         voicesRef.current.map((v) => ({
//           name: v.name,
//           lang: v.lang,
//         }))
//       );
//     };

//     loadVoices();

//     window.speechSynthesis.onvoiceschanged = loadVoices;

//     return () => {
//       window.speechSynthesis.onvoiceschanged = null;
//     };
//   }, [supported]);

//   const speak = useCallback(
//     (text, interviewer) => {
//       if (!supported || !text) return;

//       window.speechSynthesis.cancel();

//       // Lock voice for selected interviewer
//       if (
//         !selectedVoiceRef.current ||
//         currentGenderRef.current !== interviewer?.gender
//       ) {
//         selectedVoiceRef.current = pickVoice(
//           voicesRef.current,
//           interviewer?.gender
//         );

//         currentGenderRef.current = interviewer?.gender;

//         console.log(
//           "Selected Voice:",
//           selectedVoiceRef.current?.name
//         );
//       }

//       const utterance = new SpeechSynthesisUtterance(text);

//       if (selectedVoiceRef.current) {
//         utterance.voice = selectedVoiceRef.current;
//       }

//       utterance.rate = interviewer?.voice?.rate ?? 1;
//       utterance.pitch = interviewer?.voice?.pitch ?? 1;

//       utterance.onstart = () => setSpeaking(true);

//       utterance.onend = () => setSpeaking(false);

//       utterance.onerror = () => setSpeaking(false);

//       window.speechSynthesis.speak(utterance);
//     },
//     [supported]
//   );

//   const cancel = useCallback(() => {
//     if (!supported) return;

//     window.speechSynthesis.cancel();
//     setSpeaking(false);
//   }, [supported]);

//   useEffect(() => {
//     return () => cancel();
//   }, [cancel]);

//   return {
//     speak,
//     cancel,
//     speaking,
//     supported,
//   };
// }

import { useCallback, useEffect, useRef, useState } from "react";

const FEMALE_HINTS = [
  "female",
  "zira",
  "samantha",
  "victoria",
  "susan",
  "karen",
  "moira",
  "tessa",
  "fiona",
  "sonia",
  "hazel",
];

const MALE_HINTS = [
  "male",
  "david",
  "mark",
  "daniel",
  "alex",
  "fred",
  "george",
  "ryan",
  "guy",
];

function pickVoice(voices, interviewer) {
  if (!voices.length) return null;

  let voice = voices.find(
    (v) => v.name === interviewer.voiceName
  );

  if (voice) return voice;

  if (interviewer.name === "Alam") {
    voice = voices.find((v) =>
      v.name.includes("Microsoft David")
    );
  } else {
    voice = voices.find((v) =>
      v.name.includes("Microsoft Zira")
    );
  }

  return (
    voice ||
    voices.find((v) => v.lang.startsWith("en")) ||
    voices[0]
  );
}

export default function useSpeechSynthesis() {
  const supported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window;

  const [speaking, setSpeaking] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);

  const voicesRef = useRef([]);
  const selectedVoiceRef = useRef(null);
  const currentGenderRef = useRef(null);

  useEffect(() => {
    if (!supported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();

      if (voices.length) {
        voicesRef.current = voices;
        setVoicesReady(true);
      }
    };

    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [supported]);

  const speak = useCallback(
    (text, interviewer) => {
      if (!supported || !voicesReady || !text) return;

      window.speechSynthesis.cancel();

      if (
        !selectedVoiceRef.current ||
        currentGenderRef.current !== interviewer?.gender
      ) {
        selectedVoiceRef.current = pickVoice(
         voicesRef.current,
        interviewer
        );

        currentGenderRef.current = interviewer?.gender;

        console.log(
          "Selected Voice:",
          selectedVoiceRef.current?.name
        );
      }

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.voice = selectedVoiceRef.current;
      utterance.rate = interviewer?.voice?.rate ?? 1;
      utterance.pitch = interviewer?.voice?.pitch ?? 1;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [supported, voicesReady]
  );

  const cancel = useCallback(() => {
    if (!supported) return;

    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  useEffect(() => {
    return () => cancel();
  }, [cancel]);

  return {
    speak,
    cancel,
    speaking,
    supported,
    voicesReady,
  };
}