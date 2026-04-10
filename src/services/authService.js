// const BASE_URL = "https://great-dryers-attack.loca.lt";

// export const getPublicKey = async () => {
//   const res = await fetch(`${BASE_URL}/api/auth/public-key`, {
//     method: "GET",
//     headers: {
//       "bypass-tunnel-reminder": "true",   // custom header
//       "Content-Type": "application/json"
//     }
//   });
//   return res.json();
// };


// export const loginUser = async ({ username, password }) => {
//   try {
//     // 1️⃣ Get public key
//     const { publicKey } = await getPublicKey();

//     // ⚠️ TEMP (replace with RSA later)
//     const encryptedPassword = btoa(password);

//     // 2️⃣ Call initiate login
//     const res = await fetch(`${BASE_URL}/api/auth/initiate-login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         username,
//         encryptedPassword,
//       }),
//     });

//     const data = await res.json();

//     return {
//       success: true,
//       sessionId: data.sessionId,
//     };
//   } catch (err) {
//     return { success: false };
//   }
// };

// export const verifyOtp = async (sessionId, otp) => {
//   try {
//     const res = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         sessionId,
//         otp,
//       }),
//     });

//     const data = await res.json();

//     return {
//       success: true,
//       token: data.token,
//       role: data.user?.role,
//     };
//   } catch (err) {
//     return { success: false };
//   }
// };


// ✅ LOGIN API (REQUIRED)
export const loginUser = async ({ username, password }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!username || !password) {
        resolve({ success: false });
        return;
      }

      resolve({ success: true });
    }, 300);
  });
};

// ✅ OTP VERIFY (ROLE BASED)
export const verifyOtp = async (otp) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("OTP RECEIVED:", otp);

      let role = null;

      if (otp === "111111") {
        role = "ADMIN";
      } else if (otp === "222222") {
        role = "RM";
      } else if (otp === "333333") {
        role = "LEGALTEAM";
      } else {
        resolve({ success: false });
        return;
      }

      resolve({
        success: true,
        token: "dummy-token",
        role,
      });
    }, 300);
  });
};