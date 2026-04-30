const defaultProducts = [
  { id: 1, title: "The Last of Us", category: "ps", mode: "offline", price: 34, image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=900&q=80", offerEn: "Offline Game Offer", offerAr: "عرض لعبة أوفلاين", showInStory: true, showInOffers: true, accounts: [{ email: "lou1@store.com", password: "L0U!2026", notes: "Primary account", used: false }, { email: "lou2@store.com", password: "L0U!2027", notes: "Backup account", used: false }] },
  { id: 2, title: "God of War Ragnarok", category: "ps", mode: "offline", price: 39, image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=900&q=80", offerEn: "15% Discount", offerAr: "خصم 15%", showInStory: true, showInOffers: true, accounts: [{ email: "gow1@store.com", password: "Gow!4455", notes: "Console ready", used: false }] },
  { id: 3, title: "Red Dead Redemption 2", category: "xbox", mode: "online", price: 31, image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=900&q=80", offerEn: "Online Game Offer", offerAr: "عرض لعبة أونلاين", showInStory: true, showInOffers: true, accounts: [{ email: "rdr2@store.com", password: "Rdr2@884", notes: "Online mode", used: false }] },
  { id: 4, title: "Cyberpunk 2077", category: "pc", mode: "mixed", price: 28, image: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=900&q=80", offerEn: "Limited Time Deal", offerAr: "عرض لفترة محدودة", showInStory: true, showInOffers: true, accounts: [] },
  { id: 5, title: "Resident Evil Village", category: "pc", mode: "offline", price: 26, image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=900&q=80", offerEn: "Offline Game Offer", offerAr: "عرض لعبة أوفلاين", showInStory: true, showInOffers: false, accounts: [] },
  { id: 6, title: "Forza Horizon 5", category: "xbox", mode: "online", price: 33, image: "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?auto=format&fit=crop&w=900&q=80", offerEn: "Online Game Offer", offerAr: "عرض لعبة أونلاين", showInStory: true, showInOffers: true, accounts: [] },
  { id: 7, title: "PlayStation Plus 12M", category: "subscriptions", mode: "online", price: 59, image: "https://images.unsplash.com/photo-1605902711622-cfb43c44367f?auto=format&fit=crop&w=900&q=80", offerEn: "Best Subscription Deal", offerAr: "أفضل عرض اشتراك", showInStory: true, showInOffers: true, accounts: [] },
  { id: 8, title: "Xbox Game Pass Ultimate 3M", category: "subscriptions", mode: "online", price: 29, image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80", offerEn: "15% Discount", offerAr: "خصم 15%", showInStory: true, showInOffers: true, accounts: [] },
  { id: 9, title: "EA Play 12M", category: "subscriptions", mode: "online", price: 24, image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80", offerEn: "Online Game Offer", offerAr: "عرض لعبة أونلاين", showInStory: true, showInOffers: true, accounts: [] }
];

const storageKeys = {
  lang: "lang",
  users: "users",
  session: "sessionUser",
  cart: "cart",
  wishlist: "wishlist",
  products: "products",
  bankSettings: "bankSettings",
  settlements: "settlements",
  emailSettings: "emailSettings"
};

const ADMIN_PASSWORD = "FB-Game-Admin-2026";
const CURRENCY = "JD";
const defaultBankSettings = {
  bankName: "Jordan Bank",
  cardHolder: "Punisher Store",
  cardNumber: "4111111111111111",
  expiry: "12/30"
};

const defaultEmailSettings = {
  serviceId: "",
  templateId: "",
  publicKey: "",
  fromName: "Punisher Store"
};

function normalizeProduct(item, fallbackId = Date.now()) {
  const normalizedAccounts = Array.isArray(item.accounts)
    ? item.accounts
        .map((entry) => ({
          email: String(entry.email || "").trim(),
          password: String(entry.password || "").trim(),
          notes: String(entry.notes || "").trim(),
          used: Boolean(entry.used)
        }))
        .filter((entry) => entry.email && entry.password)
    : [];

  return {
    id: Number(item.id) || fallbackId,
    title: String(item.title || "Untitled Game"),
    category: item.category || "pc",
    mode: item.mode || "offline",
    price: Number(item.price) || 0,
    image: String(item.image || ""),
    offerEn: String(item.offerEn || "Special Offer"),
    offerAr: String(item.offerAr || "عرض خاص"),
    showInStory: item.showInStory !== false,
    showInOffers: item.showInOffers !== false,
    accounts: normalizedAccounts.length
      ? normalizedAccounts
      : (item.accountEmail && item.accountPassword
          ? [{
              email: String(item.accountEmail).trim(),
              password: String(item.accountPassword).trim(),
              notes: String(item.accountNotes || "").trim(),
              used: false
            }]
          : [])
  };
}

function optimizeImageUrl(url, width = 700, quality = 60) {
  if (!url) return "";
  if (!url.includes("images.unsplash.com")) return url;
  const cleaned = url.replace(/([?&])(w|q|auto|fit)=[^&]*/g, "").replace(/[?&]$/, "");
  const joiner = cleaned.includes("?") ? "&" : "?";
  return `${cleaned}${joiner}auto=format&fit=crop&w=${width}&q=${quality}`;
}

function formatPrice(value) {
  return `${CURRENCY} ${Number(value || 0).toFixed(2)}`;
}

function loadProducts() {
  const stored = JSON.parse(localStorage.getItem(storageKeys.products) || "null");
  if (!Array.isArray(stored) || !stored.length) return defaultProducts.map((item) => ({ ...item }));
  return stored.map((item, index) => normalizeProduct(item, index + 1));
}

let products = loadProducts();
function getBankSettings() {
  const stored = JSON.parse(localStorage.getItem(storageKeys.bankSettings) || "null");
  return { ...defaultBankSettings, ...(stored || {}) };
}

function setBankSettings(settings) {
  localStorage.setItem(storageKeys.bankSettings, JSON.stringify({
    bankName: String(settings.bankName || "").trim(),
    cardHolder: String(settings.cardHolder || "").trim(),
    cardNumber: String(settings.cardNumber || "").replace(/\D/g, "").slice(0, 16),
    expiry: String(settings.expiry || "").trim()
  }));
}

function getEmailSettings() {
  const stored = JSON.parse(localStorage.getItem(storageKeys.emailSettings) || "null");
  return { ...defaultEmailSettings, ...(stored || {}) };
}

function setEmailSettings(settings) {
  localStorage.setItem(storageKeys.emailSettings, JSON.stringify({
    serviceId: String(settings.serviceId || "").trim(),
    templateId: String(settings.templateId || "").trim(),
    publicKey: String(settings.publicKey || "").trim(),
    fromName: String(settings.fromName || "").trim() || "Punisher Store"
  }));
}

function normalizeIdentifier(value) {
  const raw = String(value || "").trim();
  if (raw.includes("@")) return raw.toLowerCase();
  return raw.replace(/[^\d+]/g, "");
}

function isValidIdentifier(value) {
  const identifier = normalizeIdentifier(value);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
  const phoneOk = /^\+?\d{8,15}$/.test(identifier);
  return emailOk || phoneOk;
}

function setSettlement(entry) {
  const settlements = JSON.parse(localStorage.getItem(storageKeys.settlements) || "[]");
  settlements.push(entry);
  localStorage.setItem(storageKeys.settlements, JSON.stringify(settlements));
}

const textMap = {
  en: {
    add: "Add to Cart",
    wishlistAdd: "Add to Wishlist",
    wishlistRemove: "Remove from Wishlist",
    moveToCart: "Move to Cart",
    remove: "Remove",
    empty: "Your cart is empty.",
    wishlistEmpty: "Your wishlist is empty.",
    accountExists: "This email is already registered.",
    accountCreated: "Account created successfully. You can sign in now.",
    registerInvalid: "Use valid full name, email, and stronger password (8+ chars with letters and numbers).",
    confirmMismatch: "Password confirmation does not match.",
    paymentSuccess: "Payment completed successfully.",
    paymentCardInvalid: "Please enter valid card details.",
    paymentBankInvalid: "Please complete valid bank transfer details.",
    paymentPaypalInvalid: "Please enter valid PayPal details.",
    loginRequired: "Please login first.",
    invalid: "Invalid email or password.",
    codeSent: "Verification code sent to your email successfully.",
    codeSendFailed: "Could not send verification email. Check admin email settings.",
    emailConfigMissing: "Admin must configure EmailJS settings first.",
    codeInvalid: "Verification code is incorrect.",
    codeVerified: "Code verified. Account created successfully.",
    codeExpired: "Code expired. Please request a new code.",
    alreadyLoggedIn: "You are already logged in.",
    success: "Login successful. Redirecting...",
    fill: "Use a valid email and password (8+ chars)."
  },
  ar: {
    add: "أضف للسلة",
    wishlistAdd: "أضف للمفضلة",
    wishlistRemove: "إزالة من المفضلة",
    moveToCart: "نقل إلى السلة",
    remove: "حذف",
    empty: "السلة فارغة.",
    wishlistEmpty: "المفضلة فارغة.",
    accountExists: "هذا البريد مسجل مسبقًا.",
    accountCreated: "تم إنشاء الحساب بنجاح. يمكنك تسجيل الدخول الآن.",
    registerInvalid: "ادخل اسم صحيح وبريد صحيح وكلمة مرور قوية (8+ أحرف فيها حروف وأرقام).",
    confirmMismatch: "تأكيد كلمة المرور غير مطابق.",
    paymentSuccess: "تمت عملية الدفع بنجاح.",
    paymentCardInvalid: "يرجى إدخال بيانات بطاقة صحيحة.",
    paymentBankInvalid: "يرجى إدخال بيانات تحويل بنكي صحيحة.",
    paymentPaypalInvalid: "يرجى إدخال بيانات بايبال صحيحة.",
    loginRequired: "سجل دخول أولًا.",
    invalid: "البريد أو كلمة المرور غير صحيحة.",
    codeSent: "تم إرسال كود التحقق إلى بريدك بنجاح.",
    codeSendFailed: "فشل إرسال كود التحقق. تحقق من إعدادات البريد في الأدمن.",
    emailConfigMissing: "لازم الأدمن يضبط إعدادات EmailJS أولًا.",
    codeInvalid: "كود التحقق غير صحيح.",
    codeVerified: "تم التحقق من الكود وإنشاء الحساب بنجاح.",
    codeExpired: "انتهت صلاحية الكود. اطلب كود جديد.",
    alreadyLoggedIn: "تم تسجيل الدخول بالفعل.",
    success: "تم تسجيل الدخول بنجاح...",
    fill: "ادخل بريد صحيح وكلمة مرور 8 أحرف على الأقل."
  }
};

let currentLang = localStorage.getItem(storageKeys.lang) || "en";
let currentFilter = "pc";

const testimonials = [
  {
    name: "Ahmad K.",
    en: "Fast delivery and the account worked instantly. Excellent service.",
    ar: "تسليم سريع جدًا والحساب اشتغل مباشرة. خدمة ممتازة."
  },
  {
    name: "Lina S.",
    en: "Prices are fair and support replied in minutes. Highly recommended.",
    ar: "الأسعار ممتازة والدعم رد خلال دقائق. أنصح بهم جدًا."
  },
  {
    name: "Yousef M.",
    en: "Best place for premium game accounts. Smooth and secure process.",
    ar: "أفضل مكان لحسابات الألعاب المميزة. العملية سهلة وآمنة."
  }
];

function initUsers() {
  const existing = JSON.parse(localStorage.getItem(storageKeys.users) || "[]");
  if (existing.length) return;
  localStorage.setItem(storageKeys.users, JSON.stringify([]));
}

function getCart() {
  return JSON.parse(localStorage.getItem(storageKeys.cart) || "[]");
}

function getWishlist() {
  return JSON.parse(localStorage.getItem(storageKeys.wishlist) || "[]");
}

function setCart(cart) {
  localStorage.setItem(storageKeys.cart, JSON.stringify(cart));
  renderCartCount();
}

function setWishlist(wishlist) {
  localStorage.setItem(storageKeys.wishlist, JSON.stringify(wishlist));
  renderWishlistCount();
}

function setProducts(nextProducts) {
  products = nextProducts.map((item, index) => normalizeProduct(item, index + 1));
  localStorage.setItem(storageKeys.products, JSON.stringify(products));
}

function renderCartCount() {
  const cartCount = document.getElementById("cartCount");
  if (!cartCount) return;
  cartCount.textContent = String(getCart().length);
}

function renderWishlistCount() {
  const wishlistCount = document.getElementById("wishlistCount");
  if (!wishlistCount) return;
  wishlistCount.textContent = String(getWishlist().length);
}

function updateLanguage() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  document.body.classList.toggle("rtl", currentLang === "ar");

  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.textContent = currentLang === "en" ? "AR" : "EN";

  document.querySelectorAll("[data-en]").forEach((el) => {
    el.textContent = currentLang === "en" ? el.dataset.en : el.dataset.ar;
  });
  document.querySelectorAll("[data-en-placeholder]").forEach((el) => {
    el.placeholder = currentLang === "en" ? el.dataset.enPlaceholder : el.dataset.arPlaceholder;
  });

  document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.textContent = textMap[currentLang].add;
  });

  document.querySelectorAll(".wish-btn").forEach((btn) => {
    btn.textContent = btn.classList.contains("active")
      ? textMap[currentLang].wishlistRemove
      : textMap[currentLang].wishlistAdd;
  });

  document.dispatchEvent(new CustomEvent("languageChanged"));
}

function setupMenu() {
  const sideMenu = document.getElementById("sideMenu");
  const menuBtn = document.getElementById("menuBtn");
  const closeMenuBtn = document.getElementById("closeMenuBtn");
  const menuBackdrop = document.getElementById("menuBackdrop");
  if (!sideMenu || !menuBtn || !closeMenuBtn || !menuBackdrop) return;

  const closeMenu = () => {
    sideMenu.classList.remove("open");
    menuBackdrop.classList.remove("show");
  };
  const openMenu = () => {
    sideMenu.classList.add("open");
    menuBackdrop.classList.add("show");
  };

  menuBtn.addEventListener("click", openMenu);
  closeMenuBtn.addEventListener("click", closeMenu);
  menuBackdrop.addEventListener("click", closeMenu);

  sideMenu.querySelectorAll("[data-filter]").forEach((link) => {
    link.addEventListener("click", () => {
      currentFilter = link.dataset.filter;
      renderProducts();
      syncFilterButtons();
      closeMenu();
    });
  });
}

function syncFilterButtons() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === currentFilter);
  });
}

