import React, { useMemo, useState } from "react";
import {
  ADMIN_CREDENTIALS,
  CATEGORIES,
  GRADES,
  getCategoryImage,
  getGradeInfo,
  resolveProductImage,
} from "../data.js";
import {
  LeafLogo,
  ShieldIcon,
  GridIcon,
  PlusCircleIcon,
  PackageIcon,
  BellIcon,
  UsersIcon,
  SettingsIcon,
  LogOutIcon,
  TrashIcon,
  EditIcon,
  XIcon,
  SearchIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from "../components/Icons.jsx";
import ProfileSettings from "../components/ProfileSettings.jsx";

export default function Admin({
  user,
  users,
  menuItems,
  setMenuItems,
  listings,
  setListings,
  onUpdateMenuItem,
  onUpdateListing,
  orders,
  notifications,
  onMarkNotificationsRead,
  onAdminDirectLogin,
  onUpdateUser,
  onLogout,
  glassEnabled,
  onToggleGlass,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [section, setSection] = useState("menu");
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState(CATEGORIES[0].id);
  const [itemImage, setItemImage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [filterCat, setFilterCat] = useState("all");
  const [flash, setFlash] = useState("");

  // Edit modal state for Menu Items (what Admin added)
  const [editingMenu, setEditingMenu] = useState(null);
  const [menuEditErrors, setMenuEditErrors] = useState({});

  // Filter & Edit modal state for Seller Listings (what Farmers added)
  const [listingFilterCat, setListingFilterCat] = useState("all");
  const [listingSearch, setListingSearch] = useState("");
  const [editingListing, setEditingListing] = useState(null);
  const [listingEditErrors, setListingEditErrors] = useState({});

  const adminNotifs = useMemo(
    () => notifications.filter((n) => n.targetRole === "admin"),
    [notifications]
  );
  const unreadCount = adminNotifs.filter((n) => !n.read).length;

  function showFlash(msg) {
    setFlash(msg);
    setTimeout(() => setFlash(""), 3500);
  }

  function handleDirectLogin(e) {
    e.preventDefault();
    if (
      username.trim() === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setLoginError("");
      onAdminDirectLogin();
    } else {
      setLoginError("Invalid admin username or password.");
    }
  }

  if (user?.role !== "admin") {
    return (
      <div className="admin-login-wrap">
        <form
          className={`auth-card ${loginError ? "auth-card-error-ring" : ""}`}
          onSubmit={handleDirectLogin}
          noValidate
        >
          <div className="auth-brand-header">
            <div className="auth-logo-circle">
              <ShieldIcon size={24} />
            </div>
            <h2>Admin Console Login</h2>
            <p className="muted">Enter authorized administrator credentials</p>
          </div>

          <div className="field-group">
            <label>Admin Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setLoginError("");
              }}
              placeholder="Enter admin username"
              autoComplete="username"
            />
          </div>

          <div className="field-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError("");
              }}
              placeholder="Enter admin password"
              autoComplete="current-password"
            />
          </div>

          {loginError && (
            <div className="invalid-credentials-box" role="alert">
              <AlertCircleIcon size={18} />
              <div>
                <strong>Invalid credentials</strong>
                <p>{loginError}</p>
              </div>
            </div>
          )}

          <button type="submit" className={`full-btn ${loginError ? "btn-error-outline" : ""}`}>
            Login as Admin
          </button>
        </form>
      </div>
    );
  }

  function handleAddMenuItem(e) {
    e.preventDefault();
    const errs = {};
    if (!itemName.trim()) errs.itemName = "Fill this";
    if (!itemCategory) errs.itemCategory = "Fill this";
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const resolvedImg = resolveProductImage(itemName.trim(), itemCategory, itemImage);
    const newItem = {
      id: `menu-${Date.now()}`,
      name: itemName.trim(),
      category: itemCategory,
      image: resolvedImg,
      createdAt: new Date().toLocaleString("en-IN"),
    };

    setMenuItems((prev) => [newItem, ...prev]);
    setItemName("");
    setItemImage("");
    setFormErrors({});
    showFlash(
      `"${newItem.name}" added to ${newItem.category} menu. Sellers can now list stock and grade it.`
    );
  }

  function handleDeleteMenuItem(id) {
    if (!window.confirm("Remove this product from the official menu and linked seller listings?")) {
      return;
    }
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
    setListings((prev) => prev.filter((l) => l.menuItemId !== id));
  }

  function openMenuEdit(item) {
    setEditingMenu({
      id: item.id,
      name: item.name,
      category: item.category,
      image: item.image || "",
      createdAt: item.createdAt,
    });
    setMenuEditErrors({});
  }

  function handleSaveMenuEdit(e) {
    e.preventDefault();
    if (!editingMenu) return;
    const errs = {};
    if (!editingMenu.name.trim()) errs.name = "Fill this";
    if (!editingMenu.category) errs.category = "Fill this";
    setMenuEditErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const resolvedImg = resolveProductImage(
      editingMenu.name.trim(),
      editingMenu.category,
      editingMenu.image
    );

    const updated = {
      ...editingMenu,
      name: editingMenu.name.trim(),
      image: resolvedImg,
    };

    if (onUpdateMenuItem) {
      onUpdateMenuItem(updated);
    } else {
      setMenuItems((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      setListings((prev) =>
        prev.map((l) =>
          l.menuItemId === updated.id
            ? { ...l, name: updated.name, category: updated.category, image: updated.image }
            : l
        )
      );
    }

    setEditingMenu(null);
    showFlash(`Updated "${updated.name}" across menu and linked seller listings.`);
  }

  function openListingEdit(listing) {
    setEditingListing({
      id: listing.id,
      menuItemId: listing.menuItemId,
      name: listing.name,
      category: listing.category,
      sellerId: listing.sellerId,
      sellerName: listing.sellerName || "",
      price: String(listing.price),
      quantity: String(listing.quantity),
      grade: listing.grade || "A",
      image: listing.image || "",
      description: listing.description || "",
    });
    setListingEditErrors({});
  }

  function adjustEditingPriceByPercent(pct) {
    if (!editingListing) return;
    const current = Number(editingListing.price) || 0;
    if (current <= 0) return;
    const adjusted = Math.max(1, Math.round(current * (1 + pct / 100)));
    setEditingListing((prev) => ({ ...prev, price: String(adjusted) }));
    setListingEditErrors((prev) => ({ ...prev, price: "" }));
  }

  function handleSaveListingEdit(e) {
    e.preventDefault();
    if (!editingListing) return;
    const errs = {};
    if (!editingListing.name.trim()) errs.name = "Fill this";
    if (!editingListing.category) errs.category = "Fill this";
    if (!editingListing.sellerName.trim()) errs.sellerName = "Fill this";
    if (!editingListing.price || Number(editingListing.price) <= 0) errs.price = "Fill this";
    if (editingListing.quantity === "" || Number(editingListing.quantity) < 0) {
      errs.quantity = "Fill this";
    }
    if (!editingListing.grade) errs.grade = "Fill this";
    setListingEditErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const resolvedImg = resolveProductImage(
      editingListing.name.trim(),
      editingListing.category,
      editingListing.image
    );

    const updated = {
      ...editingListing,
      name: editingListing.name.trim(),
      sellerName: editingListing.sellerName.trim(),
      price: Number(editingListing.price),
      quantity: Number(editingListing.quantity),
      image: resolvedImg,
      description: editingListing.description.trim(),
      updatedAt: new Date().toLocaleString("en-IN"),
    };

    if (onUpdateListing) {
      onUpdateListing(updated);
    } else {
      setListings((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    }

    setEditingListing(null);
    showFlash(
      `Updated "${updated.name}" (₹${updated.price}/kg · ${updated.quantity} kg · Grade ${updated.grade}).`
    );
  }

  function handleDeleteListing(id) {
    if (!window.confirm("Remove this seller listing from the marketplace?")) return;
    setListings((prev) => prev.filter((l) => l.id !== id));
    showFlash("Listing removed from marketplace.");
  }

  const previewUrl = resolveProductImage(itemName, itemCategory, itemImage);
  const filteredMenu =
    filterCat === "all"
      ? menuItems
      : menuItems.filter((m) => m.category === filterCat);

  const filteredListings = useMemo(() => {
    const q = listingSearch.trim().toLowerCase();
    return listings.filter((l) => {
      const matchesCat = listingFilterCat === "all" || l.category === listingFilterCat;
      const matchesQuery =
        !q ||
        l.name.toLowerCase().includes(q) ||
        (l.sellerName || "").toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [listings, listingFilterCat, listingSearch]);

  const sellers = users.filter((u) => u.role === "seller");
  const buyers = users.filter((u) => u.role === "buyer");

  const navItems = [
    { id: "dashboard", label: "Overview", icon: <GridIcon size={17} /> },
    { id: "menu", label: "Menu Catalog", icon: <PlusCircleIcon size={17} /> },
    { id: "listings", label: "Seller Listings", icon: <PackageIcon size={17} /> },
    {
      id: "orders",
      label: "Orders & Alerts",
      icon: <BellIcon size={17} />,
      badge: unreadCount,
    },
    { id: "users", label: "Users", icon: <UsersIcon size={17} /> },
    { id: "settings", label: "Profile Settings", icon: <SettingsIcon size={17} /> },
  ];

  return (
    <div className="dashboard-layout">
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <LeafLogo size={20} />
          <span>AgriConnect</span>
        </div>
        <p className="side-label">ADMIN CONSOLE</p>

        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`side-link ${section === item.id ? "active" : ""}`}
            onClick={() => {
              setSection(item.id);
              if (item.id === "orders" && unreadCount > 0) {
                onMarkNotificationsRead("admin");
              }
            }}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge > 0 && <span className="side-badge">{item.badge}</span>}
          </button>
        ))}

        <button type="button" className="side-link side-logout" onClick={onLogout}>
          <LogOutIcon size={17} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="dash-main">
        <header className="dash-top">
          <div>
            <h1>{navItems.find((n) => n.id === section)?.label || "Admin Console"}</h1>
            <p>Manage official category menu, edit any product or market price, and track buyer orders.</p>
          </div>
          <div className="user-pill">
            <ShieldIcon size={16} />
            <span>Administrator ({ADMIN_CREDENTIALS.username})</span>
          </div>
        </header>

        {flash && (
          <div className="auth-success-banner top-flash">
            <CheckCircleIcon size={18} />
            <span>{flash}</span>
          </div>
        )}

        {section === "dashboard" && (
          <>
            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-icon-box"><PlusCircleIcon size={20} /></span>
                <div>
                  <p>Menu Products</p>
                  <h2>{menuItems.length}</h2>
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-icon-box"><PackageIcon size={20} /></span>
                <div>
                  <p>Active Seller Listings</p>
                  <h2>{listings.length}</h2>
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-icon-box"><BellIcon size={20} /></span>
                <div>
                  <p>Total Orders</p>
                  <h2>{orders.length}</h2>
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-icon-box"><UsersIcon size={20} /></span>
                <div>
                  <p>Sellers / Buyers</p>
                  <h2>
                    {sellers.length} / {buyers.length}
                  </h2>
                </div>
              </div>
            </div>

            <div className="welcome-panel">
              <h3>Recent Order Notifications</h3>
              {adminNotifs.length === 0 ? (
                <p className="muted">No order notifications yet. When a buyer checks out, alerts appear here instantly.</p>
              ) : (
                <div className="notif-feed">
                  {adminNotifs.slice(0, 6).map((n) => (
                    <div key={n.id} className={`notif-item ${!n.read ? "unread" : ""}`}>
                      <BellIcon size={16} />
                      <div>
                        <strong>{n.title}</strong>
                        <p>{n.message}</p>
                        <small>{n.createdAt}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {section === "menu" && (
          <>
            <section className="form-panel">
              <div className="section-heading">
                <p className="eyebrow">OFFICIAL CATEGORY MENU</p>
                <h2>Add Product to Menu</h2>
                <p>
                  Only products added here appear for Sellers to grade (A, B, C, H) and list for
                  Buyers. You can edit any menu item below at any time.
                </p>
              </div>

              <form className="admin-menu-form" onSubmit={handleAddMenuItem} noValidate>
                <div className="admin-form-fields">
                  <div className={`field-group ${formErrors.itemName ? "field-invalid" : ""}`}>
                    <label>
                      Product Name <span className="req-star">*</span>
                    </label>
                    <input
                      value={itemName}
                      onChange={(e) => {
                        setItemName(e.target.value);
                        setFormErrors((p) => ({ ...p, itemName: "" }));
                      }}
                      placeholder="e.g. Organic Alphonso Mangoes, Farm Tomatoes, Buffalo Milk"
                    />
                    {formErrors.itemName && (
                      <span className="field-error-badge">{formErrors.itemName}</span>
                    )}
                  </div>

                  <div className={`field-group ${formErrors.itemCategory ? "field-invalid" : ""}`}>
                    <label>
                      Category (7 Official Categories) <span className="req-star">*</span>
                    </label>
                    <select
                      value={itemCategory}
                      onChange={(e) => setItemCategory(e.target.value)}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field-group full-span">
                    <label>Custom Image URL (Optional — auto-matches real photo if blank)</label>
                    <input
                      value={itemImage}
                      onChange={(e) => setItemImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  <div className="form-actions full-span">
                    <button type="submit" className="primary-btn">
                      Add Product to Menu
                    </button>
                  </div>
                </div>

                <div className="menu-img-preview-card">
                  <span>Live Photo Preview</span>
                  <img
                    src={previewUrl}
                    alt="Product preview"
                    onError={(e) => {
                      e.currentTarget.src = getCategoryImage(itemCategory);
                    }}
                  />
                  <small>{itemName.trim() || "Product Name"} · {itemCategory}</small>
                </div>
              </form>
            </section>

            <section className="menu-catalog-section">
              <div className="catalog-filter-bar">
                <h3>Menu Products ({filteredMenu.length})</h3>
                <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
                  <option value="all">All 7 Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {filteredMenu.length === 0 ? (
                <div className="empty-state">
                  <h3>No products in this menu category yet</h3>
                  <p>Add a product above so farmers can list their stock, grade, and price.</p>
                </div>
              ) : (
                <div className="admin-menu-grid">
                  {filteredMenu.map((item) => (
                    <div key={item.id} className="admin-menu-card">
                      <img
                        src={item.image || getCategoryImage(item.category)}
                        alt={item.name}
                        onError={(e) => {
                          e.currentTarget.src = getCategoryImage(item.category);
                        }}
                      />
                      <div className="admin-menu-card-body">
                        <span className="category-chip">{item.category}</span>
                        <h4>{item.name}</h4>
                        <small className="muted">Added {item.createdAt}</small>
                      </div>
                      <div className="admin-menu-card-actions">
                        <button
                          type="button"
                          className="icon-edit-btn"
                          onClick={() => openMenuEdit(item)}
                          title="Edit menu product"
                          aria-label={`Edit ${item.name}`}
                        >
                          <EditIcon size={15} />
                        </button>
                        <button
                          type="button"
                          className="icon-danger-btn"
                          onClick={() => handleDeleteMenuItem(item.id)}
                          title="Remove from menu"
                          aria-label={`Remove ${item.name}`}
                        >
                          <TrashIcon size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {section === "listings" && (
          <>
            <div className="admin-listings-toolbar">
              <div className="search-input-wrap">
                <SearchIcon size={16} />
                <input
                  value={listingSearch}
                  onChange={(e) => setListingSearch(e.target.value)}
                  placeholder="Search by product, seller, or category..."
                />
              </div>
              <select
                value={listingFilterCat}
                onChange={(e) => setListingFilterCat(e.target.value)}
              >
                <option value="all">All 7 Categories ({listings.length})</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Seller</th>
                    <th>Grade</th>
                    <th>Price</th>
                    <th>Live Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.map((l) => {
                    const grade = getGradeInfo(l.grade);
                    return (
                      <tr key={l.id}>
                        <td>
                          <div className="table-product-cell">
                            <img
                              src={l.image || getCategoryImage(l.category)}
                              alt={l.name}
                              onError={(e) => {
                                e.currentTarget.src = getCategoryImage(l.category);
                              }}
                            />
                            <span>{l.name}</span>
                          </div>
                        </td>
                        <td>{l.category}</td>
                        <td>{l.sellerName}</td>
                        <td>
                          <span className={`grade-badge ${grade.colorClass}`}>
                            {l.grade === "H" ? "Grade H · Hybrid" : `Grade ${l.grade}`}
                          </span>
                        </td>
                        <td>
                          <strong>&#8377;{Number(l.price).toLocaleString("en-IN")}</strong> / kg
                        </td>
                        <td>
                          <strong>{l.quantity} kg</strong>
                        </td>
                        <td>
                          <div className="table-action-btns">
                            <button
                              type="button"
                              className="outline-btn small-btn edit-action-btn"
                              onClick={() => openListingEdit(l)}
                            >
                              <EditIcon size={14} /> Edit
                            </button>
                            <button
                              type="button"
                              className="icon-danger-btn"
                              onClick={() => handleDeleteListing(l.id)}
                              title="Remove listing"
                              aria-label={`Remove ${l.name}`}
                            >
                              <TrashIcon size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredListings.length === 0 && (
                <div className="empty-state">
                  <h3>No matching seller listings</h3>
                  <p>Try clearing the filter or add products to the menu.</p>
                </div>
              )}
            </div>
          </>
        )}

        {section === "orders" && (
          <>
            {adminNotifs.length > 0 && (
              <div className="notif-banner-panel">
                <h3>Order Notifications ({adminNotifs.length})</h3>
                <div className="notif-feed">
                  {adminNotifs.slice(0, 5).map((n) => (
                    <div key={n.id} className="notif-item">
                      <BellIcon size={16} />
                      <div>
                        <strong>{n.title}</strong>
                        <p>{n.message}</p>
                        <small>{n.createdAt}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Buyer &amp; Pincode</th>
                    <th>Seller</th>
                    <th>Qty</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td><strong>{o.id}</strong></td>
                      <td>
                        {o.productName} <small>({o.grade === "H" ? "Hybrid H" : `Grade ${o.grade}`})</small>
                      </td>
                      <td>
                        {o.buyerName}
                        <br />
                        <small className="muted">PIN: {o.address?.pincode || "—"}</small>
                      </td>
                      <td>{o.sellerName}</td>
                      <td>{o.quantity} kg</td>
                      <td>{o.paymentMethod}</td>
                      <td><strong>&#8377;{Number(o.total).toLocaleString("en-IN")}</strong></td>
                      <td>
                        <span className={`status-chip status-${o.status.toLowerCase().replace(/\s+/g, "-")}`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="empty-state">
                  <h3>No buyer orders placed yet</h3>
                </div>
              )}
            </div>
          </>
        )}

        {section === "users" && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email / Username</th>
                  <th>Phone</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.phone || "—"}</td>
                    <td>
                      <span className="category-chip">{u.role.toUpperCase()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="empty-state">
                <h3>No registered sellers or buyers yet</h3>
              </div>
            )}
          </div>
        )}

        {section === "settings" && (
          <ProfileSettings
            user={user}
            onUpdateUser={onUpdateUser}
            onLogout={onLogout}
            glassEnabled={glassEnabled}
            onToggleGlass={onToggleGlass}
          />
        )}
      </main>

      {/* EDIT MENU PRODUCT MODAL (Admin edits what Admin added) */}
      {editingMenu && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Edit Menu Product"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingMenu(null);
          }}
        >
          <div className="edit-modal-card">
            <div className="edit-modal-header">
              <div>
                <p className="eyebrow">ADMIN CATALOG EDITOR</p>
                <h3>Edit Menu Product</h3>
              </div>
              <button
                type="button"
                className="modal-close-icon"
                onClick={() => setEditingMenu(null)}
                aria-label="Close modal"
              >
                <XIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveMenuEdit} noValidate>
              <div className="edit-modal-body">
                <div className="edit-modal-preview-row">
                  <img
                    src={resolveProductImage(
                      editingMenu.name,
                      editingMenu.category,
                      editingMenu.image
                    )}
                    alt={editingMenu.name}
                    onError={(e) => {
                      e.currentTarget.src = getCategoryImage(editingMenu.category);
                    }}
                  />
                  <div>
                    <strong>{editingMenu.name || "Product Name"}</strong>
                    <span className="muted">
                      Changes automatically sync to all linked seller listings.
                    </span>
                  </div>
                </div>

                <div className={`field-group ${menuEditErrors.name ? "field-invalid" : ""}`}>
                  <label>
                    Product Name <span className="req-star">*</span>
                  </label>
                  <input
                    value={editingMenu.name}
                    onChange={(e) => {
                      setEditingMenu((p) => ({ ...p, name: e.target.value }));
                      setMenuEditErrors((p) => ({ ...p, name: "" }));
                    }}
                  />
                  {menuEditErrors.name && (
                    <span className="field-error-badge">{menuEditErrors.name}</span>
                  )}
                </div>

                <div className="field-group">
                  <label>
                    Category <span className="req-star">*</span>
                  </label>
                  <select
                    value={editingMenu.category}
                    onChange={(e) =>
                      setEditingMenu((p) => ({ ...p, category: e.target.value }))
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field-group">
                  <label>Image URL (leave blank to auto-match product photo)</label>
                  <input
                    value={editingMenu.image}
                    onChange={(e) =>
                      setEditingMenu((p) => ({ ...p, image: e.target.value }))
                    }
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <div className="edit-modal-footer">
                <button
                  type="button"
                  className="outline-btn"
                  onClick={() => setEditingMenu(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SELLER LISTING MODAL (Admin edits ANYTHING farmers or admin added) */}
      {editingListing && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Edit Product Listing"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingListing(null);
          }}
        >
          <div className="edit-modal-card wide">
            <div className="edit-modal-header">
              <div>
                <p className="eyebrow">FULL ADMIN PRODUCT EDITOR</p>
                <h3>Edit Listing &amp; Market Price</h3>
              </div>
              <button
                type="button"
                className="modal-close-icon"
                onClick={() => setEditingListing(null)}
                aria-label="Close modal"
              >
                <XIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveListingEdit} noValidate>
              <div className="edit-modal-body">
                <div className="edit-modal-preview-row">
                  <img
                    src={resolveProductImage(
                      editingListing.name,
                      editingListing.category,
                      editingListing.image
                    )}
                    alt={editingListing.name}
                    onError={(e) => {
                      e.currentTarget.src = getCategoryImage(editingListing.category);
                    }}
                  />
                  <div>
                    <strong>{editingListing.name || "Product Name"}</strong>
                    <span className="muted">
                      Admin can edit product details, grade, stock, image, seller, or adjust price
                      according to market trends.
                    </span>
                  </div>
                </div>

                <div className="edit-modal-grid">
                  <div className={`field-group ${listingEditErrors.name ? "field-invalid" : ""}`}>
                    <label>
                      Product Name <span className="req-star">*</span>
                    </label>
                    <input
                      value={editingListing.name}
                      onChange={(e) => {
                        setEditingListing((p) => ({ ...p, name: e.target.value }));
                        setListingEditErrors((p) => ({ ...p, name: "" }));
                      }}
                    />
                    {listingEditErrors.name && (
                      <span className="field-error-badge">{listingEditErrors.name}</span>
                    )}
                  </div>

                  <div className="field-group">
                    <label>
                      Category <span className="req-star">*</span>
                    </label>
                    <select
                      value={editingListing.category}
                      onChange={(e) =>
                        setEditingListing((p) => ({ ...p, category: e.target.value }))
                      }
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={`field-group ${listingEditErrors.price ? "field-invalid" : ""}`}>
                    <label>
                      Market Price per kg (&#8377;) <span className="req-star">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editingListing.price}
                      onChange={(e) => {
                        setEditingListing((p) => ({ ...p, price: e.target.value }));
                        setListingEditErrors((p) => ({ ...p, price: "" }));
                      }}
                    />
                    <div className="trend-chip-row">
                      <span className="trend-label">Market Trend:</span>
                      {[-10, -5, 5, 10].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          className={`trend-chip ${pct > 0 ? "up" : "down"}`}
                          onClick={() => adjustEditingPriceByPercent(pct)}
                        >
                          {pct > 0 ? `+${pct}%` : `${pct}%`}
                        </button>
                      ))}
                    </div>
                    {listingEditErrors.price && (
                      <span className="field-error-badge">{listingEditErrors.price}</span>
                    )}
                  </div>

                  <div
                    className={`field-group ${listingEditErrors.quantity ? "field-invalid" : ""}`}
                  >
                    <label>
                      Live Stock (kg) <span className="req-star">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingListing.quantity}
                      onChange={(e) => {
                        setEditingListing((p) => ({ ...p, quantity: e.target.value }));
                        setListingEditErrors((p) => ({ ...p, quantity: "" }));
                      }}
                    />
                    {listingEditErrors.quantity && (
                      <span className="field-error-badge">{listingEditErrors.quantity}</span>
                    )}
                  </div>

                  <div className="field-group">
                    <label>
                      Quality Grade <span className="req-star">*</span>
                    </label>
                    <select
                      value={editingListing.grade}
                      onChange={(e) =>
                        setEditingListing((p) => ({ ...p, grade: e.target.value }))
                      }
                    >
                      {GRADES.map((g) => (
                        <option key={g.code} value={g.code}>
                          {g.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div
                    className={`field-group ${listingEditErrors.sellerName ? "field-invalid" : ""}`}
                  >
                    <label>
                      Seller / Farm Name <span className="req-star">*</span>
                    </label>
                    <input
                      value={editingListing.sellerName}
                      onChange={(e) => {
                        setEditingListing((p) => ({ ...p, sellerName: e.target.value }));
                        setListingEditErrors((p) => ({ ...p, sellerName: "" }));
                      }}
                    />
                    {listingEditErrors.sellerName && (
                      <span className="field-error-badge">{listingEditErrors.sellerName}</span>
                    )}
                  </div>

                  <div className="field-group full-span">
                    <label>Product Image URL (leave blank to auto-match)</label>
                    <input
                      value={editingListing.image}
                      onChange={(e) =>
                        setEditingListing((p) => ({ ...p, image: e.target.value }))
                      }
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  <div className="field-group full-span">
                    <label>Description</label>
                    <textarea
                      rows="3"
                      value={editingListing.description}
                      onChange={(e) =>
                        setEditingListing((p) => ({ ...p, description: e.target.value }))
                      }
                      placeholder="Harvest notes, farm origin, or quality details..."
                    />
                  </div>
                </div>
              </div>

              <div className="edit-modal-footer">
                <button
                  type="button"
                  className="outline-btn"
                  onClick={() => setEditingListing(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Save Product Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
