import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  FaStar,
  FaMapMarkerAlt,
  FaUserCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import axios from "axios";

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const cls =
      rating >= i
        ? "text-yellow-400"
        : rating >= i - 0.5
        ? "text-yellow-300"
        : "text-gray-300";
    stars.push(<FaStar key={i} className={`inline-block mr-0.5 ${cls}`} aria-hidden="true" />);
  }
  return <span className="flex items-center" aria-hidden>{stars}</span>;
};

const LabCardSkeleton = () => (
  <div className="min-w-[320px] max-w-[360px] h-64 flex-shrink-0 border border-gray-100 bg-white p-6">
    <div className="animate-pulse flex flex-col h-full">
      <div className="flex gap-4 mb-4">
        <div className="w-20 h-20 bg-gray-200" />
        <div className="flex-1 space-y-3 py-1">
          <div className="h-4 bg-gray-200 w-3/4" />
          <div className="h-3 bg-gray-200 w-1/2" />
          <div className="h-3 bg-gray-200 w-1/4" />
        </div>
      </div>
      <div className="flex-1 space-y-3">
        <div className="h-12 bg-gray-200" />
        <div className="h-12 bg-gray-200" />
      </div>
      <div className="mt-4 h-8 bg-gray-200 w-1/3" />
    </div>
  </div>
);

const LabCard = ({ lab }) => {
  return (
    <article
      tabIndex={0}
      role="group"
      aria-label={`${lab.name} review card`}
      className="min-w-[320px] max-w-[420px] h-64 flex-shrink-0 border border-gray-100 bg-white p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex h-full">
        {}
        <div className="w-1/3 flex items-center justify-center border-r border-gray-100 pr-4">
          <img
            src={lab.image || "/default-lab.jpg"}
            alt={lab.name}
            loading="lazy"
            className="max-h-28 max-w-full object-contain"
            onError={(e) => (e.target.src = "/default-lab.jpg")}
          />
        </div>

        {}
        <div className="w-2/3 pl-4 flex flex-col">
          <div>
            <h3 className="text-lg font-semibold text-black leading-tight">{lab.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <FaMapMarkerAlt className="text-indigo-600" />
              <span className="truncate">{lab.location || lab.address || "Location not specified"}</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              {renderStars(lab.rating || 0)}
              <span className="ml-1 text-indigo-600 font-semibold">{lab.rating ? lab.rating.toFixed(1) : "New"}</span>
              <span className="text-xs text-gray-500 ml-2">({lab.ratingCount || (lab.reviews && lab.reviews.length) || 0} reviews)</span>
            </div>
          </div>

          <div className="flex-1 mt-3 overflow-hidden">
            {lab.reviews && lab.reviews.length > 0 ? (
              lab.reviews.slice(0, 2).map((rev) => (
                <div key={rev._id} className="mb-3 p-3 border border-gray-50 bg-gray-50 text-sm">
                  <div className="flex items-center gap-3 mb-1">
                    {rev.user?.image ? (
                      <img src={rev.user.image} alt={`${rev.user.firstName} avatar`} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <FaUserCircle className="w-8 h-8 text-indigo-200" />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">
                        {rev.user?.firstName} {rev.user?.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{new Date(rev.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
                      {renderStars(rev.rating)}
                      <span>{rev.rating}/5</span>
                    </div>
                  </div>

                  <p className="text-gray-700 italic">“{rev.comment}”</p>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-400 italic py-6">No reviews yet for this lab.</div>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <a href={`/labs/${lab._id}/details`} className="text-indigo-600 font-medium text-sm hover:underline">View Lab Details</a>
            <a href={`/labs/${lab._id}/details#reviews`} className="text-black font-semibold text-sm hover:underline">View All Reviews</a>
          </div>
        </div>
      </div>
    </article>
  );
};

const LabReviews = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const scrollRef = useRef(null);
  const autoplayRef = useRef(null);

  
  useEffect(() => {
    let mounted = true;
    const fetchLabsAndReviews = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/labs/public");
        const labsData = data.labs || [];

        const reviewsPromises = labsData.map((lab) =>
          axios.get(`/api/labs/${lab._id}/reviews`).then((res) => res.data.reviews || []).catch(() => [])
        );
        const allReviews = await Promise.all(reviewsPromises);

        const labsWithReviews = labsData.map((lab, idx) => ({
          ...lab,
          reviews: allReviews[idx] || [],
          rating: lab.rating ?? (allReviews[idx] ? (allReviews[idx].reduce((s, r) => s + (r.rating || 0), 0) / Math.max(1, allReviews[idx].length)) : 0),
          ratingCount: lab.ratingCount ?? (allReviews[idx] ? allReviews[idx].length : 0),
        }));

        if (mounted) setLabs(labsWithReviews);
      } catch (err) {
        console.error("Failed to fetch labs or reviews", err);
        if (mounted) setLabs([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchLabsAndReviews();
    return () => { mounted = false; };
  }, []);

  
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const step = () => {
      if (!autoPlay) return;
      if (!el) return;
      
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 1, behavior: "smooth" });
      }
    };

    autoplayRef.current = setInterval(step, 30); 
    return () => clearInterval(autoplayRef.current);
  }, [autoPlay, labs.length]);

  
  const scrollBy = useCallback((direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, clientWidth } = el;
    const scrollAmount = Math.round(clientWidth * 0.8);
    el.scrollTo({
      left: direction === "left" ? Math.max(0, scrollLeft - scrollAmount) : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  }, []);

  
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onEnter = () => setAutoPlay(false);
    const onLeave = () => setAutoPlay(true);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-white text-black min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-t-4 border-indigo-600 rounded-full animate-spin" />
          <div className="text-black">Loading lab reviews…</div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white text-black py-12">
      {}
      <div className="w-full max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-black">Lab Reviews & Ratings</h2>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Real feedback from users for every lab on our platform.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/our-partners"
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-semibold"
            >
              View All Lab Reviews
            </a>

            <button
              onClick={() => setAutoPlay((v) => !v)}
              className="px-3 py-2 border border-gray-200 text-gray-700"
              aria-pressed={!autoPlay}
            >
              {autoPlay ? "Pause" : "Resume"}
            </button>
          </div>
        </div>

        {}
        <div className="relative">
          <button
            onClick={() => scrollBy("left")}
            aria-label="Scroll left"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 items-center justify-center h-12 w-12 border border-gray-200 bg-white text-black"
          >
            <FaChevronLeft />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto no-scrollbar py-2"
            style={{ scrollBehavior: "smooth" }}
            tabIndex={0}
            aria-label="Labs carousel, swipe to scroll"
          >
            {labs.length === 0 ? (
              <div className="text-gray-500 p-4">No labs available</div>
            ) : (
              
              labs.map((lab) => <LabCard key={lab._id} lab={lab} />)
            )}
          </div>

          <button
            onClick={() => scrollBy("right")}
            aria-label="Scroll right"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 items-center justify-center h-12 w-12 border border-gray-200 bg-white text-black"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default LabReviews;