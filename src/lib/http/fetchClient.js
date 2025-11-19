// src/lib/http/httpFetch.js

let isRefreshing = false;
let refreshQueue = [];

const BASE_URL = "/api";

/**
 * Add failed requests to a queue while refresh is running
 */
function addToQueue(callback) {
  return new Promise((resolve, reject) => {
    refreshQueue.push({ resolve, reject, callback });
  });
}

/**
 * Process the queue once refresh is done
 */
function processQueue(error, token = null) {
  refreshQueue.forEach((req) => {
    if (error) {
      req.reject(error);
    } else {
      req.resolve(req.callback(token));
    }
  });
  refreshQueue = [];
}

/**
 * Main Http Client
 */
export async function httpFetch(url, options = {}) {
  let accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  // Always attach token if available
  const headers = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    credentials: "include", // ensures cookie refresh also works
    ...options,
    headers,
  };

  try {
    let res = await fetch(BASE_URL + url, config);

    // If ok, return JSON
    if (res.ok) {
      return await res.json();
    }

    // If Unauthorized (token expired)
    if (res.status === 401) {
      // ⛔ If refresh already happening → queue this request
      if (isRefreshing) {
        return addToQueue((newToken) => {
          return httpFetch(url, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            },
          });
        });
      }

      // ⚠ Start refresh flow
      isRefreshing = true;

      try {
        const refreshRes = await fetch(`${BASE_URL}/super-admin/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!refreshRes.ok) {
          throw new Error("Refresh failed");
        }

        const data = await refreshRes.json();

        const newToken = data?.accessToken;
        if (!newToken) throw new Error("No token returned");

        // Save new token
        localStorage.setItem("accessToken", newToken);

        // Process queued requests
        processQueue(null, newToken);

        // Retry original request with new token
        return httpFetch(url, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
      } catch (error) {
        processQueue(error, null);
        localStorage.removeItem("accessToken");

        // Auto logout fallback
        if (typeof window !== "undefined") {
          window.location.href = "/super-admin/login";
        }

        throw error;
      } finally {
        isRefreshing = false;
      }
    }

    // If other error
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Request failed");
  } catch (error) {
    console.error("httpFetch Error:", error);
    throw error;
  }
}
