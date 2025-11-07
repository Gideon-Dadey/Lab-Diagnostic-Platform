import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { Outlet, Link } from "react-router-dom";
import Topbar from "../Layouts/Topbar";
import HeaderUser from "../Headers/HeaderUser";
import { FaBars, FaTimes } from "react-icons/fa";

const UserSidebar = lazy(() => import("./UserSidebar"));
const Footer = lazy(() => import("../Headers/Footer"));

export default function UserProfileLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const drawerRef = useRef(null);
  const firstFocusableRef = useRef(null);

  useEffect(() => {
    
    const onKey = (e) => {
      if (e.key === "Escape" && sidebarOpen) setSidebarOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  useEffect(() => {
    
    if (sidebarOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-white px-3 py-2 rounded shadow"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <Topbar />
        <HeaderUser />
      </header>

      <div className="pt-6 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
            {}
            <aside
              className="hidden md:block border-r border-gray-100 p-4"
              aria-label="User menu"
            >
              <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded" />}>
                <UserSidebar />
              </Suspense>
            </aside>

            {}
            <div className="flex items-center justify-between md:hidden border-b border-gray-100 px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  aria-label="Open menu"
                  aria-expanded={sidebarOpen}
                  aria-controls="mobile-drawer"
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <FaBars />
                </button>
                <h1 className="text-lg font-medium">My Account</h1>
              </div>

              <nav aria-label="Quick links">
                <Link
                  to="/"
                  className="text-sm text-primary hover:underline"
                >
                  Home
                </Link>
              </nav>
            </div>

            {}
            {sidebarOpen && (
              <div
                id="mobile-drawer"
                role="dialog"
                aria-modal="true"
                ref={drawerRef}
                className="md:hidden fixed inset-0 z-50 flex"
              >
                {}
                <button
                  aria-hidden
                  onClick={() => setSidebarOpen(false)}
                  className="absolute inset-0 bg-black/40"
                />

                <div className="relative z-50 w-80 max-w-full bg-white h-full shadow-xl p-4 overflow-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Account menu</h2>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      aria-label="Close menu"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 hover:bg-gray-200"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <Suspense fallback={<div className="space-y-3"><div className="h-4 bg-gray-100 rounded w-2/3" /><div className="h-4 bg-gray-100 rounded w-1/2" /></div>}>
                    {}
                    <UserSidebar firstFocusableRef={firstFocusableRef} onNavigate={() => setSidebarOpen(false)} />
                  </Suspense>
                </div>
              </div>
            )}

            {}
            <main id="main" className="p-6">
              <div className="min-h-[60vh]">
                <Outlet />
              </div>

              <footer className="mt-8">
                <Suspense fallback={<div className="text-center text-sm text-gray-400">Loading footer…</div>}>
                  <Footer />
                </Suspense>
              </footer>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}