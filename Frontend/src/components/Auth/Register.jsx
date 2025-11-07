import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserPlus,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaApple,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { post } from "../../Services/ApiEndpoints.jsx";
import bgImage from "../../assets/sign up.jpg";




const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .matches(/^[a-zA-Z\s'-]+$/, "First name must contain only letters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .matches(/^[a-zA-Z\s'-]+$/, "Last name must contain only letters"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Include at least one uppercase letter")
    .matches(/[a-z]/, "Include at least one lowercase letter")
    .matches(/[0-9]/, "Include at least one number")
    .matches(/[@$!%*?&]/, "Include at least one special character"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

const PasswordStrength = ({ password }) => {
  const score = useMemo(() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[@$!%*?&]/.test(password)) s++;
    return s; 
  }, [password]);

  const width = `${(score / 4) * 100}%`;
  const color =
    score <= 1 ? "bg-rose-400" : score === 2 ? "bg-amber-400" : score === 3 ? "bg-emerald-400" : "bg-emerald-600";
  const label = ["Too weak", "Weak", "Okay", "Good", "Strong"][score];

  return (
    <div className="mt-2" aria-hidden={false}>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-2 rounded-full transition-all duration-300 ${color}`} style={{ width }} />
      </div>
      <p className="text-xs mt-1 text-gray-500">{label}</p>
    </div>
  );
};

const FloatingInput = ({
  id,
  name,
  label,
  icon,
  register,
  type = "text",
  error,
  ariaDescribedBy,
  autoComplete,
  childrenRight,
}) => {
  const hasError = !!error;
  return (
    <div className="relative">
      <div
        className={`flex items-center gap-3 rounded-lg px-3 py-2 border bg-white transition ${
          hasError ? "border-rose-500" : "border-gray-200"
        } focus-within:ring-2 focus-within:ring-indigo-300`}
      >
        <span className="text-gray-400">{icon}</span>
        <input
          id={id || name}
          name={name}
          type={type}
          placeholder=" "
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={ariaDescribedBy}
          {...register(name)}
          className="peer bg-transparent outline-none flex-1 text-sm text-gray-900 placeholder-transparent"
        />
        {childrenRight}
      </div>

      {}
      <label
        htmlFor={id || name}
        className={`pointer-events-none absolute left-10 -top-2 px-1 text-xs transition-all ${
          hasError ? "text-rose-600" : "text-gray-500"
        } peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm`}
      >
        {label}
      </label>

      {hasError && (
        <p id={ariaDescribedBy} className="text-rose-600 text-xs mt-1" role="alert">
          {error?.message}
        </p>
      )}
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const watched = watch();
  const passwordValue = watched.password || "";

  const completion = useMemo(() => {
    const keys = ["firstName", "lastName", "email", "password", "confirmPassword"];
    const filled = keys.reduce((acc, k) => (watched[k] && String(watched[k]).trim() ? acc + 1 : acc), 0);
    return Math.round((filled / keys.length) * 100);
  }, [watched]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await post("/api/auth/register", data);

      
      if (response?.status === 201 || response?.status === 200) {
        toast.success(response.data?.message || "Registered successfully!");
        
        navigate("/check-email");
      } else {
        toast.error(response?.data?.message || "Registration returned unexpected status");
      }
    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed. Try again.";
      toast.error(message);

      if (err?.response?.data?.errors) {
        const serverErrors = err.response.data.errors;
        for (const field in serverErrors) {
          setError(field, { message: serverErrors[field] });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {}
        <div className="hidden md:block md:col-span-6 relative rounded-3xl overflow-hidden shadow-lg">
          <img src={bgImage} alt="Lab hero" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700/60 via-transparent to-emerald-600/30 mix-blend-multiply" />
          <div className="relative z-10 p-10 h-full flex flex-col justify-between text-white">
            <div>
              <div className="inline-flex items-center gap-3 bg-white/10 px-3 py-1 rounded-full mb-6">
                <span className="text-xs font-semibold">Pragma Health</span>
              </div>

              <h1 className="text-3xl font-extrabold leading-tight">Join Pragma Health</h1>
              <p className="mt-3 text-sm max-w-lg">
                Create your account to manage bookings, view reports, and collaborate with clinicians. Verified labs and secure access.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/10 rounded-lg border border-white/10">
                <h4 className="text-sm font-semibold">Trusted network</h4>
                <p className="text-xs mt-1">500+ labs</p>
              </div>
              <div className="p-4 bg-white/10 rounded-lg border border-white/10">
                <h4 className="text-sm font-semibold">Fast reporting</h4>
                <p className="text-xs mt-1">24–48 hour turnaround</p>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="col-span-1 md:col-span-6 flex items-center">
          <div className="w-full bg-white rounded-3xl shadow-xl p-8 md:p-10">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900">Create your account</h2>
              <p className="text-sm text-gray-600 mt-1">
                Already a member?{" "}
                <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            {}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">Completion</p>
                <p className="text-xs font-medium text-gray-600">{completion}%</p>
              </div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-indigo-600 to-emerald-400 transition-all" style={{ width: `${completion}%` }} />
              </div>
            </div>

            {}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => toast("Google sign-up placeholder")}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:shadow-sm transition text-sm"
                aria-label="Sign up with Google"
              >
                <FaGoogle className="text-red-500" /> Google
              </button>

              <button
                type="button"
                onClick={() => toast("Apple sign-up placeholder")}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:shadow-sm transition text-sm"
                aria-label="Sign up with Apple"
              >
                <FaApple /> Apple
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FloatingInput
                  name="firstName"
                  label="First name"
                  icon={<FaUser />}
                  register={register}
                  error={errors.firstName}
                  ariaDescribedBy="err-firstName"
                  autoComplete="given-name"
                />
                <FloatingInput
                  name="lastName"
                  label="Last name"
                  icon={<FaUser />}
                  register={register}
                  error={errors.lastName}
                  ariaDescribedBy="err-lastName"
                  autoComplete="family-name"
                />
              </div>

              <FloatingInput
                name="email"
                label="Email address"
                icon={<FaEnvelope />}
                register={register}
                error={errors.email}
                ariaDescribedBy="err-email"
                type="email"
                autoComplete="email"
              />

              <FloatingInput
                name="password"
                label="Password"
                icon={<FaLock />}
                register={register}
                error={errors.password}
                ariaDescribedBy="err-password"
                type={showPassword ? "text" : "password"}
                childrenRight={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-gray-500"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                }
                autoComplete="new-password"
              />

              {}
              <PasswordStrength password={passwordValue} />

              <FloatingInput
                name="confirmPassword"
                label="Confirm password"
                icon={<FaLock />}
                register={register}
                error={errors.confirmPassword}
                ariaDescribedBy="err-confirmPassword"
                type={showConfirm ? "text" : "password"}
                childrenRight={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="text-gray-500"
                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                }
                autoComplete="new-password"
              />

              <div className="mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full inline-flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-white font-semibold transition ${
                    loading ? "bg-indigo-400 cursor-wait" : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                  aria-live="polite"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaUserPlus />}
                  <span>{loading ? "Creating account..." : "Create Account"}</span>
                </button>
              </div>
            </form>

            <p className="mt-4 text-xs text-gray-500 text-center">
              By creating an account you agree to our{" "}
              <Link to="/terms" className="text-indigo-600 hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-indigo-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>

            {}
            <div aria-live="polite" className="sr-only" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;