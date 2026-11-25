// AgriConnect Data & Constants (With Auto-Recovery Default Catalog if Saved Data is Lost)

export const ADMIN_CREDENTIALS = {
  username: "admin@123",
  password: "ADMIN@123",
};

export const CATEGORIES = [
  {
    id: "Daily Fresh Fruits",
    label: "Daily Fresh Fruits",
    shortLabel: "Fresh Fruits",
    tagline: "Orchard-picked seasonal fruits",
    image:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "Fresh Vegetables",
    label: "Fresh Vegetables",
    shortLabel: "Vegetables",
    tagline: "Crisp morning-harvested veggies",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "Dairy Products",
    label: "Dairy Products",
    shortLabel: "Dairy",
    tagline: "Pure farm milk, curd & ghee",
    image:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "Cereals",
    label: "Cereals",
    shortLabel: "Cereals",
    tagline: "Wholesome grains, rice & millets",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "Seeds",
    label: "Seeds",
    shortLabel: "Seeds",
    tagline: "Nutrient-rich farm & sowing seeds",
    image:
      "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "Spices",
    label: "Spices",
    shortLabel: "Spices",
    tagline: "Aromatic whole & ground spices",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "Others",
    label: "Others",
    shortLabel: "Others",
    tagline: "Honey, jaggery & natural essentials",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
  },
];

export const GRADES = [
  {
    code: "A",
    label: "Grade A",
    title: "Grade A - Premium",
    description: "Very well farmed, top freshness and uniform size",
    colorClass: "grade-a",
  },
  {
    code: "B",
    label: "Grade B",
    title: "Grade B - Standard",
    description: "Good everyday farm quality with natural variation",
    colorClass: "grade-b",
  },
  {
    code: "C",
    label: "Grade C",
    title: "Grade C - Economy",
    description: "Value harvest suitable for bulk cooking and processing",
    colorClass: "grade-c",
  },
  {
    code: "H",
    label: "Grade H",
    title: "Grade H - Hybrid",
    description: "Hybrid variety fruit, vegetable, or crop",
    colorClass: "grade-h",
  },
];

export const TRENDING_BANNERS = [
  {
    id: "trend-1",
    badge: "TRENDING THIS MORNING",
    title: "Orchard-Fresh Seasonal Fruits",
    subtitle:
      "Hand-graded A, B, C & Hybrid harvests listed directly by verified local growers.",
    metric: "Direct Farm Pricing",
    category: "Daily Fresh Fruits",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "trend-2",
    badge: "FARMER SPOTLIGHT",
    title: "Morning Harvest Vegetables",
    subtitle:
      "Zero middlemen. Check transparent quality grades before you add to cart.",
    metric: "100% Quality Graded",
    category: "Fresh Vegetables",
    image:
      "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "trend-3",
    badge: "MOST EXPLORED",
    title: "Pure Village Dairy & Spices",
    subtitle:
      "Fresh milk, farm ghee, whole spices, and unpolished cereals straight from source.",
    metric: "Express Pincode Delivery",
    category: "Spices",
    image:
      "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=1200&q=80",
  },
];

// Curated authentic Unsplash photography for common agricultural items
export const PRODUCT_IMAGE_PRESETS = [
  {
    keywords: ["tomato", "tomatoes"],
    url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["onion", "onions"],
    url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["potato", "potatoes"],
    url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["apple", "apples"],
    url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["mango", "mangoes"],
    url: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["banana", "bananas"],
    url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["orange", "oranges", "citrus", "mandarin", "kinnow"],
    url: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["grape", "grapes"],
    url: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["pomegranate", "anar"],
    url: "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["watermelon", "melon", "orchard", "fruit basket"],
    url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["carrot", "carrots"],
    url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["spinach", "palak", "greens", "leaf", "coriander", "methi"],
    url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["chilli", "chili", "pepper", "mirchi", "capsicum"],
    url: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["mixed vegetable", "harvest veg", "farm veggie"],
    url: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["cow milk", "milk"],
    url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["buffalo", "dairy", "buttermilk"],
    url: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["paneer", "cheese", "curd", "yogurt", "dahi"],
    url: "https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["ghee", "butter"],
    url: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["rice", "basmati", "sona"],
    url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["wheat", "millet", "ragi", "bajra", "jowar", "oats", "cereal", "grain", "corn"],
    url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["seed", "chia", "flax", "sunflower", "pumpkin", "sesame", "mustard", "peanut", "groundnut"],
    url: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["cumin", "jeera", "clove", "peppercorn", "tamarind", "whole spice"],
    url: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["turmeric", "haldi", "spice", "cardamom", "elaichi", "masala", "ginger"],
    url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
  },
  {
    keywords: ["honey", "jaggery", "gud", "oil"],
    url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
  },
];

