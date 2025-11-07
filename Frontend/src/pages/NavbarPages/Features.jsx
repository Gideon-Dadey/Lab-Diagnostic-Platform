import React, { useState } from "react";
import { FiActivity, FiShield, FiUserCheck } from "react-icons/fi";
import { FaCalendarCheck, FaFlask, FaInfoCircle, FaRobot, FaShieldAlt, FaArrowRight } from "react-icons/fa";


const Features = () => {
  const [openFeatureIndex, setOpenFeatureIndex] = useState(null);

  const features = [
    { icon: FiActivity, title: "AI-Powered Analysis", description: "Smart health insights using advanced AI technology" },
    { icon: FaFlask, title: "Lab Network", description: "Access to certified laboratories nationwide" },
    { icon: FiShield, title: "Data Privacy & Security", description: "Your health data is protected with strict security protocols and encryption." },
    { icon: FiUserCheck, title: "Expert Support", description: "24/7 access to healthcare professionals" },
    { icon: FaShieldAlt, title: "Trusted Labs", description: "All our partner laboratories are NABL accredited and follow strict quality protocols" },
    { icon: FaRobot, title: "Personalized Healthcare", description: "Tailored test suggestions empower patients to make informed decisions independently." },
    { icon: FaCalendarCheck, title: "Easy Scheduling", description: "Book lab tests seamlessly through our user-friendly platform for convenience." },
    { icon: FaInfoCircle, title: "Centralized Test Information", description: "Access comprehensive lab test details, pricing, and instructions for informed healthcare decisions" }
  ];

  const openFeature = (i) => {
    setOpenFeatureIndex(i);
    
    if (typeof window !== "undefined") document.body.style.overflow = "hidden";
  };

  const closeFeature = () => {
    setOpenFeatureIndex(null);
    if (typeof window !== "undefined") document.body.style.overflow = "";
  };

  // close on Escape
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeFeature();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      aria-labelledby="features-heading"
      className="w-full bg-white text-gray-900 relative"
    >
      {}
      <div className="pointer-events-none absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/3 opacity-10">
        <svg width="560" height="560" viewBox="0 0 560 560" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="280" cy="280" r="280" fill="#E6F0FF" />
        </svg>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900"
          >
            Our Features
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Experience healthcare reimagined — secure, intelligent, and patient-centered solutions designed for modern life.
          </p>
        </div>

        <div
          role="list"
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                key={index}
                role="listitem"
                tabIndex={0}
                aria-labelledby={`feature-${index}-title`}
                className="group relative flex flex-col p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transform transition duration-300 hover:-translate-y-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-500 text-white shadow-md transform transition group-hover:scale-110">
                      <Icon className="w-7 h-7" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 id={`feature-${index}-title`} className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                    {index < 3 ? "Popular" : "Standard"}
                  </span>

                  <button
                    onClick={() => openFeature(index)}
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    aria-expanded={openFeatureIndex === index}
                    aria-controls={`feature-details-${index}`}
                  >
                    Learn more
                    <FaArrowRight className="ml-2 w-3.5 h-3.5" />
                  </button>
                </div>

                <span aria-hidden="true" className="absolute left-6 bottom-6 h-0.5 w-10 bg-gradient-to-r from-indigo-400 to-transparent opacity-60 transform scale-x-75 group-hover:scale-x-100 transition-transform duration-300" />
              </article>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            Want a demo or custom integrations?{" "}
            <a className="text-indigo-600 font-medium hover:underline" href="#" onClick={(e) => e.preventDefault()}>
              Contact our team
            </a>
            .
          </p>
        </div>
      </div>

      {}
      {openFeatureIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`feature-details-title-${openFeatureIndex}`}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        >
          {}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeFeature}
            aria-hidden="true"
          />

          {}
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
            <div className="px-6 py-6 sm:px-8 sm:py-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id={`feature-details-title-${openFeatureIndex}`} className="text-2xl font-extrabold text-gray-900">
                    Experience healthcare reimagined — secure, intelligent, and patient-centered solutions designed for modern life.
                  </h2>
                  <p className="mt-3 text-gray-600">
                    Explore how our platform combines advanced AI, trusted laboratory workflows, and clinician-reviewed insights to deliver precise, personalized diagnostics and a seamless experience.
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <button
                    onClick={closeFeature}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-md text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    aria-label="Close details"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="sm:col-span-2 rounded-lg p-4 bg-gray-50 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {features[openFeatureIndex].title}
                  </h3>
                  <p className="text-gray-600">{features[openFeatureIndex].description}</p>

                  <ul className="mt-4 space-y-2 text-sm text-gray-700">
                    <li>• Clinically-validated models and continuous monitoring</li>
                    <li>• End-to-end lab integration and result verification</li>
                    <li>• Built-in privacy and audit controls</li>
                  </ul>
                </div>

                <aside className="rounded-lg p-4 bg-white border border-gray-100 shadow-sm">
                  <div className="text-sm text-gray-600">Status</div>
                  <div className="mt-2 inline-flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-gray-900">Active</span>
                  </div>

                  <div className="mt-4">
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="inline-flex items-center justify-center w-full px-3 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                    >
                      Try this feature
                    </a>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Features;