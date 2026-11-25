import React, { useEffect, useState } from "react";
import { getCategoryImage, getGradeInfo } from "../data.js";

export default function ProductCard({
  product,
  cartQty = 0,
  onAddToCart,
  onUpdateCartQty,
  showActions = true,
  footerSlot = null,
}) {
  const [imgSrc, setImgSrc] = useState(
    product.image || getCategoryImage(product.category)
  );

  useEffect(() => {
    setImgSrc(product.image || getCategoryImage(product.category));
  }, [product.image, product.category]);

  const gradeInfo = getGradeInfo(product.grade);
  const outOfStock = Number(product.quantity) <= 0;

  return (
    <article className={`swiggy-product-card ${outOfStock ? "card-sold-out" : ""}`}>
      <div className="product-photo-wrap">
        <img
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          onError={() => setImgSrc(getCategoryImage(product.category))}
        />
        <span className="product-category-pill">{product.category}</span>
        {outOfStock && <div className="sold-out-overlay">Out of Stock</div>}
      </div>

      <div className="product-card-body">
        {/* Name + Grade beside the name */}
        <div className="product-title-row">
          <h3 className="product-name">{product.name}</h3>
          <span
            className={`grade-badge ${gradeInfo.colorClass}`}
            title={gradeInfo.description}
          >
            {product.grade === "H" ? "Grade H · Hybrid" : `Grade ${product.grade}`}
          </span>
        </div>

        {/* Price below the name */}
        <div className="product-price-row">
          <span className="product-price">
            &#8377;{Number(product.price).toLocaleString("en-IN")}
            <small> / kg</small>
          </span>
          <span className="stock-pill">
            {outOfStock ? "0 kg left" : `${product.quantity} kg available`}
          </span>
        </div>

        {/* Description below the price */}
        <p className="product-desc">
          {product.description?.trim()
            ? product.description
            : `Freshly harvested by ${product.sellerName || "verified farmer"} (${gradeInfo.title}).`}
        </p>

        <div className="product-meta-footer">
          <span className="seller-byline">By {product.sellerName || "Local Farm"}</span>

          {showActions && onAddToCart && (
            <div className="cart-control-wrap">
              {cartQty > 0 ? (
                <div className="qty-stepper" aria-label={`Quantity of ${product.name}`}>
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => onUpdateCartQty(product.id, cartQty - 1)}
                    aria-label="Decrease quantity"
                  >
                    &minus;
                  </button>
                  <span className="stepper-val">{cartQty}</span>
                  <button
                    type="button"
                    className="stepper-btn"
                    disabled={cartQty >= Number(product.quantity)}
                    onClick={() => onUpdateCartQty(product.id, cartQty + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="swiggy-add-btn"
                  disabled={outOfStock}
                  onClick={() => onAddToCart(product)}
                >
                  ADD
                </button>
              )}
            </div>
          )}
        </div>

        {footerSlot && <div className="product-extra-actions">{footerSlot}</div>}
      </div>
    </article>
  );
}