export function getCategoryImage(categoryId) {
  const found = CATEGORIES.find((c) => c.id === categoryId);
  return found ? found.image : CATEGORIES[0].image;
}

export function resolveProductImage(name = "", category = "Others", customUrl = "") {
  if (customUrl && customUrl.trim().startsWith("http")) {
    return customUrl.trim();
  }
  const lower = name.toLowerCase();
  const match = PRODUCT_IMAGE_PRESETS.find((preset) =>
    preset.keywords.some((kw) => lower.includes(kw))
  );
  if (match) return match.url;
  return getCategoryImage(category);
}

export function getGradeInfo(code) {
  return GRADES.find((g) => g.code === code) || GRADES[0];
}

// Default fallback catalog (6 to 7 items per category across all 7 categories)
// Automatically restored if saved localStorage data is lost or empty
const SEED_CATALOG_SPECS = [
  // 1. Daily Fresh Fruits (7 items)
  {
    slug: "alphonso-mangoes",
    name: "Alphonso Mangoes",
    category: "Daily Fresh Fruits",
    price: 220,
    quantity: 45,
    grade: "A",
    sellerId: "seed-farmer-1",
    sellerName: "Konkan Orchard Farms",
    description: "Naturally ripened Ratnagiri Alphonso mangoes with rich aroma and sweet pulp.",
  },
  {
    slug: "shimla-apples",
    name: "Shimla Red Apples",
    category: "Daily Fresh Fruits",
    price: 165,
    quantity: 60,
    grade: "A",
    sellerId: "seed-farmer-2",
    sellerName: "Himalayan Valley Growers",
    description: "Crisp, juicy mountain-grown apples sorted for uniform size and crunch.",
  },
  {
    slug: "yelakki-bananas",
    name: "Yelakki Bananas",
    category: "Daily Fresh Fruits",
    price: 68,
    quantity: 85,
    grade: "A",
    sellerId: "seed-farmer-1",
    sellerName: "Cauvery Green Farms",
    description: "Small, naturally sweet farm-fresh bananas harvested at peak ripeness.",
  },
  {
    slug: "nagpur-oranges",
    name: "Nagpur Oranges",
    category: "Daily Fresh Fruits",
    price: 90,
    quantity: 70,
    grade: "B",
    sellerId: "seed-farmer-2",
    sellerName: "Vidarbha Citrus Collective",
    description: "Tangy-sweet loose-skin Nagpur oranges packed with fresh Vitamin C.",
  },
  {
    slug: "green-grapes",
    name: "Seedless Green Grapes",
    category: "Daily Fresh Fruits",
    price: 110,
    quantity: 50,
    grade: "A",
    sellerId: "seed-farmer-3",
    sellerName: "Nashik Vineyard Farms",
    description: "Crunchy, export-grade seedless green grapes picked fresh this morning.",
  },
  {
    slug: "bhagwa-pomegranates",
    name: "Bhagwa Pomegranates",
    category: "Daily Fresh Fruits",
    price: 150,
    quantity: 55,
    grade: "H",
    sellerId: "seed-farmer-3",
    sellerName: "Solapur Fruit Orchards",
    description: "Deep ruby hybrid arils with soft seeds and naturally sweet juice.",
  },
  {
    slug: "seasonal-fruit-basket",
    name: "Orchard Mixed Fruit Basket",
    category: "Daily Fresh Fruits",
    price: 140,
    quantity: 40,
    grade: "A",
    sellerId: "seed-farmer-1",
    sellerName: "Konkan Orchard Farms",
    description: "Curated daily assortment of fresh seasonal orchard fruits.",
  },

  // 2. Fresh Vegetables (7 items)
  {
    slug: "farm-tomatoes",
    name: "Farm Fresh Tomatoes",
    category: "Fresh Vegetables",
    price: 38,
    quantity: 120,
    grade: "A",
    sellerId: "seed-farmer-4",
    sellerName: "Krishna Delta Farms",
    description: "Vine-ripened desi tomatoes harvested early morning for rich curry flavor.",
  },
  {
    slug: "nashik-onions",
    name: "Red Nashik Onions",
    category: "Fresh Vegetables",
    price: 42,
    quantity: 150,
    grade: "A",
    sellerId: "seed-farmer-3",
    sellerName: "Lasalgaon Kisan Co-op",
    description: "Firm, pungent red onions cured naturally for long kitchen shelf life.",
  },
  {
    slug: "organic-potatoes",
    name: "Organic Farm Potatoes",
    category: "Fresh Vegetables",
    price: 32,
    quantity: 180,
    grade: "B",
    sellerId: "seed-farmer-4",
    sellerName: "Green Acres Agro",
    description: "Clean, earthy farm potatoes ideal for everyday cooking and roasting.",
  },
  {
    slug: "ooty-carrots",
    name: "Crunchy Ooty Carrots",
    category: "Fresh Vegetables",
    price: 58,
    quantity: 75,
    grade: "A",
    sellerId: "seed-farmer-2",
    sellerName: "Nilgiri Hill Farms",
    description: "Bright orange, sweet hill-grown carrots freshly washed and graded.",
  },
  {
    slug: "fresh-spinach",
    name: "Fresh Spinach (Palak)",
    category: "Fresh Vegetables",
    price: 45,
    quantity: 65,
    grade: "A",
    sellerId: "seed-farmer-4",
    sellerName: "Krishna Delta Farms",
    description: "Tender, iron-rich green palak leaves harvested at dawn without pesticides.",
  },
  {
    slug: "guntur-green-chillies",
    name: "Guntur Green Chillies",
    category: "Fresh Vegetables",
    price: 64,
    quantity: 90,
    grade: "H",
    sellerId: "seed-farmer-5",
    sellerName: "Guntur Spice & Veg Farm",
    description: "Crisp, spicy hybrid green chillies straight from Guntur farmlands.",
  },
  {
    slug: "morning-harvest-veggies",
    name: "Morning Harvest Mixed Greens",
    category: "Fresh Vegetables",
    price: 52,
    quantity: 55,
    grade: "B",
    sellerId: "seed-farmer-4",
    sellerName: "Green Acres Agro",
    description: "Fresh seasonal leafy greens and farm vegetables bundled daily.",
  },

  // 3. Dairy Products (6 items)
  {
    slug: "a2-cow-milk",
    name: "Pure A2 Cow Milk",
    category: "Dairy Products",
    price: 72,
    quantity: 95,
    grade: "A",
    sellerId: "seed-farmer-6",
    sellerName: "Gokul Village Dairy",
    description: "Unadulterated morning-milked A2 Gir cow milk chilled immediately at source.",
  },
  {
    slug: "fresh-buffalo-milk",
    name: "Fresh Farm Buffalo Milk",
    category: "Dairy Products",
    price: 78,
    quantity: 80,
    grade: "A",
    sellerId: "seed-farmer-6",
    sellerName: "Gokul Village Dairy",
    description: "Rich, creamy full-fat village buffalo milk ideal for thick curd and tea.",
  },
  {
    slug: "malai-paneer",
    name: "Soft Malai Paneer",
    category: "Dairy Products",
    price: 360,
    quantity: 35,
    grade: "A",
    sellerId: "seed-farmer-6",
    sellerName: "Gokul Village Dairy",
    description: "Hand-pressed fresh cottage cheese made daily from pure whole milk.",
  },
  {
    slug: "desi-bilona-ghee",
    name: "Desi Bilona Cow Ghee",
    category: "Dairy Products",
    price: 780,
    quantity: 28,
    grade: "A",
    sellerId: "seed-farmer-6",
    sellerName: "Vedic Pasture Dairy",
    description: "Slow-churned aromatic golden ghee prepared using traditional bilona method.",
  },
  {
    slug: "farm-fresh-curd",
    name: "Thick Farm Curd (Dahi)",
    category: "Dairy Products",
    price: 88,
    quantity: 60,
    grade: "B",
    sellerId: "seed-farmer-6",
    sellerName: "Vedic Pasture Dairy",
    description: "Naturally set creamy village curd with active probiotics.",
  },
  {
    slug: "white-farm-butter",
    name: "White Unsalted Farm Butter",
    category: "Dairy Products",
    price: 490,
    quantity: 30,
    grade: "A",
    sellerId: "seed-farmer-6",
    sellerName: "Gokul Village Dairy",
    description: "Freshly churned makkhan with zero added salt or preservatives.",
  },

  // 4. Cereals (6 items)
  {
    slug: "aged-basmati-rice",
    name: "Aged Basmati Rice",
    category: "Cereals",
    price: 135,
    quantity: 140,
    grade: "A",
    sellerId: "seed-farmer-7",
    sellerName: "Punjab Grain Collective",
    description: "Extra-long slender aromatic basmati rice aged 18 months for fluffy biryani.",
  },
  {
    slug: "sona-masoori-rice",
    name: "Sona Masoori Raw Rice",
    category: "Cereals",
    price: 68,
    quantity: 200,
    grade: "A",
    sellerId: "seed-farmer-4",
    sellerName: "Godavari Paddy Farms",
    description: "Lightweight, low-starch Andhra Sona Masoori rice for daily meals.",
  },
  {
    slug: "sharbati-wheat",
    name: "Sharbati Whole Wheat",
    category: "Cereals",
    price: 46,
    quantity: 220,
    grade: "A",
    sellerId: "seed-farmer-7",
    sellerName: "Malwa Heritage Grains",
    description: "Golden Sehore Sharbati wheat grains known for soft, naturally sweet rotis.",
  },
  {
    slug: "finger-millet-ragi",
    name: "Organic Finger Millet (Ragi)",
    category: "Cereals",
    price: 62,
    quantity: 110,
    grade: "A",
    sellerId: "seed-farmer-8",
    sellerName: "Deccan Millet Growers",
    description: "Calcium-rich unpolished whole ragi cleaned and sun-dried on the farm.",
  },
  {
    slug: "pearl-millet-bajra",
    name: "Pearl Millet (Bajra)",
    category: "Cereals",
    price: 54,
    quantity: 130,
    grade: "B",
    sellerId: "seed-farmer-8",
    sellerName: "Deccan Millet Growers",
    description: "Wholesome high-fiber rainfed bajra grains sourced directly from dryland farms.",
  },
  {
    slug: "rolled-farm-oats",
    name: "Whole Rolled Oats",
    category: "Cereals",
    price: 115,
    quantity: 85,
    grade: "A",
    sellerId: "seed-farmer-7",
    sellerName: "Punjab Grain Collective",
    description: "Minimally processed whole grain oats for nutritious breakfast bowls.",
  },

  // 5. Seeds (6 items)
  {
    slug: "organic-chia-seeds",
    name: "Organic Chia Seeds",
    category: "Seeds",
    price: 340,
    quantity: 45,
    grade: "A",
    sellerId: "seed-farmer-8",
    sellerName: "Deccan Seed & Millet Co.",
    description: "Omega-3 rich raw black chia seeds cleaned and packed fresh from harvest.",
  },
  {
    slug: "roasted-flax-seeds",
    name: "Farm Flax Seeds (Alsi)",
    category: "Seeds",
    price: 190,
    quantity: 65,
    grade: "A",
    sellerId: "seed-farmer-8",
    sellerName: "Deccan Seed & Millet Co.",
    description: "Nutty brown flax seeds loaded with dietary fiber and plant protein.",
  },
  {
    slug: "sunflower-seeds",
    name: "Raw Sunflower Seeds",
    category: "Seeds",
    price: 260,
    quantity: 55,
    grade: "A",
    sellerId: "seed-farmer-8",
    sellerName: "Rayalaseema Seed Farms",
    description: "Hulled, crisp sunflower kernels ideal for snacking and trail mixes.",
  },
  {
    slug: "pumpkin-seeds",
    name: "Green Pumpkin Seeds",
    category: "Seeds",
    price: 420,
    quantity: 40,
    grade: "A",
    sellerId: "seed-farmer-8",
    sellerName: "Rayalaseema Seed Farms",
    description: "Nutrient-dense pepitas rich in magnesium, zinc, and antioxidants.",
  },
  {
    slug: "white-sesame-seeds",
    name: "White Sesame Seeds (Til)",
    category: "Seeds",
    price: 210,
    quantity: 70,
    grade: "B",
    sellerId: "seed-farmer-8",
    sellerName: "Deccan Seed & Millet Co.",
    description: "Aromatic unpolished white sesame seeds for chutneys, laddoos, and tadka.",
  },
  {
    slug: "black-mustard-seeds",
    name: "Black Mustard Seeds (Rai)",
    category: "Seeds",
    price: 125,
    quantity: 95,
    grade: "A",
    sellerId: "seed-farmer-7",
    sellerName: "Malwa Heritage Grains",
    description: "Bold, pungent farm mustard seeds perfect for Indian tempering and pickles.",
  },

  // 6. Spices (6 items)
  {
    slug: "salem-turmeric",
    name: "Salem Turmeric Powder (Haldi)",
    category: "Spices",
    price: 240,
    quantity: 75,
    grade: "A",
    sellerId: "seed-farmer-5",
    sellerName: "Erode & Guntur Spice Guild",
    description: "High-curcumin stone-ground turmeric with vibrant golden color and aroma.",
  },
  {
    slug: "whole-cumin-jeera",
    name: "Whole Cumin Seeds (Jeera)",
    category: "Spices",
    price: 380,
    quantity: 55,
    grade: "A",
    sellerId: "seed-farmer-5",
    sellerName: "Unjha Spice Farmers",
    description: "Clean, bold Unjha cumin seeds rich in natural essential oils.",
  },
  {
    slug: "green-cardamom",
    name: "Green Cardamom (Elaichi)",
    category: "Spices",
    price: 1650,
    quantity: 18,
    grade: "A",
    sellerId: "seed-farmer-5",
    sellerName: "Idukki Hills Spice Estate",
    description: "Bold 8mm aromatic green cardamom pods hand-picked from Kerala estates.",
  },
  {
    slug: "whole-cloves",
    name: "Whole Cloves (Laung)",
    category: "Spices",
    price: 980,
    quantity: 25,
    grade: "A",
    sellerId: "seed-farmer-5",
    sellerName: "Idukki Hills Spice Estate",
    description: "Hand-sorted oil-rich whole clove buds with intense warm fragrance.",
  },
  {
    slug: "black-peppercorns",
    name: "Malabar Black Peppercorns",
    category: "Spices",
    price: 720,
    quantity: 38,
    grade: "A",
    sellerId: "seed-farmer-5",
    sellerName: "Idukki Hills Spice Estate",
    description: "Sun-dried Tellicherry Malabar black pepper with bold, sharp heat.",
  },
  {
    slug: "guntur-red-chilli-powder",
    name: "Guntur Red Chilli Powder",
    category: "Spices",
    price: 295,
    quantity: 65,
    grade: "H",
    sellerId: "seed-farmer-5",
    sellerName: "Guntur Spice & Veg Farm",
    description: "Fiery, bright red sun-dried Guntur chillies finely ground with zero artificial dye.",
  },

  // 7. Others (6 items)
  {
    slug: "raw-forest-honey",
    name: "Raw Forest Wildflower Honey",
    category: "Others",
    price: 540,
    quantity: 42,
    grade: "A",
    sellerId: "seed-farmer-9",
    sellerName: "Araku Valley Apiary",
    description: "Unprocessed, unheated raw multifloral forest honey collected ethically.",
  },
  {
    slug: "organic-jaggery",
    name: "Organic Sugarcane Jaggery (Gud)",
    category: "Others",
    price: 95,
    quantity: 110,
    grade: "A",
    sellerId: "seed-farmer-9",
    sellerName: "Kolhapur Cane Collective",
    description: "Chemical-free dark golden sugarcane jaggery blocks rich in natural minerals.",
  },
  {
    slug: "cold-pressed-groundnut-oil",
    name: "Cold-Pressed Groundnut Oil",
    category: "Others",
    price: 265,
    quantity: 60,
    grade: "A",
    sellerId: "seed-farmer-9",
    sellerName: "Wood-Press Village Mills",
    description: "Traditional wood-pressed (kachi ghani) peanut oil with authentic nutty aroma.",
  },
  {
    slug: "raw-farm-peanuts",
    name: "Raw Farm Peanuts (Groundnuts)",
    category: "Others",
    price: 135,
    quantity: 95,
    grade: "B",
    sellerId: "seed-farmer-8",
    sellerName: "Rayalaseema Seed Farms",
    description: "Freshly shelled red-skin peanuts ideal for roasting, chutneys, and chikki.",
  },
  {
    slug: "seedless-tamarind",
    name: "Seedless Farm Tamarind",
    category: "Others",
    price: 175,
    quantity: 58,
    grade: "A",
    sellerId: "seed-farmer-9",
    sellerName: "Araku Valley Apiary",
    description: "Naturally tangy, fiber-cleaned seedless tamarind harvested this season.",
  },
  {
    slug: "sun-dried-ginger",
    name: "Sun-Dried Farm Ginger (Sonth)",
    category: "Others",
    price: 310,
    quantity: 36,
    grade: "A",
    sellerId: "seed-farmer-5",
    sellerName: "Idukki Hills Spice Estate",
    description: "Aromatic whole dry ginger roots cured naturally for tea and wellness recipes.",
  },
];

