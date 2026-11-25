import React, { useMemo, useState } from "react";
import {
  CartIcon,
  MapPinIcon,
  CheckCircleIcon,
  CreditCardIcon,
  QrCodeIcon,
  TruckIcon,
  TrashIcon,
  AlertCircleIcon,
  ShieldIcon,
} from "./Icons.jsx";
import { getCategoryImage, getGradeInfo } from "../data.js";

// Deterministic crisp SVG QR pattern so it always renders cleanly offline & online
function SampleUpiQrSvg() {
  const size = 21;
  const cells = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inTopLeft = r < 7 && c < 7;
      const inTopRight = r < 7 && c >= size - 7;
      const inBottomLeft = r >= size - 7 && c < 7;

      let filled = false;
      if (inTopLeft || inTopRight || inBottomLeft) {
        const lr = inBottomLeft ? r - (size - 7) : r;
        const lc = inTopRight ? c - (size - 7) : c;
        filled =
          lr === 0 ||
          lr === 6 ||
          lc === 0 ||
          lc === 6 ||
          (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4);
      } else if (r === 6 || c === 6) {
        filled = (r + c) % 2 === 0;
      } else {
        // Deterministic pseudo-random data modules
        const hash = (r * 31 + c * 17 + r * c * 7) % 11;
        filled = hash < 5;
      }

      if (filled) {
        cells.push(
          <rect
            key={`${r}-${c}`}
            x={c * 8 + 16}
            y={r * 8 + 16}
            width="7.4"
            height="7.4"
            rx="1.2"
            fill="#0f3d24"
          />
        );
      }
    }
  }

  return (
    <svg
      viewBox="0 0 200 200"
      className="upi-qr-svg"
      role="img"
      aria-label="Sample UPI Payment QR Code"
    >
      <rect width="200" height="200" rx="16" fill="#ffffff" />
      {cells}
    </svg>
  );
}

