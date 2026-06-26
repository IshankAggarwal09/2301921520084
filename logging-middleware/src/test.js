import { configure, Log } from "./index.js";

configure({ apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJjc2FpMjMxMDZAZ2xiaXRtLmFjLmluIiwiZXhwIjoxNzgyNDUzOTcxLCJpYXQiOjE3ODI0NTMwNzEsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJlZjc4Y2M3MS0zNjlkLTQ2NTItOGNmYS0xMDBjZDNhZmE2ODkiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJpc2hhbmsgYWdnYXJ3YWwiLCJzdWIiOiIwMmZhYzc4NS0wYjk1LTQwZDMtYjkwMi01MWFhYmU0MDBiMzkifSwiZW1haWwiOiJjc2FpMjMxMDZAZ2xiaXRtLmFjLmluIiwibmFtZSI6ImlzaGFuayBhZ2dhcndhbCIsInJvbGxObyI6IjIzMDE5MjE1MjAwODQiLCJhY2Nlc3NDb2RlIjoieHhrSm5rIiwiY2xpZW50SUQiOiIwMmZhYzc4NS0wYjk1LTQwZDMtYjkwMi01MWFhYmU0MDBiMzkiLCJjbGllbnRTZWNyZXQiOiJwSnJLeldUS3VEZGJoVlRTIn0.Wg7XMYQz0ngrs6N8qfBbLhVYQiBh4FT9kS_0BxPlzGc" });

const r1 = await Log("BACKEND", "error", "handler", "bad casing");
console.log("Invalid stack (expect null):", r1);

const r2 = await Log("backend", "info", "component", "wrong pkg");
console.log("Frontend pkg on backend (expect null):", r2);

const r3 = await Log("backend", "error", "handler", "received string, expected bool");
console.log("Real log result:", r3);

const r4 = await Log("backend", "fatal", "db", "Critical database connection failure.");
console.log("Real log result:", r4);