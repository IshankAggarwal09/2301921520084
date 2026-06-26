import { LOG_API_URL } from "./constants.js";
import { validate } from "./validator.js";

let _apiUrl = LOG_API_URL;
let _apiKey = "";

export function configure({ apiUrl, apiKey } = {}) {
  if (apiUrl !== undefined) _apiUrl = apiUrl;
  if (apiKey !== undefined) _apiKey = apiKey;
}

export async function Log(stack, level, pkg, message) {
  try {
    validate(stack, level, pkg, message);
  } catch (err) {
    console.error(err.message);
    return null;
  }

  const headers = { "Content-Type": "application/json" };
  if (_apiKey) headers["Authorization"] = `Bearer ${_apiKey}`;

  try {
    const response = await fetch(_apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });

    if (!response.ok) {
      console.error(`[logging-middleware] API error ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error(`[logging-middleware] Network error: ${err.message}`);
    return null;
  }
}
