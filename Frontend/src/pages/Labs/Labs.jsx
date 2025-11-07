import { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaSearch,
  FaFilter,
  FaMapMarkerAlt,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaClock,
  FaPhone,
  FaCalendarAlt,
  FaHeart,
  FaChevronDown,
  FaUndo
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";


function classNames(...parts) {
  return parts.filter(Boolean).join(" ");
}

function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}



function RatingStars({ rating, size = 14 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-yellow-400" style={{ width: size, height: size }} />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" style={{ width: size, height: size }} />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400" style={{ width: size, height: size }} />);
    }
  }
  return <span className="flex items-center gap-0.5" aria-hidden>{stars}</span>;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-9 bg-gray-200 rounded mt-2" />
      </div>
    </div>
  );
}



export default function Labs() {
  const [labs, setLabs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebouncedValue(searchQuery, 300);
  const [sortOption, setSortOption] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const controller = new AbortController();

    async function fetchLabs() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/labs/public", {
          signal: controller.signal,
        });
        
        if (!mountedRef.current) return;
        setLabs(Array.isArray(res.data?.labs) ? res.data.labs : []);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("Failed to fetch labs:", err);
        if (!mountedRef.current) return;
        setError("Unable to load labs. Please try again.");
      } finally {
        if (!mountedRef.current) return;
        setIsLoading(false);
      }
    }

    fetchLabs();
    return () => {
      mountedRef.current = false;
      controller.abort();
    };
  }, []);

  
  const filteredLabs = useMemo(() => {
    const q = (debouncedQuery || "").trim().toLowerCase();

    let out = labs.filter((lab) => {
      if (certifiedOnly && !lab.isCertified) return false;
      if ((lab.rating || 0) < minRating) return false;

      if (!q) return true;

      // Search across multiple fields: name, location, description, specialties, tests
      const haystack = [
        lab.name,
        lab.location,
        lab.description,
        Array.isArray(lab.specialties) ? lab.specialties.join(" ") : "",
        Array.isArray(lab.tests) ? lab.tests.join(" ") : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });

    // Sorting
    if (sortOption === "rating") {
      out = out.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortOption === "price_low") {
      out = out.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === "price_high") {
      out = out.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOption === "nearest") {
      
      
      out = out.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }

    return out;
  }, [labs, debouncedQuery, sortOption, minRating, certifiedOnly]);

  const retry = () => {
    setIsLoading(true);
    setError(null);
    
    
    axios
      .get("/api/labs/public")
      .then((res) => setLabs(Array.isArray(res.data?.labs) ? res.data.labs : []))
      .catch((err) => {
        console.error(err);
        setError("Retry failed. Please check your connection.");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {}
      <header className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl shadow-lg px-8 py-10 mb-8 border border-gray-200 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
          Find Premium Diagnostic Labs
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover accredited labs with modern equipment, fast turnaround, and verified patient reviews.
        </p>
      </header>

      {}
      <section className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="relative flex-1">
          <label htmlFor="lab-search" className="sr-only">Search labs</label>
          <input
            id="lab-search"
            type="search"
            inputMode="search"
            placeholder="Search labs by name, location, test, or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 md:px-5 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search labs"
          />
          <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowFilters((s) => !s)}
            aria-expanded={showFilters}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-300 hover:shadow transition"
          >
            <FaFilter className="text-gray-600" />
            <span className="hidden md:inline">Filters</span>
            <FaChevronDown className={classNames("transition-transform", showFilters ? "rotate-180" : "")} />
          </button>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-300">
            <select
              aria-label="Sort labs"
              className="bg-transparent text-gray-700 focus:outline-none"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort: Recommended</option>
              <option value="rating">Highest rating</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="nearest">Nearest</option>
            </select>
          </div>
        </div>
      </section>

      {}
      {showFilters && (
        <section className="mb-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-700 font-medium">Min rating</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.5}
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  aria-label="Minimum rating"
                />
                <span className="text-sm text-gray-600">{minRating.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-700 font-medium">Certified</label>
              <input
                type="checkbox"
                checked={certifiedOnly}
                onChange={(e) => setCertifiedOnly(e.target.checked)}
                aria-label="Certified labs only"
                className="h-4 w-4"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSortOption("");
                  setMinRating(0);
                  setCertifiedOnly(false);
                }}
                className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
              >
                <FaUndo /> Reset
              </button>
            </div>
          </div>
        </section>
      )}

      {}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center justify-between">
          <div>{error}</div>
          <div className="flex items-center gap-2">
            <button onClick={retry} className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm">Retry</button>
          </div>
        </div>
      )}

      {}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <main>
          {filteredLabs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 mb-4">No labs match your search or filter criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSortOption("");
                  setMinRating(0);
                  setCertifiedOnly(false);
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLabs.map((lab) => (
                <LabCard key={lab._id || lab.id} lab={lab} />
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}



function LabCard({ lab }) {
  const [expanded, setExpanded] = useState(false);
  const {
    _id,
    id,
    name,
    location,
    rating,
    image,
    description,
    hours,
    phone,
    sameDayResults,
    specialties,
    distance,
    price,
    isCertified,
  } = lab;

  const labId = _id || id;

  
  const shortDesc = description || "Premium diagnostic lab with advanced testing facilities and trusted reporting.";
  const specialtiesList = Array.isArray(specialties) ? specialties : specialties ? [specialties] : [];

  return (
    <article className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col h-full border">
      <div className="relative">
        <img
          src={image || "/default-lab.jpg"}
          alt={name}
          className="w-full h-44 object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/default-lab.jpg";
          }}
        />
        {isCertified && (
          <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Certified
          </span>
        )}
        {typeof price !== "undefined" && (
          <span className="absolute top-3 right-3 bg-white/90 text-sm text-gray-800 font-medium px-2.5 py-1 rounded-md">
            from ${Number(price).toFixed(0)}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
            <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <FaMapMarkerAlt className="text-primary" aria-hidden />
              <span className="truncate">{location || "Address not available"}</span>
            </div>
          </div>

          <div className="ml-2 flex flex-col items-end">
            <div className="inline-flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-full">
              <span className="text-sm font-semibold text-gray-800">{rating ? rating.toFixed(1) : "New"}</span>
              {rating ? <RatingStars rating={rating} size={12} /> : <span className="text-xs text-gray-400">—</span>}
            </div>
            <button
              aria-label="Save lab"
              title="Save lab"
              className="mt-2 text-red-500 hover:text-red-600"
            >
              <FaHeart />
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-3 line-clamp-2">{shortDesc}</p>

        <div className="flex gap-3 mt-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FaClock className="text-primary" />
            <span>{hours || "24/7"}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaPhone className="text-primary" />
            <a href={phone ? `tel:${phone}` : "#"} className="text-gray-700 hover:underline">
              {phone || "Contact"}
            </a>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 text-sm text-gray-600 space-y-2">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-primary" />
              <span>Same day results: <strong className="ml-1 text-gray-800">{sameDayResults ? "Yes" : "No"}</strong></span>
            </div>

            <div className="flex flex-wrap gap-2">
              {specialtiesList.length > 0 ? (
                specialtiesList.slice(0, 6).map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{s}</span>
                ))
              ) : (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">General</span>
              )}
            </div>

            {typeof distance === "number" && (
              <div className="text-sm text-gray-700">
                <span className="mr-1">📍</span>
                <span>{distance.toFixed(1)} km away</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-auto pt-4">
          <div className="flex gap-3">
            <Link
              to={`/labs/${labId}/testpackage`}
              className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
              aria-label={`View tests and packages for ${name}`}
            >
              View Tests & Packages
            </Link>

            <Link
              to={`/labs/${labId}/details`}
              className="flex-1 text-center border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition"
              aria-label={`View details for ${name}`}
            >
              Lab Details
            </Link>
          </div>

          <button
            onClick={() => setExpanded((s) => !s)}
            className="w-full mt-3 flex items-center justify-center gap-2 text-sm text-blue-600 hover:underline"
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : "View more details"}
            <IoIosArrowForward className={classNames("transition-transform", expanded ? "rotate-90" : "")} />
          </button>
        </div>
      </div>
    </article>
  );
}