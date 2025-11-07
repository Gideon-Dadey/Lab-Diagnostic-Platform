import React, { useState, useMemo } from "react";
import {
  FaArrowLeft,
  FaHeartbeat,
  FaClipboardList,
  FaUserMd,
  FaCalendarAlt,
  FaVial,
  FaQuestionCircle,
  FaPhoneAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const TESTS = [
  { name: "Complete Blood Count (CBC)", description: "Measures overall health and detects disorders", details: "Detects anemia, infection, monitors blood disorders." },
  { name: "Lipid Profile", description: "Checks cholesterol and triglyceride levels", details: "Includes HDL, LDL, total cholesterol and triglycerides." },
  { name: "Liver Function Test", description: "Evaluates liver health and function", details: "Includes ALT, AST, ALP, bilirubin and albumin." },
  { name: "Kidney Function Test", description: "Assesses kidney performance", details: "Measures creatinine, urea and eGFR." },
  { name: "Prostate-Specific Antigen (PSA)", description: "Screens for prostate health", details: "Useful for prostate disease screening; discuss thresholds with clinician." },
  { name: "Blood Sugar (Fasting/Random)", description: "Measures glucose levels for diabetes", details: "Includes FPG and random glucose; HbA1c available separately." },
  { name: "Vitamin D & B12", description: "Checks for common vitamin deficiencies", details: "Identifies insufficiency/deficiency to guide supplementation." },
  { name: "Testosterone Level", description: "Measures male hormone levels", details: "Helps evaluate fatigue, libido changes, and other symptoms." },
  { name: "ECG", description: "Checks heart rhythm and electrical activity", details: "Resting 12-lead ECG for arrhythmia and ischemia detection." },
  { name: "Thyroid Profile", description: "Evaluates thyroid function", details: "TSH, Free T4 and Free T3 to detect hypo/hyperthyroidism." },
];

const FAQS = [
  { q: "Do I need to fast before these tests?", a: "Yes, fasting for 8-12 hours is required for accurate lipid profile and fasting glucose. Drink water only." },
  { q: "How long will the tests take?", a: "Sample collection is typically 15–30 minutes, but allow up to 45 minutes for registration and preparation." },
  { q: "When will I get my results?", a: "Most routine results are ready in 24–48 hours; specialized tests may take several days." },
  { q: "Is the blood test painful?", a: "You may feel a brief pinch. Our phlebotomists use child/adult-friendly techniques to minimize discomfort." },
];

const Stat = ({ label, value }) => (
  <div>
    <div className="text-xs text-gray-500">{label}</div>
    <div className="text-2xl font-extrabold text-black">{value}</div>
  </div>
);

export default function MenHealthPage() {
  const [expandedTest, setExpandedTest] = useState(-1);
  const [expandedFAQ, setExpandedFAQ] = useState(-1);
  const tests = useMemo(() => TESTS, []);
  const faqs = useMemo(() => FAQS, []);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <main className="w-full bg-white text-black antialiased">
      {}
      <div className="w-full max-w-screen-2xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
        <Link to="/tests-by-concern" className="inline-flex items-center gap-3 text-sm text-gray-700 hover:text-primary">
          <FaArrowLeft /> Back to Health Concerns
        </Link>

        <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
          <FaPhoneAlt />
          <a href="tel:+12034101665" className="hover:text-primary">+1 203-410-1665</a>
        </div>
      </div>

      {}
      <header className="bg-gradient-to-r from-red-700 to-red-600 text-white">
        <div className="w-full max-w-screen-2xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">Men's Health Checkups</h1>
            <p className="mt-4 text-lg max-w-2xl">A comprehensive package of tests and clinician-reviewed reports to help men stay healthy and proactive.</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/place-order?package=mens-full" className="inline-flex items-center px-5 py-3 bg-white text-red-700 font-semibold shadow-sm hover:scale-[1.02] transition-transform">
                Book a Test
              </Link>
              <a href="/partners?tag=mens-health" className="inline-flex items-center px-5 py-3 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition">
                View Labs
              </a>
            </div>
          </div>

          {}
          <aside className="lg:col-span-5">
            <div className="bg-white text-black p-6 border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm text-gray-500">Men's Health Package</h3>
                  <p className="text-xl font-semibold">Complete Health & Screening</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">From</div>
                  <div className="text-2xl font-extrabold">$7.07</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <Stat label="Tests" value={tests.length} />
                <Stat label="Risk factors" value={8} />
                <Stat label="Clinician review" value="Yes" />
              </div>

              <div className="mt-6">
                <Link to="/place-order?package=mens-full" className="block w-full text-center px-4 py-3 bg-red-600 text-white font-semibold">
                  Book Now
                </Link>
                <a href="/contact" className="block mt-3 text-center text-sm text-red-600 hover:underline">Request callback</a>
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
              <div className="text-2xl text-red-600"><FaHeartbeat /></div>
              <div>
                <h2 className="text-xl font-semibold">Overview</h2>
                <p className="mt-2 text-gray-700">
                  Regular men's health checks detect silent conditions early and help guide lifestyle and clinical interventions. Our packages are curated to cover common male health concerns including cardiac, metabolic, hormonal and prostate health.
                </p>
              </div>
            </div>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Why Men's Health Checks are Important</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-100 flex items-start gap-4">
                <FaHeartbeat className="text-red-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Early Detection</h4>
                  <p className="text-sm text-gray-700">Identify hypertension, diabetes and cardiac risk early.</p>
                </div>
              </div>
              <div className="p-4 border border-gray-100 flex items-start gap-4">
                <FaVial className="text-red-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Vital Metrics</h4>
                  <p className="text-sm text-gray-700">Monitor cholesterol, liver, kidney and hormone levels.</p>
                </div>
              </div>
              <div className="p-4 border border-gray-100 flex items-start gap-4">
                <FaClipboardList className="text-red-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Cancer Screening</h4>
                  <p className="text-sm text-gray-700">PSA and age-appropriate screenings for early intervention.</p>
                </div>
              </div>
              <div className="p-4 border border-gray-100 flex items-start gap-4">
                <FaUserMd className="text-red-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Hormone Balance</h4>
                  <p className="text-sm text-gray-700">Assess testosterone and related symptoms like low energy.</p>
                </div>
              </div>
            </div>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Included Tests</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tests.map((t, i) => {
                const open = expandedTest === i;
                return (
                  <div key={t.name} className={`border ${open ? "border-red-600 shadow-lg" : "border-gray-100"} p-4`}>
                    <div className="flex items-start gap-3">
                      <div className="pt-1 text-red-600"><FaVial /></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-black">{t.name}</h4>
                          <button
                            onClick={() => setExpandedTest(open ? -1 : i)}
                            aria-expanded={open}
                            aria-controls={`test-${i}`}
                            className="text-sm text-red-600"
                          >
                            {open ? "Hide" : "Details"}
                          </button>
                        </div>
                        <div id={`test-${i}`} className={`${open ? "max-h-64" : "max-h-0"} overflow-hidden transition-[max-height] duration-300 mt-2 text-sm text-gray-700`}>
                          <p>{t.description}</p>
                          {open && <p className="mt-2 text-xs text-gray-500">{t.details}</p>}
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
            <h3 className="text-lg font-semibold mb-4">Recommended By Age Group</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-100 bg-gray-50">
                <h4 className="font-semibold text-lg text-black mb-2">20–39 Years</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>Basic metabolic panel</li>
                  <li>Complete blood count</li>
                  <li>Testosterone screening (if symptomatic)</li>
                </ul>
              </div>
              <div className="p-4 border border-gray-100 bg-gray-50">
                <h4 className="font-semibold text-lg text-black mb-2">40–59 Years</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>All basic tests plus PSA</li>
                  <li>Comprehensive lipid profile</li>
                  <li>Diabetes screening</li>
                </ul>
              </div>
              <div className="p-4 border border-gray-100 bg-gray-50">
                <h4 className="font-semibold text-lg text-black mb-2">60+ Years</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>Complete annual checkup</li>
                  <li>Cardiac risk assessment</li>
                  <li>Colon cancer screening (as advised)</li>
                </ul>
              </div>
            </div>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">When Should You Get Tested?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <FaCalendarAlt className="text-red-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Annual Checkup</h4>
                  <p className="text-sm text-gray-700">Men over 40 — annually. Younger men every 2–3 years or as advised.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaCalendarAlt className="text-red-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Lifestyle Factors</h4>
                  <p className="text-sm text-gray-700">If you smoke, have high stress, are overweight, or have unhealthy habits — test earlier and more often.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaCalendarAlt className="text-red-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Family History</h4>
                  <p className="text-sm text-gray-700">Family history of heart disease, diabetes or cancer indicates earlier testing.</p>
                </div>
              </div>
            </div>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Benefits of Booking With Us</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-100">
                <h4 className="font-semibold">NABL-Accredited Labs</h4>
                <p className="text-sm text-gray-700">Accurate results with strict quality controls.</p>
              </div>
              <div className="p-4 border border-gray-100">
                <h4 className="font-semibold">Home Sample Collection</h4>
                <p className="text-sm text-gray-700">Convenient and safe home visits by trained staff.</p>
              </div>
              <div className="p-4 border border-gray-100">
                <h4 className="font-semibold">Fast Results</h4>
                <p className="text-sm text-gray-700">Most reports available within 24–48 hours.</p>
              </div>
              <div className="p-4 border border-gray-100">
                <h4 className="font-semibold">Doctor Consultation</h4>
                <p className="text-sm text-gray-700">Free report interpretation with our experts.</p>
              </div>
            </div>
          </article>

          {}
          <article className="bg-red-600 text-white p-6">
            <h3 className="text-xl font-semibold mb-3">Ready to take charge of your health?</h3>
            <p className="mb-4 text-sm">Complete Men's Health Package • Home collection available</p>
            <Link to="/place-order?package=mens-full" className="inline-flex items-center gap-3 px-6 py-3 bg-white text-red-700 font-semibold">Book Now</Link>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
            <div className="divide-y divide-gray-100">
              {faqs.map((f, idx) => (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === idx ? -1 : idx)}
                    aria-expanded={expandedFAQ === idx}
                    className="flex items-start gap-3 w-full text-left"
                  >
                    <FaQuestionCircle className="text-primary mt-1" />
                    <div className="flex-1">
                      <div className="font-semibold text-black">{f.q}</div>
                      {expandedFAQ === idx && <p className="mt-2 text-sm text-gray-700">{f.a}</p>}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </article>
        </section>

        {}
        <aside className="space-y-6">
          <div className="sticky top-6">
            <div className="bg-white border border-gray-100 p-6">
              <h4 className="text-sm font-semibold text-gray-800">Why choose us</h4>
              <ul className="mt-3 text-sm text-gray-700 space-y-3">
                <li className="flex items-start gap-3"><FaClipboardList className="text-red-600 mt-1" /><span>Clinician-reviewed reports</span></li>
                <li className="flex items-start gap-3"><FaHeartbeat className="text-red-600 mt-1" /><span>Comprehensive screening</span></li>
                <li className="flex items-start gap-3"><FaVial className="text-red-600 mt-1" /><span>Accredited partner labs</span></li>
              </ul>

              <div className="mt-6">
                <Link to="/place-order?package=mens-full" className="block w-full text-center px-4 py-3 bg-red-600 text-white font-semibold">Book Now</Link>
                <Link to="/contact" className="block mt-3 text-center text-sm text-red-600 hover:underline">Request callback</Link>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6">
            <h4 className="text-sm font-semibold text-gray-800">Quick resources</h4>
            <ul className="mt-3 text-sm text-gray-700 space-y-2">
              <li><Link to="/learn/men-diet" className="text-red-600 hover:underline">Nutrition for men</Link></li>
              <li><Link to="/learn/heart-screen" className="text-red-600 hover:underline">Heart screening guide</Link></li>
              <li><Link to="/learn/hormones" className="text-red-600 hover:underline">Hormone health</Link></li>
            </ul>
          </div>

          <div className="bg-white border border-gray-100 p-4 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Clinic hours</div>
                <div className="font-medium text-gray-900">Mon–Fri • 9:00 AM – 6:00 PM</div>
              </div>
              <Link to="/place-order" className="text-red-600 hover:underline">Book visit</Link>
            </div>
          </div>
        </aside>
      </div>

      {}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 md:hidden z-50">
        <Link to="/place-order?package=mens-full" className="inline-flex items-center gap-3 px-6 py-3 bg-red-600 text-white font-semibold shadow-lg">
          Book Men's Package
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