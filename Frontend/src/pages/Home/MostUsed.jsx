import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import {
  FaFlask,
  FaSyringe,
  FaHeartbeat,
  FaVial,
  FaExternalLinkAlt,
  FaStar
} from "react-icons/fa";
import { Link } from "react-router-dom";



const PRIMARY = "#3498DB";
const PRIMARY_DARK = "#2c81c6";

const popularTests = [
  {
    id: "cbc",
    name: "Complete Blood Count",
    description:
      "Comprehensive blood analysis — screens anemia, infection and overall health markers.",
    route: "/most-used/cbc",
    Icon: FaFlask,
    prep: "8–12 hr fasting",
    result: "24–48 hrs",
    popularity: 4.7,
  },
  {
    id: "diabetes",
    name: "Diabetes Screening",
    description:
      "Fasting and postprandial glucose tests to evaluate glycemic control and diabetes risk.",
    route: "/most-used/diabetes-screening",
    Icon: FaSyringe,
    prep: "8 hr fasting",
    result: "Same day",
    popularity: 4.6,
  },
  {
    id: "thyroid",
    name: "Thyroid Profile",
    description:
      "TSH, T3 & T4 panel to assess thyroid function and hormonal balance.",
    route: "/most-used/thyroid-profile",
    Icon: FaHeartbeat,
    prep: "No fasting",
    result: "24–48 hrs",
    popularity: 4.5,
  },
  {
    id: "lipid",
    name: "Lipid Profile",
    description:
      "HDL/LDL/triglycerides panel for cardiovascular risk assessment and monitoring.",
    route: "/most-used/lipid-profile",
    Icon: FaVial,
    prep: "9–12 hr fasting",
    result: "Same day",
    popularity: 4.6,
  },
];


function Rating({ value }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push(<FaStar key={i} className="text-[#FFB400] w-3 h-3" />);
    else if (i === full && half) stars.push(<FaStar key={i} className="text-[#FFB400] w-3 h-3 opacity-60" />);
    else stars.push(<FaStar key={i} className="text-gray-200 w-3 h-3" />);
  }
  return <div className="flex items-center gap-1" aria-hidden>{stars}</div>;
}


function TestCard({ t }) {
  const { Icon } = t;
  return (
    <article
      className="group relative flex flex-col h-full rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 focus-within:shadow-xl focus:outline-none"
      tabIndex={0}
      aria-labelledby={`test-${t.id}-title`}
    >
      {}
      <div
        aria-hidden
        className="absolute -left-10 -top-8 w-40 h-40 transform rotate-[25deg] opacity-5 pointer-events-none"
        style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${PRIMARY_DARK})` }}
      />

      {}
      <div style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${PRIMARY_DARK})` }} className="h-1 w-full" />

      <div className="p-6 flex flex-col gap-4 flex-1">
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${PRIMARY}22, transparent 40%)`,
              boxShadow: "inset 0 -8px 20px rgba(0,0,0,0.04)",
            }}
            aria-hidden
          >
            <Icon className="text-[22px]" style={{ color: PRIMARY }} />
          </div>

          <div className="min-w-0">
            <h3 id={`test-${t.id}-title`} className="text-lg font-semibold text-slate-900 truncate">
              {t.name}
            </h3>
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">{t.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mt-2">
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-500">
              <div className="font-medium text-slate-700">Prep</div>
              <div>{t.prep}</div>
            </div>

            <div className="text-xs text-slate-500">
              <div className="font-medium text-slate-700">Result</div>
              <div>{t.result}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700 mr-1">{t.popularity.toFixed(1)}</span>
            <Rating value={t.popularity} />
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex gap-3">
            <Link to={t.route} className="flex-1">
              <button
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-white"
                style={{
                  background: `linear-gradient(90deg, ${PRIMARY}, ${PRIMARY_DARK})`,
                  boxShadow: "0 10px 24px rgba(52,152,219,0.12)",
                }}
                aria-label={`View details for ${t.name}`}
              >
                View Test
                <AiOutlineArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <button
              aria-label={`Book ${t.name}`}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Book
            </button>
          </div>
        </div>
      </div>

      {}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02) 40%, rgba(255,255,255,0))",
          mixBlendMode: "overlay",
        }}
      />
    </article>
  );
}

export default function MostUsedTest() {
  return (
    <section className="bg-white text-slate-900">
      <div className="max-w-[1200px] mx-auto px-6 py-20 lg:py-28">
        {}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-3 mb-4 justify-center">
            <span
              className="text-xs font-semibold rounded-full px-3 py-1"
              style={{ color: PRIMARY, background: `${PRIMARY}10`, border: `1px solid rgba(52,152,219,0.08)` }}
            >
              Popular Diagnostics
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            Frequently Booked <span style={{ color: PRIMARY }}>Tests</span>
          </h2>

          <p className="text-slate-600 max-w-2xl mx-auto">
            Essential health screenings recommended by medical professionals — clear prep, fast results, trusted labs.
          </p>

          <div className="mt-6 flex justify-center">
            <svg width="160" height="8" viewBox="0 0 160 8" fill="none" aria-hidden>
              <path d="M2 4C48 4 112 4 158 4" stroke={PRIMARY} strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularTests.map((test) => (
            <TestCard key={test.id} t={test} />
          ))}
        </div>

        {}
        <div className="mt-12 text-center">
          <Link to="/all-tests-packages" className="inline-flex items-center gap-4">
            <button
              className="inline-flex items-center gap-3 px-6 py-3 full text-white font-semibold shadow-lg transform transition hover:scale-[1.03]"
              style={{
                background: `linear-gradient(90deg, ${PRIMARY}, ${PRIMARY_DARK})`,
              }}
              aria-label="Browse all tests and packages"
            >
              Browse All Tests
              <AiOutlineArrowRight />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}