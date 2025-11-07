import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  useMemo,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaSignInAlt,
  FaSignOutAlt,
  FaShoppingCart,
  FaChartLine,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaSearch,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/AuthSlice";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png";
import Topbar from "../Layouts/Topbar";


const SUGGESTIONS = [
  
  'CBC',
  'Diabetes',
  'Lipid Profile',
  'Heart Health',
  'Thyroid',
  "Women's Health",
  'Senior Care',
  'Child Health',
  'Vitamin D',
  'Kidney Function',
];

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const totalQuantity = useSelector((s) => s.cart.totalQuantity);
  const role = user?.role?.toLowerCase?.();
  const isMinimal = ["superadmin", "labadmin"].includes(role);

  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [dimPreview, setDimPreview] = useState(false);

  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  // Refs
  const profileRef = useRef(null);
  const exploreRef = useRef(null);
  const exploreButtonRef = useRef(null);
  const exploreMenuRef = useRef(null);
  const mobilePanelRef = useRef(null);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Prefers reduced motion
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ph_search_history_v1");
      if (raw) setSearchHistory(JSON.parse(raw));
    } catch {
      localStorage.removeItem("ph_search_history_v1");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("ph_search_history_v1", JSON.stringify(searchHistory));
    } catch {}
  }, [searchHistory]);

  
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (exploreRef.current && !exploreRef.current.contains(e.target)) {
        setIsExploreOpen(false);
      }
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        searchRef.current !== e.target
      ) {
        setShowSuggestions(false);
        setHighlightIndex(-1);
      }
      if (isMobileOpen && mobilePanelRef.current && !mobilePanelRef.current.contains(e.target)) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("pointerdown", handler, { passive: true });
    return () => document.removeEventListener("pointerdown", handler);
  }, [isMobileOpen]);

  
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsProfileOpen(false);
        setIsExploreOpen(false);
        setIsMobileOpen(false);
        setShowSuggestions(false);
        setHighlightIndex(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  
  const debounce = useCallback((fn, wait = 250) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }, []);

  
  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
      console.error(err);
    }
  }, [dispatch, navigate]);

  
  const updateHistoryAndNavigate = useCallback(
    (q) => {
      if (!q) return;
      const normalized = q.trim();
      setSearchHistory((prev) => {
        const next = [normalized, ...prev.filter((x) => x !== normalized)].slice(0, 8);
        try {
          localStorage.setItem("ph_search_history_v1", JSON.stringify(next));
        } catch {}
        return next;
      });
      navigate(`/search?q=${encodeURIComponent(normalized)}`);
      setShowSuggestions(false);
      setHighlightIndex(-1);
    },
    [navigate]
  );

  
  const debouncedNavigate = useMemo(() => debounce(updateHistoryAndNavigate, 220), [debounce, updateHistoryAndNavigate]);

  const handleSubmitSearch = useCallback(
    (e) => {
      e?.preventDefault?.();
      if (searchQuery.trim()) updateHistoryAndNavigate(searchQuery);
    },
    [searchQuery, updateHistoryAndNavigate]
  );

  
  const handleQuickPick = useCallback(
    (value) => {
      setSearchQuery(value);
      updateHistoryAndNavigate(value);
    },
    [updateHistoryAndNavigate]
  );

  
  const onSuggestionsKey = useCallback(
    (e) => {
      const visible = filteredSuggestions.concat(searchHistory || []);
      if (!visible.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((i) => Math.min(i + 1, visible.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        if (highlightIndex >= 0) {
          const val = visible[highlightIndex];
          handleQuickPick(val);
        } else {
          handleSubmitSearch();
        }
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
        setHighlightIndex(-1);
      }
    },
    [handleQuickPick, handleSubmitSearch, highlightIndex, searchHistory]
  );

  
  const filteredSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return SUGGESTIONS.slice(0, 6);
    return SUGGESTIONS.filter((s) => s.toLowerCase().includes(q)).slice(0, 6);
  }, [searchQuery]);

  
  const toggleProfile = useCallback((e) => {
    e?.stopPropagation?.();
    setIsProfileOpen((s) => !s);
    setIsExploreOpen(false);
  }, []);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((v) => !v);
  }, []);

  
  useEffect(() => {
    if (!isMobileOpen) return;
    const first = mobilePanelRef.current?.querySelector("a,button,input");
    first?.focus?.();
  }, [isMobileOpen]);

  
  const userInitial = useMemo(() => {
    if (!user) return "";
    return (user.firstName?.[0] || user.email?.[0] || "U").toUpperCase();
  }, [user]);

  
  const hoverDelayOpenRef = useRef(null);
  const hoverDelayCloseRef = useRef(null);

  
  const isPointerCoarse = typeof window !== "undefined" && !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);

  const openExplore = useCallback(() => {
    clearTimeout(hoverDelayCloseRef.current);
    
    hoverDelayOpenRef.current = setTimeout(() => {
      setIsExploreOpen(true);
    }, 80);
  }, []);

  const closeExplore = useCallback(() => {
    clearTimeout(hoverDelayOpenRef.current);
    
    hoverDelayCloseRef.current = setTimeout(() => {
      setIsExploreOpen(false);
    }, 180);
  }, []);

  
  useEffect(() => {
    return () => {
      clearTimeout(hoverDelayOpenRef.current);
      clearTimeout(hoverDelayCloseRef.current);
    };
  }, []);

  
  const onExploreFocus = useCallback(() => {
    setIsExploreOpen(true);
    clearTimeout(hoverDelayCloseRef.current);
  }, []);

  
  const onExploreClick = useCallback(
    (e) => {
      
      if (isPointerCoarse) {
        e?.stopPropagation?.();
        setIsExploreOpen((s) => !s);
      }
    },
    [isPointerCoarse]
  );

  
  useEffect(() => {
    const handler = (e) => {
      if (!exploreRef.current) return;
      const target = e.relatedTarget;
      if (!target) return;
      if (!exploreRef.current.contains(target)) {
        
        setIsExploreOpen(false);
      }
    };
    const btn = exploreButtonRef.current;
    if (btn) {
      btn.addEventListener("focusout", handler);
    }
    return () => {
      if (btn) btn.removeEventListener("focusout", handler);
    };
  }, []);

  
  return (
    <>
      {}
      {dimPreview && (
        <div
          className="fixed inset-0 bg-black/30 z-40 pointer-events-none transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {!isMinimal && <Topbar />}

      <header
        role="banner"
        className={`sticky top-0 z-50 backdrop-blur-md transition-shadow duration-300 ${
          dimPreview ? "bg-white/70 border-b border-gray-100" : "bg-white/90 border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-20">
            {}
            <div className="flex items-center gap-3 shrink-0">
              <Link to="/" className="flex items-center gap-3 group" aria-label="Pragma Health home">
                <img
                  src={logo}
                  alt="Pragma Health"
                  className="h-11 w-11 rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="hidden sm:block">
                  <div
                className="text-lg font-bold leading-6 bg-clip-text text-transparent"
                style={{
               backgroundImage: "linear-gradient(90deg, #3498db, #7c52eeff)",}}
               >
               PRAGMA HEALTH LLC
              </div>

              <div className="text-xs text-gray-500 -mt-0.5">AI · Diagnostics · Labs</div>
                </div>
              </Link>
            </div>

            {}
            {!isMinimal && (
              <div className="hidden md:flex items-center flex-1 gap-8 justify-center">
                {}
                <nav aria-label="Primary" className="flex items-center gap-6">
                  <div
                    ref={exploreRef}
                    className="relative"
                    
                    onMouseEnter={() => {
                      
                      if (!isPointerCoarse) openExplore();
                    }}
                    onMouseLeave={() => {
                      if (!isPointerCoarse) closeExplore();
                    }}
                  >
                    <button
                      ref={exploreButtonRef}
                      onClick={onExploreClick} 
                      onFocus={onExploreFocus}
                      aria-expanded={isExploreOpen}
                      aria-haspopup="menu"
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 rounded px-2 py-1"
                    >
                      Explore <FaChevronDown className={`transition-transform ${isExploreOpen && !prefersReducedMotion ? "rotate-180" : ""}`} />
                    </button>

                    {isExploreOpen && (
                      <div
                        ref={exploreMenuRef}
                        role="menu"
                        aria-label="Explore menu"
                        className="absolute mt-2 left-0 w-56 bg-white shadow-lg rounded border ring-1 ring-black/5 z-50"
                        
                        onMouseEnter={() => {
                          if (!isPointerCoarse) openExplore();
                        }}
                        onMouseLeave={() => {
                          if (!isPointerCoarse) closeExplore();
                        }}
                      >
                        <Link to="/labs" role="menuitem" className="block px-4 py-2 hover:bg-gray-50" onClick={() => setIsExploreOpen(false)}>
                          All Labs
                        </Link>
                        <Link to="/all-tests-packages" role="menuitem" className="block px-4 py-2 hover:bg-gray-50" onClick={() => setIsExploreOpen(false)}>
                          Tests & Packages
                        </Link>
                        {}
                      </div>
                    )}
                  </div>

                  <Link to="/ai-recommendations-test" className="text-sm text-gray-700 hover:text-primary">
                   Recommendation
                  </Link>
                </nav>

                {}
                <form onSubmit={handleSubmitSearch} className="relative w-[420px]" role="search" aria-label="Header search">
                  <label htmlFor="header-search" className="sr-only">
                    Search tests and labs
                  </label>
                  <div className="relative">
                    <input
                      id="header-search"
                      ref={searchRef}
                      type="search"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                        setHighlightIndex(-1);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onKeyDown={onSuggestionsKey}
                      placeholder="Search tests, packages or labs..."
                      className="w-full pl-4 pr-10 py-2 full border border-gray-200 text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none"
                      autoComplete="off"
                      aria-autocomplete="list"
                      aria-controls="header-suggestions"
                    />
                    <button type="submit" aria-label="Search" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaSearch />
                    </button>
                  </div>

                  {}
                  {showSuggestions && (filteredSuggestions.length || searchHistory.length) && (
                    <div
                      ref={suggestionsRef}
                      id="header-suggestions"
                      role="listbox"
                      aria-label="Search suggestions"
                      className="absolute left-0 right-0 mt-2 bg-white border shadow-lg rounded-lg p-3 z-50"
                      style={{ maxHeight: 320, overflow: "auto" }}
                    >
                      {searchHistory.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs text-gray-400 mb-2 flex items-center justify-between">
                            <span>Recent</span>
                            <button
                              className="text-xs text-gray-500 hover:text-gray-700"
                              onClick={() => {
                                setSearchHistory([]);
                                localStorage.removeItem("ph_search_history_v1");
                              }}
                              type="button"
                            >
                              Clear
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {searchHistory.map((h, idx) => (
                              <button
                                key={`${h}-${idx}`}
                                type="button"
                                onMouseDown={() => handleQuickPick(h)}
                                className={`px-3 py-1 rounded-md text-xs border ${highlightIndex === idx ? "bg-primary/10 border-primary text-primary" : "bg-gray-100 border-gray-200 text-gray-700"}`}
                              >
                                {h}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {filteredSuggestions.length > 0 && (
                        <div>
                          <div className="text-xs text-gray-400 mb-2">Suggestions</div>
                          <div className="flex flex-wrap gap-2">
                            {filteredSuggestions.map((s, idx) => {
                              const globalIndex = (searchHistory?.length || 0) + idx;
                              return (
                                <button
                                  key={`${s}-${idx}`}
                                  type="button"
                                  onMouseDown={() => handleQuickPick(s)}
                                  className={`px-3 py-1 rounded-md text-xs border ${highlightIndex === globalIndex ? "bg-primary/10 border-primary text-primary" : "bg-blue-50 border-blue-100 text-blue-700"}`}
                                >
                                  {s}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </form>
              </div>
            )}

            {}
            <div className="ml-auto flex items-center gap-3">
              {}
              <button
                title="Toggle preview"
                onClick={() => setDimPreview((v) => !v)}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 transition"
                aria-pressed={dimPreview}
              >
                {dimPreview ? <FaSun /> : <FaMoon />} <span className="text-xs">{dimPreview ? "Light" : "Dim"}</span>
              </button>

              {!user ? (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-sky-500 text-white px-4 py-2 full text-sm font-semibold shadow hover:scale-[1.02] transition"
                >
                  <FaSignInAlt /> Sign Up 
                </Link>
              ) : (
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setIsProfileOpen((s) => !s)}
                    className="inline-flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-50 focus:outline-none"
                    aria-haspopup="menu"
                    aria-expanded={isProfileOpen}
                  >
                    {user.image ? (
                      <img src={user.image} alt={`${user.firstName} avatar`} className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold">{userInitial}</div>
                    )}
                    <span className="hidden sm:inline text-sm">{user.firstName}</span>
                  </button>

                  {isProfileOpen && (
                    <div role="menu" aria-label="User menu" className="absolute right-0 mt-2 w-48 bg-white border shadow rounded-md z-50">
                      <Link to="/user" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50" role="menuitem" onClick={() => setIsProfileOpen(false)}>
                        <FaChartLine /> Dashboard
                      </Link>
                      <button onClick={() => { setIsProfileOpen(false); logout(); }} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50" role="menuitem">
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {}
              {!isMinimal && (
                <Link to="/user/cart" aria-label="Cart" className="relative text-gray-700 hover:text-primary">
                  <FaShoppingCart size={20} />
                  {totalQuantity > 0 && <span className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5 bg-red-600 text-white rounded-full">{totalQuantity}</span>}
                </Link>
              )}

              {}
              <button
                onClick={toggleMobile}
                aria-label={isMobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileOpen}
                className="md:hidden inline-flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {isMobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
              </button>
            </div>
          </div>
        </div>

        {}
        <div
          className={`md:hidden transform transition-all duration-300 ${isMobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}
        >
          <div ref={mobilePanelRef} className="bg-white border-t shadow-inner">
            <div className="px-4 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="logo" className="h-10 w-10 rounded" />
                  <div>
                    <div className="font-semibold">PRAGMA HEALTH LLC</div>
                    <div className="text-xs text-gray-500">Labs · Diagnostics</div>
                  </div>
                </div>
                <button onClick={() => setIsMobileOpen(false)} className="p-2 rounded focus:outline-none">
                  <FaTimes />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {!isMinimal && (
                  <>
                    <Link to="/labs" className="px-3 py-2 rounded hover:bg-gray-50" onClick={() => setIsMobileOpen(false)}>All Labs</Link>
                    <Link to="/all-tests-packages" className="px-3 py-2 rounded hover:bg-gray-50" onClick={() => setIsMobileOpen(false)}>Tests & Packages</Link>
                    <Link to="/ai-recommendations-test" className="px-3 py-2 rounded hover:bg-gray-50" onClick={() => setIsMobileOpen(false)}>AI Recommendation</Link>
                  </>
                )}

                {user ? (
                  <>
                    <Link to="/user" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50" onClick={() => setIsMobileOpen(false)}>Dashboard</Link>
                    <button className="text-left px-3 py-2 w-full text-red-600" onClick={() => { logout(); setIsMobileOpen(false); }}>Logout</button>
                  </>
                ) : (
                  <Link to="/login" className="block text-center bg-primary text-white px-4 py-2 rounded" onClick={() => setIsMobileOpen(false)}>Login / Register</Link>
                )}
              </nav>

              {}
              <div className="pt-3">
                <form onSubmit={(e) => { e.preventDefault(); updateHistoryAndNavigate(searchQuery); setIsMobileOpen(false); }}>
                  <label htmlFor="mobile-search" className="sr-only">Search</label>
                  <div className="relative">
                    <input id="mobile-search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search tests, packages or labs..." className="w-full border rounded-full px-4 py-2 text-sm" />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"><FaSearch /></button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default memo(Header);