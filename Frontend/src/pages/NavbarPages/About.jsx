import React from "react";
import Features from "./Features";
import { FaPlay, FaArrowRight } from "react-icons/fa";



const Stat = ({ value, label }) => (
  <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm hover:shadow-md transition transform hover:-translate-y-1">
    <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">{value}</p>
    <p className="mt-1 text-sm text-gray-600">{label}</p>
  </div>
);

const About = () => {
  return (
    <section
      aria-labelledby="about-heading"
      className="w-full bg-white text-gray-900 relative overflow-hidden"
    >
      {}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-44 -top-36 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-100 to-teal-50 opacity-90 blur-3xl transform rotate-12"
      />

      {}
      <div className="fixed left-1/2 transform -translate-x-1/2 bottom-6 z-40 w-[min(980px,92%)] bg-white/90 backdrop-blur-md border border-gray-100 rounded-full shadow-lg flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow">
            <FaPlay className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Try a quick demo</p>
            <p className="text-xs text-gray-500">See AI recommendations in action</p>
          </div>
        </div>

        <div>
          <a
            href="/request-demo"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            aria-label="Request demo"
          >
            Request demo
            <FaArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="relative max-w-[1300px] mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-indigo-50 text-indigo-600">
              Introducing
            </span>

            <h2
              id="about-heading"
              className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900"
            >
              Pragma Health LLC
              <span className="block mt-3 text-xl sm:text-2xl font-medium italic text-indigo-600">
                Empowering healthcare with intelligent diagnostics
              </span>
            </h2>

            <p className="text-lg text-gray-700 max-w-3xl">
              Pragma Health delivers a next-generation platform for laboratory diagnostics — combining clinician-reviewed AI recommendations,
              nationwide accredited labs, and seamless booking workflows so patients and care teams get faster, more actionable results.
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              <a
                href="/get-started"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black text-white font-semibold shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
                aria-label="Get started with Pragma Health"
              >
                Get started
                <FaArrowRight className="w-4 h-4" />
              </a>

              <a
                href="/request-demo"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-gray-200 bg-white text-gray-900 hover:shadow transition"
                aria-label="Request demo"
              >
                <FaPlay className="w-3.5 h-3.5" />
                Request a demo
              </a>
            </div>

            {}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <Stat value="99.9%" label="Uptime & reliable reporting" />
              <Stat value="500+" label="Accredited labs partnered" />
              <Stat value="1M+" label="Tests analyzed and counting" />
            </div>
          </div>

          {}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-xl">
              {}
              <div className="relative bg-gradient-to-br from-indigo-50 to-white p-8 h-96 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-white/80 text-xs font-medium text-indigo-700 shadow-sm">
                    New
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-gray-900 max-w-md">
                    Smarter diagnostics, powered by AI and trusted labs.
                  </h3>
                  <p className="mt-3 text-gray-600">
                    Discover precise, personalized results built on clinical workflows and verified lab processes.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Trusted by clinicians & researchers</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-indigo-600 font-bold">CH</div>
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-indigo-600 font-bold">CL</div>
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-indigo-600 font-bold">PD</div>
                    </div>
                  </div>

                  <a
                    href="/platform"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                    aria-label="Learn how Pragma Health powers modern diagnostics"
                  >
                    Learn more
                    <FaArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {}
              <div className="h-6 bg-white border-t border-gray-100 relative">
                <div className="absolute -top-3 left-6 w-12 h-6 bg-white rotate-3 shadow-sm rounded-sm" />
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="mt-16 border-t border-gray-100" />

        {}
        <div className="mt-12">
          <div className="max-w-[1400px] mx-auto px-2">
            <Features />
          </div>
        </div>

        {}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Built for clinicians, patients, and labs — combining security, automation, and human-centered workflows.{" "}
            <a href="/platform" className="text-indigo-600 font-medium hover:underline">
              Learn how Pragma Health powers modern diagnostics
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;