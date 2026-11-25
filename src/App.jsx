import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import AuthModal from "./components/AuthModal.jsx";
import CartCheckoutModal from "./components/CartCheckoutModal.jsx";
import Home from "./pages/Home.jsx";
import Farmer from "./pages/Farmer.jsx";
import Buyer from "./pages/Buyer.jsx";
import Admin from "./pages/Admin.jsx";
import {
  ADMIN_CREDENTIALS,
  DEFAULT_LISTINGS,
  DEFAULT_MENU_ITEMS,
  STORE_KEYS,
  readStore,
  readStoreWithSeed,
  writeStore,
} from "./data.js";

export default function App() {
  const navigate = useNavigate();

  // Auto-seed default products (6-7 per category) if saved data is lost or empty
  const [menuItems, setMenuItems] = useState(() =>
    readStoreWithSeed(STORE_KEYS.menu, DEFAULT_MENU_ITEMS)
  );
  const [listings, setListings] = useState(() =>
    readStoreWithSeed(STORE_KEYS.listings, DEFAULT_LISTINGS)
  );
  const [users, setUsers] = useState(() => readStore(STORE_KEYS.users, []));
  const [orders, setOrders] = useState(() => readStore(STORE_KEYS.orders, []));
  const [notifications, setNotifications] = useState(() =>
    readStore(STORE_KEYS.notifications, [])
  );
  const [cart, setCart] = useState(() => readStore(STORE_KEYS.cart, []));
  const [user, setUser] = useState(() => readStore(STORE_KEYS.currentUser, null));

  const [authModalState, setAuthModalState] = useState({ open: false, role: "buyer" });
  const [showCart, setShowCart] = useState(false);
  const [glassEnabled, setGlassEnabled] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => writeStore(STORE_KEYS.menu, menuItems), [menuItems]);
  useEffect(() => writeStore(STORE_KEYS.listings, listings), [listings]);
  useEffect(() => writeStore(STORE_KEYS.users, users), [users]);
  useEffect(() => writeStore(STORE_KEYS.orders, orders), [orders]);
  useEffect(() => writeStore(STORE_KEYS.notifications, notifications), [notifications]);
  useEffect(() => writeStore(STORE_KEYS.cart, cart), [cart]);
  useEffect(() => {
    if (user) {
      writeStore(STORE_KEYS.currentUser, user);
    } else {
      localStorage.removeItem(STORE_KEYS.currentUser);
    }
  }, [user]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  }

  function openAuth(role = "buyer") {
    setAuthModalState({ open: true, role });
  }

  // Admin edits any Menu Item and syncs name/category/image to linked seller listings
  function handleUpdateMenuItem(updatedItem) {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === updatedItem.id ? { ...m, ...updatedItem } : m))
    );
    setListings((prev) =>
      prev.map((l) =>
        l.menuItemId === updatedItem.id
          ? {
              ...l,
              name: updatedItem.name,
              category: updatedItem.category,
              image: updatedItem.image,
            }
          : l
      )
    );
    showToast(`Updated "${updatedItem.name}" in catalog`);
  }

  // Admin or Farmer edits a product listing (price, stock, grade, details, etc.)
  function handleUpdateListing(updatedListing) {
    setListings((prev) =>
      prev.map((l) =>
        l.id === updatedListing.id
          ? { ...l, ...updatedListing, updatedAt: new Date().toLocaleString("en-IN") }
          : l
      )
    );
    showToast(`Updated "${updatedListing.name}" (₹${updatedListing.price}/kg)`);
  }

  function handleSignup({ name, email, password, phone, role }) {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === ADMIN_CREDENTIALS.username.toLowerCase()) {
      return "This username is reserved for Administrator.";
    }
    const exists = users.some(
      (u) => u.email.toLowerCase() === cleanEmail && u.role === role
    );
    if (exists) {
      return `A ${role} account with this email/username already exists.`;
    }

    const created = {
      id: `${role}-${Date.now()}`,
      name,
      email: email.trim(),
      password,
      phone: phone || "",
      role,
      addresses: [],
      defaultPayment: "UPI",
      notifPrefs: {
        orderUpdates: true,
        harvestAlerts: true,
        priceDrops: false,
        whatsappUpdates: true,
      },
      language: "English",
      density: "comfortable",
      createdAt: new Date().toLocaleDateString("en-IN"),
    };

    setUsers((prev) => [...prev, created]);
    return true;
  }

  function handleLogin({ identifier, password, role }) {
    if (role === "admin") {
      if (
        identifier === ADMIN_CREDENTIALS.username &&
        password === ADMIN_CREDENTIALS.password
      ) {
        const adminProfile = {
          id: "admin-root",
          name: "Administrator",
          email: ADMIN_CREDENTIALS.username,
          role: "admin",
        };
        setUser(adminProfile);
        setAuthModalState({ open: false, role: "buyer" });
        navigate("/admin");
        return true;
      }
      return "Wrong admin username or password. Access denied.";
    }

    const found = users.find(
      (u) =>
        u.role === role &&
        u.email.toLowerCase() === identifier.toLowerCase() &&
        u.password === password
    );

    if (!found) {
      return `Wrong ${role} credentials. Please check your username/password or create an account first.`;
    }

    setUser(found);
    setAuthModalState({ open: false, role: "buyer" });
    navigate(role === "seller" ? "/farmer" : "/buyer");
    return true;
  }

  function handleAdminDirectLogin() {
    const adminProfile = {
      id: "admin-root",
      name: "Administrator",
      email: ADMIN_CREDENTIALS.username,
      role: "admin",
    };
    setUser(adminProfile);
  }

  function handleUpdateUser(patch) {
    if (!user) return;
    const updated = { ...user, ...patch };
    setUser(updated);
    if (user.role !== "admin") {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    }
  }

  function handleLogout() {
    setUser(null);
    setShowCart(false);
    localStorage.removeItem(STORE_KEYS.currentUser);
    navigate("/");
  }

  // Realistic Cart Operations
  function handleAddToCart(listing) {
    if (Number(listing.quantity) <= 0) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.listingId === listing.id);
      if (existing) {
        const nextQty = Math.min(existing.quantity + 1, Number(listing.quantity));
        return prev.map((c) =>
          c.listingId === listing.id ? { ...c, quantity: nextQty } : c
        );
      }
      return [...prev, { listingId: listing.id, quantity: 1 }];
    });
    showToast(`Added ${listing.name} to cart`);
  }

  function handleUpdateCartQty(listingId, nextQty) {
    if (nextQty <= 0) {
      setCart((prev) => prev.filter((c) => c.listingId !== listingId));
      return;
    }
    const live = listings.find((l) => l.id === listingId);
    const maxQty = live ? Number(live.quantity) : nextQty;
    const clamped = Math.min(nextQty, maxQty);
    setCart((prev) =>
      prev.map((c) => (c.listingId === listingId ? { ...c, quantity: clamped } : c))
    );
  }

  function handleRemoveFromCart(listingId) {
    setCart((prev) => prev.filter((c) => c.listingId !== listingId));
  }

  // Place Order -> Notify Admin & Seller (Seller confirms to auto-adjust stock)
  function handlePlaceOrder({ items, address, paymentMethod }) {
    if (!user || !items.length) return [];

    const createdOrders = [];
    const createdNotifs = [];
    const timestamp = new Date().toLocaleString("en-IN");

    items.forEach(({ listing, quantity, lineTotal }, idx) => {
      const orderId = `ORD-${Date.now().toString().slice(-5)}${idx + 1}`;
      createdOrders.push({
        id: orderId,
        listingId: listing.id,
        productName: listing.name,
        category: listing.category,
        grade: listing.grade,
        sellerId: listing.sellerId,
        sellerName: listing.sellerName,
        buyerId: user.id,
        buyerName: address.fullName || user.name,
        quantity: Number(quantity),
        unitPrice: Number(listing.price),
        total: Number(lineTotal),
        paymentMethod,
        address,
        status: "Pending Confirmation",
        createdAt: timestamp,
      });

      createdNotifs.push({
        id: `notif-admin-${Date.now()}-${idx}`,
        targetRole: "admin",
        orderId,
        title: `New ${paymentMethod} Order (${orderId})`,
        message: `${address.fullName || user.name} ordered ${quantity} kg of ${listing.name} (Grade ${listing.grade}) from ${listing.sellerName} · ₹${lineTotal} · PIN ${address.pincode}`,
        read: false,
        createdAt: timestamp,
      });
    });

    setOrders((prev) => [...createdOrders, ...prev]);
    setNotifications((prev) => [...createdNotifs, ...prev]);
    setCart([]);
    showToast("Order placed! Admin & Seller notified.");
    return createdOrders.map((o) => o.id);
  }

  // Seller confirms order -> automatically deducts ordered quantity from live listing stock
  function handleConfirmOrder(orderId) {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder || targetOrder.status !== "Pending Confirmation") {
      return { ok: false, message: "Order is already processed." };
    }

    const targetListing = listings.find((l) => l.id === targetOrder.listingId);
    if (!targetListing) {
      return { ok: false, message: "Linked product listing was removed." };
    }

    if (Number(targetListing.quantity) < Number(targetOrder.quantity)) {
      return {
        ok: false,
        message: `Insufficient stock (${targetListing.quantity} kg available vs ${targetOrder.quantity} kg ordered). Please update stock first.`,
      };
    }

    const newStock = Math.max(
      0,
      Number(targetListing.quantity) - Number(targetOrder.quantity)
    );

    setListings((prev) =>
      prev.map((l) =>
        l.id === targetListing.id ? { ...l, quantity: newStock } : l
      )
    );

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "Confirmed" } : o
      )
    );

    setNotifications((prev) => [
      {
        id: `notif-confirm-${Date.now()}`,
        targetRole: "admin",
        orderId,
        title: `Seller Confirmed Order (${orderId})`,
        message: `${targetOrder.sellerName} confirmed ${targetOrder.quantity} kg of ${targetOrder.productName}. Remaining stock auto-adjusted to ${newStock} kg.`,
        read: false,
        createdAt: new Date().toLocaleString("en-IN"),
      },
      ...prev,
    ]);

    return {
      ok: true,
      message: `Order ${orderId} confirmed! Stock for ${targetOrder.productName} automatically adjusted to ${newStock} kg.`,
    };
  }

  function handleDeclineOrder(orderId) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Declined" } : o))
    );
    showToast(`Order ${orderId} declined.`);
  }

  function handleMarkNotificationsRead(role) {
    setNotifications((prev) =>
      prev.map((n) => (n.targetRole === role ? { ...n, read: true } : n))
    );
  }

  const cartItemCount = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [cart]
  );

  const unreadCount = useMemo(() => {
    if (user?.role === "admin") {
      return notifications.filter((n) => n.targetRole === "admin" && !n.read).length;
    }
    if (user?.role === "seller") {
      return orders.filter(
        (o) =>
          String(o.sellerId) === String(user.id) &&
          o.status === "Pending Confirmation"
      ).length;
    }
    return 0;
  }, [user, notifications, orders]);

  return (
    <div className="app-shell">
      <Navbar
        user={user}
        cartCount={cartItemCount}
        unreadNotifications={unreadCount}
        onLogin={() => openAuth("buyer")}
        onLogout={handleLogout}
        onOpenCart={() => setShowCart(true)}
      />

      {toast && <div className="floating-toast">{toast}</div>}

      <Routes>
        <Route path="/" element={<Home user={user} onOpenAuth={openAuth} />} />
        <Route
          path="/farmer"
          element={
            user?.role === "seller" ? (
              <Farmer
                user={user}
                menuItems={menuItems}
                listings={listings}
                setListings={setListings}
                onUpdateListing={handleUpdateListing}
                orders={orders}
                onConfirmOrder={handleConfirmOrder}
                onDeclineOrder={handleDeclineOrder}
                onUpdateUser={handleUpdateUser}
                onLogout={handleLogout}
                glassEnabled={glassEnabled}
                onToggleGlass={setGlassEnabled}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/buyer"
          element={
            user?.role === "buyer" ? (
              <Buyer
                user={user}
                listings={listings}
                orders={orders}
                cart={cart}
                onAddToCart={handleAddToCart}
                onUpdateCartQty={handleUpdateCartQty}
                onOpenCart={() => setShowCart(true)}
                onUpdateUser={handleUpdateUser}
                onLogout={handleLogout}
                glassEnabled={glassEnabled}
                onToggleGlass={setGlassEnabled}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/admin"
          element={
            <Admin
              user={user}
              users={users}
              menuItems={menuItems}
              setMenuItems={setMenuItems}
              listings={listings}
              setListings={setListings}
              onUpdateMenuItem={handleUpdateMenuItem}
              onUpdateListing={handleUpdateListing}
              orders={orders}
              notifications={notifications}
              onMarkNotificationsRead={handleMarkNotificationsRead}
              onAdminDirectLogin={handleAdminDirectLogin}
              onUpdateUser={handleUpdateUser}
              onLogout={handleLogout}
              glassEnabled={glassEnabled}
              onToggleGlass={setGlassEnabled}
            />
          }
        />
        <Route
          path="*"
          element={
            <main className="not-found">
              <h1>404 - Page Not Found</h1>
              <p>The page you requested does not exist.</p>
              <button type="button" className="primary-btn" onClick={() => navigate("/")}>
                Go Home
              </button>
            </main>
          }
        />
      </Routes>

      {authModalState.open && (
        <AuthModal
          initialRole={authModalState.role}
          onClose={() => setAuthModalState({ open: false, role: "buyer" })}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
      )}

      {showCart && user?.role === "buyer" && (
        <CartCheckoutModal
          user={user}
          cart={cart}
          listings={listings}
          onUpdateCartQty={handleUpdateCartQty}
          onRemoveFromCart={handleRemoveFromCart}
          onPlaceOrder={handlePlaceOrder}
          onClose={() => setShowCart(false)}
        />
      )}
    </div>
  );
}