import React, { useState } from "react";
import { LeafLogo, AlertCircleIcon, ShieldIcon, UserIcon, CheckCircleIcon } from "./Icons.jsx";

export default function AuthModal({ initialRole = "buyer", onClose, onLogin, onSignup }) {
  const [role, setRole] = useState(initialRole);
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  function handleRoleChange(nextRole) {
    setRole(nextRole);
    setError("");
    setSuccessMsg("");
    setFieldErrors({});
    if (nextRole === "admin") {
      setMode("login");
    }
  }

  function validateFields() {
    const errs = {};
    if (mode === "signup" && !name.trim()) errs.name = "Fill this";
    if (!identifier.trim()) errs.identifier = "Fill this";
    if (!password.trim()) errs.password = "Fill this";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!validateFields()) return;

    if (mode === "login") {
      const res = onLogin({
        identifier: identifier.trim(),
        password,
        role,
      });
      if (res !== true) {
        setError(res || "Invalid credentials");
      }
    } else {
      const res = onSignup({
        name: name.trim(),
        email: identifier.trim(),
        password,
        phone: phone.trim(),
        role,
      });
      if (res === true) {
        setSuccessMsg("Account created successfully! Please login with your credentials.");
        setMode("login");
        setPassword("");
      } else {
        setError(res || "Could not create account.");
      }
    }
  }

  const isInvalidLogin = mode === "login" && Boolean(error);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className={`auth-card ${isInvalidLogin ? "auth-card-error-ring" : ""}`}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close modal">
          &times;
        </button>

        <div className="auth-brand-header">
          <div className="auth-logo-circle">
            {role === "admin" ? <ShieldIcon size={24} /> : <LeafLogo size={24} />}
          </div>
          <h2>{mode === "login" ? "Sign in to AgriConnect" : `Create ${role === "seller" ? "Seller" : "Buyer"} Account`}</h2>
          <p className="muted">
            {role === "admin"
              ? "Authorized Administrator Console"
              : mode === "login"
              ? `Enter your ${role} credentials to continue`
              : "Register your account to access farm-direct fresh produce"}
          </p>
        </div>

        {/* 3 Role Tabs: Buyer, Seller, Admin */}
        <div className="role-switcher" role="tablist" aria-label="Account role">
          {[
            { id: "buyer", label: "Buyer" },
            { id: "seller", label: "Seller" },
            { id: "admin", label: "Admin" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={role === item.id}
              className={`role-tab ${role === item.id ? "active" : ""}`}
              onClick={() => handleRoleChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {successMsg && (
          <div className="auth-success-banner">
            <CheckCircleIcon size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className={isInvalidLogin ? "login-box-invalid" : ""}>
          {mode === "signup" && role !== "admin" && (
            <div className={`field-group ${fieldErrors.name ? "field-invalid" : ""}`}>
              <label>
                Full Name <span className="req-star">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, name: "" }));
                }}
                placeholder={role === "seller" ? "e.g. Ramesh Farm Produce" : "e.g. Sai Narasimha"}
              />
              {fieldErrors.name && <span className="field-error-badge">{fieldErrors.name}</span>}
            </div>
          )}

          <div className={`field-group ${fieldErrors.identifier ? "field-invalid" : ""}`}>
            <label>
              {role === "admin" ? "Admin Username" : "Email / Username"}{" "}
              <span className="req-star">*</span>
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setError("");
                setFieldErrors((prev) => ({ ...prev, identifier: "" }));
              }}
              placeholder={role === "admin" ? "admin@123" : "Enter your email or username"}
              autoComplete="username"
            />
            {fieldErrors.identifier && (
              <span className="field-error-badge">{fieldErrors.identifier}</span>
            )}
          </div>

          <div className={`field-group ${fieldErrors.password ? "field-invalid" : ""}`}>
            <label>
              Password <span className="req-star">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
                setFieldErrors((prev) => ({ ...prev, password: "" }));
              }}
              placeholder="Enter your password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
            {fieldErrors.password && (
              <span className="field-error-badge">{fieldErrors.password}</span>
            )}
          </div>

          {mode === "signup" && role !== "admin" && (
            <div className="field-group">
              <label>Mobile Number (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
              />
            </div>
          )}

          {error && (
            <div className="invalid-credentials-box" role="alert">
              <AlertCircleIcon size={18} />
              <div>
                <strong>Invalid credentials</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`full-btn ${isInvalidLogin ? "btn-error-outline" : ""}`}
          >
            <UserIcon size={16} />
            <span>
              {mode === "login"
                ? `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`
                : `Create ${role === "seller" ? "Seller" : "Buyer"} Account`}
            </span>
          </button>
        </form>

        {role !== "admin" ? (
          <p className="switch-auth">
            {mode === "login" ? "Don't have an account yet?" : "Already registered?"}{" "}
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
                setSuccessMsg("");
                setFieldErrors({});
              }}
            >
              {mode === "login" ? "Create Account" : "Login here"}
            </button>
          </p>
        ) : (
          <p className="admin-security-note">
            Restricted access. Enter valid administrator username and password.
          </p>
        )}
      </section>
    </div>
  );
}