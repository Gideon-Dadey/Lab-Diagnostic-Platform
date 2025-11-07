import React from "react";
import {
  FaHeartbeat,
  FaFlask,
  FaFemale,
  FaMale,
  FaUserAlt,
  FaChild,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";



const healthConcerns = [
  {
    id: "heart-health",
    name: "Heart Health",
    icon: FaHeartbeat,
    description: "Cardiac assessments",
    colorKey: "red",
  },
  {
    id: "diabetes-care",
    name: "Diabetes Care",
    icon: FaFlask,
    description: "Diabetes management",
    colorKey: "blue",
  },
  {
    id: "womens-health",
    name: "Women's Health",
    icon: FaFemale,
    description: "Women's screenings",
    colorKey: "pink",
  },
  {
    id: "mens-health",
    name: "Men's Health",
    icon: FaMale,
    description: "Men's health checks",
    colorKey: "indigo",
  },
  {
    id: "senior-care",
    name: "Senior Care",
    icon: FaUserAlt,
    description: "Elderly health",
    colorKey: "purple",
  },
  {
    id: "child-health",
    name: "Child Health",
    icon: FaChild,
    description: "Pediatric care",
    colorKey: "green",
  },
];


const colorMap = {
  red: {
    gradient: "from-red-400 to-red-600",
    iconText: "text-red-600",
    iconBg: "bg-red-50",
    border: "border-red-200",
    overlay: "bg-gradient-to-br from-red-300/20 to-red-500/12",
    accent: "bg-red-600/30",
  },
  blue: {
    gradient: "from-sky-400 to-blue-600",
    iconText: "text-blue-600",
    iconBg: "bg-blue-50",
    border: "border-blue-200",
    overlay: "bg-gradient-to-br from-sky-300/20 to-blue-500/12",
    accent: "bg-blue-600/30",
  },
  pink: {
    gradient: "from-pink-400 to-pink-600",
    iconText: "text-pink-600",
    iconBg: "bg-pink-50",
    border: "border-pink-200",
    overlay: "bg-gradient-to-br from-pink-300/20 to-pink-500/12",
    accent: "bg-pink-600/30",
  },
  indigo: {
    gradient: "from-indigo-500 to-indigo-700",
    iconText: "text-indigo-600",
    iconBg: "bg-indigo-50",
    border: "border-indigo-200",
    overlay: "bg-gradient-to-br from-indigo-400/18 to-indigo-700/10",
    accent: "bg-indigo-600/30",
  },
  purple: {
    gradient: "from-violet-400 to-purple-600",
    iconText: "text-purple-600",
    iconBg: "bg-purple-50",
    border: "border-purple-200",
    overlay: "bg-gradient-to-br from-violet-300/18 to-purple-500/12",
    accent: "bg-purple-600/30",
  },
  green: {
    gradient: "from-emerald-400 to-green-600",
    iconText: "text-green-600",
    iconBg: "bg-green-50",
    border: "border-green-200",
    overlay: "bg-gradient-to-br from-emerald-300/18 to-green-500/12",
    accent: "bg-green-600/30",
  },
};

const TestByHConcern = () => {
  const navigate = useNavigate();

  const handleCardActivate = (id) => {
    
    navigate(`/${id}`);
  };

  return (
    <section
      aria-labelledby="tests-by-concern-heading"
      className="relative py-16 bg-white overflow-hidden"
    >
      {}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 -top-28 w-96 h-96 rounded-full bg-indigo-500/6 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -bottom-28 w-96 h-96 rounded-full bg-teal-400/6 blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2
            id="tests-by-concern-heading"
            className="text-3xl sm:text-4xl font-extrabold text-gray-900"
          >
            Health Condition Diagnostics
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Comprehensive diagnostic packages designed for your unique health needs — clinically validated and effortless to book.
          </p>
        </div>

        {}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {healthConcerns.map((concern) => {
            const Icon = concern.icon;
            const colors = colorMap[concern.colorKey] || colorMap.indigo;

            return (
              <div key={concern.id} className="relative">
                {}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCardActivate(concern.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleCardActivate(concern.id);
                    }
                  }}
                  aria-label={`View tests for ${concern.name}`}
                  className={`group h-full flex flex-col justify-start p-4 rounded-2xl bg-white/80 backdrop-blur-sm border ${colors.border} shadow-sm hover:shadow-lg transform transition duration-300 hover:-translate-y-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300`}
                  style={{ cursor: "pointer" }}
                >
                  {}
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${colors.overlay}`}
                  />

                  {}
                  <div className="relative z-10 flex flex-col items-start">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-lg ${colors.iconBg} shadow-sm transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className={`${colors.iconText} w-5 h-5`} aria-hidden="true" />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-gray-900">
                      {concern.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-600">{concern.description}</p>

                    {}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        Explore
                      </span>

                      <span className={`ml-auto inline-flex items-center gap-1 text-xs font-medium ${colors.iconText}`}>
                        Learn
                        <FaArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 bottom-0 h-1 w-0 group-hover:w-full transition-all duration-400 rounded-b-2xl ${colors.accent}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestByHConcern;