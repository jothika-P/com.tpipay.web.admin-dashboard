import api from './api';
import { encryptPassword } from '../utils/encryption';

/**
 * Step 1: Get Public Key
 */
export const getPublicKey = async () => {
  try {
    const response = await api.get('/api/auth/public-key'); // ✅ FIXED PATH
    return response.data; // { publicKey: "..." }
  } catch (error) {
    console.error('Error fetching public key:', error);
    throw error;
  }
};

/**
 * Step 2 & 3: Initiate Login (includes encryption)
 */
export const loginUser = async ({ username, password }) => {
  try {
    const { publicKey } = await getPublicKey();

    const encryptedPassword = encryptPassword(password, publicKey);

    const response = await api.post('/api/auth/initiate-login', { // ✅ FIXED PATH
      username,
      encryptedPassword,
    });

    return {
      success: true,
      sessionId: response.data.sessionId,
    };
  } catch (error) {
    console.error('Login initiation failed:', error);
    const errorMessage = error.response?.data?.message || 'Invalid credentials';
    return {
      success: false,
      error: errorMessage,
      status: error.response?.status,
    };
  }
};

/**
 * Step 4 & 5: Verify OTP
 */
export const verifyOtp = async (sessionId, otp) => {
  try {
    const response = await api.post('/api/auth/verify-otp', { // ✅ FIXED PATH
      sessionId,
      otp,
    });

    const { token, user } = response.data;

    // ✅ STORE AUTH (already correct)
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('role', user.role);

    return {
      success: true,
      token,
      user,
    };
  } catch (error) {
    console.error('OTP verification failed:', error);
    const errorMessage = error.response?.data?.message || 'Invalid OTP';
    return {
      success: false,
      error: errorMessage,
      status: error.response?.status,
    };
  }
};

/**
 * Logout utility
 */
export const logout = () => {
  sessionStorage.clear();
  window.location.href = '/login';
};
