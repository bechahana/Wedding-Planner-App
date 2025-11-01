import React, { useState } from "react";
import "./authentication.css";

export default function SignUp({ onSignUp, onGoLogin }) {
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
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  function validate() {
    if (!form.fullName || !form.email || !form.password || !form.confirm) {
      return "Please fill out all fields.";
    }
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!okEmail) return "Please enter a valid email address.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    if (!form.accept) return "You must accept the Terms & Privacy Policy.";
    return "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) return setErr(v);
    setErr("");
    onSignUp && onSignUp(form); // parent will handle real API call
  }

  return (
    <div className="auth-page">
      <div className="auth-container" role="main" aria-label="Sign up form">
        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Start managing wedding services</p>

        {err ? <div className="auth-error" role="alert">{err}</div> : null}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full name */}
          <label className="auth-label" htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            name="fullName"
            className="auth-input"
            placeholder="Jane Doe"
            value={form.fullName}
            onChange={handleChange}
            autoComplete="name"
          />

          {/* Email */}
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

          {/* Password + Confirm (stacked) */}
          <div className="password-section">
            <div>
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
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="auth-label" htmlFor="confirm">Confirm Password</label>
              <input
                id="confirm"
                name="confirm"
                type={showPass ? "text" : "password"}
                className="auth-input"
                placeholder="••••••••"
                value={form.confirm}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Terms */}
          <label className="auth-checkbox">
            <input
              type="checkbox"
              name="accept"
              checked={form.accept}
              onChange={handleChange}
            />
            I agree to the Terms & Privacy Policy
          </label>

          {/* Submit */}
          <button type="submit" className="auth-btn">Create account</button>
        </form>

        <div className="auth-secondary">
          Already have an account?{" "}
          <button type="button" onClick={onGoLogin}>Sign in</button>
        </div>
      </div>
    </div>
  );
}
