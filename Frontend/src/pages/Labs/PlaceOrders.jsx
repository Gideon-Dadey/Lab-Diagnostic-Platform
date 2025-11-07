import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaHome, FaHospital, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";

const PACKAGE_META = {
  "child-full": { title: "Child Full Package", price: "$49.99", priceNumber: 49.99, subtitle: "Comprehensive pediatric bundle" },
  infant: { title: "Infant Screening", price: "$16.89", priceNumber: 16.89, subtitle: "Newborn screens & vitamin checks" },
  toddler: { title: "Toddler Package", price: "$29.99", priceNumber: 29.99, subtitle: "Lead & development screening" },
  teen: { title: "Teen Health Check", price: "$39.99", priceNumber: 39.99, subtitle: "Wellness & sports physicals" },
  "": { title: "Custom Booking", price: "Varies", priceNumber: 0, subtitle: "Select your package on the previous page" },
};

const todayISODate = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

export default function PlaceOrder() {
  const navigate = useNavigate();
  const location = useLocation();

  const urlPackage = useMemo(() => {
    try {
      const qp = new URLSearchParams(location.search);
      return qp.get("package") || "";
    } catch {
      return "";
    }
  }, [location.search]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "Male",
    age: "",
    address: "",
    state: "",
    country: "Ghana",
    collectionMethod: "", // "Home Collection" | "Lab Visit"
    bookingDate: "",
    bookingTime: "",
    package: urlPackage || "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // keep package in sync if URL changes
  useEffect(() => {
    setFormData((f) => ({ ...f, package: urlPackage || f.package }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlPackage]);

  const packageInfo = PACKAGE_META[formData.package] || PACKAGE_META[""];

  const validate = () => {
    const e = {};
    if (!formData.collectionMethod) e.collectionMethod = "Select a collection method.";
    if (!formData.name || formData.name.trim().length < 2) e.name = "Please enter a valid full name.";
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) e.email = "Enter a valid email address.";
    if (!formData.phoneNumber || !/^[\d+\-\s()]{7,20}$/.test(formData.phoneNumber)) e.phoneNumber = "Enter a valid phone number.";
    const ageNum = Number(formData.age);
    if (!formData.age || Number.isNaN(ageNum) || ageNum <= 0 || ageNum > 120) e.age = "Enter a valid age.";
    if (!formData.bookingDate) e.bookingDate = "Select a booking date.";
    else if (formData.bookingDate < todayISODate()) e.bookingDate = "Booking date cannot be in the past.";
    if (!formData.bookingTime) e.bookingTime = "Select a booking time.";
    if (!formData.address || formData.address.trim().length < 4) e.address = "Enter a more specific address.";
    if (!formData.state || formData.state.trim().length < 2) e.state = "Enter your province/state.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleClear = () => {
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      gender: "Male",
      age: "",
      address: "",
      state: "",
      country: "Ghana",
      collectionMethod: "",
      bookingDate: "",
      bookingTime: "",
      package: urlPackage || "",
    });
    setErrors({});
    toast.success("Form cleared");
  };

  const handleCollectionMethod = (method) => {
    setFormData((f) => ({ ...f, collectionMethod: method }));
    setErrors((prev) => ({ ...prev, collectionMethod: undefined }));
  };

  
  const makeCartItemForSelectedPackage = () => {
    const pkgKey = formData.package || urlPackage || "";
    const meta = PACKAGE_META[pkgKey] || PACKAGE_META[""];
    // create a stable-ish id
    const id = pkgKey ? `${pkgKey}` : `custom-${Date.now()}`;
    return {
      _id: id,
      name: meta.title,
      price: Number(meta.priceNumber || 0),
      quantity: 1,
    };
  };

  const persistBookingAndCart = (booking) => {
    try {
      localStorage.setItem("bookingData", JSON.stringify(booking));

      
      
      const cartFromPackage = formData.package ? [makeCartItemForSelectedPackage()] : [];
      localStorage.setItem("cartItems", JSON.stringify(cartFromPackage));

      
      localStorage.setItem("cart", JSON.stringify(cartFromPackage));
    } catch (err) {
      console.warn("Failed to persist booking/cart locally", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSubmitting(true);
    try {
      
      persistBookingAndCart(formData);

      toast.success("Booking saved — confirming...");
      
      setTimeout(() => {
        
        navigate("/confirm-booking", { state: { booking: formData } });
      }, 350);
    } catch (err) {
      console.error(err);
      toast.error("Could not save booking — try again");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none"
          aria-label="Back to previous"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="ml-auto text-sm text-gray-600">Secure • Private • Clinician-reviewed reports</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-6"
          noValidate
        >
          <header className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Confirm your booking</h1>
              <p className="text-sm text-gray-500 mt-1">
                Fill in details below and choose how you'd like samples collected.
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-500">Selected package</div>
              <div className="font-semibold text-gray-800">{packageInfo.title}</div>
            </div>
          </header>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Collection method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                role="radio"
                aria-checked={formData.collectionMethod === "Home Collection"}
                onClick={() => handleCollectionMethod("Home Collection")}
                className={`flex items-center gap-3 px-4 py-3 border rounded-lg transition focus:ring-2 focus:ring-offset-1 focus:ring-indigo-200 justify-center ${
                  formData.collectionMethod === "Home Collection"
                    ? "bg-indigo-600 text-white border-transparent shadow"
                    : "bg-white text-gray-700 border-gray-200 hover:shadow-sm"
                }`}
              >
                <FaHome className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Home collection</div>
                  <div className="text-xs text-gray-400">We visit your preferred address</div>
                </div>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={formData.collectionMethod === "Lab Visit"}
                onClick={() => handleCollectionMethod("Lab Visit")}
                className={`flex items-center gap-3 px-4 py-3 border rounded-lg transition focus:ring-2 focus:ring-offset-1 focus:ring-indigo-200 justify-center ${
                  formData.collectionMethod === "Lab Visit"
                    ? "bg-indigo-600 text-white border-transparent shadow"
                    : "bg-white text-gray-700 border-gray-200 hover:shadow-sm"
                }`}
              >
                <FaHospital className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Lab visit</div>
                  <div className="text-xs text-gray-400">Visit our accredited partner lab</div>
                </div>
              </button>
            </div>
            {errors.collectionMethod && <p className="mt-2 text-sm text-red-600">{errors.collectionMethod}</p>}
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Full name</label>
              <div className="mt-1 relative">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-200 ${
                    errors.name ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="Jane Doe"
                  aria-invalid={errors.name ? "true" : "false"}
                />
                <FaUser className="absolute right-3 top-3 text-gray-300" />
              </div>
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-200 ${
                    errors.email ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="you@example.com"
                  aria-invalid={errors.email ? "true" : "false"}
                />
                <FaEnvelope className="absolute right-3 top-3 text-gray-300" />
              </div>
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <div className="mt-1 relative">
                <input
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-200 ${
                    errors.phoneNumber ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="+233 24 000 0000"
                  aria-invalid={errors.phoneNumber ? "true" : "false"}
                />
                <FaPhone className="absolute right-3 top-3 text-gray-300" />
              </div>
              {errors.phoneNumber && <p className="text-sm text-red-600 mt-1">{errors.phoneNumber}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Age</label>
              <input
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                min={0}
                max={120}
                required
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-200 ${
                  errors.age ? "border-red-300" : "border-gray-200"
                }`}
                placeholder="e.g., 34"
                aria-invalid={errors.age ? "true" : "false"}
              />
              {errors.age && <p className="text-sm text-red-600 mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">State / Province</label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-200 ${
                  errors.state ? "border-red-300" : "border-gray-200"
                }`}
                placeholder="Greater Accra"
                aria-invalid={errors.state ? "true" : "false"}
              />
              {errors.state && <p className="text-sm text-red-600 mt-1">{errors.state}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <div className="mt-1 relative">
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-200 ${
                    errors.address ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="Street address, area, city"
                  aria-invalid={errors.address ? "true" : "false"}
                />
                <FaMapMarkerAlt className="absolute right-3 top-3 text-gray-300" />
              </div>
              {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Booking date</label>
              <div className="mt-1 relative">
                <input
                  name="bookingDate"
                  type="date"
                  value={formData.bookingDate}
                  onChange={handleChange}
                  min={todayISODate()}
                  required
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-200 ${
                    errors.bookingDate ? "border-red-300" : "border-gray-200"
                  }`}
                  aria-invalid={errors.bookingDate ? "true" : "false"}
                />
                <FaCalendarAlt className="absolute right-3 top-3 text-gray-300" />
              </div>
              {errors.bookingDate && <p className="text-sm text-red-600 mt-1">{errors.bookingDate}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Booking time</label>
              <div className="mt-1 relative">
                <input
                  name="bookingTime"
                  type="time"
                  value={formData.bookingTime}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-200 ${
                    errors.bookingTime ? "border-red-300" : "border-gray-200"
                  }`}
                  aria-invalid={errors.bookingTime ? "true" : "false"}
                />
                <FaClock className="absolute right-3 top-3 text-gray-300" />
              </div>
              {errors.bookingTime && <p className="text-sm text-red-600 mt-1">{errors.bookingTime}</p>}
            </div>
          </div>

          {}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
            >
              Clear
            </button>

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 disabled:opacity-60"
              >
                {submitting ? "Processing..." : "Confirm booking"}
              </button>
            </div>
          </div>
        </form>

        {}
        <aside className="relative">
          <div className="sticky top-6 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                  {packageInfo.title.split(" ").slice(0, 1)[0].charAt(0)}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500">Package</div>
                <div className="font-semibold text-gray-900">{packageInfo.title}</div>
                <div className="text-sm text-gray-500 mt-1">{packageInfo.subtitle}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Price</div>
              <div className="text-right font-medium">{packageInfo.price}</div>

              <div className="text-gray-500">Collection</div>
              <div className="text-right">{formData.collectionMethod || "Not selected"}</div>

              <div className="text-gray-500">Date</div>
              <div className="text-right">{formData.bookingDate || "—"}</div>

              <div className="text-gray-500">Time</div>
              <div className="text-right">{formData.bookingTime || "—"}</div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => {
                  
                  if (!formData.collectionMethod) {
                    toast.error("Please select a collection method first");
                    return;
                  }
                  if (!formData.name || !formData.phoneNumber) {
                    toast("Please complete name & phone in the form", { icon: "ℹ️" });
                    return;
                  }
                  
                  persistBookingAndCart(formData);
                  navigate("/confirm-booking", { state: { booking: formData } });
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Proceed to confirmation
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-400">
              We follow strict privacy & sample handling procedures. You can change details at the confirmation step.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}