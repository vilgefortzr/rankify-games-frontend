const API_URL = "http://127.0.0.1:8000/api/v1";

export const fetchJson = async (path) => {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) throw new Error(response.status);
  return response.json();
};