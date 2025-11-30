import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./authentication.css";

export default function SignUp({ onSignUp, onGoLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
    accept: true,
  });

  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  function validate() {
    if (!form.fullName || !form.email || !form.password || !form.confirm)
      return "Please fill out all fields.";
    if (form.password !== form.confirm)
      return "Passwords do not match.";
    return "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) return setErr(v);
    setErr("");
    onSignUp && onSignUp(form);
  }

  return (
    <div className="auth-page">
      <div className="auth-layout">
        {/* LEFT: existing signup content */}
        <div className="auth-left">
          <div className="auth-container">
            <h2 className="auth-title">Create account</h2>
            <p className="auth-subtitle">Start planning your dream wedding ✨</p>
  
            {err && <div className="auth-error">{err}</div>}
  
            <form onSubmit={handleSubmit} className="auth-form">
              <label className="auth-label">Full name</label>
              <input
                name="fullName"
                className="auth-input"
                value={form.fullName}
                onChange={handleChange}
              />
  
              <label className="auth-label">Email</label>
              <input
                name="email"
                type="email"
                className="auth-input"
                value={form.email}
                onChange={handleChange}
              />
  
              <div className="password-section">
                <div>
                  <label className="auth-label">Password</label>
                  <div className="auth-password-toggle">
                    <input
                      name="password"
                      type={showPass ? "text" : "password"}
                      className="auth-input"
                      value={form.password}
                      onChange={handleChange}
                    />
                    <button type="button" onClick={() => setShowPass((s) => !s)}>
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
  
                <div>
                  <label className="auth-label">Confirm</label>
                  <input
                    name="confirm"
                    type={showPass ? "text" : "password"}
                    className="auth-input"
                    value={form.confirm}
                    onChange={handleChange}
                  />
                </div>
              </div>
  
              <button type="submit" className="auth-btn">
                Create account
              </button>
            </form>
  
            <div className="auth-secondary">
              Already have an account?{" "}
              <button onClick={onGoLogin}>Sign in</button>
            </div>
  
            <div className="guest-option">
              <button onClick={() => navigate("/home")}>
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
  
        {/* RIGHT: illustration panel */}
        <div className="auth-illustration" />
      </div>
    </div>
  );
  
}