function renderProducts() {
  const productGrid = document.getElementById("productGrid");
  if (!productGrid) return;

  const list = products.filter((item) => item.category === currentFilter && item.showInStory !== false);

  const wishlistIds = new Set(getWishlist().map((item) => item.id));
  productGrid.innerHTML = list
    .map(
      (item) => `
        <article class="game-card card-in">
          <img src="${optimizeImageUrl(item.image)}" alt="${item.title}" loading="lazy" decoding="async">
          <div class="card-body">
            <span class="category-tag">${item.category.toUpperCase()}</span>
            <span class="story-mode-badge">${item.mode === "mixed" ? "MIXED" : (item.mode === "online" ? "ONLINE" : "OFFLINE")}</span>
            <h4>${item.title}</h4>
            <p class="price">${formatPrice(item.price)}</p>
            <button class="wish-btn ${wishlistIds.has(item.id) ? "active" : ""}" data-id="${item.id}">${wishlistIds.has(item.id) ? textMap[currentLang].wishlistRemove : textMap[currentLang].wishlistAdd}</button>
            <button class="add-btn" data-id="${item.id}">${textMap[currentLang].add}</button>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const selected = products.find((item) => item.id === Number(btn.dataset.id));
      if (selected) addToCart(selected);
    });
  });

  document.querySelectorAll(".wish-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const selected = products.find((item) => item.id === Number(btn.dataset.id));
      if (selected) toggleWishlist(selected);
    });
  });
}

function renderOffers() {
  const offersTrack = document.getElementById("offersTrack");
  if (!offersTrack) return;

  const offerItems = products.filter((item) => item.showInOffers !== false);
  if (!offerItems.length) {
    offersTrack.innerHTML = "";
    return;
  }
  const loopItems = [...offerItems, ...offerItems];
  offersTrack.innerHTML = loopItems
    .map(
      (item) => {
        const offerLabel = currentLang === "en"
          ? (item.offerEn || item.offerAr || "Special Offer")
          : (item.offerAr || item.offerEn || "عرض خاص");
        return `
        <article class="offer-card">
          <img src="${optimizeImageUrl(item.image, 640, 55)}" alt="${item.title}" loading="lazy" decoding="async">
          <div>
            <span class="offer-badge">${offerLabel}</span>
            <h4>${item.title}</h4>
            <button class="add-btn offer-add" data-id="${item.id}">${textMap[currentLang].add}</button>
          </div>
        </article>
      `;
      }
    )
    .join("");

  document.querySelectorAll(".offer-add").forEach((btn) => {
    btn.addEventListener("click", () => {
      const selected = products.find((item) => item.id === Number(btn.dataset.id));
      if (selected) addToCart(selected);
    });
  });
}

function setupAdminPanel() {
  const isHomePage = !!document.getElementById("productGrid");
  if (!isHomePage) return;

  const authModal = document.createElement("section");
  authModal.id = "adminAuthModal";
  authModal.className = "admin-auth-modal";
  authModal.innerHTML = `
    <div class="admin-auth-box">
      <h3 data-en="Admin Access" data-ar="دخول الأدمن">دخول الأدمن</h3>
      <p data-en="Enter admin password to open control panel." data-ar="اكتب كلمة مرور الأدمن لفتح لوحة التحكم.">اكتب كلمة مرور الأدمن لفتح لوحة التحكم.</p>
      <input id="adminPasswordInput" class="admin-input" type="password" data-en-placeholder="Admin password" data-ar-placeholder="كلمة مرور الأدمن" placeholder="كلمة مرور الأدمن">
      <p id="adminAuthError" class="admin-auth-error"></p>
      <div class="admin-actions">
        <button id="adminAuthCancelBtn" class="admin-btn admin-btn--muted" type="button" data-en="Cancel" data-ar="إلغاء">إلغاء</button>
        <button id="adminAuthConfirmBtn" class="admin-btn" type="button" data-en="Open Panel" data-ar="فتح اللوحة">فتح اللوحة</button>
      </div>
    </div>
  `;
  document.body.appendChild(authModal);

  const panel = document.createElement("section");
  panel.id = "adminPanel";
  panel.className = "admin-panel";
  panel.innerHTML = `
    <div class="admin-panel__header">
      <h3 data-en="Admin Control" data-ar="لوحة تحكم الأدمن">لوحة تحكم الأدمن</h3>
      <button id="adminCloseBtn" class="admin-btn admin-btn--muted" type="button" data-en="Close" data-ar="إغلاق">إغلاق</button>
    </div>
    <p class="admin-note" data-en="Control Story Collection, Live Offers, account stock, and bank details." data-ar="تحكم كامل بمجموعة الستوري جيم والعروض المباشرة ومخزون الحسابات وتفاصيل البنك.">تحكم كامل بمجموعة الستوري جيم والعروض المباشرة ومخزون الحسابات وتفاصيل البنك.</p>
    <div class="admin-tabs">
      <button class="admin-tab active" data-tab="story" type="button" data-en="Story Collection" data-ar="ستوري جيم كولكشن">ستوري جيم كولكشن</button>
      <button class="admin-tab" data-tab="offers" type="button" data-en="Live Offers" data-ar="لايف أوفرز">لايف أوفرز</button>
    </div>
    <div id="adminToast" class="admin-toast" role="status" aria-live="polite"></div>
    <div id="adminRows" class="admin-rows"></div>
    <section class="admin-bank-settings">
      <h4 data-en="Bank Transfer Settings" data-ar="إعدادات التحويل البنكي">إعدادات التحويل البنكي</h4>
      <div class="admin-bank-grid">
        <input id="adminBankName" class="admin-input" type="text" data-en-placeholder="Receiver bank name" data-ar-placeholder="اسم البنك المستلم" placeholder="اسم البنك المستلم">
        <input id="adminCardHolder" class="admin-input" type="text" data-en-placeholder="Receiver card holder" data-ar-placeholder="اسم حامل البطاقة المستلمة" placeholder="اسم حامل البطاقة المستلمة">
        <input id="adminCardNumber" class="admin-input" type="text" data-en-placeholder="Receiver card number" data-ar-placeholder="رقم البطاقة المستلمة" placeholder="رقم البطاقة المستلمة">
        <input id="adminCardExpiry" class="admin-input" type="text" data-en-placeholder="Card expiry MM/YY" data-ar-placeholder="تاريخ الانتهاء MM/YY" placeholder="MM/YY">
      </div>
    </section>
    <section class="admin-bank-settings">
      <h4 data-en="Email Verification Settings (EmailJS)" data-ar="إعدادات تحقق البريد (EmailJS)">إعدادات تحقق البريد (EmailJS)</h4>
      <div class="admin-bank-grid">
        <input id="adminEmailServiceId" class="admin-input" type="text" placeholder="EmailJS Service ID">
        <input id="adminEmailTemplateId" class="admin-input" type="text" placeholder="EmailJS Template ID">
        <input id="adminEmailPublicKey" class="admin-input" type="text" placeholder="EmailJS Public Key">
        <input id="adminEmailFromName" class="admin-input" type="text" data-en-placeholder="Sender name" data-ar-placeholder="اسم المرسل" placeholder="اسم المرسل">
      </div>
      <p class="admin-note" data-en="Template variables expected: to_email, verification_code, store_name." data-ar="متغيرات القالب المطلوبة: to_email و verification_code و store_name.">Template variables expected: to_email, verification_code, store_name.</p>
    </section>
    <div class="admin-actions">
      <button id="adminAddBtn" class="admin-btn" type="button" data-en="+ Add Box" data-ar="+ إضافة بوكس">+ إضافة بوكس</button>
      <button id="adminSaveBtn" class="admin-btn" type="button" data-en="Save Changes" data-ar="حفظ التعديلات">حفظ التعديلات</button>
      <button id="adminResetBtn" class="admin-btn admin-btn--muted" type="button" data-en="Reset Default" data-ar="استرجاع الافتراضي">استرجاع الافتراضي</button>
    </div>
  `;
  document.body.appendChild(panel);

  const adminRows = panel.querySelector("#adminRows");
  const adminToast = panel.querySelector("#adminToast");
  const adminBankName = panel.querySelector("#adminBankName");
  const adminCardHolder = panel.querySelector("#adminCardHolder");
  const adminCardNumber = panel.querySelector("#adminCardNumber");
  const adminCardExpiry = panel.querySelector("#adminCardExpiry");
  const adminEmailServiceId = panel.querySelector("#adminEmailServiceId");
  const adminEmailTemplateId = panel.querySelector("#adminEmailTemplateId");
  const adminEmailPublicKey = panel.querySelector("#adminEmailPublicKey");
  const adminEmailFromName = panel.querySelector("#adminEmailFromName");
  let activeTab = "story";
  const getCategoryOptions = () => `
    <option value="pc">PC</option>
    <option value="ps">${currentLang === "en" ? "PlayStation" : "بلايستيشن"}</option>
    <option value="xbox">${currentLang === "en" ? "Xbox" : "اكس بوكس"}</option>
    <option value="subscriptions">${currentLang === "en" ? "Subscriptions" : "اشتراكات"}</option>
  `;
  const getModeOptions = () => `
    <option value="offline">${currentLang === "en" ? "Offline" : "اوفلاين"}</option>
    <option value="online">${currentLang === "en" ? "Online" : "اونلاين"}</option>
    <option value="mixed">${currentLang === "en" ? "Mixed" : "مختلط"}</option>
  `;

  const toAccountLines = (item) => (item.accounts || [])
    .filter((entry) => entry.email && entry.password)
    .map((entry) => `${entry.email}|${entry.password}|${entry.notes || ""}|${entry.used ? "used" : "free"}`)
    .join("\n");

  const parseAccountLines = (value) => value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [email = "", password = "", notes = "", state = "free"] = line.split("|").map((part) => part.trim());
      return { email, password, notes, used: state.toLowerCase() === "used" };
    })
    .filter((entry) => entry.email && entry.password);

  const showAdminToast = (message) => {
    if (!adminToast) return;
    adminToast.textContent = message;
    adminToast.classList.add("show");
    window.setTimeout(() => {
      adminToast.classList.remove("show");
    }, 1800);
  };

  const renderAdminRows = () => {
    const scoped = products.filter((item) => activeTab === "story" ? item.showInStory !== false : item.showInOffers !== false);
    adminRows.innerHTML = scoped
      .map(
        (item) => `
          <article class="admin-row" data-id="${item.id}">
            <input class="admin-input" data-field="title" type="text" placeholder="${currentLang === "en" ? "Box title" : "اسم البوكس"}" value="${item.title}">
            ${activeTab === "story"
              ? `<select class="admin-input" data-field="category">
                  ${getCategoryOptions()}
                </select>`
              : ``
            }
            <select class="admin-input" data-field="mode">
              ${getModeOptions()}
            </select>
            <input class="admin-input" data-field="price" type="number" min="0" step="1" placeholder="${currentLang === "en" ? "Price" : "السعر"}" value="${item.price}">
            <input class="admin-input" data-field="image" type="text" placeholder="${currentLang === "en" ? "Image URL" : "رابط الصورة"}" value="${item.image}">
            <input class="admin-input" data-field="offerEn" type="text" placeholder="Offer label EN" value="${item.offerEn || ""}">
            <input class="admin-input" data-field="offerAr" type="text" placeholder="وصف العرض AR" value="${item.offerAr || ""}">
            <div class="admin-stock">
              <label>${currentLang === "en" ? "Account stock (email|password|note|free/used)" : "مخزون الحسابات (email|password|note|free/used)"}</label>
              <textarea class="admin-input admin-stock-input" data-field="accounts" rows="4" placeholder="mail@x.com|Pass123|note|free">${toAccountLines(item)}</textarea>
            </div>
            <button class="admin-btn admin-btn--danger admin-delete" type="button">${currentLang === "en" ? "Delete" : "حذف"}</button>
          </article>
        `
      )
      .join("");

    adminRows.querySelectorAll(".admin-row").forEach((row) => {
        const product = products.find((item) => item.id === Number(row.dataset.id));
      const categorySelect = row.querySelector('[data-field="category"]');
      const modeSelect = row.querySelector('[data-field="mode"]');
      if (product && categorySelect) categorySelect.value = product.category;
      if (product && modeSelect) modeSelect.value = product.mode || "offline";
    });

    adminRows.querySelectorAll(".admin-delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        const row = btn.closest(".admin-row");
        if (!row) return;
        const targetId = Number(row.dataset.id);
        products = products.map((item) => {
          if (item.id !== targetId) return item;
          if (activeTab === "story") return { ...item, showInStory: false };
          return { ...item, showInOffers: false };
        });
        renderAdminRows();
      });
    });
  };

  const saveFromPanel = () => {
    const rows = Array.from(adminRows.querySelectorAll(".admin-row"));
    const updates = rows.map((row, index) => {
      const read = (field) => row.querySelector(`[data-field="${field}"]`)?.value?.trim() || "";
      return normalizeProduct({
        id: Number(row.dataset.id) || index + 1,
        title: read("title"),
        category: activeTab === "story"
          ? read("category")
          : (products.find((item) => item.id === Number(row.dataset.id))?.category || "pc"),
        mode: read("mode"),
        price: Number(read("price")) || 0,
        image: read("image"),
        offerEn: read("offerEn"),
        offerAr: read("offerAr"),
        showInStory: activeTab === "story" ? true : products.find((item) => item.id === Number(row.dataset.id))?.showInStory !== false,
        showInOffers: activeTab === "offers" ? true : products.find((item) => item.id === Number(row.dataset.id))?.showInOffers !== false,
        accounts: parseAccountLines(read("accounts"))
      }, index + 1);
    });

    const untouched = products.filter((item) => activeTab === "story" ? item.showInStory === false : item.showInOffers === false);
    setProducts([...updates, ...untouched]);
    setBankSettings({
      bankName: adminBankName?.value || "",
      cardHolder: adminCardHolder?.value || "",
      cardNumber: adminCardNumber?.value || "",
      expiry: adminCardExpiry?.value || ""
    });
    setEmailSettings({
      serviceId: adminEmailServiceId?.value || "",
      templateId: adminEmailTemplateId?.value || "",
      publicKey: adminEmailPublicKey?.value || "",
      fromName: adminEmailFromName?.value || ""
    });
    renderProducts();
    renderOffers();
    showAdminToast(currentLang === "en" ? "Saved successfully" : "تم حفظ التعديلات بنجاح");
  };

  panel.querySelector("#adminAddBtn").addEventListener("click", () => {
    const maxId = products.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
    products.push(normalizeProduct({
      id: maxId + 1,
      title: "New Game",
      category: "pc",
      mode: "offline",
      price: 0,
      image: "",
      offerEn: "Special Offer",
      offerAr: "عرض خاص",
      showInStory: activeTab === "story",
      showInOffers: activeTab === "offers",
      accounts: []
    }, maxId + 1));
    renderAdminRows();
  });
  panel.querySelector("#adminSaveBtn").addEventListener("click", saveFromPanel);
  panel.querySelector("#adminResetBtn").addEventListener("click", () => {
    setProducts(defaultProducts);
    setBankSettings(defaultBankSettings);
    renderAdminRows();
    renderProducts();
    renderOffers();
    const bankSettings = getBankSettings();
    if (adminBankName) adminBankName.value = bankSettings.bankName;
    if (adminCardHolder) adminCardHolder.value = bankSettings.cardHolder;
    if (adminCardNumber) adminCardNumber.value = bankSettings.cardNumber;
    if (adminCardExpiry) adminCardExpiry.value = bankSettings.expiry;
    const emailSettings = getEmailSettings();
    if (adminEmailServiceId) adminEmailServiceId.value = emailSettings.serviceId;
    if (adminEmailTemplateId) adminEmailTemplateId.value = emailSettings.templateId;
    if (adminEmailPublicKey) adminEmailPublicKey.value = emailSettings.publicKey;
    if (adminEmailFromName) adminEmailFromName.value = emailSettings.fromName;
    showAdminToast(currentLang === "en" ? "Default data restored" : "تم استرجاع البيانات الافتراضية");
  });
  panel.querySelector("#adminCloseBtn").addEventListener("click", () => panel.classList.remove("show"));
  panel.querySelectorAll(".admin-tab").forEach((tabBtn) => {
    tabBtn.addEventListener("click", () => {
      activeTab = tabBtn.dataset.tab;
      panel.querySelectorAll(".admin-tab").forEach((btn) => btn.classList.toggle("active", btn === tabBtn));
      renderAdminRows();
    });
  });

  const openAdmin = () => {
    panel.classList.add("show");
    const bankSettings = getBankSettings();
    if (adminBankName) adminBankName.value = bankSettings.bankName;
    if (adminCardHolder) adminCardHolder.value = bankSettings.cardHolder;
    if (adminCardNumber) adminCardNumber.value = bankSettings.cardNumber;
    if (adminCardExpiry) adminCardExpiry.value = bankSettings.expiry;
    const emailSettings = getEmailSettings();
    if (adminEmailServiceId) adminEmailServiceId.value = emailSettings.serviceId;
    if (adminEmailTemplateId) adminEmailTemplateId.value = emailSettings.templateId;
    if (adminEmailPublicKey) adminEmailPublicKey.value = emailSettings.publicKey;
    if (adminEmailFromName) adminEmailFromName.value = emailSettings.fromName;
    renderAdminRows();
    updateLanguage();
  };
  const closeAuth = () => authModal.classList.remove("show");
  const openAuth = () => {
    const passwordInput = authModal.querySelector("#adminPasswordInput");
    const authError = authModal.querySelector("#adminAuthError");
    authModal.classList.add("show");
    if (authError) authError.textContent = "";
    if (passwordInput) {
      passwordInput.value = "";
      passwordInput.focus();
    }
  };
  const confirmAuth = () => {
    const passwordInput = authModal.querySelector("#adminPasswordInput");
    const authError = authModal.querySelector("#adminAuthError");
    const pass = passwordInput ? passwordInput.value : "";
    if (pass !== ADMIN_PASSWORD) {
      if (authError) authError.textContent = currentLang === "en" ? "Wrong password." : "كلمة المرور غير صحيحة";
      return;
    }
    closeAuth();
    openAdmin();
  };

  if (window.location.hash === "#admin") openAdmin();

  authModal.querySelector("#adminAuthCancelBtn").addEventListener("click", closeAuth);
  authModal.querySelector("#adminAuthConfirmBtn").addEventListener("click", confirmAuth);
  authModal.querySelector("#adminPasswordInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") confirmAuth();
  });
  authModal.addEventListener("click", (event) => {
    if (event.target === authModal) closeAuth();
  });

  document.addEventListener("keydown", (event) => {
    if (!(event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "a")) return;
    event.preventDefault();
    openAuth();
  });
  const brandNodes = Array.from(document.querySelectorAll(".brand"));
  let holdTimer = null;
  const clearHoldTimer = () => {
    if (!holdTimer) return;
    window.clearTimeout(holdTimer);
    holdTimer = null;
  };
  const startHoldTimer = () => {
    clearHoldTimer();
    holdTimer = window.setTimeout(() => {
      openAuth();
      clearHoldTimer();
    }, 900);
  };
  brandNodes.forEach((brand) => {
    brand.style.cursor = "pointer";
    brand.addEventListener("touchstart", startHoldTimer, { passive: true });
    brand.addEventListener("touchend", clearHoldTimer);
    brand.addEventListener("touchcancel", clearHoldTimer);
    brand.addEventListener("mousedown", startHoldTimer);
    brand.addEventListener("mouseup", clearHoldTimer);
    brand.addEventListener("mouseleave", clearHoldTimer);
  });

  document.addEventListener("languageChanged", () => {
    if (panel.classList.contains("show")) {
      renderAdminRows();
    }
  });
}

function renderTestimonials() {
  const testimonialsTrack = document.getElementById("testimonialsTrack");
  if (!testimonialsTrack) return;

  const loopItems = [...testimonials, ...testimonials];
  testimonialsTrack.innerHTML = loopItems
    .map(
      (item) => `
        <article class="testimonial-card">
          <p class="testimonial-text">"${currentLang === "en" ? item.en : item.ar}"</p>
          <h4 class="testimonial-name">${item.name}</h4>
        </article>
      `
    )
    .join("");
}

function allocateAccountsForCart(cartItems) {
  const productsCopy = products.map((item) => ({
    ...item,
    accounts: Array.isArray(item.accounts) ? item.accounts.map((entry) => ({ ...entry })) : []
  }));
  const delivered = [];

  for (const cartItem of cartItems) {
    const product = productsCopy.find((item) => item.id === cartItem.id);
    if (!product) continue;
    const account = (product.accounts || []).find((entry) => !entry.used && entry.email && entry.password);
    if (!account) {
      return { ok: false, message: `Out of stock accounts for ${product.title}. Please refill from Admin Control.` };
    }
    account.used = true;
    delivered.push({
      title: product.title,
      email: account.email,
      password: account.password,
      notes: account.notes || ""
    });
  }

  return { ok: true, delivered, productsAfterSale: productsCopy };
}

function addToCart(product) {
  const session = localStorage.getItem(storageKeys.session);
  if (!session) {
    showLoginRequiredModal();
    return;
  }
  const cart = getCart();
  cart.push(product);
  setCart(cart);
  window.location.href = "cart.html";
}

function setupLoginRequiredModal() {
  if (document.getElementById("loginRequiredModal")) return;
  const modal = document.createElement("section");
  modal.id = "loginRequiredModal";
  modal.className = "login-required-modal";
  modal.innerHTML = `
    <div class="login-required-box">
      <h3 data-en="Sign in required" data-ar="تسجيل الدخول مطلوب">Sign in required</h3>
      <p data-en="Please sign in first to add items to cart and complete your order." data-ar="يرجى تسجيل الدخول أولًا لإضافة منتجات للسلة وإكمال الطلب.">Please sign in first to add items to cart and complete your order.</p>
      <div class="login-required-actions">
        <button id="closeLoginRequiredBtn" class="admin-btn admin-btn--muted" type="button" data-en="Later" data-ar="لاحقًا">Later</button>
        <a class="admin-btn" href="login.html" data-en="Sign In Now" data-ar="سجل دخول الآن">Sign In Now</a>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  const closeBtn = modal.querySelector("#closeLoginRequiredBtn");
  if (closeBtn) closeBtn.addEventListener("click", () => modal.classList.remove("show"));
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.classList.remove("show");
  });
}

