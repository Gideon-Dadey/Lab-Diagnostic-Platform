import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
  FaBuilding,
  FaCity,
  FaClipboardList,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSave,
  FaTrashAlt,
} from "react-icons/fa";



const STORAGE_KEY = "labApplication:draft:v1";

const specialtiesList = [
  "Blood Tests",
  "Hormones",
  "Thyroid",
  "Diabetes",
  "Cardiac",
  "Liver Function",
  "Kidney Function",
  "Urine Analysis",
  "Microbiology",
  "Pathology",
];

const requiredFields = [
  "ownerName",
  "ownerEmail",
  "ownerPhone",
  "ownerCNIC",
  "ownerAddress",
  "labName",
  "labAddress",
  "labPhone",
  "cityProvince",
  "staffCount",
];

const initialFormState = {
  ownerName: "",
  ownerEmail: "",
  ownerPhone: "",
  ownerCNIC: "",
  ownerAddress: "",
  labName: "",
  labAddress: "",
  labPhone: "",
  cityProvince: "",
  labRegistrationNumber: "",
  labSpecialties: [],
  hasInternet: null, // null | true | false
  hasBookingSoftware: null, // null | true | false
  bookingSoftwareName: "",
  staffCount: "",
  offersHomeCollection: null, // null | true | false
  labLicense: null, // File
};

const validateField = (name, value, form) => {
  switch (name) {
    case "ownerName":
    case "labName":
      if (!value || value.trim().length < 2) return "Please enter at least 2 characters.";
      return "";
    case "ownerEmail":
      if (!value || !/^\S+@\S+\.\S+$/.test(value)) return "Enter a valid email address.";
      return "";
    case "ownerPhone":
    case "labPhone":
      if (!value || value.trim().length < 7) return "Enter a valid phone number.";
      return "";
    case "ownerCNIC":
      if (!value || value.trim().length < 5) return "Enter a valid national ID.";
      return "";
    case "ownerAddress":
    case "labAddress":
      if (!value || value.trim().length < 10) return "Please provide a more detailed address.";
      return "";
    case "cityProvince":
      if (!value || value.trim().length < 2) return "City & province required.";
      return "";
    case "staffCount":
      if (!value || Number(value) < 1) return "Enter number of staff (>= 1).";
      return "";
    case "labSpecialties":
      if (!value || value.length === 0) return "Select at least one specialty.";
      return "";
    case "labLicense":
      if (!value) return "Please upload your lab license.";
      return "";
    case "bookingSoftwareName":
      if (form.hasBookingSoftware && (!value || value.trim().length < 2))
        return "Please provide the booking software name.";
      return "";
    case "hasInternet":
    case "hasBookingSoftware":
    case "offersHomeCollection":
      if (form[name] === null) return "Please choose an option.";
      return "";
    default:
      return "";
  }
};

