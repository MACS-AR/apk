
// التعامل مع التنقل بين الصفحات
const appDiv = document.getElementById("app");
const addProductBtn = document.getElementById("add-product-btn");
const sellProductBtn = document.getElementById("sell-product-btn");
const listProductsBtn = document.getElementById("list-products-btn");
const statsBtn = document.getElementById("stats-btn");

// الانتقال بين الصفحات
addProductBtn.addEventListener("click", showAddProductPage);
sellProductBtn.addEventListener("click", showSellProductPage);
listProductsBtn.addEventListener("click", showListProductsPage);
statsBtn.addEventListener("click", showStatsPage);

// صفحة إضافة منتج

function showAddProductPage() {
  appDiv.innerHTML = `
    <h2>إضافة منتج</h2>
    <form id="add-product-form">
      <label>اسم المنتج:</label>
      <input type="text" id="product-name" required />
      <label>السعر:</label>
      <input type="number" id="product-price" required />
      <label>الكمية:</label>
      <input type="number" id="product-quantity" required />
      <label>الباركود:</label>
      <div style="display: flex; align-items: center;">
        <input type="text" id="product-barcode" required />
        <button type="button" id="scan-barcode-btn">📸</button>
      </div>
      <div id="camera-preview" class="hidden"></div>
      <button type="submit">حفظ المنتج</button>
    </form>
  `;

  document.getElementById("scan-barcode-btn").addEventListener("click", toggleBarcodeScanner);
  document.getElementById("add-product-form").addEventListener("submit", saveProduct);
}

function toggleBarcodeScanner() {
  const cameraPreview = document.getElementById("camera-preview");
  if (cameraPreview.classList.contains("hidden")) {
    cameraPreview.classList.remove("hidden");
    startBarcodeScanner();
  } else {
    cameraPreview.classList.add("hidden");
    Quagga.stop();
  }
}

  appDiv.innerHTML = `
    <h2>إضافة منتج</h2>
    <form id="add-product-form">
      <label>اسم المنتج:</label>
      <input type="text" id="product-name" required />
      <label>السعر:</label>
      <input type="number" id="product-price" required />
      <label>الكمية:</label>
      <input type="number" id="product-quantity" required />
      <label>الباركود:</label>
      <input type="text" id="product-barcode" required />
      <button type="submit">حفظ المنتج</button>
    </form>
  `;

  document.getElementById("add-product-form").addEventListener("submit", saveProduct);
}

// حفظ المنتج
function saveProduct(event) {
  event.preventDefault();

  const name = document.getElementById("product-name").value;
  const price = parseFloat(document.getElementById("product-price").value);
  const quantity = parseInt(document.getElementById("product-quantity").value);
  const barcode = document.getElementById("product-barcode").value;

  const product = { name, price, quantity, barcode };
  let products = JSON.parse(localStorage.getItem("products")) || [];
  products.push(product);
  localStorage.setItem("products", JSON.stringify(products));

  showToast("تمت إضافة المنتج بنجاح!");
  event.target.reset();
}

// صفحة بيع منتج
function showSellProductPage() {
  appDiv.innerHTML = `
    <h2>بيع منتج</h2>
    <form id="sell-product-form">
      <label>أدخل الباركود:</label>
      <input type="text" id="search-barcode" required />
      <button type="submit">بحث</button>
    </form>
    <button id="start-scan-btn">مسح الباركود بالكاميرا</button>
    <div id="camera-preview" style="width: 100%; height: 300px; margin-top: 10px;"></div>
    <div id="product-info"></div>
  `;

  document.getElementById("sell-product-form").addEventListener("submit", searchProduct);
  document.getElementById("start-scan-btn").addEventListener("click", startBarcodeScanner);
}

// البحث عن منتج
function searchProduct(event) {
  event.preventDefault();

  const barcode = document.getElementById("search-barcode").value;
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find((p) => p.barcode === barcode);

  const productInfoDiv = document.getElementById("product-info");
  if (product) {
    productInfoDiv.innerHTML = `
      <p>اسم المنتج: ${product.name}</p>
      <p>السعر: ${product.price}</p>
      <p>الكمية المتوفرة: ${product.quantity}</p>
      <button id="sell-btn">إتمام البيع</button>
    `;

    document.getElementById("sell-btn").addEventListener("click", () => sellProduct(product));
  } else {
    productInfoDiv.innerHTML = "<p>المنتج غير موجود.</p>";
  }
}

