import React, { useMemo } from "react";
import {
  FaArrowLeft,
  FaChild,
  FaClipboardList,
  FaUserMd,
  FaHeartbeat,
  FaFlask,
  FaPhoneAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const AGE_SECTIONS = [
  {
    title: "Infants (0–1 yr)",
    items: ["Newborn screening", "Bilirubin levels", "Vitamin D"],
  },
  {
    title: "Toddlers (1–5 yrs)",
    items: ["Lead screening", "Hemoglobin check", "Developmental screening"],
  },
  {
    title: "School Age (6–18 yrs)",
    items: ["Annual wellness check", "Sports physicals", "Mental health screening"],
  },
];

const PREP_TIPS = [
  "Explain steps in simple, positive words",
  "Bring comfort items (toy, blanket)",
  "Schedule morning appointments when kids are rested",
  "Offer praise and small rewards after visit",
];

const PACKAGES = [
  { id: "infant", title: "Infant Screening", price: "$16.89", highlights: ["Newborn screen", "Vitamin D", "Bilirubin"] },
  { id: "toddler", title: "Toddler Package", price: "$29.99", highlights: ["Lead screen", "Hemoglobin", "Developmental check"] },
  { id: "teen", title: "Teen Health Check", price: "$39.99", highlights: ["Wellness check", "Mental health screen", "Sports physical"] },
];

const Stat = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-xl font-extrabold text-black">{value}</span>
  </div>
);

const Collapsible = ({ title, children, id }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-t border-gray-100">
      <button
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3 px-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <span className="text-gray-500">{open ? "Collapse" : "Expand"}</span>
      </button>
      <div id={id} role="region" aria-hidden={!open} className={`${open ? "max-h-[2000px]" : "max-h-0 overflow-hidden"} transition-[max-height] duration-300 px-4 pb-4`}>
        {children}
      </div>
    </div>
  );
};

