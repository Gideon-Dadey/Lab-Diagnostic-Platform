import React from "react";
import { FaArrowLeft, FaFlask, FaUserMd, FaCalendarAlt, FaVial, FaDownload, FaPrint } from "react-icons/fa";
import { Link } from "react-router-dom";



const Stat = ({ label, value, hint }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-2 text-xl font-semibold text-gray-900">{value}</p>
      </div>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  </div>
);

const RiskMeter = ({ percent = 18 }) => {
  const clamp = Math.max(0, Math.min(100, percent));
  const hue = 120 - Math.round((clamp / 100) * 120);
  return (
    <div aria-hidden className="w-full">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-700">Estimated hematology concern</p>
        <p className="text-sm font-semibold text-gray-900">{clamp}%</p>
      </div>
      <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full transition-all duration-700"
          style={{
            width: `${clamp}%`,
            background: `linear-gradient(90deg, hsl(${hue} 70% 45%), hsl(${Math.max(0, hue - 20)} 70% 40%))`,
          }}
        />
      </div>
      <div className="mt-3 text-xs text-gray-500 flex gap-3">
        <span className="inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" />Low</span>
        <span className="inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400" />Moderate</span>
        <span className="inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500" />High</span>
      </div>
    </div>
  );
};

export default function CompleteBloodCount() {
  const testDetails = {
    whatIs:
      "A Complete Blood Count (CBC) evaluates blood cells to detect anemia, infection, inflammation, clotting problems and other hematologic conditions.",
    results: [
      "Red Blood Cells (RBC): Carry oxygen (normal: 4.5–5.9M cells/µL men, 4.1–5.1M women)",
      "White Blood Cells (WBC): Immune cells (normal: 4.5–11K cells/µL)",
      "Hemoglobin (Hb): Oxygen carrier (men: 13.5–17.5 g/dL, women: 12.0–15.5 g/dL)",
      "Hematocrit (Hct): % of red cells (men: 41–53%, women: 36–46%)",
      "Platelets: Clotting cells (150–450K/µL)"
    ],
    whenToTest: [
      "Routine checkups",
      "Unexplained fatigue or breathlessness",
      "Fever, persistent infection",
      "Easy bruising or bleeding",
      "Pre-operative workup",
      "Monitoring therapy"
    ],
    preparation: [
      "Usually no fasting needed (follow your clinician if combined tests ordered)",
      "Keep hydrated and wear loose sleeves",
      "Bring a list of medications and supplements"
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {}
      <div className="sticky top-5 z-40 px-4">
        <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm py-3 px-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/tests" className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition" aria-label="Back to tests">
              <FaArrowLeft />
              Back
            </Link>

            <div className="hidden sm:flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold shadow-sm">
                <FaVial /> CBC
              </div>
              <div className="text-sm text-gray-500">Comprehensive blood panel</div>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">Complete Blood Count</h1>
            <p className="text-xs text-gray-500">RBC · WBC · Hemoglobin · Platelets</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition" aria-label="Book this test">
              Book This Test
            </button>

            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gray-100 bg-white text-gray-700 hover:shadow transition" aria-label="Download report">
              <FaDownload />
              Download
            </button>

            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gray-100 bg-white text-gray-700 hover:shadow transition" aria-label="Print" onClick={() => window.print()}>
              <FaPrint />
              Print
            </button>
          </div>
        </div>
      </div>

      {}
      <section className="mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="lg:col-span-2 bg-white p-8 sm:p-12 flex flex-col justify-between border border-gray-100 shadow-sm">
              <div>
                <div className="inline-flex items-center gap-3 rounded-full bg-indigo-50 px-3 py-1 border border-indigo-100 mb-4 w-max">
                  <FaUserMd className="text-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">Clinician-reviewed</span>
                </div>

                <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Complete Blood Count (CBC)</h2>
                <p className="text-lg text-gray-700 mb-6">{testDetails.whatIs}</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {testDetails.results.map((r, i) => {
                    const [title, rest] = r.split(":");
                    return (
                      <div key={i} className="rounded-xl bg-gray-50 border border-gray-100 p-4 shadow-sm">
                        <p className="text-sm font-semibold text-gray-900">{title}</p>
                        <p className="mt-1 text-sm text-gray-600">{rest?.trim()}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 items-stretch">
                <button className="flex-1 rounded-xl px-5 py-3 bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition">
                  Book Now — $10.99
                </button>

                <Link to="/packages" className="flex-1 rounded-xl px-5 py-3 border border-gray-100 bg-white text-gray-800 text-center shadow-sm hover:shadow transition flex items-center justify-center gap-2">
                  View Packages
                  <FaCalendarAlt className="opacity-70" />
                </Link>
              </div>
            </div>

            <aside className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Quick Snapshot</h3>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Stat label="Results Time" value="24–48 hrs" />
                  <Stat label="Sample" value="Blood (Venous)" />
                </div>
              </div>

              <div>
                <RiskMeter percent={18} />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preparation</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  {testDetails.preparation.map((p, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 inline-block w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2 space-y-8">
          <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-3"><FaFlask className="text-indigo-600" /> Interpretation & Clinical Context</h3>
            <p className="text-gray-700 mb-4">
              CBC interpretation requires clinical context — age, sex, medications, recent illness and other labs. Use values to screen for anemia, infection, inflammation and clotting disorders.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-lg p-4 bg-gradient-to-b from-white to-gray-50 border border-gray-100">
                <p className="text-sm text-gray-500">Hemoglobin</p>
                <p className="mt-2 font-semibold text-gray-900">Men: 13.5–17.5 g/dL</p>
              </div>
              <div className="rounded-lg p-4 bg-gradient-to-b from-white to-gray-50 border border-gray-100">
                <p className="text-sm text-gray-500">Hematocrit</p>
                <p className="mt-2 font-semibold text-gray-900">Men: 41–53%</p>
              </div>
              <div className="rounded-lg p-4 bg-gradient-to-b from-white to-gray-50 border border-gray-100">
                <p className="text-sm text-gray-500">Platelets</p>
                <p className="mt-2 font-semibold text-gray-900">150–450K/µL</p>
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">When to test</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {testDetails.whenToTest.map((w, i) => (
                <div key={i} className="rounded-lg p-4 border border-gray-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold text-sm">{i + 1}</div>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">{w}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Printable summary & next steps</h3>
            <p className="text-gray-700 mb-4">Download or print this page to share with your clinician. After results, consult a clinician for interpretation and tailored care.</p>
            <div className="flex gap-3">
              <button onClick={() => window.print()} className="rounded-xl px-4 py-2 border border-gray-100 bg-white text-gray-800">Print summary</button>
              <Link to="/download-cbc-summary" className="rounded-xl px-4 py-2 bg-indigo-600 text-white">Download PDF</Link>
              <Link to="/consult" className="rounded-xl px-4 py-2 border border-gray-100 bg-white text-gray-800">Schedule consult</Link>
            </div>
          </section>
        </article>

        {}
        <aside className="lg:col-span-1 space-y-6 sticky top-28 self-start">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Need help?</h4>
            <p className="text-sm text-gray-600 mb-4">Chat with our lab support or schedule a clinician consult for result interpretation.</p>
            <div className="flex flex-col gap-3">
              <Link to="/chat" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition">Chat with support</Link>
              <Link to="/consult" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-100 bg-white text-gray-800 hover:shadow transition">Book consult</Link>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Preparation checklist</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              {testDetails.preparation.map((p, i) => (
                <li key={i} className="flex items-start gap-3"><span className="mt-1 inline-block w-2.5 h-2.5 rounded-full bg-indigo-500" />{p}</li>
              ))}
            </ul>
          </div>
        </aside>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-600 text-center shadow-sm">
          <p>Results are informational only. Always consult a clinician for diagnosis and treatment. For emergencies, seek immediate care.</p>
        </div>
      </footer>
    </div>
  );
}