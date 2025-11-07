import React, { useMemo } from "react";
import { FaArrowRight, FaRobot, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import HeroLab1 from "../../assets/Lab1.jpg";
import HeroLab2 from "../../assets/Lab2.jpg";
import HeroLab3 from "../../assets/Lab3.jpg";
import HeroLab4 from "../../assets/Lab4.jpg";

const heroImages = [HeroLab1, HeroLab2, HeroLab3, HeroLab4];

const Hero = () => {
  
  const slides = useMemo(
    () =>
      heroImages.map((src, i) => (
        <SwiperSlide key={i} aria-label={`Hero image ${i + 1}`}>
          <div className="w-full h-full relative">
            {}
            <img
              src={src}
              alt={`Lab environment ${i + 1}`}
              loading="lazy"
              className="w-full h-full object-cover rounded-2xl shadow-2xl transform-gpu transition-transform duration-700 hover:scale-105"
              draggable={false}
            />
          </div>
        </SwiperSlide>
      )),
    []
  );

  return (
    <section
      className="relative min-h-[85vh] bg-gradient-to-br from-primary/6 via-bg-primary to-secondary/6 flex items-center overflow-hidden px-4 sm:px-6 lg:px-8"
      aria-labelledby="hero-heading"
    >
      <h1 id="hero-heading" className="sr-only">
        Pragma Health — AI-based recommendations & lab services
      </h1>

      {}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -left-20 w-72 h-72 rounded-full bg-gradient-to-r from-primary/15 to-secondary/15 blur-3xl opacity-70 hidden lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -right-20 w-72 h-72 rounded-full bg-gradient-to-l from-primary/15 to-secondary/15 blur-3xl opacity-70 hidden lg:block"
      />

      <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-20">
        {}
        <div className="px-2 md:px-6 lg:px-0">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-primary/90 mb-3">
              <FaCheckCircle className="text-primary" aria-hidden="true" />
              Trusted by clinicians and researchers
            </p>

            <h2 className="text-4xl sm:text-4.8xl font-extrabold leading-tight text-gray-900 tracking-tight">
             Your well-being comes first.
              <span className="block mt-3 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Smarter diagnostics, powered by AI and trusted labs.
              </span>
            </h2>

            <p className="mt-6 text-md sm:text-lg text-gray-600 leading-relaxed">
              Discover the future of diagnostics, intelligent, precise, and tailored to you. Powered by advanced AI and verified lab workflows for results you can rely on.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Link
                to="/ai-recommendations-test"
                className="inline-flex items-center gap-3 px-6 py-3 full bg-primary text-white font-semibold shadow-md hover:shadow-lg transform-gpu hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Open AI assistant"
              >
                <FaRobot className="text-lg" aria-hidden="true" />
                <span>Try AI Assistant</span>
                <FaArrowRight className="ml-1 text-sm" aria-hidden="true" />
              </Link>

              <Link
                to="/all-tests-packages"
                className="inline-flex items-center gap-3 px-5 py-3 full border border-gray-200 text-gray-800 bg-white hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="View all tests and packages"
              >
                View all tests
                <FaArrowRight className="ml-1 text-sm" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100">
                <FaRobot className="text-primary" aria-hidden="true" />
                AI-powered analysis
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100">
                Instant actionable results
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100">
                Clinician-reviewed reports
              </span>
            </div>

            {}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-gray-900">99.8%</div>
                <div className="text-xs text-gray-500">Diagnostic accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">100k+</div>
                <div className="text-xs text-gray-500">Tests processed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-xs text-gray-500">Support available</div>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="px-2 md:px-6 lg:px-0">
          <div className="w-full h-72 sm:h-96 md:h-[520px] rounded-2xl overflow-hidden shadow-2xl">
            <Swiper
              modules={[Autoplay, Pagination, EffectFade]}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              effect="fade"
              loop
              className="w-full h-full"
              aria-live="polite"
            >
              {slides}
            </Swiper>
          </div>

          {}
          <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
            <span>State-of-the-art labs & expert technicians</span>
            <span className="hidden sm:inline">Photos represent typical facilities</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;