import React, { useState } from "react";
import { State, City } from "country-state-city";
import { Eye, EyeOff } from "lucide-react";

import { registerUser } from "../services/authService";

const RegisterForm = ({ onSuccess, onBack, hideTitle }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    mobile: "",
    state: "",
    city: "",
    pincode: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value };
    if (field === "state") updated.city = "";
    setForm(updated);
    validate(updated);
  };

  const validate = (data) => {
    let err = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    const pincodeRegex = /^[0-9]{6}$/;

    if (data.name && data.name.length < 3) err.name = "Min 3 chars";
    if (data.email && !emailRegex.test(data.email)) err.email = "Invalid email";
    if (data.username && data.username.length < 3) err.username = "Min 3 chars";
    if (data.mobile && !mobileRegex.test(data.mobile)) err.mobile = "Invalid mobile";
    if (data.pincode && !pincodeRegex.test(data.pincode)) err.pincode = "Invalid pincode";
    if (data.password && data.password.length < 6) err.password = "Min 6 chars";
    if (data.confirmPassword && data.confirmPassword !== data.password) err.confirmPassword = "Mismatch";

    setErrors(err);
    return err;
  };

  const states = State.getStatesOfCountry("IN");
  const cities = form.state ? City.getCitiesOfState("IN", form.state) : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(form);
    if (Object.keys(err).length > 0) return;

    setLoading(true);
    try {
      const res = await registerUser({
        name: form.name,
        email: form.email,
        username: form.username || form.email,
        mobile: form.mobile,
        state: form.state,
        city: form.city,
        pincode: form.pincode,
        password: form.password
      });

      if (res.success) {
        alert("Registration Successful! Please verify OTP.");
        onSuccess();
      } else {
        alert(res.error || "Registration failed");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!hideTitle && <h2>Create Account</h2>}

      <form noValidate onSubmit={handleSubmit} style={{ margin: 0 }}>
        <div className="form-grid">
          <div className="input-group">
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="input-group">
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="input-group">
            <input
              placeholder="Username"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
            {errors.username && <p className="error-text">{errors.username}</p>}
          </div>

          <div className="input-group">
            <input
              placeholder="Mobile"
              maxLength={10}
              value={form.mobile}
              onChange={(e) => handleChange("mobile", e.target.value.replace(/\D/g, ""))}
            />
            {errors.mobile && <p className="error-text">{errors.mobile}</p>}
          </div>

          <div className="input-group">
            <select value={form.state} onChange={(e) => handleChange("state", e.target.value)}>
              <option value="">Select State</option>
              {states.map((s) => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
            </select>
          </div>

          <div className="input-group">
            <select value={form.city} onChange={(e) => handleChange("city", e.target.value)} disabled={!form.state}>
              <option value="">Select City</option>
              {cities.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          <div className="input-group">
            <input
              placeholder="Pincode"
              maxLength={6}
              value={form.pincode}
              onChange={(e) => handleChange("pincode", e.target.value.replace(/\D/g, ""))}
            />
            {errors.pincode && <p className="error-text">{errors.pincode}</p>}
          </div>

          {/* Password with toggle */}
          <div className="input-group">
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
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
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          {/* Confirm Password with toggle */}
          <div className="input-group">
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                style={{ backgroundImage: "none", paddingRight: "34px" }}
              />
              <div
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
          </div>
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: '10px' }}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <div className="create-account-row">
        <span>Already have account?</span>
        <span className="link" onClick={onBack}>Login</span>
      </div>
    </>
  );
};

export default RegisterForm;