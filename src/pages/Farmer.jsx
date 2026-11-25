import React, { useMemo, useState } from "react";
import { CATEGORIES, GRADES, getCategoryImage, getGradeInfo } from "../data.js";
import {
  LeafLogo,
  GridIcon,
  PlusCircleIcon,
  PackageIcon,
  BellIcon,
  SettingsIcon,
  LogOutIcon,
  CheckCircleIcon,
  TrashIcon,
  EditIcon,
  UserIcon,
} from "../components/Icons.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProfileSettings from "../components/ProfileSettings.jsx";

const INITIAL_FORM = {
  category: CATEGORIES[0].id,
  menuItemId: "",
  quantity: "",
  grade: "",
  price: "",
  description: "",
};

export default function Farmer({
  user,
  menuItems,
  listings,
  setListings,
  onUpdateListing,
  orders,
  onConfirmOrder,
  onDeclineOrder,
  onUpdateUser,
  onLogout,
  glassEnabled,
  onToggleGlass,
}) {
  const [section, setSection] = useState("add");
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [flash, setFlash] = useState("");

  // Quick inline market-trend price editor state for My Listings cards
  const [priceEditId, setPriceEditId] = useState(null);
  const [priceDraft, setPriceDraft] = useState("");

  const myListings = useMemo(
    () => listings.filter((l) => String(l.sellerId) === String(user.id)),
    [listings, user.id]
  );

  const myOrders = useMemo(
    () => orders.filter((o) => String(o.sellerId) === String(user.id)),
    [orders, user.id]
  );

  const pendingOrders = myOrders.filter((o) => o.status === "Pending Confirmation");
  const confirmedRevenue = myOrders
    .filter((o) => o.status === "Confirmed")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  const categoryMenuItems = useMemo(
    () => menuItems.filter((m) => m.category === form.category),
    [menuItems, form.category]
  );

  function setField(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  function handleCategoryChange(nextCat) {
    setForm((prev) => ({
      ...prev,
      category: nextCat,
      menuItemId: "",
    }));
    setErrors((prev) => ({ ...prev, category: "", menuItemId: "" }));
  }

  function adjustFormPriceByPercent(pct) {
    const current = Number(form.price) || 0;
    if (current <= 0) return;
    const adjusted = Math.max(1, Math.round(current * (1 + pct / 100)));
    setField("price", String(adjusted));
  }

  function openQuickPriceEdit(item) {
    setPriceEditId(item.id);
    setPriceDraft(String(item.price));
  }

  function adjustQuickPriceByPercent(pct) {
    const current = Number(priceDraft) || 0;
    if (current <= 0) return;
    setPriceDraft(String(Math.max(1, Math.round(current * (1 + pct / 100)))));
  }

  function saveQuickPrice(item) {
    const nextPrice = Number(priceDraft);
    if (!nextPrice || nextPrice <= 0) return;

    const updated = {
      ...item,
      price: nextPrice,
      updatedAt: new Date().toLocaleString("en-IN"),
    };

    if (onUpdateListing) {
      onUpdateListing(updated);
    } else {
      setListings((prev) => prev.map((l) => (l.id === item.id ? updated : l)));
    }

    setPriceEditId(null);
    setPriceDraft("");
    setFlash(`Updated market price for "${item.name}" to ₹${nextPrice}/kg.`);
    setTimeout(() => setFlash(""), 3500);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};

    if (!form.category) nextErrors.category = "Fill this";
    if (!form.menuItemId) nextErrors.menuItemId = "Fill this";
    if (!form.quantity || Number(form.quantity) <= 0) nextErrors.quantity = "Fill this";
    if (!form.grade) nextErrors.grade = "Fill this";
    if (!form.price || Number(form.price) <= 0) nextErrors.price = "Fill this";
    // Description is intentionally OPTIONAL

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const menuProduct = menuItems.find((m) => m.id === form.menuItemId);
    if (!menuProduct) {
      setErrors({ menuItemId: "Fill this" });
      return;
    }

    const payload = {
      id: editId || `listing-${Date.now()}`,
      menuItemId: menuProduct.id,
      name: menuProduct.name,
      category: menuProduct.category,
      image: menuProduct.image || getCategoryImage(menuProduct.category),
      sellerId: user.id,
      sellerName: user.name,
      quantity: Number(form.quantity),
      grade: form.grade,
      price: Number(form.price),
      description: form.description.trim(),
      updatedAt: new Date().toLocaleString("en-IN"),
    };

    setListings((prev) =>
      editId ? prev.map((item) => (item.id === editId ? payload : item)) : [payload, ...prev]
    );

    setForm({ ...INITIAL_FORM, category: form.category });
    setEditId(null);
    setErrors({});
    setFlash(
      editId
        ? `Updated "${payload.name}" listing successfully.`
        : `Listed "${payload.name}" (Grade ${payload.grade}) for Buyers!`
    );
    setTimeout(() => setFlash(""), 3500);
    setSection("listings");
  }

  function startEdit(item) {
    setForm({
      category: item.category,
      menuItemId: item.menuItemId,
      quantity: String(item.quantity),
      grade: item.grade,
      price: String(item.price),
      description: item.description || "",
    });
    setEditId(item.id);
    setPriceEditId(null);
    setErrors({});
    setSection("add");
  }

  function deleteListing(id) {
    if (!window.confirm("Remove this listing from the buyer marketplace?")) return;
    setListings((prev) => prev.filter((item) => item.id !== id));
  }

  function handleConfirm(orderId) {
    const res = onConfirmOrder(orderId);
    if (res?.ok) {
      setFlash(res.message);
      setTimeout(() => setFlash(""), 3500);
    } else if (res?.message) {
      window.alert(res.message);
    }
  }

  const navItems = [
    { id: "dashboard", label: "Overview", icon: <GridIcon size={17} /> },
    { id: "add", label: "List Produce", icon: <PlusCircleIcon size={17} /> },
    { id: "listings", label: "My Listings", icon: <PackageIcon size={17} /> },
    {
      id: "orders",
      label: "Buyer Orders",
      icon: <BellIcon size={17} />,
      badge: pendingOrders.length,
    },
    { id: "settings", label: "Profile Settings", icon: <SettingsIcon size={17} /> },
  ];

  return (
    <div className="dashboard-layout">
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <LeafLogo size={20} />
          <span>AgriConnect</span>
        </div>
        <p className="side-label">SELLER STUDIO</p>

        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`side-link ${section === item.id ? "active" : ""}`}
            onClick={() => setSection(item.id)}
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
            <h1>{navItems.find((n) => n.id === section)?.label || "Seller Studio"}</h1>
            <p>Select Admin menu items, assign quality grade (A/B/C/H), edit prices for market trends &amp; confirm orders.</p>
          </div>
          <div className="user-pill">
            <UserIcon size={16} />
            <span>{user.name} (Seller)</span>
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
                <span className="stat-icon-box"><PackageIcon size={20} /></span>
                <div>
                  <p>My Active Listings</p>
                  <h2>{myListings.length}</h2>
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-icon-box"><BellIcon size={20} /></span>
                <div>
                  <p>Pending Confirmations</p>
                  <h2>{pendingOrders.length}</h2>
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-icon-box"><CheckCircleIcon size={20} /></span>
                <div>
                  <p>Total Orders</p>
                  <h2>{myOrders.length}</h2>
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-icon-box"><LeafLogo size={20} /></span>
                <div>
                  <p>Confirmed Sales</p>
                  <h2>&#8377;{confirmedRevenue.toLocaleString("en-IN")}</h2>
                </div>
              </div>
            </div>

            <div className="welcome-panel">
              <h3>Quick Seller Actions</h3>
              <p className="muted">
                Admin has curated <strong>{menuItems.length}</strong> menu product(s) across the 7
                official categories. Add your available stock, grade, and price, or update prices
                anytime as market trends shift.
              </p>
              <div className="quick-btn-row">
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => {
                    setEditId(null);
                    setForm(INITIAL_FORM);
                    setSection("add");
                  }}
                >
                  List Produce from Menu
                </button>
                <button
                  type="button"
                  className="outline-btn"
                  onClick={() => setSection("listings")}
                >
                  Edit Prices &amp; My Listings ({myListings.length})
                </button>
                <button
                  type="button"
                  className="outline-btn"
                  onClick={() => setSection("orders")}
                >
                  Review Buyer Orders ({pendingOrders.length} pending)
                </button>
              </div>
            </div>
          </>
        )}

        {section === "add" && (
          <section className="form-panel">
            <div className="section-heading">
              <p className="eyebrow">CATEGORY-WISE FARM LISTING</p>
              <h2>{editId ? "Edit Produce Listing & Price" : "Add Stock, Grade & Price"}</h2>
              <p>
                All fields except Description are mandatory. Skipped required fields will highlight
                in red with a &ldquo;Fill this&rdquo; notice.
              </p>
            </div>

            {menuItems.length === 0 ? (
              <div className="empty-state">
                <h3>No Admin Menu Products Yet</h3>
                <p>
                  Waiting for the Admin to add products to the official category menu. Once Admin
                  adds products, you can select them here and set your quantity, grade, and price.
                </p>
              </div>
            ) : (
              <form className="seller-form-grid" onSubmit={handleSubmit} noValidate>
                <div className={`field-group ${errors.category ? "field-invalid" : ""}`}>
                  <label>
                    Category <span className="req-star">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    {CATEGORIES.map((c) => {
                      const count = menuItems.filter((m) => m.category === c.id).length;
                      return (
                        <option key={c.id} value={c.id}>
                          {c.label} ({count} menu items)
                        </option>
                      );
                    })}
                  </select>
                  {errors.category && <span className="field-error-badge">{errors.category}</span>}
                </div>

                <div className={`field-group ${errors.menuItemId ? "field-invalid" : ""}`}>
                  <label>
                    Product from Admin Menu <span className="req-star">*</span>
                  </label>
                  <select
                    value={form.menuItemId}
                    onChange={(e) => setField("menuItemId", e.target.value)}
                  >
                    <option value="">-- Select a product --</option>
                    {categoryMenuItems.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  {categoryMenuItems.length === 0 && (
                    <small className="muted">No Admin menu items in {form.category} yet.</small>
                  )}
                  {errors.menuItemId && (
                    <span className="field-error-badge">{errors.menuItemId}</span>
                  )}
                </div>

                <div className={`field-group ${errors.quantity ? "field-invalid" : ""}`}>
                  <label>
                    Available Quantity (kg) <span className="req-star">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={(e) => setField("quantity", e.target.value)}
                    placeholder="e.g. 50"
                  />
                  {errors.quantity && <span className="field-error-badge">{errors.quantity}</span>}
                </div>

                <div className={`field-group ${errors.price ? "field-invalid" : ""}`}>
                  <label>
                    Price per kg (&#8377;) <span className="req-star">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.price}
                    onChange={(e) => setField("price", e.target.value)}
                    placeholder="e.g. 60"
                  />
                  {editId && (
                    <div className="trend-chip-row">
                      <span className="trend-label">Market Trend:</span>
                      {[-10, -5, 5, 10].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          className={`trend-chip ${pct > 0 ? "up" : "down"}`}
                          onClick={() => adjustFormPriceByPercent(pct)}
                        >
                          {pct > 0 ? `+${pct}%` : `${pct}%`}
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.price && <span className="field-error-badge">{errors.price}</span>}
                </div>

                <div className={`field-group full-span ${errors.grade ? "field-invalid" : ""}`}>
                  <label>
                    Quality Grade (A, B, C or H for Hybrid) <span className="req-star">*</span>
                  </label>
                  <div className="grade-selector-grid">
                    {GRADES.map((g) => (
                      <button
                        key={g.code}
                        type="button"
                        className={`grade-choice-card ${form.grade === g.code ? "selected" : ""}`}
                        onClick={() => setField("grade", g.code)}
                      >
                        <span className={`grade-badge ${g.colorClass}`}>{g.title}</span>
                        <p>{g.description}</p>
                      </button>
                    ))}
                  </div>
                  {errors.grade && <span className="field-error-badge">{errors.grade}</span>}
                </div>

                <div className="field-group full-span">
                  <label>Description (Optional)</label>
                  <textarea
                    rows="3"
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    placeholder="Optional notes on harvest date, organic care, or variety details..."
                  />
                </div>

                <div className="form-actions full-span">
                  <button type="submit" className="primary-btn">
                    {editId ? "Update Listing" : "Publish Listing"}
                  </button>
                  {editId && (
                    <button
                      type="button"
                      className="outline-btn"
                      onClick={() => {
                        setEditId(null);
                        setForm(INITIAL_FORM);
                        setErrors({});
                      }}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            )}
          </section>
        )}

        {section === "listings" && (
          <>
            {myListings.length === 0 ? (
              <div className="empty-state">
                <h3>You have not listed any products yet</h3>
                <p>Choose a product from the Admin Menu to start selling.</p>
                <button type="button" className="primary-btn" onClick={() => setSection("add")}>
                  List Your First Product
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {myListings.map((item) => {
                  const isEditingPrice = priceEditId === item.id;
                  return (
                    <ProductCard
                      key={item.id}
                      product={item}
                      showActions={false}
                      footerSlot={
                        isEditingPrice ? (
                          <div className="inline-price-editor">
                            <label className="inline-price-label">
                              Update Market Price (&#8377; / kg)
                            </label>
                            <div className="inline-price-input-row">
                              <input
                                type="number"
                                min="1"
                                value={priceDraft}
                                onChange={(e) => setPriceDraft(e.target.value)}
                                aria-label={`New price for ${item.name}`}
                              />
                              <button
                                type="button"
                                className="primary-btn small-btn"
                                onClick={() => saveQuickPrice(item)}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="outline-btn small-btn"
                                onClick={() => {
                                  setPriceEditId(null);
                                  setPriceDraft("");
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                            <div className="trend-chip-row">
                              {[-10, -5, 5, 10].map((pct) => (
                                <button
                                  key={pct}
                                  type="button"
                                  className={`trend-chip ${pct > 0 ? "up" : "down"}`}
                                  onClick={() => adjustQuickPriceByPercent(pct)}
                                >
                                  {pct > 0 ? `+${pct}%` : `${pct}%`}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="seller-card-actions">
                            <div className="seller-edit-group">
                              <button
                                type="button"
                                className="primary-btn small-btn edit-action-btn"
                                onClick={() => openQuickPriceEdit(item)}
                              >
                                <EditIcon size={13} /> Edit Price
                              </button>
                              <button
                                type="button"
                                className="outline-btn small-btn"
                                onClick={() => startEdit(item)}
                              >
                                Edit Details
                              </button>
                            </div>
                            <button
                              type="button"
                              className="icon-danger-btn"
                              onClick={() => deleteListing(item.id)}
                              aria-label="Delete listing"
                            >
                              <TrashIcon size={15} />
                            </button>
                          </div>
                        )
                      }
                    />
                  );
                })}
              </div>
            )}
          </>
        )}

        {section === "orders" && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product &amp; Grade</th>
                  <th>Buyer &amp; Delivery</th>
                  <th>Quantity</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Status / Action</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.map((o) => {
                  const grade = getGradeInfo(o.grade);
                  return (
                    <tr key={o.id}>
                      <td><strong>{o.id}</strong></td>
                      <td>
                        {o.productName}{" "}
                        <span className={`grade-badge ${grade.colorClass}`}>
                          {o.grade === "H" ? "Hybrid H" : `Grade ${o.grade}`}
                        </span>
                      </td>
                      <td>
                        <strong>{o.buyerName}</strong>
                        <br />
                        <small className="muted">
                          {o.address?.street}, PIN {o.address?.pincode}
                        </small>
                      </td>
                      <td><strong>{o.quantity} kg</strong></td>
                      <td>{o.paymentMethod}</td>
                      <td><strong>&#8377;{Number(o.total).toLocaleString("en-IN")}</strong></td>
                      <td>
                        {o.status === "Pending Confirmation" ? (
                          <div className="order-action-btns">
                            <button
                              type="button"
                              className="confirm-order-btn"
                              onClick={() => handleConfirm(o.id)}
                            >
                              Confirm Order
                            </button>
                            <button
                              type="button"
                              className="decline-order-btn"
                              onClick={() => onDeclineOrder(o.id)}
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`status-chip status-${o.status
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {o.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {myOrders.length === 0 && (
              <div className="empty-state">
                <h3>No orders received yet</h3>
                <p>When buyers order your produce, confirm here to automatically adjust stock.</p>
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
    </div>
  );
}
