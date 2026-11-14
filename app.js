/* ============================================================
   UniCompare — search page logic
   Reads UNIVERSITIES from js/data.js, filters on every input,
   renders cards, map pins and the comparison table.
   ============================================================ */

(function () {
  const $ = (id) => document.getElementById(id);
  const form = $("search-form");
  const els = {
    program: $("f-program"), rscore: $("f-rscore"), grade: $("f-grade"),
    province: $("f-province"), language: $("f-language"),
    radius: $("f-radius"), residency: $("f-residency"),
  };

  // populate the program dropdown from the taxonomy
  PROGRAM_TAXONOMY.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.dataset.i18nEn = p.en;
    opt.dataset.i18nFr = p.fr;
    opt.textContent = p.en;
    els.program.appendChild(opt);
  });
  // keep program names in sync with the language toggle
  document.addEventListener("langchange", () => {
    els.program.querySelectorAll("option").forEach((opt) => {
      if (opt.value) opt.textContent = currentLang === "fr" ? opt.dataset.i18nFr : opt.dataset.i18nEn;
    });
    render();
  });

  let compareSet = new Set();
  let map = null;
  let markers = [];

  // ---------- filtering ----------
  function passes(u, s) {
    // program offered?
    if (s.program) {
      const p = u.programs.find((p) => p.id === s.program);
      if (!p || (p.rScoreMin === null && p.gradeMin === null)) return false;
      // R-score filter (applies to Quebec schools)
      if (s.rscore !== null) {
        if (p.rScoreMin !== null && p.rScoreMin > s.rscore) return false;
      }
      // grade filter
      if (s.grade !== null) {
        if (p.gradeMin !== null && p.gradeMin > s.grade) return false;
      }
    }
    if (s.province && u.province !== s.province) return false;
    if (s.language && !u.languages.includes(s.language)) return false;
    if (s.radius !== null) {
      const km = distanceKm(MONTREAL.lat, MONTREAL.lng, u.lat, u.lng);
      if (km > s.radius) return false;
    }
    return true;
  }

  function readState() {
    return {
      program: els.program.value || null,
      rscore: els.rscore.value === "" ? null : parseFloat(els.rscore.value),
      grade: els.grade.value === "" ? null : parseFloat(els.grade.value),
      province: els.province.value || null,
      language: els.language.value || null,
      radius: els.radius.value === "" ? null : parseFloat(els.radius.value),
      residency: els.residency.value,
    };
  }

  // ---------- rendering ----------
  function tuitionKey(residency) {
    return residency === "qc" ? "qc" : residency === "intl" ? "international" : "otherCanadian";
  }

  function money(n) { return "$" + n.toLocaleString("en-CA"); }

  function matchInfo(u, s) {
    // returns {rScore, grade, coop} for the selected program (or school-wide values)
    if (s.program) {
      const p = u.programs.find((p) => p.id === s.program);
      if (p) {
        return {
          rScore: p.rScoreMin === null ? null : "≥ " + p.rScoreMin,
          grade: p.gradeMin === null ? null : "≥ " + p.gradeMin + "%",
          coop: p.coop,
        };
      }
    }
    return {
      rScore: u.rScoreRange ? u.rScoreRange[0] + "–" + u.rScoreRange[1] : null,
      grade: u.gradeRange,
      coop: u.programs.some((p) => p.coop),
    };
  }

  function card(u, s) {
    const m = matchInfo(u, s);
    const langName = { en: "EN", fr: "FR" };
    const div = document.createElement("article");
    div.className = "card";
    div.dataset.id = u.id;

    const stats = [];
    stats.push(`<div class="stat"><b>${money(u.tuition[tuitionKey(s.residency)])}</b><span data-i18n="card.tuition">${t("card.tuition")}</span></div>`);
    stats.push(`<div class="stat"><b>${m.rScore ?? "—"}</b><span data-i18n="card.rscore">${t("card.rscore")}</span></div>`);
    stats.push(`<div class="stat"><b>${m.grade ?? "—"}</b><span data-i18n="card.grade">${t("card.grade")}</span></div>`);

    const coopBadge = m.coop ? `<span class="chip accent">Co-op</span>` : "";

    div.innerHTML = `
      <div class="card-top">
        <div>
          <a class="card-name" href="university.html?id=${u.id}">${currentLang === "fr" && u.nameFr ? u.nameFr : u.name}</a>
          <div class="chip-row">
            <span class="chip">${u.city}, ${u.province}</span>
            <span class="chip">${u.languages.map((l) => langName[l]).join(" · ")}</span>
            ${coopBadge}
          </div>
        </div>
        <label class="compare-check">
          <input type="checkbox" data-compare="${u.id}" ${compareSet.has(u.id) ? "checked" : ""} />
          <span data-i18n="card.compare">${t("card.compare")}</span>
        </label>
      </div>
      <div class="card-stats">${stats.join("")}</div>
      <div class="card-foot">
        <a class="link-btn" href="university.html?id=${u.id}" data-i18n="card.view">${t("card.view")}</a>
      </div>
    `;
    return div;
  }

  function render() {
    const s = readState();
    const list = UNIVERSITIES.filter((u) => passes(u, s));

    $("results-count").textContent = t("results.count").replace("{n}", list.length);
    const grid = $("results-grid");
    const empty = $("empty-state");
    grid.innerHTML = "";
    empty.hidden = list.length !== 0;
    if (list.length === 0) empty.textContent = t("results.empty");

    list.forEach((u) => grid.appendChild(card(u, s)));
    updateMap(list);
  }

  // ---------- map ----------
  function initMap() {
    map = new maplibregl.Map({
      container: "map",
      style: "https://tiles.openfreemap.org/styles/positron",
      center: [-74.2, 45.6],
      zoom: 5.2,
      attributionControl: true,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.on("load", () => updateMap(UNIVERSITIES));
  }

  function updateMap(list) {
    if (!map || !map.loaded()) {
      if (map) map.once("load", () => updateMap(list));
      return;
    }
    markers.forEach((m) => m.remove());
    markers = list.map((u) => {
      const marker = new maplibregl.Marker({ color: u.province === "QC" ? "#1e3fa8" : "#1a1c20" })
        .setLngLat([u.lng, u.lat])
        .setPopup(new maplibregl.Popup({ offset: 14 }).setHTML(
          `<b>${u.name}</b><br>${u.city} · <a href="university.html?id=${u.id}">${t("card.view")}</a>`
        ))
        .addTo(map);
      return marker;
    });
  }

  // ---------- compare ----------
  function updateCompareBar() {
    const bar = $("compare-bar");
    bar.classList.toggle("visible", compareSet.size > 0);
    $("compare-count").textContent = t("compare.bar").replace("{n}", compareSet.size);
    $("compare-open").textContent = t("compare.open");
  }

  function buildCompareTable() {
    const s = readState();
    const schools = UNIVERSITIES.filter((u) => compareSet.has(u.id));
    const rows = [
      ["city", (u) => `${u.city}, ${u.province}`],
      ["languages", (u) => u.languages.map((l) => l.toUpperCase()).join(", ")],
      ["tuition", (u) => money(u.tuition[tuitionKey(s.residency)])],
      ["rscore", (u) => (u.rScoreRange ? `${u.rScoreRange[0]}–${u.rScoreRange[1]}` : "N/A")],
      ["grade", (u) => u.gradeRange],
      ["acceptance", (u) => u.acceptanceRate + "%"],
      ["residence", (u) => money(u.residence.monthly[0]) + "–" + money(u.residence.monthly[1]) + "/mo"],
      ["living", (u) => money(u.livingCost) + "/mo"],
      ["coop", (u) => (u.programs.some((p) => p.coop) ? "✓" : "—")],
    ];
    let html = "<table><thead><tr><th></th>";
    schools.forEach((u) => { html += `<th>${u.name}</th>`; });
    html += "</tr></thead><tbody>";
    rows.forEach(([key, fn]) => {
      html += `<tr><th scope="row">${t("compare.row." + key)}</th>`;
      schools.forEach((u) => { html += `<td>${fn(u)}</td>`; });
      html += "</tr>";
    });
    html += "</tbody></table>";
    $("compare-table").innerHTML = html;
  }

  // ---------- events ----------
  form.addEventListener("input", render);
  form.addEventListener("change", render);

  $("reset-btn").addEventListener("click", () => {
    form.reset();
    render();
  });

  document.addEventListener("change", (e) => {
    if (e.target.dataset && e.target.dataset.compare) {
      e.target.checked ? compareSet.add(e.target.dataset.compare) : compareSet.delete(e.target.dataset.compare);
      updateCompareBar();
    }
  });

  $("compare-open").addEventListener("click", () => {
    buildCompareTable();
    $("compare-modal").classList.add("open");
  });
  $("compare-close").addEventListener("click", () => $("compare-modal").classList.remove("open"));
  $("compare-modal").addEventListener("click", (e) => {
    if (e.target === $("compare-modal")) $("compare-modal").classList.remove("open");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") $("compare-modal").classList.remove("open");
  });
  $("compare-clear").addEventListener("click", () => {
    compareSet.clear();
    document.querySelectorAll("[data-compare]").forEach((c) => (c.checked = false));
    updateCompareBar();
  });

  $("lang-toggle").addEventListener("click", () => setLang(currentLang === "en" ? "fr" : "en"));

  // ---------- init ----------
  initMap();
  render();
  updateCompareBar();
})();
