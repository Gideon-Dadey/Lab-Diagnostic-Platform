import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-hot-toast";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaTag,
  FaPercent,
  FaCheckCircle,
} from "react-icons/fa";



const currency = (value, locale = "en-GB", currencyCode = "USD") =>
  new Intl.NumberFormat(locale, { style: "currency", currency: currencyCode }).format(value || 0);


export default function ConfirmBookingDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [bookingData, setBookingData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bookingData")) || {};
    } catch {
      return {};
    }
  });
  const [submittingDisabled, setSubmittingDisabled] = useState(false);

  const TAX_RATE = 0.05; 
  const VALID_PROMOS = {
    SAVE10: { code: "SAVE10", type: "percent", value: 10, label: "10% off" },
    FLAT50: { code: "FLAT50", type: "flat", value: 50, label: "PKR 50 off" },
  };

  
  
  useEffect(() => {
    if (location.state && location.state.booking) {
      try {
        const navBooking = location.state.booking;
        setBookingData(navBooking);
        localStorage.setItem("bookingData", JSON.stringify(navBooking));
      } catch (err) {
        console.warn("Could not persist navigation booking", err);
      }
    }
  }, [location.state]);

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    async function fetchCart() {
      setLoading(true);
      try {
        if (!token) {
          toast.error("Please log in to review and pay.");
          navigate("/login");
          return;
        }
        
        const res = await fetch("/api/cart", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          
          let fallback = [];
          try { fallback = JSON.parse(localStorage.getItem("cartItems") || "[]"); } catch {}

          
          if (!fallback?.length) {
            try {
              const persisted = JSON.parse(localStorage.getItem("persist:cart") || "{}");
              const itemsStr = persisted.items;
              const persistedItems = itemsStr ? JSON.parse(itemsStr) : [];
              fallback = Array.isArray(persistedItems) ? persistedItems.map((it) => ({
                _id: it._id || it.id,
                name: it.name,
                price: Number(it.price) || 0,
                quantity: Number(it.quantity) || 1,
              })) : [];
            } catch {}
          }

          if (mounted) setCartItems(fallback);
        } else {
          const data = await res.json();
          const items = Array.isArray(data.cartItems) ? data.cartItems : [];
          let normalized = items.map((it) => ({
            _id: it._id || it.id,
            name: it.name,
            price: Number(it.price) || 0,
            quantity: Number(it.quantity) || 1,
          }));

          
          if (!normalized.length) {
            try {
              const local = JSON.parse(localStorage.getItem("cartItems") || "[]");
              if (Array.isArray(local) && local.length) {
                normalized = local.map((it) => ({
                  _id: it._id || it.id,
                  name: it.name,
                  price: Number(it.price) || 0,
                  quantity: Number(it.quantity) || 1,
                }));
              } else {
                const persisted = JSON.parse(localStorage.getItem("persist:cart") || "{}");
                const itemsStr = persisted.items;
                const persistedItems = itemsStr ? JSON.parse(itemsStr) : [];
                if (Array.isArray(persistedItems) && persistedItems.length) {
                  normalized = persistedItems.map((it) => ({
                    _id: it._id || it.id,
                    name: it.name,
                    price: Number(it.price) || 0,
                    quantity: Number(it.quantity) || 1,
                  }));
                }
              }
            } catch {}
          }

          if (mounted) {
            setCartItems(normalized);
            localStorage.setItem("cartItems", JSON.stringify(normalized));
          }
        }
      } catch (err) {
        console.error("Failed to fetch cart", err);
        
        let fallback = [];
        try { fallback = JSON.parse(localStorage.getItem("cartItems") || "[]"); } catch {}
        if (!fallback?.length) {
          try {
            const persisted = JSON.parse(localStorage.getItem("persist:cart") || "{}");
            const itemsStr = persisted.items;
            const persistedItems = itemsStr ? JSON.parse(itemsStr) : [];
            fallback = Array.isArray(persistedItems) ? persistedItems.map((it) => ({
              _id: it._id || it.id,
              name: it.name,
              price: Number(it.price) || 0,
              quantity: Number(it.quantity) || 1,
            })) : [];
          } catch {}
        }
        if (mounted) setCartItems(fallback);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchCart();
    return () => {
      mounted = false;
    };
  }, []);

  
  const subtotal = useMemo(
    () => cartItems.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0),
    [cartItems]
  );

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === "percent") return (appliedPromo.value / 100) * subtotal;
    if (appliedPromo.type === "flat") return appliedPromo.value;
    return 0;
  }, [appliedPromo, subtotal]);

  const tax = useMemo(() => Math.max(0, (subtotal - discount) * TAX_RATE), [subtotal, discount]);
  const total = useMemo(() => Math.max(0, subtotal - discount + tax), [subtotal, discount, tax]);

  
  const updateQuantity = (id, qty) => {
    if (qty < 1) return;
    setCartItems((prev) => {
      const updated = prev.map((it) => (it._id === id ? { ...it, quantity: qty } : it));
      
      localStorage.setItem("cartItems", JSON.stringify(updated));
      return updated;
    });
    
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) return;
    fetch(`/api/cart/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ quantity: qty }),
    }).catch((err) => {
      console.warn("Could not sync qty change", err);
    });
  };

  const removeItem = (id) => {
    const prev = cartItems;
    const updated = cartItems.filter((it) => it._id !== id);
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));

    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      toast.success("Item removed");
      return;
    }

    fetch(`/api/cart/remove/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Delete failed");
        toast.success("Item removed");
      })
      .catch((err) => {
        console.error(err);
        setCartItems(prev);
        localStorage.setItem("cartItems", JSON.stringify(prev));
        toast.error("Could not remove item. Please try again.");
      });
  };

  const applyPromoCode = () => {
    const code = (promo || "").trim().toUpperCase();
    if (!code) {
      toast.error("Enter a promo code");
      return;
    }
    const p = VALID_PROMOS[code];
    if (!p) {
      toast.error("Invalid promo code");
      return;
    }
    setAppliedPromo(p);
    toast.success(`${p.label} applied`);
  };

  const clearPromo = () => {
    setAppliedPromo(null);
    setPromo("");
    toast.success("Promo removed");
  };

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!bookingData || !bookingData.collectionMethod) {
      toast.error("Please select a collection method in the booking form.");
      navigate("/place-order");
      return;
    }

    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      toast.error("You need to log in to proceed with payment.");
      navigate("/login");
      return;
    }

    setIsPaying(true);
    setSubmittingDisabled(true);

    try {
      
      const orderBody = {
        name: bookingData.name,
        email: bookingData.email,
        phoneNumber: bookingData.phoneNumber,
        gender: bookingData.gender,
        age: bookingData.age,
        address: bookingData.address,
        state: bookingData.state,
        country: bookingData.country,
        collectionMethod: bookingData.collectionMethod,
        bookingDate: bookingData.bookingDate,
        bookingTime: bookingData.bookingTime,
        paymentStatus: 'pending',
        
        items: cartItems.map((it) => ({
          name: it.name,
          price: Number(it.price) || 0,
          quantity: Number(it.quantity) || 1,
          type: it.type || 'Package',
          labId: it.labId,
          testOrPackageId: it.testOrPackageId || it._id, 
        })),
      };

      const createOrderRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderBody),
      });

      const orderJson = await createOrderRes.json();
      if (!createOrderRes.ok) {
        throw new Error(orderJson.message || "Failed to create order");
      }
      const orderId = orderJson?.order?._id || orderJson?._id;
      if (!orderId) throw new Error("No order id returned from server");

      
      const sessionRes = await fetch("/api/payment/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookingId: orderId }),
      });

      const sessionJson = await sessionRes.json();
      if (!sessionRes.ok || !sessionJson.id) {
        throw new Error(sessionJson.message || "Failed to create checkout session");
      }

      
      let publishableKey = (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || localStorage.getItem("PUBLIC_STRIPE_KEY") || "").trim();
      if (!publishableKey) {
        try {
          const keyRes = await fetch("/api/payment/public-key");
          const keyJson = await keyRes.json();
          publishableKey = (keyJson.publishableKey || "").trim();
          if (publishableKey) localStorage.setItem("PUBLIC_STRIPE_KEY", publishableKey);
        } catch {}
      }
      if (!publishableKey && typeof window !== 'undefined') {
        const entered = window.prompt("Enter Stripe publishable key (starts with pk_)") || "";
        if (entered && entered.trim().startsWith("pk_")) {
          publishableKey = entered.trim();
          localStorage.setItem("PUBLIC_STRIPE_KEY", publishableKey);
        }
      }
      if (!publishableKey) throw new Error("Stripe publishable key is missing. Set VITE_STRIPE_PUBLISHABLE_KEY.");
      const stripe = await loadStripe(publishableKey);
      if (!stripe) throw new Error("Stripe failed to initialize");
      const result = await stripe.redirectToCheckout({ sessionId: sessionJson.id });
      if (result?.error) {
        console.error(result.error);
        toast.error("Stripe redirect failed. Try again.");
      }
    } catch (err) {
      console.error("Checkout error", err);
      toast.error(err.message || "Payment failed");
      setIsPaying(false);
      setSubmittingDisabled(false);
    }
  };

  
  const safe = (v) => (v || "—");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
          aria-label="Back"
        >
          <FaArrowLeft /> Back
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Review & Pay</h1>
        <div className="ml-auto text-sm text-gray-500">Secure checkout • Encrypted • Clinician-reviewed</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Patient & Booking</h2>
                <p className="text-sm text-gray-500 mt-1">Confirm the details below before proceeding to payment.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/place-order")}
                  className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
                  aria-label="Edit booking"
                >
                  <FaEdit /> Edit
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg bg-indigo-50 p-4">
                <div className="text-xs text-gray-500">Full name</div>
                <div className="font-medium text-gray-800">{safe(bookingData.name)}</div>
              </div>

              <div className="rounded-lg bg-indigo-50 p-4">
                <div className="text-xs text-gray-500">Phone</div>
                <div className="font-medium text-gray-800">{safe(bookingData.phoneNumber)}</div>
              </div>

              <div className="rounded-lg bg-indigo-50 p-4">
                <div className="text-xs text-gray-500">Email</div>
                <div className="font-medium text-gray-800">{safe(bookingData.email)}</div>
              </div>

              <div className="rounded-lg bg-indigo-50 p-4">
                <div className="text-xs text-gray-500">Collection</div>
                <div className="font-medium text-gray-800">{safe(bookingData.collectionMethod)}</div>
              </div>

              <div className="sm:col-span-2 rounded-lg bg-indigo-50 p-4">
                <div className="text-xs text-gray-500">Address</div>
                <div className="font-medium text-gray-800">{safe(bookingData.address)}</div>
              </div>

              <div className="rounded-lg bg-indigo-50 p-4">
                <div className="text-xs text-gray-500">Date</div>
                <div className="font-medium text-gray-800">{safe(bookingData.bookingDate)}</div>
              </div>

              <div className="rounded-lg bg-indigo-50 p-4">
                <div className="text-xs text-gray-500">Time</div>
                <div className="font-medium text-gray-800">{safe(bookingData.bookingTime)}</div>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
              <div className="text-sm text-gray-500">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</div>
            </div>

            {loading ? (
              <div className="mt-4 space-y-3">
                <div className="h-16 rounded-lg bg-gray-100 animate-pulse" />
                <div className="h-16 rounded-lg bg-gray-100 animate-pulse" />
              </div>
            ) : cartItems.length === 0 ? (
              <div className="mt-4 text-gray-500">Your cart is empty. <button onClick={() => navigate("/tests-by-concern")} className="text-indigo-600 hover:underline">Browse tests</button></div>
            ) : (
              <div className="mt-4 space-y-3">
                {cartItems.map((it) => (
                  <div key={it._id} className="flex items-center gap-4 border rounded-lg p-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-900 truncate">{it.name}</div>
                        <div className="text-sm text-gray-600">{currency(it.price)}</div>
                      </div>

                      <div className="mt-2 flex items-center gap-3">
                        <label className="text-xs text-gray-500">Qty</label>
                        <input
                          type="number"
                          min={1}
                          value={it.quantity}
                          onChange={(e) => updateQuantity(it._id, Math.max(1, Number(e.target.value || 1)))}
                          className="w-20 px-2 py-1 rounded border border-gray-200 text-sm"
                          aria-label={`Quantity for ${it.name}`}
                        />

                        <button
                          onClick={() => removeItem(it._id)}
                          className="ml-auto inline-flex items-center gap-2 text-sm text-red-600 hover:underline"
                          aria-label={`Remove ${it.name}`}
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Promo code & notes</h3>
              <div className="text-sm text-gray-500">Save on your booking</div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="sm:col-span-2">
                <div className="relative">
                  <input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="Enter promo code (e.g. SAVE10)"
                    className="w-full px-4 py-2 rounded border border-gray-200"
                    aria-label="Promo code"
                  />
                  <FaTag className="absolute right-3 top-3 text-gray-300" />
                </div>
                {appliedPromo && (
                  <div className="mt-2 text-sm text-green-600 inline-flex items-center gap-2">
                    <FaCheckCircle /> {appliedPromo.label}
                    <button onClick={clearPromo} className="ml-3 text-sm text-gray-500 hover:underline">Remove</button>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button onClick={applyPromoCode} className="inline-flex items-center gap-2 justify-center px-4 py-2 rounded bg-indigo-600 text-white">
                  <FaPercent /> Apply
                </button>

                <button onClick={() => { setPromo(""); setAppliedPromo(null); }} className="px-4 py-2 rounded border border-gray-200">
                  Reset
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-500">Notes for lab / phlebotomist (optional)</label>
              <textarea
                defaultValue={bookingData.notes || ""}
                onBlur={(e) => {
                  // persist notes locally to bookingData
                  const n = e.target.value;
                  const updated = { ...bookingData, notes: n };
                  setBookingData(updated);
                  localStorage.setItem("bookingData", JSON.stringify(updated));
                }}
                placeholder="Any access notes, preferences or medical information"
                className="w-full mt-2 p-3 border rounded border-gray-200 min-h-[80px]"
              />
            </div>
          </div>
        </section>

        {}
        <aside>
          <div className="sticky top-6 bg-white border border-gray-100 rounded-xl shadow-sm p-6 w-full max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
                {bookingData.package ? String(bookingData.package).charAt(0).toUpperCase() : "B"}
              </div>
              <div>
                <div className="text-xs text-gray-500">Selected package</div>
                <div className="font-semibold text-gray-900">{bookingData.package || "Custom booking"}</div>
              </div>
            </div>

            <div className="mt-5 border-t pt-4 text-sm space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{currency(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Discount</span>
                <span>-{currency(discount)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
                <span>{currency(tax)}</span>
              </div>

              <div className="flex justify-between text-lg font-bold text-indigo-700 pt-2 border-t pt-3">
                <span>Total</span>
                <span>{currency(total)}</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={handlePayment}
                disabled={isPaying || submittingDisabled}
                className={`w-full inline-flex items-center justify-center gap-3 px-4 py-2 rounded bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold hover:from-indigo-700 disabled:opacity-60`}
                aria-disabled={isPaying || submittingDisabled}
              >
                {isPaying ? <FaSpinner className="animate-spin" /> : null}
                {isPaying ? "Redirecting..." : `Pay ${currency(total)}`}
              </button>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              By paying you agree to our <button onClick={() => navigate("/terms")} className="underline">Terms</button> and <button onClick={() => navigate("/privacy")} className="underline">Privacy</button>.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}