import React from "react";



const NavLink = ({ label, className = "", ...rest }) => (
  <a
    {...rest}
    className={`inline-flex items-center gap-2 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/40 transition-colors duration-150 ${className}`}
  >
    <span className="sr-only">{label}</span>
    <span aria-hidden className="text-sm font-medium">
      {label}
    </span>
  </a>
);

const Topbar = () => {
  return (
    <header role="banner" className="relative z-50 text-white text-xs md:text-sm select-none">
      {}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-100" />

        {}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="g" x1="0" x2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
            </linearGradient>
            <filter id="f" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="40" result="b" />
              <feBlend in="SourceGraphic" in2="b" mode="screen" />
            </filter>
          </defs>

          <g filter="url(#f)" className="opacity-60">
            <circle cx="120" cy="90" r="120" fill="url(#g)" className="transform-gpu will-change-transform animate-blob-slow" />
            <circle cx="700" cy="110" r="120" fill="url(#g)" className="transform-gpu will-change-transform animate-blob-slower" />
          </g>
        </svg>

        {}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {}
          <div className="flex items-center gap-3">
            <a href="/" className="inline-flex items-center gap-2" aria-label="Go to homepage">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="6" fill="rgba(255,255,255,0.06)" />
                <path d="M7 12h10M7 8h10" stroke="white" strokeOpacity="0.9" strokeWidth="1.2" strokeLinecap="round" />
              </svg>

              {}
              <span className="sr-only">Pragma Health</span>
            </a>

            {}
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/6 text-white/80 text-[11px]">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="opacity-90">
                {}
              </svg>
              {}
            </span>
          </div>

          {}
          <nav aria-label="Topbar" className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center space-x-2 border-l border-white/10 pl-3">
              <NavLink href="/about" label="About Us" className="text-white/90 hover:text-white/100" title="About Us" />
              <span className="text-white/20" aria-hidden>|</span>
              <NavLink href="/contact" label="Contact Us" className="text-white/90 hover:text-white/100" title="Contact Us" />
              <span className="text-white/20" aria-hidden>|</span>
              <NavLink href="/join" label="Partner With Us" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white/100" title="Join Us" />
            </div>
          </nav>
        </div>
      </div>

      {}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-blob-slow,
          .animate-blob-slower {
            animation: none !important;
          }
        }

        @keyframes blobFloat {
          0% {
            transform: translate3d(0px, 0px, 0) scale(1);
          }
          33% {
            transform: translate3d(12px, -8px, 0) scale(1.02);
          }
          66% {
            transform: translate3d(-10px, 10px, 0) scale(0.98);
          }
          100% {
            transform: translate3d(0px, 0px, 0) scale(1);
          }
        }
        .animate-blob-slow {
          animation: blobFloat 8s ease-in-out infinite;
        }
        .animate-blob-slower {
          animation: blobFloat 12s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
};

export default Topbar;