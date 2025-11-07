import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCamera, FaCheck, FaTimes } from "react-icons/fa";
import { updateUser as updateUserAction } from "../../redux/AuthSlice";



function SkeletonBox() {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 max-w-4xl mx-auto animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
      <div className="flex gap-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

export default function EditProfile() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth?.user);
  const tokenFromState = useSelector((s) => s.auth?.token);
  const authToken = useMemo(() => localStorage.getItem("authToken") || tokenFromState || "", [tokenFromState]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
  });
  const [original, setOriginal] = useState(null); // keep original to detect changes
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      const initial = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNo: user.phoneNo || "",
      };
      setFormData(initial);
      setOriginal(initial);
      setPreview(user.image || "");
    }
  }, [user]);

  // Basic client-side validation
  const validate = () => {
    const e = {};
    if (!formData.firstName || formData.firstName.trim().length < 2) {
      e.firstName = "First name must be at least 2 characters";
    }
    if (!formData.lastName || formData.lastName.trim().length < 2) {
      e.lastName = "Last name must be at least 2 characters";
    }
    if (formData.phoneNo && !/^\+?\d{7,15}$/.test(formData.phoneNo.trim())) {
      e.phoneNo = "Enter a valid phone number (7–15 digits, optional leading +)";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const hasChanges = useMemo(() => {
    if (!original) return true;
    const nameChanged =
      original.firstName !== formData.firstName || original.lastName !== formData.lastName;
    const phoneChanged = (original.phoneNo || "") !== (formData.phoneNo || "");
    const avatarChanged = !!file || (!!preview && preview !== (user?.image || "")) === false ? false : !!file;
    return nameChanged || phoneChanged || avatarChanged;
  }, [formData, original, file, preview, user]);

  useEffect(() => {
    // revoke object URL when component unmounts or file changes
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFile = (selected) => {
    if (!selected) return;
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(selected.type)) {
      toast.error("Please upload a PNG, JPEG or WebP image");
      return;
    }
    if (selected.size > 2 * 1024 * 1024) {
      toast.error("Please use an image smaller than 2MB");
      return;
    }
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreview(url);
  };

  const clearAvatar = () => {
    setFile(null);
    setPreview("");
    // mark change so save is enabled
    setFormData((f) => ({ ...f }));
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!user || !user._id) {
      toast.error("User not loaded");
      return;
    }
    if (!validate()) {
      toast.error("Please fix validation errors");
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    try {
      const endpoint = `/api/auth/profile/${user._id}`; 
      const fd = new FormData();
      fd.append("firstName", formData.firstName.trim());
      fd.append("lastName", formData.lastName.trim());
      fd.append("phoneNo", formData.phoneNo?.trim() || "");
      if (file) fd.append("image", file);
      
      if (!file && preview === "" && user?.image) {
        fd.append("removeImage", "true");
      }

      const res = await axios.put(endpoint, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(pct);
        },
        timeout: 30000,
      });

      const body = res.data;
      if (body?.success) {
        const updatedUser = body.user || {
          ...user,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phoneNo: formData.phoneNo?.trim() || "",
          image: body.user?.image ?? (file ? preview : user?.image ?? ""),
        };

        // Dispatch update to redux store (adapt action signature if needed)
        try {
          dispatch(updateUserAction(updatedUser));
        } catch (err) {
          // fallback to generic action shape if slice differs
          dispatch({ type: "auth/updateUser", payload: updatedUser });
        }

        setOriginal({
          firstName: updatedUser.firstName || "",
          lastName: updatedUser.lastName || "",
          phoneNo: updatedUser.phoneNo || "",
        });
        setFile(null);
        setPreview(updatedUser.image || "");
        toast.success("Profile updated successfully");
      } else {
        toast.error(body?.message || "Update failed");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Network error while updating profile");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  if (!user) return <SkeletonBox />;

  return (
    <div className="bg-white shadow-md rounded-xl p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-50 flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="Avatar preview" className="w-full h-full object-cover" />
              ) : user.image ? (
                <img src={user.image} alt="Current avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400 font-semibold text-xl">
                  { (formData.firstName?.charAt(0) || user.firstName?.charAt(0) || "U").toUpperCase() }
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="avatar"
                className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded text-sm cursor-pointer hover:bg-gray-50"
                title="Upload new avatar"
              >
                <FaCamera />
                <span>Change</span>
                <input
                  id="avatar"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                  disabled={submitting}
                  aria-label="Upload avatar"
                />
              </label>

              <button
                type="button"
                onClick={clearAvatar}
                disabled={submitting && !file}
                className="inline-flex items-center gap-2 px-3 py-2 border rounded text-sm bg-white hover:bg-gray-50"
              >
                Remove
              </button>

              {uploadProgress > 0 && (
                <div className="w-40 bg-gray-100 rounded-full overflow-hidden h-2 mt-2">
                  <div style={{ width: `${uploadProgress}%` }} className="bg-primary h-full transition-all" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">First name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                  className={`mt-1 w-full px-3 py-2 border rounded ${errors.firstName ? "border-red-400" : "border-gray-300"}`}
                  disabled={submitting}
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName && <div className="text-xs text-red-500 mt-1">{errors.firstName}</div>}
              </div>

              <div>
                <label className="text-sm text-gray-600">Last name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                  className={`mt-1 w-full px-3 py-2 border rounded ${errors.lastName ? "border-red-400" : "border-gray-300"}`}
                  disabled={submitting}
                  aria-invalid={!!errors.lastName}
                />
                {errors.lastName && <div className="text-xs text-red-500 mt-1">{errors.lastName}</div>}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-600">Phone</label>
              <input
                type="tel"
                value={formData.phoneNo}
                onChange={(e) => setFormData((p) => ({ ...p, phoneNo: e.target.value }))}
                className={`mt-1 w-full px-3 py-2 border rounded ${errors.phoneNo ? "border-red-400" : "border-gray-300"}`}
                disabled={submitting}
                placeholder="+1234567890"
                aria-invalid={!!errors.phoneNo}
              />
              {errors.phoneNo && <div className="text-xs text-red-500 mt-1">{errors.phoneNo}</div>}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting || !hasChanges}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded text-white ${submitting || !hasChanges ? "bg-gray-300 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"}`}
                aria-disabled={submitting || !hasChanges}
              >
                {submitting ? <FaCheck className="animate-spin" /> : <FaCheck />} {submitting ? "Saving..." : "Save changes"}
              </button>

              <button
                type="button"
                onClick={() => {
                  
                  setFormData({ ...(original || {}) });
                  setFile(null);
                  setPreview(user?.image || "");
                  setErrors({});
                }}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded border bg-white hover:bg-gray-50"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}