export default function LabApplicationForm() {
  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...initialFormState, ...JSON.parse(saved) } : initialFormState;
    } catch {
      return initialFormState;
    }
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [licensePreview, setLicensePreview] = useState(null);
  const [specialtyQuery, setSpecialtyQuery] = useState("");
  const autosaveTimer = useRef(null);
  const mounted = useRef(true);
  const liveMessage = useRef("");

  // Derived
  const specialtiesFiltered = useMemo(() => {
    const q = specialtyQuery.trim().toLowerCase();
    if (!q) return specialtiesList.filter(s => !form.labSpecialties.includes(s));
    return specialtiesList.filter(s => s.toLowerCase().includes(q) && !form.labSpecialties.includes(s));
  }, [specialtyQuery, form.labSpecialties]);

  // Progress: percent of required fields filled and specialties + license presence
  const progress = useMemo(() => {
    let total = requiredFields.length + 2; // specialties + license
    let filled = 0;
    for (const f of requiredFields) {
      const v = form[f];
      if (v !== null && v !== undefined && String(v).trim().length > 0) filled++;
    }
    if (form.labSpecialties.length > 0) filled++;
    if (form.labLicense) filled++;
    return Math.round((filled / total) * 100);
  }, [form]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, []);

  // Debounced autosave to localStorage
  useEffect(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      try {
        const toSave = { ...form, labLicense: null }; // avoid storing file in localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        // subtle live update for screen reader users
        liveMessage.current = "Draft saved.";
      } catch (e) {
        // ignore
      }
    }, 700);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [form]);

  // helper: set field with immediate validation
  const setField = useCallback((name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    // live validation
    setErrors(prev => ({ ...prev, [name]: validateField(name, value, { ...form, [name]: value }) }));
  }, [form]);

  // handle input changes (covers text, number)
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setField(name, value);
  }, [setField]);

  // checkbox specialties toggle
  const toggleSpecialty = useCallback((s) => {
    setForm(prev => {
      const has = prev.labSpecialties.includes(s);
      const next = has ? prev.labSpecialties.filter(x => x !== s) : [...prev.labSpecialties, s];
      setErrors(prevErr => ({ ...prevErr, labSpecialties: validateField("labSpecialties", next, { ...prev, labSpecialties: next }) }));
      return { ...prev, labSpecialties: next };
    });
  }, []);

  
  const addSpecialtyFromQuery = useCallback((s) => {
    if (!s) return;
    setForm(prev => {
      if (prev.labSpecialties.includes(s)) return prev;
      const next = [...prev.labSpecialties, s];
      setSpecialtyQuery("");
      setErrors(prevErr => ({ ...prevErr, labSpecialties: validateField("labSpecialties", next, { ...prev, labSpecialties: next }) }));
      return { ...prev, labSpecialties: next };
    });
  }, []);

  
  const removeSpecialty = useCallback((s) => {
    setForm(prev => {
      const next = prev.labSpecialties.filter(x => x !== s);
      setErrors(prevErr => ({ ...prevErr, labSpecialties: validateField("labSpecialties", next, { ...prev, labSpecialties: next }) }));
      return { ...prev, labSpecialties: next };
    });
  }, []);

  
  const handleFile = useCallback((file) => {
    if (!file) return;
    
    if (file.size > 8 * 1024 * 1024) {
      toast.error("File is too large (max 8MB).");
      return;
    }
    setForm(prev => ({ ...prev, labLicense: file }));
    setLicensePreview({ name: file.name, size: file.size, type: file.type });
    setErrors(prevErr => ({ ...prevErr, labLicense: validateField("labLicense", file, form) }));
  }, [form]);

  const onFileInput = useCallback((e) => {
    const f = e.target.files && e.target.files[0];
    handleFile(f);
  }, [handleFile]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer?.files?.[0];
    handleFile(f);
  }, [handleFile]);

  const clearLicense = useCallback(() => {
    setForm(prev => ({ ...prev, labLicense: null }));
    setLicensePreview(null);
    setErrors(prevErr => ({ ...prevErr, labLicense: validateField("labLicense", null, form) }));
  }, [form]);

  
  const validateAll = useCallback(() => {
    const nextErrors = {};
    for (const key of Object.keys(initialFormState)) {
      const msg = validateField(key, form[key], form);
      if (msg) nextErrors[key] = msg;
    }
    setErrors(nextErrors);
    return nextErrors;
  }, [form]);

  
  const buildFormData = useCallback(() => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === "labSpecialties") fd.append(k, JSON.stringify(v));
      else if (k === "labLicense" && v instanceof File) fd.append(k, v, v.name);
      else if (v !== null && v !== undefined) fd.append(k, String(v));
    });
    return fd;
  }, [form]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const nextErrors = validateAll();
    if (Object.keys(nextErrors).length > 0) {
      toast.error(Object.values(nextErrors)[0]);
      return;
    }

    setSubmitting(true);
    liveMessage.current = "Submitting application...";

    try {
      const fd = buildFormData();
      
      const res = await fetch("/api/labs/apply", {
        method: "POST",
        body: fd,
      });

      const payload = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Application submitted successfully.");
        
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
        
        setForm(initialFormState);
        setLicensePreview(null);
        setErrors({});
        liveMessage.current = "Application submitted.";
      } else {
        const serverMsg = payload?.message || "Failed to submit application.";
        toast.error(serverMsg);
        liveMessage.current = serverMsg;
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error, please try again.");
      liveMessage.current = "Network error.";
    } finally {
      if (mounted.current) setSubmitting(false);
    }
  };

  
  const canSubmit = useMemo(() => {
    
    for (const key of requiredFields) {
      const v = form[key];
      if (!v || String(v).trim() === "") return false;
    }
    if (form.labSpecialties.length === 0) return false;
    if (!form.labLicense) return false;
    // radio fields
    if (form.hasInternet === null || form.hasBookingSoftware === null || form.offersHomeCollection === null) return false;
    // booking software name if using software
    if (form.hasBookingSoftware && (!form.bookingSoftwareName || form.bookingSoftwareName.trim().length < 2)) return false;
    return true;
  }, [form]);

  return (
    <form
      onSubmit={handleSubmit}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className="max-w-5xl mx-auto bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
      aria-labelledby="lab-application-title"
    >
      <div className="flex items-start justify-between gap-6 mb-6">
        <div>
          <h2 id="lab-application-title" className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Lab Application Form
          </h2>
          <p className="mt-1 text-sm text-gray-600 max-w-xl">
            Complete this form to apply your laboratory to our network. Required fields are marked with an asterisk (*).
          </p>
          <div className="mt-3 w-56 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-indigo-600 to-emerald-400 transition-all"
              style={{ width: `${progress}%` }}
              aria-hidden="true"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">Profile completion: {progress}%</p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600">
            <FaSave className="text-indigo-500" />
            <span>Auto-saves as you type</span>
          </div>
          <div className="text-sm text-gray-500">{licensePreview ? `File: ${licensePreview.name}` : "License not uploaded"}</div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {}
        <fieldset className="space-y-4">
          <legend className="text-lg font-medium text-gray-800">Lab Owner Information</legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col">
              <span className="text-sm text-gray-700 mb-1 inline-flex items-center gap-2">
                <FaUser className="text-gray-500" /> Full Name *
              </span>
              <input
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                onBlur={(e) => setErrors(prev => ({ ...prev, ownerName: validateField("ownerName", e.target.value, form) }))}
                className={`w-full p-3 rounded-lg border ${errors.ownerName ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                aria-invalid={!!errors.ownerName}
                aria-describedby={errors.ownerName ? "err-ownerName" : undefined}
                required
              />
              {errors.ownerName && <div id="err-ownerName" className="text-xs text-rose-600 mt-1">{errors.ownerName}</div>}
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-700 mb-1 inline-flex items-center gap-2">
                <FaEnvelope className="text-gray-500" /> Email *
              </span>
              <input
                name="ownerEmail"
                type="email"
                value={form.ownerEmail}
                onChange={handleChange}
                onBlur={(e) => setErrors(prev => ({ ...prev, ownerEmail: validateField("ownerEmail", e.target.value, form) }))}
                className={`w-full p-3 rounded-lg border ${errors.ownerEmail ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                aria-invalid={!!errors.ownerEmail}
                aria-describedby={errors.ownerEmail ? "err-ownerEmail" : undefined}
                required
              />
              {errors.ownerEmail && <div id="err-ownerEmail" className="text-xs text-rose-600 mt-1">{errors.ownerEmail}</div>}
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col">
              <span className="text-sm text-gray-700 mb-1 inline-flex items-center gap-2">
                <FaPhone className="text-gray-500" /> Phone *
              </span>
              <input
                name="ownerPhone"
                value={form.ownerPhone}
                onChange={handleChange}
                onBlur={(e) => setErrors(prev => ({ ...prev, ownerPhone: validateField("ownerPhone", e.target.value, form) }))}
                className={`w-full p-3 rounded-lg border ${errors.ownerPhone ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                aria-invalid={!!errors.ownerPhone}
                required
              />
              {errors.ownerPhone && <div className="text-xs text-rose-600 mt-1">{errors.ownerPhone}</div>}
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-700 mb-1 inline-flex items-center gap-2">
                <FaIdCard className="text-gray-500" /> CNIC / National ID *
              </span>
              <input
                name="ownerCNIC"
                value={form.ownerCNIC}
                onChange={handleChange}
                onBlur={(e) => setErrors(prev => ({ ...prev, ownerCNIC: validateField("ownerCNIC", e.target.value, form) }))}
                className={`w-full p-3 rounded-lg border ${errors.ownerCNIC ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                aria-invalid={!!errors.ownerCNIC}
                required
              />
              {errors.ownerCNIC && <div className="text-xs text-rose-600 mt-1">{errors.ownerCNIC}</div>}
            </label>
          </div>

          <label className="flex flex-col">
            <span className="text-sm text-gray-700 mb-1 inline-flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-500" /> Owners Address *
            </span>
            <textarea
              name="ownerAddress"
              value={form.ownerAddress}
              onChange={handleChange}
              onBlur={(e) => setErrors(prev => ({ ...prev, ownerAddress: validateField("ownerAddress", e.target.value, form) }))}
              rows={3}
              className={`w-full p-3 rounded-lg border ${errors.ownerAddress ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
              aria-invalid={!!errors.ownerAddress}
              required
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{form.ownerAddress.length} chars</span>
              {errors.ownerAddress && <span className="text-rose-600">{errors.ownerAddress}</span>}
            </div>
          </label>
        </fieldset>

        {}
        <fieldset className="space-y-4">
          <legend className="text-lg font-medium text-gray-800">Lab Details</legend>

          <label className="flex flex-col">
            <span className="text-sm text-gray-700 mb-1 inline-flex items-center gap-2">
              <FaBuilding className="text-gray-500" /> Lab Name *
            </span>
            <input
              name="labName"
              value={form.labName}
              onChange={handleChange}
              onBlur={(e) => setErrors(prev => ({ ...prev, labName: validateField("labName", e.target.value, form) }))}
              className={`w-full p-3 rounded-lg border ${errors.labName ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
              aria-invalid={!!errors.labName}
              required
            />
            {errors.labName && <div className="text-xs text-rose-600 mt-1">{errors.labName}</div>}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col">
              <span className="text-sm text-gray-700 mb-1 inline-flex items-center gap-2">
                <FaPhone className="text-gray-500" /> Lab Phone *
              </span>
              <input
                name="labPhone"
                value={form.labPhone}
                onChange={handleChange}
                onBlur={(e) => setErrors(prev => ({ ...prev, labPhone: validateField("labPhone", e.target.value, form) }))}
                className={`w-full p-3 rounded-lg border ${errors.labPhone ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                required
              />
              {errors.labPhone && <div className="text-xs text-rose-600 mt-1">{errors.labPhone}</div>}
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-700 mb-1 inline-flex items-center gap-2">
                <FaCity className="text-gray-500" /> City & Province *
              </span>
              <input
                name="cityProvince"
                value={form.cityProvince}
                onChange={handleChange}
                onBlur={(e) => setErrors(prev => ({ ...prev, cityProvince: validateField("cityProvince", e.target.value, form) }))}
                className={`w-full p-3 rounded-lg border ${errors.cityProvince ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                required
              />
              {errors.cityProvince && <div className="text-xs text-rose-600 mt-1">{errors.cityProvince}</div>}
            </label>
          </div>

          <label className="flex flex-col">
            <span className="text-sm text-gray-700 mb-1 inline-flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-500" /> Lab Address *
            </span>
            <textarea
              name="labAddress"
              value={form.labAddress}
              onChange={handleChange}
              onBlur={(e) => setErrors(prev => ({ ...prev, labAddress: validateField("labAddress", e.target.value, form) }))}
              rows={3}
              className={`w-full p-3 rounded-lg border ${errors.labAddress ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
              required
            />
            <div className="text-xs text-gray-500 mt-1">{form.labAddress.length} chars</div>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col">
              <span className="text-sm text-gray-700 mb-1">Lab Registration Number</span>
              <input
                name="labRegistrationNumber"
                value={form.labRegistrationNumber}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-700 mb-1">Staff Count *</span>
              <input
                name="staffCount"
                type="number"
                min={1}
                value={form.staffCount}
                onChange={handleChange}
                onBlur={(e) => setErrors(prev => ({ ...prev, staffCount: validateField("staffCount", e.target.value, form) }))}
                className={`w-full p-3 rounded-lg border ${errors.staffCount ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                required
              />
              {errors.staffCount && <div className="text-xs text-rose-600 mt-1">{errors.staffCount}</div>}
            </label>
          </div>

          {}
          <div>
            <label className="text-sm text-gray-700 mb-2 inline-flex items-center gap-2">
              <FaClipboardList className="text-gray-500" /> Lab Specialties *
            </label>

            <div className="flex items-center gap-2 mb-2">
              <input
                placeholder="Search or add specialty..."
                value={specialtyQuery}
                onChange={(e) => setSpecialtyQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const candidate = specialtyQuery.trim();
                    if (candidate) addSpecialtyFromQuery(candidate);
                  }
                }}
                className="flex-1 p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                aria-label="Search specialties"
              />
              <button
                type="button"
                onClick={() => addSpecialtyFromQuery(specialtyQuery.trim())}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {form.labSpecialties.map(s => (
                <span key={s} className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSpecialty(s)}
                    aria-label={`Remove ${s}`}
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <FaTimesCircle className="w-3.5 h-3.5 text-rose-500" />
                  </button>
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-auto">
              {specialtiesFiltered.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSpecialtyFromQuery(s)}
                  className="text-left p-2 rounded-lg border border-gray-200 hover:bg-indigo-50 text-sm"
                >
                  {s}
                </button>
              ))}
            </div>
            {errors.labSpecialties && <div className="text-xs text-rose-600 mt-1">{errors.labSpecialties}</div>}
          </div>
        </fieldset>
      </div>

      {}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="flex flex-col">
          <span className="text-sm text-gray-700 mb-1">Internet access *</span>
          <div className="flex gap-3">
            <label className={`px-3 py-2 rounded-lg border ${form.hasInternet === true ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}`}>
              <input
                type="radio"
                name="hasInternet"
                checked={form.hasInternet === true}
                onChange={() => setField("hasInternet", true)}
                className="mr-2"
              />
              Yes
            </label>
            <label className={`px-3 py-2 rounded-lg border ${form.hasInternet === false ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}`}>
              <input
                type="radio"
                name="hasInternet"
                checked={form.hasInternet === false}
                onChange={() => setField("hasInternet", false)}
                className="mr-2"
              />
              No
            </label>
          </div>
          {errors.hasInternet && <div className="text-xs text-rose-600 mt-1">{errors.hasInternet}</div>}
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700 mb-1">Booking software *</span>
          <div className="flex gap-3">
            <label className={`px-3 py-2 rounded-lg border ${form.hasBookingSoftware === true ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}`}>
              <input
                type="radio"
                name="hasBookingSoftware"
                checked={form.hasBookingSoftware === true}
                onChange={() => setField("hasBookingSoftware", true)}
                className="mr-2"
              />
              Yes
            </label>
            <label className={`px-3 py-2 rounded-lg border ${form.hasBookingSoftware === false ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}`}>
              <input
                type="radio"
                name="hasBookingSoftware"
                checked={form.hasBookingSoftware === false}
                onChange={() => setField("hasBookingSoftware", false)}
                className="mr-2"
              />
              No
            </label>
          </div>
          {errors.hasBookingSoftware && <div className="text-xs text-rose-600 mt-1">{errors.hasBookingSoftware}</div>}
        </label>

        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Offers home collection *</label>
          <div className="flex gap-3">
            <label className={`px-3 py-2 rounded-lg border ${form.offersHomeCollection === true ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}`}>
              <input
                type="radio"
                name="offersHomeCollection"
                checked={form.offersHomeCollection === true}
                onChange={() => setField("offersHomeCollection", true)}
                className="mr-2"
              />
              Yes
            </label>
            <label className={`px-3 py-2 rounded-lg border ${form.offersHomeCollection === false ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}`}>
              <input
                type="radio"
                name="offersHomeCollection"
                checked={form.offersHomeCollection === false}
                onChange={() => setField("offersHomeCollection", false)}
                className="mr-2"
              />
              No
            </label>
          </div>
          {errors.offersHomeCollection && <div className="text-xs text-rose-600 mt-1">{errors.offersHomeCollection}</div>}
        </div>
      </div>

      {form.hasBookingSoftware && (
        <div className="mt-4">
          <label className="text-sm text-gray-700 mb-1">Booking software name *</label>
          <input
            name="bookingSoftwareName"
            value={form.bookingSoftwareName}
            onChange={handleChange}
            onBlur={(e) => setErrors(prev => ({ ...prev, bookingSoftwareName: validateField("bookingSoftwareName", e.target.value, form) }))}
            className={`w-full p-3 rounded-lg border ${errors.bookingSoftwareName ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
            required
          />
          {errors.bookingSoftwareName && <div className="text-xs text-rose-600 mt-1">{errors.bookingSoftwareName}</div>}
        </div>
      )}

      {}
      <div className={`mt-6 p-4 rounded-lg border-dashed border-2 ${dragOver ? "border-indigo-500 bg-indigo-50/30" : "border-gray-200 bg-gray-50"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaCloudUploadAlt className="text-gray-600 w-6 h-6" />
            <div>
              <p className="text-sm font-medium text-gray-800">Upload Lab License *</p>
              <p className="text-xs text-gray-600">Drop the file here, or click to browse. Max 8MB. Accepts PDF, JPG, PNG.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {licensePreview ? (
              <>
                <span className="text-sm text-gray-700">{licensePreview.name}</span>
                <button type="button" onClick={clearLicense} className="p-2 rounded-md bg-white border border-gray-200 hover:bg-gray-100">
                  <FaTrashAlt className="text-rose-500" />
                </button>
              </>
            ) : (
              <label className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700">
                Browse
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={onFileInput} className="sr-only" />
              </label>
            )}
          </div>
        </div>
        {errors.labLicense && <div className="text-xs text-rose-600 mt-2">{errors.labLicense}</div>}
      </div>

      {}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          <div aria-live="polite" className="sr-only">{liveMessage.current}</div>
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-emerald-500" />
            <span>{progress}% complete</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-white font-medium transition ${submitting ? "bg-indigo-400 cursor-wait" : (canSubmit ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 cursor-not-allowed")}`}
            aria-disabled={!canSubmit || submitting}
          >
            {submitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlaneIconFallback />}
            <span>{submitting ? "Submitting..." : "Submit Application"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              try { localStorage.removeItem(STORAGE_KEY); } catch {}
              setForm(initialFormState);
              setLicensePreview(null);
              setErrors({});
              toast.success("Draft cleared.");
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm hover:bg-gray-50"
          >
            Clear Draft
            <FaTrashAlt className="w-4 h-4 text-rose-500" />
          </button>
        </div>
      </div>
    </form>
  );
}


function FaPaperPlaneIconFallback() {
  return <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>;
}