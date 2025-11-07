import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { FaPaperPlane, FaSpinner, FaCheckCircle, FaSearch, FaTimes } from "react-icons/fa";
import { get, post } from "../../Services/ApiEndpoints";



const initialForm = {
  name: "",
  email: "",
  receiverType: "support",
  labId: "",
  subject: "",
  message: "",
  _honeypot: "", // invisible anti-bot field
};

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [labs, setLabs] = useState([]);
  const [labQuery, setLabQuery] = useState("");
  const [labOpen, setLabOpen] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    fetchLabs();
    return () => {
      mounted.current = false;
    };
  }, []);

  // Fetch labs with abort support and graceful fallback
  const fetchLabs = async () => {
    try {
      const controller = new AbortController();
      const signal = controller.signal;
      const timer = setTimeout(() => controller.abort(), 10_000); // 10s timeout

      const { data } = await get("/api/query/labs/all", { signal }).catch((err) => {
        if (err.name !== "AbortError") throw err;
      });

      clearTimeout(timer);
      if (!mounted.current) return;

      if (data?.labs) {
        setLabs(data.labs);
      } else {
        setLabs([]);
      }
    } catch (err) {
      console.error("Failed to fetch labs", err);
    }
  };

  
  const validate = (payload = form) => {
    const e = {};
    if (!payload.name || payload.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!payload.email || !/^\S+@\S+\.\S+$/.test(payload.email)) e.email = "Please enter a valid email.";
    if (!payload.subject || payload.subject.trim().length < 3) e.subject = "Please add a subject.";
    if (!payload.message || payload.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
    if (payload.receiverType === "labadmin" && !payload.labId) e.labId = "Please select a lab.";
    if (payload._honeypot && payload._honeypot.trim() !== "") e._honeypot = "Spam detected.";
    return e;
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "message") setCharCount(value.length);
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  
  const filteredLabs = labs.filter((l) =>
    `${l.name} ${l.location || ""}`.toLowerCase().includes(labQuery.toLowerCase())
  );

  const selectLab = (lab) => {
    setForm((prev) => ({ ...prev, labId: lab._id }));
    setLabQuery(lab.name);
    setLabOpen(false);
    setErrors((prev) => ({ ...prev, labId: undefined }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      const first = Object.values(validation)[0];
      toast.error(first);
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      receiverType: form.receiverType,
      labId: form.receiverType === "labadmin" ? form.labId : null,
      subject: form.subject.trim(),
      message: form.message.trim(),
    };

    try {
      const { data } = await post("/api/query/submit", payload);

      if (data) {
        toast.success("Message sent successfully!");
        setTimeout(() => {
          if (!mounted.current) return;
          setForm(initialForm);
          setCharCount(0);
          setLabQuery("");
        }, 600);
      } else {
        toast.error("Unexpected response from server. Please try again.");
      }
    } catch (err) {
      const serverMessage = err?.response?.data?.message;
      const fieldErrors = err?.response?.data?.errors || null;

      if (fieldErrors && typeof fieldErrors === "object") {
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }

      toast.error(serverMessage || "Something went wrong. Please try again.");
      console.error("Contact submit error:", err);
    } finally {
      if (mounted.current) setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-20">
      {}
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-32 w-96 h-96 rounded-full bg-indigo-500/6 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -bottom-40 w-[420px] h-[420px] rounded-full bg-cyan-500/6 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">Contact Us</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Have a question, feedback, or need help? Send us a message and our team will respond quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {}
          <aside className="h-full flex flex-col rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200/60 p-8 shadow-md">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in touch</h2>
              <p className="text-gray-600 mb-6">
                Our team is available to assist you with bookings, lab partnerships, technical support, and more.
              </p>

              <ul className="space-y-6">
                <li className="flex gap-4 items-start">
                  <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow">
                    <FaCheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Fast response</h3>
                    <p className="text-sm text-gray-600">We typically reply within 24 hours on business days.</p>
                  </div>
                </li>

                <li className="flex gap-4 items-start">
                  <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 text-white flex items-center justify-center shadow">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Secure & private</h3>
                    <p className="text-sm text-gray-600">We use industry-standard encryption to protect your data and communications.</p>
                  </div>
                </li>

                <li className="flex gap-4 items-start">
                  <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center shadow">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M3 10h4l3 9 4-18 3 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">24/7 emergency support</h3>
                    <p className="text-sm text-gray-600">For urgent matters, we have dedicated channels available any time.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Common Questions</h4>
              <dl className="text-sm space-y-3 text-gray-600">
                <div>
                  <dt className="font-medium">How fast will I get a reply?</dt>
                  <dd className="text-xs mt-1">Our goal is to respond within 24 hours on business days.</dd>
                </div>
                <div>
                  <dt className="font-medium">Is my data secure?</dt>
                  <dd className="text-xs mt-1">Yes — encrypted in transit and at rest. We follow best practices for privacy.</dd>
                </div>
              </dl>
            </div>
          </aside>

          {}
          <main className="h-full">
            <form
              onSubmit={handleSubmit}
              aria-labelledby="contact-title"
              className="relative rounded-2xl bg-white/95 backdrop-blur-md p-8 sm:p-10 border border-gray-200/60 shadow-lg"
              noValidate
            >
              <div className="flex items-center justify-between mb-6">
                <h2 id="contact-title" className="text-2xl font-semibold text-gray-900">Send us a message</h2>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Status</span>
                  <div aria-live="polite" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-700">
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin w-3 h-3" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="w-3 h-3 text-green-500" />
                        Ready
                      </>
                    )}
                  </div>
                </div>
              </div>

              {}
              <input
                type="text"
                name="_honeypot"
                value={form._honeypot}
                onChange={(e) => setForm((p) => ({ ...p, _honeypot: e.target.value }))}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 mb-2">Full name</span>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    required
                    className={`w-full p-3 rounded-lg border ${errors.name ? "border-rose-500" : "border-gray-200"} bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "error-name" : undefined}
                  />
                  {errors.name && <span id="error-name" className="text-xs text-rose-600 mt-1">{errors.name}</span>}
                </label>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 mb-2">Email</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    required
                    className={`w-full p-3 rounded-lg border ${errors.email ? "border-rose-500" : "border-gray-200"} bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "error-email" : undefined}
                  />
                  {errors.email && <span id="error-email" className="text-xs text-rose-600 mt-1">{errors.email}</span>}
                </label>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 mb-2">Send to</span>
                  <select
                    name="receiverType"
                    value={form.receiverType}
                    onChange={(e) => {
                      handleChange(e);
                      if (e.target.value !== "labadmin") {
                        setForm((p) => ({ ...p, labId: "" }));
                        setLabQuery("");
                      }
                    }}
                    className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    <option value="support">Support Team</option>
                    <option value="labadmin">Lab Admin</option>
                  </select>
                </label>

                {form.receiverType === "labadmin" ? (
                  <div className="flex flex-col relative">
                    <span className="text-sm text-gray-700 mb-2">Select lab</span>

                    <div className="relative">
                      <div className="relative">
                        <input
                          type="text"
                          role="combobox"
                          aria-expanded={labOpen}
                          aria-controls="lab-listbox"
                          value={labQuery}
                          onChange={(e) => {
                            setLabQuery(e.target.value);
                            setLabOpen(true);
                          }}
                          onFocus={() => setLabOpen(true)}
                          placeholder="Search labs..."
                          className={`w-full p-3 pr-10 rounded-lg border ${errors.labId ? "border-rose-500" : "border-gray-200"} bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                        />

                        <button
                          type="button"
                          onClick={() => {
                            setLabQuery("");
                            setLabOpen((v) => !v);
                          }}
                          aria-label="Toggle labs"
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-gray-500 hover:bg-gray-100"
                        >
                          {labOpen ? <FaTimes className="w-4 h-4" /> : <FaSearch className="w-4 h-4" />}
                        </button>
                      </div>

                      {labOpen && (
                        <ul
                          id="lab-listbox"
                          role="listbox"
                          className="mt-2 z-20 absolute w-full max-h-56 overflow-auto rounded-lg bg-white border border-gray-200 shadow-lg"
                        >
                          {filteredLabs.length === 0 && (
                            <li className="px-4 py-3 text-sm text-gray-500">No labs found.</li>
                          )}

                          {filteredLabs.map((lab) => (
                            <li
                              key={lab._id}
                              role="option"
                              aria-selected={form.labId === lab._id}
                              onClick={() => selectLab(lab)}
                              className="cursor-pointer px-4 py-3 hover:bg-indigo-50 flex items-center justify-between"
                            >
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{lab.name}</div>
                                {lab.location && <div className="text-xs text-gray-500 truncate">{lab.location}</div>}
                              </div>
                              <div className="text-xs text-gray-400">{lab.rating ? `${lab.rating}⭐` : ""}</div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {errors.labId && <span className="text-xs text-rose-600 mt-1">{errors.labId}</span>}
                  </div>
                ) : (
                  <div /> 
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-2">Subject</label>
                <input
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Short summary"
                  required
                  className={`w-full p-3 rounded-lg border ${errors.subject ? "border-rose-500" : "border-gray-200"} bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                  aria-invalid={!!errors.subject}
                  aria-describedby={errors.subject ? "error-subject" : undefined}
                />
                {errors.subject && <span id="error-subject" className="text-xs text-rose-600 mt-1">{errors.subject}</span>}
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  rows={7}
                  required
                  className={`w-full p-3 rounded-lg border ${errors.message ? "border-rose-500" : "border-gray-200"} bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none`}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "error-message" : undefined}
                />
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  {errors.message ? <span id="error-message" className="text-rose-600">{errors.message}</span> : <span>&nbsp;</span>}
                  <span>{charCount}/2000</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full inline-flex items-center justify-center gap-3 rounded-lg px-6 py-3 text-white font-medium ${isSubmitting ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"} focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-60`}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin w-4 h-4" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </div>

              {}
              <div aria-live="polite" className="mt-4">
                {}
              </div>
            </form>
          </main>
        </div>
      </div>
    </section>
  );
};

export default Contact;