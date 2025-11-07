import React, { useState, useMemo } from "react";
import {
  FaArrowLeft,
  FaFlask,
  FaAppleAlt,
  FaChartLine,
  FaSyringe,
  FaClipboardCheck,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const TESTS = [
  { name: "Fasting Blood Glucose", description: "Measures sugar levels after fasting" },
  { name: "HbA1c (Glycated Hemoglobin)", description: "3-month average blood sugar" },
  { name: "Postprandial Glucose", description: "Sugar levels 2 hours after eating" },
  { name: "Oral Glucose Tolerance Test", description: "Evaluates insulin response" },
  { name: "C-Peptide Test", description: "Measures insulin production" },
  { name: "Insulin Assay", description: "Direct insulin level measurement" },
  { name: "Urine Microalbumin", description: "Checks for kidney damage" },
  { name: "Lipid Profile", description: "Cholesterol and triglycerides" },
];

const SYMPTOMS = [
  "Frequent urination",
  "Excessive thirst",
  "Unexplained weight loss",
  "Increased hunger",
  "Blurry vision",
  "Slow-healing sores",
  "Frequent infections",
  "Fatigue / irritability",
];

const MANAGEMENT = [
  "Monitor blood sugar regularly",
  "Follow balanced meal plan",
  "Engage in regular physical activity",
  "Maintain healthy weight",
  "Take medications as prescribed",
  "Manage stress effectively",
  "Check feet daily for sores",
  "Get regular eye exams",
];

const Stat = ({ label, value, tone = "indigo" }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-2xl font-extrabold text-black">{value}</span>
  </div>
);

const Accordion = ({ title, children, defaultOpen = false, id }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-gray-100">
      <button
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
        aria-hidden={!open}
        className={`px-4 pb-4 transition-all ${open ? "max-h-[2000px]" : "max-h-0 overflow-hidden"}`}
      >
        {children}
      </div>
    </div>
  );
};

