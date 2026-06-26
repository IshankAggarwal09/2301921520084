## Logging Middleware
Logging Middleware

Reusable logging package for AffordMed campus evaluation.

Sends structured log entries to the AffordMed evaluation server.

Setup

bashcd logging-middleware
# No npm install needed — zero dependencies

Set your API key in a .env file (in your backend or frontend app):

LOG_API_KEY=your_token_here

Usage

jsimport { configure, Log } from "logging-middleware";

// Call once at startup with your Bearer token
configure({ apiKey: process.env.LOG_API_KEY });

// Log(stack, level, package, message)
await Log("backend", "error",  "handler", "received string, expected bool");
await Log("backend", "fatal",  "db",      "Critical database connection failure.");
await Log("backend", "info",   "service", "User created: userId=42");
await Log("frontend", "warn",  "component", "Missing required prop in <Card />");

Adding to a project (local package)

In your backend or frontend package.json:

json{
  "dependencies": {
    "logging-middleware": "file:../logging-middleware"
  }
}

Then run npm install.

Allowed values

FieldValuesstackbackend, frontendleveldebug, info, warn, error, fatalpackage (backend)cache, controller, cron_job, db, domain, handler, repository, route, servicepackage (frontend)api, component, hook, page, state, stylepackage (both)auth, config, middleware, utils

Run tests

bashLOG_API_KEY=your_token node src/test.js