export default function CartCheckoutModal({
  user,
  cart,
  listings,
  onUpdateCartQty,
  onRemoveFromCart,
  onPlaceOrder,
  onClose,
}) {
  const defaultSaved =
    user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0] || null;

  const [step, setStep] = useState("cart"); // cart | payment | success
  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    street: defaultSaved?.line || "",
    city: defaultSaved?.city || "",
    pincode: defaultSaved?.pincode || "",
  });
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [pincodeError, setPincodeError] = useState("");
  const [addrErrors, setAddrErrors] = useState({});

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState(
    user?.defaultPayment || "UPI"
  );
  const [card, setCard] = useState({
    number: "",
    holder: user?.name || "",
    expiry: "",
    cvv: "",
  });
  const [cardErrors, setCardErrors] = useState({});
  const [placedOrderIds, setPlacedOrderIds] = useState([]);

  const enrichedCart = useMemo(() => {
    return cart
      .map((item) => {
        const live = listings.find((l) => l.id === item.listingId);
        if (!live) return null;
        return {
          ...item,
          listing: live,
          lineTotal: Number(live.price) * Number(item.quantity),
        };
      })
      .filter(Boolean);
  }, [cart, listings]);

  const subtotal = enrichedCart.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryFee = subtotal === 0 || subtotal >= 499 ? 0 : 25;
  const platformFee = subtotal === 0 ? 0 : 5;
  const grandTotal = subtotal + deliveryFee + platformFee;

  function handleCheckPincode() {
    const clean = address.pincode.trim();
    if (!clean || clean.length < 4) {
      setPincodeError("Please enter a valid pincode (e.g. 520010).");
      setPincodeChecked(false);
      return;
    }
    setPincodeError("");
    setPincodeChecked(true);
  }

  function proceedToPayment() {
    const errs = {};
    if (!address.fullName.trim()) errs.fullName = "Fill this";
    if (!address.phone.trim()) errs.phone = "Fill this";
    if (!address.street.trim()) errs.street = "Fill this";
    if (!address.pincode.trim() || address.pincode.trim().length < 4) {
      errs.pincode = "Fill this";
    }
    setAddrErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (!pincodeChecked) {
      setPincodeChecked(true);
    }
    setStep("payment");
  }

  function formatCardNumber(val) {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  function formatExpiry(val) {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  }

  function handleFinalizePayment(selectedMethod = paymentMethod) {
    if (selectedMethod === "Card") {
      const errs = {};
      if (card.number.replace(/\s/g, "").length < 16) errs.number = "Fill this (16 digits)";
      if (!card.holder.trim()) errs.holder = "Fill this";
      if (card.expiry.length < 5) errs.expiry = "Fill this (MM/YY)";
      if (card.cvv.length < 3) errs.cvv = "Fill this (3 digits)";
      setCardErrors(errs);
      if (Object.keys(errs).length > 0) return;
    }

    const createdIds = onPlaceOrder({
      items: enrichedCart,
      address: {
        ...address,
        fullName: address.fullName.trim(),
        phone: address.phone.trim(),
        street: address.street.trim(),
        city: address.city.trim() || "India",
        pincode: address.pincode.trim(),
      },
      paymentMethod: selectedMethod,
      totals: { subtotal, deliveryFee, platformFee, grandTotal },
    });

    setPlacedOrderIds(createdIds || []);
    setStep("success");
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className="checkout-modal">
        <header className="checkout-modal-header">
          <div className="checkout-title-wrap">
            <span className="checkout-icon-circle">
              <CartIcon size={20} />
            </span>
            <div>
              <h2>
                {step === "cart"
                  ? "Your Fresh Cart"
                  : step === "payment"
                  ? "Secure Payment"
                  : "Order Confirmed"}
              </h2>
              <p className="muted">
                {step === "cart"
                  ? `${enrichedCart.length} item(s) · Farm-direct delivery`
                  : step === "payment"
                  ? `Payable Amount: ₹${grandTotal.toLocaleString("en-IN")}`
                  : "Admin & Seller have been notified"}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-inline"
            onClick={onClose}
            aria-label="Close cart"
          >
            &times;
          </button>
        </header>

        {/* STEP 1: CART + ADDRESS + PINCODE CHECK */}
        {step === "cart" && (
          <div className="checkout-body">
            {enrichedCart.length === 0 ? (
              <div className="empty-cart-box">
                <div className="empty-icon-circle">
                  <CartIcon size={30} />
                </div>
                <h3>Your cart is empty</h3>
                <p>Explore categories and add fresh graded produce from local farmers.</p>
                <button type="button" className="primary-btn" onClick={onClose}>
                  Explore Categories
                </button>
              </div>
            ) : (
              <div className="checkout-two-col">
                <div className="cart-items-col">
                  <h3 className="checkout-subhead">Selected Produce</h3>
                  <div className="cart-item-list">
                    {enrichedCart.map(({ listing, quantity, lineTotal }) => {
                      const grade = getGradeInfo(listing.grade);
                      return (
                        <div key={listing.id} className="cart-row-card">
                          <img
                            src={listing.image || getCategoryImage(listing.category)}
                            alt={listing.name}
                            onError={(e) => {
                              e.currentTarget.src = getCategoryImage(listing.category);
                            }}
                          />
                          <div className="cart-row-info">
                            <div className="cart-row-top">
                              <strong>{listing.name}</strong>
                              <span className={`grade-badge ${grade.colorClass}`}>
                                {listing.grade === "H" ? "Grade H" : `Grade ${listing.grade}`}
                              </span>
                            </div>
                            <span className="muted">
                              &#8377;{listing.price}/kg · {listing.sellerName}
                            </span>
                            <div className="cart-row-controls">
                              <div className="qty-stepper compact">
                                <button
                                  type="button"
                                  className="stepper-btn"
                                  onClick={() => onUpdateCartQty(listing.id, quantity - 1)}
                                >
                                  &minus;
                                </button>
                                <span className="stepper-val">{quantity} kg</span>
                                <button
                                  type="button"
                                  className="stepper-btn"
                                  disabled={quantity >= Number(listing.quantity)}
                                  onClick={() => onUpdateCartQty(listing.id, quantity + 1)}
                                >
                                  +
                                </button>
                              </div>
                              <strong className="cart-line-price">
                                &#8377;{lineTotal.toLocaleString("en-IN")}
                              </strong>
                              <button
                                type="button"
                                className="icon-danger-btn"
                                onClick={() => onRemoveFromCart(listing.id)}
                                aria-label={`Remove ${listing.name}`}
                              >
                                <TrashIcon size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bill-summary-card">
                    <h4>Bill Details</h4>
                    <div className="bill-row">
                      <span>Item Total</span>
                      <span>&#8377;{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="bill-row">
                      <span>Delivery Fee {subtotal >= 499 ? "(Free above ₹499)" : ""}</span>
                      <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                    </div>
                    <div className="bill-row">
                      <span>Platform &amp; Handling Fee</span>
                      <span>&#8377;{platformFee}</span>
                    </div>
                    <div className="bill-row bill-total">
                      <strong>To Pay</strong>
                      <strong>&#8377;{grandTotal.toLocaleString("en-IN")}</strong>
                    </div>
                  </div>
                </div>

                {/* Delivery Address & Pincode Availability */}
                <div className="cart-address-col">
                  <h3 className="checkout-subhead">
                    <MapPinIcon size={17} /> Delivery Address &amp; Pincode Check
                  </h3>

                  {user?.addresses?.length > 0 && (
                    <div className="saved-addr-chips">
                      {user.addresses.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          className="addr-chip-btn"
                          onClick={() => {
                            setAddress((prev) => ({
                              ...prev,
                              street: a.line,
                              city: a.city,
                              pincode: a.pincode,
                            }));
                            setPincodeChecked(false);
                          }}
                        >
                          Use {a.label} ({a.pincode})
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="address-form-grid">
                    <div className={`field-group ${addrErrors.fullName ? "field-invalid" : ""}`}>
                      <label>Recipient Name *</label>
                      <input
                        value={address.fullName}
                        onChange={(e) => {
                          setAddress((p) => ({ ...p, fullName: e.target.value }));
                          setAddrErrors((p) => ({ ...p, fullName: "" }));
                        }}
                        placeholder="Full name"
                      />
                      {addrErrors.fullName && (
                        <span className="field-error-badge">{addrErrors.fullName}</span>
                      )}
                    </div>

                    <div className={`field-group ${addrErrors.phone ? "field-invalid" : ""}`}>
                      <label>Phone Number *</label>
                      <input
                        value={address.phone}
                        onChange={(e) => {
                          setAddress((p) => ({ ...p, phone: e.target.value }));
                          setAddrErrors((p) => ({ ...p, phone: "" }));
                        }}
                        placeholder="10-digit mobile"
                      />
                      {addrErrors.phone && (
                        <span className="field-error-badge">{addrErrors.phone}</span>
                      )}
                    </div>

                    <div className={`field-group full-span ${addrErrors.street ? "field-invalid" : ""}`}>
                      <label>Street Address / Flat / Landmark *</label>
                      <textarea
                        rows="2"
                        value={address.street}
                        onChange={(e) => {
                          setAddress((p) => ({ ...p, street: e.target.value }));
                          setAddrErrors((p) => ({ ...p, street: "" }));
                        }}
                        placeholder="Door no., apartment, street, landmark"
                      />
                      {addrErrors.street && (
                        <span className="field-error-badge">{addrErrors.street}</span>
                      )}
                    </div>

                    <div className="field-group">
                      <label>City</label>
                      <input
                        value={address.city}
                        onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))}
                        placeholder="e.g. Vijayawada"
                      />
                    </div>

                    <div className={`field-group ${addrErrors.pincode ? "field-invalid" : ""}`}>
                      <label>Pincode *</label>
                      <div className="pincode-input-row">
                        <input
                          value={address.pincode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                            setAddress((p) => ({ ...p, pincode: val }));
                            setPincodeChecked(false);
                            setPincodeError("");
                            setAddrErrors((p) => ({ ...p, pincode: "" }));
                          }}
                          placeholder="6-digit pincode"
                        />
                        <button
                          type="button"
                          className="pincode-check-btn"
                          onClick={handleCheckPincode}
                        >
                          Check
                        </button>
                      </div>
                      {addrErrors.pincode && (
                        <span className="field-error-badge">{addrErrors.pincode}</span>
                      )}
                    </div>
                  </div>

                  {pincodeError && (
                    <div className="pincode-error-msg">
                      <AlertCircleIcon size={15} />
                      <span>{pincodeError}</span>
                    </div>
                  )}

                  {pincodeChecked && (
                    <div className="pincode-available-banner">
                      <CheckCircleIcon size={18} />
                      <div>
                        <strong>Delivery available to pincode {address.pincode}!</strong>
                        <p>Express Farm-to-Door slot ready (35-45 mins dispatch after seller confirmation).</p>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    className="full-btn checkout-proceed-btn"
                    onClick={proceedToPayment}
                  >
                    Proceed to Payment · &#8377;{grandTotal.toLocaleString("en-IN")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: REALISTIC PAYMENT INTERFACE (UPI / CARD / COD) */}
        {step === "payment" && (
          <div className="checkout-body">
            <div className="payment-layout">
              <div className="payment-methods-rail">
                <button
                  type="button"
                  className={`pay-method-tab ${paymentMethod === "UPI" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("UPI")}
                >
                  <QrCodeIcon size={20} />
                  <div>
                    <strong>UPI QR / Apps</strong>
                    <span>GPay, PhonePe, Paytm</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`pay-method-tab ${paymentMethod === "Card" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("Card")}
                >
                  <CreditCardIcon size={20} />
                  <div>
                    <strong>Credit / Debit Card</strong>
                    <span>Visa, Mastercard, RuPay</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`pay-method-tab ${paymentMethod === "Cash on Delivery" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("Cash on Delivery")}
                >
                  <TruckIcon size={20} />
                  <div>
                    <strong>Cash on Delivery</strong>
                    <span>Pay at doorstep</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="outline-btn back-cart-btn"
                  onClick={() => setStep("cart")}
                >
                  &larr; Edit Cart &amp; Address
                </button>
              </div>

              <div className="payment-detail-panel">
                {paymentMethod === "UPI" && (
                  <div className="upi-panel">
                    <div className="upi-price-header">
                      <span>Scan &amp; Pay via any UPI App</span>
                      <div className="upi-amount-banner">
                        &#8377;{grandTotal.toLocaleString("en-IN")}
                      </div>
                    </div>

                    <div className="upi-qr-frame">
                      <div className="qr-price-overlay-tag">
                        Payable: &#8377;{grandTotal.toLocaleString("en-IN")}
                      </div>
                      <SampleUpiQrSvg />
                      <p className="upi-id-caption">UPI ID: agriconnect.fresh@okaxis</p>
                    </div>

                    <div className="upi-app-badges">
                      <span>Google Pay</span>
                      <span>PhonePe</span>
                      <span>Paytm</span>
                      <span>BHIM UPI</span>
                    </div>

                    <button
                      type="button"
                      className="full-btn"
                      onClick={() => handleFinalizePayment("UPI")}
                    >
                      Confirm UPI Payment &amp; Place Order (&#8377;{grandTotal.toLocaleString("en-IN")})
                    </button>
                  </div>
                )}

                {paymentMethod === "Card" && (
                  <div className="card-payment-panel">
                    <div className="virtual-card-preview">
                      <div className="vc-top">
                        <span>AGRICONNECT PAY</span>
                        <ShieldIcon size={18} />
                      </div>
                      <div className="vc-number">
                        {card.number || "4532  ••••  ••••  ••••"}
                      </div>
                      <div className="vc-bottom">
                        <div>
                          <small>CARDHOLDER</small>
                          <strong>{card.holder || "YOUR NAME"}</strong>
                        </div>
                        <div>
                          <small>VALID THRU</small>
                          <strong>{card.expiry || "MM/YY"}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="card-form-grid">
                      <div className={`field-group full-span ${cardErrors.number ? "field-invalid" : ""}`}>
                        <label>Card Number *</label>
                        <input
                          value={card.number}
                          onChange={(e) => {
                            setCard((p) => ({ ...p, number: formatCardNumber(e.target.value) }));
                            setCardErrors((p) => ({ ...p, number: "" }));
                          }}
                          placeholder="1234 5678 9012 3456"
                          inputMode="numeric"
                        />
                        {cardErrors.number && (
                          <span className="field-error-badge">{cardErrors.number}</span>
                        )}
                      </div>

                      <div className={`field-group full-span ${cardErrors.holder ? "field-invalid" : ""}`}>
                        <label>Name on Card *</label>
                        <input
                          value={card.holder}
                          onChange={(e) => {
                            setCard((p) => ({ ...p, holder: e.target.value }));
                            setCardErrors((p) => ({ ...p, holder: "" }));
                          }}
                          placeholder="Cardholder full name"
                        />
                        {cardErrors.holder && (
                          <span className="field-error-badge">{cardErrors.holder}</span>
                        )}
                      </div>

                      <div className={`field-group ${cardErrors.expiry ? "field-invalid" : ""}`}>
                        <label>Expiry (MM/YY) *</label>
                        <input
                          value={card.expiry}
                          onChange={(e) => {
                            setCard((p) => ({ ...p, expiry: formatExpiry(e.target.value) }));
                            setCardErrors((p) => ({ ...p, expiry: "" }));
                          }}
                          placeholder="08/29"
                          inputMode="numeric"
                        />
                        {cardErrors.expiry && (
                          <span className="field-error-badge">{cardErrors.expiry}</span>
                        )}
                      </div>

                      <div className={`field-group ${cardErrors.cvv ? "field-invalid" : ""}`}>
                        <label>CVV *</label>
                        <input
                          type="password"
                          maxLength="4"
                          value={card.cvv}
                          onChange={(e) => {
                            setCard((p) => ({
                              ...p,
                              cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                            }));
                            setCardErrors((p) => ({ ...p, cvv: "" }));
                          }}
                          placeholder="•••"
                          inputMode="numeric"
                        />
                        {cardErrors.cvv && (
                          <span className="field-error-badge">{cardErrors.cvv}</span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="full-btn"
                      onClick={() => handleFinalizePayment("Card")}
                    >
                      Pay &#8377;{grandTotal.toLocaleString("en-IN")} &amp; Place Order
                    </button>
                  </div>
                )}

                {paymentMethod === "Cash on Delivery" && (
                  <div className="cod-panel">
                    <div className="cod-badge-circle">
                      <TruckIcon size={28} />
                    </div>
                    <h3>Cash on Delivery</h3>
                    <p className="muted">
                      Pay <strong>&#8377;{grandTotal.toLocaleString("en-IN")}</strong> in cash or UPI
                      directly when your fresh farm produce arrives at pincode{" "}
                      <strong>{address.pincode}</strong>.
                    </p>
                    <div className="cod-info-strip">
                      <CheckCircleIcon size={16} />
                      <span>Instant order placement · Zero online advance required</span>
                    </div>
                    <button
                      type="button"
                      className="full-btn"
                      onClick={() => handleFinalizePayment("Cash on Delivery")}
                    >
                      Place Order Now (Cash on Delivery)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ORDER SUCCESS */}
        {step === "success" && (
          <div className="checkout-body order-success-view">
            <div className="success-check-ring">
              <CheckCircleIcon size={40} />
            </div>
            <h3>Order Placed Successfully!</h3>
            <p className="muted">
              Your order has been dispatched to the Admin Console and the Seller for confirmation.
              Once the seller confirms, live stock quantities adjust automatically.
            </p>
            <div className="success-meta-grid">
              <div>
                <span>Order Reference</span>
                <strong>{placedOrderIds.join(", ") || "ORD-CONFIRMED"}</strong>
              </div>
              <div>
                <span>Payment Mode</span>
                <strong>{paymentMethod}</strong>
              </div>
              <div>
                <span>Delivery Pincode</span>
                <strong>{address.pincode}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong className="status-text-amber">Pending Seller Confirmation</strong>
              </div>
            </div>
            <button type="button" className="primary-btn" onClick={onClose}>
              Back to Marketplace
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
