const API_URL = "http://127.0.0.1:8000/api/v1";
const TOKENS_KEY = "rankify:tokens";

class ApiError extends Error {
  constructor({ status, code, message, details = null }) {
    super(message ?? "Unknown error");
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const isAbortError = (error) => error?.name === "AbortError";

const listeners = new Set();

export const tokens = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(TOKENS_KEY));
    } catch {
      return null;
    }
  },
  set(value) {
    try {
      localStorage.setItem(TOKENS_KEY, JSON.stringify(value));
    } catch {
      return;
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKENS_KEY);
    } catch {
      return;
    }
    listeners.forEach((listener) => listener());
  },
  onClear(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

async function send(path, { method, body, signal, access }) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (access) headers.Authorization = `Bearer ${access}`;
  try {
    return await fetch(`${API_URL}${path}`, {
      method,
      signal,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new ApiError({ status: 0, code: "network", message: "Server is unavailable" });
  }
}

let refreshing = null;

function refreshAccess() {
  const refresh = tokens.get()?.refresh;
  if (!refresh) return Promise.resolve(null);
  refreshing ??= send("/auth/token/refresh/", { method: "POST", body: { refresh } })
    .then(async (response) => {
      if (!response.ok) return null;
      const { access } = await response.json();
      tokens.set({ ...tokens.get(), access });
      return access;
    })
    .catch(() => null)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

async function request(path, { method = "GET", body, signal, auth = true } = {}) {
  let access = auth ? tokens.get()?.access : null;
  let response = await send(path, { method, body, signal, access });

  if (response.status === 401 && access) {
    access = await refreshAccess();
    if (!access) tokens.clear();
    response = await send(path, { method, body, signal, access });
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
  post: (path, body, options) => request(path, { method: "POST", body, ...options }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  delete: (path) => request(path, { method: "DELETE" }),
};
