/* ============================================================
   UniCompare — university detail page
   Reads ?id= from the URL, renders the profile from js/data.js.
   Everything (tabs, stats, cost cards) is generated here,
   so new fields added to data.js need one more line in render().
   ============================================================ */

(function () {
  const $ = (s) => document.querySelector(s);
  const params = new URLSearchParams(location.search);
  const u = findUniversity(params.get("id"));

  if (!u) {
    $("#page").innerHTML = `
      <section class="detail-hero">
        <a class="back-link" href="index.html">← ${t("nav.search")}</a>
        <h1>Not found</h1>
        <p class="meta">Unknown school id. <a href="index.html">Back to search</a>.</p>
      </section>`;
    throw new Error("Unknown university id");
  }

  const isFr = () => currentLang === "fr";
  const name = () => (isFr() && u.nameFr ? u.nameFr : u.name);
  const money = (n) => "$" + n.toLocaleString("en-CA");
  const programName = (p) => (isFr() ? programById(p.id).fr : programById(p.id).en);

  function render() {
    const isQC = u.province === "QC";
    document.title = `UniCompare — ${name()}`;

    // ---- programs table ----
    const programRows = u.programs
      .filter((p) => p.rScoreMin !== null || p.gradeMin !== null)
      .map((p) => `<tr>
          <td><b>${programName(p)}</b></td>
          <td>${p.rScoreMin === null ? '<span class="no">—</span>' : "≥ " + p.rScoreMin}</td>
          <td>${p.gradeMin === null ? '<span class="no">—</span>' : "≥ " + p.gradeMin + "%"}</td>
          <td>${p.coop ? '<span class="yes">✓</span>' : '<span class="no">—</span>'}</td>
        </tr>`)
      .join("");

    $("#page").innerHTML = `
      <section class="detail-hero">
        <a class="back-link" href="index.html">← ${t("nav.search")}</a>
        <h1>${name()}</h1>
        <p class="meta">${u.city}, ${u.province} · ${u.languages.map((l) => l.toUpperCase()).join(" · ")} · ${u.students.toLocaleString("en-CA")} ${isFr() ? "étudiant(e)s" : "students"}</p>
      </section>

      <section class="stat-grid" aria-label="Key stats">
        <div class="stat-card">
          <span class="k">${t("compare.row.acceptance")}</span>
          <span class="v">${u.acceptanceRate}%</span>
          <span class="s">${isFr() ? "taux estimé" : "estimated rate"}</span>
        </div>
        <div class="stat-card">
          <span class="k">${t("compare.row.rscore")}</span>
          <span class="v">${isQC ? u.rScoreRange[0] + "–" + u.rScoreRange[1] : "N/A"}</span>
          <span class="s">${isQC ? (isFr() ? "cote R (CRC)" : "R-score (CRC)") : (isFr() ? "admission à la moyenne (Ontario)" : "grade-based admission (Ontario)")}</span>
        </div>
        <div class="stat-card">
          <span class="k">${t("compare.row.grade")}</span>
          <span class="v">${u.gradeRange}</span>
          <span class="s">${isFr() ? "équivalent secondaire / collégial" : "high-school equivalent"}</span>
        </div>
        <div class="stat-card">
          <span class="k">${t("compare.row.tuition")}</span>
          <span class="v">${money(u.tuition.qc)}</span>
          <span class="s">${isFr() ? "résident(e) du Québec" : "Quebec resident rate"}</span>
        </div>
      </section>

      <section>
        <div class="tabs" role="tablist">
          <button class="tab-btn active" data-tab="academics" role="tab" aria-selected="true">${isFr() ? "Académique" : "Academics"}</button>
          <button class="tab-btn" data-tab="costs" role="tab" aria-selected="false">${isFr() ? "Coûts" : "Costs"}</button>
          <button class="tab-btn" data-tab="life" role="tab" aria-selected="false">${isFr() ? "Vie étudiante" : "Student life"}</button>
        </div>

        <!-- ACADEMICS -->
        <div class="tab-panel active" data-panel="academics">
          <ul class="info-list" style="margin-bottom: var(--space-8);">
            <li><span class="q">${isFr() ? "Lettres de recommandation" : "Recommendation letter"}</span><br/><span class="a">${u.admission.recommendationLetter ? "✓ " + (isFr() ? "requise" : "required") : "—" + (isFr() ? " non requise" : " not required")}</span></li>
            <li><span class="q">${isFr() ? "Entrevue" : "Interview"}</span><br/><span class="a">${u.admission.interview ? "✓ " + (isFr() ? "requise" : "required") : "—" + (isFr() ? " non requise" : " not required")}</span></li>
            <li><span class="q">${isFr() ? "Date limite" : "Application deadline"}</span><br/><span class="a">${u.admission.deadline}</span></li>
            <li><span class="q">${isFr() ? "Notes" : "Notes"}</span><br/><span class="a">${u.admission.note}</span></li>
          </ul>
          <div style="overflow-x: auto;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>${t("search.program")}</th><th>${t("card.rscore")}</th>
                  <th>${t("card.grade")}</th><th>${isFr() ? "Alternance" : "Co-op"}</th>
                </tr>
              </thead>
              <tbody>${programRows}</tbody>
            </table>
          </div>
        </div>

        <!-- COSTS -->
        <div class="tab-panel" data-panel="costs">
          <div class="cost-grid" style="margin-bottom: var(--space-8);">
            <div class="cost-card">
              <span class="k">${t("search.residency.qc")}</span>
              <span class="v">${money(u.tuition.qc)}</span>
              <span class="s">${isFr() ? "par année — tarif québécois" : "per year — Quebec rate"}</span>
            </div>
            <div class="cost-card">
              <span class="k">${t("search.residency.other")}</span>
              <span class="v">${money(u.tuition.otherCanadian)}</span>
              <span class="s">${isFr() ? "par année — tarif canadien hors Québec" : "per year — Canadian out-of-province rate"}</span>
            </div>
            <div class="cost-card">
              <span class="k">${t("search.residency.intl")}</span>
              <span class="v">${money(u.tuition.international)}</span>
              <span class="s">${isFr() ? "par année — tarif international" : "per year — international rate"}</span>
            </div>
          </div>
          <ul class="info-list">
            <li><span class="q">${isFr() ? "Résidence" : "Residence"}</span><br/><span class="a">${u.residence.guaranteed ? (isFr() ? "Garantie en 1ʳᵉ année · " : "Guaranteed in first year · ") : ""}${money(u.residence.monthly[0])}–${money(u.residence.monthly[1])}/mo</span></li>
            <li><span class="q">${isFr() ? "Coût de vie estimé" : "Estimated living cost"}</span><br/><span class="a">${money(u.livingCost)}/mo ${isFr() ? "(logement + nourriture + transport)" : "(housing + food + transit)"}</span></li>
            <li><span class="q">${isFr() ? "Bourses et aide financière" : "Scholarships & financial aid"}</span><br />
              <span class="a">${u.scholarships}</span></li>
            <li><span class="q">${isFr() ? "Prêts" : "Loans"}</span><br />
              <span class="a">${isQC
                ? (isFr() ? "Aide financière aux études (AFE) pour les résidentes et résidents du Québec." : "Quebec residents: AFE loans & bursaries.")
                : (isFr() ? "Résidentes et résidents de l'Ontario : OSAP. Les Québécois étudiant en Ontario peuvent être admissibles au programme de leur province." : "Ontario residents: OSAP. Quebecers studying in Ontario may qualify for provincial aid — check eligibility.")}</span></li>
          </ul>
        </div>

        <!-- LIFE -->
        <div class="tab-panel" data-panel="life">
          <div class="subtabs">
            <button class="subtab-btn active" data-subtab="school">${isFr() ? "Vie scolaire" : "School life"}</button>
            <button class="subtab-btn" data-subtab="social">${isFr() ? "Vie sociale" : "Social life"}</button>
          </div>
          <div data-subpanel="school">
            <ul class="info-list">
              <li><span class="q">${isFr() ? "Campus" : "Campus"}</span><br /><span class="a">${u.life.campusType}</span></li>
              <li><span class="q">${isFr() ? "Sport universitaire" : "Varsity athletics"}</span><br /><span class="a">${u.life.varsity}</span></li>
              <li><span class="q">${isFr() ? "Clubs étudiant(e)s" : "Student clubs"}</span><br /><span class="a">${u.life.clubs.toLocaleString("en-CA")}</span></li>
              <li><span class="q">${isFr() ? "Ambiance" : "Atmosphere"}</span><br /><span class="a">${u.life.schoolLife}</span></li>
            </ul>
          </div>
          <div data-subpanel="social" hidden>
            <ul class="info-list">
              <li><span class="q">${isFr() ? "Vie sociale et sorties" : "Social scene & going out"}</span><br /><span class="a">${u.life.socialLife}</span></li>
              <li><span class="q">${isFr() ? "Ville" : "City"}</span><br /><span class="a">${u.city} — ${money(u.livingCost)}/mo ${isFr() ? "coût de vie" : "cost of living"}</span></li>
            </ul>
          </div>
        </div>
      </section>

      <p class="sources-note">
        ${isFr() ? "Données fictives de démonstration. Vérifiez les chiffres officiels : " : "Sample demo data. Verify official figures: "}
        <a href="https://www.ouinfo.ca" rel="noopener">OUInfo</a> ·
        <a href="https://cudo.ouac.on.ca" rel="noopener">CUDO</a> ·
        <a href="https://www.quebec.ca/education/indicateurs-statistiques/enseignement-superieur" rel="noopener">MES Québec</a>
      </p>
    `;

    bindTabs();
  }

  function bindTabs() {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach((b) => {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-selected", b === btn ? "true" : "false");
        });
        document.querySelectorAll(".tab-panel").forEach((p) => {
          p.classList.toggle("active", p.dataset.panel === btn.dataset.tab);
        });
      });
    });
    document.querySelectorAll(".subtab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".subtab-btn").forEach((b) => b.classList.toggle("active", b === btn));
        document.querySelectorAll("[data-subpanel]").forEach((p) => {
          p.hidden = p.dataset.subpanel !== btn.dataset.subtab;
        });
      });
    });
  }

  $("#lang-toggle").addEventListener("click", () => setLang(currentLang === "en" ? "fr" : "en"));
  document.addEventListener("langchange", render);

  render();
})();
