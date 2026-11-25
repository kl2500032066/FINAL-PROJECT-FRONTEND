import React from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES, GRADES } from "../data.js";
import {
  LeafLogo,
  ShieldIcon,
  CheckCircleIcon,
  TruckIcon,
  ChevronRightIcon,
} from "../components/Icons.jsx";

export default function Home({ user, onOpenAuth }) {
  const navigate = useNavigate();

  function handleRoleEntry(targetRole) {
    if (user?.role === targetRole) {
      navigate(targetRole === "admin" ? "/admin" : targetRole === "seller" ? "/farmer" : "/buyer");
    } else {
      onOpenAuth(targetRole);
    }
  }

  return (
    <div className="home-page">
      <section className="hero-modern">
        <div className="hero-copy">
          <span className="hero-pill">
            <LeafLogo size={14} /> Farm-Direct · Quality Graded A, B, C &amp; Hybrid
          </span>
          <h1>
            Fresh Farm Produce,
            <span>Graded &amp; Delivered Direct.</span>
          </h1>
          <p className="hero-lead">
            AgriConnect connects administrators, verified local farmers, and everyday buyers in one
            transparent green marketplace. Every product is curated by Admin, graded by Sellers, and
            delivered straight to your pincode.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="primary-btn large-btn"
              onClick={() => handleRoleEntry("buyer")}
            >
              Start Buying <ChevronRightIcon size={16} />
            </button>
            <button
              type="button"
              className="secondary-btn large-btn"
              onClick={() => handleRoleEntry("seller")}
            >
              Seller / Farmer Login
            </button>
            <button
              type="button"
              className="ghost-green-btn large-btn"
              onClick={() => handleRoleEntry("admin")}
            >
              <ShieldIcon size={16} /> Admin Console
            </button>
          </div>
        </div>

        <div className="hero-visual-card">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
            alt="Fresh farm-direct fruits and vegetables market"
          />
          <div className="hero-floating-badge">
            <CheckCircleIcon size={18} />
            <div>
              <strong>Zero Unverified Listings</strong>
              <span>Only Admin-approved &amp; Seller-graded produce</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7 Official Categories Showcase */}
      <section className="page-section">
        <div className="section-title">
          <p className="eyebrow">CURATED MARKETPLACE MENU</p>
          <h2>7 Fresh Farm Categories</h2>
          <p>Admin curates the official menu across these 7 categories for farmers to grade and list.</p>
        </div>

        <div className="home-category-grid">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="home-category-tile"
              onClick={() => handleRoleEntry("buyer")}
            >
              <div className="home-cat-img">
                <img src={cat.image} alt={cat.label} loading="lazy" />
              </div>
              <div className="home-cat-copy">
                <strong>{cat.label}</strong>
                <span>{cat.tagline}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Grading Standard Section */}
      <section className="page-section grade-showcase-section">
        <div className="section-title">
          <p className="eyebrow">TRANSPARENT QUALITY STANDARD</p>
          <h2>Official Harvest Grading System</h2>
          <p>Every farmer grades their harvest clearly so buyers always know what they are ordering.</p>
        </div>
        <div className="grades-grid">
          {GRADES.map((g) => (
            <div key={g.code} className="grade-info-card">
              <span className={`grade-badge large ${g.colorClass}`}>{g.title}</span>
              <p>{g.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3-Role Workflow */}
      <section className="page-section">
        <div className="section-title">
          <p className="eyebrow">HOW AGRICONNECT WORKS</p>
          <h2>Three Synchronized Portals</h2>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <span className="step-num">01</span>
            <h3>Admin Curates Menu</h3>
            <p>
              Admin adds approved products into the 7 official categories and receives real-time
              order notifications.
            </p>
          </div>
          <div className="step-card">
            <span className="step-num">02</span>
            <h3>Seller Grades &amp; Confirms</h3>
            <p>
              Farmers set quantity, price, and quality grade (A, B, C, or H for Hybrid), and confirm
              buyer orders to auto-adjust stock.
            </p>
          </div>
          <div className="step-card">
            <span className="step-num">03</span>
            <h3>Buyer Explores &amp; Pays</h3>
            <p>
              Buyers browse trending banners and category tabs, verify pincode delivery, and pay via
              UPI QR, Card, or Cash on Delivery.
            </p>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <span className="footer-brand">
            <LeafLogo size={18} /> AgriConnect
          </span>
          <span>Farm-Direct Fresh Marketplace · Quality Graded Produce</span>
          <span className="footer-delivery-note">
            <TruckIcon size={15} /> All-India Pincode Delivery
          </span>
        </div>
      </footer>
    </div>
  );
}