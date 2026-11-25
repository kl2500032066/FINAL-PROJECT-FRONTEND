import React, { useEffect, useMemo, useState } from "react";
import { CATEGORIES, TRENDING_BANNERS, getGradeInfo } from "../data.js";
import {
  LeafLogo,
  GridIcon,
  CartIcon,
  PackageIcon,
  SettingsIcon,
  LogOutIcon,
  SearchIcon,
  SparklesIcon,
  ChevronRightIcon,
  XIcon,
} from "../components/Icons.jsx";
import LiquidGlassBar from "../components/LiquidGlassBar.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProfileSettings from "../components/ProfileSettings.jsx";

export default function Buyer({
  user,
  listings,
  orders,
  cart,
  onAddToCart,
  onUpdateCartQty,
  onOpenCart,
  onUpdateUser,
  onLogout,
  glassEnabled,
  onToggleGlass,
}) {
  const [section, setSection] = useState("explore"); // explore | orders | settings
  const [activeCategory, setActiveCategory] = useState(null); // null = Trending Now home view, string = opened category tab
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [bannerIndex, setBannerIndex] = useState(0);

  // Subtle auto-rotation for the Swiggy/Zomato-style Trending Now banner
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % TRENDING_BANNERS.length);
    }, 5200);
    return () => clearInterval(timer);
  }, []);

  const myOrders = useMemo(
    () => orders.filter((o) => String(o.buyerId) === String(user.id)),
    [orders, user.id]
  );

  const categoryCounts = useMemo(() => {
    const map = {};
    CATEGORIES.forEach((c) => {
      map[c.id] = listings.filter(
        (l) => l.category === c.id && Number(l.quantity) > 0
      ).length;
    });
    return map;
  }, [listings]);

  const cartQtyMap = useMemo(() => {
    const map = {};
    cart.forEach((c) => {
      map[c.listingId] = c.quantity;
    });
    return map;
  }, [cart]);

  const totalCartItems = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  const isGlobalSearching = !activeCategory && Boolean(searchQuery.trim());

  const visibleProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!activeCategory && !q) return [];
    return listings.filter((item) => {
      const matchesCat = !activeCategory || item.category === activeCategory;
      const matchesGrade = gradeFilter === "ALL" || item.grade === gradeFilter;
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.sellerName || "").toLowerCase().includes(q) ||
        (item.description || "").toLowerCase().includes(q);
      return matchesCat && matchesGrade && matchesSearch;
    });
  }, [listings, activeCategory, gradeFilter, searchQuery]);

  function openCategoryTab(categoryId) {
    setSection("explore");
    setActiveCategory(categoryId);
    setGradeFilter("ALL");
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    setSection("explore");
    setSearchQuery(searchInput.trim());
  }

  function handleClearSearch() {
    setSearchInput("");
    setSearchQuery("");
  }

  const currentBanner = TRENDING_BANNERS[bannerIndex];

  return (
    <div className="buyer-shell">
      {/* LEFT SIDEBAR: Instamart / Blinkit style navigation + quick category menu */}
      <aside className="buyer-left-rail">
        <div className="dash-brand">
          <LeafLogo size={20} />
          <span>AgriConnect</span>
        </div>

        <p className="side-label">MENU</p>
        <button
          type="button"
          className={`side-link ${
            section === "explore" && !activeCategory && !isGlobalSearching ? "active" : ""
          }`}
          onClick={() => {
            setSection("explore");
            setActiveCategory(null);
            handleClearSearch();
          }}
        >
          <SparklesIcon size={17} />
          <span>Trending Now</span>
        </button>

        <button
          type="button"
          className="side-link"
          onClick={onOpenCart}
        >
          <CartIcon size={17} />
          <span>My Cart</span>
          {totalCartItems > 0 && <span className="side-badge">{totalCartItems}</span>}
        </button>

        <button
          type="button"
          className={`side-link ${section === "orders" ? "active" : ""}`}
          onClick={() => setSection("orders")}
        >
          <PackageIcon size={17} />
          <span>My Orders</span>
          {myOrders.length > 0 && <span className="side-badge subtle">{myOrders.length}</span>}
        </button>

        <button
          type="button"
          className={`side-link ${section === "settings" ? "active" : ""}`}
          onClick={() => setSection("settings")}
        >
          <SettingsIcon size={17} />
          <span>Profile Settings</span>
        </button>

        <p className="side-label mt-section">CATEGORIES</p>
        <div className="instamart-left-cats">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`instamart-cat-item ${
                section === "explore" && activeCategory === cat.id ? "active" : ""
              }`}
              onClick={() => openCategoryTab(cat.id)}
            >
              <img src={cat.image} alt={cat.label} loading="lazy" />
              <div className="instamart-cat-text">
                <span>{cat.shortLabel}</span>
                {categoryCounts[cat.id] > 0 && (
                  <small>{categoryCounts[cat.id]} live</small>
                )}
              </div>
            </button>
          ))}
        </div>

        <button type="button" className="side-link side-logout" onClick={onLogout}>
          <LogOutIcon size={17} />
          <span>Logout</span>
        </button>
      </aside>

      {/* CENTER CONTENT */}
      <main className="buyer-center-main">
        {section === "explore" && (
          <>
            {/* Liquid Glass iPhone-style sliding category bar */}
            <LiquidGlassBar
              categories={CATEGORIES}
              activeCategory={activeCategory || ""}
              onSelect={openCategoryTab}
              counts={categoryCounts}
              glassEnabled={glassEnabled}
            />

            {/* BUYER SEARCH BAR WITH EXPLICIT SEARCH BUTTON */}
            <form
              className="buyer-global-search-bar"
              onSubmit={handleSearchSubmit}
              role="search"
              aria-label="Search farm products"
            >
              <div className="buyer-search-input-box">
                <SearchIcon size={18} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchInput(val);
                    if (!val.trim()) setSearchQuery("");
                  }}
                  placeholder={
                    activeCategory
                      ? `Search items in ${activeCategory}...`
                      : "Search tomatoes, mangoes, milk, rice, spices, honey..."
                  }
                />
                {(searchInput || searchQuery) && (
                  <button
                    type="button"
                    className="buyer-search-clear-btn"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                  >
                    <XIcon size={15} />
                  </button>
                )}
              </div>
              <button type="submit" className="buyer-search-btn">
                <SearchIcon size={16} />
                <span>Search</span>
              </button>
            </form>

            {/* TRENDING NOW BANNER (Swiggy / Zomato style — STRICTLY NO ADD TO CART BUTTONS) */}
            {!isGlobalSearching && (
              <section className="trending-banner-stage" aria-label="Trending now highlights">
                <div className="trending-hero-banner">
                  <img
                    src={currentBanner.image}
                    alt={currentBanner.title}
                    className="trending-banner-bg"
                  />
                  <div className="trending-banner-scrim" />
                  <div className="trending-banner-content">
                    <span className="trending-pill">
                      <SparklesIcon size={13} /> {currentBanner.badge}
                    </span>
                    <h2>{currentBanner.title}</h2>
                    <p>{currentBanner.subtitle}</p>
                    <div className="trending-banner-footer">
                      <span className="trending-metric-chip">{currentBanner.metric}</span>
                      <button
                        type="button"
                        className="trending-explore-link"
                        onClick={() => openCategoryTab(currentBanner.category)}
                      >
                        Explore {currentBanner.category} <ChevronRightIcon size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="banner-dots">
                  {TRENDING_BANNERS.map((b, idx) => (
                    <button
                      key={b.id}
                      type="button"
                      className={`banner-dot ${idx === bannerIndex ? "active" : ""}`}
                      onClick={() => setBannerIndex(idx)}
                      aria-label={`View trending banner ${idx + 1}`}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* When NO category and NO search is active: Show Trending Showcase Strip */}
            {!activeCategory && !isGlobalSearching ? (
              <section className="trending-discover-section">
                <div className="discover-head">
                  <div>
                    <p className="eyebrow">CURRENTLY TRENDING NOW</p>
                    <h3>Explore Fresh Categories</h3>
                    <p className="muted">
                      Use the Search bar above or select any category to open available
                      farmer-listed produce.
                    </p>
                  </div>
                </div>

                <div className="trending-mosaic-grid">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className="trending-mosaic-card"
                      onClick={() => openCategoryTab(cat.id)}
                    >
                      <img src={cat.image} alt={cat.label} loading="lazy" />
                      <div className="trending-mosaic-overlay">
                        <strong>{cat.label}</strong>
                        <span>
                          {categoryCounts[cat.id] > 0
                            ? `${categoryCounts[cat.id]} farmer listing(s) available`
                            : "Tap to check availability"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ) : (
              /* CATEGORY OR GLOBAL SEARCH RESULTS VIEW (Strictly NO Edit Option for Buyers) */
              <section className="category-tab-view">
                <div className="category-tab-header">
                  <div>
                    <button
                      type="button"
                      className="back-trending-btn"
                      onClick={() => {
                        setActiveCategory(null);
                        handleClearSearch();
                      }}
                    >
                      &larr; Back to Trending Now
                    </button>
                    <h2>
                      {activeCategory
                        ? activeCategory
                        : `Search Results for "${searchQuery}"`}
                    </h2>
                    <p className="muted">
                      Showing {visibleProducts.length} farmer-listed product(s)
                      {activeCategory ? ` in ${activeCategory}` : " across all categories"}
                    </p>
                  </div>

                  <div className="category-controls">
                    {activeCategory && searchQuery && (
                      <button
                        type="button"
                        className="outline-btn small-btn"
                        onClick={() => setActiveCategory(null)}
                      >
                        Search All Categories
                      </button>
                    )}
                    <select
                      value={gradeFilter}
                      onChange={(e) => setGradeFilter(e.target.value)}
                      aria-label="Filter by grade"
                    >
                      <option value="ALL">All Grades (A, B, C, H)</option>
                      <option value="A">Grade A - Premium</option>
                      <option value="B">Grade B - Standard</option>
                      <option value="C">Grade C - Economy</option>
                      <option value="H">Grade H - Hybrid</option>
                    </select>
                  </div>
                </div>

                {visibleProducts.length === 0 ? (
                  <div className="empty-state">
                    <h3>
                      {searchQuery
                        ? `No items found matching "${searchQuery}"`
                        : `No products listed in ${activeCategory} yet`}
                    </h3>
                    <p>
                      {searchQuery
                        ? "Try a different product name, category, or clear the search filter."
                        : "Products appear here as soon as the Admin adds them to the menu and a Seller lists stock with grade and price."}
                    </p>
                    {searchQuery && (
                      <button
                        type="button"
                        className="primary-btn"
                        onClick={handleClearSearch}
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                ) : (
                  <div
                    className={`swiggy-product-grid ${
                      user?.density === "compact" ? "grid-compact" : ""
                    }`}
                  >
                    {visibleProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        cartQty={cartQtyMap[product.id] || 0}
                        onAddToCart={onAddToCart}
                        onUpdateCartQty={onUpdateCartQty}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}

        {section === "orders" && (
          <section className="buyer-orders-view">
            <div className="section-heading">
              <p className="eyebrow">ORDER HISTORY &amp; LIVE TRACKING</p>
              <h2>My Orders</h2>
              <p>Track seller confirmation, payment method, and delivery pincode for each order.</p>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Seller</th>
                    <th>Qty</th>
                    <th>Payment</th>
                    <th>Delivery PIN</th>
                    <th>Total</th>
                    <th>Status</th>
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
                        <td>{o.sellerName}</td>
                        <td>{o.quantity} kg</td>
                        <td>{o.paymentMethod}</td>
                        <td>{o.address?.pincode || "—"}</td>
                        <td><strong>&#8377;{Number(o.total).toLocaleString("en-IN")}</strong></td>
                        <td>
                          <span
                            className={`status-chip status-${o.status
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {myOrders.length === 0 && (
                <div className="empty-state">
                  <h3>No orders placed yet</h3>
                  <p>Browse categories and add fresh produce to your cart to place your first order.</p>
                </div>
              )}
            </div>
          </section>
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

      {/* RIGHT CATEGORY EXPLORER SIDEBAR */}
      {section === "explore" && (
        <aside className="buyer-right-categories" aria-label="Explore all categories">
          <div className="right-cat-header">
            <GridIcon size={16} />
            <div>
              <h3>Explore Categories</h3>
              <span>Tap any category tab</span>
            </div>
          </div>

          <div className="right-cat-list">
            {CATEGORIES.map((cat) => {
              const isOpen = activeCategory === cat.id;
              const liveCount = categoryCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`right-cat-card ${isOpen ? "active" : ""}`}
                  onClick={() => openCategoryTab(cat.id)}
                >
                  <img src={cat.image} alt={cat.label} loading="lazy" />
                  <div className="right-cat-info">
                    <strong>{cat.label}</strong>
                    <span>{liveCount > 0 ? `${liveCount} available` : "No stock yet"}</span>
                  </div>
                  <ChevronRightIcon size={15} />
                </button>
              );
            })}
          </div>
        </aside>
      )}
    </div>
  );
}
