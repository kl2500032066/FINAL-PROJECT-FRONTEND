# AgriConnect - Farm-Direct Fresh Marketplace (Final Hackathon Edition)

A clean, green-themed React + Vite application connecting **Admin**, **Sellers (Farmers)**, and **Buyers** with category-wise menus, transparent quality grading (`A`, `B`, `C`, `H`), an iPhone-inspired Liquid Glass category slider, pincode delivery verification, and realistic UPI QR / Card / Cash on Delivery checkout.

## How to Run in VS Code

1. Extract this ZIP archive.
2. Open the `AgriConnect-React` folder in **VS Code**.
3. Open **Terminal > New Terminal** (`Ctrl + \``).
4. Install dependencies and start the development server:

```bash
npm install
npm run dev
```

5. Open the local Vite URL printed in the terminal (usually `http://localhost:5173`).

## Demo Workflow for Hackathon Review

1. **Admin Login**:
   - Click **Login / Sign Up** (or **Admin Console**), select the **Admin** tab, and log in with:
     - **Username**: `admin@123`
     - **Password**: `ADMIN@123`
   - Go to **Menu Catalog** and add products into any of the 7 official categories (`Daily Fresh Fruits`, `Fresh Vegetables`, `Dairy Products`, `Cereals`, `Seeds`, `Spices`, `Others`). Real product photos are auto-matched (or you can paste any image URL).

2. **Seller (Farmer) Account & Listing**:
   - Log out, open **Login / Sign Up**, select **Seller**, create an account, and log in.
   - Select any Admin-added product by category, enter **Quantity**, choose **Grade** (`A`, `B`, `C`, or `H` for Hybrid), enter **Price**, and optionally add a **Description**.
   - Leaving any required field blank highlights it in red with a **"Fill this"** notice.

3. **Buyer Account, Trending Banner, Cart & Payment**:
   - Log out, open **Login / Sign Up**, select **Buyer**, create an account, and log in.
   - View the **Trending Now** showcase banner (no Add-to-Cart clutter), slide categories on the **Liquid Glass** bar, or click any category in the **Right Category Sidebar** / **Left Menu** to open farmer listings.
   - Add items to cart (live count badge animates over the Cart icon), enter delivery address, verify **any pincode** for instant delivery availability, and complete payment via **UPI (sample QR with payable price)**, **Card**, or **Cash on Delivery**.

4. **Order Notification & Automatic Stock Adjustment**:
   - Both **Admin** and **Seller** receive the order notification.
   - When the **Seller** clicks **Confirm Order**, the product's live stock quantity automatically deducts and syncs across the platform.
