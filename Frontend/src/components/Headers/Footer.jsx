import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaArrowUp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
  FaMoon,
  FaSun,
} from "react-icons/fa";

const SOCIAL = [
  { href: "https://facebook.com", label: "Facebook", Icon: FaFacebook },
  { href: "https://twitter.com", label: "Twitter", Icon: FaTwitter },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: FaLinkedin },
  { href: "https://instagram.com", label: "Instagram", Icon: FaInstagram },
];

const SITEMAP = [
  { text: "AI Recommendations", to: "/ai-recommendations-test" },
  { text: "Most Used Tests", to: "/tests" },
  { text: "Our Partners", to: "/our-partners" },
  { text: "All Tests & Packages", to: "/all-tests-packages" },
];

const RESOURCES = [
  { text: "Help Center", to: "/help" },
  { text: "Blog", to: "/blog" },
  { text: "Contact", to: "/contact" },
  { text: "FAQ", to: "/faq" },
];

const Footer = () => {
  const [showTop, setShowTop] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, setTheme] = useState("system"); 
  const statusRef = useRef(null);

  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    try {
      const s = localStorage.getItem("pragma:subscribed") === "true";
      setSubscribed(Boolean(s));
      const saved = localStorage.getItem("pragma:theme");
      if (saved) setTheme(saved);
      else setTheme("system");
    } catch (e) {
      
    }
  }, []);

  useEffect(() => {
    
    try {
      const root = document.documentElement;
      root.dataset.pragmaTheme = theme;
      localStorage.setItem("pragma:theme", theme);
    } catch (e) {}
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 420);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const validateEmail = (value) => {
    return /^\S+@\S+\.\S+$/.test(value);
  };

  const handleSubscribe = useCallback(
    async (e) => {
      e?.preventDefault();
      setStatusMessage("");
      if (subscribed) {
        setStatusMessage("You're already subscribed. Thank you!");
        statusRef.current?.focus();
        return;
      }
      if (!validateEmail(email.trim())) {
        setStatusMessage("Please enter a valid email address.");
        statusRef.current?.focus();
        return;
      }

      setIsSubmitting(true);
      try {
        if (!prefersReducedMotion) {
          await new Promise((r) => setTimeout(r, 600));
        }
        setSubscribed(true);
        setStatusMessage("Subscription successful — welcome!");
        try {
          localStorage.setItem("pragma:subscribed", "true");
        } catch (e) {}
        setEmail("");
        statusRef.current?.focus();
      } catch (err) {
        setStatusMessage("Something went wrong. Please try again later.");
        statusRef.current?.focus();
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, subscribed, prefersReducedMotion]
  );

  const handleThemeToggle = useCallback(() => {
    setTheme((t) => {
      if (t === "light") return "dark";
      if (t === "dark") return "system";
      return "light";
    });
  }, []);

  const scrollToTop = useCallback(() => {
    if (prefersReducedMotion) {
      window.scrollTo(0, 0);
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [prefersReducedMotion]);

  return (
    <footer
      aria-labelledby="footer-title"
      className="w-full bg-white text-black"
    >
      <h2 id="footer-title" className="sr-only">
        Footer
      </h2>

      {}
      <div className="w-full h-2" style={{ background: "linear-gradient(90deg,#7c3aed 0%, #06b6d4 100%)" }} />

      <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 py-12">
        {}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-gray-100 pb-10">
          {}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt="Pragma Health LLC logo"
                className="w-1- h-10 object-cover"
              />
              <div>
                <p className="text-2xl font-extrabold leading-tight text-black">
                  Pragma Health LLC
                </p>
                <p className="text-sm text-gray-700">
                  Your trusted digital healthcare partner
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-700">
              We build secure, intelligent healthcare tools that connect patients, clinicians, and labs.
            </p>

            <div className="flex items-center gap-3" role="list" aria-label="Social links">
              {SOCIAL.map(({ href, label, Icon }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${label} page`}
                  className="inline-flex items-center justify-center w-10 h-10 text-gray-700 hover:text-indigo-600 transition"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleThemeToggle}
                aria-pressed={theme === "dark"}
                aria-label="Toggle theme"
                className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-sm text-gray-800 hover:bg-gray-200 transition"
              >
                {theme === "dark" ? <FaMoon /> : theme === "light" ? <FaSun /> : <FaSun />}
                <span className="text-xs">
                  {theme === "system" ? "System" : theme === "dark" ? "Dark" : "Light"}
                </span>
              </button>

              <a
                href="https://wa.me/12034101665"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 hover:bg-green-100 transition"
              >
                <FaWhatsapp />
                <span className="text-sm">Chat</span>
              </a>
            </div>
          </div>

          {}
          <nav aria-label="Footer links" className="md:col-span-5 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Sitemap</h3>
              <ul className="space-y-2">
                {SITEMAP.map((l, i) => (
                  <li key={i}>
                    <Link
                      to={l.to}
                      className="text-sm text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      {l.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Resources</h3>
              <ul className="space-y-2">
                {RESOURCES.map((r, i) => (
                  <li key={i}>
                    <Link
                      to={r.to}
                      className="text-sm text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      {r.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-2">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact</h3>
              <address className="not-italic space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="mt-1 text-indigo-600" aria-hidden="true" />
                  <a
                    href="https://maps.google.com/?q=515 Centerpoint Drive, Suite 904, Middletown, CT 06457"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600"
                  >
                    515 Centerpoint Drive, Suite 904, Middletown, CT 06457
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <FaEnvelope className="mt-1 text-indigo-600" aria-hidden="true" />
                  <a href="mailto:careteam@pragma.health" className="hover:text-indigo-600">
                    careteam@pragma.health
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <FaPhoneAlt className="mt-1 text-indigo-600" aria-hidden="true" />
                  <a href="tel:+12034101665" className="hover:text-indigo-600">
                    +1 203-410-1665
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <FaClock className="mt-1 text-indigo-600" aria-hidden="true" />
                  <span>Mon - Fri: 9:00 AM — 6:00 PM (EST)</span>
                </div>
              </address>
            </div>
          </nav>

          {}
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Stay informed</h3>
            <p className="text-sm text-gray-700 mb-4">
              Join our newsletter for product updates, new features, and health tips.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-3" aria-live="polite">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>

              <div className="flex gap-2">
                <input
                  id="footer-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  aria-invalid={statusMessage && !subscribed}
                  aria-describedby="footer-subscribe-status"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || subscribed}
                  className="inline-flex items-center gap-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-60"
                  aria-label="Subscribe to newsletter"
                >
                  {isSubmitting ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <span>Subscribe</span>
                  )}
                </button>
              </div>

              <div
                id="footer-subscribe-status"
                ref={statusRef}
                tabIndex={-1}
                className="text-sm mt-1 min-h-[1.25rem] text-gray-700"
              >
                {statusMessage && (
                  <span className={subscribed ? "text-green-600" : "text-rose-600"}>
                    {statusMessage}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-2">
                We respect your privacy. Unsubscribe anytime. By subscribing you agree to our{" "}
                <Link to="/privacy-policy" className="underline hover:text-indigo-600">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </div>
        </div>

        {}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-700">
          <p>
            © {new Date().getFullYear()} <span className="font-semibold text-black">Pragma Health LLC</span>. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-indigo-600">Terms</Link>
            <Link to="/privacy-policy" className="hover:text-indigo-600">Privacy</Link>
            <Link to="/sitemap.xml" className="hover:text-indigo-600">Sitemap</Link>
          </div>
        </div>
      </div>

      {}
      {showTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed right-6 bottom-6 z-50 inline-flex items-center justify-center w-12 h-12 bg-black text-white shadow hover:scale-105 focus:outline-none"
        >
          <FaArrowUp />
        </button>
      )}
    </footer>
  );
};

export default memo(Footer);