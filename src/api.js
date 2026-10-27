const API_URL = "http://127.0.0.1:8000/api/v1";

const request = async (path, options) => {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw { status: 0, message: "Сервер недоступний" };
  }
  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw data?.error ?? { status: response.status, message: "Невідома помилка" };
  }
  return data;
};

const jsonOptions = (method, body) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const fetchJson = (path) => request(path);
export const postJson = (path, body) => request(path, jsonOptions("POST", body));
export const patchJson = (path, body) => request(path, jsonOptions("PATCH", body));
export const deleteRequest = (path) => request(path, { method: "DELETE" });