export default function ChildHealthPage() {
  const ageSections = useMemo(() => AGE_SECTIONS, []);
  const prepTips = useMemo(() => PREP_TIPS, []);
  const packages = useMemo(() => PACKAGES, []);

  return (
    <main className="w-full bg-white text-black antialiased">
      {}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
        <Link to="/tests-by-concern" className="inline-flex items-center gap-3 text-sm text-gray-700 hover:text-indigo-600">
          <FaArrowLeft /> Back to Health Concerns
        </Link>

        <div className="hidden sm:flex items-center gap-4 text-sm text-gray-600">
          <FaPhoneAlt /> <a href="tel:+12034101665" className="hover:text-indigo-600">+1 203-410-1665</a>
        </div>
      </div>

      {}
      <header className="bg-gradient-to-r from-green-600 to-emerald-500 text-white">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">Pediatric Health Checks</h1>
            <p className="mt-4 text-lg max-w-2xl">
              Monitoring growth and development from infancy through adolescence — evidence-based testing and child-friendly care.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {}
              <Link to="/place-order?package=child-full" className="inline-flex items-center gap-3 px-5 py-3 bg-white text-green-700 font-semibold shadow-sm hover:shadow-md transition">
                Book Child Tests
              </Link>
              <a href="/partners?tag=pediatric" className="inline-flex items-center gap-3 px-5 py-3 border border-white/20 bg-white/10 text-white hover:bg-white/20 transition">
                View Pediatric Labs
              </a>
            </div>
          </div>

          {}
          <aside className="lg:col-span-5">
            <div className="bg-white text-black p-6 border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm text-gray-500">Child Wellness</h3>
                  <p className="text-xl font-semibold">Age-specific bundles & pediatric consults</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">From</div>
                  <div className="text-2xl font-extrabold">$16.89</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <Stat label="Infant tests" value="3+" />
                <Stat label="Packages" value={packages.length} />
                <Stat label="Clinician reviews" value="24/7" />
              </div>

              <div className="mt-5">
                {}
                <Link to="/place-order?package=child-full" className="w-full inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold">
                  Book Full Package
                </Link>
                <a href="/contact" className="block mt-3 text-center text-sm text-green-600 hover:underline">Request callback</a>
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
              <div className="text-2xl text-green-600"><FaChild /></div>
              <div>
                <h2 className="text-xl font-semibold text-black">Age-Appropriate Testing</h2>
                <p className="mt-2 text-gray-700">Tests and screenings tailored by age group to catch issues early and keep children healthy.</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {ageSections.map((s, idx) => (
                <div key={idx} className="p-4 border border-gray-100 bg-gray-50">
                  <h4 className="font-semibold text-green-700 mb-2">{s.title}</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {s.items.map((it, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="text-2xl text-yellow-600"><FaUserMd /></div>
              <div>
                <h3 className="text-xl font-semibold text-black">For Parents: Preparing Your Child</h3>
                <p className="mt-2 text-gray-700">Practical tips to make the visit smooth and reassuring for both child and parent.</p>
              </div>
            </div>

            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              {prepTips.map((tip, i) => (
                <div key={i} className="p-3 border border-gray-100 bg-gray-50 flex items-start gap-3">
                  <div className="w-9 h-9 flex items-center justify-center bg-yellow-100 text-yellow-700">✔</div>
                  <div className="text-sm text-gray-700">{tip}</div>
                </div>
              ))}
            </div>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-black">Child Wellness Packages</h3>
              <div className="text-sm text-gray-600">Choose a bundle</div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.map((p) => (
                <div key={p.id} className="border border-gray-100 p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-black">{p.title}</h4>
                    <p className="mt-2 text-sm text-gray-600">{p.highlights.join(" · ")}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-700 font-semibold">{p.price}</div>
                    <div className="flex gap-2">
                      {}
                      <Link to={`/place-order?package=${p.id}`} className="px-3 py-2 bg-green-600 text-white text-sm">
                        Book
                      </Link>
                      <Link to={`/packages/${p.id}`} className="px-3 py-2 border border-gray-200 text-sm">
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          {}
          <article className="bg-white border border-gray-100 p-6 overflow-x-auto">
            <h3 className="text-lg font-semibold text-black mb-4">Recommended Screening Frequency</h3>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left">Screen</th>
                  <th className="px-4 py-2 text-left">Infant</th>
                  <th className="px-4 py-2 text-left">Child</th>
                  <th className="px-4 py-2 text-left">Adolescent</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3">Newborn screen</td>
                  <td className="px-4 py-3">At birth</td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3">—</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3">Hemoglobin</td>
                  <td className="px-4 py-3">6–12 months</td>
                  <td className="px-4 py-3">Annually</td>
                  <td className="px-4 py-3">Annually</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3">Lead</td>
                  <td className="px-4 py-3">At-risk screening</td>
                  <td className="px-4 py-3">As recommended</td>
                  <td className="px-4 py-3">As recommended</td>
                </tr>
              </tbody>
            </table>
          </article>
        </section>

        {}
        <aside className="space-y-6">
          <div className="sticky top-6">
            <div className="bg-white border border-gray-100 p-6">
              <h4 className="text-sm font-semibold text-gray-800">Why choose our pediatric tests</h4>
              <ul className="mt-3 text-sm text-gray-700 space-y-3">
                <li className="flex items-start gap-3"><FaClipboardList className="text-green-600 mt-1" /><span>Child-friendly collection centers</span></li>
                <li className="flex items-start gap-3"><FaHeartbeat className="text-green-600 mt-1" /><span>Clinician-reviewed reports</span></li>
                <li className="flex items-start gap-3"><FaFlask className="text-green-600 mt-1" /><span>Accredited partner labs</span></li>
              </ul>

              <div className="mt-6">
                {}
                <Link to="/place-order?package=child-full" className="block w-full text-center px-4 py-3 bg-green-600 text-white font-semibold">Book Now</Link>
                <a href="/contact" className="block mt-3 text-center text-sm text-green-600 hover:underline">Request a callback</a>
                <a href="/faq#pediatric" className="block mt-3 text-center text-sm text-gray-600 hover:underline">Pediatric FAQs</a>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6">
            <h4 className="text-sm font-semibold text-gray-800">Quick resources</h4>
            <ul className="mt-3 text-sm text-gray-700 space-y-2">
              <li><Link to="/learn/feeding" className="text-green-600 hover:underline">Feeding & nutrition</Link></li>
              <li><Link to="/learn/development" className="text-green-600 hover:underline">Developmental milestones</Link></li>
              <li><Link to="/learn/vaccination" className="text-green-600 hover:underline">Vaccination schedule</Link></li>
            </ul>
          </div>

          <div className="bg-white border border-gray-100 p-4 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Clinic hours</div>
                <div className="font-medium text-gray-900">Mon–Fri • 9:00 AM – 6:00 PM</div>
              </div>
              <Link to="/place-order" className="text-green-600 hover:underline">Book visit</Link>
            </div>
          </div>
        </aside>
      </div>

      {}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 md:hidden z-50">
        <Link to="/place-order?package=child-full" className="inline-flex items-center gap-3 px-6 py-3 bg-green-600 text-white font-semibold shadow-lg">
          Book Child Tests
        </Link>
      </div>

      <style>{`
        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; animation: none !important; }
        }

        /* Slight lift on hover for interactive cards */
        .hover\\:lift:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(16,24,40,0.06); }
      `}</style>
    </main>
  );
}