function showLoginRequiredModal() {
  const modal = document.getElementById("loginRequiredModal");
  if (!modal) return;
  modal.classList.add("show");
}

function toggleWishlist(product) {
  const wishlist = getWishlist();
  const existingIndex = wishlist.findIndex((item) => item.id === product.id);
  if (existingIndex >= 0) {
    wishlist.splice(existingIndex, 1);
  } else {
    wishlist.push(product);
  }
  setWishlist(wishlist);
  renderProducts();
}

function renderWishlistPage() {
  const wishlistItems = document.getElementById("wishlistItems");
  const wishlistEmpty = document.getElementById("wishlistEmpty");
  if (!wishlistItems || !wishlistEmpty) return;

  const wishlist = getWishlist();
  if (!wishlist.length) {
    wishlistItems.innerHTML = "";
    wishlistEmpty.style.display = "block";
    wishlistEmpty.textContent = textMap[currentLang].wishlistEmpty;
    return;
  }

  wishlistEmpty.style.display = "none";
  wishlistItems.innerHTML = wishlist
    .map(
      (item, index) => `
        <article class="cart-item">
          <img src="${optimizeImageUrl(item.image, 460, 55)}" alt="${item.title}" loading="lazy" decoding="async">
          <h4>${item.title}</h4>
          <p class="price">${formatPrice(item.price)}</p>
          <div class="wishlist-actions">
            <button class="move-btn" data-index="${index}">${textMap[currentLang].moveToCart}</button>
            <button class="remove-btn" data-index="${index}">${textMap[currentLang].remove}</button>
          </div>
        </article>
      `
    )
    .join("");

  wishlistItems.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const list = getWishlist();
      list.splice(Number(btn.dataset.index), 1);
      setWishlist(list);
      renderWishlistPage();
    });
  });

  wishlistItems.querySelectorAll(".move-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.index);
      const list = getWishlist();
      const selected = list[index];
      if (!selected) return;
      const cart = getCart();
      cart.push(selected);
      setCart(cart);
      list.splice(index, 1);
      setWishlist(list);
      renderWishlistPage();
    });
  });
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartEmpty = document.getElementById("cartEmpty");
  const cartTotal = document.getElementById("cartTotal");
  if (!cartItems || !cartEmpty || !cartTotal) return;

  const cart = getCart();
  if (!cart.length) {
    cartItems.innerHTML = "";
    cartEmpty.style.display = "block";
    cartTotal.textContent = formatPrice(0);
    return;
  }

  cartEmpty.style.display = "none";
  cartItems.innerHTML = cart
    .map(
      (item, index) => `
        <article class="cart-item">
          <img src="${optimizeImageUrl(item.image, 460, 55)}" alt="${item.title}" loading="lazy" decoding="async">
          <h4>${item.title}</h4>
          <p class="price">${formatPrice(item.price)}</p>
          <button class="remove-btn" data-index="${index}">${textMap[currentLang].remove}</button>
        </article>
      `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = formatPrice(total);

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cartNow = getCart();
      cartNow.splice(Number(btn.dataset.index), 1);
      setCart(cartNow);
      renderCart();
    });
  });
}

