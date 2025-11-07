import React, { useState, useMemo, useRef, useEffect } from "react";
import { FaSearch, FaChevronDown, FaQuestionCircle, FaExpandAlt, FaCompressAlt } from "react-icons/fa";



const RAW_FAQS = [
  {
    id: "q1",
    question: "How do I book a test?",
    answer:
      "You can book a test through our website: search for the test, select a slot or home collection, and complete checkout. Confirmations and prep instructions are emailed and shown in your dashboard.",
    category: "Booking",
  },
  {
    id: "q2",
    question: "How long does it take to get results?",
    answer:
      "Most standard tests deliver results in 24–48 hours from sample collection. Some specialized assays have different turnaround times — the ETA is shown on the test detail page.",
    category: "Timings",
  },
  {
    id: "q3",
    question: "Is home sample collection available?",
    answer:
      "Yes. Home sample collection is available in supported locations. Choose the 'Home Collection' option during booking and provide an address and preferred slot.",
    category: "Services",
  },
  {
    id: "q4",
    question: "Are the laboratories certified?",
    answer:
      "All partner laboratories listed on our platform are accredited and undergo quality checks. Each lab profile lists accreditations, certifications and user ratings.",
    category: "Labs",
  },
];

const CATEGORIES = ["All", "Booking", "Timings", "Services", "Labs"];

const escapeRegExp = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightMatch = (text = "", query = "") => {
  if (!query) return text;
  const q = query.trim();
  if (!q) return text;
  const re = new RegExp(`(${escapeRegExp(q)})`, "ig");
  const parts = String(text).split(re);
  return parts.map((part, i) =>
    re.test(part) ? (
      <mark key={i} className="bg-yellow-100 text-yellow-800 rounded px-0.5">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

export default function FAQ() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState(null); 
  const [expandedAll, setExpandedAll] = useState(false);
  const liveRef = useRef(null);

  const faqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RAW_FAQS.filter((f) => {
      if (category !== "All" && f.category !== category) return false;
      if (!q) return true;
      return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    });
  }, [query, category]);

  useEffect(() => {
    const label = query || category !== "All" ? `${faqs.length} result${faqs.length === 1 ? "" : "s"}` : `Showing all ${RAW_FAQS.length} FAQs`;
    if (liveRef.current) {
      liveRef.current.textContent = label;
      setTimeout(() => {
        if (liveRef.current) liveRef.current.textContent = "";
      }, 1200);
    }
  }, [query, category, faqs.length]);

  const toggle = (idx) => {
    if (expandedAll) setExpandedAll(false);
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  const handleExpandAll = () => {
    setExpandedAll((v) => {
      const next = !v;
      setOpenIndex(next ? -1 : null); // -1 will be interpreted as "all open"
      if (liveRef.current) {
        liveRef.current.textContent = next ? "All FAQs expanded" : "All FAQs collapsed";
        setTimeout(() => {
          if (liveRef.current) liveRef.current.textContent = "";
        }, 1200);
      }
      return next;
    });
  };

  return (
    <section aria-labelledby="faq-heading" className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <h2 id="faq-heading" className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Clear, concise answers to common questions. Use search and filters to find what you need quickly.
            </p>
          </div>

          <div className="flex gap-3 items-center w-full lg:w-auto">
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaSearch className="w-4 h-4" />
              </div>
              <input
                aria-label="Search FAQs"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search FAQs (e.g. booking, results, labs)"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <button
              type="button"
              onClick={handleExpandAll}
              aria-pressed={expandedAll}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:shadow transition"
            >
              {expandedAll ? <FaCompressAlt className="w-4 h-4" /> : <FaExpandAlt className="w-4 h-4" />}
              <span>{expandedAll ? "Collapse all" : "Expand all"}</span>
            </button>
          </div>
        </div>

        {}
        <nav aria-label="FAQ categories" className="mb-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = c === category;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
                    active ? "bg-gradient-to-r from-indigo-600 to-emerald-400 text-white shadow" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                  aria-pressed={active}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {}
          <aside className="hidden lg:flex items-start">
            <div className="sticky top-28 w-full max-w-xs p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-500 text-white mb-4 mx-auto">
                <FaQuestionCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center">Can't find what you're looking for?</h3>
              <p className="mt-2 text-xs text-gray-600 text-center">
                Reach out to our support team for help with bookings, results, and lab information.
              </p>
              <a
                href="http://localhost:5173/contact"
                onClick={(e) => e.preventDefault()}
                className="mt-4 block text-center px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
              >
                Contact Support
              </a>
            </div>
          </aside>

          {}
          <div className="space-y-4">
            {faqs.length === 0 && (
              <div className="rounded-xl p-6 bg-white border border-gray-100 shadow-sm text-center text-sm text-gray-600">
                No FAQs match your search or selected category.
              </div>
            )}

            {faqs.map((faq, idx) => {
              const isOpen = expandedAll || openIndex === idx;
              const accent =
                faq.category === "Booking"
                  ? "from-indigo-500 to-indigo-700"
                  : faq.category === "Timings"
                  ? "from-yellow-400 to-orange-500"
                  : faq.category === "Services"
                  ? "from-emerald-500 to-emerald-700"
                  : faq.category === "Labs"
                  ? "from-fuchsia-500 to-pink-600"
                  : "from-sky-500 to-blue-600";

              return (
                <article
                  key={faq.id}
                  className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow hover:shadow-lg transition"
                  aria-labelledby={`faq-q-${idx}`}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${accent}`} aria-hidden="true" />

                  <div className="p-5 sm:p-6 pl-7 flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 text-gray-700">
                        <FaQuestionCircle className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="w-full">
                          <button
                            id={`faq-q-${idx}`}
                            type="button"
                            onClick={() => toggle(idx)}
                            aria-expanded={isOpen}
                            aria-controls={`faq-a-${idx}`}
                            className="text-left w-full"
                          >
                            <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                              {highlightMatch(faq.question, query)}
                            </h4>
                            <p className="mt-1 text-xs text-gray-500">
                              <span className="inline-block mr-2 px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-700">
                                {faq.category}
                              </span>
                              {isOpen ? "Open" : "Tap to expand"}
                            </p>
                          </button>
                        </div>

                        <div className="flex-shrink-0 ml-2">
                          <button
                            type="button"
                            onClick={() => toggle(idx)}
                            aria-label={isOpen ? "Collapse" : "Expand"}
                            className="p-2 rounded-full hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 transition"
                          >
                            <FaChevronDown
                              className={`w-4 h-4 text-gray-500 transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>

                      <div
                        id={`faq-a-${idx}`}
                        role="region"
                        aria-labelledby={`faq-q-${idx}`}
                        className={`mt-4 text-sm text-gray-600 transition-all duration-300 ease-[cubic-bezier(.2,.8,.2,1)] overflow-hidden ${
                          isOpen ? "opacity-100 translate-y-0 max-h-96" : "opacity-0 -translate-y-2 max-h-0"
                        }`}
                        style={{ transitionProperty: "opacity, transform, max-height" }}
                      >
                        <div className="prose prose-sm max-w-none text-gray-600">
                          {highlightMatch(faq.answer, query)}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div aria-live="polite" className="sr-only" ref={liveRef} />
      </div>
    </section>
  );
}