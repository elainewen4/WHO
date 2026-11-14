/* ============================================================
   i18n — UI labels in English and French.
   Switching the language toggle swaps every [data-i18n] element
   and placeholders via [data-i18n-placeholder].
   ============================================================ */

const I18N = {
  en: {
    "site.name": "UniCompare",
    "site.tagline": "QC × ON",
    "nav.search": "Search",
    "nav.about": "About",
    "lang.toggle": "FR",
    "hero.title": "Compare Quebec and Ontario universities.",
    "hero.sub": "Built for CEGEP students. Filter by program, R-score, budget and distance — then compare schools side by side.",
    "search.program": "Program of interest",
    "search.program.any": "Any program",
    "search.rscore": "Your R-score (CRC)",
    "search.rscore.hint": "e.g. 30",
    "search.grade": "Your grade average (%)",
    "search.grade.hint": "e.g. 88",
    "search.province": "Province",
    "search.province.any": "Quebec + Ontario",
    "search.language": "Language of instruction",
    "search.language.any": "Any language",
    "search.language.en": "English",
    "search.language.fr": "French",
    "search.radius": "Distance from Montréal",
    "search.radius.any": "Anywhere",
    "search.radius.150": "Within 150 km",
    "search.radius.300": "Within 300 km",
    "search.residency": "You are a…",
    "search.residency.qc": "Quebec resident",
    "search.residency.other": "Canadian (out of province)",
    "search.residency.intl": "International student",
    "search.reset": "Reset filters",
    "results.count": "{n} school(s) match",
    "results.empty": "No schools match your filters. Try widening your search.",
    "card.tuition": "/ yr",
    "card.rscore": "R-score",
    "card.grade": "Grade avg",
    "card.view": "View school",
    "card.compare": "Compare",
    "map.title": "Map view",
    "map.hint": "Click a pin to open the school page.",
    "compare.bar": "{n} selected",
    "compare.open": "Compare",
    "compare.clear": "Clear",
    "compare.title": "Side-by-side comparison",
    "compare.close": "Close",
    "compare.row.city": "City",
    "compare.row.province": "Province",
    "compare.row.languages": "Languages",
    "compare.row.tuition": "Tuition / yr",
    "compare.row.rscore": "R-score range",
    "compare.row.grade": "Grade range",
    "compare.row.acceptance": "Acceptance rate",
    "compare.row.residence": "Residence (from)",
    "compare.row.living": "Living cost / mo",
    "compare.row.coop": "Co-op available",
    "footer.disclaimer": "Sample data for demonstration — verify all figures with official sources before applying.",
    "footer.sources": "Data sources:",
    "footer.about": "This starter is fully static: add universities in js/data.js and host it free on GitHub Pages or Netlify.",
  },
  fr: {
    "site.name": "UniCompare",
    "site.tagline": "QC × ON",
    "nav.search": "Rechercher",
    "nav.about": "À propos",
    "lang.toggle": "EN",
    "hero.title": "Comparez les universités du Québec et de l'Ontario.",
    "hero.sub": "Conçu pour les étudiantes et étudiants de cégep. Filtrez par programme, cote R, budget et distance — puis comparez côte à côte.",
    "search.program": "Programme d'intérêt",
    "search.program.any": "Tous les programmes",
    "search.rscore": "Votre cote R (CRC)",
    "search.rscore.hint": "p. ex. 30",
    "search.grade": "Votre moyenne (%)",
    "search.grade.hint": "p. ex. 88",
    "search.province": "Province",
    "search.province.any": "Québec + Ontario",
    "search.language": "Langue d'enseignement",
    "search.language.any": "Toutes les langues",
    "search.language.en": "Anglais",
    "search.language.fr": "Français",
    "search.radius": "Distance de Montréal",
    "search.radius.any": "Partout",
    "search.radius.150": "Moins de 150 km",
    "search.radius.300": "Moins de 300 km",
    "search.residency": "Vous êtes…",
    "search.residency.qc": "Résident(e) du Québec",
    "search.residency.other": "Canadien(ne) hors Québec",
    "search.residency.intl": "Étudiant(e) international(e)",
    "search.reset": "Réinitialiser",
    "results.count": "{n} université(s) correspondante(s)",
    "results.empty": "Aucune université ne correspond. Élargissez vos critères.",
    "card.tuition": "/ an",
    "card.rscore": "Cote R",
    "card.grade": "Moyenne",
    "card.view": "Voir l'université",
    "card.compare": "Comparer",
    "map.title": "Carte",
    "map.hint": "Cliquez sur un repère pour ouvrir la page de l'université.",
    "compare.bar": "{n} sélectionnée(s)",
    "compare.open": "Comparer",
    "compare.clear": "Effacer",
    "compare.title": "Comparaison côte à côte",
    "compare.close": "Fermer",
    "compare.row.city": "Ville",
    "compare.row.province": "Province",
    "compare.row.languages": "Langues",
    "compare.row.tuition": "Droits de scolarité / an",
    "compare.row.rscore": "Cote R (plage)",
    "compare.row.grade": "Moyenne (plage)",
    "compare.row.acceptance": "Taux d'admission",
    "compare.row.residence": "Résidence (à partir de)",
    "compare.row.living": "Coût de vie / mois",
    "compare.row.coop": "Alternance (co-op) offerte",
    "footer.disclaimer": "Données fictives de démonstration — vérifiez toutes les données auprès des sources officielles.",
    "footer.sources": "Sources de données :",
    "footer.about": "Ce site est entièrement statique : ajoutez des universités dans js/data.js et hébergez-le gratuitement sur GitHub Pages ou Netlify.",
  },
};

let currentLang = "en";

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
}

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-label]").forEach(el => {
    el.setAttribute("aria-label", t(el.dataset.i18nLabel));
  });
  document.documentElement.lang = lang;
  const btn = document.getElementById("lang-toggle");
  if (btn) btn.textContent = t("lang.toggle");
  // let page scripts re-render dynamic text
  document.dispatchEvent(new CustomEvent("langchange"));
}