function setupFilters() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.category;
      syncFilterButtons();
      renderProducts();
    });
  });
}

function setupLogin() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;
  const loginMessage = document.getElementById("loginMessage");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (localStorage.getItem(storageKeys.session)) {
      loginMessage.textContent = textMap[currentLang].alreadyLoggedIn;
      loginMessage.className = "login-message success";
      return;
    }

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail || password.length < 8) {
      loginMessage.textContent = textMap[currentLang].fill;
      loginMessage.className = "login-message error";
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem(storageKeys.session, data.token);
        loginMessage.textContent = textMap[currentLang].success;
        loginMessage.className = "login-message success";
        setTimeout(() => {
          window.location.href = "index.html";
        }, 900);
      } else {
        loginMessage.textContent = data.message || 'Login failed';
        loginMessage.className = "login-message error";
      }
    } catch (error) {
      loginMessage.textContent = 'Error: ' + error.message;
      loginMessage.className = "login-message error";
    }
  });
}

async function sendVerificationEmail(toEmail, code) {
  const emailSettings = getEmailSettings();
  if (!emailSettings.serviceId || !emailSettings.templateId || !emailSettings.publicKey) {
    return { ok: false, reason: "config-missing" };
  }

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: emailSettings.serviceId,
        template_id: emailSettings.templateId,
        user_id: emailSettings.publicKey,
        template_params: {
          to_email: toEmail,
          verification_code: code,
          store_name: emailSettings.fromName || "Punisher Store"
        }
      })
    });

    return response.ok
      ? { ok: true }
      : { ok: false, reason: "request-failed" };
  } catch (error) {
    return { ok: false, reason: "network-error" };
  }
}

