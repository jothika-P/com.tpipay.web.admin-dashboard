import React, { useState } from "react";

const RegisterForm = ({ onSuccess, onBack }) => {
  const [form, setForm] = useState({});

  const handleSubmit = () => {
    if (!form.name || !form.email) {
      alert("Fill all fields");
      return;
    }
    onSuccess();
  };

  return (
    <>
      <h2>Create Account</h2>

      <div className="form-grid">

        <input
          className="full"
          placeholder="Full Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Mobile"
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
        />

        <select onChange={(e) => setForm({ ...form, state: e.target.value })}>
          <option value="">State</option>
          <option>Karnataka</option>
          <option>Tamil Nadu</option>
        </select>

        <select onChange={(e) => setForm({ ...form, city: e.target.value })}>
          <option value="">City</option>
          <option>Bangalore</option>
          <option>Chennai</option>
        </select>

        <input
          placeholder="Pincode"
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <input
          type="password"
          placeholder="Confirm"
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
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