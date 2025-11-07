import React, { useState, useEffect, useRef } from "react";
import {
  FaHeartbeat,
  FaMicroscope,
  FaHandsHelping,
  FaCogs,
  FaArrowRight,
  FaCheckCircle,
  FaLayerGroup,
} from "react-icons/fa";


const BRAND = "#3498DB";
const BRAND_DARK = "#2c81c6";

const FEATURES = [
  {
    id: "patient",
    Icon: FaHeartbeat,
    title: "Patient‑Centric Care",
    summary:
      "Personalized care plans and a human-first approach — we meet patients where they are.",
    details:
      "We combine clinician expertise with clear, patient-facing guidance, helping people understand results and next steps. Our workflows prioritize comfort, privacy, and timely communication.",
    label: "Featured",
    tone: "primary",
  },
  {
    id: "diagnostics",
    Icon: FaMicroscope,
    title: "Advanced Diagnostics",
    summary:
      "State-of-the-art testing with AI-assisted triage for faster, more accurate insights.",
    details:
      "From molecular assays to standard blood panels, our partner labs follow rigorous QA with automated checks and clinician oversight — delivering precise, actionable results.",
    label: "Top",
    tone: "teal",
  },
  {
    id: "support",
    Icon: FaHandsHelping,
    title: "Trusted Support",
    summary:
      "Real people, expert help — scheduling, interpretation, and logistics handled for you.",
    details:
      "Our care coordinators help with sampling logistics, pre-test instructions, and result follow-ups so patients feel supported at every step.",
    label: "Reliable",
    tone: "violet",
  },
  {
    id: "platform",
    Icon: FaCogs,
    title: "Seamless Technology",
    summary:
      "Fast, secure, and thoughtfully designed — technology that just works for patients and clinicians.",
    details:
      "Our platform integrates booking, reporting, and analytics with strong privacy controls and intuitive UX so teams can operate efficiently while patients have a simple experience.",
    label: "New",
    tone: "indigo",
  },
];

export default function WhyUs() {
  const [openId, setOpenId] = useState(null);
  const panelRef = useRef(null);
  const prevActiveRef = useRef(null);

  useEffect(() => {
    
    const onKey = (e) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    
    if (openId) {
      prevActiveRef.current = document.activeElement;
      setTimeout(() => {
        panelRef.current?.focus();
      }, 80);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      try {
        prevActiveRef.current?.focus();
      } catch {}
    }
  }, [openId]);

  const toggle = (id) => {
    setOpenId((cur) => (cur === id ? null : id));
  };

  // small tone map for accents
  const toneMap = {
    primary: { bg: "linear-gradient(135deg, #3498DB22, #2c81c622)", color: "#3498DB" },
    teal: { bg: "linear-gradient(135deg, #14B8A622, #0EA5A622)", color: "#0EA5A6" },
    violet: { bg: "linear-gradient(135deg, #7C3AED22, #6D28D922)", color: "#7C3AED" },
    indigo: { bg: "linear-gradient(135deg, #6366F122, #4F46E522)", color: "#4F46E5" },
  };

  return (
    <section className="relative bg-white text-slate-900 overflow-hidden">
      {}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{ transform: "translateZ(0)" }}
      >
        <svg width="100%" height="100%" className="absolute left-0 top-0 opacity-10" preserveAspectRatio="none">
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#E8F4FF" />
              <stop offset="100%" stopColor="#F6FBFF" />
            </linearGradient>
            <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="60" result="b" />
              <feBlend in="SourceGraphic" in2="b" />
            </filter>
          </defs>
          <rect x="0" y="0" width="100%" height="60%" fill="url(#g1)" filter="url(#f1)" />
        </svg>

        {}
        <div className="absolute -left-8 top-20 opacity-8 transform rotate-12">
          <svg width="96" height="96" viewBox="0 0 24 24" fill="#3498DB" className="opacity-6">
            <path d="M12 2L15 8H9L12 2Z" />
          </svg>
        </div>
        <div className="absolute right-6 bottom-10 opacity-8">
          <svg width="128" height="128" viewBox="0 0 24 24" fill="#7C3AED" className="opacity-6">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-20">
        {}
        <div className="text-center max-w-3xl mx-auto mb-7">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#E8F4FF", color: BRAND }}>
            <FaLayerGroup className="w-4 h-4" /> Why Choose Us
          </span>

          <h2 className="mt-6 text-3xl sm:text-4xl md:text-4.3xl font-extrabold tracking-tight">
            Why Choose{" "}
            <span style={{ color: BRAND }}>
              Pragma Health
              <svg className="ml-2 inline-block -mt-2" width="120" height="14" viewBox="0 0 120 14" fill="none" aria-hidden>
                <path d="M4 7C36 7 84 7 116 7" stroke="#E9F4FF" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Modern diagnostics, human support, and secure technology — designed to make care simpler and smarter.
          </p>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {FEATURES.map((f) => {
            const tone = toneMap[f.tone] || toneMap.primary;
            return (
              <article
                key={f.id}
                className="relative group flex flex-col bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-transform duration-300 focus-within:shadow-lg"
                aria-labelledby={`feature-${f.id}-title`}
                tabIndex={0}
              >
                {}
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{
                      background: tone.bg,
                      boxShadow: "inset 0 -8px 20px rgba(0,0,0,0.04)",
                    }}
                    aria-hidden
                  >
                    <f.Icon className="w-7 h-7" style={{ color: tone.color }} />
                  </div>

                  <div className="min-w-0">
                    <h3 id={`feature-${f.id}-title`} className="text-lg font-semibold text-slate-900">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">{f.summary}</p>

                    <div className="mt-4 flex items-center gap-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-slate-700" style={{ background: "#F8FAFF" }}>
                        {f.label}
                      </span>

                      <button
                        onClick={() => setOpenId(f.id)}
                        className="inline-flex items-center text-sm font-medium text-slate-700 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        aria-expanded={openId === f.id}
                        aria-controls={`panel-${f.id}`}
                      >
                        Learn more <FaArrowRight className="ml-2 w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {}
                <span
                  aria-hidden
                  className="absolute right-5 top-5 w-2.5 h-2.5 rounded-full"
                  style={{ background: tone.color }}
                />

                {}
                <div
                  id={`panel-${f.id}`}
                  className={`mt-6 overflow-hidden transition-all duration-400 ${openId === f.id ? "max-h-64" : "max-h-0"}`}
                  aria-hidden={openId !== f.id}
                >
                  <div className="mt-3 text-sm text-slate-700">
                    {f.details}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <a
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-white text-sm font-medium"
                      style={{
                        background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DARK})`,
                        boxShadow: "0 8px 24px rgba(52,152,219,0.12)",
                      }}
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      Try it now
                      <FaCheckCircle />
                    </a>

                    <a
                      className="text-sm text-slate-600 underline"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      See integrations
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {}
        <div className="mt-12 text-center">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-3 px-6 py-3 full font-semibold text-white"
            style={{
              background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DARK})`,
              boxShadow: "0 10px 30px rgba(52,152,219,0.14)",
            }}
            aria-label="Get started with Pragma Health"
          >
            Get Started
            <FaArrowRight />
          </a>
        </div>
      </div>

      {}
      <style>{`
        /* smoother transition for max-height expansion */
        .transition-all.duration-400 { transition: max-height 380ms ease, opacity 280ms ease; }
        @media (prefers-reduced-motion: reduce) {
          .transition-all.duration-400 { transition: none; }
        }
      `}</style>
    </section>
  );
}