function setupRegister() {
  const registerForm = document.getElementById("registerForm");
  if (!registerForm) return;
  const registerMessage = document.getElementById("registerMessage");
  const verifyModal = document.getElementById("verifyModal");
  const verifyHint = document.getElementById("verifyHint");
  const verifyMessage = document.getElementById("verifyMessage");
  const verifyConfirmBtn = document.getElementById("verifyConfirmBtn");
  const verifyCancelBtn = document.getElementById("verifyCancelBtn");
  const verifyCodePreview = document.getElementById("verifyCodePreview");
  const otpInputs = Array.from(document.querySelectorAll(".otp-input"));
  let pendingSignup = null;

  const closeVerifyModal = () => {
    if (!verifyModal) return;
    verifyModal.classList.remove("show");
    otpInputs.forEach((input) => {
      input.value = "";
    });
    if (verifyCodePreview) verifyCodePreview.textContent = "• • • • • •";
    if (verifyMessage) verifyMessage.textContent = "";
  };

  const openVerifyModal = () => {
    if (!verifyModal) return;
    verifyModal.classList.add("show");
    if (verifyMessage) {
      verifyMessage.textContent = "";
      verifyMessage.className = "login-message";
    }
    if (otpInputs[0]) otpInputs[0].focus();
  };

  otpInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "").slice(0, 1);
      if (verifyCodePreview) {
        verifyCodePreview.textContent = otpInputs.map((entry) => entry.value || "•").join(" ");
      }
      if (input.value && otpInputs[index + 1]) otpInputs[index + 1].focus();
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && !input.value && otpInputs[index - 1]) {
        otpInputs[index - 1].focus();
      }
    });
  });

  if (verifyCancelBtn) verifyCancelBtn.addEventListener("click", closeVerifyModal);
  if (verifyModal) {
    verifyModal.addEventListener("click", (event) => {
      if (event.target === verifyModal) closeVerifyModal();
    });
  }

  if (verifyConfirmBtn) {
    verifyConfirmBtn.addEventListener("click", async () => {
      if (!pendingSignup) return;
      const enteredCode = otpInputs.map((input) => input.value).join("");
      try {
        const response = await fetch('http://localhost:3000/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: pendingSignup.email, code: enteredCode })
        });
        const data = await response.json();
        if (response.ok) {
          closeVerifyModal();
          registerForm.reset();
          registerMessage.textContent = textMap[currentLang].codeVerified;
          registerMessage.className = "login-message success";
          pendingSignup = null;
          setTimeout(() => {
            window.location.href = "login.html";
          }, 800);
        } else {
          if (verifyMessage) {
            verifyMessage.textContent = data.message || 'Verification failed';
            verifyMessage.className = "login-message error";
          }
        }
      } catch (error) {
        if (verifyMessage) {
          verifyMessage.textContent = 'Error: ' + error.message;
          verifyMessage.className = "login-message error";
        }
      }
    });
  }

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value.trim();
    const passwordConfirm = document.getElementById("registerPasswordConfirm").value.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const strongPassword = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);

    if (!name || !validEmail || !strongPassword) {
      registerMessage.textContent = textMap[currentLang].registerInvalid;
      registerMessage.className = "login-message error";
      return;
    }
    if (password !== passwordConfirm) {
      registerMessage.textContent = textMap[currentLang].confirmMismatch;
      registerMessage.className = "login-message error";
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (response.ok) {
        registerMessage.textContent = data.message;
        registerMessage.className = "login-message success";
        pendingSignup = { email };
        openVerifyModal();
      } else {
        registerMessage.textContent = data.message || 'Registration failed';
        registerMessage.className = "login-message error";
      }
    } catch (error) {
      registerMessage.textContent = 'Error: ' + error.message;
      registerMessage.className = "login-message error";
    }
  });
}

