import React, { useState } from "react";
import { loginUser } from "../services/authService";

const LoginForm = ({ onSuccess, onSignup }) => {
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
      localStorage.setItem("tempRole", res.tempRole);
      onSuccess();
    } else {
      alert("Invalid login");
    }
  };

  return (
    <>
      <h2>Sign In</h2>

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

      <p className="signup-text">
        New user?{" "}
        <span className="link" onClick={onSignup}>
          Create Account
        </span>
      </p>
    </>
  );
};

export default LoginForm;