import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  FaStar,
  FaMapMarkerAlt,
  FaFilter,
  FaEye,
  FaChevronUp,
  FaTimes,
} from "react-icons/fa";
import { addItem } from "../../redux/CartSlice";

function useDebounced(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const currency = (value) =>
  typeof value === "number"
    ? `PKR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : value || "PKR 0";



function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="h-6 bg-gray-200" />
      <div className="p-4">
        <div className="h-4 bg-gray-200 mt-3 w-3/4" />
        <div className="h-3 bg-gray-200 mt-2 w-1/2" />
        <div className="h-8 bg-gray-200 mt-4 w-full rounded" />
      </div>
    </div>
  );
}

function ViewsIndicator({ count = 0 }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <FaEye aria-hidden />
      <span>{count}</span>
    </div>
  );
}



const ITEMS_PER_LOAD = 9;

const AllTests = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items || []);

  const [tests, setTests] = useState([]);
  const [labsMap, setLabsMap] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounced(searchQuery, 300);
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    lab: "",
    type: "",
    sort: "popular",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [addingItemId, setAddingItemId] = useState(null);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_LOAD);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const controller = new AbortController();

    async function loadAll() {
      setIsLoading(true);
      setFetchError(null);
      try {
        const [testsRes, packagesRes, labsRes] = await Promise.allSettled([
          axios.get("/api/tests/public-tests", { signal: controller.signal }),
          axios.get("/api/tests/public-packages", { signal: controller.signal }),
          axios.get("/api/labs/get-all", { signal: controller.signal }),
        ]);

        
        if (testsRes.status === "fulfilled") {
          const payload = testsRes.value.data;
          if (payload?.success) {
            setTests((prev) => [...prev, ...(payload.tests || [])]);
          } else {
            console.warn("Tests fetch responded with failure", payload);
          }
        } else {
          console.warn("Tests fetch failed", testsRes.reason);
        }

        
        if (packagesRes.status === "fulfilled") {
          const payload = packagesRes.value.data;
          if (payload?.success) {
            const packageData = (payload.packages || []).map((pkg) => ({
              ...pkg,
              type: "Package",
              lab: pkg.lab?._id || pkg.lab,
            }));
            setTests((prev) => [...prev, ...packageData]);
          } else {
            console.warn("Packages fetch responded with failure", payload);
          }
        } else {
          console.warn("Packages fetch failed", packagesRes.reason);
        }

        
        if (labsRes.status === "fulfilled") {
          const payload = labsRes.value.data;
          if (payload?.success) {
            const map = {};
            (payload.labs || []).forEach((lab) => {
              map[lab._id] = lab;
            });
            setLabsMap(map);
          } else {
            console.warn("Labs fetch responded with failure", payload);
          }
        } else {
          console.warn("Labs fetch failed", labsRes.reason);
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Unexpected load error:", err);
          if (mountedRef.current) setFetchError("Unable to load data. Please try again.");
        }
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    }

    loadAll();

    return () => {
      mountedRef.current = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    
    setDisplayCount(ITEMS_PER_LOAD);
  }, [debouncedSearch, filters.lab, filters.type, filters.priceRange, filters.sort]);

  
  const uniqueLabs = useMemo(
    () =>
      Object.values(labsMap).filter(
        (lab, i, arr) => arr.findIndex((l) => l._id === lab._id) === i
      ),
    [labsMap]
  );

  
  const getFinalPrice = (t) => {
    const price = Number(t.price || 0);
    const discount = Number(t.discount || 0);
    if (discount > 0 && discount <= 100) {
      return Math.round(price * (1 - discount / 100));
    }
    return price;
  };

  
  const filteredTests = useMemo(() => {
    const q = (debouncedSearch || "").trim().toLowerCase();

    let out = tests.filter((t) => {
      const finalPrice = getFinalPrice(t);
      const inPriceRange =
        finalPrice >= (filters.priceRange?.[0] ?? 0) &&
        finalPrice <= (filters.priceRange?.[1] ?? Number.MAX_SAFE_INTEGER);

      const labId = typeof t.lab === "object" ? t.lab?._id : t.lab;
      const matchesLab = !filters.lab || String(labId) === String(filters.lab);

      const matchesType =
        !filters.type ||
        (filters.type === "Package" ? t.type === "Package" : filters.type === "Test" ? t.type !== "Package" : true);

      const matchesSearch =
        !q ||
        [
          t.name,
          t.description,
          t.type,
          (t.lab && (typeof t.lab === "object" ? t.lab.name : labsMap[t.lab]?.name)) || "",
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);

      return inPriceRange && matchesLab && matchesType && matchesSearch;
    });

    // sorting
    if (filters.sort === "low") {
      out.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
    } else if (filters.sort === "high") {
      out.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
    } else if (filters.sort === "rating") {
      out.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      
      out.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    return out;
  }, [tests, debouncedSearch, filters, labsMap]);

  const visibleTests = filteredTests.slice(0, displayCount);

  

  const handleAddToCart = async (item) => {
    const itemId = item._id || item.id;
    try {
      setAddingItemId(itemId);

      const finalPrice = getFinalPrice(item);
      const existing = cartItems.find((c) => c._id === itemId);
      const quantity = existing ? existing.quantity + 1 : 1;

      const payload = {
        testOrPackageId: itemId,
        type: item.type || "Test",
        name: item.name,
        price: finalPrice,
        labId: item.lab?._id || item.lab || "Unknown",
        quantity,
      };

      const res = await axios.post("/api/cart/add", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });

      if (res.data?.success) {
        const cartItem = {
          _id: res.data.itemId || itemId,
          name: item.name,
          price: finalPrice,
          type: item.type || "Test",
          labId: item.lab?._id || item.lab || "Unknown",
          labName: item.lab?.name || labsMap[item.lab]?.name || "Unknown Lab",
          quantity: 1,
        };
        dispatch(addItem(cartItem));
        toast.success("Added to cart");
      } else {
        toast.error(res.data?.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error("Cart error", err);
      toast.error(err.response?.data?.message || "Unable to add to cart");
    } finally {
      setAddingItemId(null);
    }
  };

  

  useEffect(() => {
    if (!selectedItem) return;

    const onKey = (e) => {
      if (e.key === "Escape") setSelectedItem(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedItem]);

  

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Medical Tests & Packages</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Compare tests from trusted partner labs with transparent pricing and fast turnaround times.
        </p>
      </div>

      {}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <label htmlFor="test-search" className="sr-only">
              Search tests
            </label>
            <input
              id="test-search"
              type="search"
              placeholder="Search tests (e.g., CBC, Lipid Profile, Full Body)..."
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <button
            onClick={() => setShowFilters((s) => !s)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            aria-expanded={showFilters}
            aria-controls="tests-filters"
          >
            <FaFilter />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div id="tests-filters" className="mt-4 p-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Min Price</label>
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => setFilters((f) => ({ ...f, priceRange: [Number(e.target.value || 0), f.priceRange[1]] }))}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Price</label>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters((f) => ({ ...f, priceRange: [f.priceRange[0], Number(e.target.value || 100000)] }))}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Lab</label>
                <select
                  value={filters.lab}
                  onChange={(e) => setFilters((f) => ({ ...f, lab: e.target.value }))}
                  className="mt-1 p-2 w-full border rounded"
                >
                  <option value="">All Labs</option>
                  {uniqueLabs.map((lab) => (
                    <option key={lab._id} value={lab._id}>
                      {lab.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sort</label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
                  className="mt-1 p-2 w-full border rounded"
                >
                  <option value="popular">Most Popular</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() =>
                  setFilters({ priceRange: [0, 100000], lab: "", type: "", sort: "popular" })
                }
                className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <span className="text-lg font-semibold text-primary mr-2">Total:</span>
          <span className="font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
            {filteredTests.length} {filteredTests.length === 1 ? "Test" : "Tests"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {filteredTests.length > displayCount && (
            <button
              onClick={() => setDisplayCount((c) => Math.min(filteredTests.length, c + ITEMS_PER_LOAD))}
              className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Load more
            </button>
          )}

          {filteredTests.length > ITEMS_PER_LOAD && (
            <button
              onClick={() => setDisplayCount((c) => (c >= filteredTests.length ? ITEMS_PER_LOAD : filteredTests.length))}
              className="px-3 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              {displayCount >= filteredTests.length ? "Show less" : "View all"}
            </button>
          )}
        </div>
      </div>

      {}
      {fetchError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {fetchError}
        </div>
      )}

      {}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tests match your search and filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTests.map((test) => {
            const labObj = typeof test.lab === "object" ? test.lab : labsMap[test.lab];
            const labName = labObj?.name || "Unknown Lab";
            const finalPrice = getFinalPrice(test);
            const hasDiscount = Number(test.discount || 0) > 0;
            const discountLabel = hasDiscount ? `${Number(test.discount)}% OFF` : null;

            return (
              <article key={test._id || test.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full">
                      {test.type || "Test"}
                    </span>
                    <ViewsIndicator count={test.bookedCount || 0} />
                  </div>

                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">{test.name}</h2>
                    <div className="text-sm text-gray-600">
                      <div className="text-right">
                        <div className="text-primary font-semibold">{currency(finalPrice)}</div>
                        {hasDiscount && (
                          <div className="text-xs text-gray-500 line-through">{currency(Number(test.price || 0))}</div>
                        )}
                        {discountLabel && (
                          <div className="text-xs bg-red-100 text-red-700 inline-block px-2 py-0.5 rounded mt-1">
                            {discountLabel}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
                    <FaMapMarkerAlt />
                    <span className="truncate">{labName}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedItem(test)}
                      className="px-3 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      View details
                    </button>

                    <button
                      onClick={() => handleAddToCart(test)}
                      disabled={addingItemId === (test._id || test.id)}
                      className={`px-3 py-2 rounded-lg transition-colors ${addingItemId === (test._id || test.id)
                        ? "bg-gray-300 text-gray-600"
                        : "bg-primary text-white hover:bg-primary-dark"
                        }`}
                    >
                      {addingItemId === (test._id || test.id) ? "Adding..." : "Add to cart"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedItem.name} details`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={(e) => {
            
            if (e.target === e.currentTarget) setSelectedItem(null);
          }}
        >
          <div className="bg-white rounded-lg max-w-xl w-full p-6 relative shadow-lg">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              aria-label="Close"
            >
              <FaTimes />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedItem.name}</h3>

            <div className="flex items-center gap-4 mb-4">
              <div className="text-lg font-bold text-primary">{currency(getFinalPrice(selectedItem))}</div>
              {Number(selectedItem.discount || 0) > 0 && (
                <div className="text-sm line-through text-gray-500">{currency(Number(selectedItem.price || 0))}</div>
              )}
              {Number(selectedItem.discount || 0) > 0 && (
                <div className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">{selectedItem.discount}% OFF</div>
              )}
            </div>

            {selectedItem.description && (
              <div className="mb-4 text-gray-700">
                <strong className="block mb-1">Description</strong>
                <div>{selectedItem.description}</div>
              </div>
            )}

            {selectedItem.type === "Package" && (selectedItem.includedTests || selectedItem.tests) && (
              <div className="mb-4">
                <strong className="block mb-2">Included Tests</strong>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {(selectedItem.includedTests || selectedItem.tests).map((tst, i) => (
                    <li key={i}>{typeof tst === "string" ? tst : tst.name || tst}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  handleAddToCart(selectedItem);
                  setSelectedItem(null);
                }}
                className="flex-1 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
              >
                Add to cart
              </button>
              <button onClick={() => setSelectedItem(null)} className="flex-1 border px-4 py-2 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      <BackToTop />
    </div>
  );
};



function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 p-3 bg-primary text-white rounded-full shadow-lg hover:scale-105 transition-transform"
      aria-label="Back to top"
    >
      <FaChevronUp />
    </button>
  );
}

export default AllTests;