import React, { useState, useMemo } from "react";
import {
  FaArrowLeft,
  FaHeartbeat,
  FaClipboardList,
  FaUserMd,
  FaCalendarAlt,
  FaVial,
  FaAppleAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";


const TESTS = [
  { name: "Complete Lipid Profile", description: "Measures cholesterol and triglycerides", details: "Includes HDL, LDL, total cholesterol, and triglycerides." },
  { name: "Cardiac Enzyme Test", description: "Checks for heart muscle damage", details: "Troponin I/T and CK-MB to detect myocardial injury." },
  { name: "CRP (C-Reactive Protein)", description: "Measures inflammation linked to heart disease", details: "High-sensitivity CRP used to stratify cardiovascular risk." },
  { name: "Homocysteine Test", description: "High levels may indicate heart disease risk", details: "Elevated homocysteine is a modifiable risk marker." },
  { name: "Electrocardiogram (ECG)", description: "Records heart's electrical activity", details: "Resting 12-lead ECG for arrhythmia and ischemia screening." },
  { name: "Stress Test", description: "Evaluates heart function under exertion", details: "Treadmill or bike with ECG monitoring to reveal exertional ischemia." },
  { name: "Echocardiogram", description: "Ultrasound of the heart", details: "Assesses cardiac structure, valve function and ejection fraction." },
  { name: "NT-proBNP", description: "Checks for heart failure", details: "Biomarker helpful in diagnosing and monitoring heart failure." },
];

const RISK_FACTORS = [
  "High blood pressure",
  "High cholesterol",
  "Diabetes",
  "Obesity",
  "Smoking",
  "Physical inactivity",
  "Family history of heart disease",
  "Age (45+ for men, 55+ for women)",
];

const PREVENTION = [
  "Eat a heart-healthy diet (low salt, saturated fats)",
  "Exercise regularly (150 mins/week)",
  "Maintain healthy weight",
  "Manage stress effectively",
  "Control blood pressure and cholesterol",
  "Avoid tobacco products",
  "Limit alcohol consumption",
  "Get regular health screenings",
];

const Stat = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-2xl font-extrabold text-black">{value}</span>
  </div>
);

