import React, { useState } from "react";
import {
  UserIcon,
  MapPinIcon,
  CreditCardIcon,
  BellIcon,
  SettingsIcon,
  ShieldIcon,
  CheckCircleIcon,
  TrashIcon,
  LogOutIcon,
} from "./Icons.jsx";

export default function ProfileSettings({
  user,
  onUpdateUser,
  onLogout,
  glassEnabled = true,
  onToggleGlass,
}) {
  const [tab, setTab] = useState("account");
  const [savedNotice, setSavedNotice] = useState("");

  // Personal Info state
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");

  // Saved addresses state
  const [addresses, setAddresses] = useState(
    user?.addresses || [
      {
        id: "addr-default",
        label: "Home",
        line: "12-4-56 Green Park Road, Benz Circle",
        city: "Vijayawada",
        pincode: "520010",
        isDefault: true,
      },
    ]
  );
  const [newAddr, setNewAddr] = useState({ label: "Home", line: "", city: "", pincode: "" });

  // Payment preferences
  const [defaultPayment, setDefaultPayment] = useState(user?.defaultPayment || "UPI");
  const [savedUpi, setSavedUpi] = useState(user?.savedUpi || "");

  // Notification toggles
  const [notifs, setNotifs] = useState(
    user?.notifPrefs || {
      orderUpdates: true,
      harvestAlerts: true,
      priceDrops: false,
      whatsappUpdates: true,
    }
  );

  // App preferences
  const [language, setLanguage] = useState(user?.language || "English");
  const [density, setDensity] = useState(user?.density || "comfortable");

  // Password change
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState({ type: "", text: "" });

  function flashSaved(msg = "Preferences saved successfully") {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(""), 2600);
  }

  function saveAccount(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onUpdateUser({ name: name.trim(), phone: phone.trim(), bio: bio.trim() });
    flashSaved("Profile details updated");
  }

  function addAddress(e) {
    e.preventDefault();
    if (!newAddr.line.trim() || !newAddr.pincode.trim()) return;
    const next = [
      ...addresses,
      {
        id: `addr-${Date.now()}`,
        label: newAddr.label || "Other",
        line: newAddr.line.trim(),
        city: newAddr.city.trim() || "India",
        pincode: newAddr.pincode.trim(),
        isDefault: addresses.length === 0,
      },
    ];
    setAddresses(next);
    onUpdateUser({ addresses: next });
    setNewAddr({ label: "Work", line: "", city: "", pincode: "" });
    flashSaved("Delivery address added");
  }

  function setDefaultAddr(id) {
    const next = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    setAddresses(next);
    onUpdateUser({ addresses: next });
    flashSaved("Default address updated");
  }

  function removeAddr(id) {
    const next = addresses.filter((a) => a.id !== id);
    setAddresses(next);
    onUpdateUser({ addresses: next });
  }

  function savePaymentPrefs(e) {
    e.preventDefault();
    onUpdateUser({ defaultPayment, savedUpi: savedUpi.trim() });
    flashSaved("Payment preferences saved");
  }

  function toggleNotif(key) {
    const next = { ...notifs, [key]: !notifs[key] };
    setNotifs(next);
    onUpdateUser({ notifPrefs: next });
    flashSaved("Notification settings updated");
  }

  function saveAppPrefs() {
    onUpdateUser({ language, density });
    flashSaved("App display preferences saved");
  }

  function handlePasswordUpdate(e) {
    e.preventDefault();
    if (user?.role === "admin") {
      setPwdMsg({ type: "error", text: "Admin system password cannot be altered here." });
      return;
    }
    if (currentPwd !== user?.password) {
      setPwdMsg({ type: "error", text: "Current password does not match." });
      return;
    }
    if (newPwd.length < 4) {
      setPwdMsg({ type: "error", text: "New password must be at least 4 characters." });
      return;
    }
    onUpdateUser({ password: newPwd });
    setCurrentPwd("");
    setNewPwd("");
    setPwdMsg({ type: "success", text: "Password updated successfully." });
  }

  const tabs = [
    { id: "account", label: "Personal Info", icon: <UserIcon size={16} /> },
    { id: "addresses", label: user?.role === "seller" ? "Farm & Pickup Address" : "Saved Addresses", icon: <MapPinIcon size={16} /> },
    { id: "payments", label: "Payment Methods", icon: <CreditCardIcon size={16} /> },
    { id: "notifications", label: "Notifications", icon: <BellIcon size={16} /> },
    { id: "appearance", label: "App & Liquid Glass", icon: <SettingsIcon size={16} /> },
    { id: "security", label: "Security & Privacy", icon: <ShieldIcon size={16} /> },
  ];

  return (
    <section className="settings-shell">
      <div className="settings-header">
        <div>
          <p className="eyebrow">ACCOUNT & PREFERENCES</p>
          <h2>Profile Settings</h2>
          <p className="muted">
            Manage your profile, saved addresses, payment options, alerts, and display preferences.
          </p>
        </div>
        {savedNotice && (
          <div className="settings-toast">
            <CheckCircleIcon size={16} />
            <span>{savedNotice}</span>
          </div>
        )}
      </div>

      <div className="settings-grid">
        <aside className="settings-nav">
          <div className="settings-profile-summary">
            <div className="avatar-circle">
              {(user?.name || "U").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
              <em className="role-pill-small">{user?.role}</em>
            </div>
          </div>

          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`settings-tab-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}

          <button type="button" className="settings-tab-btn settings-logout" onClick={onLogout}>
            <LogOutIcon size={16} />
            <span>Sign Out</span>
          </button>
        </aside>

        <div className="settings-content-card">
          {tab === "account" && (
            <form onSubmit={saveAccount} className="settings-form">
              <h3>Personal Information</h3>
              <p className="muted">Keep your name and contact details current for smooth order handoffs.</p>
              <div className="settings-two-col">
                <label>
                  Full Name
                  <input value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <label>
                  Account Email / Username
                  <input value={user?.email || ""} disabled />
                </label>
                <label>
                  Mobile Number
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </label>
                <label>
                  Role
                  <input value={user?.role?.toUpperCase() || ""} disabled />
                </label>
              </div>
              <label>
                {user?.role === "seller" ? "Farm / Grower Bio" : "Delivery Note / Bio"}
                <textarea
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={
                    user?.role === "seller"
                      ? "Tell buyers about your farming practices and harvest schedule"
                      : "Default doorstep drop instructions"
                  }
                />
              </label>
              <button type="submit" className="primary-btn">
                Save Profile Changes
              </button>
            </form>
          )}

          {tab === "addresses" && (
            <div className="settings-form">
              <h3>{user?.role === "seller" ? "Farm & Dispatch Addresses" : "Saved Delivery Addresses"}</h3>
              <div className="address-list">
                {addresses.map((addr) => (
                  <div key={addr.id} className={`address-card ${addr.isDefault ? "default-addr" : ""}`}>
                    <div>
                      <div className="addr-title-row">
                        <strong>{addr.label}</strong>
                        {addr.isDefault && <span className="default-tag">Default</span>}
                      </div>
                      <p>{addr.line}</p>
                      <small>
                        {addr.city} - {addr.pincode}
                      </small>
                    </div>
                    <div className="addr-actions">
                      {!addr.isDefault && (
                        <button
                          type="button"
                          className="outline-btn small-btn"
                          onClick={() => setDefaultAddr(addr.id)}
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        type="button"
                        className="icon-danger-btn"
                        onClick={() => removeAddr(addr.id)}
                        aria-label="Delete address"
                      >
                        <TrashIcon size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={addAddress} className="add-address-box">
                <h4>Add New Address</h4>
                <div className="settings-two-col">
                  <label>
                    Label
                    <select
                      value={newAddr.label}
                      onChange={(e) => setNewAddr((p) => ({ ...p, label: e.target.value }))}
                    >
                      <option>Home</option>
                      <option>Work</option>
                      <option>Farm</option>
                      <option>Other</option>
                    </select>
                  </label>
                  <label>
                    Pincode
                    <input
                      value={newAddr.pincode}
                      onChange={(e) => setNewAddr((p) => ({ ...p, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                      placeholder="6-digit pincode"
                      required
                    />
                  </label>
                  <label>
                    Street / Landmark
                    <input
                      value={newAddr.line}
                      onChange={(e) => setNewAddr((p) => ({ ...p, line: e.target.value }))}
                      placeholder="House no., street, locality"
                      required
                    />
                  </label>
                  <label>
                    City
                    <input
                      value={newAddr.city}
                      onChange={(e) => setNewAddr((p) => ({ ...p, city: e.target.value }))}
                      placeholder="City name"
                    />
                  </label>
                </div>
                <button type="submit" className="primary-btn">
                  Save Address
                </button>
              </form>
            </div>
          )}

          {tab === "payments" && (
            <form onSubmit={savePaymentPrefs} className="settings-form">
              <h3>Payment Preferences</h3>
              <p className="muted">Choose your preferred checkout method for faster orders.</p>
              <div className="payment-pref-options">
                {["UPI", "Card", "Cash on Delivery"].map((opt) => (
                  <label key={opt} className={`radio-tile ${defaultPayment === opt ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="defaultPayment"
                      checked={defaultPayment === opt}
                      onChange={() => setDefaultPayment(opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              <label>
                Saved UPI ID (Optional)
                <input
                  value={savedUpi}
                  onChange={(e) => setSavedUpi(e.target.value)}
                  placeholder="yourname@upi"
                />
              </label>
              <button type="submit" className="primary-btn">
                Save Payment Settings
              </button>
            </form>
          )}

          {tab === "notifications" && (
            <div className="settings-form">
              <h3>Notification Preferences</h3>
              <p className="muted">Control how AgriConnect alerts you about orders and fresh harvests.</p>
              <div className="toggle-list">
                {[
                  ["orderUpdates", "Order Confirmation & Status Alerts", "Instant alerts when orders are placed or confirmed by sellers"],
                  ["harvestAlerts", "Fresh Harvest Notifications", "Get notified when farmers list new Grade A & Hybrid produce"],
                  ["priceDrops", "Price Drop & Seasonal Alerts", "Receive alerts on trending price drops across categories"],
                  ["whatsappUpdates", "SMS & Delivery Updates", "Receive live pincode dispatch updates on your phone"],
                ].map(([key, title, desc]) => (
                  <div key={key} className="toggle-row">
                    <div>
                      <strong>{title}</strong>
                      <p>{desc}</p>
                    </div>
                    <button
                      type="button"
                      className={`switch-pill ${notifs[key] ? "on" : ""}`}
                      onClick={() => toggleNotif(key)}
                      aria-pressed={notifs[key]}
                    >
                      <span className="switch-knob" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "appearance" && (
            <div className="settings-form">
              <h3>App & Display Preferences</h3>
              <div className="toggle-row">
                <div>
                  <strong>iPhone Liquid Glass Category Slider</strong>
                  <p>Enable frosted translucent liquid-glass refraction effect on category tabs</p>
                </div>
                <button
                  type="button"
                  className={`switch-pill ${glassEnabled ? "on" : ""}`}
                  onClick={() => onToggleGlass && onToggleGlass(!glassEnabled)}
                  aria-pressed={glassEnabled}
                >
                  <span className="switch-knob" />
                </button>
              </div>
              <div className="settings-two-col">
                <label>
                  Preferred Language
                  <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option>English</option>
                    <option>Telugu (తెలుగు)</option>
                    <option>Hindi (हिन्दी)</option>
                    <option>Tamil (தமிழ்)</option>
                  </select>
                </label>
                <label>
                  Catalog Card Density
                  <select value={density} onChange={(e) => setDensity(e.target.value)}>
                    <option value="comfortable">Comfortable (Recommended)</option>
                    <option value="compact">Compact Grid</option>
                  </select>
                </label>
              </div>
              <button type="button" className="primary-btn" onClick={saveAppPrefs}>
                Apply Display Settings
              </button>
            </div>
          )}

          {tab === "security" && (
            <form onSubmit={handlePasswordUpdate} className="settings-form">
              <h3>Security & Password</h3>
              <p className="muted">Update your account password and review active session security.</p>
              <div className="settings-two-col">
                <label>
                  Current Password
                  <input
                    type="password"
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    placeholder="Enter current password"
                    required
                  />
                </label>
                <label>
                  New Password
                  <input
                    type="password"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    placeholder="Minimum 4 characters"
                    required
                  />
                </label>
              </div>
              {pwdMsg.text && (
                <div className={pwdMsg.type === "error" ? "invalid-credentials-box" : "auth-success-banner"}>
                  <span>{pwdMsg.text}</span>
                </div>
              )}
              <button type="submit" className="primary-btn">
                Update Password
              </button>

              <div className="help-support-box">
                <h4>Help & Support</h4>
                <p>
                  AgriConnect Farm-Direct Marketplace · Quality Grading Standard (A, B, C &amp; Hybrid H) ·
                  24x7 Support: support@agriconnect.local
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
