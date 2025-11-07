import React, { useMemo, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaUser,
  FaEdit,
  FaShoppingCart,
  FaBoxOpen,
  FaEnvelope,
  FaFileAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";


const linkBase =
  "flex items-center gap-3 w-full text-sm font-medium px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400";

function Badge({ value }) {
  if (!value) return null;
  return (
    <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700">
      {value}
    </span>
  );
}

export default function UserSidebar({
  compact = false,
  onNavigate,
  onCompactToggle,
  user: userProp,
  counts = {},
  className = "",
  closeOnNavigate = false, // used when sidebar is shown in a mobile drawer
}) {
  // prefer prop, fallback to redux store
  const reduxUser = useSelector?.((s) => s?.auth?.user);
  const user = userProp || reduxUser || null;

  const linkRefs = useRef([]);

  const links = useMemo(
    () => [
      { to: "profile", label: "Profile", Icon: FaUser, key: "profile" },
      { to: "edit", label: "Update Profile", Icon: FaEdit, key: "edit" },
      { to: "cart", label: "My Cart", Icon: FaShoppingCart, key: "cart", badge: counts.cart },
      { to: "orders", label: "My Orders", Icon: FaBoxOpen, key: "orders", badge: counts.orders },
      { to: "messages", label: "Inbox", Icon: FaEnvelope, key: "messages", badge: counts.messages },
      { to: "reports", label: "My Reports", Icon: FaFileAlt, key: "reports", badge: counts.reports },
    ],
    [counts]
  );

  const handleClick = useCallback(
    (e, to) => {
      if (typeof onNavigate === "function") onNavigate(to);
      if (closeOnNavigate && typeof onNavigate === "function") onNavigate(to); 
    },
    [onNavigate, closeOnNavigate]
  );

  
  const handleKeyDown = (e, index, to) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (index + 1) % linkRefs.current.length;
      linkRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (index - 1 + linkRefs.current.length) % linkRefs.current.length;
      linkRefs.current[prev]?.focus();
    } else if (e.key === "Enter") {
      
      if (typeof onNavigate === "function") onNavigate(to);
    }
  };

  return (
    <nav
      aria-label="User sidebar"
      className={`flex flex-col h-full min-h-[300px] ${className}`}
    >
      {}
      <div
        className={`rounded-xl bg-gradient-to-b ${
          compact ? "from-white/0 to-white/0" : "from-teal-50 to-white"
        } p-4 flex items-center gap-3 ${compact ? "justify-center" : ""}`}
      >
        <div className={`flex items-center gap-3 ${compact ? "flex-col" : "flex-row"}`}>
          <div
            className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ${
              compact ? "mx-auto" : ""
            }`}
            title={user ? `${user.firstName || ""} ${user.lastName || ""}` : "Your profile"}
          >
            {user?.image ? (
              <img src={user.image} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-teal-200 flex items-center justify-center text-teal-700 font-bold">
                {((user?.firstName || "U").charAt(0) || "U").toUpperCase()}
              </div>
            )}
          </div>

          {!compact && (
            <div className="flex flex-col text-sm overflow-hidden">
              <div className="font-semibold text-slate-900 truncate">
                {user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Your account"}
              </div>
              <div className="text-xs text-slate-500 truncate">{user?.email || "Member"}</div>
            </div>
          )}
        </div>

        {}
        <div className="ml-auto hidden md:flex items-center">
          <button
            onClick={() => (typeof onCompactToggle === "function" ? onCompactToggle(!compact) : null)}
            className="inline-flex items-center justify-center p-2 rounded-md bg-white border border-gray-100 text-slate-700 hover:bg-gray-50"
            aria-pressed={compact}
            title={compact ? "Expand sidebar" : "Compact sidebar"}
          >
            {compact ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>
      </div>

      {}
      <ul
        role="menu"
        className={`mt-4 space-y-1 px-1 ${compact ? "items-center" : ""} overflow-auto`}
      >
        {links.map((link, i) => {
          const Icon = link.Icon;
          return (
            <li key={link.to} role="none">
              <NavLink
                ref={(el) => (linkRefs.current[i] = el)}
                to={link.to}
                onClick={(e) => handleClick(e, link.to)}
                onKeyDown={(e) => handleKeyDown(e, i, link.to)}
                role="menuitem"
                end
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? "bg-teal-500 text-white" : "text-slate-700 hover:bg-slate-100"} ${
                    compact ? "justify-center px-2 py-2.5" : ""
                  }`
                }
                title={compact ? link.label : undefined}
              >
                <Icon className={`w-4 h-4 ${compact ? "" : "text-teal-600"}`} aria-hidden />
                {!compact && <span className="truncate">{link.label}</span>}
                <div className="ml-auto">{link.badge ? <Badge value={link.badge} /> : null}</div>
              </NavLink>
            </li>
          );
        })}
      </ul>

      {}
      <div className="mt-auto p-3">
        <div className="flex items-center gap-2">
          <NavLink
            to="/support"
            className={`flex-1 ${linkBase} text-slate-700 hover:bg-slate-100 justify-center md:justify-start`}
            onClick={() => onNavigate?.("support")}
          >
            <FaEnvelope className="w-4 h-4 text-slate-600" />
            {!compact && <span>Support</span>}
          </NavLink>

          <NavLink
            to="/settings"
            className={`flex-1 ${linkBase} text-slate-700 hover:bg-slate-100 justify-center md:justify-start`}
            onClick={() => onNavigate?.("settings")}
          >
            <FaEdit className="w-4 h-4 text-slate-600" />
            {!compact && <span>Settings</span>}
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

UserSidebar.propTypes = {
  compact: PropTypes.bool,
  onNavigate: PropTypes.func,
  onCompactToggle: PropTypes.func,
  user: PropTypes.object,
  counts: PropTypes.object,
  className: PropTypes.string,
  closeOnNavigate: PropTypes.bool,
};