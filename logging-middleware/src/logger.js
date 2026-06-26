import { LOG_API_URL } from "./constants.js";
import { validate } from "./validator.js";

let _apiUrl = LOG_API_URL;
let _apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJjc2FpMjMxMDZAZ2xiaXRtLmFjLmluIiwiZXhwIjoxNzgyNDUzOTcxLCJpYXQiOjE3ODI0NTMwNzEsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJlZjc4Y2M3MS0zNjlkLTQ2NTItOGNmYS0xMDBjZDNhZmE2ODkiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJpc2hhbmsgYWdnYXJ3YWwiLCJzdWIiOiIwMmZhYzc4NS0wYjk1LTQwZDMtYjkwMi01MWFhYmU0MDBiMzkifSwiZW1haWwiOiJjc2FpMjMxMDZAZ2xiaXRtLmFjLmluIiwibmFtZSI6ImlzaGFuayBhZ2dhcndhbCIsInJvbGxObyI6IjIzMDE5MjE1MjAwODQiLCJhY2Nlc3NDb2RlIjoieHhrSm5rIiwiY2xpZW50SUQiOiIwMmZhYzc4NS0wYjk1LTQwZDMtYjkwMi01MWFhYmU0MDBiMzkiLCJjbGllbnRTZWNyZXQiOiJwSnJLeldUS3VEZGJoVlRTIn0.Wg7XMYQz0ngrs6N8qfBbLhVYQiBh4FT9kS_0BxPlzGc";

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