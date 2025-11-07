import React, { useMemo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStethoscope,
  FaLungs,
  FaHeadSideCough,
  FaHeartbeat,
  FaTired,
  FaTemperatureHigh,
  FaSearch,
  FaExternalLinkAlt,
} from "react-icons/fa";



const SYMPTOMS = [
  {
    id: "fever",
    name: "Fever",
    icon: FaTemperatureHigh,
    short: "Elevated body temperature — common with infections.",
    severity: "Common",
    area: "General",
  },
  {
    id: "cough",
    name: "Cough",
    icon: FaHeadSideCough,
    short: "Dry or productive cough; could indicate respiratory issues.",
    severity: "Common",
    area: "Respiratory",
  },
  {
    id: "headache",
    name: "Headache",
    icon: FaHeartbeat,
    short: "Pain in head — ranges from tension to migraines.",
    severity: "Common",
    area: "Neurological",
  },
  {
    id: "fatigue",
    name: "Fatigue",
    icon: FaTired,
    short: "Low energy and tiredness; may be acute or chronic.",
    severity: "Common",
    area: "General",
  },
  {
    id: "shortness-of-breath",
    name: "Shortness of Breath",
    icon: FaLungs,
    short: "Difficulty breathing — may require urgent attention.",
    severity: "Urgent",
    area: "Respiratory",
  },
  {
    id: "sore-throat",
    name: "Sore Throat",
    icon: FaStethoscope,
    short: "Irritation or pain in the throat, commonly viral or bacterial.",
    severity: "Common",
    area: "ENT",
  },
];

const BODY_AREAS = ["All", "General", "Respiratory", "Neurological", "ENT"];

const severityColor = {
  Common: "bg-emerald-100 text-emerald-800",
  Urgent: "bg-rose-100 text-rose-800",
  Warning: "bg-amber-100 text-amber-800",
};

export default function MostAskedSymptoms() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("All");
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SYMPTOMS.filter((s) => {
      if (area !== "All" && s.area !== area) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.short.toLowerCase().includes(q) ||
        s.area.toLowerCase().includes(q)
      );
    });
  }, [query, area]);

  const openSymptom = useCallback(
    (symptom) => {
      const slug = symptom.id || symptom.name.toLowerCase().replace(/\s+/g, "-");
      navigate(`/symptoms/${encodeURIComponent(slug)}`);
    },
    [navigate]
  );

  const handleViewAll = useCallback(() => {
    navigate("/symptoms");
  }, [navigate]);

  return (
    <section
      aria-labelledby="most-asked-heading"
      className="py-16 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {}
          <aside className="lg:col-span-4 sticky top-24 self-start">
            <div className="rounded-3xl bg-white shadow-md border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-emerald-400 text-white flex items-center justify-center shadow">
                  <FaSearch className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="most-asked-heading" className="text-lg font-semibold text-gray-900">
                    Explore common symptoms
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Search or filter by body area, then click a symptom to view suggested tests and next steps.
                  </p>
                </div>
              </div>

              {}
              <div className="mt-4">
                <label htmlFor="symptom-search" className="sr-only">
                  Search symptoms
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaSearch className="w-4 h-4" />
                  </div>
                  <input
                    id="symptom-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search symptoms (e.g. fever, cough)"
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {BODY_AREAS.map((b) => {
                    const active = b === area;
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setArea(b)}
                        className={`px-3 py-1.5 text-sm rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
                          active
                            ? "bg-gradient-to-r from-indigo-600 to-emerald-400 text-white shadow"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                        aria-pressed={active}
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={handleViewAll}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:opacity-95 shadow"
                  >
                    View all symptoms
                    <FaExternalLinkAlt className="w-3.5 h-3.5" />
                  </button>

                  <div className="ml-auto text-xs text-gray-500">
                    {filtered.length} shown
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="mt-6 rounded-2xl bg-white/50 border border-gray-100 p-4 text-sm text-gray-700">
              <strong className="block text-sm text-gray-900">Quick tip</strong>
              <p className="mt-1">If symptoms are severe (e.g. difficulty breathing, chest pain) seek immediate care.</p>
            </div>
          </aside>

          {}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openSymptom(s)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openSymptom(s);
                      }
                    }}
                    className={`relative rounded-2xl border border-gray-100 bg-white p-5 flex flex-col gap-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 hover:shadow-lg transition-transform duration-200 ${
                      prefersReducedMotion ? "" : "transform hover:-translate-y-1"
                    }`}
                    aria-label={`Open details for ${s.name}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-50 to-emerald-50 text-indigo-700">
                        <Icon className="w-6 h-6" aria-hidden="true" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">{s.name}</h4>
                          <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${severityColor[s.severity] || "bg-gray-100 text-gray-700"}`}>
                            {s.severity}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{s.short}</p>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-xs text-gray-500">Suggested tests</span>
                      <div className="ml-auto flex items-center gap-2">
                        <span className="text-xs text-indigo-600 font-medium">View</span>
                        <svg className="w-4 h-4 text-indigo-600" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>

                    {}
                    <div className="absolute right-3 bottom-3 opacity-10 text-indigo-400">
                      <Icon className="w-10 h-10" />
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="col-span-full rounded-xl p-6 bg-white border border-gray-100 shadow-sm text-center">
                  <p className="text-sm text-gray-700">No symptoms match your search. Try another keyword or reset filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}