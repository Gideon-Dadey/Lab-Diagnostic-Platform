import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { CartProvider } from "react-use-cart";
import { useEffect, useState, Suspense, lazy } from "react";
import { useDispatch } from "react-redux";
import { SetUser, logoutUser } from './redux/AuthSlice';
import { get } from "./Services/ApiEndpoints";


import UserLayout from "./components/Layouts/UserLayout";
import SuperAdminLayout from "./components/SuperAdmin/SuperAdminLayout";
import LabAdminLayout from "./components/LabAdmin/LabAdminLayout";
import ScrollToTop from "./components/Layouts/ScrollToTop";
import ProtectedRoute from "./components/Layouts/ProtectedRoutes";
import Loader from "./components/Layouts/Loader";


const Users = lazy(() => import("./components/SuperAdmin/Users"));
const Labs = lazy(() => import("./components/SuperAdmin/Labs"));
const Overview = lazy(() => import("./components/SuperAdmin/Overview"));
const Inbox = lazy(() => import("./components/SuperAdmin/Inbox"));
const Settings = lazy(() => import("./components/SuperAdmin/Settings"));
const SuperadminProfile = lazy(() => import("./components/SuperAdmin/SuperadminProfile"));


const Home = lazy(() => import("./pages/NavbarPages/Home"));
const About = lazy(() => import("./pages/NavbarPages/About"));
const WhyUs = lazy(() => import("./pages/NavbarPages/WhyUs"));
const Privacy = lazy(() => import("./pages/NavbarPages/Privacy"));
const Contact = lazy(() => import("./pages/NavbarPages/Contact"));
const Features = lazy(() => import("./pages/NavbarPages/Features"));
const Login = lazy(() => import("./components/Auth/Login"));
const Register = lazy(() => import("./components/Auth/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SymptomDetails = lazy(() => import("./pages/Symptoms/SymptomDetails"));


const Orders = lazy(() => import("./components/LabAdmin/Orders"));
const OfferedTest = lazy(() => import("./components/LabAdmin/OfferedTest"));
const LabOverview = lazy(() => import("./components/LabAdmin/LabOverview"));
const OrderEdit = lazy(() => import("./components/LabAdmin/OrderEdit"));
const FAQ = lazy(() => import("./pages/Home/FAQ"));
const AIRecommendation = lazy(() => import("./components/Ai/AIRecommendation"));
const UserReview = lazy(() => import("./pages/Home/UserRev"));
const Messages = lazy(() => import("./components/LabAdmin/LabAdminInbox"));
const LabProfile = lazy(() => import("./components/LabAdmin/LabAdminProfileSettings"));
const Labes = lazy(() => import("./pages/Labs/Labs"));
const LabDetails = lazy(() => import("./pages/Labs/LabDetails"));
const TestPackages = lazy(() => import("./pages/Labs/TestPackages"));
const PlaceOrder = lazy(() => import("./pages/Labs/PlaceOrders"));
const ConfirmBookingDetails = lazy(() => import("./pages/Labs/ConfirmBookingDetails"));
const Payment = lazy(() => import("./components/Payment/Payment"));
const Failure = lazy(() => import("./components/Payment/Failure"));
const Success = lazy(() => import("./components/Payment/Success"));
const Partners = lazy(() => import("./pages/Partners/OurPartner"));
const Hero = lazy(() => import("./pages/Home/Hero"));
const UserInbox = lazy(() => import("./components/UserAdmin/UserInbox"));
const ForgotPassword = lazy(() => import("./components/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/Auth/ResetPassword"));
const LabAdminProfileSettings = lazy(() => import("./components/LabAdmin/LabAdminProfileSettings"));


const UserProfileLayout = lazy(() => import("./components/UserAdmin/UserProfileLayout"));
const UserProfile = lazy(() => import("./components/UserAdmin/UserProfile"));
const UserCart = lazy(() => import("./components/UserAdmin/Cart"));
const UserOrder = lazy(() => import("./components/UserAdmin/Orders"));
const UserReports = lazy(() => import("./components/UserAdmin/UserReports"));
const UserProfileEdit = lazy(() => import("./components/UserAdmin/UserProfileEdit"));
const EmailVerification = lazy(() => import("./components/Auth/EmailVerification"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const CheckEmail = lazy(() => import("./components/Auth/CheckEmail"));
const ResendVerification = lazy(() => import("./components/Auth/ResendEmailVerification"));
const ResetPasswordForce = lazy(() => import("./components/Auth/ResetPasswordForce"));
const Join = lazy(() => import("./pages/NavbarPages/Join"));
const AllTests = lazy(() => import("./pages/TestPackges/AllTests"));
const MenHealthPage = lazy(() => import("./pages/HealthConcernTest/MenHealthPage"));
const TestHealthConcern = lazy(() => import("./pages/HealthConcernTest/TestHealthConcern"));
const HealthLayout = lazy(() => import("./pages/HealthConcernTest/HealthLayout"));
const DiabetesCarePage = lazy(() => import("./pages/HealthConcernTest/DiabetesCarePage"));
const HeartHealthPage = lazy(() => import("./pages/HealthConcernTest/HeartHealthPage"));
const WomensHealthPage = lazy(() => import("./pages/HealthConcernTest/WomensHealthPage"));
const SeniorCarePage = lazy(() => import("./pages/HealthConcernTest/SeniorCareHealthPage"));
const ChildHealthPage = lazy(() => import("./pages/HealthConcernTest/ChildHealthPage"));
const MostUsedLayout = lazy(() => import("./pages/MostUsed/MostUsedLayout"));
const CBC = lazy(() => import("./pages/MostUsed/CBC"));
const DiabetesScreening = lazy(() => import("./pages/MostUsed/DiabetesScreening"));
const LipidProfile = lazy(() => import("./pages/MostUsed/LipidProfile"));
const ThyroidProfile = lazy(() => import("./pages/MostUsed/ThyroidProfile"));
const MostUsed = lazy(() => import("./pages/MostUsed/MostUsed"));
const SearchResults = lazy(() => import('./components/Search/SearchResults'));


const RouteSuspense = ({ children }) => (
  <Suspense fallback={<Loader />}>
    {children}
  </Suspense>
);

const AppRoutes = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const publicRoutes = [
        '/', 
        '/login',
        '/register',
        '/verify-email',
        '/resend-verification',
        '/check-email',
        '/user/forgot-password',
        '/reset-password',
        '/reset-password-force'
      ];

      const isPublic = publicRoutes.some(route => window.location.pathname === route || window.location.pathname.startsWith(route));
      if (isPublic) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) {
          dispatch(logoutUser());
          navigate('/login');
          return;
        }
        const request = await get('/api/auth/getuser');
        if (request.status === 200) {
          dispatch(SetUser(request.data.user));
        }
      } catch (error) {
        dispatch(logoutUser());
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [dispatch, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <CartProvider>
      <ScrollToTop />
      <Toaster position="top-right" />
      <Routes>
        {}
        <Route path="register" element={<RouteSuspense><Register /></RouteSuspense>} />
        <Route path="login" element={<RouteSuspense><Login /></RouteSuspense>} />
        <Route path="/verify-email" element={<RouteSuspense><EmailVerification /></RouteSuspense>} />
        <Route path="/resend-verification" element={<RouteSuspense><ResendVerification /></RouteSuspense>} />
        <Route path="/user/forgot-password" element={<RouteSuspense><ForgotPassword /></RouteSuspense>} />
        <Route path="/reset-password/:token" element={<RouteSuspense><ResetPassword /></RouteSuspense>} />
        <Route path="/check-email" element={<RouteSuspense><CheckEmail /></RouteSuspense>} />
        <Route path="/reset-password-force/:id" element={<RouteSuspense><ResetPasswordForce /></RouteSuspense>} />

        {}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<RouteSuspense><Home /></RouteSuspense>} />
          <Route path="about" element={<RouteSuspense><About /></RouteSuspense>} />
          <Route path="contact" element={<RouteSuspense><Contact /></RouteSuspense>} />
          <Route path="join" element={<RouteSuspense><Join /></RouteSuspense>} />
          <Route path="privacy-policy" element={<RouteSuspense><Privacy /></RouteSuspense>} />
          <Route path="testimonials" element={<RouteSuspense><UserReview /></RouteSuspense>} />
          <Route path="features" element={<RouteSuspense><Features /></RouteSuspense>} />
          <Route path="why-us" element={<RouteSuspense><WhyUs /></RouteSuspense>} />
          <Route path="faq" element={<RouteSuspense><FAQ /></RouteSuspense>} />
          <Route path="symptoms" element={<RouteSuspense><SymptomDetails /></RouteSuspense>} />
          <Route path="symptoms/:symptomId" element={<RouteSuspense><SymptomDetails /></RouteSuspense>} />
          <Route path="partners" element={<RouteSuspense><Partners /></RouteSuspense>} />
          <Route path="services" element={<RouteSuspense><Hero /></RouteSuspense>} />
        </Route>

        {}
        <Route path="/" element={<HealthLayout />}>
          <Route path="tests-by-concern" element={<RouteSuspense><TestHealthConcern /></RouteSuspense>} />
          <Route path="men's-health" element={<RouteSuspense><MenHealthPage /></RouteSuspense>} />
          <Route path="diabetes-care" element={<RouteSuspense><DiabetesCarePage /></RouteSuspense>} />
          <Route path="heart-health" element={<RouteSuspense><HeartHealthPage /></RouteSuspense>} />
          <Route path="women's-health" element={<RouteSuspense><WomensHealthPage /></RouteSuspense>} />
          <Route path="senior-care" element={<RouteSuspense><SeniorCarePage /></RouteSuspense>} />
          <Route path="child-health" element={<RouteSuspense><ChildHealthPage /></RouteSuspense>} />
        </Route>

        {}
        <Route path="tests" element={<RouteSuspense><MostUsed /></RouteSuspense>} />
        <Route path="/most-used" element={<MostUsedLayout />}>
          <Route path="cbc" element={<RouteSuspense><CBC /></RouteSuspense>} />
          <Route path="diabetes-screening" element={<RouteSuspense><DiabetesScreening /></RouteSuspense>} />
          <Route path="thyroid-profile" element={<RouteSuspense><ThyroidProfile /></RouteSuspense>} />
          <Route path="lipid-profile" element={<RouteSuspense><LipidProfile /></RouteSuspense>} />
        </Route>

        {}
        <Route path="/" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
          <Route path="ai-recommendations-test" element={<RouteSuspense><AIRecommendation /></RouteSuspense>} />
          <Route path="labs" element={<RouteSuspense><Labes /></RouteSuspense>} />
          <Route path="/labs/:id/details" element={<RouteSuspense><LabDetails /></RouteSuspense>} />
          <Route path="/labs/:id/testpackage" element={<RouteSuspense><TestPackages /></RouteSuspense>} />
          <Route path="place-order" element={<RouteSuspense><PlaceOrder /></RouteSuspense>} />
          <Route path="confirm-booking" element={<RouteSuspense><ConfirmBookingDetails /></RouteSuspense>} />
          <Route path="payment" element={<RouteSuspense><Payment /></RouteSuspense>} />
          <Route path="payment/success" element={<RouteSuspense><Success /></RouteSuspense>} />
          <Route path="payment/failure" element={<RouteSuspense><Failure /></RouteSuspense>} />
          <Route path="/user/inbox" element={<RouteSuspense><UserInbox /></RouteSuspense>} />
          <Route path="all-tests-packages" element={<RouteSuspense><AllTests /></RouteSuspense>} />
        </Route>

        {}
        <Route path="/user" element={<ProtectedRoute roles={['user']}><UserProfileLayout /></ProtectedRoute>}>
          <Route index element={<RouteSuspense><UserProfile /></RouteSuspense>} />
          <Route path="profile" element={<RouteSuspense><UserProfile /></RouteSuspense>} />
          <Route path="edit" element={<RouteSuspense><UserProfileEdit isEdit /></RouteSuspense>} />
          <Route path="cart" element={<RouteSuspense><UserCart /></RouteSuspense>} />
          <Route path="orders" element={<RouteSuspense><UserOrder /></RouteSuspense>} />
          <Route path="messages" element={<RouteSuspense><UserInbox /></RouteSuspense>} />
          <Route path="reports" element={<RouteSuspense><UserReports /></RouteSuspense>} />
        </Route>

        {}
        <Route
          path="/admin/super"
          element={
            <ProtectedRoute roles={['superadmin']}>
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RouteSuspense><Overview /></RouteSuspense>} />
          <Route path="overview" element={<RouteSuspense><Overview /></RouteSuspense>} />
          <Route path="users" element={<RouteSuspense><Users /></RouteSuspense>} />
          <Route path="labs" element={<RouteSuspense><Labs /></RouteSuspense>} />
          <Route path="inbox" element={<RouteSuspense><Inbox /></RouteSuspense>} />
          <Route path="profile" element={<RouteSuspense><SuperadminProfile /></RouteSuspense>} />
        </Route>

        {}
        <Route
          path="/labadmin/lab"
          element={
            <ProtectedRoute roles={['labadmin']}>
              <LabAdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RouteSuspense><LabOverview /></RouteSuspense>} />
          <Route path="overview" element={<RouteSuspense><LabOverview /></RouteSuspense>} />
          <Route path="labdashboard" element={<RouteSuspense><LabOverview /></RouteSuspense>} />
          <Route path="profile" element={<RouteSuspense><LabProfile /></RouteSuspense>} />
          <Route path="orders" element={<RouteSuspense><Orders /></RouteSuspense>} />
          <Route path="orders/edit/:orderId" element={<RouteSuspense><OrderEdit /></RouteSuspense>} />
          <Route path="tests" element={<RouteSuspense><OfferedTest /></RouteSuspense>} />
          <Route path="messages" element={<RouteSuspense><Messages /></RouteSuspense>} />
          <Route path="settings" element={<RouteSuspense><LabAdminProfileSettings /></RouteSuspense>} />
        </Route>

        {}
        <Route path="/search" element={<RouteSuspense><SearchResults /></RouteSuspense>} />

        {}
        <Route path="*" element={<RouteSuspense><NotFound /></RouteSuspense>} />
        <Route path="unauthorized" element={<RouteSuspense><Unauthorized /></RouteSuspense>} />
      </Routes>
    </CartProvider>
  );
};

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;