export const DEFAULT_MENU_ITEMS = SEED_CATALOG_SPECS.map((item) => ({
  id: `menu-seed-${item.slug}`,
  name: item.name,
  category: item.category,
  image: resolveProductImage(item.name, item.category),
  createdAt: "Default Catalog",
}));

export const DEFAULT_LISTINGS = SEED_CATALOG_SPECS.map((item) => ({
  id: `listing-seed-${item.slug}`,
  menuItemId: `menu-seed-${item.slug}`,
  name: item.name,
  category: item.category,
  image: resolveProductImage(item.name, item.category),
  sellerId: item.sellerId,
  sellerName: item.sellerName,
  quantity: item.quantity,
  grade: item.grade,
  price: item.price,
  description: item.description,
  updatedAt: "Market Rate",
}));

// Clean v2 localStorage keys so legacy pre-populated emoji products never appear
export const STORE_KEYS = {
  menu: "agriconnect_v2_menu",
  listings: "agriconnect_v2_listings",
  users: "agriconnect_v2_users",
  orders: "agriconnect_v2_orders",
  notifications: "agriconnect_v2_notifications",
  cart: "agriconnect_v2_cart",
  currentUser: "agriconnect_v2_currentUser",
};

export function readStore(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// Restores default seed items automatically if saved data is lost, corrupted, or empty
export function readStoreWithSeed(key, seedData = []) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      writeStore(key, seedData);
      return seedData;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      writeStore(key, seedData);
      return seedData;
    }
    return parsed;
  } catch {
    writeStore(key, seedData);
    return seedData;
  }
}

export function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors safely
  }
}