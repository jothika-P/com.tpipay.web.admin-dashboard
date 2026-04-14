import React, { useState } from "react";
import { loginUser } from "../services/authService";

const LoginForm = ({ onSuccess, onSignup, hideTitle }) => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async () => {
    if (!form.username || !form.password) {
      alert("Enter credentials");
      return;
    }

    const res = await loginUser(form);

    if (res.success) {
      // ✅ STORE sessionId (NEW FIX)
      sessionStorage.setItem("sessionId", res.sessionId);

      localStorage.setItem("tempRole", res.tempRole);
      onSuccess();
    } else {
      alert(res.error || "Invalid login");
    }
  };

  return (
    <>
      {!hideTitle && <h2>Sign In</h2>}

      <input
        placeholder="Username"
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <div className="forgot-row">
        <span>Reset password?</span>
      </div>

      <button onClick={handleSubmit}>Login</button>

      <div className="create-account-row">
        <span>New user?</span>
        <span className="link" onClick={onSignup}>
          Create Account
        </span>
      </div>
    </>
  );
};

export default LoginForm;
