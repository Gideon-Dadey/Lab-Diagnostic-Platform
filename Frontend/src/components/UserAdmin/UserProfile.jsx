import React, { useEffect, useMemo, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaCamera, FaCheck, FaTimes, FaSignOutAlt, FaEdit } from "react-icons/fa";



function FieldRow({ label, children, hint }) {
  return (
    <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
      <label className="w-full md:w-44 text-sm text-gray-600">{label}</label>
      <div className="flex-1">{children}</div>
      {hint && <div className="w-full md:w-40 text-xs text-gray-400">{hint}</div>}
    </div>
  );
}

function SkeletonProfile() {
  return (
    <div className="bg-white rounded-xl p-6 shadow animate-pulse max-w-4xl mx-auto">
      <div className="flex gap-6">
        <div className="w-32 h-32 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-3 py-2">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth?.user);
  const token = useSelector((s) => s.auth?.token); 
  const [local, setLocal] = useState(null);
  const [mode, setMode] = useState("view"); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    // initialize local copy when user is available
    if (user) {
      setLocal({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNo: user.phoneNo || "",
        role: user.role || "User",
        image: user.image || "",
      });
      setAvatarPreview(user.image || "");
      setLoading(false);
    }
  }, [user]);

  const fullName = useMemo(() => {
    if (!local) return "";
    return `${local.firstName || ""} ${local.lastName || ""}`.trim();
  }, [local]);

  // Validation helpers
  const validate = () => {
    const errs = {};
    if (!local.firstName || local.firstName.trim().length < 2) errs.firstName = "Enter a valid first name";
    if (!local.lastName || local.lastName.trim().length < 2) errs.lastName = "Enter a valid last name";
    if (local.phoneNo && !/^\+?\d{7,15}$/.test(local.phoneNo)) errs.phoneNo = "Enter a valid phone number";
    return errs;
  };

  const [errors, setErrors] = useState({});

  
  const onSelectAvatar = (file) => {
    if (!file) return;
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Please select a PNG/JPEG/WebP image");
      return;
    }
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  
  const uploadAvatar = async (file) => {
    if (!file) return null;
    const fd = new FormData();
    fd.append("avatar", file);
    try {
      const res = await axios.post("/api/users/upload-avatar", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken") || token || ""}`,
        },
      });
      if (res.data?.success && res.data.url) return res.data.url;
      
      return res.data?.url || null;
    } catch (err) {
      console.error("Avatar upload failed", err);
      toast.error("Avatar upload failed. Try again.");
      return null;
    }
  };

  const onSave = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast.error("Please fix validation errors");
      return;
    }

    setSaving(true);
    try {
      
      let imageUrl = local.image;
      if (avatarFile) {
        const uploaded = await uploadAvatar(avatarFile);
        if (uploaded) imageUrl = uploaded;
      }

      const payload = {
        firstName: local.firstName.trim(),
        lastName: local.lastName.trim(),
        phoneNo: local.phoneNo?.trim() || "",
        image: imageUrl || "",
      };

      const res = await axios.put("/api/users/me", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || token || ""}`,
        },
      });

      if (res.data?.success) {
        const updated = res.data.user || { ...user, ...payload };
        
        dispatch({ type: "auth/updateUser", payload: updated });
        setLocal((prev) => ({ ...prev, ...payload }));
        setAvatarFile(null);
        toast.success("Profile updated");
        setMode("view");
      } else {
        toast.error(res.data?.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Update profile error", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const onLogout = () => {
    
    dispatch({ type: "auth/logout" });
    localStorage.removeItem("authToken");
    toast("Signed out", { icon: "👋" });
  };

  if (loading) return <SkeletonProfile />;

  if (!local)
    return <p className="text-gray-500 text-center py-10">No profile data available.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
            My Profile
            <span className="text-sm text-gray-500 font-medium">— {local.role}</span>
          </h2>

          <div className="flex items-center gap-3">
            {mode === "view" ? (
              <button
                onClick={() => setMode("edit")}
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
                aria-label="Edit profile"
              >
                <FaEdit /> Edit
              </button>
            ) : (
              <>
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-60"
                >
                  <FaCheck /> {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    
                    setLocal({
                      firstName: user.firstName || "",
                      lastName: user.lastName || "",
                      email: user.email || "",
                      phoneNo: user.phoneNo || "",
                      role: user.role || "User",
                      image: user.image || "",
                    });
                    setAvatarFile(null);
                    setAvatarPreview(user.image || "");
                    setErrors({});
                    setMode("view");
                  }}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  <FaTimes /> Cancel
                </button>
              </>
            )}

            <button
              onClick={onLogout}
              title="Sign out"
              className="ml-2 inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100"
            >
              <FaSignOutAlt /> Sign out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
          {}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="relative">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={`${fullName} avatar`}
                  className="w-36 h-36 rounded-full object-cover border-4 border-gray-100 shadow"
                />
              ) : (
                <div className="w-36 h-36 rounded-full bg-gray-100 flex items-center justify-center text-xl font-semibold text-gray-500 border-4 border-gray-100">
                  {local.firstName?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              {mode === "edit" && (
                <label
                  htmlFor="avatar"
                  className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow cursor-pointer border"
                  title="Change avatar"
                >
                  <FaCamera className="text-gray-600" />
                  <input
                    id="avatar"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onSelectAvatar(e.target.files?.[0])}
                  />
                </label>
              )}
            </div>

            <div className="text-center md:text-left text-sm text-gray-500">
              <div className="font-medium text-gray-800">{fullName || "Unnamed User"}</div>
              <div>{local.email}</div>
              <div className="mt-2 text-xs text-gray-400">
                Pro tip: use a clear headshot for better recognition.
              </div>
            </div>
          </div>

          {}
          <div className="space-y-4">
            <FieldRow label="Full name">
              {mode === "view" ? (
                <div className="text-lg font-medium text-gray-800">{fullName}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      value={local.firstName}
                      onChange={(e) => setLocal((p) => ({ ...p, firstName: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded ${errors.firstName ? "border-red-400" : "border-gray-300"}`}
                      aria-label="First name"
                    />
                    {errors.firstName && <div className="text-xs text-red-500 mt-1">{errors.firstName}</div>}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={local.lastName}
                      onChange={(e) => setLocal((p) => ({ ...p, lastName: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded ${errors.lastName ? "border-red-400" : "border-gray-300"}`}
                      aria-label="Last name"
                    />
                    {errors.lastName && <div className="text-xs text-red-500 mt-1">{errors.lastName}</div>}
                  </div>
                </div>
              )}
            </FieldRow>

            <FieldRow label="Email address">
              <div className="text-sm text-gray-700">{local.email}</div>
            </FieldRow>

            <FieldRow label="Phone number">
              {mode === "view" ? (
                <div className="text-sm text-gray-700">{local.phoneNo || "Not provided"}</div>
              ) : (
                <div>
                  <input
                    type="tel"
                    value={local.phoneNo || ""}
                    onChange={(e) => setLocal((p) => ({ ...p, phoneNo: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded ${errors.phoneNo ? "border-red-400" : "border-gray-300"}`}
                    aria-label="Phone number"
                    placeholder="+1234567890"
                  />
                  {errors.phoneNo && <div className="text-xs text-red-500 mt-1">{errors.phoneNo}</div>}
                </div>
              )}
            </FieldRow>

            <FieldRow label="Role">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">{local.role}</span>
            </FieldRow>

            {/* Optional: additional metadata / actions */}
            <div className="pt-2 border-t border-gray-100 mt-4 flex flex-col md:flex-row gap-3">
              <button
                onClick={() => {
                  // example trigger: show change-password flow or route to settings
                  toast("Change password flow not implemented in this component", { icon: "🔒" });
                }}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700 hover:bg-gray-100"
              >
                Change password
              </button>

              <button
                onClick={() => {
                  // request email verification resend (example)
                  axios.post("/api/users/resend-verification", {}, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken") || token || ""}` },
                  })
                    .then((res) => {
                      toast.success(res.data?.message || "Verification email sent");
                    })
                    .catch((err) => {
                      console.error(err);
                      toast.error("Unable to resend verification");
                    });
                }}
                className="px-4 py-2 bg-white border border-gray-200 rounded text-gray-700 hover:bg-gray-50"
              >
                Resend verification email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}