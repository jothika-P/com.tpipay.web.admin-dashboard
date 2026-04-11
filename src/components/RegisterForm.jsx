import React, { useState } from "react";
import { State, City, Country } from "country-state-city";

const RegisterForm = ({ onSuccess, onBack }) => {
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

    // reset city when state changes
    if (field === "state") {
      updated.city = "";
    }

    setForm(updated);
    validate(updated);
  };

  const validate = (data) => {
    let err = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    const pincodeRegex = /^[0-9]{6}$/;

    if (data.name && data.name.length < 3) {
      err.name = "Min 3 characters required";
    }

    if (data.email && !emailRegex.test(data.email)) {
      err.email = "Invalid email";
    }

    if (data.mobile && !mobileRegex.test(data.mobile)) {
      err.mobile = "Invalid mobile number";
    }

    if (data.pincode && !pincodeRegex.test(data.pincode)) {
      err.pincode = "Invalid pincode";
    }

    if (data.password && data.password.length < 6) {
      err.password = "Min 6 characters required";
    }

    if (data.confirmPassword && data.confirmPassword !== data.password) {
      err.confirmPassword = "Passwords not matching";
    }

    setErrors(err);
    return err;
  };

  // ✅ INDIA STATES
  const states = State.getStatesOfCountry("IN");

  // ✅ CITIES based on selected state
  const cities = form.state
    ? City.getCitiesOfState("IN", form.state)
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();

    const err = validate(form);

    if (Object.keys(err).length === 0) {
      onSuccess();
    }
  };

  return (
    <>
      <h2>Create Account</h2>

      <form noValidate onSubmit={handleSubmit}>
        <div className="form-grid">

          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {errors.name && <p className="error">{errors.name}</p>}

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            placeholder="Mobile"
            maxLength={10}
            value={form.mobile}
            onChange={(e) =>
              handleChange("mobile", e.target.value.replace(/\D/g, ""))
            }
          />
          {errors.mobile && <p className="error">{errors.mobile}</p>}

          {/* 🔥 STATE DROPDOWN (INDIA ALL STATES) */}
          <select
            value={form.state}
            onChange={(e) => handleChange("state", e.target.value)}
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.isoCode} value={s.isoCode}>
                {s.name}
              </option>
            ))}
          </select>

          {/* 🔥 CITY DROPDOWN (BASED ON STATE) */}
          <select
            value={form.city}
            onChange={(e) => handleChange("city", e.target.value)}
            disabled={!form.state}
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            placeholder="Pincode"
            maxLength={6}
            value={form.pincode}
            onChange={(e) =>
              handleChange("pincode", e.target.value.replace(/\D/g, ""))
            }
          />
          {errors.pincode && <p className="error">{errors.pincode}</p>}

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) =>
              handleChange("confirmPassword", e.target.value)
            }
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}

        </div>

        <button type="submit">Register</button>
      </form>

      <p className="signup-text">
        Already have account?{" "}
        <span className="link" onClick={onBack}>
          Login
        </span>
      </p>
    </>
  );
};

export default RegisterForm;