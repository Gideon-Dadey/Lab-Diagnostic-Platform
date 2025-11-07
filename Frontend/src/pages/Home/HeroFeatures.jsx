import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiActivity,
  FiShield,
  FiUserCheck
} from "react-icons/fi";
import {
  FaCalendarCheck,
  FaFlask,
  FaInfoCircle,
  FaRobot,
  FaShieldAlt,
  FaArrowRight
} from "react-icons/fa";



const FEATURES = [
  {
    Icon: FiActivity,
    title: "AI-Powered Analysis",
    description: "Smart health insights using advanced AI technology"
  },
  {
    Icon: FaFlask,
    title: "Lab Network",
    description: "Access to certified laboratories nationwide"
  },
  {
    Icon: FiShield,
    title: "Data Privacy & Security",
    description: "Your health data is protected with strict security protocols and encryption."
  },
  {
    Icon: FiUserCheck,
    title: "Expert Support",
    description: "24/7 access to healthcare professionals"
  },
  {
    Icon: FaShieldAlt,
    title: "Trusted Labs",
    description: "All our partner laboratories are NABL accredited and follow strict quality protocols"
  },
  {
    Icon: FaRobot,
    title: "Personalized Healthcare",
    description: "Tailored test suggestions empower patients to make informed decisions independently."
  },
  {
    Icon: FaCalendarCheck,
    title: "Easy Scheduling",
    description: "Book lab tests seamlessly through our user-friendly platform for convenience."
  },
  {
    Icon: FaInfoCircle,
    title: "Centralized Test Information",
    description: "Access comprehensive lab test details, pricing, and instructions for informed healthcare decisions"
  }
];

const FeatureCard = ({ Icon, title, description }) => {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <article
      className="relative group isolate flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-border/10 shadow-sm hover:shadow-xl transition transform-gpu duration-300 focus-within:shadow-xl"
      tabIndex={0}
      aria-labelledby={`feature-${title.replace(/\s+/g, "-").toLowerCase()}`}
      role="article"
      style={{
        
        willChange: prefersReducedMotion ? "auto" : "transform"
      }}
    >
      <div
        className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary mb-4 transition-transform duration-300 group-hover:scale-105 group-focus:scale-105"
        aria-hidden="true"
      >
        <Icon className="w-7 h-7" />
      </div>

      <h3
        id={`feature-${title.replace(/\s+/g, "-").toLowerCase()}`}
        className="text-lg font-semibold text-gray-900 mb-2"
      >
        {title}
      </h3>

      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>

      {}
      <Link
        to="/features"
        className="mt-5 inline-flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200"
        aria-label={`Learn more about ${title}`}
      >
        Learn more <FaArrowRight className="text-xs" />
      </Link>
    </article>
  );
};

const Features = () => {
  const cards = useMemo(
    () =>
      FEATURES.map((f) => (
        <FeatureCard key={f.title} Icon={f.Icon} title={f.title} description={f.description} />
      )),
    []
  );

  return (
    <section
      className="relative py-16 bg-gradient-to-b from-bg-primary to-bg-secondary overflow-hidden"
      aria-label="Platform features"
    >
      {/* premium background */}
      <BackgroundLayer />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Our Features</h2>
          <p className="mt-3 text-lg text-gray-600">
            Experience healthcare reimagined with our innovative solutions
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards}
        </div>

        {}
        <div className="mt-8 flex justify-center">
          <Link
            to="/features"
            className="inline-flex items-center gap-3 px-4 py-3 full bg-primary text-white font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
            aria-label="Explore all features"
          >
            Explore Features
            <FaArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// Subtle, layered decorative background for a more premium feel
const BackgroundLayer = () => {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {/* gradient mesh blobs */}
      <div className="hidden lg:block absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="hidden lg:block absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />

      {/* radial grid overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox="0 0 800 600" preserveAspectRatio="none">
        <defs>
          <radialGradient id="rg" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#rg)" />
      </svg>

      {/* faint icon watermarks */}
      <div className="hidden md:block absolute top-[12%] left-[6%] text-primary opacity-[0.06] rotate-[-8deg]">
        <FiActivity className="w-24 h-24" />
      </div>
      <div className="hidden md:block absolute top-[22%] right-[8%] text-primary opacity-[0.06] rotate-[10deg]">
        <FaShieldAlt className="w-24 h-24" />
      </div>
      <div className="hidden md:block absolute bottom-[18%] left-[14%] text-primary opacity-[0.06] rotate-[6deg]">
        <FaRobot className="w-24 h-24" />
      </div>
    </div>
  );
};

export default Features;