export default function DiabetesCarePage() {
  
  const [expandedTest, setExpandedTest] = useState(-1);

  
  const tests = useMemo(() => TESTS, []);
  const symptoms = useMemo(() => SYMPTOMS, []);
  const management = useMemo(() => MANAGEMENT, []);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <main className="w-full bg-white text-black min-h-screen antialiased">
      {}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
        <Link to="/tests-by-concern" className="inline-flex items-center gap-3 text-sm text-gray-700 hover:text-indigo-600">
          <FaArrowLeft /> Back to Health Concerns
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm text-gray-600">Need help?</span>
          <a href="/contact" className="text-sm font-medium text-indigo-600 hover:underline">Contact our team</a>
        </div>
      </div>

      {}
      <header className="w-full bg-gradient-to-r from-indigo-600 to-sky-500 text-white py-12">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              Diabetes Care & Management
            </h1>
            <p className="mt-4 text-lg max-w-2xl">
              Comprehensive testing, evidence-based guidance and personalized monitoring to prevent complications and support long-term health.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/place-order?package=diabetes-full"
                className="inline-flex items-center gap-3 px-5 py-3 bg-white text-indigo-700 font-semibold shadow hover:scale-[1.02] transition-transform"
              >
                Book Diabetes Tests
              </Link>
              <a
                href="/devices"
                className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
              >
                View Monitoring Devices
              </a>
            </div>
          </div>

          {}
          <aside className="lg:col-span-5">
            <div className="bg-white text-black p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm text-gray-500">Quick snapshot</h3>
                  <p className="text-xl font-semibold text-black">Complete Diabetes Package</p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-500">From</div>
                  <div className="text-2xl font-extrabold">$165</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <Stat label="Tests" value={tests.length} />
                <Stat label="Symptoms" value={symptoms.length} />
                <Stat label="Tips" value={management.length} />
              </div>

              <div className="mt-6">
                <Link
                  to="/place-order?package=diabetes-full"
                  className="block w-full text-center px-4 py-3 bg-indigo-600 text-white font-semibold"
                >
                  Book Full Package
                </Link>
                <p className="mt-3 text-xs text-gray-500">
                  Free endocrinologist consultation with full package • Discount on repeat tests
                </p>
              </div>
            </div>
          </aside>
        </div>
      </header>

      {}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {}
        <section className="lg:col-span-2 space-y-8">
          {}
          <article className="bg-white border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 text-indigo-600">
                <FaFlask size={28} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-black">Understanding Diabetes</h2>
                <p className="mt-2 text-gray-700">
                  Diabetes affects how the body processes glucose. Early detection and consistent monitoring reduce the risk of serious complications — heart disease, kidney damage, neuropathy and vision loss.
                </p>
              </div>
            </div>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-black">Warning Signs</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {symptoms.map((s, i) => (
                <div key={i} className="p-3 border border-gray-100 bg-gray-50 flex items-center gap-3">
                  <div className="text-indigo-600"><FaAppleAlt /></div>
                  <div className="text-sm text-gray-700">{s}</div>
                </div>
              ))}
            </div>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-black">Management Plan</h3>
            <div className="mt-4 grid gap-4">
              {management.map((m, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-8 h-8 flex items-center justify-center bg-green-50 text-green-700 font-semibold">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Strategy {idx + 1}</h4>
                    <p className="text-sm text-gray-700 mt-1">{m}</p>
                  </div>
                </div>
              ))}
            </div>

            {}
            <div className="mt-6 md:hidden border-t border-gray-100">
              <Accordion title="More ways we help" id="more-help" defaultOpen={false}>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                  <li>Personalized dietary plans from nutritionists</li>
                  <li>On-demand teleconsults with endocrinologists</li>
                  <li>Continuous glucose monitoring integration</li>
                </ul>
              </Accordion>
            </div>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-black mb-4">Essential Tests</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tests.map((t, i) => {
                const expanded = expandedTest === i;
                return (
                  <div
                    key={t.name}
                    className={`border ${expanded ? "border-indigo-600 shadow-lg" : "border-gray-100"} p-4 bg-white focus-within:ring-2 focus-within:ring-indigo-200`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-indigo-600 pt-1"><FaSyringe /></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-black">{t.name}</h4>
                          <button
                            aria-expanded={expanded}
                            aria-controls={`test-desc-${i}`}
                            onClick={() => setExpandedTest(expanded ? -1 : i)}
                            className="text-sm text-indigo-600"
                          >
                            {expanded ? "Less" : "Details"}
                          </button>
                        </div>
                        <div
                          id={`test-desc-${i}`}
                          className={`${expanded ? "max-h-96" : "max-h-0"} transition-[max-height] duration-300 overflow-hidden text-sm text-gray-700 mt-2`}
                        >
                          <p>{t.description}</p>
                          <p className="mt-2 text-xs text-gray-500">Preparation: {i % 2 === 0 ? "Fasting 8–12 hrs" : "No fasting required"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6 overflow-x-auto">
            <h3 className="text-lg font-semibold text-black mb-4">Recommended Testing Frequency</h3>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left">Test</th>
                  <th className="px-4 py-2 text-left">Prediabetes</th>
                  <th className="px-4 py-2 text-left">Type 2 (Controlled)</th>
                  <th className="px-4 py-2 text-left">Type 1 / Uncontrolled</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3">HbA1c</td>
                  <td className="px-4 py-3">Every 6 months</td>
                  <td className="px-4 py-3">Every 3 months</td>
                  <td className="px-4 py-3">Every 3 months</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3">Fasting Glucose</td>
                  <td className="px-4 py-3">Every 6 months</td>
                  <td className="px-4 py-3">Every 3–6 months</td>
                  <td className="px-4 py-3">Monthly</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3">Lipid Profile</td>
                  <td className="px-4 py-3">Annually</td>
                  <td className="px-4 py-3">Annually</td>
                  <td className="px-4 py-3">Every 6 months</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3">Microalbumin</td>
                  <td className="px-4 py-3">Annually</td>
                  <td className="px-4 py-3">Annually</td>
                  <td className="px-4 py-3">Every 6 months</td>
                </tr>
              </tbody>
            </table>
          </article>
        </section>

        {}
        <aside className="space-y-6">
          <div className="sticky top-6">
            <div className="bg-white border border-gray-100 p-6">
              <h4 className="text-sm font-semibold text-gray-800">Why choose our tests</h4>
              <ul className="mt-3 text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <FaClipboardCheck className="text-indigo-600 mt-1" />
                  <span>Clinician-reviewed reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaChartLine className="text-indigo-600 mt-1" />
                  <span>AI-powered analysis & personalized recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaFlask className="text-indigo-600 mt-1" />
                  <span>Trusted, accredited partner labs</span>
                </li>
              </ul>

              <div className="mt-6">
                <Link
                  to="/place-order?package=diabetes-full"
                  className="block w-full text-center px-4 py-3 bg-indigo-600 text-white font-semibold"
                >
                  Book Now
                </Link>
                <a href="/contact" className="block mt-3 text-center text-sm text-indigo-600 hover:underline">Request a callback</a>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white border border-gray-100 p-6">
            <h4 className="text-sm font-semibold text-gray-800">Resources</h4>
            <ul className="mt-3 text-sm text-gray-700 space-y-2">
              <li><Link to="/learn/diabetes-diet" className="text-indigo-600 hover:underline">Diabetes-friendly meal plans</Link></li>
              <li><Link to="/learn/glucose-monitoring" className="text-indigo-600 hover:underline">How to use a CGM</Link></li>
              <li><Link to="/learn/foot-care" className="text-indigo-600 hover:underline">Foot care tips</Link></li>
            </ul>
          </div>
        </aside>
      </div>

      {}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 md:hidden z-50">
        <Link to="/place-order?package=diabetes-full" className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white font-semibold shadow-lg rounded-full">
          Book Full Package
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