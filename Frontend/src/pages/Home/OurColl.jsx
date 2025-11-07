import React, { useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import chugtai from "../../assets/chugtai.png";
import metro from "../../assets/MetroLab.jpg";
import citilab from "../../assets/CitiLab.png";
import CLINLAB from "../../assets/CLINLAB.png";
import SalmanLab from "../../assets/SalmanChugtahi.png";
import PrideLab from "../../assets/PrideLab.png";
import AlphaDC from "../../assets/AlphaDiagnosticCenter.png";
import InnovaLab from "../../assets/Innova.jpg";
import Alnoor from "../../assets/AlnoorDiagnosticCentre.jpg";
import HameedLatif from "../../assets/HameedLatifHospital.jpg";
import { FaHospital, FaClinicMedical, FaMicroscope } from "react-icons/fa";



const collaborators = [
  { name: "Chughtai Lab", image: chugtai, type: "hospital" },
  { name: "Citilab and Research Centre", image: citilab, type: "clinic" },
  { name: "CLINLAB", image: CLINLAB, type: "lab" },
  { name: "Salman Chughtai's Lab", image: SalmanLab, type: "hospital" },
  { name: "Pride Lab", image: PrideLab, type: "lab" },
  { name: "Metro City Lab", image: metro, type: "clinic" },
  { name: "Alpha Diagnostic Centre", image: AlphaDC, type: "clinic" },
  { name: "Innova Labs and Diagnostics", image: InnovaLab, type: "lab" },
  { name: "Alnoor Diagnostic Centre", image: Alnoor, type: "clinic" },
  { name: "Hameed Latif Hospital Laboratories", image: HameedLatif, type: "hospital" },
];

const getIcon = (type) => {
  switch (type) {
    case "hospital":
      return <FaHospital className="w-4 h-4" aria-hidden />;
    case "clinic":
      return <FaClinicMedical className="w-4 h-4" aria-hidden />;
    case "lab":
      return <FaMicroscope className="w-4 h-4" aria-hidden />;
    default:
      return <FaHospital className="w-4 h-4" aria-hidden />;
  }
};

const OurColl = () => {
  const marqueeRef = useRef(null);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;

    let isPointerDown = false;

    const onPointerDown = () => {
      isPointerDown = true;
      el.style.animationPlayState = "paused";
    };
    const onPointerUp = () => {
      isPointerDown = false;
      if (!prefersReducedMotion) el.style.animationPlayState = "running";
    };

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [prefersReducedMotion]);

  
  const handleKeyNav = useCallback((e) => {
    const el = marqueeRef.current;
    if (!el) return;
    const step = el.offsetWidth * 0.2;
    if (e.key === "ArrowRight") {
      el.scrollBy({ left: step, behavior: "smooth" });
    } else if (e.key === "ArrowLeft") {
      el.scrollBy({ left: -step, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    el.addEventListener("keydown", handleKeyNav);
    return () => el.removeEventListener("keydown", handleKeyNav);
  }, [handleKeyNav]);

  return (
    <section className="w-full bg-white text-black">
      {}
      <div className="w-full h-1" style={{ background: "linear-gradient(90deg,#7c3aed,#06b6d4)" }} />

      <div className="w-full max-w-full mx-auto px-6 lg:px-12 py-16">
        <div className="w-full mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-black">
              Our Trusted Partners
            </h2>
            <p className="mt-2 text-gray-700 max-w-2xl">
              Leading healthcare providers working with us to deliver quality diagnostic services — trusted labs and hospitals across regions.
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <Link to="/partners" className="text-sm font-medium text-indigo-600 hover:underline">
              View all partners
            </Link>
            <button
              onClick={() => {
                const el = marqueeRef.current;
                if (!el) return;
                
                const paused = el.style.animationPlayState === "paused";
                el.style.animationPlayState = paused ? "running" : "paused";
                
              }}
              className="text-sm px-3 py-2 border border-gray-200 text-gray-800 hover:bg-gray-50"
              aria-label="Pause or resume partner carousel"
            >
              Pause
            </button>
          </div>
        </div>

        {}
        <div
          className="relative w-full overflow-hidden"
          aria-roledescription="carousel"
          aria-label="Partners carousel"
        >
          {}
          <div
            ref={marqueeRef}
            tabIndex={0}
            className={`flex gap-6 items-stretch will-change-transform ${prefersReducedMotion ? "" : "animate-marquee"}`}
            style={{
              
              "--marquee-duration": prefersReducedMotion ? "0s" : "22s",
            }}
            aria-live="polite"
          >
            {}
            {[...collaborators, ...collaborators].map((collab, idx) => (
              <article
                key={`${collab.name}-${idx}`}
                className="flex-shrink-0 w-[20rem] md:w-[22rem] lg:w-[24rem] h-40 md:h-44 lg:h-48 p-4 border border-gray-100 bg-white focus-within:outline-none"
                tabIndex={0}
                aria-label={`${collab.name}, ${collab.type}`}
                role="group"
              >
                <div className="flex h-full w-full">
                  {}
                  <div className="w-1/3 flex items-center justify-center bg-gray-50 border-r border-gray-100">
                    <img
                      src={collab.image}
                      alt={collab.name}
                      loading="lazy"
                      className="max-h-28 max-w-full object-contain"
                      width="140"
                      height="140"
                    />
                  </div>

                  {}
                  <div className="w-2/3 p-3 flex flex-col justify-center">
                    <h3 className="text-sm md:text-base font-semibold text-black leading-tight">
                      {collab.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-indigo-600">{getIcon(collab.type)}</span>
                      <span className="capitalize">{collab.type}</span>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Link
                        to="/partners"
                        className="text-xs px-2 py-1 border border-indigo-100 text-indigo-700 hover:bg-indigo-50"
                        aria-label={`View ${collab.name} profile`}
                      >
                        View
                      </Link>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(collab.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-1 border border-gray-200 text-gray-700 hover:bg-gray-100"
                      >
                        Explore
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {}
          <div className="hidden lg:flex absolute inset-y-0 left-2 items-center">
            <button
              aria-label="Scroll left"
              onClick={() => {
                const el = marqueeRef.current;
                if (!el) return;
                el.scrollBy({ left: -el.offsetWidth * 0.25, behavior: "smooth" });
              }}
              className="bg-white border border-gray-200 text-gray-700 px-2 py-1"
            >
              ‹
            </button>
          </div>

          <div className="hidden lg:flex absolute inset-y-0 right-2 items-center">
            <button
              aria-label="Scroll right"
              onClick={() => {
                const el = marqueeRef.current;
                if (!el) return;
                el.scrollBy({ left: el.offsetWidth * 0.25, behavior: "smooth" });
              }}
              className="bg-white border border-gray-200 text-gray-700 px-2 py-1"
            >
              ›
            </button>
          </div>
        </div>

        {}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
          {collaborators.map((c, i) => (
            <div key={`mobile-${i}`} className="flex border border-gray-100 p-3">
              <div className="w-28 flex items-center justify-center bg-gray-50 border-r border-gray-100">
                <img src={c.image} alt={c.name} loading="lazy" className="max-h-20 object-contain" />
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-black text-sm">{c.name}</h4>
                <div className="text-xs text-gray-600 mt-1 flex items-center gap-2">
                  <span className="text-indigo-600">{getIcon(c.type)}</span>
                  <span className="capitalize">{c.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {}
      <style>{`
        :root {
          --marquee-duration: 22s;
        }

        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          animation: marquee var(--marquee-duration) linear infinite;
        }

        /* Pause animation on hover/focus for accessibility */
        .animate-marquee:hover,
        .animate-marquee:focus,
        .animate-marquee:active {
          animation-play-state: paused;
        }

        /* Make sure duplicated content lines up exactly */
        .animate-marquee > * { flex: 0 0 auto; }

        /* Remove default outline for mouse users, keep for keyboard users */
        article:focus { outline: 2px solid rgba(99,102,241,0.25); outline-offset: 2px; }

        /* Responsive tweak: slower marquee on wide screens */
        @media (min-width: 1280px) {
          :root { --marquee-duration: 28s; }
        }

        /* Respect reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee { animation: none !important; }
        }
      `}</style>
    </section>
  );
};

export default OurColl;