export default function HeartHealthPage() {
  const [expanded, setExpanded] = useState(null);
  const tests = useMemo(() => TESTS, []);
  const riskFactors = useMemo(() => RISK_FACTORS, []);
  const prevention = useMemo(() => PREVENTION, []);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <main className="w-full bg-white text-black antialiased">
      {}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
        <Link to="/tests-by-concern" className="inline-flex items-center gap-3 text-sm text-gray-700 hover:text-red-600">
          <FaArrowLeft /> Back to Health Concerns
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <a href="/contact" className="text-sm text-gray-600 hover:text-red-600">Contact</a>
          <Link to="/place-order" className="text-sm inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 border border-red-100">Book Now</Link>
        </div>
      </div>

      {}
      <header className="bg-gradient-to-r from-red-600 to-red-500 text-white">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              Heart Health Assessments
            </h1>
            <p className="mt-4 text-lg max-w-2xl">
              Comprehensive cardiac evaluations to detect and prevent heart disease — clinically-validated tests and expert review.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/place-order?package=cardiac-full"
                className="inline-flex items-center gap-3 px-5 py-3 bg-white text-red-700 font-semibold shadow hover:scale-[1.02] transition-transform"
              >
                Book Cardiac Tests
              </Link>

              <a
                href="/partners?tag=cardiac"
                className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
              >
                View Cardiac Labs
              </a>
            </div>
          </div>

          {}
          <aside className="lg:col-span-5">
            <div className="bg-white text-black p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm text-gray-500">Cardiac Package</h3>
                  <p className="text-xl font-semibold">Complete Cardiac Assessment</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">From</div>
                  <div className="text-2xl font-extrabold">$28.16</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <Stat label="Tests" value={tests.length} />
                <Stat label="Risk factors" value={riskFactors.length} />
                <Stat label="Prevention tips" value={prevention.length} />
              </div>

              <div className="mt-6">
                <Link to="/place-order?package=cardiac-full" className="block w-full text-center px-4 py-3 bg-red-600 text-white font-semibold">
                  Book Full Package
                </Link>
                <p className="mt-3 text-xs text-gray-500">Home sample collection available • Free cardiologist consultation with full package</p>
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
              <div className="text-2xl text-red-600"><FaHeartbeat /></div>
              <div>
                <h2 className="text-xl font-semibold text-black">Understanding Heart Health</h2>
                <p className="mt-2 text-gray-700">
                  Cardiovascular disease is a leading cause of death worldwide. Early screening and consistent monitoring reduce risks and help guide preventive strategies.
                </p>
              </div>
            </div>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-black mb-4">Key Risk Factors for Heart Disease</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {riskFactors.map((f, i) => (
                <div key={i} className="p-4 border border-gray-100 bg-gray-50 flex items-start gap-3">
                  <div className="text-red-600 mt-1"><FaClipboardList /></div>
                  <div className="text-sm text-gray-700">{f}</div>
                </div>
              ))}
            </div>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-black mb-4">Heart Disease Prevention Strategies</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {prevention.map((p, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-9 h-9 flex items-center justify-center bg-blue-50 text-blue-700 rounded-sm">
                    <FaUserMd />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800">Step {i + 1}</h4>
                    <p className="text-sm text-gray-700 mt-1">{p}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-black mb-4">Comprehensive Cardiac Tests</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tests.map((t, i) => {
                const isOpen = expanded === i;
                return (
                  <div
                    key={t.name}
                    className={`border ${isOpen ? "border-red-600 shadow-lg" : "border-gray-100"} p-4 bg-white focus-within:ring-2 focus-within:ring-red-100`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-red-600 pt-1"><FaVial /></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-black">{t.name}</h4>
                          <button
                            aria-expanded={isOpen}
                            aria-controls={`test-desc-${i}`}
                            onClick={() => setExpanded(isOpen ? null : i)}
                            className="text-sm text-red-600"
                          >
                            {isOpen ? "Hide" : "Details"}
                          </button>
                        </div>
                        <div
                          id={`test-desc-${i}`}
                          className={`mt-2 text-sm text-gray-700 transition-[max-height] duration-300 overflow-hidden ${isOpen ? "max-h-60" : "max-h-0"}`}
                        >
                          <p>{t.description}</p>
                          {isOpen && <p className="mt-2 text-xs text-gray-500">{t.details}</p>}
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
            <h3 className="text-lg font-semibold text-black mb-4">Test Preparation Guidelines</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Fasting & meds</h4>
                <p className="text-gray-700 mb-4">Lipid profiles usually require 9–12 hours fasting. Continue necessary meds unless advised by your clinician; inform the lab of supplements and prescriptions.</p>

                <h4 className="font-semibold text-red-600 mb-2">Stress test prep</h4>
                <p className="text-gray-700">Wear comfortable clothes & shoes; avoid heavy meals, caffeine and smoking for 3 hours before the test.</p>
              </div>

              <div>
                <h4 className="font-semibold text-red-600 mb-2">Results timeline</h4>
                <p className="text-gray-700 mb-4">Most routine blood tests are available within 24–48 hours. Specialized panels may take 3–5 business days.</p>

                <h4 className="font-semibold text-red-600 mb-2">Next steps</h4>
                <ol className="list-decimal pl-5 text-gray-700">
                  <li>Book a consultation with a cardiologist if abnormal</li>
                  <li>Repeat tests as advised</li>
                  <li>Follow lifestyle & pharmacologic recommendations</li>
                </ol>
              </div>
            </div>
          </article>
        </section>

        {}
        <aside className="space-y-6">
          <div className="sticky top-6">
            <div className="bg-white border border-gray-100 p-6">
              <h4 className="text-sm font-semibold text-gray-800">Why choose our cardiac tests</h4>
              <ul className="mt-3 text-sm text-gray-700 space-y-3">
                <li className="flex items-start gap-3"><FaClipboardList className="text-red-600 mt-1" /><span>Clinician-reviewed reports</span></li>
                <li className="flex items-start gap-3"><FaHeartbeat className="text-red-600 mt-1" /><span>AI-assisted analysis & personalized guidance</span></li>
                <li className="flex items-start gap-3"><FaVial className="text-red-600 mt-1" /><span>Accredited partner labs</span></li>
              </ul>

              <div className="mt-6">
                <Link to="/place-order?package=cardiac-full" className="block w-full text-center px-4 py-3 bg-red-600 text-white font-semibold">Book Now</Link>
                <Link to="/contact" className="block mt-3 text-center text-sm text-red-600 hover:underline">Request callback</Link>
                <Link to="/faq#cardiac" className="block mt-3 text-center text-sm text-gray-600 hover:underline">Cardiac FAQs</Link>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6">
            <h4 className="text-sm font-semibold text-gray-800">Quick resources</h4>
            <ul className="mt-3 text-sm text-gray-700 space-y-2">
              <li><Link to="/learn/heart-diet" className="text-red-600 hover:underline">Heart-healthy diet</Link></li>
              <li><Link to="/learn/exercise" className="text-red-600 hover:underline">Exercise for heart health</Link></li>
              <li><Link to="/learn/cholesterol" className="text-red-600 hover:underline">Understanding cholesterol</Link></li>
            </ul>
          </div>

          <div className="bg-white border border-gray-100 p-6 text-sm">
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
        <Link to="/place-order?package=cardiac-full" className="inline-flex items-center gap-3 px-6 py-3 bg-red-600 text-white font-semibold shadow-lg">
          Book Cardiac Package
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