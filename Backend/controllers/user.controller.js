import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/user.model.js";
import { generateToken } from "../utils/auth.util.js";
import { sendEmail } from "../utils/sendEmail.util.js";

/**
 * User controller
 *
 * Exports (named):
 * - checkUser
 * - userRegister
 * - userLogin
 * - forgotPassword
 * - resetPassword
 * - verifyEmail
 * - resendVerificationEmail
 * - resetPasswordForce
 * - userLogout
 * - getUserProfile
 * - updateUserProfile
 * - deleteUserAccount
 * - getUsers
 * - updateUser
 * - deleteUser
 *
 * Ensure your routes import these exact names.
 */

const isProduction = process.env.NODE_ENV === "production";

export const checkUser = async (req, res) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, message: "User authenticated", user });
  } catch (error) {
    console.error("Check user error:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const userRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    const errors = {};
    if (!firstName) errors.firstName = "First name is required";
    if (!lastName) errors.lastName = "Last name is required";
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    if (!confirmPassword) errors.confirmPassword = "Confirm password is required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
        errors: { confirmPassword: "Passwords do not match" },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
        errors: { email: "Please enter a valid email address" },
      });
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Weak password",
        errors: {
          password:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        },
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
        errors: { email: "This email is already registered" },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    try {
      await newUser.save();
    } catch (err) {
      if (err.name === "ValidationError") {
        const fieldErrors = {};
        for (const field in err.errors) {
          fieldErrors[field] = err.errors[field].message;
        }
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: fieldErrors,
        });
      }
      throw err;
    }

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const message = `
      <h2>Hello ${firstName},</h2>
      <p>Please click the link below to verify your email:</p>
      <a href="${verificationUrl}" target="_blank">${verificationUrl}</a>
    `;

    try {
      const emailResult = await sendEmail({
        to: email,
        subject: "Verify your email - Pragma Health LLC",
        html: message,
      });

      if (emailResult) {
        return res.status(201).json({
          success: true,
          message: "Registered successfully! Please check your email to verify your account.",
        });
      } else {
        return res.status(201).json({
          success: true,
          message:
            "Registered successfully! Email sending is not available on the server. Please ask an admin to resend verification or configure SMTP.",
        });
      }
    } catch (emailErr) {
      console.error("sendEmail failed after user creation:", emailErr);
      return res.status(201).json({
        success: true,
        message:
          "Registered successfully! We were unable to send the verification email. Please try resending verification or contact support.",
        emailError: emailErr.message || "Failed to send verification email",
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: "Please verify your email before logging in." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const token = generateToken(user._id, user.email, user.role);

    if (user.forcePasswordChange) {
      return res.status(200).json({
        success: true,
        message: "Force password change required.",
        redirectToReset: true,
        userId: user._id,
        data: user,
        token,
      });
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
    });

    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      ownedLab: user.ownedLab,
    };

    return res.status(200).json({ success: true, message: "Login successful", data: userResponse, token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Please provide your email" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found with this email" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `
      <h1>Password Reset Request</h1>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
    `;

    await sendEmail({ to: user.email, subject: "Password Reset Request", html: message });
    return res.status(200).json({ success: true, message: "Reset link sent to your email!" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Server error, try again later!" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) return res.status(400).json({ message: "Please provide both password fields." });
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match." });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Invalid or expired reset token." });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.forcePasswordChange = false;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successful!" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error, try again later!" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ success: false, message: "Verification token is required" });

    const user = await User.findOne({ verificationToken: token, verificationTokenExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, message: "Invalid or expired verification token" });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong during email verification.", error: error.message });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    if (user.isVerified) return res.status(400).json({ success: false, message: "Email is already verified." });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const message = `
      <h2>Hello ${user.firstName || "there"},</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" target="_blank" rel="noopener noreferrer">${verificationUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `;

    await sendEmail({ to: user.email, subject: "Verify Your Email - Pragma Health LLC", html: message });
    return res.status(200).json({ success: true, message: "Verification email resent successfully. Please check your inbox." });
  } catch (error) {
    console.error("Resend email error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong while resending email.", error: error.message });
  }
};

export const resetPasswordForce = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) return res.status(400).json({ message: "Please provide both password fields." });
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match." });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.forcePasswordChange = false;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successful. You can now log in." });
  } catch (err) {
    console.error("Force password reset error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const userLogout = (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, secure: isProduction, sameSite: isProduction ? "strict" : "lax" });
    return res.status(200).json({ success: true, message: "Logged out successfully", data: null });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found", data: null });
    return res.status(200).json({ success: true, message: "Profile retrieved successfully", data: user });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
      }
    }

    if (req.file && req.file.path) {
      updates.image = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, message: "Profile updated successfully", data: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error.message);
    return res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
  }
};

export const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found", data: null });

    res.clearCookie("token", { httpOnly: true, secure: isProduction, sameSite: isProduction ? "strict" : "lax" });
    return res.status(200).json({ success: true, message: "Account deleted successfully", data: null });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

/**
 * Admin / Super Admin user management
 */

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "labadmin" }).select("-password");
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: "Error fetching Lab Admins", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.params.id;
    const requestingUser = req.user;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (requestingUser.role !== "Super Admin" && requestingUser._id.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this profile" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Lab Admin not found" });

    await User.findByIdAndDelete(userId);
    return res.status(200).json({ message: "Lab Admin deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: "Error deleting Lab Admin", error: error.message });
  }
};