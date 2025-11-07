import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaHome,
  FaSearch,
  FaMoon,
  FaSun,
  FaChevronRight,
} from "react-icons/fa";
import {
  FaStethoscope,
  FaLungs,
  FaHeartbeat,
  FaTemperatureHigh,
  FaSyringe,
  FaTooth,
  FaEye,
  FaHeart,
  FaWeight,
  FaBed,
  FaTint,
  FaFlask,
} from "react-icons/fa";
import { GiBrain, GiStomach, GiWeightScale, GiBoneKnife, GiLungs } from "react-icons/gi";
import { HiOutlineSparkles } from "react-icons/hi2";


const SymptomCard = ({ symptom, onOpen }) => {
  const Icon = symptom.icon;
  return (
    <button
      onClick={() => onOpen(symptom)}
      className="group relative text-left overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transform transition will-change-transform duration-300 hover:-translate-y-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
      aria-labelledby={`sym-${symptom.id}-title`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />
      <div className="relative p-6 flex gap-4 items-start">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white flex items-center justify-center text-lg shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Icon className="w-7 h-7" aria-hidden />
          </div>
        </div>

        <div className="flex-1">
          <h3 id={`sym-${symptom.id}-title`} className="text-lg font-semibold text-gray-900">
            {symptom.name}
          </h3>
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">{symptom.description}</p>

          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">
              <HiOutlineSparkles className="w-3.5 h-3.5" />
              Common
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">Tap to view details</span>
          </div>
        </div>

        <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FaChevronRight className="w-4 h-4 text-indigo-600" />
        </div>
      </div>
    </button>
  );
};

const SlideOver = ({ open, onClose, symptom }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previousActive = document.activeElement;
    const focusable = panelRef.current?.querySelector("button, [href], input, textarea, select, [tabindex]:not([tabindex='-1'])");
    if (focusable) focusable.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previousActive?.focus?.();
    };
  }, [open, onClose]);

  if (!open || !symptom) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`detail-${symptom.id}-title`}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <aside
        ref={panelRef}
        className="relative w-full sm:max-w-3xl mx-4 sm:mx-6 bg-white rounded-t-xl sm:rounded-xl shadow-2xl ring-1 ring-black/5 overflow-auto max-h-[90vh]"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-lg">
                <symptom.icon className="w-7 h-7" aria-hidden />
              </div>
              <div>
                <h2 id={`detail-${symptom.id}-title`} className="text-2xl font-extrabold text-gray-900">
                  {symptom.name}
                </h2>
                <p className="mt-1 text-sm text-gray-500">Detailed guidance, causes, and treatment options</p>
              </div>
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                aria-label="Close details"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="mt-6 prose prose-sm prose-indigo text-gray-700 max-w-none">
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            <p>{symptom.description}</p>

            <h3 className="mt-6 text-lg font-semibold text-gray-900">Common Causes</h3>
            <ul>
              {symptom.causes.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>

            <h3 className="mt-6 text-lg font-semibold text-gray-900">Treatment Options</h3>
            <ul>
              {symptom.treatments.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl bg-indigo-50 border border-indigo-100 p-4">
              <h4 className="font-semibold text-gray-900">When to See a Doctor</h4>
              <p className="mt-2 text-gray-700">{symptom.whenToSeeDoctor}</p>
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
              >
                Try AI Assistant
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-700 hover:shadow-sm transition"
              >
                View recommended tests
              </a>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

const IconMap = {
  fever: FaTemperatureHigh,
  cough: FaLungs,
  headache: GiBrain,
  "sore-throat": FaStethoscope,
  fatigue: FaTint,
  nausea: GiStomach,
  dizziness: GiStomach,
  "chest-pain": FaHeart,
  rash: FaFlask,
  "back-pain": GiBoneKnife,
  anxiety: GiBrain,
  "joint-pain": GiBoneKnife,
  "weight-loss": GiWeightScale,
  insomnia: FaBed,
  "shortness-breath": GiLungs,
};

const allSymptomsSeed = [
  
  {
    id: "fever",
    name: "Fever",
    description:
      "A temporary increase in body temperature, often due to infection or inflammation.",
    icon: IconMap.fever || FaTemperatureHigh,
    causes: ["Viral infections (flu, cold)", "Bacterial infections", "Heat exhaustion", "Certain inflammatory conditions", "Some medications"],
    treatments: ["Rest and hydration", "Over-the-counter reducers", "Cool compresses", "Light clothing", "Seek care if persistent"],
    whenToSeeDoctor: "If temp > 39.4°C (103°F), lasts >3 days, or has severe symptoms."
  },
  {
    id: "cough",
    name: "Cough",
    description:
      "Reflex to clear airways — can be dry or productive and signals many possible causes.",
    icon: IconMap.cough || FaLungs,
    causes: ["Cold/flu", "Allergies", "Asthma", "Smoking", "Infections"],
    treatments: ["OTC meds", "Honey & warm liquids", "Steam inhalation", "Rest", "Avoid irritants"],
    whenToSeeDoctor: "If cough lasts >3 weeks, produces blood, or causes breathing difficulty."
  },
  {
    id: "headache",
    name: "Headache",
    description:
      "Pain in the head, scalp, or neck; ranges from tension to migraine.",
    icon: IconMap.headache || GiBrain,
    causes: ["Stress", "Muscle tension", "Dehydration", "Eye strain", "Sinus issues"],
    treatments: ["OTC pain relievers", "Rest in quiet, dark room", "Hydration", "Massage", "Compresses"],
    whenToSeeDoctor: "Sudden severe headaches, confusion, fever, or stiff neck — seek immediate care."
  },
  {
    id: "sore-throat",
    name: "Sore Throat",
    description: "Pain or irritation in the throat, often worse with swallowing.",
    icon: IconMap["sore-throat"] || FaStethoscope,
    causes: ["Viral infections", "Bacterial infections", "Allergies", "Dry air", "Overuse of voice"],
    treatments: ["Salt gargles", "Lozenges", "Warm liquids", "Voice rest", "Pain relievers"],
    whenToSeeDoctor: "Severe, >1 week, or with breathing difficulty — see a doctor."
  },
  {
    id: "fatigue",
    name: "Fatigue",
    description: "Persistent tiredness that can be physical or mental in origin.",
    icon: FaTint,
    causes: ["Poor sleep", "Diet", "Stress", "Medical conditions", "Medications"],
    treatments: ["Exercise", "Balanced diet", "Adequate sleep", "Stress management", "Medical evaluation"],
    whenToSeeDoctor: "If fatigue lasts >2 weeks or impacts daily life."
  },
  {
    id: "nausea",
    name: "Nausea",
    description: "Uneasy stomach sensation often preceding vomiting.",
    icon: GiStomach,
    causes: ["Food poisoning", "Motion sickness", "Pregnancy", "Medications", "Infections"],
    treatments: ["Ginger", "Clear fluids", "Rest", "Small meals", "Antiemetics"],
    whenToSeeDoctor: "If severe, persistent, or with other concerning symptoms."
  },
  {
    id: "dizziness",
    name: "Dizziness",
    description: "Feeling faint, woozy, weak or unsteady.",
    icon: GiStomach,
    causes: ["Inner ear problems", "Low blood pressure", "Dehydration", "Medications", "Anxiety"],
    treatments: ["Hydration", "Balance exercises", "Medications", "Rest", "Evaluation"],
    whenToSeeDoctor: "Severe, persistent, or accompanied by other worrying signs."
  },
  {
    id: "chest-pain",
    name: "Chest Pain",
    description: "Pain that may range from mild to life-threatening.",
    icon: FaHeart,
    causes: ["Heart problems", "Muscle strain", "Acid reflux", "Anxiety", "Lung issues"],
    treatments: ["Emergency care (if severe)", "Medications", "Lifestyle changes", "Stress management", "Checkups"],
    whenToSeeDoctor: "Any unexplained chest pain — seek immediate care."
  },
  
];

export default function SymptomDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { symptomId } = useParams();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [symptoms, setSymptoms] = useState(allSymptomsSeed);
  const [selected, setSelected] = useState(null);
  const [themeDim, setThemeDim] = useState(false);

  useEffect(() => {
    
    if (location.state?.selectedSymptom) {
      const s = symptoms.find((x) => x.id === location.state.selectedSymptom);
      if (s) setSelected(s);
    } else if (symptomId) {
      const s = symptoms.find((x) => x.id === symptomId);
      if (s) setSelected(s);
    }
  }, [location.state, symptomId, symptoms]);

  useEffect(() => {
    
    const q = query.trim().toLowerCase();
    setSymptoms(
      allSymptomsSeed.filter((s) => {
        if (filter !== "all") {
          
          if (filter === "respiratory") {
            return ["cough", "shortness-breath", "chest-pain"].includes(s.id);
          }
        }
        if (!q) return true;
        return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
      })
    );
  }, [query, filter]);

  const handleBackToHome = () => navigate("/");

  return (
    <div className={`${themeDim ? "bg-gray-50" : "bg-white"} min-h-screen`}>
      {}
      <div className="relative border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelected(null)}
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition"
            >
              <FaArrowLeft />
              Back
            </button>

            <button
              onClick={handleBackToHome}
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition"
            >
              <FaHome />
              Home
            </button>
          </div>

          <div className="flex-1 max-w-2xl mx-auto">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search symptoms, e.g. fever, cough, headache..."
                className="w-full border border-gray-100 rounded-full py-2 pl-10 pr-4 text-sm shadow-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200"
                aria-label="Search symptoms"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm rounded-full border border-gray-100 px-3 py-2 bg-white shadow-sm"
              aria-label="Filter symptoms"
            >
              <option value="all">All</option>
              <option value="respiratory">Respiratory</option>
              <option value="neurological">Neurological</option>
              <option value="cardiac">Cardiac</option>
            </select>

            <button
              onClick={() => setThemeDim((v) => !v)}
              className="p-2 rounded-full bg-gray-50 border border-gray-100 text-gray-600 hover:bg-gray-100 transition"
              aria-label="Toggle preview dim"
              title="Toggle subtle dim preview"
            >
              {themeDim ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </div>

      {}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              {selected ? selected.name : "Explore Symptoms"}
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Clear, concise medical guidance and suggested next steps. Tap a card to view causes, treatments, and when to seek care.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-700 transition"
            >
              Try AI Assistant
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 bg-white text-gray-800 hover:shadow transition"
            >
              View All Tests
            </a>
          </div>
        </div>
      </header>

      {}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {selected ? (
          
          <SlideOver open={!!selected} onClose={() => setSelected(null)} symptom={selected} />
        ) : (
          <>
            {}
            <section aria-labelledby="sym-grid" className="mt-6">
              <h2 id="sym-grid" className="sr-only">
                Symptoms grid
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {symptoms.length === 0 ? (
                  <div className="col-span-full rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-500">
                    No symptoms found. Try a different search.
                  </div>
                ) : (
                  symptoms.map((s) => (
                    <SymptomCard key={s.id} symptom={s} onOpen={(sym) => setSelected(sym)} />
                  ))
                )}
              </div>
            </section>

            {}
            <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex gap-4">
                <div className="rounded-2xl p-4 bg-white border border-gray-100 shadow-sm">
                  <p className="text-sm text-gray-500">99.8% Diagnostic accuracy</p>
                  <p className="font-semibold text-gray-900">Trusted by clinicians</p>
                </div>
                <div className="rounded-2xl p-4 bg-white border border-gray-100 shadow-sm">
                  <p className="text-sm text-gray-500">24/7 Support</p>
                  <p className="font-semibold text-gray-900">Expert care team</p>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                Need help?{" "}
                <a href="/contact" className="text-indigo-600 font-medium hover:underline">
                  Contact support
                </a>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}