document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav ul li a");

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || !targetId.startsWith("#")) {
                return;
            }

            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                event.preventDefault();

                window.scrollTo({
                    top: targetSection.offsetTop - 50,
                    behavior: "smooth"
                });
            }
        });
    });

    loadLeetCodeHeatmap();
    setupClickTracking();
});

async function loadLeetCodeHeatmap() {
    const heatmap = document.getElementById("leetcode-heatmap");
    const status = document.getElementById("leetcode-status");

    if (!heatmap || !status) {
        return;
    }

    try {
        const response = await fetch("/api/leetcode");
        const data = await response.json();

        if (!response.ok || !data.calendar) {
            throw new Error("Activity data is unavailable.");
        }

        renderHeatmap(data.calendar, heatmap);
        status.textContent = "Live activity from LeetCode";
    } catch (error) {
        status.textContent = "Unable to load LeetCode activity right now.";
    }
}

function renderHeatmap(calendar, heatmap) {
    heatmap.innerHTML = "";

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setUTCDate(today.getUTCDate() - 364);

    for (let day = 0; day < 365; day++) {
        const currentDate = new Date(startDate);
        currentDate.setUTCDate(startDate.getUTCDate() + day);

        const dateKey = currentDate.toISOString().slice(0, 10);
const timestampInSeconds = Math.floor(currentDate.getTime() / 1000);
const timestampInMilliseconds = currentDate.getTime();

const submissions = Number(
    calendar[dateKey] ??
    calendar[String(timestampInSeconds)] ??
    calendar[String(timestampInMilliseconds)] ??
    0
);

        const cell = document.createElement("span");
        cell.className = `heatmap-cell ${getActivityLevel(submissions)}`;
        cell.title = `${currentDate.toLocaleDateString()}: ${submissions} submission${submissions === 1 ? "" : "s"}`;

        heatmap.appendChild(cell);
    }
}

function getActivityLevel(submissions) {
    if (submissions === 0) return "level-0";
    if (submissions <= 2) return "level-1";
    if (submissions <= 5) return "level-2";
    if (submissions <= 9) return "level-3";
    return "level-4";
}
function setupClickTracking() {
    const links = document.querySelectorAll(
        ".project-actions a, .hero-actions a, .stat-grid a, .hero-links a, .contact-links a"
    );

    links.forEach((link) => {
        link.addEventListener("click", () => {
            const projectCard = link.closest(".project-card");
            const projectName = projectCard
                ? projectCard.querySelector("h4")?.textContent.trim()
                : "";

            const buttonName = link.textContent.trim();
            const label = projectName
                ? `${projectName} — ${buttonName}`
                : buttonName;

            const key = `${projectName}-${buttonName}`
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

            fetch("/api/track-click", {
                method: "POST",
                keepalive: true,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ key, label })
            }).catch(() => {
                // Clicking links must still work if analytics is unavailable.
            });
        });
    });
}