import React, { useState, useMemo, useRef } from "react";
import { FaSearch, FaChevronDown, FaQuestionCircle, FaExpandAlt, FaCompressAlt } from "react-icons/fa";



const RAW_FAQS = [
  {
    id: "pricing-hidden",
    question: "Are there any additional charges when booking a lab test through LabCore?",
    answer:
      "No hidden charges — prices shown include standard fees. Any optional add-ons (like expedited processing or home sample pickup) are surfaced before checkout so you can decide.",
    category: "Pricing",
  },
  {
    id: "online-results",
    question: "Can I see my lab test results online in Pakistan?",
    answer:
      "Yes. Most partner labs publish results to your LabCore dashboard. You'll receive an email or SMS when the report is ready and you can view, download, or share it instantly.",
    category: "Reports",
  },
  {
    id: "how-to-view",
    question: "How to check online lab reports in Pakistan?",
    answer:
      "Sign into your LabCore account, open 'My Reports', and select the test you'd like. Each report includes structured observations, reference ranges, and downloadable PDFs.",
    category: "Reports",
  },
  {
    id: "covid-timing",
    question: "How long does lab testing take for COVID?",
    answer:
      "Turnaround is typically 24–48 hours depending on the lab and test type. Some labs offer express options; those show faster ETA and may carry extra fees.",
    category: "Timings",
  },
  {
    id: "best-labs",
    question: "Where to find the best lab in Pakistan?",
    answer:
      "Use our directory to filter by accreditation, ratings, proximity, and price. Each lab profile includes patient reviews and accreditation details to help you choose.",
    category: "Labs",
  },
  {
    id: "booking-online",
    question: "How to book a lab test online in Pakistan?",
    answer:
      "Search tests, select a sample collection option (on-site or home collection), pick a slot, and complete checkout. You'll receive confirmation with prep instructions.",
    category: "Booking",
  },
  {
    id: "benefits-online",
    question: "What are the benefits of booking an online lab test in Pakistan?",
    answer:
      "Online booking gives you convenience, faster comparisons, optional home collection, and secure, quick access to your digital reports.",
    category: "Booking",
  },
];

const CATEGORIES = ["All", "Booking", "Reports", "Labs", "Timings", "Pricing"];

const highlightMatch = (text = "", query = "") => {
  if (!query) return text;
  const q = query.trim();
  if (!q) return text;
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
  const parts = String(text).split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        className="bg-yellow-100 text-yellow-800 rounded px-0.5"
        aria-hidden="true"
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null); 
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [expandedAll, setExpandedAll] = useState(false);
  const liveRef = useRef(null);

  
  const faqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RAW_FAQS.filter((f) => {
      if (category !== "All" && f.category !== category) return false;
      if (!q) return true;
      return (
        f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  
  const updateLive = (text) => {
    if (liveRef.current) {
      liveRef.current.textContent = text;
      
      setTimeout(() => {
        if (liveRef.current) liveRef.current.textContent = "";
      }, 1200);
    }
  };

  const toggle = (idx) => {
    if (expandedAll) {
      // turning off expandAll when user toggles manually
      setExpandedAll(false);
    }
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  const handleExpandAll = () => {
    setExpandedAll((v) => {
      const newVal = !v;
      setOpenIndex(newVal ? -1 : null); // -1 means all expanded in render
      updateLive(newVal ? "All FAQs expanded" : "All FAQs collapsed");
      return newVal;
    });
  };

  
  const onChipKey = (e, c) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setCategory(c);
      updateLive(`${c} filter applied`);
    }
  };

  
  React.useEffect(() => {
    const label =
      query || category !== "All"
        ? `${faqs.length} result${faqs.length === 1 ? "" : "s"}`
        : `Showing all ${RAW_FAQS.length} FAQs`;
    updateLive(label);
  }, [query, category, faqs.length]);

  return (
    <section
      aria-labelledby="faq-heading"
      className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 id="faq-heading" className="text-3xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              Concise answers to help you move faster. Use search or filter by category to find exactly what you need.
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-80">
              <label htmlFor="faq-search" className="sr-only">Search FAQs</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaSearch className="w-4 h-4" />
              </div>
              <input
                id="faq-search"
                type="search"
                placeholder="Search FAQs (e.g. booking, reports)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                aria-label="Search frequently asked questions"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExpandAll}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:shadow transition"
                aria-pressed={expandedAll}
              >
                {expandedAll ? <FaCompressAlt className="w-4 h-4" /> : <FaExpandAlt className="w-4 h-4" />}
                <span>{expandedAll ? "Collapse all" : "Expand all"}</span>
              </button>
            </div>
          </div>
        </div>

        {}
        <nav aria-label="FAQ categories" className="mb-6">
          <div className="flex flex-wrap gap-2 items-center">
            {CATEGORIES.map((c) => {
              const active = c === category;
              return (
                <button
                  key={c}
                  onClick={() => { setCategory(c); updateLive(`${c} filter applied`); }}
                  onKeyDown={(e) => onChipKey(e, c)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
                    active
                      ? "bg-gradient-to-r from-indigo-600 to-emerald-400 text-white shadow"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                  aria-pressed={active}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </nav>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {}
          <aside className="hidden lg:flex flex-col justify-start items-center pr-6">
            <div className="w-full max-w-xs text-center sticky top-28">
              <div className="p-6 rounded-2xl bg-gradient-to-b from-white to-gray-50 border border-gray-100 shadow">
                <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-500 text-white mb-3">
                  <FaQuestionCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Need help deciding?</h3>
                <p className="mt-2 text-xs text-gray-600">
                  If you don't find an answer, reach out to our support team for personalized assistance.
                </p>
                <a
                  href="/help"
                  onClick={(e) => e.preventDefault()}
                  className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                >
                  Contact support
                </a>
              </div>
            </div>
          </aside>

          {}
          <div className="col-span-1 lg:col-span-1">
            <div className="grid grid-cols-1 gap-4">
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
                    : faq.category === "Reports"
                    ? "from-emerald-500 to-emerald-700"
                    : faq.category === "Labs"
                    ? "from-fuchsia-500 to-pink-600"
                    : faq.category === "Timings"
                    ? "from-yellow-400 to-orange-500"
                    : "from-sky-500 to-blue-600";

                return (
                  <article
                    key={faq.id}
                    className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow hover:shadow-lg transition"
                    aria-labelledby={`faq-q-${idx}`}
                  >
                    {}
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
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  toggle(idx);
                                }
                                
                              }}
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
                              aria-label={isOpen ? "Collapse" : "Expand"}
                              aria-expanded={isOpen}
                              onClick={() => toggle(idx)}
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
        </div>

        {}
        <div aria-live="polite" className="sr-only" ref={liveRef} />
      </div>
    </section>
  );
};

export default FAQ;