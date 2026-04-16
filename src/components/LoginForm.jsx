import React, { useState } from "react";
import { loginUser } from "../services/authService";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = ({ onSuccess, onSignup, hideTitle }) => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!form.username || !form.password) {
      alert("Enter credentials");
      return;
    }

    const res = await loginUser(form);

    if (res.success) {
      // ✅ STORE sessionId (NEW FIX)
      localStorage.setItem("sessionId", res.sessionId);
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

      <div style={{ position: "relative", width: "100%" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          style={{ backgroundImage: "none", paddingRight: "34px" }}
        />
        <div
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: "4px",
            top: "50%",
            transform: "translateY(-50%)",
            marginTop: "-12px",
            cursor: "pointer",
            color: "rgba(255, 255, 255, 0.6)",
            display: "flex",
            alignItems: "center"
          }}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </div>
      </div>

      <button onClick={handleSubmit}>Login</button>

    </>
  );
};

export default LoginForm;
