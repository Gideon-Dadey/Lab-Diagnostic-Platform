import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  FaSpinner,
  FaCloudUploadAlt,
  FaTrashAlt,
  FaTimesCircle,
  FaCheckCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
  FaBuilding,
  FaClipboardList,
  FaPaperPlane,
} from "react-icons/fa";



const STORAGE_KEY = "pragma:join:lab:draft:v1";

const SPECIALTIES = [
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

const initialState = {
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

  hasInternet: null,
  hasBookingSoftware: null,
  bookingSoftwareName: "",
  staffCount: "",
  offersHomeCollection: null,

  labLicense: null, // File
};

const validateField = (name, value, form) => {
  switch (name) {
    case "ownerName":
    case "labName":
      return !value || value.trim().length < 2 ? "At least 2 characters required." : "";
    case "ownerEmail":
      return !value || !/^\S+@\S+\.\S+$/.test(value) ? "Enter a valid email." : "";
    case "ownerPhone":
    case "labPhone":
      return !value || value.trim().length < 7 ? "Enter a valid phone number." : "";
    case "ownerCNIC":
      return !value || value.trim().length < 5 ? "Invalid national ID." : "";
    case "ownerAddress":
    case "labAddress":
      return !value || value.trim().length < 10 ? "Please provide a more detailed address." : "";
    case "cityProvince":
      return !value || value.trim().length < 2 ? "City & province required." : "";
    case "staffCount":
      return !value || Number(value) < 1 ? "Enter staff count (>=1)." : "";
    case "labSpecialties":
      return !value || value.length === 0 ? "Select at least one specialty." : "";
    case "labLicense":
      return !value ? "Lab license is required." : "";
    case "bookingSoftwareName":
      return form.hasBookingSoftware ? (!value || value.trim().length < 2 ? "Provide software name." : "") : "";
    case "hasInternet":
    case "hasBookingSoftware":
    case "offersHomeCollection":
      return form[name] === null ? "Please choose an option." : "";
    default:
      return "";
  }
};

export default function Join() {
  const [form, setForm] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      // Don't restore file objects
      return parsed ? { ...initialState, ...parsed, labLicense: null } : initialState;
    } catch {
      return initialState;
    }
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [licensePreview, setLicensePreview] = useState(null);
  const [specialtyQuery, setSpecialtyQuery] = useState("");
  const autosaveRef = useRef(null);
  const mounted = useRef(true);

  // Derived - suggestions excluding already chosen specialties
  const specialtySuggestions = useMemo(() => {
    const q = specialtyQuery.trim().toLowerCase();
    return SPECIALTIES.filter((s) => !form.labSpecialties.includes(s) && (!q || s.toLowerCase().includes(q)));
  }, [specialtyQuery, form.labSpecialties]);

  // Progress: required fields + specialties + license
  const progress = useMemo(() => {
    const required = [
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
    let done = 0;
    required.forEach((k) => {
      const v = form[k];
      if (v !== null && v !== undefined && String(v).trim().length > 0) done++;
    });
    if (form.labSpecialties.length > 0) done++;
    if (form.labLicense) done++;
    const total = required.length + 2;
    return Math.round((done / total) * 100);
  }, [form]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (autosaveRef.current) clearTimeout(autosaveRef.current);
    };
  }, []);

  
  useEffect(() => {
    if (autosaveRef.current) clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(() => {
      try {
        const toSave = { ...form, labLicense: null };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        
      } catch (e) {
        
      }
    }, 700);
    return () => clearTimeout(autosaveRef.current);
  }, [form]);

  const setField = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value, { ...form, [name]: value }) }));
  }, [form]);

  const handleInput = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      
      if (name === "labSpecialties") {
        const next = checked ? [...form.labSpecialties, value] : form.labSpecialties.filter((s) => s !== value);
        setForm((p) => ({ ...p, labSpecialties: next }));
        setErrors((prev) => ({ ...prev, labSpecialties: validateField("labSpecialties", next, form) }));
      } else {
        setField(name, checked);
      }
    } else if (type === "file") {
      const file = files && files[0];
      handleFile(file);
    } else if (type === "radio") {
      setField(name, value === "true");
    } else {
      setField(name, value);
    }
  }, [form, setField]);

  const toggleSpecialty = useCallback((s) => {
    setForm((prev) => {
      const next = prev.labSpecialties.includes(s) ? prev.labSpecialties.filter((x) => x !== s) : [...prev.labSpecialties, s];
      setErrors((prevErr) => ({ ...prevErr, labSpecialties: validateField("labSpecialties", next, { ...prev, labSpecialties: next }) }));
      return { ...prev, labSpecialties: next };
    });
  }, []);

  const addSpecialtyFromQuery = useCallback((s) => {
    if (!s) return;
    setForm((prev) => {
      if (prev.labSpecialties.includes(s)) return prev;
      const next = [...prev.labSpecialties, s];
      setSpecialtyQuery("");
      setErrors((prevErr) => ({ ...prevErr, labSpecialties: validateField("labSpecialties", next, { ...prev, labSpecialties: next }) }));
      return { ...prev, labSpecialties: next };
    });
  }, []);

  const removeSpecialty = useCallback((s) => {
    setForm((prev) => {
      const next = prev.labSpecialties.filter((x) => x !== s);
      setErrors((prevErr) => ({ ...prevErr, labSpecialties: validateField("labSpecialties", next, { ...prev, labSpecialties: next }) }));
      return { ...prev, labSpecialties: next };
    });
  }, []);

  
  const handleFile = useCallback((file) => {
    if (!file) return;
    const maxSize = 8 * 1024 * 1024; 
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (file.size > maxSize) {
      toast.error("File too large (max 8MB).");
      return;
    }
    if (!allowed.includes(file.type)) {
      toast.error("Unsupported file type. Use PDF/JPG/PNG.");
      return;
    }
    setForm((prev) => ({ ...prev, labLicense: file }));
    setLicensePreview({ name: file.name, size: file.size, type: file.type });
    setErrors((prev) => ({ ...prev, labLicense: "" }));
  }, []);

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
    setForm((prev) => ({ ...prev, labLicense: null }));
    setLicensePreview(null);
    setErrors((prev) => ({ ...prev, labLicense: validateField("labLicense", null, form) }));
  }, [form]);

  const validateAll = useCallback(() => {
    const next = {};
    Object.keys(initialState).forEach((k) => {
      const msg = validateField(k, form[k], form);
      if (msg) next[k] = msg;
    });
    setErrors(next);
    return next;
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

  const canSubmit = useMemo(() => {
    
    const required = ["ownerName","ownerEmail","ownerPhone","ownerCNIC","ownerAddress","labName","labAddress","labPhone","cityProvince","staffCount"];
    for (const r of required) {
      if (!form[r] || String(form[r]).trim() === "") return false;
    }
    if (form.labSpecialties.length === 0) return false;
    if (!form.labLicense) return false;
    if (form.hasInternet === null || form.hasBookingSoftware === null || form.offersHomeCollection === null) return false;
    if (form.hasBookingSoftware && (!form.bookingSoftwareName || form.bookingSoftwareName.trim().length < 2)) return false;
    return true;
  }, [form]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (submitting) return;
    const nextErrors = validateAll();
    if (Object.keys(nextErrors).length > 0) {
      toast.error(Object.values(nextErrors)[0]);
      return;
    }
    setSubmitting(true);
    try {
      const fd = buildFormData();
      const res = await fetch("/api/labs/apply", { method: "POST", body: fd });
      const payload = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Application submitted — we'll be in touch.");
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
        setForm(initialState);
        setLicensePreview(null);
        setErrors({});
      } else {
        toast.error(payload?.message || "Submission failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error — try again.");
    } finally {
      if (mounted.current) setSubmitting(false);
    }
  }, [buildFormData, validateAll, submitting]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {}
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">Partner with Pragma Health</h1>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
            Apply to join our network of accredited diagnostic labs. Fill the form; we'll review and contact you.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          aria-labelledby="join-form-title"
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
        >
          <div className="flex items-start justify-between gap-6 mb-6">
            <div>
              <h2 id="join-form-title" className="text-2xl font-bold text-gray-900">Lab Application Form</h2>
              <p className="text-sm text-gray-600 mt-1">Required fields are marked with an asterisk (*). Your draft auto-saves locally.</p>

              <div className="mt-4 w-56 bg-gray-100 rounded-full h-2 overflow-hidden" aria-hidden="true">
                <div
                  className="h-2 bg-gradient-to-r from-indigo-600 to-emerald-400 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">Profile completion: {progress}%</p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                <FaCheckCircle className="text-emerald-500" />
                <span>{licensePreview ? "License uploaded" : "License not uploaded"}</span>
              </div>
              <div className="text-xs text-gray-500">You can clear the draft at any time.</div>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {}
            <fieldset className="space-y-4">
              <legend className="text-lg font-medium text-gray-800">Lab Owner Information</legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 inline-flex items-center gap-2"><FaUser className="text-gray-500" /> Full name *</span>
                  <input
                    name="ownerName"
                    value={form.ownerName}
                    onChange={handleInput}
                    onBlur={(e) => setErrors((p) => ({ ...p, ownerName: validateField("ownerName", e.target.value, form) }))}
                    className={`w-full p-3 rounded-lg border ${errors.ownerName ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                    aria-invalid={!!errors.ownerName}
                    aria-describedby={errors.ownerName ? "err-ownerName" : undefined}
                    required
                  />
                  {errors.ownerName && <div id="err-ownerName" className="text-xs text-rose-600 mt-1">{errors.ownerName}</div>}
                </label>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 inline-flex items-center gap-2"><FaEnvelope className="text-gray-500" /> Email *</span>
                  <input
                    name="ownerEmail"
                    type="email"
                    value={form.ownerEmail}
                    onChange={handleInput}
                    onBlur={(e) => setErrors((p) => ({ ...p, ownerEmail: validateField("ownerEmail", e.target.value, form) }))}
                    className={`w-full p-3 rounded-lg border ${errors.ownerEmail ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                    aria-invalid={!!errors.ownerEmail}
                    required
                  />
                  {errors.ownerEmail && <div className="text-xs text-rose-600 mt-1">{errors.ownerEmail}</div>}
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 inline-flex items-center gap-2"><FaPhone className="text-gray-500" /> Phone *</span>
                  <input
                    name="ownerPhone"
                    value={form.ownerPhone}
                    onChange={handleInput}
                    onBlur={(e) => setErrors((p) => ({ ...p, ownerPhone: validateField("ownerPhone", e.target.value, form) }))}
                    className={`w-full p-3 rounded-lg border ${errors.ownerPhone ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                    required
                  />
                  {errors.ownerPhone && <div className="text-xs text-rose-600 mt-1">{errors.ownerPhone}</div>}
                </label>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 inline-flex items-center gap-2"><FaIdCard className="text-gray-500" /> CNIC / National ID *</span>
                  <input
                    name="ownerCNIC"
                    value={form.ownerCNIC}
                    onChange={handleInput}
                    onBlur={(e) => setErrors((p) => ({ ...p, ownerCNIC: validateField("ownerCNIC", e.target.value, form) }))}
                    className={`w-full p-3 rounded-lg border ${errors.ownerCNIC ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                    required
                  />
                  {errors.ownerCNIC && <div className="text-xs text-rose-600 mt-1">{errors.ownerCNIC}</div>}
                </label>
              </div>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700 inline-flex items-center gap-2"><FaMapMarkerAlt className="text-gray-500" /> Owner's address *</span>
                <textarea
                  name="ownerAddress"
                  rows={3}
                  value={form.ownerAddress}
                  onChange={handleInput}
                  onBlur={(e) => setErrors((p) => ({ ...p, ownerAddress: validateField("ownerAddress", e.target.value, form) }))}
                  className={`w-full p-3 rounded-lg border ${errors.ownerAddress ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                  required
                />
                {errors.ownerAddress && <div className="text-xs text-rose-600 mt-1">{errors.ownerAddress}</div>}
              </label>
            </fieldset>

            {}
            <fieldset className="space-y-4">
              <legend className="text-lg font-medium text-gray-800">Lab Details</legend>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700 inline-flex items-center gap-2"><FaBuilding className="text-gray-500" /> Lab name *</span>
                <input
                  name="labName"
                  value={form.labName}
                  onChange={handleInput}
                  onBlur={(e) => setErrors((p) => ({ ...p, labName: validateField("labName", e.target.value, form) }))}
                  className={`w-full p-3 rounded-lg border ${errors.labName ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                  required
                />
                {errors.labName && <div className="text-xs text-rose-600 mt-1">{errors.labName}</div>}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 inline-flex items-center gap-2"><FaPhone className="text-gray-500" /> Lab phone *</span>
                  <input
                    name="labPhone"
                    value={form.labPhone}
                    onChange={handleInput}
                    onBlur={(e) => setErrors((p) => ({ ...p, labPhone: validateField("labPhone", e.target.value, form) }))}
                    className={`w-full p-3 rounded-lg border ${errors.labPhone ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                    required
                  />
                  {errors.labPhone && <div className="text-xs text-rose-600 mt-1">{errors.labPhone}</div>}
                </label>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 inline-flex items-center gap-2"><FaMapMarkerAlt className="text-gray-500" /> City & province *</span>
                  <input
                    name="cityProvince"
                    value={form.cityProvince}
                    onChange={handleInput}
                    onBlur={(e) => setErrors((p) => ({ ...p, cityProvince: validateField("cityProvince", e.target.value, form) }))}
                    className={`w-full p-3 rounded-lg border ${errors.cityProvince ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                    required
                  />
                  {errors.cityProvince && <div className="text-xs text-rose-600 mt-1">{errors.cityProvince}</div>}
                </label>
              </div>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700 mb-1">Lab address *</span>
                <textarea
                  name="labAddress"
                  rows={3}
                  value={form.labAddress}
                  onChange={handleInput}
                  onBlur={(e) => setErrors((p) => ({ ...p, labAddress: validateField("labAddress", e.target.value, form) }))}
                  className={`w-full p-3 rounded-lg border ${errors.labAddress ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                  required
                />
                {errors.labAddress && <div className="text-xs text-rose-600 mt-1">{errors.labAddress}</div>}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700">Registration number</span>
                  <input
                    name="labRegistrationNumber"
                    value={form.labRegistrationNumber}
                    onChange={handleInput}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-700">Staff count *</span>
                  <input
                    name="staffCount"
                    type="number"
                    min={1}
                    value={form.staffCount}
                    onChange={handleInput}
                    onBlur={(e) => setErrors((p) => ({ ...p, staffCount: validateField("staffCount", e.target.value, form) }))}
                    className={`w-full p-3 rounded-lg border ${errors.staffCount ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                    required
                  />
                  {errors.staffCount && <div className="text-xs text-rose-600 mt-1">{errors.staffCount}</div>}
                </label>
              </div>

              {}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-700 inline-flex items-center gap-2"><FaClipboardList className="text-gray-500" /> Lab specialties *</label>
                  <span className="text-xs text-gray-500">{form.labSpecialties.length} selected</span>
                </div>

                <div className="flex gap-2 mb-3">
                  <input
                    placeholder="Search or type to add..."
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
                  <button type="button" onClick={() => addSpecialtyFromQuery(specialtyQuery.trim())} className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {form.labSpecialties.map((s) => (
                    <span key={s} className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {s}
                      <button type="button" onClick={() => removeSpecialty(s)} aria-label={`Remove ${s}`} className="p-1 rounded-full hover:bg-gray-200">
                        <FaTimesCircle className="w-3.5 h-3.5 text-rose-500" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-auto">
                  {specialtySuggestions.map((s) => (
                    <button key={s} type="button" onClick={() => addSpecialtyFromQuery(s)} className="text-left p-2 rounded-lg border border-gray-200 hover:bg-indigo-50 text-sm">
                      {s}
                    </button>
                  ))}
                </div>

                {errors.labSpecialties && <div className="text-xs text-rose-600 mt-2">{errors.labSpecialties}</div>}
              </div>
            </fieldset>
          </div>

          {}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-1">
              <label className="text-sm text-gray-700 mb-2 block">Internet access *</label>
              <div className="flex gap-3">
                <label className={`px-3 py-2 rounded-lg border ${form.hasInternet === true ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}`}>
                  <input type="radio" name="hasInternet" value="true" checked={form.hasInternet === true} onChange={handleInput} className="mr-2" /> Yes
                </label>
                <label className={`px-3 py-2 rounded-lg border ${form.hasInternet === false ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}`}>
                  <input type="radio" name="hasInternet" value="false" checked={form.hasInternet === false} onChange={handleInput} className="mr-2" /> No
                </label>
              </div>
              {errors.hasInternet && <div className="text-xs text-rose-600 mt-1">{errors.hasInternet}</div>}
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-2 block">Booking software *</label>
              <div className="flex gap-3">
                <label className={`px-3 py-2 rounded-lg border ${form.hasBookingSoftware === true ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}`}>
                  <input type="radio" name="hasBookingSoftware" value="true" checked={form.hasBookingSoftware === true} onChange={handleInput} className="mr-2" /> Yes
                </label>
                <label className={`px-3 py-2 rounded-lg border ${form.hasBookingSoftware === false ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}`}>
                  <input type="radio" name="hasBookingSoftware" value="false" checked={form.hasBookingSoftware === false} onChange={handleInput} className="mr-2" /> No
                </label>
              </div>
              {errors.hasBookingSoftware && <div className="text-xs text-rose-600 mt-1">{errors.hasBookingSoftware}</div>}

              {form.hasBookingSoftware && (
                <div className="mt-3">
                  <input
                    name="bookingSoftwareName"
                    value={form.bookingSoftwareName}
                    onChange={handleInput}
                    onBlur={(e) => setErrors((p) => ({ ...p, bookingSoftwareName: validateField("bookingSoftwareName", e.target.value, form) }))}
                    className={`w-full p-3 rounded-lg border ${errors.bookingSoftwareName ? "border-rose-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                    placeholder="Which software?"
                    required
                  />
                  {errors.bookingSoftwareName && <div className="text-xs text-rose-600 mt-1">{errors.bookingSoftwareName}</div>}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-2 block">Home collection *</label>
              <div className="flex gap-3">
                <label className={`px-3 py-2 rounded-lg border ${form.offersHomeCollection === true ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}`}>
                  <input type="radio" name="offersHomeCollection" value="true" checked={form.offersHomeCollection === true} onChange={handleInput} className="mr-2" /> Yes
                </label>
                <label className={`px-3 py-2 rounded-lg border ${form.offersHomeCollection === false ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}`}>
                  <input type="radio" name="offersHomeCollection" value="false" checked={form.offersHomeCollection === false} onChange={handleInput} className="mr-2" /> No
                </label>
              </div>
              {errors.offersHomeCollection && <div className="text-xs text-rose-600 mt-1">{errors.offersHomeCollection}</div>}
            </div>
          </div>

          {}
          <div className={`mt-6 p-4 rounded-lg border-2 ${dragOver ? "border-indigo-500 bg-indigo-50/30" : "border-dashed border-gray-200 bg-gray-50"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaCloudUploadAlt className="w-6 h-6 text-gray-700" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Upload lab license *</p>
                  <p className="text-xs text-gray-600">Drop file here or click Browse. Max 8MB. PDF/JPG/PNG accepted.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {licensePreview ? (
                  <>
                    <div className="text-sm text-gray-700">{licensePreview.name}</div>
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
              <span className="sr-only" aria-live="polite" aria-atomic="true">{progress}% complete</span>
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
                {submitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                <span>{submitting ? "Submitting..." : "Submit Application"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  try { localStorage.removeItem(STORAGE_KEY); } catch {}
                  setForm(initialState);
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
      </div>
    </div>
  );
}