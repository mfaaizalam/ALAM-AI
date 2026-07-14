import alamAvatar from "../assets/avatars/alam.png";
import zainabAvatar from "../assets/avatars/zainab.png";

// Single source of truth for the two available AI interviewers.
export const INTERVIEWERS = [
  {
    id: "alam",
    name: "Alam",
    gender: "Male",
    avatar: alamAvatar,
    voice: { pitch: 0.95, rate: 1 },
    blurb: "Calm and methodical — digs into the technical detail.",
  },
  {
    id: "zainab",
    name: "Zainab",
    gender: "Female",
    avatar: zainabAvatar,
    voice: { pitch: 1.1, rate: 1 },
    blurb: "Warm and conversational — focuses on your story and impact.",
  },
];

export const getInterviewer = (id) =>
  INTERVIEWERS.find((i) => i.id === id) || INTERVIEWERS[0];
