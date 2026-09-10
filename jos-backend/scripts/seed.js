// Seeds MongoDB with every domain/skill/prompt/quiz/code-challenge that
// the jos-frontend fixtures (data/*.js) expect to find via
// /api/skills/by-slug/:domainSlug/:skillSlug. Question text, option
// order, and correctIndex values are kept identical to the frontend
// fixtures on purpose - grading happens server-side against these.
//
// Run with: npm run seed
require("dotenv").config();
const mongoose = require("mongoose");

const DomainSchema = new mongoose.Schema({ name: String, slug: String, description: String, order: Number });
const SkillSchema = new mongoose.Schema({
  domain: mongoose.Schema.Types.ObjectId,
  name: String,
  slug: String,
  description: String,
  order: Number,
  hasCodePractice: Boolean,
  language: String,
});
const PromptSchema = new mongoose.Schema({
  skill: mongoose.Schema.Types.ObjectId,
  type: String,
  promptText: String,
  note: String,
  order: Number,
});
const QuestionSchema = new mongoose.Schema(
  { questionText: String, options: [String], correctIndex: Number },
  { _id: false }
);
const QuizSchema = new mongoose.Schema({
  skill: mongoose.Schema.Types.ObjectId,
  type: String,
  questions: [QuestionSchema],
  coinReward: Number,
});
const CodeChallengeSchema = new mongoose.Schema({
  skill: mongoose.Schema.Types.ObjectId,
  title: String,
  description: String,
  language: String,
  starterCode: String,
});
const AchievementSchema = new mongoose.Schema({
  name: String,
  description: String,
  icon: String,
  criteriaKey: String,
});

const Domain = mongoose.model("Domain", DomainSchema);
const Skill = mongoose.model("Skill", SkillSchema);
const Prompt = mongoose.model("Prompt", PromptSchema);
const Quiz = mongoose.model("Quiz", QuizSchema);
const CodeChallenge = mongoose.model("CodeChallenge", CodeChallengeSchema);
const Achievement = mongoose.model("Achievement", AchievementSchema);

// ---- content ---------------------------------------------------------

