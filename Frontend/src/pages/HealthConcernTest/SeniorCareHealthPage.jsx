import React, { useState, useMemo } from "react";
import {
  FaArrowLeft,
  FaUserAlt,
  FaClipboardList,
  FaUserMd,
  FaBone,
  FaBrain,
  FaPhoneAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const TESTS = [
  { name: "Bone Density Scan", description: "Detects osteoporosis risk" },
  { name: "Cognitive Function Test", description: "Assesses memory and brain health" },
  { name: "Comprehensive Metabolic Panel", description: "Kidney/liver function evaluation" },
  { name: "Vitamin D & B12 Test", description: "Common deficiencies in seniors" },
  { name: "Thyroid Function Test", description: "Metabolism regulation check" },
  { name: "Prostate-Specific Antigen (PSA)", description: "For men over 50" },
  { name: "Mammogram", description: "For women (annual screening)" },
  { name: "Fall Risk Assessment", description: "Balance and mobility evaluation" },
];

const RISK = [
  "Age 65+",
  "Family history of dementia",
  "Sedentary lifestyle",
  "History of falls",
  "Chronic medication use",
  "Poor nutrition",
  "Social isolation",
  "Multiple chronic conditions",
];

const PREVENT = [
  "Annual wellness visits",
  "Balance exercises (prevent falls)",
  "Cognitive stimulation activities",
  "Vaccinations (flu, pneumonia, shingles)",
  "Medication reviews",
  "Social engagement",
  "Bone-healthy diet (calcium/vitamin D)",
  "Regular vision/hearing checks",
];

const Stat = ({ label, value }) => (
  <div>
    <div className="text-xs text-gray-600">{label}</div>
    <div className="text-2xl font-extrabold text-black">{value}</div>
  </div>
);

export default function SeniorCarePage() {
  const [expanded, setExpanded] = useState(-1);
  const tests = useMemo(() => TESTS, []);
  const risk = useMemo(() => RISK, []);
  const prevent = useMemo(() => PREVENT, []);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <main className="w-full bg-white text-black antialiased">
      {}
      <div className="w-full max-w-screen-2xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
        <Link to="/tests-by-concern" className="inline-flex items-center gap-3 text-sm text-gray-700 hover:text-indigo-600">
          <FaArrowLeft /> Back to Health Concerns
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <FaPhoneAlt />
          <a href="tel:+12034101665" className="hover:text-indigo-600">+1 203-410-1665</a>
        </div>
      </div>

      {}
      <header className="bg-gradient-to-r from-purple-700 to-purple-600 text-white">
        <div className="w-full max-w-screen-2xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">Senior Health Screenings</h1>
            <p className="mt-4 text-lg max-w-2xl">
              Specialized assessments for aging adults focused on independence, mobility, cognition and chronic condition management.
            </p>

            <div className="mt-6 flex gap-3 flex-wrap">
              <Link
                to="/place-order?package=senior-wellness"
                className="inline-flex items-center gap-3 px-5 py-3 bg-white text-purple-700 font-semibold shadow hover:shadow-lg transition-transform"
              >
                Book Senior Tests
              </Link>

              <a
                href="/partners?tag=geriatrics"
                className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
              >
                View Geriatric Labs
              </a>
            </div>
          </div>

          {}
          <aside className="lg:col-span-4">
            <div className="bg-white text-black p-6 border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm text-gray-500">Senior Wellness</h3>
                  <p className="text-xl font-semibold">Comprehensive Screening Bundle</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">From</div>
                  <div className="text-2xl font-extrabold">$4.11</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <Stat label="Tests" value={tests.length} />
                <Stat label="Risk items" value={risk.length} />
                <Stat label="Prevention tips" value={prevent.length} />
              </div>

              <div className="mt-6">
                <Link to="/place-order?package=senior-wellness" className="block w-full text-center px-4 py-3 bg-purple-700 text-white font-semibold">
                  Book Now
                </Link>
                <p className="mt-3 text-xs text-gray-500">Home sample collection • Geriatric consult available</p>
              </div>
            </div>
          </aside>
        </div>
      </header>

      {}
      <div className="w-full max-w-screen-2xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {}
        <section className="lg:col-span-2 space-y-8">
          {}
          <article className="bg-white border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="text-2xl text-purple-600"><FaUserAlt /></div>
              <div>
                <h2 className="text-xl font-semibold">Senior Health Essentials</h2>
                <p className="mt-2 text-gray-700">
                  Aging increases risk for chronic conditions and functional decline. Regular screening helps identify issues early and supports independence.
                </p>
              </div>
            </div>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Essential Senior Health Tests</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tests.map((t, i) => {
                const isOpen = expanded === i;
                return (
                  <div
                    key={t.name}
                    className={`border ${isOpen ? "border-purple-600 shadow-lg" : "border-gray-100"} p-4`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-1 text-purple-600">
                        {t.name.includes("Bone") ? <FaBone /> : t.name.includes("Cognitive") ? <FaBrain /> : <FaClipboardList />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-black">{t.name}</h4>
                          <button
                            onClick={() => setExpanded(isOpen ? -1 : i)}
                            aria-expanded={isOpen}
                            aria-controls={`test-${i}`}
                            className="text-sm text-purple-600"
                          >
                            {isOpen ? "Hide" : "Details"}
                          </button>
                        </div>
                        <div
                          id={`test-${i}`}
                          className={`mt-2 text-sm text-gray-700 overflow-hidden transition-[max-height] duration-300 ${isOpen ? "max-h-48" : "max-h-0"}`}
                        >
                          <p>{t.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Key Risk Factors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {risk.map((r, idx) => (
                <div key={idx} className="p-4 border border-gray-100 bg-gray-50">
                  <div className="text-sm text-gray-700">{r}</div>
                </div>
              ))}
            </div>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Prevention & Maintenance</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {prevent.map((p, idx) => (
                <div key={idx} className="p-4 border border-gray-100 bg-gray-50 flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-purple-50 text-purple-700 font-semibold">{idx + 1}</div>
                  <div className="text-sm text-gray-700">{p}</div>
                </div>
              ))}
            </div>
          </article>

          {}
          <article className="bg-purple-700 text-white p-6">
            <h3 className="text-xl font-semibold mb-2">Senior Wellness Package</h3>
            <p className="text-sm mb-4">Includes essential screens and a geriatric consultation</p>
            <Link to="/place-order?package=senior-wellness" className="inline-block px-5 py-3 bg-white text-purple-700 font-semibold">Book Now</Link>
          </article>
        </section>

        {}
        <aside className="space-y-6">
          <div className="sticky top-6">
            <div className="bg-white border border-gray-100 p-6">
              <h4 className="text-sm font-semibold text-gray-800">Why book with us</h4>
              <ul className="mt-3 text-sm text-gray-700 space-y-3">
                <li className="flex items-start gap-3"><FaClipboardList className="text-purple-600 mt-1" /><span>Accredited labs</span></li>
                <li className="flex items-start gap-3"><FaUserMd className="text-purple-600 mt-1" /><span>Geriatric specialist review</span></li>
                <li className="flex items-start gap-3"><FaBone className="text-purple-600 mt-1" /><span>Comprehensive bone health checks</span></li>
              </ul>

              <div className="mt-6">
                <Link to="/place-order?package=senior-wellness" className="block w-full text-center px-4 py-3 bg-purple-700 text-white font-semibold">Book Now</Link>
                <Link to="/contact" className="block mt-3 text-center text-sm text-purple-700 hover:underline">Request callback</Link>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6">
            <h4 className="text-sm font-semibold text-gray-800">Quick resources</h4>
            <ul className="mt-3 text-sm text-gray-700 space-y-2">
              <li><Link to="/learn/bone-health" className="text-purple-600 hover:underline">Bone health tips</Link></li>
              <li><Link to="/learn/cognitive" className="text-purple-600 hover:underline">Cognitive screening guide</Link></li>
              <li><Link to="/learn/fall-prevention" className="text-purple-600 hover:underline">Fall prevention</Link></li>
            </ul>
          </div>
        </aside>
      </div>

      {}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 md:hidden z-50">
        <Link to="/place-order?package=senior-wellness" className="inline-flex items-center gap-3 px-6 py-3 bg-purple-700 text-white font-semibold shadow-lg">
          Book Senior Tests
        </Link>
      </div>

      {}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; animation: none !important; }
        }
      `}</style>
    </main>
  );
}