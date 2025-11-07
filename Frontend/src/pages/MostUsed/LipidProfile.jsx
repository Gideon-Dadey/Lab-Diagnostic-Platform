import React from "react";
import { FaArrowLeft, FaVial, FaUserMd, FaHeartbeat, FaPrint, FaDownload } from "react-icons/fa";
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

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-700 font-medium">
    {children}
  </span>
);

const RiskMeter = ({ percent = 35 }) => {
  const clamp = Math.max(0, Math.min(100, percent));
  const hue = 120 - Math.round((clamp / 100) * 120); 
  return (
    <div aria-hidden className="w-full">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-700">Estimated 10-year cardiac risk</p>
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

const LipidProfile = () => {
  const testDetails = {
    whatIs:
      "A lipid profile measures cholesterol and triglycerides to assess cardiovascular risk. Results guide clinical decisions for prevention and treatment.",
    components: [
      "Total Cholesterol: Combined measurement (Desirable <200 mg/dL)",
      "LDL (Bad Cholesterol): Contributes to plaque (Optimal <100 mg/dL)",
      "HDL (Good Cholesterol): Removes LDL (Optimal ≥60 mg/dL)",
      "Triglycerides: Blood fats (Normal <150 mg/dL)",
    ],
    whyImportant: [
      "High cholesterol contributes substantially to premature cardiovascular disease.",
      "Each 10% reduction in LDL reduces heart disease risk substantially.",
      "Early detection enables lifestyle changes and medication when necessary.",
      "Monitoring ensures treatment effectiveness over time.",
    ],
    preparation: [
      "9–12 hour fasting recommended (water only)",
      "Avoid alcohol 24 hours before the test",
      "Continue prescribed meds unless clinician advises otherwise",
      "Inform provider about supplements (e.g., fish oil, biotin)",
    ],
    riskCategories: [
      "Smokers",
      "Age (men ≥45, women ≥55)",
      "Family history of heart disease",
      "High blood pressure",
      "Diabetes or prediabetes",
      "Obesity (BMI ≥30)",
      "Physical inactivity",
    ],
  };

  
  const estimatedRiskPercent = 28;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {}
      <div className="sticky top-4 z-30 px-4">
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm py-4 px-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/tests"
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition"
              aria-label="Back to tests"
            >
              <FaArrowLeft />
              Back
            </Link>

            <div className="hidden sm:block">
              <Pill>
                <FaVial className="text-indigo-600" />
                Lipid Profile
              </Pill>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Lipid Profile</h1>
            <p className="text-sm text-gray-500">Comprehensive cholesterol & cardiovascular risk assessment</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
              aria-label="Book this test"
            >
              Book This Test
            </button>

            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gray-100 bg-white text-gray-700 hover:shadow transition"
              aria-label="Download report"
            >
              <FaDownload />
              Download PDF
            </button>
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gray-100 bg-white text-gray-700 hover:shadow transition"
              aria-label="Print"
              onClick={() => window.print()}
            >
              <FaPrint />
            </button>
          </div>
        </div>
      </div>

      {}
      <section className="mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="lg:col-span-2 bg-gradient-to-br from-indigo-50 to-white p-8 sm:p-12 flex flex-col justify-between border border-gray-100">
              <div>
                <div className="inline-flex items-center gap-3 rounded-full bg-white shadow px-3 py-1 border border-gray-100 mb-4 w-max">
                  <FaUserMd className="text-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">Clinician-recommended</span>
                </div>

                <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Advanced Lipid Panel</h2>
                <p className="text-lg text-gray-700 mb-6">{testDetails.whatIs}</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {testDetails.components.map((c, i) => {
                    const [title, rest] = c.split(":");
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
                <button className="flex-1 rounded-xl px-5 py-3 bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition">
                  Book Now — $8.62
                </button>
                <Link
                  to="/packages"
                  className="flex-1 rounded-xl px-5 py-3 border border-gray-100 bg-white text-gray-800 text-center shadow-sm hover:shadow transition flex items-center justify-center gap-2"
                >
                  View Packages
                  <FaArrowLeft className="transform rotate-180 opacity-70" />
                </Link>
              </div>
            </div>

            <aside className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Quick Snapshot</h3>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Stat label="Results Time" value="24–72 hrs" />
                  <Stat label="Sample" value="Blood (Venous)" />
                </div>
              </div>

              <div>
                <RiskMeter percent={estimatedRiskPercent} />
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
        {}
        <article className="lg:col-span-2 space-y-8">
          <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-3">
              <FaVial className="text-indigo-600" />
              What the numbers mean
            </h3>
            <p className="text-gray-700 mb-4">
              Interpretation depends on overall profile and patient factors (age, comorbidities, medications).
              Clinicians combine LDL, HDL and triglycerides to determine cardiovascular risk and treatment thresholds.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-lg p-4 bg-gradient-to-b from-white to-gray-50 border border-gray-100">
                <p className="text-sm text-gray-500">LDL (Bad)</p>
                <p className="mt-2 font-semibold text-gray-900">Optimal &lt;100 mg/dL</p>
              </div>
              <div className="rounded-lg p-4 bg-gradient-to-b from-white to-gray-50 border border-gray-100">
                <p className="text-sm text-gray-500">HDL (Good)</p>
                <p className="mt-2 font-semibold text-gray-900">Optimal ≥60 mg/dL</p>
              </div>
              <div className="rounded-lg p-4 bg-gradient-to-b from-white to-gray-50 border border-gray-100">
                <p className="text-sm text-gray-500">Triglycerides</p>
                <p className="mt-2 font-semibold text-gray-900">Normal &lt;150 mg/dL</p>
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Why this matters</h3>
            <ul className="list-disc list-inside space-y-3 text-gray-700">
              {testDetails.whyImportant.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </section>

          <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Risk categories</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {testDetails.riskCategories.map((r, i) => (
                <div key={i} className="rounded-lg p-3 border border-gray-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                    {r[0]}
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">{r}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </article>

        {}
        <aside className="lg:col-span-1 space-y-6 sticky top-28 self-start">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Need help?</h4>
            <p className="text-sm text-gray-600 mb-4">Chat with our support team or schedule a clinician consult.</p>
            <div className="flex flex-col gap-3">
              <Link
                to="/chat"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
              >
                Chat with support
              </Link>
              <Link
                to="/consult"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-100 bg-white text-gray-800 hover:shadow transition"
              >
                Schedule consult
              </Link>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Printable summary</h4>
            <p className="text-sm text-gray-600 mb-4">Download a friendly summary to discuss with your clinician.</p>
            <div className="flex gap-3">
              <button onClick={() => window.print()} className="flex-1 rounded-md px-3 py-2 border border-gray-100 bg-white text-gray-800">
                Print
              </button>
              <button className="flex-1 rounded-md px-3 py-2 bg-indigo-600 text-white">
                Download PDF
              </button>
            </div>
          </div>
        </aside>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-600 text-center shadow-sm">
          <p>
            Results are for informational purposes only. Always consult a clinician for diagnosis and treatment. If you have severe symptoms, seek immediate care.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LipidProfile;