const domainsData = [
  {
    name: "Web Development",
    slug: "web-development",
    description: "HTML, CSS, JavaScript, React, and the execution path from zero to a working app.",
    skills: [
      {
        slug: "html", name: "HTML", hasCodePractice: true, language: "html",
        description: "HyperText Markup Language - structure of the web, semantic layouts, and SEO baselines.",
        promptTitle: "AI TUTOR PROMPT - HTML",
        promptBody: "You are my personal HTML tutor. Teach me HTML one subtopic at a time (structure, semantics, forms, media, accessibility, SEO) - 5 quiz questions per subtopic, waiting for my answers before revealing correct ones.",
        codeChallenge: { title: "Semantic Profile Card", description: "Build a profile card using only semantic HTML.", starterCode: "<article>\n</article>\n" },
        practiceQuestions: [
          { questionText: "Which tag should wrap the main navigation links of a page?", options: ["<div>", "<nav>", "<section>", "<header>"], correctIndex: 1 },
          { questionText: "What does the alt attribute on an img do?", options: ["Sets file size", "Provides a text alternative", "Changes aspect ratio", "Adds a tooltip only"], correctIndex: 1 },
          { questionText: "Which element is correct for the main heading of a page?", options: ["<h6>", "<title>", "<h1>", "<strong>"], correctIndex: 2 },
        ],
        rewardQuestions: [
          { questionText: "Which doctype declaration is correct for HTML5?", options: ["<!DOCTYPE HTML5>", "<!DOCTYPE html>", "<!DOC html5>", "<html5>"], correctIndex: 1 },
          { questionText: "Which tag is the semantically correct wrapper for a blog post?", options: ["<div>", "<section>", "<article>", "<span>"], correctIndex: 2 },
          { questionText: "What is the correct input type for an email field?", options: ["text", "email", "mail", "string"], correctIndex: 1 },
          { questionText: "Which attribute associates a label with an input?", options: ["name", "id + for", "value", "class"], correctIndex: 1 },
          { questionText: "Which table element groups the header row?", options: ["<thead>", "<tbody>", "<tfoot>", "<th>"], correctIndex: 0 },
          { questionText: "Which meta tag most directly affects mobile responsiveness?", options: ["meta charset", "meta viewport", "meta description", "meta robots"], correctIndex: 1 },
          { questionText: "Best practice for a decorative image adding no information?", options: ["Omit img entirely", "Detailed alt text", "alt empty string", "Use a div background always"], correctIndex: 2 },
        ],
      },
      {
        slug: "css", name: "CSS", hasCodePractice: true, language: "css",
        description: "Cascading Style Sheets - advanced layouts (Flexbox, Grid), animations, and responsive design.",
        promptTitle: "AI TUTOR PROMPT - CSS",
        promptBody: "You are my personal CSS tutor. Teach me CSS one subtopic at a time (selectors, box model, display, positioning, flexbox, grid, responsive design, typography, transitions, variables) - 5 quiz questions per subtopic.",
        codeChallenge: { title: "Responsive Card Row", description: "Flexbox row of 3 cards, stacking on narrow screens.", starterCode: ".card-row {\n}\n" },
        practiceQuestions: [
          { questionText: "Which property includes border and padding in an element's width?", options: ["box-sizing: border-box;", "display: flex;", "width: auto;", "overflow: hidden;"], correctIndex: 0 },
          { questionText: "Which display value creates a flex container?", options: ["display: block;", "display: grid;", "display: flex;", "display: inline;"], correctIndex: 2 },
          { questionText: "Which position value scrolls normally then sticks past a threshold?", options: ["absolute", "fixed", "sticky", "relative"], correctIndex: 2 },
        ],
        rewardQuestions: [
          { questionText: "Which unit is relative to the root element's font size?", options: ["em", "rem", "vh", "px"], correctIndex: 1 },
          { questionText: "In Flexbox, which property aligns items along the cross axis?", options: ["justify-content", "align-items", "flex-direction", "gap"], correctIndex: 1 },
          { questionText: "Which Grid property defines named regions?", options: ["grid-template-areas", "grid-gap", "grid-auto-flow", "place-items"], correctIndex: 0 },
          { questionText: "Which pseudo-class targets the first child?", options: [":first-of-type", ":first-child", ":nth-child(0)", ":before"], correctIndex: 1 },
          { questionText: "What does a CSS custom property declaration look like?", options: ["--main-color: blue;", "$main-color: blue;", "@main-color: blue;", "#main-color: blue;"], correctIndex: 0 },
          { questionText: "Which media feature targets narrow viewports?", options: ["(min-width: 640px)", "(max-width: 640px)", "(orientation: landscape)", "(prefers-color-scheme: dark)"], correctIndex: 1 },
          { questionText: "Which property animates smoothly between states on hover?", options: ["animation-name", "transition", "transform-origin", "will-change"], correctIndex: 1 },
        ],
      },
      {
        slug: "javascript", name: "JavaScript", hasCodePractice: true, language: "javascript",
        description: "Modern ES6+, DOM manipulation, asynchronous programming, and API integration.",
        promptTitle: "AI TUTOR PROMPT - JavaScript",
        promptBody: "You are my personal JavaScript tutor. Teach me JS one subtopic at a time (variables, functions, arrays, objects, DOM, template literals, promises/async, fetch, error handling, modules) - 5 quiz questions per subtopic.",
        codeChallenge: { title: "Fetch & Render", description: "Async loadUsers() fetching /api/users with try/catch, returning lowercase names.", starterCode: "async function loadUsers() {\n}\n" },
        practiceQuestions: [
          { questionText: "Which keyword declares a block-scoped, reassignable variable?", options: ["const", "var", "let", "function"], correctIndex: 2 },
          { questionText: "Which array method returns a new array with each item transformed?", options: ["forEach", "map", "filter", "reduce"], correctIndex: 1 },
          { questionText: "What does await do inside an async function?", options: ["Pauses until the promise resolves", "Cancels the promise", "Converts a callback to a promise", "Runs synchronously before start"], correctIndex: 0 },
        ],
        rewardQuestions: [
          { questionText: "Which method attaches a click handler to btn?", options: ["btn.click()", "btn.addEventListener('click', fn)", "btn.on('click', fn)", "btn.onClick = fn()"], correctIndex: 1 },
          { questionText: "Which array method reduces a list to one accumulated value?", options: ["map", "filter", "reduce", "find"], correctIndex: 2 },
          { questionText: "What does fetch() return?", options: ["A JSON object directly", "A Promise resolving to a Response", "A string", "An XMLHttpRequest"], correctIndex: 1 },
          { questionText: "Which destructures name from object user?", options: ["const name = user[0];", "const { name } = user;", "const name = user.get('name');", "const [name] = user;"], correctIndex: 1 },
          { questionText: "Which block catches an error thrown in try?", options: ["finally", "catch", "throw", "else"], correctIndex: 1 },
          { questionText: "What does JSON.parse() do?", options: ["Converts an object to a string", "Converts a JSON string to a JS object", "Validates JSON only", "Sends a network request"], correctIndex: 1 },
          { questionText: "Which keyword exports a function as a module's default export?", options: ["export default", "module.exports.default", "export.default", "public export"], correctIndex: 0 },
        ],
      },
      {
        slug: "react", name: "React", hasCodePractice: true, language: "javascript",
        description: "Component-based UI, hooks, and state management for modern single-page apps.",
        promptTitle: "AI TUTOR PROMPT - React",
        promptBody: "You are my personal React tutor. Teach me React one subtopic at a time (components/JSX, props, useState, lists/keys, useEffect, data fetching, lifting state, conditional rendering, styling, common pitfalls) - 5 quiz questions per subtopic.",
        codeChallenge: { title: "Coin Counter Component", description: "CoinCounter with initialCoins prop and a button incrementing by 10 via useState.", starterCode: "function CoinCounter({ initialCoins }) {\n}\n" },
        practiceQuestions: [
          { questionText: "What does useState return?", options: ["Just the current value", "A [value, setter] pair", "A promise", "An object with .value/.set()"], correctIndex: 1 },
          { questionText: "Why does a rendered list need a key prop?", options: ["Required for CSS", "Helps React track changed/added/removed items", "Sets tab order", "Optional decoration"], correctIndex: 1 },
          { questionText: "When does useEffect with an empty array run?", options: ["Every render", "Never", "Once, after first render", "Only on unmount"], correctIndex: 2 },
        ],
        rewardQuestions: [
          { questionText: "What is JSX?", options: ["A templating language separate from JS", "A syntax extension for HTML-like markup in JS", "A CSS preprocessor", "A React-only file type unrelated to JS"], correctIndex: 1 },
          { questionText: "How does a child receive data from its parent?", options: ["Global variables", "props", "useEffect", "Direct DOM access"], correctIndex: 1 },
          { questionText: "What triggers a re-render?", options: ["Only a page refresh", "State or props changing", "Only clicking a button", "Nothing, it's static"], correctIndex: 1 },
          { questionText: "Which hook runs code after the DOM updates?", options: ["useState", "useEffect", "useMemo", "useRef"], correctIndex: 1 },
          { questionText: "What's wrong with calling useState inside an if block?", options: ["Nothing", "Hooks must run in the same order every render", "Only a minor perf issue", "Only a style preference"], correctIndex: 1 },
          { questionText: "How do you conditionally render based on isLoading?", options: ["if (isLoading) return <Spinner />", "Not possible in React", "Only with CSS display:none", "Only with switch"], correctIndex: 0 },
          { questionText: "What does 'lifting state up' mean?", options: ["Moving state to a global variable", "Moving shared state to the closest common parent", "Storing state in localStorage", "Removing state entirely"], correctIndex: 1 },
        ],
      },
    ],
  },
  {
    name: "Backend Engineering",
    slug: "backend-engineering",
    description: "Node.js, Express, REST API design, and MongoDB - the architecture behind JOs itself.",
    skills: [
      {
        slug: "nodejs", name: "Node.js", hasCodePractice: true, language: "javascript",
        description: "The JavaScript runtime that powers JOs's own backend - event loop, modules, and npm.",
        promptTitle: "AI TUTOR PROMPT - Node.js",
        promptBody: "You are my personal Node.js tutor. Teach me Node one subtopic at a time (runtime basics, modules, event loop, npm, fs, env vars, HTTP server, streams, error handling, debugging) - 5 quiz questions per subtopic.",
        codeChallenge: { title: "Env-Aware Config Loader", description: "loadConfig() reads PORT from process.env, defaults to 3000.", starterCode: "function loadConfig() {\n}\n" },
        practiceQuestions: [
          { questionText: "What makes Node handle many requests without multiple threads?", options: ["Multithreading by default", "The non-blocking event loop", "It doesn't handle concurrency", "Manual thread pools"], correctIndex: 1 },
          { questionText: "Which object exposes environment variables?", options: ["global.env", "process.env", "require('env')", "window.env"], correctIndex: 1 },
          { questionText: "Which file declares a Node project's dependencies?", options: ["package.json", "node.config", "index.js", "requirements.txt"], correctIndex: 0 },
        ],
        rewardQuestions: [
          { questionText: "Which keyword loads a module via CommonJS?", options: ["import", "require", "include", "using"], correctIndex: 1 },
          { questionText: "Which module reads files from disk?", options: ["http", "path", "fs", "os"], correctIndex: 2 },
          { questionText: "What does an error-first callback's first argument represent?", options: ["The result", "An error, or null if none", "A promise", "Always undefined"], correctIndex: 1 },
          { questionText: "Which npm command installs dependencies from package.json?", options: ["npm start", "npm install", "npm build", "npm run"], correctIndex: 1 },
          { questionText: "What does npm run dev typically do?", options: ["Installs Node itself", "Runs the dev script in package.json", "Publishes to npm", "Deletes node_modules"], correctIndex: 1 },
          { questionText: "Which global gives the current file's directory path?", options: ["process.cwd() only", "__dirname", "this.path", "No such global"], correctIndex: 1 },
          { questionText: "Why is synchronous file I/O risky in a busy server?", options: ["It isn't risky", "It blocks the single event loop thread", "Only works on Windows", "Auto-retries forever"], correctIndex: 1 },
        ],
      },
      {
        slug: "expressjs", name: "Express.js", hasCodePractice: true, language: "javascript",
        description: "The minimal web framework for routing, middleware, and REST APIs on Node.",
        promptTitle: "AI TUTOR PROMPT - Express.js",
        promptBody: "You are my personal Express.js tutor. Teach me Express one subtopic at a time (routes, params, middleware, express.json, Router, error handling, status codes, validation, CORS, project structure) - 5 quiz questions per subtopic.",
        codeChallenge: { title: "Skill Router", description: "Express router with GET /skills and GET /skills/:id (404 if missing).", starterCode: "const express = require('express');\nconst router = express.Router();\nmodule.exports = router;\n" },
        practiceQuestions: [
          { questionText: "Which method registers a handler for GET /skills?", options: ["app.post('/skills')", "app.get('/skills')", "app.route('/skills')", "app.use('/skills')"], correctIndex: 1 },
          { questionText: "Which middleware parses a JSON request body?", options: ["express.static()", "express.json()", "express.Router()", "express.urlencoded"], correctIndex: 1 },
          { questionText: "In /skills/:id, how do you read id?", options: ["req.query.id", "req.params.id", "req.body.id", "req.id"], correctIndex: 1 },
        ],
        rewardQuestions: [
          { questionText: "What does calling next() in middleware do?", options: ["Ends the response", "Passes control to the next handler", "Restarts the server", "Logs the request"], correctIndex: 1 },
          { questionText: "Which status code fits a resource not found?", options: ["200", "301", "404", "500"], correctIndex: 2 },
          { questionText: "What does express.Router() help with?", options: ["Database connections", "Splitting routes into modular files", "CSS bundling", "Caching responses"], correctIndex: 1 },
          { questionText: "Where should a centralized error handler go?", options: ["Before all routes", "As the very last app.use()", "Inside every route only", "It's not needed"], correctIndex: 1 },
          { questionText: "Which status range represents client errors?", options: ["1xx", "2xx", "3xx", "4xx"], correctIndex: 3 },
          { questionText: "When does app.use(middleware) with no path run?", options: ["Never", "Only on POST", "On every request", "Only at server start"], correctIndex: 2 },
          { questionText: "Risk of forgetting next() in non-terminal middleware?", options: ["Nothing, it's automatic", "Request hangs, no response sent", "Skips to error handler", "Only affects logging"], correctIndex: 1 },
        ],
      },
      {
        slug: "rest-apis", name: "REST APIs", hasCodePractice: true, language: "javascript",
        description: "Resource-oriented API design: methods, status codes, and versioning clients can rely on.",
        promptTitle: "AI TUTOR PROMPT - REST API Design",
        promptBody: "You are my personal API design tutor. Teach me REST design one subtopic at a time (resource naming, HTTP methods, status codes, body design, pagination, filtering, versioning, idempotency, auth, docs) - 5 quiz questions per subtopic.",
        codeChallenge: { title: "Paginated Endpoint", description: "GET /skills supporting page and limit query params returning sliced array plus totals.", starterCode: "app.get('/skills', (req, res) => {\n});\n" },
        practiceQuestions: [
          { questionText: "Which status code fits successful resource creation?", options: ["200", "201", "202", "204"], correctIndex: 1 },
          { questionText: "Which HTTP method fully replaces a resource?", options: ["PATCH", "POST", "PUT", "GET"], correctIndex: 2 },
          { questionText: "Which is the more RESTful URL for a single skill?", options: ["/getSkill?id=5", "/skills/5", "/skill_data/5", "/api?action=skill&id=5"], correctIndex: 1 },
        ],
        rewardQuestions: [
          { questionText: "Which status code means no content after a successful delete?", options: ["200", "201", "204", "404"], correctIndex: 2 },
          { questionText: "Which method should be idempotent - same effect called twice?", options: ["POST", "PUT", "Neither", "Both equally non-idempotent"], correctIndex: 1 },
          { questionText: "Which query params implement offset-based pagination?", options: ["?sort=&filter=", "?page=&limit=", "?id=&type=", "?token=&scope="], correctIndex: 1 },
          { questionText: "Which status range indicates a server-side failure?", options: ["2xx", "3xx", "4xx", "5xx"], correctIndex: 3 },
          { questionText: "Which is a common API versioning approach?", options: ["Renaming the database", "Prefixing routes with /v1/", "Never changing the API", "Random route names"], correctIndex: 1 },
          { questionText: "Why should DELETE be safe to retry?", options: ["It shouldn't be", "A retried request after a timeout should stay safe", "Idempotency doesn't apply to DELETE", "Only GET needs it"], correctIndex: 1 },
          { questionText: "Why return a consistent error envelope across endpoints?", options: ["Required by HTTP", "Clients can handle errors generically", "Makes responses smaller", "Purely cosmetic"], correctIndex: 1 },
        ],
      },
      {
        slug: "mongodb", name: "MongoDB", hasCodePractice: true, language: "javascript",
        description: "Document modeling, queries, and indexes - the database behind JOs itself.",
        promptTitle: "AI TUTOR PROMPT - MongoDB",
        promptBody: "You are my personal MongoDB tutor. Teach me MongoDB one subtopic at a time (documents/BSON, insert, find/query operators, update, delete, embedding vs referencing, Mongoose, indexes, aggregation, Atlas connection) - 5 quiz questions per subtopic.",
        codeChallenge: { title: "Progress Query", description: "Mongoose query: Progress docs for a userId where status is completed, sorted by completedAt desc.", starterCode: "async function getCompletedProgress(userId) {\n}\n" },
        practiceQuestions: [
          { questionText: "What format does MongoDB store documents in internally?", options: ["XML", "CSV", "BSON", "YAML"], correctIndex: 2 },
          { questionText: "Which method inserts a single document?", options: ["insertOne()", "addOne()", "createDoc()", "push()"], correctIndex: 0 },
          { questionText: "Which operator matches values greater than a number?", options: ["$gt", "$more", "$above", "$max"], correctIndex: 0 },
        ],
        rewardQuestions: [
          { questionText: "Which update operator sets a field's value?", options: ["$push", "$set", "$inc", "$pull"], correctIndex: 1 },
          { questionText: "Key benefit of embedding related data in one document?", options: ["Always less disk space", "Fewer queries for related data", "Removes need for indexes", "Prevents duplication automatically"], correctIndex: 1 },
          { questionText: "What does an index primarily improve?", options: ["Write speed only", "Query lookup speed", "Document size", "Backup frequency"], correctIndex: 1 },
          { questionText: "Which aggregation stage groups documents by a field?", options: ["$match", "$group", "$project", "$sort"], correctIndex: 1 },
          { questionText: "In Mongoose, what does a Schema define?", options: ["Only validation", "The shape/types of documents", "The connection string", "The server port"], correctIndex: 1 },
          { questionText: "Which query finds documents where a field is one of several values?", options: ["status $in array", "status $all array", "status $eq array", "status as plain array"], correctIndex: 0 },
          { questionText: "Why reference (not embed) a growing list of a User's Progress docs?", options: ["Embedding is always better", "Unbounded arrays make documents too large/slow", "Referencing isn't supported", "No effect either way"], correctIndex: 1 },
        ],
      },
    ],
  },
  {
    name: "Cyber Security",
    slug: "cyber-security",
    description: "Linux hardening, the OWASP Top 10, and the habits that keep an application safe.",
    skills: [
      {
        slug: "linux-hardening", name: "Linux Hardening", hasCodePractice: true, language: "bash",
        description: "User/permission management, firewalls, and service hardening on Linux systems.",
        promptTitle: "AI TUTOR PROMPT - Linux Hardening",
        promptBody: "You are my personal Linux security tutor. Teach me one subtopic at a time (permissions, chmod/chown, sudo, account lockdown, firewall, service hardening, SSH hardening, checksums, logs) - 5 quiz questions per subtopic.",
        codeChallenge: { title: "Lock Down a Shared Directory", description: "Create group students, set /data/reports group ownership, group rw / others none.", starterCode: "# your commands here\n" },
        practiceQuestions: [
          { questionText: "What does chmod 750 file.sh grant to other?", options: ["Read only", "Read and execute", "Nothing", "Full access"], correctIndex: 2 },
          { questionText: "Which command changes a file's owning user?", options: ["chgrp", "chown", "chmod", "passwd"], correctIndex: 1 },
          { questionText: "What is the principle of least privilege?", options: ["Give every account root for convenience", "Give accounts only the access they need", "Disable all accounts forever", "Only applies to servers"], correctIndex: 1 },
        ],
        rewardQuestions: [
          { questionText: "What does rwxr-xr-- mean for other?", options: ["Read, write, execute", "Read only", "Execute only", "No access"], correctIndex: 1 },
          { questionText: "Which command adds a user to a group without removing existing memberships?", options: ["usermod -g students name", "usermod -aG students name", "groupadd students name", "chown students name"], correctIndex: 1 },
          { questionText: "Why disable password-based SSH login in favor of keys?", options: ["Keys are shorter to type", "Passwords are far more vulnerable to brute-force", "Required by all distros", "No real security benefit"], correctIndex: 1 },
          { questionText: "Default-deny with explicit allow rules is which model?", options: ["A blocklist model", "A default-deny (allowlist) model", "No real model", "Audit-only model"], correctIndex: 1 },
          { questionText: "What does sha256sum typically verify?", options: ["A file's permissions", "A file's integrity", "A file's owner", "Compression ratio"], correctIndex: 1 },
          { questionText: "Why disable direct root login over SSH?", options: ["Root accounts don't exist on Linux", "Removes a high-value target from remote attack surface", "Only a perf optimization", "No security implication"], correctIndex: 1 },
          { questionText: "Standard place to check Linux system/auth logs?", options: ["/tmp", "/var/log", "/etc", "/usr/log"], correctIndex: 1 },
        ],
      },
      {
        slug: "owasp-top-10", name: "OWASP Top 10", hasCodePractice: true, language: "javascript",
        description: "Injection, broken auth, XSS, CSRF - common web vulnerabilities and how to prevent them.",
        promptTitle: "AI TUTOR PROMPT - OWASP Top 10",
        promptBody: "You are my personal web security tutor. Teach me one subtopic at a time (injection, broken auth, sensitive data, access control, misconfiguration, XSS, deserialization, dependency hygiene, CSRF) - 5 quiz questions per subtopic.",
        codeChallenge: { title: "Fix the Vulnerable Login Query", description: "Rewrite a string-concatenated SQL query into a parameterized query.", starterCode: "function getUser(db, username, password) {\n  var query = \"SELECT * FROM users WHERE username = '\" + username + \"'\";\n  return db.query(query);\n}\n" },
        practiceQuestions: [
          { questionText: "What is SQL injection?", options: ["A database backup technique", "Manipulating a query via injected untrusted input", "A firewall rule type", "A CSS exploit"], correctIndex: 1 },
          { questionText: "How should passwords be stored?", options: ["Plain text", "Encrypted, reversibly", "Hashed with a strong, salted algorithm", "Base64 encoded"], correctIndex: 2 },
          { questionText: "What is reflected XSS?", options: ["A script permanently stored and served to every visitor", "Untrusted request input echoed back as script immediately", "A network-level attack unrelated to the browser", "A CSS-only vulnerability"], correctIndex: 1 },
        ],
        rewardQuestions: [
          { questionText: "What's wrong with hiding an admin button in the UI as the only access control?", options: ["Nothing, sufficient", "Server must also enforce it - client hiding is bypassable", "Slower than a server check", "No relation to security"], correctIndex: 1 },
          { questionText: "What does a parameterized query prevent?", options: ["Network latency", "Input being interpreted as part of the SQL command", "Database backups failing", "CSS injection"], correctIndex: 1 },
          { questionText: "What is CSRF?", options: ["Stealing a password directly", "Tricking a logged-in user's browser into an unwanted request", "A type of SQL injection", "A denial-of-service attack"], correctIndex: 1 },
          { questionText: "Which cookie attribute helps prevent CSRF?", options: ["HttpOnly", "Secure", "SameSite", "Max-Age"], correctIndex: 2 },
          { questionText: "What does a Content-Security-Policy header mitigate?", options: ["SQL injection", "XSS, by restricting executable resources", "Brute-force logins", "DNS spoofing"], correctIndex: 1 },
          { questionText: "Why is a default admin credential left on dangerous?", options: ["It isn't, defaults are safe", "Attackers try known defaults first, no code bug needed", "Only affects performance", "Client-side-only issue"], correctIndex: 1 },
          { questionText: "Why are vulnerable dependencies on the OWASP list?", options: ["Unpatched third-party flaws carry into your app", "Open-source is never vulnerable", "Only matters for paid libraries", "Purely a licensing concern"], correctIndex: 0 },
        ],
      },
    ],
  },
  {
    name: "Data Science & AI",
    slug: "data-science-ai",
    description: "NumPy, pandas data cleaning, and the core ideas behind supervised machine learning.",
    skills: [
      {
        slug: "numpy-pandas", name: "NumPy & pandas", hasCodePractice: true, language: "python",
        description: "Vectorized computation with NumPy and data cleaning/analysis pipelines with pandas.",
        promptTitle: "AI TUTOR PROMPT - NumPy & pandas",
        promptBody: "You are my personal data science tutor. Teach me one subtopic at a time (ndarrays, indexing, broadcasting, stats, reading CSVs, filtering, missing data, groupby, merging, exporting) - 5 quiz questions per subtopic.",
        codeChallenge: { title: "Clean the Student Scores CSV", description: "Drop rows with missing scores, return average rounded to 1 decimal.", starterCode: "import pandas as pd\n\ndef average_score(df):\n    pass\n" },
        practiceQuestions: [
          { questionText: "Main advantage of a NumPy array over a Python list for numeric work?", options: ["Can hold mixed types", "Vectorized ops are much faster than pure Python loops", "Uses more memory intentionally", "No real advantage"], correctIndex: 1 },
          { questionText: "Which pandas method reads a CSV into a DataFrame?", options: ["pd.load_csv()", "pd.read_csv()", "pd.open_csv()", "pd.csv()"], correctIndex: 1 },
          { questionText: "Which method removes rows with any missing values?", options: ["df.fillna()", "df.dropna()", "df.isna()", "df.clean()"], correctIndex: 1 },
        ],
        rewardQuestions: [
          { questionText: "What does NumPy broadcasting allow?", options: ["Sending arrays over a network", "Operating on differently-shaped compatible arrays without loops", "Converting arrays to strings", "Not a NumPy concept"], correctIndex: 1 },
          { questionText: "Which pandas accessor selects by label, not integer position?", options: [".iloc", ".loc", ".at", ".values"], correctIndex: 1 },
          { questionText: "Which method fills missing values with a constant?", options: ["df.dropna()", "df.fillna(value)", "df.isna()", "df.replace_missing()"], correctIndex: 1 },
          { questionText: "What does groupby category then mean on score compute?", options: ["Overall mean of all scores", "Mean score within each category group", "Row count per category", "A random sample per category"], correctIndex: 1 },
          { questionText: "Which computes the mean along an axis of a 2D array?", options: ["np.mean(arr, axis=0)", "np.total(arr)", "np.average_axis(arr)", "np.sum_mean(arr)"], correctIndex: 0 },
          { questionText: "Risk of silently using fillna(0) on a numeric column?", options: ["No risk", "Zero may not be meaningful, skews statistics", "Changes the column's name", "Deletes the column"], correctIndex: 1 },
          { questionText: "Which function joins two DataFrames on a shared key, like SQL?", options: ["pd.concat() only", "pd.merge()", "pd.split()", "pd.stack()"], correctIndex: 1 },
        ],
      },
      {
        slug: "ml-concepts", name: "ML Concepts", hasCodePractice: true, language: "python",
        description: "Supervised vs unsupervised learning, train/test splits, and how to evaluate a model honestly.",
        promptTitle: "AI TUTOR PROMPT - ML Concepts",
        promptBody: "You are my personal ML tutor. Teach me one subtopic at a time (supervised vs unsupervised, classification vs regression, features/labels, train/test split, overfitting, metrics, scikit-learn, cross-validation, scaling, confusion matrix) - 5 quiz questions per subtopic.",
        codeChallenge: { title: "Train/Test Split", description: "80/20 split of X, y with random_state=42 using scikit-learn.", starterCode: "from sklearn.model_selection import train_test_split\n\ndef split_data(X, y):\n    pass\n" },
        practiceQuestions: [
          { questionText: "What distinguishes supervised from unsupervised learning?", options: ["Supervised uses labeled data; unsupervised doesn't", "Supervised is always faster", "Unsupervised requires more labels", "No real difference"], correctIndex: 0 },
          { questionText: "Predicting a house's price (a continuous number) is:", options: ["Classification", "Regression", "Clustering", "Unsupervised learning"], correctIndex: 1 },
          { questionText: "Why split data into train/test sets?", options: ["Makes training faster only", "Evaluate on unseen data to estimate real performance", "Unnecessary if the model is simple", "Reduces file size"], correctIndex: 1 },
        ],
        rewardQuestions: [
          { questionText: "What is overfitting?", options: ["Good on training data, poor on new data", "A model too simple to learn anything", "A model that trains too fast", "Too many features"], correctIndex: 0 },
          { questionText: "When is recall more important than precision?", options: ["Never", "When missing a positive case is costly (e.g. disease detection)", "When there are no positive cases", "They're always equal"], correctIndex: 1 },
          { questionText: "What does a confusion matrix show?", options: ["Training time", "Counts of true/false positives and negatives", "Feature correlations", "Number of missing values"], correctIndex: 1 },
          { questionText: "Why scale features before training some models?", options: ["Purely cosmetic", "Features on different ranges can unfairly dominate distance/weight calcs", "Required by Python syntax", "Changes the labels"], correctIndex: 1 },
          { questionText: "What is k-fold cross-validation primarily used for?", options: ["Speeding up training", "A more reliable performance estimate across multiple splits", "Increasing dataset size", "Removing outliers automatically"], correctIndex: 1 },
          { questionText: "Which scikit-learn function creates a basic logistic regression classifier?", options: ["LinearRegression()", "LogisticRegression()", "KMeans()", "train_test_split()"], correctIndex: 1 },
          { questionText: "95% accuracy on data that's 95% one class is:", options: ["Definitely excellent", "Potentially misleading - hides poor minority-class performance", "Impossible", "Only a regression concern"], correctIndex: 1 },
        ],
      },
    ],
  },
];

