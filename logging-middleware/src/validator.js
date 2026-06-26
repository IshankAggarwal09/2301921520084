import { ALL_PACKAGES, BACKEND_PACKAGES, FRONTEND_PACKAGES, VALID_LEVELS, VALID_STACKS } from "./constants.js";

export function validate(stack, level, pkg, message) {
  if (!VALID_STACKS.includes(stack))
    throw new Error(`[logging-middleware] Invalid stack "${stack}". Allowed: ${VALID_STACKS.join(", ")}`);
  if (!VALID_LEVELS.includes(level))
    throw new Error(`[logging-middleware] Invalid level "${level}". Allowed: ${VALID_LEVELS.join(", ")}`);
  if (!ALL_PACKAGES.includes(pkg))
    throw new Error(`[logging-middleware] Invalid package "${pkg}".`);
  if (stack === "backend" && FRONTEND_PACKAGES.includes(pkg))
    throw new Error(`[logging-middleware] Package "${pkg}" is frontend-only.`);
  if (stack === "frontend" && BACKEND_PACKAGES.includes(pkg))
    throw new Error(`[logging-middleware] Package "${pkg}" is backend-only.`);
  if (!message || message.trim().length === 0)
    throw new Error(`[logging-middleware] Message must not be empty.`);
}
