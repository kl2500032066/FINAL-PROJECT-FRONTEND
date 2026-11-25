import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  LeafLogo,
  CartIcon,
  BellIcon,
  LogOutIcon,
  UserIcon,
} from "./Icons.jsx";

export default function Navbar({
  user,
  cartCount = 0,
  unreadNotifications = 0,
  onLogin,
  onLogout,
  onOpenCart,
}) {
  return (
    <header className="site-nav">
      <Link to="/" className="brand">
        <span className="brand-icon-wrap">
          <LeafLogo size={22} />
        </span>
        <span className="brand-text">
          Agri<strong>Connect</strong>
        </span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        {user?.role === "buyer" && <NavLink to="/buyer">Marketplace</NavLink>}
        {user?.role === "seller" && <NavLink to="/farmer">Seller Studio</NavLink>}
        {user?.role === "admin" && <NavLink to="/admin">Admin Console</NavLink>}

        {user?.role === "buyer" && (
          <button
            type="button"
            className="nav-cart-btn"
            onClick={onOpenCart}
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            <span className="cart-icon-holder">
              <CartIcon size={20} />
              {cartCount > 0 && (
                <span key={cartCount} className="cart-count-badge">
                  {cartCount}
                </span>
              )}
            </span>
            <span className="nav-cart-label">Cart</span>
          </button>
        )}

        {(user?.role === "admin" || user?.role === "seller") && (
          <Link
            to={user.role === "admin" ? "/admin" : "/farmer"}
            className="nav-notif-pill"
            title="Pending order notifications"
          >
            <BellIcon size={18} />
            {unreadNotifications > 0 && (
              <span className="notif-count-badge">{unreadNotifications}</span>
            )}
          </Link>
        )}

        {user ? (
          <div className="nav-user-group">
            <span className="nav-user-chip">
              <UserIcon size={15} />
              <span>{user.name}</span>
              <em className="role-tag">{user.role}</em>
            </span>
            <button type="button" className="nav-logout-btn" onClick={onLogout}>
              <LogOutIcon size={15} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <button type="button" className="nav-action" onClick={onLogin}>
            Login / Sign Up
          </button>
        )}
      </nav>
    </header>
  );
}