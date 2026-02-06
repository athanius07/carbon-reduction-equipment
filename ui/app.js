/* ---------------------------
   Carbon-Reduction UI (seed.json)
   --------------------------- */

console.log("✅ app.js loaded");

const FILTER_BTNS = document.querySelectorAll(".toggles button");
let DATA = [];

// --- Load data from ./seed.json (same folder as index.html & app.js) ---
fetch("seed.json", { cache: "no-store" })
  .then((res) => {
    console.log("✅ fetch seed.json status:", res.status);
    if (!res.ok) throw new Error("Failed to load seed.json");
    return res.json();
  })
  .then((json) => {
    console.log("✅ data loaded:", json?.length ?? 0, "records");
    DATA = Array.isArray(json) ? json : [];
    render("All");
  })
  .catch((err) => {
    console.error("❌ fetch failed:", err);
    // Show a friendly message in the table if seed.json can't be loaded
    const tb = document.querySelector("#equip tbody");
    if (tb) {
      tb.innerHTML = `<tr><td colspan="11" style="color:#c00;">
        Could not load <code>seed.json</code>. Check that it exists in <code>/ui</code>,
        GitHub Pages is set to publish the <code>/ui</code> folder, and then hard‑refresh (Ctrl/Cmd+Shift+R).
      </td></tr>`;
    }
  });

// --- Helpers ---
function tagClass(power) {
  if (!power) return "tag";
  if (/battery/i.test(power)) return "tag battery";
  if (/hydrogen/i.test(power)) return "tag hydrogen";
  if (/methanol|e[- ]?fuel|e\\s?fuels/i.test(power)) return "tag efuels";
  if (/hybrid/i.test(power)) return "tag hybrid";
  return "tag";
}

function safe(v) {
  return (v === undefined || v === null) ? "" : String(v);
}

// --- Render table by machine type filter ---
function render(type) {
  const tb = document.querySelector("#equip tbody");
  if (!tb) return;

  const rows = DATA.filter(r => type === "All" || safe(r.machineType) === type)
    .map(r => {
      const link = safe(r.sourceUrl)
        ? `<{r.sourceUrl}link</a>${r.sourceDate ? ` (${safe(r.sourceDate)})` : ""}`
        : "";
      return `
      <tr>
        <td><span class="${tagClass(r.powerUse)}">${safe(r.powerUse)}</span></td>
        <td>${safe(r.oem)}</td>
        <td>${safe(r.country)}</td>
        <td>${safe(r.classTonnage)}</td>
        <td>${safe(r.engineMotorPower)}</td>
        <td>${safe(r.bladeSize)}</td>
        <td>${safe(r.bucketSize)}</td>
        <td>${safe(r.machineType)}</td>
        <td>${safe(r.yearRelease)}</td>
        <td>${safe(r.devStatus)}</td>
        <td>${link}</td>
      </tr>`;
    })
    .join("");

  tb.innerHTML = rows || `<tr><td colspan="11" style="color:#666;">No rows to display.</td></tr>`;
}

// --- Filter buttons wiring ---
FILTER_BTNS.forEach(b => b.addEventListener("click", e => {
  FILTER_BTNS.forEach(x => x.classList.remove("active"));
  e.target.classList.add("active");
  render(e.target.dataset.type);
}));
