import React, { useState } from "react";

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

  const handleSubmit = (e) => {
    e?.preventDefault(); // 🔴 prevents page refresh issues

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    const pincodeRegex = /^[0-9]{6}$/;

    // Trim values safely
    const name = form.name?.trim();
    const email = form.email?.trim();
    const mobile = form.mobile?.trim();
    const pincode = form.pincode?.trim();

    // NAME
    if (!name || name.length < 3) {
      alert("❌ Enter valid full name (min 3 characters)");
      return;
    }

    // EMAIL (FIXED)
    if (!email || !emailRegex.test(email)) {
      alert("❌ Enter valid email address (example: test@gmail.com)");
      return;
    }

    // MOBILE (10 digits, starts 6-9)
    if (!mobile || !mobileRegex.test(mobile)) {
      alert("❌ Enter valid 10-digit mobile number");
      return;
    }

    // STATE
    if (!form.state) {
      alert("❌ Please select state");
      return;
    }

    // CITY
    if (!form.city) {
      alert("❌ Please select city");
      return;
    }

    // PINCODE
    if (!pincode || !pincodeRegex.test(pincode)) {
      alert("❌ Enter valid 6-digit pincode");
      return;
    }

    // PASSWORD
    if (!form.password || form.password.length < 6) {
      alert("❌ Password must be at least 6 characters");
      return;
    }

    // CONFIRM PASSWORD
    if (form.password !== form.confirmPassword) {
      alert("❌ Passwords do not match");
      return;
    }

    alert("✅ Registration Successful!");
    onSuccess();
  };

  return (
    <>
      <h2>Create Account</h2>

      <div className="form-grid">

        <input
          className="full"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          placeholder="Mobile"
          value={form.mobile}
          maxLength={10}
          onChange={(e) =>
            setForm({
              ...form,
              mobile: e.target.value.replace(/\D/g, "")
            })
          }
        />

        <select
          value={form.state}
          onChange={(e) =>
            setForm({ ...form, state: e.target.value })
          }
        >
          <option value="">State</option>
          <option>Karnataka</option>
          <option>Tamil Nadu</option>
        </select>

        <select
          value={form.city}
          onChange={(e) =>
            setForm({ ...form, city: e.target.value })
          }
        >
          <option value="">City</option>
          <option>Bangalore</option>
          <option>Chennai</option>
        </select>

        <input
          placeholder="Pincode"
          value={form.pincode}
          maxLength={6}
          onChange={(e) =>
            setForm({
              ...form,
              pincode: e.target.value.replace(/\D/g, "")
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Confirm"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({
              ...form,
              confirmPassword: e.target.value
            })
          }
        />

      </div>

      <button onClick={handleSubmit}>Register</button>

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