const achievementsData = [
  { name: "First Steps", description: "Complete your first skill's Zero to Skill journey.", icon: "\ud83c\udf31", criteriaKey: "skills_completed_1" },
  { name: "Domain Explorer", description: "Complete a skill in three different domains.", icon: "\ud83e\udded", criteriaKey: "domains_touched_3" },
  { name: "7-Day Streak", description: "Stay active on JOs for 7 days in a row.", icon: "\ud83d\udd25", criteriaKey: "streak_7" },
  { name: "Coin Collector", description: "Earn 500 coins from reward quizzes.", icon: "\ud83e\ude99", criteriaKey: "coins_500" },
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected. Clearing existing content collections...");

  await Promise.all([
    Domain.deleteMany({}),
    Skill.deleteMany({}),
    Prompt.deleteMany({}),
    Quiz.deleteMany({}),
    CodeChallenge.deleteMany({}),
    Achievement.deleteMany({}),
  ]);

  const summary = { domains: [] };

  for (let d = 0; d < domainsData.length; d++) {
    const domainData = domainsData[d];
    const domain = await Domain.create({
      name: domainData.name,
      slug: domainData.slug,
      description: domainData.description,
      order: d + 1,
    });

    const domainSummary = { slug: domain.slug, id: domain._id.toString(), skills: [] };

    for (let s = 0; s < domainData.skills.length; s++) {
      const skillData = domainData.skills[s];
      const skill = await Skill.create({
        domain: domain._id,
        name: skillData.name,
        slug: skillData.slug,
        description: skillData.description,
        order: s + 1,
        hasCodePractice: skillData.hasCodePractice,
        language: skillData.language,
      });

      await Prompt.create({
        skill: skill._id,
        type: "good",
        promptText: skillData.promptBody,
        note: skillData.promptTitle,
        order: 1,
      });

      if (skillData.hasCodePractice && skillData.codeChallenge) {
        await CodeChallenge.create({
          skill: skill._id,
          title: skillData.codeChallenge.title,
          description: skillData.codeChallenge.description,
          language: skillData.language,
          starterCode: skillData.codeChallenge.starterCode,
        });
      }

      await Quiz.create({ skill: skill._id, type: "practice", questions: skillData.practiceQuestions, coinReward: 0 });
      await Quiz.create({ skill: skill._id, type: "reward", questions: skillData.rewardQuestions, coinReward: 50 });

      domainSummary.skills.push({ slug: skill.slug, id: skill._id.toString() });
    }

    summary.domains.push(domainSummary);
  }

  await Achievement.insertMany(achievementsData);

  const totalSkills = domainsData.reduce((n, d) => n + d.skills.length, 0);
  console.log("Seeded " + domainsData.length + " domains, " + totalSkills + " skills, " + achievementsData.length + " achievements.");
  console.log("Domain/skill IDs (for manual API testing):");
  console.log(JSON.stringify(summary, null, 2));

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
