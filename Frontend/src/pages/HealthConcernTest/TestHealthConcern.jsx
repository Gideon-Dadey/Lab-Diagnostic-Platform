import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHeartbeat,
  FaFlask,
  FaFemale,
  FaMale,
  FaUserAlt,
  FaChild,
} from "react-icons/fa";

const healthConcerns = [
  {
    name: "Heart Health",
    icon: FaHeartbeat,
    description: "Comprehensive cardiac and vascular assessments",
    gradient: "from-[#ff6b6b]/10 to-[#ff4757]/5",
    iconColor: "text-[#ff4757]",
  },
  {
    name: "Diabetes Care",
    icon: FaFlask,
    description: "Endocrine and blood sugar management panels",
    gradient: "from-[#3498db]/10 to-[#2980b9]/5",
    iconColor: "text-[#3498db]",
  },
  {
    name: "Women's Health",
    icon: FaFemale,
    description: "Hormonal and reproductive health evaluations",
    gradient: "from-[#ff80ab]/10 to-[#f50057]/5",
    iconColor: "text-[#f50057]",
  },
  {
    name: "Men's Health",
    icon: FaMale,
    description: "Hormone and wellness optimization screenings",
    gradient: "from-[#5c6bc0]/10 to-[#3949ab]/5",
    iconColor: "text-[#3949ab]",
  },
  {
    name: "Senior Care",
    icon: FaUserAlt,
    description: "Age-related diagnostic and wellness packages",
    gradient: "from-[#9b59b6]/10 to-[#8e44ad]/5",
    iconColor: "text-[#8e44ad]",
  },
  {
    name: "Child Health",
    icon: FaChild,
    description: "Pediatric health monitoring and growth tracking",
    gradient: "from-[#2ecc71]/10 to-[#27ae60]/5",
    iconColor: "text-[#27ae60]",
  },
];

const TestHealthConcern = () => {
  const navigate = useNavigate();

  const handleCardClick = (concernName) => {
    const path = concernName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/${path}`);
  };

  return (
    <section className="min-h-screen bg-white text-gray-800 px-6 py-8 lg:px-12">
      {}
      <div className="mb-0">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-[#3498db] hover:underline hover:opacity-80 transition"
        >
          ← Back to Home
        </button>
      </div>

      {}
      <div className="text-center mb-14 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#222] mb-3">
          Diagnostic Tests by Health Concern
        </h1>
        <p className="text-lg text-gray-600">
          Choose from carefully curated health test packages tailored to your
          specific needs and medical goals.
        </p>
      </div>

      {}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mb-14">
        {healthConcerns.map((concern, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 250, damping: 15 }}
            onClick={() => handleCardClick(concern.name)}
            className={`relative cursor-pointer group rounded-xl border border-gray-100 bg-gradient-to-br ${concern.gradient} 
                        hover:shadow-xl hover:border-[#3498db]/30 hover:bg-white transition-all duration-500`}
          >
            <div className="p-5 text-center flex flex-col items-center">
              <div
                className={`w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-white shadow-inner group-hover:scale-110 transition-transform duration-500`}
              >
                <concern.icon
                  className={`w-6 h-6 ${concern.iconColor} group-hover:animate-pulse`}
                />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-[#3498db] transition-colors duration-300">
                {concern.name}
              </h3>
              <p className="text-sm text-gray-500">{concern.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gray-50 border border-gray-100 rounded-2xl p-8 shadow-sm max-w-5xl mx-auto"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Why Choose Concern-Based Diagnostics?
        </h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          Concern-based testing empowers individuals to make informed decisions
          about their health. By focusing on specific medical areas, these tests
          help detect potential risks early and guide personalized treatment or
          lifestyle changes.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Whether you’re managing a chronic condition or simply seeking
          preventive insights, our tailored diagnostics ensure precision,
          reliability, and peace of mind.
        </p>
      </motion.div>
    </section>
  );
};

export default TestHealthConcern;
