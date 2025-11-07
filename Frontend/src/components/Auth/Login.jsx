import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaSignInAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaApple } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';
import { toast } from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { post } from '../../Services/ApiEndpoints';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../../redux/AuthSlice';
import bgImage from "../../assets/Login.jpg";



const schema = yup.object().shape({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const PasswordStrength = ({ password }) => {
  const score = useMemo(() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  }, [password]);

  const labels = ["Too weak", "Weak", "Okay", "Good", "Strong"];
  const barColors = [
    "bg-rose-400",
    "bg-rose-400",
    "bg-amber-400",
    "bg-emerald-400",
    "bg-emerald-600",
  ];

  return (
    <div className="mt-2">
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${barColors[score]}`}
          style={{ width: `${(score / 4) * 100}%` }}
          aria-hidden="true"
        />
      </div>
      <p className="text-xs mt-1 text-gray-500">{labels[score]}</p>
    </div>
  );
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth || {});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem('authToken'));
  const [showPassword, setShowPassword] = useState(false);
  const [magicSending, setMagicSending] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    reValidateMode: 'onChange'
  });

  const watchedPassword = watch('password', '');

  useEffect(() => {
    const pathname = window.location.pathname;
    if (user && (pathname === "/login" || pathname === "/")) {
      const role = user.role?.toLowerCase()?.replace(/\s+/g, '');
      if (role === "superadmin") navigate("/admin/super/overview", { replace: true });
      else if (role === "labadmin") navigate("/labadmin/lab/overview", { replace: true });
      else navigate("/user", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await post('/api/auth/login', formData);
      const userData = res.data.data;

      if (userData?.forcePasswordChange) {
        toast.error("You must change your password before continuing.");
        navigate(`/reset-password-force/${userData._id}`);
        return;
      }

      
      if (rememberMe) {
        localStorage.setItem('authToken', res.data.token);
      } else {
        sessionStorage.setItem('authToken', res.data.token);
      }

      localStorage.setItem("userId", userData._id);
      dispatch(SetUser(userData));
      toast.success(res.data.message || "Login successful!");

      const role = userData.role?.toLowerCase()?.replace(/\s+/g, '');
      if (role === "superadmin") navigate("/admin/super/overview");
      else if (role === "labadmin") navigate("/labadmin/lab/labdashboard");
      else navigate("/user");

    } catch (err) {
      const message = err?.response?.data?.message || "Login failed";
      toast.error(message);

      if (message.toLowerCase().includes("invalid")) {
        setError("email", { message: "Invalid email or password" });
        setError("password", { message: "Invalid email or password" });
      }

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

  const handleMagicLink = async () => {
    setMagicSending(true);
    const email = (document.querySelector('input[name="email"]') || {}).value;
    if (!email) {
      toast.error("Enter your email to receive a magic link.");
      setMagicSending(false);
      return;
    }
    try {
      await post('/api/auth/magic-link', { email });
      toast.success("Magic link sent. Check your inbox.");
    } catch (err) {
      toast.error("Failed to send magic link.");
    } finally {
      setMagicSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch" style={{ minHeight: 700 }}>
        {}
        <div className="hidden md:block md:col-span-6 relative rounded-3xl overflow-hidden shadow-xl h-full">
          <img
            src={bgImage}
            alt="Laboratory hero"
            className="absolute inset-0 w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700/60 via-transparent to-emerald-600/30 mix-blend-multiply" />
          <div className="relative z-10 p-10 h-full flex flex-col justify-between text-white">
            <div>
              <div className="inline-flex items-center gap-3 bg-white/10 px-3 py-1 rounded-full mb-6">
                <span className="text-xs font-semibold">Pragma Health</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight drop-shadow">
                Secure access to diagnostics and insights
              </h1>
              <p className="mt-4 text-sm md:text-base max-w-lg">
                Access your reports, manage lab integrations, and collaborate with clinicians — all in one secure platform.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/10 rounded-lg border border-white/10">
                <h4 className="text-sm font-semibold">Trusted Labs</h4>
                <p className="text-xs mt-1">500+ accredited partners</p>
              </div>
              <div className="p-4 bg-white/10 rounded-lg border border-white/10">
                <h4 className="text-sm font-semibold">Fast Results</h4>
                <p className="text-xs mt-1">Most tests within 24–48 hours</p>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="col-span-1 md:col-span-6 bg-white rounded-3xl shadow-lg p-8 md:p-10 flex flex-col justify-center h-full">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">Welcome back</h2>
                <p className="mt-1 text-sm text-gray-600">Sign in to your account to continue</p>
              </div>
              <div className="text-xs text-gray-400">Secure · HIPAA-aware</div>
            </div>
          </div>

          {}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:shadow-sm transition text-sm"
              onClick={() => toast('Google sign-in placeholder')}
              aria-label="Sign in with Google"
            >
              <FaGoogle className="text-red-500" /> Sign in with Google
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:shadow-sm transition text-sm"
              onClick={() => toast('Apple sign-in placeholder')}
              aria-label="Sign in with Apple"
            >
              <FaApple /> Sign in with Apple
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-500">or continue with email</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            {}
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder=" "
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "err-email" : undefined}
                className={`peer w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-rose-500' : 'border-gray-200'} bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm`}
                {...register("email")}
              />
              <label htmlFor="email" className="absolute left-4 -top-2.5 px-1 text-xs bg-white text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 transition-all pointer-events-none">
                Email
              </label>
              {errors.email && <p id="err-email" className="text-rose-600 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {}
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder=" "
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "err-password" : undefined}
                className={`peer w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-rose-500' : 'border-gray-200'} bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm`}
                {...register("password")}
              />
              <label htmlFor="password" className="absolute left-4 -top-2.5 px-1 text-xs bg-white text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 transition-all pointer-events-none">
                Password
              </label>

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

              {errors.password && <p id="err-password" className="text-rose-600 text-xs mt-1">{errors.password.message}</p>}

              {}
              <PasswordStrength password={watchedPassword} />
            </div>

            {}
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-indigo-600"
                />
                Remember me
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleMagicLink}
                  className="text-indigo-600 hover:underline text-sm"
                  disabled={magicSending}
                >
                  {magicSending ? 'Sending...' : 'Send magic link'}
                </button>

                <Link to="/user/forgot-password" className="text-sm text-gray-600 hover:underline">Forgot password?</Link>
              </div>
            </div>

            {}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full inline-flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-white font-semibold transition ${loading ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                aria-live="polite"
              >
                {loading ? <ImSpinner2 className="animate-spin" /> : <FaSignInAlt />}
                <span>{loading ? 'Signing in...' : 'Sign in'}</span>
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            New here?{' '}
            <Link to="/register" className="text-indigo-600 font-medium hover:underline">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;