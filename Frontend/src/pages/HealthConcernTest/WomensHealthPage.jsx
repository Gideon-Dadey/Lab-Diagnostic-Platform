import React, { useState, useMemo } from "react";
import { FaArrowLeft, FaFemale, FaBaby, FaFlask, FaCalendarAlt, FaHeartbeat, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";


const TESTS = [
  { name: "Pap Smear", description: "Cervical cancer screening" },
  { name: "HPV DNA Test", description: "High-risk HPV detection" },
  { name: "Mammogram", description: "Breast cancer screening" },
  { name: "Bone Density (DEXA)", description: "Osteoporosis assessment" },
  { name: "Thyroid Profile", description: "Thyroid function tests" },
  { name: "Pregnancy Test", description: "hCG hormone detection" },
  { name: "Prenatal Panel", description: "Comprehensive pregnancy screening" },
  { name: "Hormone Panel", description: "Reproductive hormone levels" },
];

const SCREENINGS_BY_AGE = [
  {
    age: "20–29",
    tests: ["Annual pelvic exam", "Pap smear every 3 years", "STD screening if sexually active", "Breast self-exam education"],
  },
  {
    age: "30–39",
    tests: ["Pap + HPV co-test every 5 years", "Clinical breast exam annually", "Fertility testing if needed", "Baseline mammogram if high risk"],
  },
  {
    age: "40–49",
    tests: ["Annual mammograms", "Diabetes screening", "Thyroid testing", "Cardiovascular risk assessment"],
  },
  {
    age: "50+",
    tests: ["Colon cancer screening", "Bone density testing", "Hormone level checks", "Vision and hearing tests"],
  },
];

const PREGNANCY_TESTS = [
  { trimester: "First Trimester", tests: ["CBC", "Blood type/Rh", "Rubella immunity", "Hep B", "HIV", "Urine culture"] },
  { trimester: "Second Trimester", tests: ["Glucose challenge", "Quad screen", "Anatomy ultrasound", "Amniocentesis (if indicated)"] },
  { trimester: "Third Trimester", tests: ["Group B strep", "Repeat CBC", "Fetal monitoring", "Repeat glucose if indicated"] },
];

const Accordion = ({ id, title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-gray-100">
      <button
        id={`${id}-btn`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <span className="text-gray-500">{open ? <FaChevronUp /> : <FaChevronDown />}</span>
      </button>

      <div
        id={id}
        role="region"
        aria-labelledby={`${id}-btn`}
        className={`px-4 pb-4 transition-[max-height] duration-300 overflow-hidden ${open ? "max-h-[2000px]" : "max-h-0"}`}
      >
        {children}
      </div>
    </div>
  );
};

export default function WomensHealthPage() {
  const [selectedTestOpen, setSelectedTestOpen] = useState(-1);
  const tests = useMemo(() => TESTS, []);
  const screenings = useMemo(() => SCREENINGS_BY_AGE, []);
  const pregnancy = useMemo(() => PREGNANCY_TESTS, []);
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <main className="w-full bg-white text-black antialiased">
      {}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
        <Link to="/tests-by-concern" className="inline-flex items-center gap-3 text-sm text-gray-700 hover:text-pink-600">
          <FaArrowLeft /> Back to Health Concerns
        </Link>
        <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
          <Link to="/contact" className="hover:text-pink-600">Talk to a clinician</Link>
        </div>
      </div>

      {}
      <header className="bg-gradient-to-r from-pink-600 to-pink-500 text-white">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">Women's Health Screenings</h1>
            <p className="mt-4 text-lg max-w-2xl">
              Evidence-based, life-stage care — from reproductive health and pregnancy to bone and cardiovascular screening.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/place-order?package=womens-wellness" className="inline-flex items-center gap-3 px-5 py-3 bg-white text-pink-700 font-semibold shadow hover:scale-[1.02] transition-transform">
                Book Women's Tests
              </Link>
              <Link to="/prenatal-packages" className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition">
                View Prenatal Packages
              </Link>
            </div>
          </div>

          {}
          <aside className="lg:col-span-5">
            <div className="bg-white text-black p-6 border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm text-gray-500">Women's Wellness</h3>
                  <p className="text-xl font-semibold">Comprehensive Life-stage Screening</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">From</div>
                  <div className="text-2xl font-extrabold">$31.79</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-500">Tests</div>
                  <div className="text-lg font-bold">{tests.length}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Pregnancy</div>
                  <div className="text-lg font-bold">Trimester‑based</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Clinician</div>
                  <div className="text-lg font-bold">Included</div>
                </div>
              </div>

              <div className="mt-6">
                <Link to="/place-order?package=womens-wellness" className="block w-full text-center px-4 py-3 bg-pink-600 text-white font-semibold">Book Full Package</Link>
                <p className="mt-3 text-xs text-gray-500">Discreet testing • Female phlebotomists available</p>
              </div>
            </div>
          </aside>
        </div>
      </header>

      {}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <section className="lg:col-span-2 space-y-8">
          {}
          <article className="bg-white border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <FaFemale className="text-pink-600 text-2xl mt-1" />
              <div>
                <h2 className="text-xl font-semibold">Essential Women's Health</h2>
                <p className="mt-2 text-gray-700">
                  Care tailored to each stage of life — screenings, pregnancy care, hormone assessment, and preventative checks for heart and bone health.
                </p>
              </div>
            </div>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Recommended Screenings by Age</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {screenings.map((g) => (
                <div key={g.age} className="relative border border-gray-100 p-4 bg-gray-50">
                  <div className="absolute left-0 top-0 h-full w-1" style={{ background: "linear-gradient(180deg,#ec4899,#db2777)" }} />
                  <h4 className="font-semibold text-pink-600 ml-3">{g.age}</h4>
                  <ul className="mt-3 text-sm text-gray-700 ml-3 space-y-2">
                    {g.tests.map((t, i) => <li key={i}>• {t}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Pregnancy Testing Timeline</h3>
            <div className="hidden md:grid md:grid-cols-3 gap-4">
              {pregnancy.map((tri) => (
                <div key={tri.trimester} className="border border-gray-100 p-4 bg-white">
                  <h4 className="font-semibold text-purple-700 mb-3">{tri.trimester}</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    {tri.tests.map((t, i) => <li key={i}>• {t}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            {}
            <div className="md:hidden mt-2">
              {pregnancy.map((tri, idx) => (
                <Accordion key={tri.trimester} id={`preg-${idx}`} title={tri.trimester}>
                  <ul className="text-sm text-gray-700 space-y-2">
                    {tri.tests.map((t, i) => <li key={i}>• {t}</li>)}
                  </ul>
                </Accordion>
              ))}
            </div>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Comprehensive Women's Health Tests</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tests.map((t, i) => {
                const open = selectedTestOpen === i;
                return (
                  <div key={t.name} className={`border ${open ? "border-pink-600 shadow-lg" : "border-gray-100"} p-4`}>
                    <div className="flex items-start gap-3">
                      <div className="text-pink-600 pt-1"><FaFlask /></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-black">{t.name}</h4>
                          <button
                            onClick={() => setSelectedTestOpen(open ? -1 : i)}
                            aria-expanded={open}
                            aria-controls={`test-${i}`}
                            className="text-sm text-pink-600"
                          >
                            {open ? "Less" : "Details"}
                          </button>
                        </div>
                        <div id={`test-${i}`} className={`mt-2 text-sm text-gray-700 overflow-hidden transition-[max-height] duration-300 ${open ? "max-h-40" : "max-h-0"}`}>
                          <p>{t.description}</p>
                          {open && <p className="mt-2 text-xs text-gray-500">Preparation: {i % 2 === 0 ? "Fasting 8–12 hrs" : "No fasting required"}</p>}
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
            <h3 className="text-lg font-semibold mb-4">Special Considerations</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-pink-600 mb-2">Contraception & Screening</h4>
                <p className="text-gray-700">Monitoring for blood pressure, clotting risks and STI screening as appropriate with long-term contraceptive use.</p>
              </div>
              <div>
                <h4 className="font-semibold text-pink-600 mb-2">Menopause Transition</h4>
                <p className="text-gray-700">Hormone testing, bone health and cardiovascular assessment become priorities during transition.</p>
              </div>
            </div>
          </article>
        </section>

        {}
        <aside className="space-y-6">
          <div className="sticky top-6">
            <div className="bg-white border border-gray-100 p-6">
              <h4 className="text-sm font-semibold text-gray-800">Why trust our screening</h4>
              <ul className="mt-3 text-sm text-gray-700 space-y-3">
                <li>Clinician-curated packages</li>
                <li>Female phlebotomists on request</li>
                <li>Discreet sample handling</li>
              </ul>

              <div className="mt-6">
                <Link to="/place-order?package=womens-wellness" className="block w-full text-center px-4 py-3 bg-pink-600 text-white font-semibold">Book Now</Link>
                <Link to="/contact" className="block mt-3 text-center text-sm text-pink-600 hover:underline">Request callback</Link>
                <Link to="/faq#women" className="block mt-2 text-center text-sm text-gray-600 hover:underline">Women's FAQs</Link>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6">
            <h4 className="text-sm font-semibold text-gray-800">Quick resources</h4>
            <ul className="mt-3 text-sm text-gray-700 space-y-2">
              <li><Link to="/learn/periods" className="text-pink-600 hover:underline">Understanding cycles</Link></li>
              <li><Link to="/learn/breast-health" className="text-pink-600 hover:underline">Breast health guide</Link></li>
              <li><Link to="/learn/menopause" className="text-pink-600 hover:underline">Menopause support</Link></li>
            </ul>
          </div>
        </aside>
      </div>

      {}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 md:hidden z-50">
        <Link to="/place-order?package=womens-wellness" className="inline-flex items-center gap-3 px-6 py-3 bg-pink-600 text-white font-semibold shadow-lg rounded-full">
          Book Full Package
        </Link>
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; animation: none !important; }
        }
        /* focus-visible ring fallback */
        :focus-visible { outline: none; box-shadow: 0 0 0 4px rgba(236,72,153,0.12); }
      `}</style>
    </main>
  );
}