function setupAuthTabs() {
  return;
}

function setupBuyNow() {
  const buyBtn = document.getElementById("buyNowBtn");
  const paymentModal = document.getElementById("paymentModal");
  const closePaymentBtn = document.getElementById("closePaymentBtn");
  const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");
  const cardFields = document.getElementById("cardFields");
  const cardHolder = document.getElementById("cardHolder");
  const cardNumber = document.getElementById("cardNumber");
  const cardExpiry = document.getElementById("cardExpiry");
  const cardCvv = document.getElementById("cardCvv");
  const paypalFields = document.getElementById("paypalFields");
  const paypalEmail = document.getElementById("paypalEmail");
  const paypalRef = document.getElementById("paypalRef");
  const bankReceiverInfo = document.getElementById("bankReceiverInfo");
  const paymentError = document.getElementById("paymentError");
  if (!buyBtn || !paymentModal || !closePaymentBtn || !confirmPaymentBtn) return;

  const deliveryModal = document.createElement("section");
  deliveryModal.id = "deliveryModal";
  deliveryModal.className = "delivery-modal";
  deliveryModal.innerHTML = `
    <div class="delivery-card">
      <div class="delivery-spark"></div>
      <h3>Payment Successful</h3>
      <p>Your game account details are ready:</p>
      <div id="deliveryList" class="delivery-list"></div>
      <button id="closeDeliveryBtn" class="buy-btn" type="button">Awesome</button>
    </div>
  `;
  document.body.appendChild(deliveryModal);

  const deliveryList = deliveryModal.querySelector("#deliveryList");
  const closeDeliveryBtn = deliveryModal.querySelector("#closeDeliveryBtn");

  const formatCardNumber = (value) => value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };
  const isCardMethod = (method) => method === "visa" || method === "mastercard";
  const isPaypalMethod = (method) => method === "paypal";
  const maskCard = (value) => {
    const digits = String(value || "").replace(/\D/g, "");
    if (digits.length < 4) return "****";
    return `**** **** **** ${digits.slice(-4)}`;
  };

  const clearPaymentError = () => {
    if (paymentError) paymentError.textContent = "";
  };

  const updateCardFieldsVisibility = () => {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
    const showCardFields = selectedMethod && isCardMethod(selectedMethod.value);
    const showPaypalFields = selectedMethod && isPaypalMethod(selectedMethod.value);
    if (cardFields) {
      cardFields.classList.toggle("hidden", !showCardFields);
    }
    if (paypalFields) {
      paypalFields.classList.toggle("hidden", !showPaypalFields);
    }
    clearPaymentError();
  };

  if (cardNumber) {
    cardNumber.addEventListener("input", () => {
      cardNumber.value = formatCardNumber(cardNumber.value);
    });
  }
  if (cardExpiry) {
    cardExpiry.addEventListener("input", () => {
      cardExpiry.value = formatExpiry(cardExpiry.value);
    });
  }
  if (cardCvv) {
    cardCvv.addEventListener("input", () => {
      cardCvv.value = cardCvv.value.replace(/\D/g, "").slice(0, 4);
    });
  }

  document.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
    radio.addEventListener("change", updateCardFieldsVisibility);
  });
  updateCardFieldsVisibility();

  buyBtn.addEventListener("click", () => {
    if (!getCart().length) return;
    const receiver = getBankSettings();
    if (bankReceiverInfo) {
      bankReceiverInfo.innerHTML = currentLang === "en"
        ? `<strong>Receiver:</strong> ${receiver.cardHolder || "-"}<br><strong>Bank:</strong> ${receiver.bankName || "-"}<br><strong>Card:</strong> ${maskCard(receiver.cardNumber)}`
        : `<strong>المستلم:</strong> ${receiver.cardHolder || "-"}<br><strong>البنك:</strong> ${receiver.bankName || "-"}<br><strong>البطاقة:</strong> ${maskCard(receiver.cardNumber)}`;
    }
    paymentModal.classList.add("show");
    clearPaymentError();
  });

  closePaymentBtn.addEventListener("click", () => {
    paymentModal.classList.remove("show");
    clearPaymentError();
  });

  paymentModal.addEventListener("click", (event) => {
    if (event.target === paymentModal) {
      paymentModal.classList.remove("show");
      clearPaymentError();
    }
  });

  confirmPaymentBtn.addEventListener("click", () => {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (!selectedMethod) return;
    const receiverCard = getBankSettings();
    if (!receiverCard.bankName || !receiverCard.cardHolder || !/^\d{12,19}$/.test(String(receiverCard.cardNumber || "").replace(/\D/g, ""))) {
      if (paymentError) {
        paymentError.textContent = currentLang === "en"
          ? "Admin must set valid receiver bank card settings first."
          : "لازم الأدمن يضبط بيانات بطاقة البنك المستلم أولًا.";
      }
      return;
    }

    if (isCardMethod(selectedMethod.value)) {
      const cleanNumber = cardNumber ? cardNumber.value.replace(/\s/g, "") : "";
      const cleanExpiry = cardExpiry ? cardExpiry.value : "";
      const cleanCvv = cardCvv ? cardCvv.value : "";
      const holder = cardHolder ? cardHolder.value.trim() : "";
      const validCardNumber = /^\d{16}$/.test(cleanNumber);
      const validExpiry = /^(0[1-9]|1[0-2])\/\d{2}$/.test(cleanExpiry);
      const validCvv = /^\d{3,4}$/.test(cleanCvv);
      if (!holder || !validCardNumber || !validExpiry || !validCvv) {
        if (paymentError) paymentError.textContent = textMap[currentLang].paymentCardInvalid;
        return;
      }
    }
    if (isPaypalMethod(selectedMethod.value)) {
      const mail = paypalEmail ? paypalEmail.value.trim() : "";
      const ref = paypalRef ? paypalRef.value.trim() : "";
      const validMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
      if (!validMail || ref.length < 4) {
        if (paymentError) paymentError.textContent = textMap[currentLang].paymentPaypalInvalid;
        return;
      }
    }

    const allocation = allocateAccountsForCart(getCart());
    if (!allocation.ok) {
      if (paymentError) paymentError.textContent = allocation.message;
      return;
    }

    setProducts(allocation.productsAfterSale);
    const bankTarget = getBankSettings();
    const cartNow = getCart();
    const total = cartNow.reduce((sum, item) => sum + Number(item.price || 0), 0);
    setSettlement({
      at: new Date().toISOString(),
      method: selectedMethod.value,
      totalJod: total,
      targetBank: bankTarget
    });
    paymentModal.classList.remove("show");
    clearPaymentError();
    setCart([]);
    renderCart();

    deliveryList.innerHTML = allocation.delivered
      .map((entry) => `
        <article class="delivery-item">
          <h4>${entry.title}</h4>
          <p><strong>Email:</strong> ${entry.email}</p>
          <p><strong>Password:</strong> ${entry.password}</p>
          <p><strong>Notes:</strong> ${entry.notes || "-"}</p>
        </article>
      `)
      .join("");
    deliveryModal.classList.add("show");
  });

  closeDeliveryBtn.addEventListener("click", () => {
    deliveryModal.classList.remove("show");
  });
  deliveryModal.addEventListener("click", (event) => {
    if (event.target === deliveryModal) deliveryModal.classList.remove("show");
  });

}

document.addEventListener("DOMContentLoaded", () => {
  initUsers();
  setupLoginRequiredModal();
  renderCartCount();
  renderWishlistCount();
  setupMenu();
  setupFilters();
  renderProducts();
  renderOffers();
  renderTestimonials();
  renderCart();
  renderWishlistPage();
  setupLogin();
  setupRegister();
  setupAuthTabs();
  setupBuyNow();
  setupAdminPanel();
  updateLanguage();

  const langBtn = document.getElementById("langBtn");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      currentLang = currentLang === "en" ? "ar" : "en";
      localStorage.setItem(storageKeys.lang, currentLang);
      updateLanguage();
      renderProducts();
      renderOffers();
      renderTestimonials();
      renderCart();
      renderWishlistPage();
    });
  }
});
