import api from "./api";

// Starts a new interview session by uploading the candidate's CV (PDF).
// Backend returns { session_id, question, question_number }.
export const startInterview = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("cv", file);

  const { data } = await api.post("/interview/start", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (evt) => {
      if (onUploadProgress && evt.total) {
        onUploadProgress(Math.round((evt.loaded * 100) / evt.total));
      }
    },
  });
  return data;
};

// Submits a candidate's answer for the current question.
// Returns either the next question or the final result payload.
export const submitAnswer = async (sessionId, answer) => {
  const { data } = await api.post("/interview/submit", {
    session_id: sessionId,
    answer,
  });
  return data;
};

// Fetches the stored result for a completed interview session.
export const getInterviewResult = async (sessionId) => {
  const { data } = await api.get(`/interview/${sessionId}/result`);
  return data;
};

export const setInterviewer = async (sessionId, interviewerName) => {
  const formData = new FormData();
  formData.append("interviewer_name", interviewerName);

  const { data } = await api.post(
    `/interview/${sessionId}/interviewer`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};