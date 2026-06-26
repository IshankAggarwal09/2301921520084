export const VALID_STACKS = ["backend", "frontend"];
export const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
export const BACKEND_PACKAGES = ["cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service"];
export const FRONTEND_PACKAGES = ["api", "component", "hook", "page", "state", "style"];
export const SHARED_PACKAGES = ["auth", "config", "middleware", "utils"];
export const ALL_PACKAGES = [...BACKEND_PACKAGES, ...FRONTEND_PACKAGES, ...SHARED_PACKAGES];
export const LOG_API_URL = "http://4.224.186.213/evaluation-service/logs";
