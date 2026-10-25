const databaseStatus = document.querySelector("#db-status");
const databaseDetail = document.querySelector("#db-detail");
const databaseDot = document.querySelector("#db-status-dot");
const databaseButton = document.querySelector("#check-database");

const environmentName =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "Local development"
    : "Hosted preview";

async function checkDatabase() {
  databaseButton.disabled = true;
  databaseButton.textContent = "Checking connection…";
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
    databaseButton.innerHTML = 'Check again <span aria-hidden="true">↗</span>';
  }
}

databaseButton.addEventListener("click", checkDatabase);
checkDatabase();

const navigationLinks = [
  ...document.querySelectorAll(".primary-nav .nav-link"),
];
for (const link of navigationLinks) {
  link.addEventListener("click", () => {
    for (const item of navigationLinks) {
      item.classList.remove("is-active");
      item.removeAttribute("aria-current");
    }
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  });
}
