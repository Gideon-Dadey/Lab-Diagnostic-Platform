import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, User, Shield } from "lucide-react";

const ProfileView = ({ user }) => {
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-500">
        No user data available
      </div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 sm:p-8 space-y-6 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          {user.image ? (
            <img
              src={user.image}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
            />
          ) : (
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-semibold">
              {user.firstName?.[0] || "?"}
            </div>
          )}
        </div>

        <div className="mt-4 space-y-1">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base capitalize">
            {user.role || "User"}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
        <InfoRow icon={<Mail className="text-blue-500" />} label="Email" value={user.email} />
        <InfoRow icon={<Phone className="text-green-500" />} label="Phone" value={user.phoneNo || "N/A"} />
        <InfoRow icon={<Shield className="text-purple-500" />} label="Role" value={user.role} />
      </div>
    </motion.div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 text-sm sm:text-base">
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800">
      {icon}
    </div>
    <div className="flex-1">
      <p className="font-medium text-gray-800 dark:text-gray-200">{label}</p>
      <p className="text-gray-500 truncate">{value}</p>
    </div>
  </div>
);

export default ProfileView;
