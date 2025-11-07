import React from "react";
import {
  FaArrowLeft,
  FaSyringe,
  FaUserMd,
  FaCalendarAlt,
  FaDownload,
  FaPrint,
  FaClock,
  FaHandsHelping,
} from "react-icons/fa";
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

export default function DiabetesScreening() {
  const testDetails = {
    whatIs:
      "Diabetes screening detects prediabetes and diabetes by measuring blood glucose and long-term average levels. Early detection enables interventions that dramatically reduce complications.",
    types: [
      "Fasting Plasma Glucose (FPG): After 8-hour fast (Normal <100 mg/dL)",
      "HbA1c: Average over 2–3 months (Normal <5.7%)",
      "Oral Glucose Tolerance Test (OGTT): Body response to sugar (Normal <140 mg/dL at 2 hrs)",
    ],
    whyImportant: [
      "Diabetes affects ~1 in 11 adults worldwide.",
      "Early detection prevents nerve, kidney, and vision damage.",
      "Lifestyle changes and medication drastically reduce long-term risk.",
    ],
    riskFactors: [
      "Overweight (BMI ≥25)",
      "Age ≥45",
      "Family history",
      "High blood pressure",
      "Physical inactivity",
      "History of gestational diabetes",
    ],
    symptoms: [
      "Increased thirst & urination",
      "Unexplained weight loss",
      "Fatigue",
      "Blurred vision",
      "Slow-healing sores",
    ],
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {}
      <div className="sticky top-5 z-40 px-4">
        <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm py-3 px-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/tests"
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition"
              aria-label="Back to tests"
            >
              <FaArrowLeft />
              Back
            </Link>

            <div className="hidden sm:flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold shadow-sm">
                <FaSyringe /> Diabetes Screening
              </div>
              <div className="text-sm text-gray-500">Early detection & monitoring</div>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">Diabetes Screening</h1>
            <p className="text-xs text-gray-500">FPG · HbA1c · OGTT</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition">
              Book This Panel
            </button>
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gray-100 bg-white text-gray-700 hover:shadow transition"
              aria-label="Download PDF"
            >
              <FaDownload />
              Download
            </button>
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gray-100 bg-white text-gray-700 hover:shadow transition"
              aria-label="Print"
              onClick={() => window.print()}
            >
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
            <div className="lg:col-span-2 bg-gradient-to-br from-emerald-50 to-white p-8 sm:p-12 flex flex-col justify-between border border-gray-100">
              <div>
                <div className="inline-flex items-center gap-3 rounded-full bg-white shadow px-3 py-1 border border-gray-100 mb-4 w-max">
                  <FaUserMd className="text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">Evidence-based</span>
                </div>

                <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Proactive Diabetes Screening</h2>
                <p className="text-lg text-gray-700 mb-6">{testDetails.whatIs}</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {testDetails.types.map((t, i) => {
                    const [title, rest] = t.split(":");
                    return (
                      <div key={i} className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
                        <p className="text-sm font-semibold text-gray-900">{title}</p>
                        <p className="mt-1 text-sm text-gray-600">{rest?.trim()}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 items-stretch">
                <button className="flex-1 rounded-xl px-5 py-3 bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition">
                  Book Now — $4.49
                </button>

                <Link
                  to="/prevention"
                  className="flex-1 rounded-xl px-5 py-3 border border-gray-100 bg-white text-gray-800 text-center shadow-sm hover:shadow transition flex items-center justify-center gap-2"
                >
                  Prevention Tips
                  <FaClock className="opacity-70" />
                </Link>
              </div>
            </div>

            <aside className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Quick Snapshot</h3>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Stat label="Results Time" value="24–48 hrs" />
                  <Stat label="Sample" value="Blood (Fasting/Non-fasting)" />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Who should test?</h4>
                <ul className="mt-2 text-sm text-gray-600 space-y-2">
                  {["Age ≥45", "Overweight (BMI ≥25)", "Family history", "High BP", "Pregnancy history"].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Schedule</h4>
                <div className="flex items-center gap-3">
                  <Link
                    to="/book"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
                  >
                    Book a Slot
                    <FaCalendarAlt />
                  </Link>
                  <Link
                    to="/consult"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full border border-gray-100 bg-white text-gray-800 hover:shadow transition"
                  >
                    Talk to Clinician
                    <FaHandsHelping />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {}
        <article className="lg:col-span-2 space-y-8">
          <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-3">
              <FaSyringe className="text-emerald-600" />
              Test types & interpretation
            </h3>
            <p className="text-gray-700 mb-4">
              Interpretation is contextual — fasting status, medications and comorbidities affect thresholds. Below are common tests and what they mean.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-lg p-4 bg-gradient-to-b from-white to-gray-50 border border-gray-100">
                <p className="text-sm text-gray-500">FPG</p>
                <p className="mt-2 font-semibold text-gray-900">Normal &lt;100 mg/dL</p>
              </div>
              <div className="rounded-lg p-4 bg-gradient-to-b from-white to-gray-50 border border-gray-100">
                <p className="text-sm text-gray-500">HbA1c</p>
                <p className="mt-2 font-semibold text-gray-900">Normal &lt;5.7%</p>
              </div>
              <div className="rounded-lg p-4 bg-gradient-to-b from-white to-gray-50 border border-gray-100">
                <p className="text-sm text-gray-500">OGTT (2-hr)</p>
                <p className="mt-2 font-semibold text-gray-900">Normal &lt;140 mg/dL</p>
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Why screening matters</h3>
            <ul className="list-disc list-inside space-y-3 text-gray-700">
              {testDetails.whyImportant.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </section>

          <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Symptoms & action</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg p-4 border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-2">Common Symptoms</h4>
                <ul className="text-gray-700 space-y-2">
                  {testDetails.symptoms.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg p-4 border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-2">Next Steps</h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Book a screening test</li>
                  <li>Review results with a clinician</li>
                  <li>Begin lifestyle or pharmacologic therapy as advised</li>
                </ol>
              </div>
            </div>
          </section>
        </article>

        {}
        <aside className="lg:col-span-1 space-y-6 sticky top-28 self-start">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Need help?</h4>
            <p className="text-sm text-gray-600 mb-4">Schedule a consult or chat with our specialists for personalized interpretation.</p>
            <div className="flex flex-col gap-3">
              <Link
                to="/consult"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
              >
                Schedule consult
              </Link>
              <Link
                to="/chat"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-100 bg-white text-gray-800 hover:shadow transition"
              >
                Chat with support
              </Link>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Preparation checklist</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-3"><span className="mt-1 inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />Fasting 8–12 hours</li>
              <li className="flex items-start gap-3"><span className="mt-1 inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />Avoid alcohol 24 hrs</li>
              <li className="flex items-start gap-3"><span className="mt-1 inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />Bring meds list</li>
            </ul>
          </div>
        </aside>
      </main>

      {}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-600 text-center shadow-sm">
          <p>
            Results are informational and not a diagnosis. Always consult a clinician for personalized medical advice. For emergencies, seek immediate care.
          </p>
        </div>
      </footer>
    </div>
  );
}