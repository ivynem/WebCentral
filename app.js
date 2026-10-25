const databaseStatus = document.querySelector("#db-status");
const databaseDetail = document.querySelector("#db-detail");
const databaseDot = document.querySelector("#db-status-dot");
const databaseButton = document.querySelector("#check-database");
const databaseButtonLabel = databaseButton?.querySelector(".button-label");
const pageLoader = document.querySelector("#page-loader");
const themeToggle = document.querySelector("#theme-toggle");

const environmentName =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "Local development"
    : "Hosted preview";

async function checkDatabase() {
  if (!databaseButton || !databaseStatus || !databaseDetail || !databaseDot) {
    return;
  }

  databaseButton.disabled = true;
  databaseButton.classList.add("is-checking");
  databaseButton.setAttribute("aria-busy", "true");
  if (databaseButtonLabel)
    databaseButtonLabel.textContent = "Checking connection";
  databaseStatus.textContent = "Checking…";
  databaseDetail.textContent = "Running a server-side PostgreSQL health query";
  databaseDot.className = "status-dot is-pending";

  try {
    const response = await fetch("/api/health", {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    const result = await response.json();

    if (!response.ok || result.database !== "connected") {
      throw new Error("Database unavailable");
    }

    databaseStatus.textContent = "Connected";
    databaseDetail.textContent = `SELECT 1 passed · ${environmentName}`;
    databaseDot.className = "status-dot is-ok";
  } catch {
    databaseStatus.textContent = "Not connected";
    databaseDetail.textContent =
      environmentName === "Local development"
        ? "Start Docker Compose and check DATABASE_URL."
        : "Preview is unavailable or its DATABASE_URL needs attention.";
    databaseDot.className = "status-dot is-error";
  } finally {
    databaseButton.disabled = false;
    databaseButton.classList.remove("is-checking");
    databaseButton.removeAttribute("aria-busy");
    if (databaseButtonLabel) databaseButtonLabel.textContent = "Check again";
  }
}

if (databaseButton) {
  databaseButton.addEventListener("click", checkDatabase);
  checkDatabase();
}

const navigationLinks = [
  ...document.querySelectorAll(".primary-nav .nav-link"),
];
for (const link of navigationLinks) {
  const currentPath = window.location.pathname;
  const targetPath = new URL(link.href).pathname;
  if (currentPath === targetPath) {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  }
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (!themeToggle) return;
  const dark = theme === "dark";
  themeToggle.textContent = dark ? "☀" : "☾";
  themeToggle.setAttribute(
    "aria-label",
    dark ? "Switch to light theme" : "Switch to dark theme",
  );
  themeToggle.setAttribute("aria-pressed", String(dark));
  themeToggle.title = dark ? "Switch to light theme" : "Switch to dark theme";
}

let savedTheme = "light";
try {
  savedTheme =
    localStorage.getItem("forgedesk-theme") === "dark" ? "dark" : "light";
} catch {
  // Theme preference is optional when browser storage is unavailable.
}
setTheme(savedTheme);

themeToggle?.addEventListener("click", () => {
  const nextTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  try {
    localStorage.setItem("forgedesk-theme", nextTheme);
  } catch {
    // The selected theme still applies for this page view.
  }
});

function showPageLoader() {
  if (pageLoader) pageLoader.hidden = false;
}

function hidePageLoader() {
  if (pageLoader) pageLoader.hidden = true;
  document.body.classList.remove("is-transitioning");
}

showPageLoader();
window.setTimeout(hidePageLoader, 340);

for (const link of document.querySelectorAll(
  'a[href]:not([target="_blank"])',
)) {
  link.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin) return;
    if (destination.pathname === window.location.pathname) return;

    event.preventDefault();
    document.body.classList.add("is-transitioning");
    showPageLoader();
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 160;
    window.setTimeout(() => window.location.assign(destination.href), delay);
  });
}
