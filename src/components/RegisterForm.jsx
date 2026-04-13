import React, { useState } from "react";
import { State, City } from "country-state-city";

const RegisterForm = ({ onSuccess, onBack, hideTitle }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    state: "",
    city: "",
    pincode: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

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
    if (data.mobile && !mobileRegex.test(data.mobile)) err.mobile = "Invalid mobile";
    if (data.pincode && !pincodeRegex.test(data.pincode)) err.pincode = "Invalid pincode";
    if (data.password && data.password.length < 6) err.password = "Min 6 chars";
    if (data.confirmPassword && data.confirmPassword !== data.password) err.confirmPassword = "Mismatch";

    setErrors(err);
    return err;
  };

  const states = State.getStatesOfCountry("IN");
  const cities = form.state ? City.getCitiesOfState("IN", form.state) : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate(form);
    if (Object.keys(err).length === 0) onSuccess();
  };

  return (
    <>
      {!hideTitle && <h2>Create Account</h2>}

      <form noValidate onSubmit={handleSubmit} style={{ margin: 0 }}>
        <div className="form-grid">
          {/* Grouping Input + Error in a wrapper to prevent grid spacing issues */}
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

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
            />
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
          </div>
        </div>

        <button type="submit" style={{ marginTop: '10px' }}>Register</button>
      </form>

      <div className="create-account-row">
        <span>Already have account?</span>
        <span className="link" onClick={onBack}>Login</span>
      </div>
    </>
  );
};

export default RegisterForm;