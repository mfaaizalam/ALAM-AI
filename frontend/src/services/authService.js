import api from "./api";

// All authentication-related network calls live here — components never
// touch axios directly.
export const registerUser = async ({ name, email, password }) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
};

export const loginUser = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data; // { access_token, token_type }
};
