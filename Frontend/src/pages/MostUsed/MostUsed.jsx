import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFlask,
  FaSyringe,
  FaHeartbeat,
  FaVial,
  FaExternalLinkAlt,
  FaArrowLeft,
  FaHeadset,
} from "react-icons/fa";



const PRIMARY = "#3498DB";
const PRIMARY_DARK = "#2c81c6";

const popularTests = [
  {
    id: "cbc",
    name: "Complete Blood Count",
    description:
      "Comprehensive blood analysis to check overall health and detect disorders such as anemia and infection.",
    route: "/most-used/cbc",
    Icon: FaFlask,
    benefits: [
      "Detects anemia & infections",
      "Monitors blood health",
      "Screens blood disorders",
    ],
    prep: "8–12 hours fasting (when required)",
    result: "24–48 hours",
  },
  {
    id: "diabetes",
    name: "Diabetes Screening",
    description:
      "Fasting and postprandial glucose tests to assess blood sugar control and diabetes risk.",
    route: "/most-used/diabetes-screening",
    Icon: FaSyringe,
    benefits: [
      "Early detection of diabetes",
      "Monitors therapy effectiveness",
      "Assesses long-term control",
    ],
    prep: "8 hours fasting",
    result: "Same day",
  },
  {
    id: "thyroid",
    name: "Thyroid Profile",
    description:
      "TSH, T3 and T4 measurements to evaluate thyroid function and hormonal balance.",
    route: "/most-used/thyroid-profile",
    Icon: FaHeartbeat,
    benefits: [
      "Diagnoses hypo/hyperthyroidism",
      "Monitors medication response",
      "Detects hormonal imbalance",
    ],
    prep: "No fasting required",
    result: "24–48 hours",
  },
  {
    id: "lipid",
    name: "Lipid Profile",
    description:
      "Cholesterol panel including HDL, LDL and triglycerides to evaluate cardiovascular risk.",
    route: "/most-used/lipid-profile",
    Icon: FaVial,
    benefits: [
      "Assesses heart disease risk",
      "Monitors cholesterol levels",
      "Evaluates dietary or medication effects",
    ],
    prep: "9–12 hours fasting",
    result: "Same day",
  },
];

const healthTips = [
  {
    title: "Fasting Requirements",
    content:
      "Many blood tests require 8–12 hours of fasting. Drink water but avoid food, coffee, or tea for accurate results.",
  },
  {
    title: "Medication Disclosure",
    content:
      "Tell your clinician about prescription and over-the-counter medications; some may affect test outcomes.",
  },
  {
    title: "Best Time for Tests",
    content:
      "Morning samples are preferred for many tests since hormone and metabolite levels are more stable then.",
  },
  {
    title: "Hydration Matters",
    content:
      "Being well-hydrated makes blood draws easier, reduces the chance of a failed draw, and improves sample quality.",
  },
];



