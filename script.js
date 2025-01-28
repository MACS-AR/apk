// Initialize the app
const appDiv = document.getElementById("app");
const loginBtn = document.getElementById("login-btn");
const addProductBtn = document.getElementById("add-product-btn");
const sellProductBtn = document.getElementById("sell-product-btn");
const reportsBtn = document.getElementById("reports-btn");

let isLoggedIn = false; // Login status

// Navigation
loginBtn.addEventListener("click", showLoginPage);
addProductBtn.addEventListener("click", () => {
  if (isLoggedIn) {
    showAddProductPage();
  } else {
    alert("يرجى تسجيل الدخول أولاً.");
  }
});
sellProductBtn.addEventListener("click", () => {
  if (isLoggedIn) {
    showSellPage();
  } else {
    alert("يرجى تسجيل الدخول أولاً.");
  }
});
reportsBtn.addEventListener("click", showReportsPage);

// Login Page
function showLoginPage() {
  appDiv.innerHTML = `
    <h2 class="text-center">تسجيل الدخول</h2>
    <form id="login-form" class="p-3">
      <div class="mb-3">
        <label for="username" class="form-label">اسم المستخدم:</label>
        <input type="text" id="username" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">كلمة المرور:</label>
        <input type="password" id="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary w-100">دخول</button>
    </form>
  `;

  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "1234") {
      isLoggedIn = true;
      alert("تم تسجيل الدخول بنجاح!");
      showAddProductPage();
    } else {
      alert("اسم المستخدم أو كلمة المرور غير صحيحة.");
    }
  });
}

// Add Product Page
function showAddProductPage() {
  appDiv.innerHTML = `
    <h2 class="text-center">إضافة منتج</h2>
    <form id="add-product-form" class="p-3">
      <div class="mb-3">
        <label for="product-name" class="form-label">اسم المنتج:</label>
        <input type="text" id="product-name" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="product-price" class="form-label">السعر:</label>
        <input type="number" id="product-price" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="product-barcode" class="form-label">الباركود:</label>
        <input type="text" id="product-barcode" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-success w-100">إضافة</button>
    </form>
  `;
}

// Sales Page
function showSellPage() {
  appDiv.innerHTML = `
    <h2 class="text-center">بيع المنتجات</h2>
    <div id="camera-preview"></div>
    <button id="start-scanning" class="btn btn-primary w-100 mt-3">ابدأ مسح الباركود</button>
    <table class="table table-bordered mt-3">
      <thead>
        <tr>
          <th>اسم المنتج</th>
          <th>السعر</th>
          <th>الكمية</th>
          <th>الإجمالي</th>
        </tr>
      </thead>
      <tbody id="invoice-items"></tbody>
    </table>
    <div class="text-end">
      <strong>الإجمالي: </strong><span id="total-amount">0</span>
    </div>
  `;

  // Start barcode scanning
  document.getElementById("start-scanning").addEventListener("click", startBarcodeScanning);
}

function startBarcodeScanning() {
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector("#camera-preview")
    },
    decoder: {
      readers: ["ean_reader", "ean_13_reader", "upc_reader"]
    }
  }, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected((data) => {
    const barcode = data.codeResult.code;
    alert(`تم قراءة الباركود: ${barcode}`);
    // إضافة المنتج إلى الفاتورة هنا (سيتم التنفيذ لاحقًا)
  });
}

// Reports Page
function showReportsPage() {
  appDiv.innerHTML = `
    <h2 class="text-center">التقارير</h2>
    <p>عرض التقارير هنا...</p>
  `;
}
