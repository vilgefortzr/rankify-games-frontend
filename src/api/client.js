const API_URL = "http://127.0.0.1:8000/api/v1";

class ApiError extends Error {
  constructor({ status, code, message, details = null }) {
    super(message ?? "Unknown error");
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const isAbortError = (error) => error?.name === "AbortError";

async function request(path, { method = "GET", body, signal } = {}) {
  const options = { method, signal, headers: {} };
  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new ApiError({ status: 0, code: "network", message: "Server is unavailable" });
  }

  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(data?.error ?? { status: response.status, code: `http_${response.status}` });
  }
  return data;
}

export const http = {
  get: (path, signal) => request(path, { signal }),
  post: (path, body) => request(path, { method: "POST", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  delete: (path) => request(path, { method: "DELETE" }),
};
