import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./authentication.css";

export default function Login({ onLogin, onGoSignUp }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");

  function handleChange(e) {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  function validate() {
    if (!form.email || !form.password)
      return "Email and password are required.";
    return "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) return setErr(v);
    setErr("");
    onLogin && onLogin(form);
  }

  return (
    <div className="auth-page">
      <div className="auth-layout">
        {/* LEFT: all your existing login content */}
        <div className="auth-left">
          <div className="auth-container">
            <h2 className="auth-title">Welcome back</h2>
  
            {err && <div className="auth-error">{err}</div>}
  
            <form onSubmit={handleSubmit} className="auth-form">
              <label className="auth-label">Email</label>
              <input
                name="email"
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
  
              <label className="auth-label">Password</label>
              <div className="auth-password-toggle">
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  className="auth-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                />
                <button type="button" onClick={() => setShowPass((s) => !s)}>
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
  
              <div className="auth-actions">
                <label className="auth-checkbox">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                  />
                  Remember me
                </label>
  
                <button
                  type="button"
                  className="auth-forgot"
                  onClick={() => alert("Password reset coming soon!")}
                >
                  Forgot password?
                </button>
              </div>
  
              <button type="submit" className="auth-btn">
                Sign in
              </button>
            </form>
  
            <div className="auth-secondary">
              New here? <button onClick={onGoSignUp}>Create account</button>
            </div>
  
            <div className="guest-option">
              <button onClick={() => navigate("/home")}>Continue as Guest</button>
            </div>
          </div>
        </div>
  
        {/* RIGHT: illustration panel */}
        <div className="auth-illustration" />
      </div>
    </div>
  );
  
}