function TestCard({ test }) {
  const { name, description, Icon, benefits, prep, result, route } = test;

  return (
    <article
      className="group flex flex-col h-full rounded-2xl bg-white border transition-shadow duration-300 focus-within:shadow-lg hover:shadow-lg"
      aria-labelledby={`test-${test.id}-title`}
      tabIndex={0}
      style={{
        borderColor: "rgba(16,24,40,0.06)",
      }}
    >
      {}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${PRIMARY}, ${PRIMARY_DARK})`,
        }}
        aria-hidden
      />

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: `radial-gradient(circle at 30% 25%, ${PRIMARY}22, transparent 40%)`,
              boxShadow: "inset 0 -8px 20px rgba(16,24,40,0.04)",
            }}
            aria-hidden
          >
            <Icon className="text-xl" style={{ color: PRIMARY }} />
          </div>

          <div className="min-w-0">
            <h3
              id={`test-${test.id}-title`}
              className="text-lg font-semibold text-slate-900 truncate"
            >
              {name}
            </h3>
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">{description}</p>
          </div>
        </div>

        <ul className="mt-5 mb-4 space-y-2">
          {benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-xs text-slate-700">
              <span
                className="mt-1.5 inline-block w-2 h-2 rounded-full"
                style={{ background: PRIMARY }}
                aria-hidden
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <div>
              <div className="text-[13px] font-medium text-slate-700">Prep</div>
              <div>{prep}</div>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-medium text-slate-700">Results</div>
              <div>{result}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to={route}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
              style={{
                background: `linear-gradient(90deg, ${PRIMARY}, ${PRIMARY_DARK})`,
                boxShadow: "0 10px 24px rgba(52,152,219,0.10)",
              }}
              aria-label={`View details for ${name}`}
            >
              View Details
              <FaExternalLinkAlt className="text-[12px]" />
            </Link>

            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm text-slate-700 hover:bg-slate-50"
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function TipAccordion({ tip, index, openIndex, setOpenIndex }) {
  const open = openIndex === index;
  return (
    <div
      className={`rounded-xl overflow-hidden transition-shadow duration-200 ${
        open ? "shadow-lg bg-white" : "bg-white"
      }`}
    >
      <header>
        <button
          onClick={() => setOpenIndex(open ? -1 : index)}
          aria-expanded={open}
          aria-controls={`tip-panel-${index}`}
          id={`tip-btn-${index}`}
          className="w-full flex items-start gap-4 p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3498DB]"
        >
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center font-semibold text-sm shrink-0"
            style={{
              background: open ? PRIMARY : `${PRIMARY}14`,
              color: open ? "#fff" : PRIMARY,
            }}
          >
            {index + 1}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-900">{tip.title}</h4>
              <span className="text-sm text-slate-500">{open ? "Hide" : "Read"}</span>
            </div>
            {open && (
              <div
                id={`tip-panel-${index}`}
                role="region"
                aria-labelledby={`tip-btn-${index}`}
                className="mt-3 text-sm text-slate-700"
              >
                {tip.content}
              </div>
            )}
          </div>
        </button>
      </header>
    </div>
  );
}



export default function MostUsed() {
  const [openTip, setOpenTip] = useState(-1);

  return (
    <section className="bg-white text-slate-900">
      <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-8">
        {}
        <div className="flex items-center justify-between mb-8 gap-6">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border shadow-sm hover:shadow-md text-sm"
              aria-label="Back to home"
              style={{ borderColor: "rgba(16,24,40,0.06)" }}
            >
              <FaArrowLeft style={{ color: PRIMARY }} />
              Back
            </Link>

            <nav aria-label="breadcrumb" className="text-sm text-slate-500">
              <ol className="flex items-center gap-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li className="font-medium">Most Used</li>
              </ol>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/all-tests"
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{
                background: `linear-gradient(90deg, ${PRIMARY}, ${PRIMARY_DARK})`,
                color: "#fff",
                boxShadow: "0 8px 24px rgba(52,152,219,0.12)",
              }}
            >
              Browse All Tests
            </Link>

            <Link
              to="/contact"
              className="px-3 py-2 rounded-lg border text-sm"
              style={{ borderColor: "rgba(16,24,40,0.06)", color: PRIMARY }}
            >
              Contact
            </Link>
          </div>
        </div>

        {}
        <header className="text-center max-w-3xl mx-auto mb-12">
          <span
            className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4"
            style={{
              color: PRIMARY,
              background: `${PRIMARY}10`,
              border: `1px solid rgba(52,152,219,0.12)`,
            }}
          >
            Popular Diagnostics
          </span>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Most Commonly Booked <span style={{ color: PRIMARY }}>Health Tests</span>
          </h1>

          <p className="text-slate-600">
            Essential screenings recommended by clinicians for better long-term health.
          </p>

          <div className="mt-6 flex justify-center">
            <svg width="160" height="8" viewBox="0 0 160 8" fill="none" aria-hidden>
              <path d="M2 4C48 4 112 4 158 4" stroke={PRIMARY} strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
        </header>

        {}
        <section className="mb-16" aria-labelledby="popular-tests">
          <h2 id="popular-tests" className="sr-only">
            Popular tests
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularTests.map((t) => (
              <TestCard key={t.id} test={t} />
            ))}
          </div>
        </section>

        {}
        <section className="mb-16">
          <div className="rounded-2xl p-8 bg-white border shadow-sm" style={{ borderColor: "rgba(16,24,40,0.04)" }}>
            <div className="md:flex md:items-center md:justify-between gap-8">
              <div className="md:flex-1">
                <h3 className="text-2xl font-bold mb-3">Why Regular Health Testing Matters</h3>
                <p className="text-slate-700 mb-6">
                  Preventive screenings detect issues early, allowing for timely treatment and peace of mind.
                </p>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white border shadow-sm">
                    <div className="w-10 h-10 rounded-md mb-3 flex items-center justify-center" style={{ background: `${PRIMARY}10`, color: PRIMARY }}>
                      <FaHeartbeat />
                    </div>
                    <h4 className="font-semibold mb-1">Early Detection</h4>
                    <p className="text-sm text-slate-600">Identify treatable issues sooner when interventions are most effective.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border shadow-sm">
                    <div className="w-10 h-10 rounded-md mb-3 flex items-center justify-center" style={{ background: "#E74C3C10", color: "#E74C3C" }}>
                      <FaFlask />
                    </div>
                    <h4 className="font-semibold mb-1">Preventive Care</h4>
                    <p className="text-sm text-slate-600">Reduce the risk of complications through regular monitoring.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border shadow-sm">
                    <div className="w-10 h-10 rounded-md mb-3 flex items-center justify-center" style={{ background: "#16A08510", color: "#16A085" }}>
                      <FaVial />
                    </div>
                    <h4 className="font-semibold mb-1">Peace of Mind</h4>
                    <p className="text-sm text-slate-600">Know your health status and act with confidence.</p>
                  </div>
                </div>
              </div>

              <aside className="mt-6 md:mt-0 md:w-80">
                <div className="rounded-lg p-4 border bg-white shadow-sm">
                  <h4 className="font-semibold mb-2">Need guidance?</h4>
                  <p className="text-sm text-slate-700 mb-4">Our specialists recommend tests tailored to you.</p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded bg-white border text-sm"
                    style={{ borderColor: `${PRIMARY}22`, color: PRIMARY }}
                  >
                    Contact Experts <FaHeadset />
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-4">Test Preparation Guidelines</h3>
          <p className="text-center text-slate-600 mb-6 max-w-3xl mx-auto">
            Follow these tips to ensure accurate results and a comfortable experience.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {healthTips.map((tip, i) => (
              <TipAccordion key={i} tip={tip} index={i} openIndex={openTip} setOpenIndex={setOpenTip} />
            ))}
          </div>
        </section>

        {}
        <section className="rounded-2xl p-8 border shadow-sm text-center bg-white">
          <h3 className="text-2xl font-bold mb-3">Ready to take control of your health?</h3>
          <p className="text-slate-700 mb-6 max-w-2xl mx-auto">Book your tests today and get insights to stay well.</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/all-tests"
              className="px-6 py-3 rounded-lg text-white font-semibold shadow"
              style={{
                background: `linear-gradient(90deg, ${PRIMARY}, ${PRIMARY_DARK})`,
              }}
            >
              Browse All Tests
            </Link>

            <Link
              to="/contact"
              className="px-6 py-3 rounded-lg bg-white border text-sm"
              style={{ borderColor: `${PRIMARY}22`, color: PRIMARY }}
            >
              Contact Our Experts
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}