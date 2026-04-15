import api from "./api";
import { encryptPassword } from "../utils/encryption";

/* ================= 🔐 GET PUBLIC KEY ================= */
export const getPublicKey = async () => {
  try {
    const response = await api.get("api/auth/public-key"); 
    return response.data; 
  } catch (error) {
    console.error("Error fetching public key:", error);
    throw error;
  }
};

/* ================= 🔑 LOGIN (STEP 1 + 2) ================= */
export const loginUser = async ({ username, password }) => {
  try {
    const { publicKey } = await getPublicKey();
    const encryptedPassword = encryptPassword(password, publicKey);

    const response = await api.post("api/auth/initiate-login", {
      username,
      encryptedPassword,
    });

    return {
      success: true,
      sessionId: response.data.sessionId,
    };
  } catch (error) {
    console.error("Login initiation failed:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Login failed",
      status: error.response?.status,
    };
  }
};

/* ================= 🔢 VERIFY OTP ================= */
export const verifyOtp = async (sessionId, otp) => {
  try {
    const response = await api.post("api/auth/verify-otp", {
      sessionId,
      otp,
    });

    const { token, user } = response.data;

    // ✅ NORMALIZE ROLE
    let role = user.role?.toUpperCase() || "";
    if (role === "RELATIONSHIP_MANAGER") role = "RM";
    if (role === "LEGAL_TEAM") role = "LEGALTEAM";

    // ✅ Store auth details in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", role);

    return {
      success: true,
      token,
      user,
      role,
    };
  } catch (error) {
    console.error("OTP verification failed:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Invalid OTP",
      status: error.response?.status,
    };
  }
};

/* ================= 📝 REGISTER USER ================= */
export const registerUser = async (data) => {
  try {
    const response = await api.post("users/upsert", {
      ...data,
      operation: "create",
      isActive: true,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Registration failed:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Registration failed",
      status: error.response?.status,
    };
  }
};

/* ================= 🚪 LOGOUT ================= */
export const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};