// إتمام البيع
function sellProduct(product) {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  const index = products.findIndex((p) => p.barcode === product.barcode);

  if (products[index].quantity > 0) {
    products[index].quantity -= 1;
    localStorage.setItem("products", JSON.stringify(products));
    showToast("تمت عملية البيع بنجاح!");
    showSellProductPage();
  } else {
    showToast("الكمية غير متوفرة.");
  }
}

// عرض قائمة المنتجات
function showListProductsPage() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  appDiv.innerHTML = `
    <h2>قائمة المنتجات</h2>
    <table>
      <thead>
        <tr>
          <th>الباركود</th>
          <th>اسم المنتج</th>
          <th>السعر</th>
          <th>الكمية</th>
          <th>إجراءات</th>
        </tr>
      </thead>
      <tbody>
        ${products
          .map(
            (product, index) => `
        <tr>
          <td>${product.barcode}</td>
          <td>${product.name}</td>
          <td>${product.price}</td>
          <td>${product.quantity}</td>
          <td>
            <button onclick="deleteProduct(${index})">حذف</button>
          </td>
        </tr>`
          )
          .join("")}
      </tbody>
    </table>
  `;
}

// حذف منتج
function deleteProduct(index) {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  showToast("تم حذف المنتج!");
  showListProductsPage();
}

// عرض الإحصائيات
function showStatsPage() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const totalProducts = products.length;
  const outOfStock = products.filter((product) => product.quantity === 0).length;

  appDiv.innerHTML = `
    <h2>الإحصائيات</h2>
    <p>إجمالي عدد المنتجات: ${totalProducts}</p>
    <p>عدد المنتجات التي نفدت: ${outOfStock}</p>
  `;
}

// تشغيل ماسح الباركود
function startBarcodeScanner() {
  const cameraPreview = document.getElementById("camera-preview");

  Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: cameraPreview,
      },
      decoder: {
        readers: ["ean_reader", "code_128_reader"],
      },
    },
    function (err) {
      if (err) {
        console.error(err);
        alert("خطأ أثناء تشغيل الكاميرا!");
        return;
      }
      Quagga.start();
    }
  );

  Quagga.onDetected(function (data) {
    const barcode = data.codeResult.code;
    document.getElementById("search-barcode").value = barcode;
    Quagga.stop();
    alert("تم قراءة الباركود: " + barcode);
  });
}

// عرض رسالة تأكيد
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    document.body.removeChild(toast);
  }, 3000);
}
    
function showSellProductPage() {
  appDiv.innerHTML = `
    <h2>بيع منتج</h2>
    <form id="sell-product-form">
      <label>أدخل الباركود:</label>
      <input type="text" id="search-barcode" />
      <button type="button" id="add-to-invoice-btn">إضافة إلى الفاتورة</button>
    </form>
    <div id="camera-preview" class="hidden"></div>
    <table id="invoice-table">
      <thead>
        <tr>
          <th>اسم المنتج</th>
          <th>السعر</th>
          <th>الكمية</th>
          <th>إجمالي السعر</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <p id="total-price">الإجمالي: 0</p>
  `;

  document.getElementById("add-to-invoice-btn").addEventListener("click", addToInvoice);
}

function addToInvoice() {
  const barcode = document.getElementById("search-barcode").value;
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find((p) => p.barcode === barcode);

  if (product) {
    const invoiceTable = document.querySelector("#invoice-table tbody");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td>1</td>
      <td>${product.price}</td>
    `;
    invoiceTable.appendChild(row);

    updateTotalPrice(product.price);
  } else {
    alert("المنتج غير موجود.");
  }
}

function updateTotalPrice(amount) {
  const totalPriceEl = document.getElementById("total-price");
  const currentTotal = parseFloat(totalPriceEl.textContent.split(": ")[1]) || 0;
  const newTotal = currentTotal + amount;
  totalPriceEl.textContent = `الإجمالي: ${newTotal}`;
}
