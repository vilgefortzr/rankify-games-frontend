const API_URL = "http://127.0.0.1:8000/api/v1";

export const fetchJson = async (path) => {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) throw new Error(response.status);
  return response.json();
};

export const postJson = async (path, body) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw data;
  return data;
};

export const deleteRequest = async (path) => {
  const response = await fetch(`${API_URL}${path}`, { method: "DELETE" });
  if (!response.ok) throw await response.json();
};

export const patchJson = async (path, body) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw data;
  return data;
};