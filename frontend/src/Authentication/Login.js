import React, { useState } from "react";
import "./authentication.css";

export default function Login({ onLogin, onGoSignUp }) {
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");

  function handleChange(e) {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  function validate() {
    if (!form.email || !form.password) return "Email and password are required.";
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!okEmail) return "Please enter a valid email address.";
    return "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) return setErr(v);
    setErr("");
    onLogin && onLogin(form); // parent handles real auth
  }

  return (
    <div className="auth-page">
      <div className="auth-container" role="main" aria-label="Login form">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your admin account</p>

        {err ? <div className="auth-error" role="alert">{err}</div> : null}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="auth-input"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />

          <label className="auth-label" htmlFor="password">Password</label>
          <div className="auth-password-toggle">
            <input
              id="password"
              name="password"
              type={showPass ? "text" : "password"}
              className="auth-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPass(s => !s)}
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>

          <div className="auth-checkbox" style={{ justifyContent: "space-between" }}>
            <label className="auth-checkbox">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              Remember me
            </label>
            <button type="button" className="auth-link">Forgot password?</button>
          </div>

          <button type="submit" className="auth-btn">Sign in</button>
        </form>

        <div className="auth-secondary">
          Don’t have an account?{" "}
          <button type="button" onClick={onGoSignUp}>Sign up</button>
        </div>
      </div>
    </div>
  );
}
