/* ============================================================
   DATA LAYER — the only file you need to edit to grow the site.
   Add one object per university below. Everything else
   (search, filters, map, compare, detail pages) reads from here.

   ⚠️ All numbers below are SAMPLE values for the demo.
   Replace them with verified figures before going public:
   - Ontario: ouinfo.ca  and  cudo.ouac.on.ca
   - Quebec : quebec.ca (MES statistics) + university sites
   ============================================================ */

const PROGRAM_TAXONOMY = [
  { id: "engineering",    en: "Engineering",       fr: "Ingénierie" },
  { id: "cs",             en: "Computer Science",  fr: "Informatique" },
  { id: "business",       en: "Business",          fr: "Affaires" },
  { id: "health",         en: "Health Sciences",   fr: "Sciences de la santé" },
  { id: "arts-science",   en: "Arts & Science",    fr: "Arts et sciences" },
];

// Reference point for the "distance from Montréal" filter
const MONTREAL = { lat: 45.5019, lng: -73.5674 };

const UNIVERSITIES = [
  {
    id: "mcgill",
    name: "McGill University",
    nameFr: "Université McGill",
    city: "Montréal",
    province: "QC",
    lat: 45.5048, lng: -73.5772,
    languages: ["en"],
    students: 37400,
    acceptanceRate: 45,                    // % — sample
    rScoreRange: [28, 35],                 // CRC, overall — sample
    gradeRange: "88–94%",                  // Ontario-equivalent average — sample
    tuition: { qc: 4900, otherCanadian: 12500, international: 34000 }, // $/yr — sample
    residence: { guaranteed: true, monthly: [700, 1700] },
    livingCost: 1550,                      // $/month estimate — sample
    admission: {
      recommendationLetter: false,
      interview: false,
      deadline: "March 1 (Quebec) · mid-January for scholarships",
      note: "Some programs (e.g. Music) require auditions or portfolios."
    },
    programs: [
      { id: "engineering",  rScoreMin: 33, gradeMin: 92, coop: false },
      { id: "cs",           rScoreMin: 33, gradeMin: 92, coop: true },
      { id: "business",     rScoreMin: 31, gradeMin: 90, coop: true },
      { id: "health",       rScoreMin: 35, gradeMin: 94, coop: false },
      { id: "arts-science", rScoreMin: 30, gradeMin: 89, coop: false },
    ],
    life: {
      campusType: "Urban — two campuses downtown",
      varsity: "29 varsity teams (Redbirds & Martlets)",
      clubs: 300,
      schoolLife: "Downtown campus at the foot of Mount Royal; dense, fast-paced, lots of events and traditions like Frosh and Winter Carnival.",
      socialLife: "Student ghetto (Milton-Parc) next to campus; bars on Saint-Laurent and Crescent a short walk away. Montréal's festival scene is on your doorstep.",
    },
    scholarships: "Automatic entrance scholarships from $3,000 (one-year) to $12,000 (renewable) based on grades — no separate application.",
  },

  {
    id: "concordia",
    name: "Concordia University",
    nameFr: "Université Concordia",
    city: "Montréal",
    province: "QC",
    lat: 45.4972, lng: -73.5789,
    languages: ["en"],
    students: 37200,
    acceptanceRate: 62,
    rScoreRange: [26, 32],
    gradeRange: "82–90%",
    tuition: { qc: 4900, otherCanadian: 12500, international: 33000 },
    residence: { guaranteed: false, monthly: [600, 1500] },
    livingCost: 1500,
    admission: {
      recommendationLetter: false,
      interview: false,
      deadline: "March 1 (fall entry)",
      note: "Portfolio required for Fine Arts programs."
    },
    programs: [
      { id: "engineering",  rScoreMin: 29, gradeMin: 88, coop: true },
      { id: "cs",           rScoreMin: 30, gradeMin: 88, coop: true },
      { id: "business",     rScoreMin: 28, gradeMin: 85, coop: true },
      { id: "health",       rScoreMin: null, gradeMin: null, coop: false },   // not offered
      { id: "arts-science", rScoreMin: 26, gradeMin: 82, coop: false },
    ],
    life: {
      campusType: "Urban — SGW (downtown) + Loyola (residential)",
      varsity: "Stingers — basketball & football strong",
      clubs: 300,
      schoolLife: "Known for experiential learning, co-op options and a pragmatic vibe. Two campuses linked by shuttle bus.",
      socialLife: "Sir George Williams campus sits at Guy-Concordia, steps from Crescent Street nightlife and the Montréal nightlife core.",
    },
    scholarships: "Automatic entrance awards from $2,000–$10,000 based on grades; many program-specific awards on application.",
  },

  {
    id: "udem",
    name: "Université de Montréal",
    nameFr: "Université de Montréal",
    city: "Montréal",
    province: "QC",
    lat: 45.5023, lng: -73.6145,
    languages: ["fr"],
    students: 44300,
    acceptanceRate: 55,
    rScoreRange: [24, 34],
    gradeRange: "80–93%",
    tuition: { qc: 4400, otherCanadian: 10000, international: 29000 },
    residence: { guaranteed: false, monthly: [550, 1300] },
    livingCost: 1400,
    admission: {
      recommendationLetter: false,
      interview: false,
      deadline: "March 1 (fall) · November 1 (winter)",
      note: "Most programs taught in French; some graduate-level English options."
    },
    programs: [
      { id: "engineering",  rScoreMin: 30, gradeMin: 88, coop: true },
      { id: "cs",           rScoreMin: 31, gradeMin: 89, coop: true },
      { id: "business",     rScoreMin: 28, gradeMin: 84, coop: true },
      { id: "health",       rScoreMin: 34, gradeMin: 93, coop: false },
      { id: "arts-science", rScoreMin: 24, gradeMin: 80, coop: false },
    ],
    life: {
      campusType: "Traditional — Côte-des-Neiges, metro-accessible",
      varsity: "Carabins — football & soccer at CEPSUM",
      clubs: 250,
      schoolLife: "Largest francophone university in the Americas; campus on Mount Royal's north side with its own metro station.",
      socialLife: "Milton-Parc style student housing nearby; Plateau and Mile End nightlife a short metro ride away.",
    },
    scholarships: "Automatic admission scholarships based on CRC (R-score); AFE loans & bursaries available to Quebec residents.",
  },

  {
    id: "laval",
    name: "Université Laval",
    nameFr: "Université Laval",
    city: "Québec City",
    province: "QC",
    lat: 46.7785, lng: -71.2755,
    languages: ["fr"],
    students: 46800,
    acceptanceRate: 58,
    rScoreRange: [24, 31],
    gradeRange: "78–90%",
    tuition: { qc: 4400, otherCanadian: 9800, international: 27000 },
    residence: { guaranteed: true, monthly: [500, 1200] },
    livingCost: 1250,
    admission: {
      recommendationLetter: false,
      interview: false,
      deadline: "March 1 (fall) · November 1 (winter)",
      note: "Broadest French-language program selection in the province."
    },
    programs: [
      { id: "engineering",  rScoreMin: 28, gradeMin: 85, coop: true },
      { id: "cs",           rScoreMin: 27, gradeMin: 84, coop: true },
      { id: "business",     rScoreMin: 26, gradeMin: 83, coop: true },
      { id: "health",       rScoreMin: 31, gradeMin: 90, coop: false },
      { id: "arts-science", rScoreMin: 24, gradeMin: 78, coop: false },
    ],
    life: {
      campusType: "Traditional — self-contained campus, 10 min from Old Québec",
      varsity: "Rouge et Or — best attended football games in Canada",
      clubs: 350,
      schoolLife: "Classic campus-university feel: everything on one big green site, strong school spirit, lots of outdoors culture.",
      socialLife: "Québec City is calmer and cheaper than Montréal; Grande Allée bars and Carnaval in winter. Very French-speaking.",
    },
    scholarships: "Automatic entrance scholarships based on CRC; generous AFE support; low cost of living.",
  },

  {
    id: "utoronto",
    name: "University of Toronto",
    nameFr: "Université de Toronto",
    city: "Toronto",
    province: "ON",
    lat: 43.6629, lng: -79.3957,
    languages: ["en"],
    students: 97000,
    acceptanceRate: 43,
    rScoreRange: null,                    // Ontario: no R-score — grade-based
    gradeRange: "85–95%",
    tuition: { qc: 9500, otherCanadian: 9500, international: 65000 },
    residence: { guaranteed: true, monthly: [1000, 2000] },
    livingCost: 2100,
    admission: {
      recommendationLetter: false,
      interview: false,
      deadline: "OUAC 101: early January · 105: mid-January",
      note: "Apply through OUAC. Rotman Commerce and Engineering require supplementary applications."
    },
    programs: [
      { id: "engineering",  rScoreMin: null, gradeMin: 92, coop: true },
      { id: "cs",           rScoreMin: null, gradeMin: 93, coop: true },
      { id: "business",     rScoreMin: null, gradeMin: 90, coop: false },
      { id: "health",       rScoreMin: null, gradeMin: 92, coop: false },
      { id: "arts-science", rScoreMin: null, gradeMin: 85, coop: false },
    ],
    life: {
      campusType: "Urban — St. George (downtown) + 2 suburban campuses",
      varsity: "Varsity Blues — the longest football rivalry in Canada",
      clubs: 1000,
      schoolLife: "Canada's largest university; seven colleges give it small-school communities inside a big institution.",
      socialLife: "Downtown Toronto: everything from Annex pubs to the Entertainment District. Expensive but unmatched for variety.",
    },
    scholarships: "U of T Scholars awards ($7,500) for top admissions; Ontario students access OSAP; entrance awards mostly automatic.",
  },

  {
    id: "waterloo",
    name: "University of Waterloo",
    nameFr: "Université de Waterloo",
    city: "Waterloo",
    province: "ON",
    lat: 43.4723, lng: -80.5449,
    languages: ["en"],
    students: 42000,
    acceptanceRate: 53,
    rScoreRange: null,
    gradeRange: "85–95%",
    tuition: { qc: 10200, otherCanadian: 10200, international: 51000 },
    residence: { guaranteed: true, monthly: [800, 1600] },
    livingCost: 1400,
    admission: {
      recommendationLetter: false,
      interview: false,
      deadline: "OUAC 101: early February (co-op programs fill early)",
      note: "Apply through OUAC. Admission Information Form required for engineering."
    },
    programs: [
      { id: "engineering",  rScoreMin: null, gradeMin: 92, coop: true },
      { id: "cs",           rScoreMin: null, gradeMin: 93, coop: true },
      { id: "business",     rScoreMin: null, gradeMin: 87, coop: true },
      { id: "health",       rScoreMin: null, gradeMin: 85, coop: true },
      { id: "arts-science", rScoreMin: null, gradeMin: 85, coop: true },
    ],
    life: {
      campusType: "Traditional — tech-campus feel, startup culture",
      varsity: "Warriors",
      clubs: 400,
      schoolLife: "The co-op capital of Canada: alternate study and paid work terms from day one. Intense, career-focused culture.",
      socialLife: "University town: student bars along Ezra Street, Phil's legacy, cheap rent. Toronto is 1.5h by bus/train.",
    },
    scholarships: "Automatic President's Scholarships up to $10,000 for top averages; major co-op earnings offset tuition.",
  },
];

// Mark programs not offered: remove the entry or set both mins to null
function programById(id) {
  return PROGRAM_TAXONOMY.find(p => p.id === id);
}

function findUniversity(id) {
  return UNIVERSITIES.find(u => u.id === id);
}

// Distance (km) between two coordinates — used for the radius filter
function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
