/* =========================================
نظام المبيعات POS
إدارة المنتجات + الفاتورة
========================================= */

/* ---------- المنتجات ---------- */

var products = [];

var saleItems = [];

var customers = [];

var invoices = [];

var suppliers = [];

var purchases = [];

var purchaseItems = [];

var editingProductId = null;

var editingCustomerId = null;

var editingSupplierId = null;

var settings = {
shopName: "المحل التجريبي",
shopAddress: "",
shopPhone: "",
shopRC: "",
shopArt: "",
invoiceNote: "نرجو منكم التأكد وحساب البضاعة، وأي اعتراض بعد 07 أيام يعتبر مرفوضًا"
};

/* تحميل المنتجات المحفوظة */

function loadProducts() {

var saved = localStorage.getItem("pos_products");

if (saved) {
try {
products = JSON.parse(saved);
} catch (e) {
products = [];
}
} else {
products = [];
}
}

/* حفظ المنتجات */

function saveProducts() {

localStorage.setItem(
"pos_products",
JSON.stringify(products)
);
}

/* ---------- العملاء ---------- */

function loadCustomers() {

var saved = localStorage.getItem("pos_customers");

if (saved) {
try {
customers = JSON.parse(saved);
} catch (e) {
customers = [];
}
} else {
customers = [];
}
}

function saveCustomers() {

localStorage.setItem(
"pos_customers",
JSON.stringify(customers)
);
}

/* ---------- الفواتير ---------- */

function loadInvoices() {

var saved = localStorage.getItem("pos_invoices");

if (saved) {
try {
invoices = JSON.parse(saved);
} catch (e) {
invoices = [];
}
} else {
invoices = [];
}
}

function saveInvoices() {

localStorage.setItem(
"pos_invoices",
JSON.stringify(invoices)
);
}

/* ---------- الإعدادات ---------- */

function loadSettings() {

var saved = localStorage.getItem("pos_settings");

if (saved) {
try {
settings = JSON.parse(saved);
if (!settings.shopAddress) {
settings.shopAddress = "";
}
if (!settings.shopPhone) {
settings.shopPhone = "";
}
if (!settings.shopRC) {
settings.shopRC = "";
}
if (!settings.shopArt) {
settings.shopArt = "";
}
if (!settings.invoiceNote) {
settings.invoiceNote = "نرجو منكم التأكد وحساب البضاعة، وأي اعتراض بعد 07 أيام يعتبر مرفوضًا";
}
} catch (e) {
settings = {
shopName: "المحل التجريبي",
shopAddress: "",
shopPhone: "",
shopRC: "",
shopArt: "",
invoiceNote: "نرجو منكم التأكد وحساب البضاعة، وأي اعتراض بعد 07 أيام يعتبر مرفوضًا"
};
}
} else {
settings = {
shopName: "المحل التجريبي",
shopAddress: "",
shopPhone: "",
shopRC: "",
shopArt: "",
invoiceNote: "نرجو منكم التأكد وحساب البضاعة، وأي اعتراض بعد 07 أيام يعتبر مرفوضًا"
};
}
}

/* ---------- الموردون ---------- */

function loadSuppliers() {

var saved = localStorage.getItem("pos_suppliers");

if (saved) {
try {
suppliers = JSON.parse(saved);
} catch (e) {
suppliers = [];
}
} else {
suppliers = [];
}
}

function saveSuppliers() {

localStorage.setItem(
"pos_suppliers",
JSON.stringify(suppliers)
);
}

/* ---------- فواتير الشراء ---------- */

function loadPurchases() {

var saved = localStorage.getItem("pos_purchases");

if (saved) {
try {
purchases = JSON.parse(saved);
} catch (e) {
purchases = [];
}
} else {
purchases = [];
}
}

function savePurchases() {

localStorage.setItem(
"pos_purchases",
JSON.stringify(purchases)
);
}

/* ---------- سجل التسديدات ---------- */

var debtPayments = [];

function loadDebtPayments() {

var saved = localStorage.getItem("pos_debt_payments");

if (saved) {
try {
debtPayments = JSON.parse(saved);
} catch (e) {
debtPayments = [];
}
} else {
debtPayments = [];
}
}

function saveDebtPayments() {

localStorage.setItem(
"pos_debt_payments",
JSON.stringify(debtPayments)
);
}

function saveSettings() {

localStorage.setItem(
"pos_settings",
JSON.stringify(settings)
);
}

/* ---------- التاريخ ---------- */

function showDate() {

var today = new Date();

var day = today.getDate();
var month = today.getMonth() + 1;
var year = today.getFullYear();

if (day < 10) {
day = "0" + day;
}

if (month < 10) {
month = "0" + month;
}

var dateText = day + "/" + month + "/" + year;

var element = document.getElementById("invoice-date");

if (element) {
element.innerHTML = dateText;
}

var purchaseElement = document.getElementById("purchase-date");

if (purchaseElement) {
purchaseElement.innerHTML = dateText;
}
}

/* ---------- تنسيق الأرقام ---------- */

function formatNumber(number) {

number = Number(number);

if (isNaN(number)) {
number = 0;
}

return number.toFixed(2);
}

/* ---------- رسالة عند خلو الجدول ---------- */

function showEmptyRow(tableBody, columnsCount, message) {

var row = document.createElement("tr");

row.className = "empty-row";

var cell = document.createElement("td");

cell.colSpan = columnsCount;

cell.innerHTML = message;

row.appendChild(cell);

tableBody.appendChild(row);
}

/* =========================================
إضافة منتج
========================================= */

function addNewProduct() {

var barcode =
document.getElementById("product-barcode").value;

var name =
document.getElementById("product-name").value;

var category =
document.getElementById("product-category").value;

var buyPrice =
document.getElementById("product-buy-price").value;

var salePrice =
document.getElementById("product-sale-price").value;

var stock =
document.getElementById("product-stock").value;

var minStock =
document.getElementById("product-min-stock").value;

/* إزالة الفراغات */

barcode = barcode.replace(/^\s+|\s+$/g, "");
name = name.replace(/^\s+|\s+$/g, "");
category = category.replace(/^\s+|\s+$/g, "");

if (category == "") {
category = "بدون صنف";
}


/* التحقق من اسم المنتج */

if (name == "") {

alert("أدخل اسم المنتج");

document.getElementById("product-name").focus();

return;
}

/* التحقق من تكرار الباركود (فقط إذا تم إدخاله) */

var i;

if (barcode != "") {

for (i = 0; i < products.length; i++) {

if (products[i].barcode == barcode && products[i].id != editingProductId) {

alert("هذا الباركود موجود مسبقًا");

document.getElementById("product-barcode").focus();

return;
}
}
}

/* التحقق من تكرار اسم المنتج */

for (i = 0; i < products.length; i++) {

if (products[i].name.toLowerCase() == name.toLowerCase() && products[i].id != editingProductId) {

alert("يوجد منتج مسجل بهذا الاسم مسبقًا");

document.getElementById("product-name").focus();

return;
}
}

/* تحويل الأرقام */

buyPrice = Number(buyPrice);
salePrice = Number(salePrice);
stock = Number(stock);
minStock = Number(minStock);

if (isNaN(buyPrice) || buyPrice < 0) {

alert("سعر الشراء غير صحيح");

return;
}

if (isNaN(salePrice) || salePrice < 0) {

alert("سعر البيع غير صحيح");

return;
}

if (isNaN(stock) || stock < 0) {

alert("الكمية غير صحيحة");

return;
}

if (isNaN(minStock) || minStock < 0) {

alert("الحد الأدنى غير صحيح");

return;
}

/* تنبيه إذا كان سعر البيع أقل من أو يساوي سعر الشراء */

if (salePrice <= buyPrice) {

var confirmLoss = confirm(
"تنبيه: سعر البيع (" + formatNumber(salePrice) +
" دج) أقل من أو يساوي سعر الشراء (" +
formatNumber(buyPrice) + " دج).\n" +
"هل تريد المتابعة رغم ذلك؟"
);

if (!confirmLoss) {

document.getElementById("product-sale-price").focus();

return;
}
}

/* وضع التحديث: تعديل سلعة موجودة */

if (editingProductId != null) {

var editedProduct = null;

for (i = 0; i < products.length; i++) {

if (products[i].id == editingProductId) {
editedProduct = products[i];
break;
}
}

if (!editedProduct) {

alert("تعذر العثور على السلعة المطلوب تعديلها");

cancelEditProduct();

return;
}

if (barcode == "") {
barcode = "M" + editedProduct.id;
}

editedProduct.barcode = barcode;
editedProduct.name = name;
editedProduct.category = category;
editedProduct.buyPrice = buyPrice;
editedProduct.salePrice = salePrice;
editedProduct.stock = stock;
editedProduct.minStock = minStock;

saveProducts();

displayProducts();

refreshProductSelects();

populateCategoryFilters();

cancelEditProduct();

alert("تم تحديث السلعة بنجاح");

return;
}

/* إنشاء رقم داخلي */

var newId = 1;

for (i = 0; i < products.length; i++) {

if (products[i].id >= newId) {
newId = products[i].id + 1;
}
}

/* توليد رمز داخلي إذا لم يُدخل باركود */

if (barcode == "") {

barcode = "M" + newId;
}

/* إنشاء المنتج */

var product = {

id: newId,

barcode: barcode,

name: name,

category: category,

buyPrice: buyPrice,

salePrice: salePrice,

stock: stock,

minStock: minStock
};

products.push(product);

saveProducts();

displayProducts();

refreshProductSelects();

populateCategoryFilters();

clearProductForm();

alert("تمت إضافة السلعة بنجاح");
}

/* =========================================
تعديل / إلغاء تعديل سلعة
========================================= */

function editProduct(id) {

var product = null;

var i;

for (i = 0; i < products.length; i++) {

if (products[i].id == id) {
product = products[i];
break;
}
}

if (!product) {
return;
}

editingProductId = id;

document.getElementById("product-barcode").value = product.barcode;
document.getElementById("product-name").value = product.name;
document.getElementById("product-category").value = product.category || "";
document.getElementById("product-buy-price").value = product.buyPrice;
document.getElementById("product-sale-price").value = product.salePrice;
document.getElementById("product-stock").value = product.stock;
document.getElementById("product-min-stock").value = product.minStock;

var title = document.getElementById("product-form-title");
if (title) {
title.innerHTML = "تعديل سلعة";
}

var addButton = document.getElementById("add-product");
if (addButton) {
addButton.innerHTML = "تحديث السلعة";
}

var cancelButton = document.getElementById("cancel-edit-product");
if (cancelButton) {
cancelButton.style.display = "inline-block";
}

document.getElementById("product-name").focus();
}

function cancelEditProduct() {

editingProductId = null;

clearProductForm();

var title = document.getElementById("product-form-title");
if (title) {
title.innerHTML = "إضافة سلعة";
}

var addButton = document.getElementById("add-product");
if (addButton) {
addButton.innerHTML = "إضافة السلعة";
}

var cancelButton = document.getElementById("cancel-edit-product");
if (cancelButton) {
cancelButton.style.display = "none";
}
}

/* =========================================
تفريغ نموذج المنتج
========================================= */

function clearProductForm() {

document.getElementById("product-barcode").value = "";

document.getElementById("product-name").value = "";

document.getElementById("product-category").value = "";

document.getElementById("product-buy-price").value = "";

document.getElementById("product-sale-price").value = "";

document.getElementById("product-stock").value = "";

document.getElementById("product-min-stock").value = "";

document.getElementById("product-barcode").focus();
}

/* =========================================
عرض المنتجات
========================================= */

function displayProducts() {

var table =
document.getElementById("products-list");

if (!table) {
return;
}

table.innerHTML = "";

var shownCount = 0;

var searchElement =
document.getElementById("product-search-input");

var search = "";

if (searchElement) {

search = searchElement.value;

search = search.toLowerCase();
}

var categoryFilterElement =
document.getElementById("product-category-filter");

var categoryFilter = "";

if (categoryFilterElement) {

categoryFilter = categoryFilterElement.value;
}

var i;

for (i = 0; i < products.length; i++) {

var product = products[i];

var barcode =
product.barcode.toLowerCase();

var name =
product.name.toLowerCase();

/* تصفية حسب الصنف */

if (
categoryFilter != "" &&
(product.category || "بدون صنف") != categoryFilter
) {

continue;
}

/* البحث */

if (
search != "" &&
barcode.indexOf(search) == -1 &&
name.indexOf(search) == -1
) {

continue;
}

var row = document.createElement("tr");

/* الرقم */

var cell1 = document.createElement("td");

cell1.innerHTML = product.id;

/* الباركود */

var cell2 = document.createElement("td");

cell2.innerHTML = product.barcode;

/* الاسم */

var cell3 = document.createElement("td");

cell3.innerHTML = product.name;

/* الصنف */

var cellCategory = document.createElement("td");

cellCategory.innerHTML = product.category || "بدون صنف";

/* سعر الشراء */

var cell4 = document.createElement("td");

cell4.innerHTML =
formatNumber(product.buyPrice) + " دج";

/* سعر البيع */

var cell5 = document.createElement("td");

cell5.innerHTML =
formatNumber(product.salePrice) + " دج";

/* المخزون */

var cell6 = document.createElement("td");

cell6.innerHTML = product.stock;

/* الحد الأدنى */

var cell7 = document.createElement("td");

cell7.innerHTML = product.minStock;

/* زر التعديل */

var cell8 = document.createElement("td");

var editButton =
document.createElement("button");

editButton.innerHTML = "تعديل";

editButton.className = "btn-table btn-table-edit";

editButton.onclick = (function(id) {

return function() {

editProduct(id);

};

})(product.id);

cell8.appendChild(editButton);

/* زر الحذف */

var cell9 = document.createElement("td");

var deleteButton =
document.createElement("button");

deleteButton.innerHTML = "حذف";

deleteButton.onclick = (function(id) {

return function() {

deleteProduct(id);

};

})(product.id);

cell9.appendChild(deleteButton);

row.appendChild(cell1);
row.appendChild(cell2);
row.appendChild(cell3);
row.appendChild(cellCategory);
row.appendChild(cell4);
row.appendChild(cell5);
row.appendChild(cell6);
row.appendChild(cell7);
row.appendChild(cell8);
row.appendChild(cell9);

table.appendChild(row);

shownCount++;
}

if (shownCount == 0) {

var message = "لا توجد سلع بعد. أضف سلعتك الأولى من النموذج أعلاه";

if (search != "" || categoryFilter != "") {
message = "لا توجد نتائج مطابقة";
}

showEmptyRow(table, 10, message);
}
}

/* =========================================
حذف منتج
========================================= */

function deleteProduct(id) {

var answer =
confirm("هل تريد حذف هذه السلعة؟");

if (!answer) {
return;
}

var newProducts = [];

var i;

for (i = 0; i < products.length; i++) {

if (products[i].id != id) {

newProducts.push(products[i]);
}
}

products = newProducts;

saveProducts();

if (editingProductId != null) {
cancelEditProduct();
}

displayProducts();

refreshProductSelects();

populateCategoryFilters();
}

/* =========================================
إضافة عميل
========================================= */

function addNewCustomer() {

var name =
document.getElementById("customer-name").value;

var phone =
document.getElementById("customer-phone").value;

name = name.replace(/^\s+|\s+$/g, "");
phone = phone.replace(/^\s+|\s+$/g, "");

if (name == "") {

alert("أدخل اسم العميل");

document.getElementById("customer-name").focus();

return;
}

/* التحقق من عدم تكرار اسم العميل */

var i;

for (i = 0; i < customers.length; i++) {

if (customers[i].name.toLowerCase() == name.toLowerCase() && customers[i].id != editingCustomerId) {

alert("يوجد عميل مسجل بهذا الاسم مسبقًا");

document.getElementById("customer-name").focus();

return;
}
}

/* وضع التحديث: تعديل عميل موجود */

if (editingCustomerId != null) {

var editedCustomer = null;

for (i = 0; i < customers.length; i++) {

if (customers[i].id == editingCustomerId) {
editedCustomer = customers[i];
break;
}
}

if (!editedCustomer) {

alert("تعذر العثور على العميل المطلوب تعديله");

cancelEditCustomer();

return;
}

editedCustomer.name = name;
editedCustomer.phone = phone;

saveCustomers();

displayCustomers();

populateCustomerSelect();

cancelEditCustomer();

alert("تم تحديث بيانات العميل بنجاح");

return;
}

var newId = 1;

for (i = 0; i < customers.length; i++) {

if (customers[i].id >= newId) {
newId = customers[i].id + 1;
}
}

var customer = {

id: newId,

name: name,

phone: phone,

debt: 0
};

customers.push(customer);

saveCustomers();

displayCustomers();

populateCustomerSelect();

clearCustomerForm();

alert("تمت إضافة العميل بنجاح");
}

function clearCustomerForm() {

document.getElementById("customer-name").value = "";

document.getElementById("customer-phone").value = "";

document.getElementById("customer-name").focus();
}

function editCustomer(id) {

var customer = findCustomerById(id);

if (!customer) {
return;
}

editingCustomerId = id;

document.getElementById("customer-name").value = customer.name;
document.getElementById("customer-phone").value = customer.phone;

var title = document.getElementById("customer-form-title");
if (title) {
title.innerHTML = "تعديل عميل";
}

var addButton = document.getElementById("add-customer");
if (addButton) {
addButton.innerHTML = "تحديث العميل";
}

var cancelButton = document.getElementById("cancel-edit-customer");
if (cancelButton) {
cancelButton.style.display = "inline-block";
}

document.getElementById("customer-name").focus();
}

function cancelEditCustomer() {

editingCustomerId = null;

clearCustomerForm();

var title = document.getElementById("customer-form-title");
if (title) {
title.innerHTML = "إضافة عميل";
}

var addButton = document.getElementById("add-customer");
if (addButton) {
addButton.innerHTML = "إضافة العميل";
}

var cancelButton = document.getElementById("cancel-edit-customer");
if (cancelButton) {
cancelButton.style.display = "none";
}
}

/* =========================================
عرض العملاء
========================================= */

function displayCustomers() {

var table =
document.getElementById("customers-list");

if (!table) {
return;
}

table.innerHTML = "";

var shownCount = 0;

var searchElement =
document.getElementById("customer-search-input");

var search = "";

if (searchElement) {

search = searchElement.value;

search = search.toLowerCase();
}

var i;

for (i = 0; i < customers.length; i++) {

var customer = customers[i];

var name = customer.name.toLowerCase();

var phone = (customer.phone || "").toLowerCase();

if (
search != "" &&
name.indexOf(search) == -1 &&
phone.indexOf(search) == -1
) {

continue;
}

var row = document.createElement("tr");

var cell1 = document.createElement("td");
cell1.innerHTML = customer.id;

var cell2 = document.createElement("td");
cell2.innerHTML = customer.name;

var cell3 = document.createElement("td");
cell3.innerHTML = customer.phone;

var cell4 = document.createElement("td");
cell4.innerHTML = formatNumber(customer.debt) + " دج";

var cell5 = document.createElement("td");

var editButton = document.createElement("button");

editButton.innerHTML = "تعديل";

editButton.className = "btn-table btn-table-edit";

editButton.onclick = (function(id) {

return function() {

editCustomer(id);

};

})(customer.id);

cell5.appendChild(editButton);

var cell6 = document.createElement("td");

var deleteButton = document.createElement("button");

deleteButton.innerHTML = "حذف";

deleteButton.onclick = (function(id) {

return function() {

deleteCustomer(id);

};

})(customer.id);

cell6.appendChild(deleteButton);

row.appendChild(cell1);
row.appendChild(cell2);
row.appendChild(cell3);
row.appendChild(cell4);
row.appendChild(cell5);
row.appendChild(cell6);

table.appendChild(row);

shownCount++;
}

if (shownCount == 0) {

var message = "لا يوجد عملاء بعد. أضف عميلك الأول من النموذج أعلاه";

if (search != "") {
message = "لا توجد نتائج مطابقة للبحث";
}

showEmptyRow(table, 6, message);
}
}

/* =========================================
حذف عميل
========================================= */

function deleteCustomer(id) {

var customer = findCustomerById(id);

if (!customer) {
return;
}

var confirmMessage = "هل تريد حذف هذا العميل؟";

if (customer.debt > 0) {

confirmMessage =
"⚠ هذا العميل عليه دين قدره " +
formatNumber(customer.debt) +
" دج. حذفه سيفقد تسجيل هذا الدين نهائيًا.\n" +
"هل تريد الحذف رغم ذلك؟";
}

var answer =
confirm(confirmMessage);

if (!answer) {
return;
}

var newCustomers = [];

var i;

for (i = 0; i < customers.length; i++) {

if (customers[i].id != id) {

newCustomers.push(customers[i]);
}
}

customers = newCustomers;

saveCustomers();

if (editingCustomerId != null) {
cancelEditCustomer();
}

displayCustomers();

populateCustomerSelect();
}

/* =========================================
البحث عن عميل بالرقم
========================================= */

function findCustomerById(id) {

var i;

for (i = 0; i < customers.length; i++) {

if (customers[i].id == id) {

return customers[i];
}
}

return null;
}

/* =========================================
تعبئة قائمة اختيار العميل في الفاتورة
========================================= */

function populateCustomerSelect() {

var select =
document.getElementById("invoice-customer");

if (!select) {
return;
}

var currentValue = select.value;

select.innerHTML =
'<option value="">بدون عميل</option>';

var i;

for (i = 0; i < customers.length; i++) {

var option = document.createElement("option");

option.value = customers[i].id;

option.innerHTML = customers[i].name;

select.appendChild(option);
}

select.value = currentValue;
}

/* =========================================
تعبئة قائمة اختيار السلعة (منسدلة) في المبيعات والمشتريات
========================================= */

function populateProductSelect(selectId) {

var select = document.getElementById(selectId);

if (!select) {
return;
}

select.innerHTML =
'<option value="">-- اختر سلعة --</option>';

var i;

for (i = 0; i < products.length; i++) {

var product = products[i];

var option = document.createElement("option");

option.value = product.barcode;

option.innerHTML =
product.name + " (المخزون: " + product.stock + ")";

select.appendChild(option);
}
}

function refreshProductSelects() {

populateProductSelect("sale-product-select");

populateProductSelect("purchase-product-select");

populateBarcodeProductSelect();
}

/* =========================================
الأصناف - قائمة الأصناف المتاحة وتصفيتها
========================================= */

function getDistinctCategories() {

var categories = [];

var i;

for (i = 0; i < products.length; i++) {

var category = products[i].category || "بدون صنف";

if (categories.indexOf(category) == -1) {

categories.push(category);
}
}

categories.sort();

return categories;
}

function populateCategoryDatalist() {

var datalist = document.getElementById("category-options");

if (!datalist) {
return;
}

datalist.innerHTML = "";

var categories = getDistinctCategories();

var i;

for (i = 0; i < categories.length; i++) {

var option = document.createElement("option");

option.value = categories[i];

datalist.appendChild(option);
}
}

function fillCategorySelect(selectId) {

var select = document.getElementById(selectId);

if (!select) {
return;
}

var currentValue = select.value;

select.innerHTML = '<option value="">كل الأصناف</option>';

var categories = getDistinctCategories();

var i;

for (i = 0; i < categories.length; i++) {

var option = document.createElement("option");

option.value = categories[i];

option.innerHTML = categories[i];

select.appendChild(option);
}

select.value = currentValue;
}

function populateCategoryFilters() {

populateCategoryDatalist();

fillCategorySelect("product-category-filter");

fillCategorySelect("quick-sale-category-filter");

displayQuickSaleList();
}

/* =========================================
القائمة السريعة لإضافة سلعة للبيع بدون باركود
========================================= */

function displayQuickSaleList() {

var container = document.getElementById("quick-sale-list");

if (!container) {
return;
}

container.innerHTML = "";

var filterElement =
document.getElementById("quick-sale-category-filter");

var filter = filterElement ? filterElement.value : "";

var i;

var shown = 0;

for (i = 0; i < products.length; i++) {

var product = products[i];

var category = product.category || "بدون صنف";

if (filter != "" && category != filter) {
continue;
}

var item = document.createElement("div");

item.className = "quick-item";

if (product.stock <= 0) {
item.className = item.className + " quick-item-out";
}

var nameSpan = document.createElement("span");

nameSpan.className = "qi-name";

nameSpan.innerHTML = product.name;

var priceSpan = document.createElement("span");

priceSpan.className = "qi-price";

priceSpan.innerHTML =
formatNumber(product.salePrice) + " دج — مخزون: " + product.stock;

item.appendChild(nameSpan);
item.appendChild(priceSpan);

item.onclick = (function(selectedProduct) {

return function() {
addProductToSale(selectedProduct);
};

})(product);

container.appendChild(item);

shown++;
}

if (shown == 0) {

var emptyDiv = document.createElement("div");

emptyDiv.className = "search-result-empty";

emptyDiv.innerHTML = "لا توجد سلع في هذا الصنف";

container.appendChild(emptyDiv);
}
}

/* =========================================
البحث عن منتج بالباركود
========================================= */

function findProductByBarcode(barcode) {

var i;

for (i = 0; i < products.length; i++) {

if (products[i].barcode == barcode) {

return products[i];
}
}

return null;
}

/* =========================================
إضافة المنتج إلى الفاتورة
========================================= */

function addProductToSale(product) {

var i;

for (i = 0; i < saleItems.length; i++) {

if (
saleItems[i].barcode ==
product.barcode
) {

if (
saleItems[i].quantity >=
product.stock
) {

alert("الكمية الموجودة في المخزون غير كافية");

return;
}

saleItems[i].quantity++;

displaySale();

return;
}
}

if (product.stock <= 0) {

alert("هذا المنتج غير متوفر في المخزون");

return;
}

saleItems.push({

barcode: product.barcode,

name: product.name,

price: product.salePrice,

quantity: 1
});

displaySale();
}

/* =========================================
البحث عن منتج بالاسم (لمنتج بدون باركود)
========================================= */

function searchProductsByName() {

var input =
document.getElementById("product-name-search");

var results =
document.getElementById("product-search-results");

if (!input || !results) {
return;
}

var query = input.value;

query = query.replace(/^\s+|\s+$/g, "");

query = query.toLowerCase();

results.innerHTML = "";

if (query == "") {
return;
}

var matches = [];

var i;

for (i = 0; i < products.length; i++) {

var name = products[i].name.toLowerCase();

if (name.indexOf(query) != -1) {

matches.push(products[i]);
}
}

if (matches.length == 0) {

var emptyDiv = document.createElement("div");

emptyDiv.className = "search-result-empty";

emptyDiv.innerHTML = "لا يوجد منتج بهذا الاسم";

results.appendChild(emptyDiv);

return;
}

var shown = 0;

for (i = 0; i < matches.length; i++) {

if (shown >= 8) {
break;
}

var product = matches[i];

var item = document.createElement("div");

item.className = "search-result-item";

var nameSpan = document.createElement("span");

nameSpan.className = "sr-name";

nameSpan.innerHTML = product.name;

var metaSpan = document.createElement("span");

metaSpan.className = "sr-meta";

metaSpan.innerHTML =
"المخزون: " + product.stock +
" — " + formatNumber(product.salePrice) + " دج";

item.appendChild(nameSpan);
item.appendChild(metaSpan);

item.onclick = (function(selectedProduct) {

return function() {

addProductToSale(selectedProduct);

input.value = "";

results.innerHTML = "";

input.focus();

};

})(product);

results.appendChild(item);

shown++;
}
}

/* =========================================
تعديل كمية عنصر في الفاتورة
========================================= */

function updateSaleItemQuantity(index, value) {

var item = saleItems[index];

if (!item) {
return;
}

var newQuantity = Number(value);

if (isNaN(newQuantity) || newQuantity < 1) {

newQuantity = 1;
}

newQuantity = Math.floor(newQuantity);

var product = findProductByBarcode(item.barcode);

if (product && newQuantity > product.stock) {

alert(
"الكمية المتوفرة في المخزون: " + product.stock
);

newQuantity = product.stock;

if (newQuantity < 1) {
newQuantity = 1;
}
}

item.quantity = newQuantity;

displaySale();
}

/* =========================================
البحث بالباركود في الفاتورة
========================================= */

function searchProduct() {

var input =
document.getElementById("barcode");

if (!input) {
return;
}

var barcode = input.value;

barcode = barcode.replace(/^\s+|\s+$/g, "");

if (barcode == "") {

alert("أدخل الباركود أولًا");

return;
}

var product =
findProductByBarcode(barcode);

if (product == null) {

alert("المنتج غير موجود");

input.select();

return;
}

addProductToSale(product);

input.value = "";

input.focus();
}

/* =========================================
عرض الفاتورة
========================================= */

function displaySale() {

var table =
document.getElementById("sale-items");

if (!table) {
return;
}

table.innerHTML = "";

var total = 0;

var i;

for (i = 0; i < saleItems.length; i++) {

var item = saleItems[i];

var lineTotal =
item.quantity * item.price;

total = total + lineTotal;

var row =
document.createElement("tr");

var cell1 =
document.createElement("td");

cell1.innerHTML = i + 1;

var cell2 =
document.createElement("td");

cell2.innerHTML = item.barcode;

var cell3 =
document.createElement("td");

cell3.innerHTML = item.name;

var cell4 =
document.createElement("td");

var qtyInput =
document.createElement("input");

qtyInput.type = "text";

qtyInput.className = "qty-input";

qtyInput.value = item.quantity;

qtyInput.onchange = (function(index, inputEl) {

return function() {

updateSaleItemQuantity(index, inputEl.value);

};

})(i, qtyInput);

cell4.appendChild(qtyInput);

var cell5 =
document.createElement("td");

cell5.innerHTML =
formatNumber(item.price) + " دج";

var cell6 =
document.createElement("td");

cell6.innerHTML =
formatNumber(lineTotal) + " دج";

var cell7 =
document.createElement("td");

var button =
document.createElement("button");

button.innerHTML = "حذف";

button.onclick = (function(index) {

return function() {

deleteSaleItem(index);

};

})(i);

cell7.appendChild(button);

row.appendChild(cell1);
row.appendChild(cell2);
row.appendChild(cell3);
row.appendChild(cell4);
row.appendChild(cell5);
row.appendChild(cell6);
row.appendChild(cell7);

table.appendChild(row);
}

if (saleItems.length == 0) {

showEmptyRow(table, 7, "امسح أو أدخل باركود منتج للبدء بالفاتورة");
}

var totalElement =
document.getElementById("grand-total");

if (totalElement) {

totalElement.innerHTML =
formatNumber(total) + " دج";
}
}

/* =========================================
حذف منتج من الفاتورة
========================================= */

function deleteSaleItem(index) {

saleItems.splice(index, 1);

displaySale();
}

/* =========================================
فاتورة جديدة
========================================= */

function newInvoice() {

saleItems = [];

displaySale();

var barcode =
document.getElementById("barcode");

if (barcode) {

barcode.value = "";

barcode.focus();
}

var nameSearch =
document.getElementById("product-name-search");

var nameResults =
document.getElementById("product-search-results");

if (nameSearch) {
nameSearch.value = "";
}

if (nameResults) {
nameResults.innerHTML = "";
}
}

/* =========================================
إلغاء الفاتورة
========================================= */

function cancelInvoice() {

saleItems = [];

displaySale();

var barcode =
document.getElementById("barcode");

if (barcode) {

barcode.value = "";

barcode.focus();
}
}

/* =========================================
رقم الفاتورة التالي (تسلسل دائم لا يتكرر)
========================================= */

var invoiceSeq = 0;

function loadInvoiceSeq() {

var saved = localStorage.getItem("pos_invoice_seq");

if (saved) {

invoiceSeq = Number(saved);

if (isNaN(invoiceSeq)) {
invoiceSeq = 0;
}

} else {

/* توافق مع البيانات القديمة: ابدأ من أكبر رقم فاتورة موجود */

invoiceSeq = 0;

var i;

for (i = 0; i < invoices.length; i++) {

if (invoices[i].number > invoiceSeq) {
invoiceSeq = invoices[i].number;
}
}

localStorage.setItem("pos_invoice_seq", String(invoiceSeq));
}
}

function peekNextInvoiceNumber() {

return invoiceSeq + 1;
}

function consumeNextInvoiceNumber() {

invoiceSeq = invoiceSeq + 1;

localStorage.setItem("pos_invoice_seq", String(invoiceSeq));

return invoiceSeq;
}

function formatInvoiceNumber(number) {

var text = String(number);

while (text.length < 6) {
text = "0" + text;
}

return text;
}

function updateInvoiceNumberDisplay() {

var element =
document.getElementById("invoice-number");

if (!element) {
return;
}

element.innerHTML =
formatInvoiceNumber(peekNextInvoiceNumber());
}

/* =========================================
رقم Bon de Commande التالي (تسلسل مستقل عن الفواتير، لا يتكرر أبدًا)
========================================= */

var orderSeq = 0;

function loadOrderSeq() {

var saved = localStorage.getItem("pos_order_seq");

if (saved) {

orderSeq = Number(saved);

if (isNaN(orderSeq)) {
orderSeq = 0;
}

} else {

orderSeq = 0;

localStorage.setItem("pos_order_seq", "0");
}
}

function consumeNextOrderNumber() {

orderSeq = orderSeq + 1;

localStorage.setItem("pos_order_seq", String(orderSeq));

return orderSeq;
}

/* =========================================
حفظ الفاتورة
========================================= */

function saveInvoice() {

if (saleItems.length == 0) {

alert("الفاتورة فارغة");

return;
}

/* التأكد أن المخزون كافٍ لكل عنصر */

var i;

for (i = 0; i < saleItems.length; i++) {

var product = findProductByBarcode(saleItems[i].barcode);

if (!product || product.stock < saleItems[i].quantity) {

alert("الكمية غير كافية للمنتج: " + saleItems[i].name);

return;
}
}

/* حساب الإجمالي */

var subtotal = 0;

for (i = 0; i < saleItems.length; i++) {

subtotal = subtotal + (saleItems[i].quantity * saleItems[i].price);
}

/* قراءة التخفيض (الريمز) */

var discountInput =
document.getElementById("invoice-discount");

var discount = discountInput ? discountInput.value : "";

discount = discount.replace(/^\s+|\s+$/g, "");

if (discount == "") {
discount = 0;
} else {
discount = Number(discount);

if (isNaN(discount) || discount < 0) {

alert("قيمة التخفيض غير صحيحة");

return;
}
}

if (discount > subtotal) {
discount = subtotal;
}

var total = subtotal - discount;

/* قراءة المبلغ المدفوع */

var paidInput =
document.getElementById("invoice-paid");

var paid = paidInput ? paidInput.value : "";

paid = paid.replace(/^\s+|\s+$/g, "");

if (paid == "") {
paid = total;
} else {
paid = Number(paid);

if (isNaN(paid) || paid < 0) {

alert("المبلغ المدفوع غير صحيح");

return;
}
}

var change = 0;

if (paid > total) {

change = paid - total;
}

var remaining = total - paid;

if (remaining < 0) {
remaining = 0;
}

/* العميل المختار */

var customerSelect =
document.getElementById("invoice-customer");

var customerId = customerSelect ? customerSelect.value : "";

var customer = null;

if (customerId != "") {

customer = findCustomerById(Number(customerId));
}

if (remaining > 0 && !customer) {

alert("لتسجيل مبلغ متبقٍ (دين) يجب اختيار عميل أولًا");

return;
}

/* خصم الكميات من المخزون */

for (i = 0; i < saleItems.length; i++) {

var stockProduct = findProductByBarcode(saleItems[i].barcode);

stockProduct.stock =
stockProduct.stock - saleItems[i].quantity;
}

saveProducts();

/* تحديث دين العميل */

var previousDebt = customer ? customer.debt : 0;

if (customer && remaining > 0) {

customer.debt = customer.debt + remaining;

saveCustomers();
}

var newDebt = customer ? customer.debt : 0;

/* إنشاء سجل الفاتورة */

var invoice = {

number: consumeNextInvoiceNumber(),

date: new Date().toISOString(),

customerId: customer ? customer.id : null,

customerName: customer ? customer.name : "بدون عميل",

items: saleItems,

subtotal: subtotal,

discount: discount,

total: total,

paid: paid,

remaining: remaining,

change: change,

previousDebt: previousDebt,

newDebt: newDebt
};

invoices.push(invoice);

saveInvoices();

var savedMessage =
"تم حفظ الفاتورة رقم " + formatInvoiceNumber(invoice.number);

if (change > 0) {

savedMessage =
savedMessage +
"\nالفكة المستحقة للزبون: " + formatNumber(change) + " دج";
}

if (remaining > 0) {

savedMessage =
savedMessage +
"\nمبلغ مسجل كدين على " + invoice.customerName +
": " + formatNumber(remaining) + " دج";
}

alert(savedMessage);

/* عرض خيار الطباعة مباشرة ببيانات الفاتورة المحفوظة نفسها */

var wantsPrint =
confirm("هل تريد طباعة الفاتورة الآن؟");

if (wantsPrint) {

reprintInvoice(invoice.number);
}

/* إعادة تهيئة الفاتورة الحالية */

saleItems = [];

displaySale();

if (paidInput) {
paidInput.value = "";
}

if (discountInput) {
discountInput.value = "";
}

var barcodeInputField =
document.getElementById("barcode");

if (barcodeInputField) {

barcodeInputField.value = "";

barcodeInputField.focus();
}

displayProducts();

refreshProductSelects();

displayQuickSaleList();

displayCustomers();

populateCustomerSelect();

updateInvoiceNumberDisplay();

updateDashboard();

displayInventory();

displayPayments();

displayReports();
}

/* =========================================
لوحة التحكم
========================================= */

function isSameDay(dateA, dateB) {

return (
dateA.getFullYear() == dateB.getFullYear() &&
dateA.getMonth() == dateB.getMonth() &&
dateA.getDate() == dateB.getDate()
);
}

function updateDashboard() {

var today = new Date();

var todaySales = 0;

var todayInvoicesCount = 0;

var i;

for (i = 0; i < invoices.length; i++) {

var invoiceDate = new Date(invoices[i].date);

if (isSameDay(invoiceDate, today)) {

todaySales = todaySales + invoices[i].total;

todayInvoicesCount = todayInvoicesCount + 1;
}
}

var totalDebt = 0;

for (i = 0; i < customers.length; i++) {

totalDebt = totalDebt + customers[i].debt;
}

var salesElement =
document.getElementById("stat-today-sales");

if (salesElement) {
salesElement.innerHTML = formatNumber(todaySales) + " دج";
}

var invoicesElement =
document.getElementById("stat-invoices-count");

if (invoicesElement) {
invoicesElement.innerHTML = todayInvoicesCount;
}

var productsElement =
document.getElementById("stat-products-count");

if (productsElement) {
productsElement.innerHTML = products.length;
}

var debtElement =
document.getElementById("stat-customers-debt");

if (debtElement) {
debtElement.innerHTML = formatNumber(totalDebt) + " دج";
}
}

/* =========================================
المخزون
========================================= */

function displayInventory() {

var table =
document.getElementById("inventory-list");

if (!table) {
return;
}

table.innerHTML = "";

var i;

for (i = 0; i < products.length; i++) {

var product = products[i];

var row = document.createElement("tr");

var cell1 = document.createElement("td");
cell1.innerHTML = product.barcode;

var cell2 = document.createElement("td");
cell2.innerHTML = product.name;

var cell3 = document.createElement("td");
cell3.innerHTML = product.stock;

var cell4 = document.createElement("td");
cell4.innerHTML = product.minStock;

var cell5 = document.createElement("td");

if (product.stock <= product.minStock) {

cell5.innerHTML = "منخفض";

cell5.className = "stock-low";

} else {

cell5.innerHTML = "جيد";

cell5.className = "stock-ok";
}

row.appendChild(cell1);
row.appendChild(cell2);
row.appendChild(cell3);
row.appendChild(cell4);
row.appendChild(cell5);

table.appendChild(row);
}

if (products.length == 0) {

showEmptyRow(table, 5, "لا توجد منتجات في المخزون بعد");
}
}

/* =========================================
المدفوعات
========================================= */

function displayPayments() {

var table =
document.getElementById("payments-list");

if (!table) {
return;
}

table.innerHTML = "";

var i;

for (i = invoices.length - 1; i >= 0; i--) {

var invoice = invoices[i];

var row = document.createElement("tr");

var invoiceDate = new Date(invoice.date);

var dateText =
invoiceDate.getDate() + "/" +
(invoiceDate.getMonth() + 1) + "/" +
invoiceDate.getFullYear();

var cell1 = document.createElement("td");
cell1.innerHTML = formatInvoiceNumber(invoice.number);

var cell2 = document.createElement("td");
cell2.innerHTML = dateText;

var cell3 = document.createElement("td");
cell3.innerHTML = invoice.customerName;

var cell4 = document.createElement("td");
cell4.innerHTML = formatNumber(invoice.total) + " دج";

var cell5 = document.createElement("td");
cell5.innerHTML = formatNumber(invoice.paid) + " دج";

var cell6 = document.createElement("td");
cell6.innerHTML = formatNumber(invoice.remaining) + " دج";

var cell6b = document.createElement("td");
cell6b.innerHTML = formatNumber(invoice.change || 0) + " دج";

var cell7 = document.createElement("td");

var reprintButton = document.createElement("button");

reprintButton.innerHTML = "🖨 طباعة";

reprintButton.className = "btn-table btn-table-info";

reprintButton.onclick = (function(number) {

return function() {

reprintInvoice(number);

};

})(invoice.number);

cell7.appendChild(reprintButton);

row.appendChild(cell1);
row.appendChild(cell2);
row.appendChild(cell3);
row.appendChild(cell4);
row.appendChild(cell5);
row.appendChild(cell6);
row.appendChild(cell6b);
row.appendChild(cell7);

table.appendChild(row);
}

if (invoices.length == 0) {

showEmptyRow(table, 8, "لا توجد فواتير محفوظة بعد");
}
}

/* =========================================
التقارير
========================================= */

function displayReports() {

var totalSales = 0;

var i;

for (i = 0; i < invoices.length; i++) {

totalSales = totalSales + invoices[i].total;
}

var totalDebt = 0;

for (i = 0; i < customers.length; i++) {

totalDebt = totalDebt + customers[i].debt;
}

var salesElement =
document.getElementById("report-total-sales");

if (salesElement) {
salesElement.innerHTML = formatNumber(totalSales) + " دج";
}

var countElement =
document.getElementById("report-invoices-count");

if (countElement) {
countElement.innerHTML = invoices.length;
}

var debtElement =
document.getElementById("report-total-debt");

if (debtElement) {
debtElement.innerHTML = formatNumber(totalDebt) + " دج";
}
}

/* =========================================
التنقل بين الأقسام
========================================= */

function showSection(sectionId) {

var pages = document.getElementsByClassName("page");

var i;

for (i = 0; i < pages.length; i++) {

pages[i].className = "page";
}

var target = document.getElementById(sectionId);

if (target) {

target.className = "page active";
}

var buttons = document.getElementsByClassName("menu-btn");

for (i = 0; i < buttons.length; i++) {

buttons[i].className = "menu-btn";

if (buttons[i].getAttribute("data-section") == sectionId) {

buttons[i].className = "menu-btn active";
}
}

if (sectionId == "sales") {
updateInvoiceNumberDisplay();
}

if (sectionId == "purchases") {
updatePurchaseNumberDisplay();
displayPurchasesList();
populateSupplierSelect();
refreshProductSelects();
}

if (sectionId == "suppliers") {
displaySuppliers();
}

if (sectionId == "barcodes") {
populateBarcodeProductSelect();
displayBarcodeQueue();
}

if (sectionId == "settlements") {
populateSettleSelects();
displaySettlementsHistory();
}

if (sectionId == "barcodes") {
populateBarcodeProductSelect();
displayBarcodeQueue();
}

if (sectionId == "dashboard") {
updateDashboard();
}

if (sectionId == "inventory") {
displayInventory();
}

if (sectionId == "payments") {
displayPayments();
}

if (sectionId == "reports") {
displayReports();
}
}

function setupNavigation() {

var buttons = document.getElementsByClassName("menu-btn");

var i;

for (i = 0; i < buttons.length; i++) {

buttons[i].onclick = (function(button) {

return function() {

var sectionId = button.getAttribute("data-section");

showSection(sectionId);

};

})(buttons[i]);
}
}

/* =========================================
طباعة الفاتورة
========================================= */

function renderPrintArea(invoiceData) {

var invoiceView =
document.getElementById("print-invoice-view");

var statementView =
document.getElementById("print-statement-view");

var orderView =
document.getElementById("print-order-view");

var labelsView =
document.getElementById("print-labels-view");

if (invoiceView) {
invoiceView.style.display = "block";
}

if (statementView) {
statementView.style.display = "none";
}

if (orderView) {
orderView.style.display = "none";
}

if (labelsView) {
labelsView.style.display = "none";
}

var shopNameElement =
document.getElementById("print-shop-name");

if (shopNameElement) {

shopNameElement.innerHTML = settings.shopName;
}

var shopAddressElement =
document.getElementById("print-shop-address");

if (shopAddressElement) {

shopAddressElement.innerHTML =
settings.shopAddress ? settings.shopAddress : "";
}

var shopPhoneElement =
document.getElementById("print-shop-phone");

if (shopPhoneElement) {

shopPhoneElement.innerHTML =
settings.shopPhone ? "Tel : " + settings.shopPhone : "";
}

var shopRCElement =
document.getElementById("print-shop-rc");

if (shopRCElement) {

shopRCElement.innerHTML =
settings.shopRC ? "R.C.N° : " + settings.shopRC : "";
}

var shopArtElement =
document.getElementById("print-shop-art");

if (shopArtElement) {

shopArtElement.innerHTML =
settings.shopArt ? "Art.N° : " + settings.shopArt : "";
}

var badgeElement =
document.getElementById("print-doc-badge");

if (badgeElement) {

badgeElement.innerHTML =
invoiceData.docType == "order" ?
"BON DE<br>COMMANDE" : "FACTURE";
}

var partyLabel =
invoiceData.docType == "purchase" ? "المورد" : "السيد / العميل";

var dateNumberElement =
document.getElementById("print-date-number");

if (dateNumberElement) {

dateNumberElement.innerHTML =
"التاريخ: " + invoiceData.dateText +
" &nbsp;&nbsp; رقم: " + formatInvoiceNumber(invoiceData.number);
}

var partyElement =
document.getElementById("print-party");

if (partyElement) {

partyElement.innerHTML =
partyLabel + ": " + invoiceData.customerName;
}

var itemsBody =
document.getElementById("print-items");

itemsBody.innerHTML = "";

var i;

for (i = 0; i < invoiceData.items.length; i++) {

var item = invoiceData.items[i];

var lineTotal = item.quantity * item.price;

var row = document.createElement("tr");

var cellQty = document.createElement("td");
cellQty.innerHTML = item.quantity;

var cellName = document.createElement("td");
cellName.innerHTML = item.name;

var cellPrice = document.createElement("td");
cellPrice.innerHTML = formatNumber(item.price);

var cellTotal = document.createElement("td");
cellTotal.innerHTML = formatNumber(lineTotal);

row.appendChild(cellQty);
row.appendChild(cellName);
row.appendChild(cellPrice);
row.appendChild(cellTotal);

itemsBody.appendChild(row);
}

/* صفوف فارغة لملء الجدول بصريًا كما في النماذج المطبوعة */

var minRows = 10;

while (itemsBody.children.length < minRows) {

var blankRow = document.createElement("tr");

var c1 = document.createElement("td");
c1.innerHTML = "&nbsp;";

var c2 = document.createElement("td");
c2.innerHTML = "&nbsp;";

var c3 = document.createElement("td");
c3.innerHTML = "&nbsp;";

var c4 = document.createElement("td");
c4.innerHTML = "&nbsp;";

blankRow.appendChild(c1);
blankRow.appendChild(c2);
blankRow.appendChild(c3);
blankRow.appendChild(c4);

itemsBody.appendChild(blankRow);
}

var totalGeneralElement =
document.getElementById("print-total-general");

if (totalGeneralElement) {
totalGeneralElement.innerHTML =
formatNumber(invoiceData.subtotal != null ? invoiceData.subtotal : invoiceData.total) + " دج";
}

var remiseElement =
document.getElementById("print-remise");

if (remiseElement) {
remiseElement.innerHTML =
formatNumber(invoiceData.discount || 0) + " دج";
}

var ancienSoldeElement =
document.getElementById("print-ancien-solde");

if (ancienSoldeElement) {
ancienSoldeElement.innerHTML =
formatNumber(invoiceData.previousDebt || 0) + " دج";
}

var versementLabelElement =
document.getElementById("print-versement-label");

if (versementLabelElement) {
versementLabelElement.innerHTML = "Versement de jour";
}

var versementElement =
document.getElementById("print-versement");

if (versementElement) {
versementElement.innerHTML =
formatNumber(invoiceData.paid || 0) + " دج";
}

var soldeGlobalElement =
document.getElementById("print-solde-global");

if (soldeGlobalElement) {

soldeGlobalElement.innerHTML =
formatNumber(
invoiceData.newDebt != null ? invoiceData.newDebt : 0
) + " دج";
}

var noteElement =
document.getElementById("print-note");

if (noteElement) {
noteElement.innerHTML = settings.invoiceNote || "";
}

window.print();
}

/* =========================================
طباعة الفاتورة الحالية (قبل الحفظ)
========================================= */

function printBonDeCommande() {

if (saleItems.length == 0) {

alert("لا توجد سلع لإصدار Bon de Commande");

return;
}

var customerSelect =
document.getElementById("invoice-customer");

var customerText = "بدون عميل";

if (customerSelect && customerSelect.value != "") {

var selectedOption =
customerSelect.options[customerSelect.selectedIndex];

customerText = selectedOption.innerHTML;
}

var dateElement =
document.getElementById("invoice-date");

var subtotal = 0;

var i;

for (i = 0; i < saleItems.length; i++) {

subtotal = subtotal + (saleItems[i].quantity * saleItems[i].price);
}

renderBonDeCommandePrint({

number: consumeNextOrderNumber(),

dateText: dateElement ? dateElement.innerHTML : "",

customerName: customerText,

items: saleItems,

total: subtotal
});
}

function renderBonDeCommandePrint(data) {

var invoiceView =
document.getElementById("print-invoice-view");

var statementView =
document.getElementById("print-statement-view");

var labelsView =
document.getElementById("print-labels-view");

var orderView =
document.getElementById("print-order-view");

if (invoiceView) {
invoiceView.style.display = "none";
}

if (statementView) {
statementView.style.display = "none";
}

if (labelsView) {
labelsView.style.display = "none";
}

if (!orderView) {
return;
}

orderView.style.display = "block";

var html = "";

html = html + '<div class="fi-top-row">';

html = html + '<div class="fi-shop-box">';
html = html + '<h2>' + settings.shopName + '</h2>';

if (settings.shopAddress) {
html = html + '<div class="fi-shop-line">' + settings.shopAddress + '</div>';
}

if (settings.shopPhone) {
html = html + '<div class="fi-shop-line">Tel : ' + settings.shopPhone + '</div>';
}

if (settings.shopRC) {
html = html + '<div class="fi-shop-line">R.C.N° : ' + settings.shopRC + '</div>';
}

if (settings.shopArt) {
html = html + '<div class="fi-shop-line">Art.N° : ' + settings.shopArt + '</div>';
}

html = html + '</div>';

html = html + '<div class="fi-badge">BON DE<br>COMMANDE</div>';

html = html + '</div>';

html = html + '<div class="fi-meta-row">';
html = html + '<div>التاريخ: ' + data.dateText +
' &nbsp;&nbsp; رقم: ' + formatInvoiceNumber(data.number) + '</div>';
html = html + '<div>السيد / العميل: ' + data.customerName + '</div>';
html = html + '</div>';

html = html + '<table class="fi-table"><thead><tr>';
html = html + '<th>الكمية<br>Quantité</th>';
html = html + '<th>البيان<br>Désignation</th>';
html = html + '<th>سعر الوحدة<br>P.Unitaire</th>';
html = html + '<th>المجموع<br>Montant</th>';
html = html + '</tr></thead><tbody>';

for (i = 0; i < data.items.length; i++) {

var item = data.items[i];

var lineTotal = item.quantity * item.price;

html = html + '<tr>';
html = html + '<td>' + item.quantity + '</td>';
html = html + '<td>' + item.name + '</td>';
html = html + '<td>' + formatNumber(item.price) + '</td>';
html = html + '<td>' + formatNumber(lineTotal) + '</td>';
html = html + '</tr>';
}

var filledRows = data.items.length;

while (filledRows < 10) {

html = html + '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';

filledRows++;
}

html = html + '</tbody></table>';

html = html + '<div class="fi-totals-row"><table class="fi-totals-table" dir="ltr">';

html = html + '<tr class="fi-totals-net-row"><td>TOTAL</td><td>' +
formatNumber(data.total) + ' دج</td></tr>';

html = html + '</table></div>';

html = html + '<div class="fi-note">هذا مستند طلبية (Bon de Commande) وليس فاتورة نهائية — لا يُسجَّل كبيع ولا يُخصم من المخزون.</div>';

orderView.innerHTML = html;

window.print();
}

/* =========================================
طباعة فاتورة محفوظة سابقًا
========================================= */

function reprintInvoice(number) {

var i;

var found = null;

for (i = 0; i < invoices.length; i++) {

if (invoices[i].number == number) {

found = invoices[i];

break;
}
}

if (!found) {

alert("لم يتم العثور على هذه الفاتورة");

return;
}

var invoiceDate = new Date(found.date);

var dateText =
invoiceDate.getDate() + "/" +
(invoiceDate.getMonth() + 1) + "/" +
invoiceDate.getFullYear();

renderPrintArea({

number: found.number,

dateText: dateText,

customerName: found.customerName,

items: found.items,

subtotal: found.subtotal != null ? found.subtotal : found.total,

discount: found.discount || 0,

total: found.total,

paid: found.paid,

remaining: found.remaining,

change: found.change,

previousDebt: found.previousDebt || 0,

newDebt: found.newDebt || 0,

docType: "sale",

docTitle: "فاتورة بيع"
});
}

/* =========================================
الموردون - إضافة / تعديل
========================================= */

function addNewSupplier() {

var name = document.getElementById("supplier-name").value;
var phone = document.getElementById("supplier-phone").value;
var address = document.getElementById("supplier-address").value;

name = name.replace(/^\s+|\s+$/g, "");
phone = phone.replace(/^\s+|\s+$/g, "");
address = address.replace(/^\s+|\s+$/g, "");

if (name == "") {

alert("أدخل اسم المورد");

document.getElementById("supplier-name").focus();

return;
}

var i;

for (i = 0; i < suppliers.length; i++) {

if (suppliers[i].name.toLowerCase() == name.toLowerCase() && suppliers[i].id != editingSupplierId) {

alert("يوجد مورد مسجل بهذا الاسم مسبقًا");

document.getElementById("supplier-name").focus();

return;
}
}

if (editingSupplierId != null) {

var editedSupplier = null;

for (i = 0; i < suppliers.length; i++) {

if (suppliers[i].id == editingSupplierId) {
editedSupplier = suppliers[i];
break;
}
}

if (!editedSupplier) {

alert("تعذر العثور على المورد المطلوب تعديله");

cancelEditSupplier();

return;
}

editedSupplier.name = name;
editedSupplier.phone = phone;
editedSupplier.address = address;

saveSuppliers();

displaySuppliers();

populateSupplierSelect();

cancelEditSupplier();

alert("تم تحديث بيانات المورد بنجاح");

return;
}

var newId = 1;

for (i = 0; i < suppliers.length; i++) {

if (suppliers[i].id >= newId) {
newId = suppliers[i].id + 1;
}
}

var supplier = {

id: newId,

name: name,

phone: phone,

address: address,

debt: 0
};

suppliers.push(supplier);

saveSuppliers();

displaySuppliers();

populateSupplierSelect();

clearSupplierForm();

alert("تمت إضافة المورد بنجاح");
}

function clearSupplierForm() {

document.getElementById("supplier-name").value = "";
document.getElementById("supplier-phone").value = "";
document.getElementById("supplier-address").value = "";

document.getElementById("supplier-name").focus();
}

function editSupplier(id) {

var supplier = findSupplierById(id);

if (!supplier) {
return;
}

editingSupplierId = id;

document.getElementById("supplier-name").value = supplier.name;
document.getElementById("supplier-phone").value = supplier.phone;
document.getElementById("supplier-address").value = supplier.address;

var title = document.getElementById("supplier-form-title");
if (title) {
title.innerHTML = "تعديل مورد";
}

var addButton = document.getElementById("add-supplier");
if (addButton) {
addButton.innerHTML = "تحديث المورد";
}

var cancelButton = document.getElementById("cancel-edit-supplier");
if (cancelButton) {
cancelButton.style.display = "inline-block";
}

document.getElementById("supplier-name").focus();
}

function cancelEditSupplier() {

editingSupplierId = null;

clearSupplierForm();

var title = document.getElementById("supplier-form-title");
if (title) {
title.innerHTML = "إضافة مورد";
}

var addButton = document.getElementById("add-supplier");
if (addButton) {
addButton.innerHTML = "إضافة المورد";
}

var cancelButton = document.getElementById("cancel-edit-supplier");
if (cancelButton) {
cancelButton.style.display = "none";
}
}

function findSupplierById(id) {

var i;

for (i = 0; i < suppliers.length; i++) {

if (suppliers[i].id == id) {
return suppliers[i];
}
}

return null;
}

/* =========================================
عرض الموردين
========================================= */

function displaySuppliers() {

var table = document.getElementById("suppliers-list");

if (!table) {
return;
}

table.innerHTML = "";

var shownCount = 0;

var searchElement = document.getElementById("supplier-search-input");

var search = "";

if (searchElement) {
search = searchElement.value;
search = search.toLowerCase();
}

var i;

for (i = 0; i < suppliers.length; i++) {

var supplier = suppliers[i];

var name = supplier.name.toLowerCase();
var phone = (supplier.phone || "").toLowerCase();

if (
search != "" &&
name.indexOf(search) == -1 &&
phone.indexOf(search) == -1
) {
continue;
}

var row = document.createElement("tr");

var cell1 = document.createElement("td");
cell1.innerHTML = supplier.id;

var cell2 = document.createElement("td");
cell2.innerHTML = supplier.name;

var cell3 = document.createElement("td");
cell3.innerHTML = supplier.phone;

var cell4 = document.createElement("td");
cell4.innerHTML = supplier.address;

var cell5 = document.createElement("td");
cell5.innerHTML = formatNumber(supplier.debt) + " دج";

var cell6 = document.createElement("td");

var editButton = document.createElement("button");

editButton.innerHTML = "تعديل";

editButton.className = "btn-table btn-table-edit";

editButton.onclick = (function(id) {

return function() {
editSupplier(id);
};

})(supplier.id);

cell6.appendChild(editButton);

var cell7 = document.createElement("td");

var deleteButton = document.createElement("button");

deleteButton.innerHTML = "حذف";

deleteButton.onclick = (function(id) {

return function() {
deleteSupplier(id);
};

})(supplier.id);

cell7.appendChild(deleteButton);

row.appendChild(cell1);
row.appendChild(cell2);
row.appendChild(cell3);
row.appendChild(cell4);
row.appendChild(cell5);
row.appendChild(cell6);
row.appendChild(cell7);

table.appendChild(row);

shownCount++;
}

if (shownCount == 0) {

var message = "لا يوجد موردون بعد. أضف موردك الأول من النموذج أعلاه";

if (search != "") {
message = "لا توجد نتائج مطابقة للبحث";
}

showEmptyRow(table, 7, message);
}
}

function deleteSupplier(id) {

var supplier = findSupplierById(id);

if (!supplier) {
return;
}

var confirmMessage = "هل تريد حذف هذا المورد؟";

if (supplier.debt > 0) {

confirmMessage =
"⚠ يوجد دين مستحق لهذا المورد قدره " +
formatNumber(supplier.debt) +
" دج. حذفه سيفقد تسجيل هذا الدين نهائيًا.\n" +
"هل تريد الحذف رغم ذلك؟";
}

var answer = confirm(confirmMessage);

if (!answer) {
return;
}

var newSuppliers = [];

var i;

for (i = 0; i < suppliers.length; i++) {

if (suppliers[i].id != id) {
newSuppliers.push(suppliers[i]);
}
}

suppliers = newSuppliers;

saveSuppliers();

if (editingSupplierId != null) {
cancelEditSupplier();
}

displaySuppliers();

populateSupplierSelect();
}

function populateSupplierSelect() {

var select = document.getElementById("purchase-supplier");

if (!select) {
return;
}

var currentValue = select.value;

select.innerHTML = '<option value="">بدون مورد</option>';

var i;

for (i = 0; i < suppliers.length; i++) {

var option = document.createElement("option");

option.value = suppliers[i].id;

option.innerHTML = suppliers[i].name;

select.appendChild(option);
}

select.value = currentValue;
}

/* =========================================
إضافة سلعة إلى فاتورة الشراء
========================================= */

function addProductToPurchase(product) {

var i;

for (i = 0; i < purchaseItems.length; i++) {

if (purchaseItems[i].barcode == product.barcode) {

purchaseItems[i].quantity++;

displayPurchase();

return;
}
}

purchaseItems.push({

barcode: product.barcode,

name: product.name,

price: product.buyPrice,

quantity: 1
});

displayPurchase();
}

function searchProductForPurchase() {

var input = document.getElementById("purchase-barcode");

if (!input) {
return;
}

var barcode = input.value;

barcode = barcode.replace(/^\s+|\s+$/g, "");

if (barcode == "") {

alert("أدخل الباركود أولًا");

return;
}

var product = findProductByBarcode(barcode);

if (product == null) {

alert("السلعة غير موجودة، يمكنك إضافتها أولًا من شاشة السلع");

input.select();

return;
}

addProductToPurchase(product);

input.value = "";

input.focus();
}

/* =========================================
عرض فاتورة الشراء الحالية
========================================= */

function displayPurchase() {

var table = document.getElementById("purchase-items");

if (!table) {
return;
}

table.innerHTML = "";

var total = 0;

var i;

for (i = 0; i < purchaseItems.length; i++) {

var item = purchaseItems[i];

var lineTotal = item.quantity * item.price;

total = total + lineTotal;

var row = document.createElement("tr");

var cell1 = document.createElement("td");
cell1.innerHTML = i + 1;

var cell2 = document.createElement("td");
cell2.innerHTML = item.barcode;

var cell3 = document.createElement("td");
cell3.innerHTML = item.name;

var cell4 = document.createElement("td");

var qtyInput = document.createElement("input");

qtyInput.type = "text";
qtyInput.className = "qty-input";
qtyInput.value = item.quantity;

qtyInput.onchange = (function(index, inputEl) {

return function() {
updatePurchaseItemQuantity(index, inputEl.value);
};

})(i, qtyInput);

cell4.appendChild(qtyInput);

var cell5 = document.createElement("td");

var priceInput = document.createElement("input");

priceInput.type = "text";
priceInput.className = "qty-input";
priceInput.value = item.price;

priceInput.onchange = (function(index, inputEl) {

return function() {
updatePurchaseItemPrice(index, inputEl.value);
};

})(i, priceInput);

cell5.appendChild(priceInput);

var cell6 = document.createElement("td");
cell6.innerHTML = formatNumber(lineTotal) + " دج";

var cell7 = document.createElement("td");

var button = document.createElement("button");

button.innerHTML = "حذف";

button.onclick = (function(index) {

return function() {
deletePurchaseItem(index);
};

})(i);

cell7.appendChild(button);

row.appendChild(cell1);
row.appendChild(cell2);
row.appendChild(cell3);
row.appendChild(cell4);
row.appendChild(cell5);
row.appendChild(cell6);
row.appendChild(cell7);

table.appendChild(row);
}

if (purchaseItems.length == 0) {

showEmptyRow(table, 7, "اختر سلعة أو امسح باركودًا للبدء بفاتورة الشراء");
}

var totalElement = document.getElementById("purchase-grand-total");

if (totalElement) {
totalElement.innerHTML = formatNumber(total) + " دج";
}
}

function updatePurchaseItemQuantity(index, value) {

var item = purchaseItems[index];

if (!item) {
return;
}

var newQuantity = Number(value);

if (isNaN(newQuantity) || newQuantity < 1) {
newQuantity = 1;
}

newQuantity = Math.floor(newQuantity);

item.quantity = newQuantity;

displayPurchase();
}

function updatePurchaseItemPrice(index, value) {

var item = purchaseItems[index];

if (!item) {
return;
}

var newPrice = Number(value);

if (isNaN(newPrice) || newPrice < 0) {
newPrice = item.price;
}

item.price = newPrice;

displayPurchase();
}

function deletePurchaseItem(index) {

purchaseItems.splice(index, 1);

displayPurchase();
}

function newPurchaseInvoice() {

purchaseItems = [];

displayPurchase();

var barcode = document.getElementById("purchase-barcode");

if (barcode) {
barcode.value = "";
barcode.focus();
}
}

function cancelPurchaseInvoice() {

purchaseItems = [];

displayPurchase();

var barcode = document.getElementById("purchase-barcode");

if (barcode) {
barcode.value = "";
barcode.focus();
}
}

var purchaseSeq = 0;

function loadPurchaseSeq() {

var saved = localStorage.getItem("pos_purchase_seq");

if (saved) {

purchaseSeq = Number(saved);

if (isNaN(purchaseSeq)) {
purchaseSeq = 0;
}

} else {

purchaseSeq = 0;

var i;

for (i = 0; i < purchases.length; i++) {

if (purchases[i].number > purchaseSeq) {
purchaseSeq = purchases[i].number;
}
}

localStorage.setItem("pos_purchase_seq", String(purchaseSeq));
}
}

function peekNextPurchaseNumber() {

return purchaseSeq + 1;
}

function consumeNextPurchaseNumber() {

purchaseSeq = purchaseSeq + 1;

localStorage.setItem("pos_purchase_seq", String(purchaseSeq));

return purchaseSeq;
}

function updatePurchaseNumberDisplay() {

var element = document.getElementById("purchase-number");

if (!element) {
return;
}

element.innerHTML = formatInvoiceNumber(peekNextPurchaseNumber());
}

/* =========================================
حفظ فاتورة الشراء
========================================= */

function savePurchaseInvoice() {

if (purchaseItems.length == 0) {

alert("فاتورة الشراء فارغة");

return;
}

var total = 0;

var i;

for (i = 0; i < purchaseItems.length; i++) {

total = total + (purchaseItems[i].quantity * purchaseItems[i].price);
}

var paidInput = document.getElementById("purchase-paid");

var paid = paidInput ? paidInput.value : "";

paid = paid.replace(/^\s+|\s+$/g, "");

if (paid == "") {
paid = 0;
} else {
paid = Number(paid);

if (isNaN(paid) || paid < 0) {

alert("المبلغ المدفوع غير صحيح");

return;
}
}

var remaining = total - paid;

if (remaining < 0) {
remaining = 0;
}

var supplierSelect = document.getElementById("purchase-supplier");

var supplierId = supplierSelect ? supplierSelect.value : "";

var supplier = null;

if (supplierId != "") {
supplier = findSupplierById(Number(supplierId));
}

if (remaining > 0 && !supplier) {

alert("لتسجيل مبلغ متبقٍ (دين) يجب اختيار مورد أولًا");

return;
}

/* زيادة المخزون وتحديث سعر الشراء لكل سلعة */

for (i = 0; i < purchaseItems.length; i++) {

var stockProduct = findProductByBarcode(purchaseItems[i].barcode);

if (stockProduct) {

stockProduct.stock = stockProduct.stock + purchaseItems[i].quantity;

stockProduct.buyPrice = purchaseItems[i].price;
}
}

saveProducts();

var previousSupplierDebt = supplier ? supplier.debt : 0;

if (supplier && remaining > 0) {

supplier.debt = supplier.debt + remaining;

saveSuppliers();
}

var newSupplierDebt = supplier ? supplier.debt : 0;

var purchase = {

number: consumeNextPurchaseNumber(),

date: new Date().toISOString(),

supplierId: supplier ? supplier.id : null,

supplierName: supplier ? supplier.name : "بدون مورد",

items: purchaseItems,

total: total,

paid: paid,

remaining: remaining,

previousDebt: previousSupplierDebt,

newDebt: newSupplierDebt
};

purchases.push(purchase);

savePurchases();

var savedMessage =
"تم حفظ فاتورة الشراء رقم " + formatInvoiceNumber(purchase.number);

if (remaining > 0) {

savedMessage =
savedMessage +
"\nمبلغ مسجل كدين لـ " + purchase.supplierName +
": " + formatNumber(remaining) + " دج";
}

alert(savedMessage);

var wantsPrint = confirm("هل تريد طباعة فاتورة الشراء الآن؟");

if (wantsPrint) {
reprintPurchase(purchase.number);
}

purchaseItems = [];

displayPurchase();

if (paidInput) {
paidInput.value = "";
}

var barcodeField = document.getElementById("purchase-barcode");

if (barcodeField) {
barcodeField.value = "";
barcodeField.focus();
}

displayProducts();

refreshProductSelects();

displayQuickSaleList();

displaySuppliers();

populateSupplierSelect();

updatePurchaseNumberDisplay();

updateDashboard();

displayInventory();

displayPurchasesList();
}

/* =========================================
عرض سجل فواتير الشراء
========================================= */

function displayPurchasesList() {

var table = document.getElementById("purchases-list");

if (!table) {
return;
}

table.innerHTML = "";

var i;

for (i = purchases.length - 1; i >= 0; i--) {

var purchase = purchases[i];

var row = document.createElement("tr");

var purchaseDate = new Date(purchase.date);

var dateText =
purchaseDate.getDate() + "/" +
(purchaseDate.getMonth() + 1) + "/" +
purchaseDate.getFullYear();

var cell1 = document.createElement("td");
cell1.innerHTML = formatInvoiceNumber(purchase.number);

var cell2 = document.createElement("td");
cell2.innerHTML = dateText;

var cell3 = document.createElement("td");
cell3.innerHTML = purchase.supplierName;

var cell4 = document.createElement("td");
cell4.innerHTML = formatNumber(purchase.total) + " دج";

var cell5 = document.createElement("td");
cell5.innerHTML = formatNumber(purchase.paid) + " دج";

var cell6 = document.createElement("td");
cell6.innerHTML = formatNumber(purchase.remaining) + " دج";

var cell7 = document.createElement("td");

var reprintButton = document.createElement("button");

reprintButton.innerHTML = "🖨 طباعة";

reprintButton.className = "btn-table btn-table-info";

reprintButton.onclick = (function(number) {

return function() {
reprintPurchase(number);
};

})(purchase.number);

cell7.appendChild(reprintButton);

row.appendChild(cell1);
row.appendChild(cell2);
row.appendChild(cell3);
row.appendChild(cell4);
row.appendChild(cell5);
row.appendChild(cell6);
row.appendChild(cell7);

table.appendChild(row);
}

if (purchases.length == 0) {

showEmptyRow(table, 7, "لا توجد فواتير شراء محفوظة بعد");
}
}

/* =========================================
طباعة فاتورة شراء محفوظة
========================================= */

function reprintPurchase(number) {

var i;

var found = null;

for (i = 0; i < purchases.length; i++) {

if (purchases[i].number == number) {
found = purchases[i];
break;
}
}

if (!found) {

alert("لم يتم العثور على فاتورة الشراء هذه");

return;
}

var purchaseDate = new Date(found.date);

var dateText =
purchaseDate.getDate() + "/" +
(purchaseDate.getMonth() + 1) + "/" +
purchaseDate.getFullYear();

renderPrintArea({

number: found.number,

dateText: dateText,

customerName: found.supplierName,

items: found.items,

subtotal: found.total,

discount: 0,

total: found.total,

paid: found.paid,

remaining: found.remaining,

previousDebt: found.previousDebt || 0,

newDebt: found.newDebt || 0,

docType: "purchase",

docTitle: "فاتورة شراء"
});
}

/* =========================================
كشف حساب مجمّع للفواتير/فواتير الشراء المتأخرة
========================================= */

function renderStatementPrint(data) {

var invoiceView =
document.getElementById("print-invoice-view");

var statementView =
document.getElementById("print-statement-view");

var orderView =
document.getElementById("print-order-view");

var labelsView =
document.getElementById("print-labels-view");

if (invoiceView) {
invoiceView.style.display = "none";
}

if (orderView) {
orderView.style.display = "none";
}

if (labelsView) {
labelsView.style.display = "none";
}

if (!statementView) {
return;
}

statementView.style.display = "block";

var html = "";

html = html + '<div class="fi-top-row">';

html = html + '<div class="fi-shop-box">';
html = html + '<h2>' + settings.shopName + '</h2>';

if (settings.shopAddress) {
html = html + '<div class="fi-shop-line">' + settings.shopAddress + '</div>';
}

if (settings.shopPhone) {
html = html + '<div class="fi-shop-line">Tel : ' + settings.shopPhone + '</div>';
}

if (settings.shopRC) {
html = html + '<div class="fi-shop-line">R.C.N° : ' + settings.shopRC + '</div>';
}

if (settings.shopArt) {
html = html + '<div class="fi-shop-line">Art.N° : ' + settings.shopArt + '</div>';
}

html = html + '</div>';

html = html + '<div class="fi-badge">RELEVÉ<br>DE COMPTE</div>';

html = html + '</div>';

var todayText = document.getElementById("invoice-date")
? document.getElementById("invoice-date").innerHTML
: "";

html = html + '<div class="fi-meta-row">';
html = html + '<div>التاريخ: ' + todayText + '</div>';
html = html + '<div>' + data.partyLabel + ': ' + data.partyName + '</div>';
html = html + '</div>';

html = html + '<table class="fi-table"><thead><tr>';
html = html + '<th>رقم الفاتورة<br>N°</th>';
html = html + '<th>التاريخ<br>Date</th>';
html = html + '<th>الإجمالي<br>Total</th>';
html = html + '<th>المدفوع<br>Payé</th>';
html = html + '<th>المتبقي<br>Reste</th>';
html = html + '</tr></thead><tbody>';

var i;

for (i = 0; i < data.rows.length; i++) {

var row = data.rows[i];

html = html + '<tr>';
html = html + '<td>' + formatInvoiceNumber(row.number) + '</td>';
html = html + '<td>' + row.dateText + '</td>';
html = html + '<td>' + formatNumber(row.total) + '</td>';
html = html + '<td>' + formatNumber(row.paid) + '</td>';
html = html + '<td>' + formatNumber(row.remaining) + '</td>';
html = html + '</tr>';
}

html = html + '</tbody></table>';

html = html + '<div class="fi-totals-row"><table class="fi-totals-table">';

html = html + '<tr><td>إجمالي الفواتير</td><td>' +
formatNumber(data.totalAmount) + ' دج</td></tr>';

html = html + '<tr><td>إجمالي المدفوع</td><td>' +
formatNumber(data.totalPaid) + ' دج</td></tr>';

html = html + '<tr class="fi-totals-net-row"><td>المتبقي الإجمالي (الدين)</td><td>' +
formatNumber(data.totalRemaining) + ' دج</td></tr>';

html = html + '</table></div>';

html = html + '<div id="print-note" class="fi-note">' +
(settings.invoiceNote || "") + '</div>';

statementView.innerHTML = html;

window.print();
}

function printCustomerStatement() {

var select = document.getElementById("settle-customer-select");

var customerId = select ? select.value : "";

if (customerId == "") {

alert("اختر عميلًا أولًا");

return;
}

var customer = findCustomerById(Number(customerId));

if (!customer) {

alert("تعذر العثور على العميل");

return;
}

var rows = [];

var totalAmount = 0;

var totalPaid = 0;

var totalRemaining = 0;

var i;

for (i = 0; i < invoices.length; i++) {

var invoice = invoices[i];

if (invoice.customerId == customer.id && invoice.remaining > 0) {

var invoiceDate = new Date(invoice.date);

var dateText =
invoiceDate.getDate() + "/" +
(invoiceDate.getMonth() + 1) + "/" +
invoiceDate.getFullYear();

rows.push({
number: invoice.number,
dateText: dateText,
total: invoice.total,
paid: invoice.paid,
remaining: invoice.remaining
});

totalAmount = totalAmount + invoice.total;
totalPaid = totalPaid + invoice.paid;
totalRemaining = totalRemaining + invoice.remaining;
}
}

if (rows.length == 0) {

alert("لا توجد فواتير متأخرة (غير مسددة بالكامل) لهذا العميل");

return;
}

renderStatementPrint({

partyLabel: "السيد / العميل",

partyName: customer.name,

rows: rows,

totalAmount: totalAmount,

totalPaid: totalPaid,

totalRemaining: totalRemaining
});
}

function printSupplierStatement() {

var select = document.getElementById("settle-supplier-select");

var supplierId = select ? select.value : "";

if (supplierId == "") {

alert("اختر موردًا أولًا");

return;
}

var supplier = findSupplierById(Number(supplierId));

if (!supplier) {

alert("تعذر العثور على المورد");

return;
}

var rows = [];

var totalAmount = 0;

var totalPaid = 0;

var totalRemaining = 0;

var i;

for (i = 0; i < purchases.length; i++) {

var purchase = purchases[i];

if (purchase.supplierId == supplier.id && purchase.remaining > 0) {

var purchaseDate = new Date(purchase.date);

var dateText =
purchaseDate.getDate() + "/" +
(purchaseDate.getMonth() + 1) + "/" +
purchaseDate.getFullYear();

rows.push({
number: purchase.number,
dateText: dateText,
total: purchase.total,
paid: purchase.paid,
remaining: purchase.remaining
});

totalAmount = totalAmount + purchase.total;
totalPaid = totalPaid + purchase.paid;
totalRemaining = totalRemaining + purchase.remaining;
}
}

if (rows.length == 0) {

alert("لا توجد فواتير شراء متأخرة (غير مسددة بالكامل) لهذا المورد");

return;
}

renderStatementPrint({

partyLabel: "المورد",

partyName: supplier.name,

rows: rows,

totalAmount: totalAmount,

totalPaid: totalPaid,

totalRemaining: totalRemaining
});
}

/* =========================================
طباعة ملصقات الباركود
========================================= */

var barcodeQueue = [];

function populateBarcodeProductSelect() {

var select = document.getElementById("barcode-product-select");

if (!select) {
return;
}

select.innerHTML = '<option value="">-- اختر سلعة --</option>';

var i;

for (i = 0; i < products.length; i++) {

var product = products[i];

var option = document.createElement("option");

option.value = product.barcode;

option.innerHTML = product.name + " (" + product.barcode + ")";

select.appendChild(option);
}
}

function addToBarcodeQueue() {

var select = document.getElementById("barcode-product-select");

var barcode = select ? select.value : "";

if (barcode == "") {

alert("اختر سلعة أولًا");

return;
}

var product = findProductByBarcode(barcode);

if (!product) {

alert("تعذر العثور على السلعة");

return;
}

var qtyInput = document.getElementById("barcode-label-qty");

var qty = qtyInput ? Number(qtyInput.value) : 1;

if (isNaN(qty) || qty < 1) {
qty = 1;
}

qty = Math.floor(qty);

var i;

for (i = 0; i < barcodeQueue.length; i++) {

if (barcodeQueue[i].barcode == product.barcode) {

barcodeQueue[i].qty = barcodeQueue[i].qty + qty;

displayBarcodeQueue();

return;
}
}

barcodeQueue.push({

barcode: product.barcode,

name: product.name,

price: product.salePrice,

qty: qty
});

displayBarcodeQueue();
}

function removeBarcodeQueueItem(index) {

barcodeQueue.splice(index, 1);

displayBarcodeQueue();
}

function displayBarcodeQueue() {

var table = document.getElementById("barcode-queue-list");

if (!table) {
return;
}

table.innerHTML = "";

var i;

for (i = 0; i < barcodeQueue.length; i++) {

var item = barcodeQueue[i];

var row = document.createElement("tr");

var cell1 = document.createElement("td");
cell1.innerHTML = item.name;

var cell2 = document.createElement("td");
cell2.innerHTML = item.barcode;

var cell3 = document.createElement("td");
cell3.innerHTML = item.qty;

var cell4 = document.createElement("td");

var deleteButton = document.createElement("button");

deleteButton.innerHTML = "حذف";

deleteButton.onclick = (function(index) {

return function() {
removeBarcodeQueueItem(index);
};

})(i);

cell4.appendChild(deleteButton);

row.appendChild(cell1);
row.appendChild(cell2);
row.appendChild(cell3);
row.appendChild(cell4);

table.appendChild(row);
}

if (barcodeQueue.length == 0) {

showEmptyRow(table, 4, "القائمة فارغة، أضف سلعًا لطباعة ملصقاتها");
}
}

function clearBarcodeQueue() {

if (barcodeQueue.length == 0) {
return;
}

var answer = confirm("هل تريد تفريغ قائمة الطباعة؟");

if (!answer) {
return;
}

barcodeQueue = [];

displayBarcodeQueue();
}

function printBarcodeLabels() {

if (barcodeQueue.length == 0) {

alert("أضف سلعة واحدة على الأقل قبل الطباعة");

return;
}

if (typeof JsBarcode == "undefined") {

alert("تعذر تحميل مكتبة الباركود، تأكد من اتصالك بالإنترنت وحاول مجددًا");

return;
}

var invoiceView =
document.getElementById("print-invoice-view");

var statementView =
document.getElementById("print-statement-view");

var labelsView =
document.getElementById("print-labels-view");

var orderView =
document.getElementById("print-order-view");

if (invoiceView) {
invoiceView.style.display = "none";
}

if (statementView) {
statementView.style.display = "none";
}

if (orderView) {
orderView.style.display = "none";
}

if (!labelsView) {
return;
}

labelsView.innerHTML = "";

var svgCounter = 0;

var svgIds = [];

var i;
var j;

for (i = 0; i < barcodeQueue.length; i++) {

var item = barcodeQueue[i];

for (j = 0; j < item.qty; j++) {

svgCounter++;

var svgId = "barcode-svg-" + svgCounter;

svgIds.push({ id: svgId, value: item.barcode });

var labelDiv = document.createElement("div");

labelDiv.className = "barcode-label";

var nameDiv = document.createElement("div");
nameDiv.className = "bl-name";
nameDiv.innerHTML = item.name;

var svgEl = document.createElementNS(
"http://www.w3.org/2000/svg",
"svg"
);

svgEl.setAttribute("id", svgId);

var priceDiv = document.createElement("div");
priceDiv.className = "bl-price";
priceDiv.innerHTML = formatNumber(item.price) + " دج";

labelDiv.appendChild(nameDiv);
labelDiv.appendChild(svgEl);
labelDiv.appendChild(priceDiv);

labelsView.appendChild(labelDiv);
}
}

labelsView.style.display = "flex";

for (i = 0; i < svgIds.length; i++) {

try {

JsBarcode(
"#" + svgIds[i].id,
svgIds[i].value,
{
format: "CODE128",
displayValue: true,
fontSize: 12,
height: 40,
margin: 2
}
);

} catch (e) {

/* تجاهل السلع ذات باركود غير صالح لتنسيق CODE128 */
}
}

window.print();
}

/* =========================================
مسح الباركود بكاميرا الهاتف
========================================= */

var barcodeScanner = null;

var barcodeScanTargetId = null;

function openBarcodeScanner(targetInputId) {

barcodeScanTargetId = targetInputId;

var overlay = document.getElementById("scanner-overlay");

if (overlay) {
overlay.style.display = "flex";
}

if (typeof Html5Qrcode == "undefined") {

alert(
"تعذر تحميل مكتبة المسح بالكاميرا. تأكد من اتصالك بالإنترنت وأعد المحاولة."
);

closeBarcodeScanner();

return;
}

if (!window.isSecureContext) {

alert(
"المسح بالكاميرا يتطلب اتصالًا آمنًا (HTTPS). لن يعمل عند فتح الملف مباشرة من الجهاز."
);

closeBarcodeScanner();

return;
}

barcodeScanner = new Html5Qrcode("scanner-reader");

var config = {

fps: 10,

qrbox: { width: 260, height: 130 }
};

barcodeScanner.start(

{ facingMode: "environment" },

config,

function(decodedText) {

onBarcodeScanned(decodedText);
},

function() {

/* تجاهل أخطاء المحاولات الفاشلة في كل إطار */
}

).catch(function(err) {

alert("تعذر تشغيل الكاميرا: " + err);

closeBarcodeScanner();
});
}

function onBarcodeScanned(decodedText) {

var targetId = barcodeScanTargetId;

closeBarcodeScanner();

var input = document.getElementById(targetId);

if (input) {
input.value = decodedText;
}

if (targetId == "barcode") {

searchProduct();

} else if (targetId == "purchase-barcode") {

searchProductForPurchase();
}
}

function closeBarcodeScanner() {

var overlay = document.getElementById("scanner-overlay");

if (overlay) {
overlay.style.display = "none";
}

if (barcodeScanner) {

var scannerToStop = barcodeScanner;

barcodeScanner = null;

scannerToStop.stop().then(function() {

scannerToStop.clear();

}).catch(function() {

/* تجاهل، الكاميرا قد تكون متوقفة أصلًا */
});
}
}

/* =========================================
شاشة التسديدات - تعبئة القوائم
========================================= */

function populateSettleSelects() {

populateSettleCustomerSelect();

populateSettleSupplierSelect();

populateHistorySelects();
}

function populateHistorySelects() {

var customerSelect = document.getElementById("history-customer-select");

if (customerSelect) {

var currentCustomerValue = customerSelect.value;

customerSelect.innerHTML = '<option value="">-- اختر عميلًا --</option>';

var i;

for (i = 0; i < customers.length; i++) {

var option = document.createElement("option");

option.value = customers[i].id;

option.innerHTML = customers[i].name;

customerSelect.appendChild(option);
}

customerSelect.value = currentCustomerValue;
}

var supplierSelect = document.getElementById("history-supplier-select");

if (supplierSelect) {

var currentSupplierValue = supplierSelect.value;

supplierSelect.innerHTML = '<option value="">-- اختر موردًا --</option>';

var j;

for (j = 0; j < suppliers.length; j++) {

var supplierOption = document.createElement("option");

supplierOption.value = suppliers[j].id;

supplierOption.innerHTML = suppliers[j].name;

supplierSelect.appendChild(supplierOption);
}

supplierSelect.value = currentSupplierValue;
}
}

/* آخر طرف (عميل/مورد) تم عرض سجل فواتيره، لتحديث العرض تلقائيًا بعد أي تسديد */

var lastHistoryPartyShown = null;

function displayPartyInvoicesIfOpen() {

if (!lastHistoryPartyShown) {
return;
}

if (lastHistoryPartyShown.type == "customer") {
showCustomerHistory();
} else if (lastHistoryPartyShown.type == "supplier") {
showSupplierHistory();
}
}

function showCustomerHistory() {

var select = document.getElementById("history-customer-select");

var customerId = select ? select.value : "";

if (customerId == "") {

alert("اختر عميلًا أولًا");

return;
}

var customer = findCustomerById(Number(customerId));

if (!customer) {

alert("تعذر العثور على العميل");

return;
}

lastHistoryPartyShown = { type: "customer", id: customer.id };

var titleElement = document.getElementById("party-history-title");

if (titleElement) {

titleElement.innerHTML =
"فواتير العميل: " + customer.name +
" — إجمالي الدين الحالي: " + formatNumber(customer.debt) + " دج";
}

var customerInvoices = [];

var i;

for (i = 0; i < invoices.length; i++) {

if (invoices[i].customerId == customer.id) {
customerInvoices.push(invoices[i]);
}
}

customerInvoices.sort(function(a, b) {

return new Date(b.date) - new Date(a.date);
});

renderPartyHistoryTable(customerInvoices, "sale");
}

function showSupplierHistory() {

var select = document.getElementById("history-supplier-select");

var supplierId = select ? select.value : "";

if (supplierId == "") {

alert("اختر موردًا أولًا");

return;
}

var supplier = findSupplierById(Number(supplierId));

if (!supplier) {

alert("تعذر العثور على المورد");

return;
}

lastHistoryPartyShown = { type: "supplier", id: supplier.id };

var titleElement = document.getElementById("party-history-title");

if (titleElement) {

titleElement.innerHTML =
"فواتير شراء من المورد: " + supplier.name +
" — إجمالي الدين الحالي: " + formatNumber(supplier.debt) + " دج";
}

var supplierPurchases = [];

var i;

for (i = 0; i < purchases.length; i++) {

if (purchases[i].supplierId == supplier.id) {
supplierPurchases.push(purchases[i]);
}
}

supplierPurchases.sort(function(a, b) {

return new Date(b.date) - new Date(a.date);
});

renderPartyHistoryTable(supplierPurchases, "purchase");
}

function renderPartyHistoryTable(records, kind) {

var table = document.getElementById("party-history-list");

if (!table) {
return;
}

table.innerHTML = "";

var i;

for (i = 0; i < records.length; i++) {

var record = records[i];

var recordDate = new Date(record.date);

var dateText =
recordDate.getDate() + "/" +
(recordDate.getMonth() + 1) + "/" +
recordDate.getFullYear();

var row = document.createElement("tr");

var cell1 = document.createElement("td");
cell1.innerHTML = formatInvoiceNumber(record.number);

var cell2 = document.createElement("td");
cell2.innerHTML = dateText;

var cell3 = document.createElement("td");
cell3.innerHTML = formatNumber(record.total) + " دج";

var cell4 = document.createElement("td");
cell4.innerHTML = formatNumber(record.paid) + " دج";

var cell5 = document.createElement("td");
cell5.innerHTML = formatNumber(record.remaining) + " دج";

var cell6 = document.createElement("td");

var printButton = document.createElement("button");

printButton.innerHTML = "🖨";

printButton.className = "btn-table btn-table-info";

printButton.onclick = (function(number) {

return function() {

if (kind == "sale") {
reprintInvoice(number);
} else {
reprintPurchase(number);
}
};

})(record.number);

cell6.appendChild(printButton);

row.appendChild(cell1);
row.appendChild(cell2);
row.appendChild(cell3);
row.appendChild(cell4);
row.appendChild(cell5);
row.appendChild(cell6);

table.appendChild(row);
}

if (records.length == 0) {

showEmptyRow(table, 6, "لا توجد فواتير بعد لهذا الطرف");
}
}

function populateSettleCustomerSelect() {

var select = document.getElementById("settle-customer-select");

if (!select) {
return;
}

select.innerHTML = '<option value="">-- اختر عميلًا --</option>';

var i;

for (i = 0; i < customers.length; i++) {

if (customers[i].debt > 0) {

var option = document.createElement("option");

option.value = customers[i].id;

option.innerHTML =
customers[i].name + " (دين: " + formatNumber(customers[i].debt) + " دج)";

select.appendChild(option);
}
}

var debtField = document.getElementById("settle-customer-debt");

if (debtField) {
debtField.value = "";
}

var amountField = document.getElementById("settle-customer-amount");

if (amountField) {
amountField.value = "";
}
}

function populateSettleSupplierSelect() {

var select = document.getElementById("settle-supplier-select");

if (!select) {
return;
}

select.innerHTML = '<option value="">-- اختر موردًا --</option>';

var i;

for (i = 0; i < suppliers.length; i++) {

if (suppliers[i].debt > 0) {

var option = document.createElement("option");

option.value = suppliers[i].id;

option.innerHTML =
suppliers[i].name + " (دين: " + formatNumber(suppliers[i].debt) + " دج)";

select.appendChild(option);
}
}

var debtField = document.getElementById("settle-supplier-debt");

if (debtField) {
debtField.value = "";
}

var amountField = document.getElementById("settle-supplier-amount");

if (amountField) {
amountField.value = "";
}
}

/* =========================================
تسديد دين عميل
========================================= */

function payCustomerDebt() {

var select = document.getElementById("settle-customer-select");

var customerId = select ? select.value : "";

if (customerId == "") {

alert("اختر عميلًا أولًا");

return;
}

var customer = findCustomerById(Number(customerId));

if (!customer) {

alert("تعذر العثور على العميل");

return;
}

var amountInput = document.getElementById("settle-customer-amount");

var amount = amountInput ? amountInput.value : "";

amount = Number(amount);

if (isNaN(amount) || amount <= 0) {

alert("أدخل مبلغًا صحيحًا أكبر من صفر");

return;
}

if (amount > customer.debt) {

alert(
"المبلغ المدخل أكبر من الدين المستحق (" +
formatNumber(customer.debt) + " دج)"
);

return;
}

customer.debt = customer.debt - amount;

saveCustomers();

/* توزيع المبلغ المدفوع على فواتير العميل غير المسددة (الأقدم أولًا) */

var unpaidInvoices = [];

var i;

for (i = 0; i < invoices.length; i++) {

if (invoices[i].customerId == customer.id && invoices[i].remaining > 0) {

unpaidInvoices.push(invoices[i]);
}
}

unpaidInvoices.sort(function(a, b) {

return new Date(a.date) - new Date(b.date);
});

var amountLeft = amount;

for (i = 0; i < unpaidInvoices.length; i++) {

if (amountLeft <= 0) {
break;
}

var invoice = unpaidInvoices[i];

var applied = Math.min(invoice.remaining, amountLeft);

invoice.remaining = invoice.remaining - applied;

invoice.paid = invoice.paid + applied;

amountLeft = amountLeft - applied;
}

saveInvoices();

var payment = {

date: new Date().toISOString(),

type: "customer",

partyName: customer.name,

amount: amount
};

debtPayments.push(payment);

saveDebtPayments();

alert("تم تسديد " + formatNumber(amount) + " دج من دين " + customer.name);

displayCustomers();

populateCustomerSelect();

populateSettleCustomerSelect();

displaySettlementsHistory();

updateDashboard();

displayReports();

displayPartyInvoicesIfOpen();
}

function paySupplierDebt() {

var select = document.getElementById("settle-supplier-select");

var supplierId = select ? select.value : "";

if (supplierId == "") {

alert("اختر موردًا أولًا");

return;
}

var supplier = findSupplierById(Number(supplierId));

if (!supplier) {

alert("تعذر العثور على المورد");

return;
}

var amountInput = document.getElementById("settle-supplier-amount");

var amount = amountInput ? amountInput.value : "";

amount = Number(amount);

if (isNaN(amount) || amount <= 0) {

alert("أدخل مبلغًا صحيحًا أكبر من صفر");

return;
}

if (amount > supplier.debt) {

alert(
"المبلغ المدخل أكبر من الدين المستحق (" +
formatNumber(supplier.debt) + " دج)"
);

return;
}

supplier.debt = supplier.debt - amount;

saveSuppliers();

/* توزيع المبلغ المدفوع على فواتير الشراء غير المسددة (الأقدم أولًا) */

var unpaidPurchases = [];

var i;

for (i = 0; i < purchases.length; i++) {

if (purchases[i].supplierId == supplier.id && purchases[i].remaining > 0) {

unpaidPurchases.push(purchases[i]);
}
}

unpaidPurchases.sort(function(a, b) {

return new Date(a.date) - new Date(b.date);
});

var amountLeft = amount;

for (i = 0; i < unpaidPurchases.length; i++) {

if (amountLeft <= 0) {
break;
}

var purchase = unpaidPurchases[i];

var applied = Math.min(purchase.remaining, amountLeft);

purchase.remaining = purchase.remaining - applied;

purchase.paid = purchase.paid + applied;

amountLeft = amountLeft - applied;
}

savePurchases();

var payment = {

date: new Date().toISOString(),

type: "supplier",

partyName: supplier.name,

amount: amount
};

debtPayments.push(payment);

saveDebtPayments();

alert("تم تسديد " + formatNumber(amount) + " دج من دين " + supplier.name);

displaySuppliers();

populateSupplierSelect();

populateSettleSupplierSelect();

displaySettlementsHistory();

displayPurchasesList();

displayPartyInvoicesIfOpen();
}

function displaySettlementsHistory() {

var table = document.getElementById("settlements-list");

if (!table) {
return;
}

table.innerHTML = "";

var i;

for (i = debtPayments.length - 1; i >= 0; i--) {

var payment = debtPayments[i];

var paymentDate = new Date(payment.date);

var dateText =
paymentDate.getDate() + "/" +
(paymentDate.getMonth() + 1) + "/" +
paymentDate.getFullYear();

var row = document.createElement("tr");

var cell1 = document.createElement("td");
cell1.innerHTML = dateText;

var cell2 = document.createElement("td");
cell2.innerHTML = payment.type == "customer" ? "دين عميل" : "دين مورد";

var cell3 = document.createElement("td");
cell3.innerHTML = payment.partyName;

var cell4 = document.createElement("td");
cell4.innerHTML = formatNumber(payment.amount) + " دج";

row.appendChild(cell1);
row.appendChild(cell2);
row.appendChild(cell3);
row.appendChild(cell4);

table.appendChild(row);
}

if (debtPayments.length == 0) {

showEmptyRow(table, 4, "لا توجد تسديدات مسجلة بعد");
}
}

/* =========================================
النسخة الاحتياطية - تصدير كل البيانات إلى ملف
========================================= */

function exportBackup() {

var backup = {

products: products,

customers: customers,

invoices: invoices,

suppliers: suppliers,

purchases: purchases,

debtPayments: debtPayments,

settings: settings,

invoiceSeq: invoiceSeq,

purchaseSeq: purchaseSeq,

orderSeq: orderSeq,

exportDate: new Date().toISOString()
};

var dataText = JSON.stringify(backup, null, 2);

var blob = new Blob([dataText], { type: "application/json" });

var url = URL.createObjectURL(blob);

var today = new Date();

var day = today.getDate();
var month = today.getMonth() + 1;
var year = today.getFullYear();

if (day < 10) {
day = "0" + day;
}

if (month < 10) {
month = "0" + month;
}

var fileName =
"نسخة_احتياطية_" + year + "-" + month + "-" + day + ".json";

var link = document.createElement("a");

link.href = url;

link.download = fileName;

document.body.appendChild(link);

link.click();

document.body.removeChild(link);

URL.revokeObjectURL(url);
}

/* =========================================
النسخة الاحتياطية - استيراد البيانات من ملف
========================================= */

function importBackupFile(file) {

if (!file) {
return;
}

var reader = new FileReader();

reader.onload = function(event) {

var data;

try {

data = JSON.parse(event.target.result);

} catch (e) {

alert("ملف النسخة الاحتياطية غير صالح أو تالف");

return;
}

var answer = confirm(
"سيتم استبدال كل البيانات الحالية (السلع، العملاء، الموردين، الفواتير...) " +
"بالبيانات الموجودة في هذا الملف. هل تريد المتابعة؟"
);

if (!answer) {
return;
}

products = data.products || [];
customers = data.customers || [];
invoices = data.invoices || [];
suppliers = data.suppliers || [];
purchases = data.purchases || [];
debtPayments = data.debtPayments || [];

if (data.settings) {
settings = data.settings;
if (!settings.shopAddress) settings.shopAddress = "";
if (!settings.shopPhone) settings.shopPhone = "";
}

saveProducts();
saveCustomers();
saveInvoices();
saveSuppliers();
savePurchases();
saveDebtPayments();
saveSettings();

/* إعادة ضبط التسلسلات الدائمة لتتوافق مع البيانات المستوردة */

localStorage.removeItem("pos_invoice_seq");
localStorage.removeItem("pos_purchase_seq");

if (data.invoiceSeq != null) {
localStorage.setItem("pos_invoice_seq", String(data.invoiceSeq));
}

if (data.purchaseSeq != null) {
localStorage.setItem("pos_purchase_seq", String(data.purchaseSeq));
}

if (data.orderSeq != null) {
localStorage.setItem("pos_order_seq", String(data.orderSeq));
}

alert("تم استيراد النسخة الاحتياطية بنجاح، سيتم إعادة تحميل الصفحة الآن");

location.reload();
};

reader.readAsText(file, "UTF-8");
}

/* =========================================
التحقق من إمكانية الحفظ المحلي (localStorage)
========================================= */

function checkStorageAvailability() {

var isOk = true;

try {

var testKey = "pos_storage_test";

localStorage.setItem(testKey, "1");

var value = localStorage.getItem(testKey);

localStorage.removeItem(testKey);

if (value != "1") {
isOk = false;
}

} catch (e) {

isOk = false;
}

if (!isOk) {

alert(
"⚠ تنبيه هام:\n" +
"هذا المتصفح لا يسمح بحفظ البيانات محليًا في وضعه الحالي " +
"(قد يكون السبب التصفح الخاص/المتخفي، أو إعدادات تمنع تخزين ملفات الموقع، " +
"أو فتح الملف مباشرة بطريقة تمنع الحفظ).\n\n" +
"ستُفقد جميع البيانات عند إغلاق الصفحة.\n" +
"يُنصح بشدة بأخذ نسخة احتياطية بزر 'نسخة احتياطية' في الأعلى بعد كل جلسة عمل، " +
"وتشغيل التطبيق دائمًا من نفس المتصفح ونفس مكان الملف دون تفعيل التصفح الخاص."
);
}

return isOk;
}

/* =========================================
تشغيل البرنامج
========================================= */

checkStorageAvailability();

loadProducts();

loadCustomers();

loadInvoices();

loadInvoiceSeq();

loadOrderSeq();

loadSuppliers();

loadPurchases();

loadPurchaseSeq();

loadDebtPayments();

loadSettings();

showDate();

displayProducts();

displaySale();

displayPurchase();

displayCustomers();

displaySuppliers();

populateCustomerSelect();

populateSupplierSelect();

refreshProductSelects();

populateCategoryFilters();

populateBarcodeProductSelect();

populateSettleSelects();

displaySettlementsHistory();

updateInvoiceNumberDisplay();

updatePurchaseNumberDisplay();

updateDashboard();

displayInventory();

displayPayments();

displayPurchasesList();

displayReports();

setupNavigation();

/* عرض اسم المحل */

var shopNameElement =
document.getElementsByClassName("shop-name")[0];

if (shopNameElement) {

shopNameElement.innerHTML = settings.shopName;
}

var shopNameInput =
document.getElementById("shop-name-input");

if (shopNameInput) {

shopNameInput.value = settings.shopName;
}

var shopAddressInput =
document.getElementById("shop-address-input");

if (shopAddressInput) {

shopAddressInput.value = settings.shopAddress;
}

var shopPhoneInput =
document.getElementById("shop-phone-input");

if (shopPhoneInput) {

shopPhoneInput.value = settings.shopPhone;
}

var shopRCInput =
document.getElementById("shop-rc-input");

if (shopRCInput) {

shopRCInput.value = settings.shopRC;
}

var shopArtInput =
document.getElementById("shop-art-input");

if (shopArtInput) {

shopArtInput.value = settings.shopArt;
}

var shopNoteInput =
document.getElementById("shop-note-input");

if (shopNoteInput) {

shopNoteInput.value = settings.invoiceNote;
}

/* زر إضافة منتج */

var addProductButton =
document.getElementById("add-product");

if (addProductButton) {

addProductButton.onclick =
function() {

addNewProduct();

};
}

/* البحث في المنتجات */

var productSearch =
document.getElementById(
"product-search-input"
);

if (productSearch) {

productSearch.onkeyup =
function() {

displayProducts();

};
}

/* تصفية السلع حسب الصنف */

var productCategoryFilter =
document.getElementById("product-category-filter");

if (productCategoryFilter) {

productCategoryFilter.onchange =
function() {

displayProducts();

};
}

/* تصفية القائمة السريعة حسب الصنف */

var quickSaleCategoryFilter =
document.getElementById("quick-sale-category-filter");

if (quickSaleCategoryFilter) {

quickSaleCategoryFilter.onchange =
function() {

displayQuickSaleList();

};
}

/* زر البحث بالباركود */

var barcodeSearch =
document.getElementById(
"barcode-search"
);

if (barcodeSearch) {

barcodeSearch.onclick =
function() {

searchProduct();

};
}

/* الضغط على Enter في الباركود */

var barcodeInput =
document.getElementById("barcode");

if (barcodeInput) {

barcodeInput.onkeydown =
function(event) {

if (event.keyCode == 13) {

searchProduct();

}

};
}

/* البحث بالاسم لإضافة منتج للفاتورة */

var productNameSearch =
document.getElementById("product-name-search");

if (productNameSearch) {

productNameSearch.onkeyup =
function() {

searchProductsByName();

};
}

/* فاتورة جديدة */

var newInvoiceButton =
document.getElementById("new-invoice");

if (newInvoiceButton) {

newInvoiceButton.onclick =
function() {

newInvoice();

};
}

/* حفظ الفاتورة */

var saveInvoiceButton =
document.getElementById("save-invoice");

if (saveInvoiceButton) {

saveInvoiceButton.onclick =
function() {

saveInvoice();

};
}

/* طباعة الفاتورة */

var printInvoiceButton =
document.getElementById("print-invoice");

if (printInvoiceButton) {

printInvoiceButton.onclick =
function() {

printBonDeCommande();

};
}

/* إلغاء الفاتورة */

var cancelInvoiceButton =
document.getElementById("cancel-invoice");

if (cancelInvoiceButton) {

cancelInvoiceButton.onclick =
function() {

cancelInvoice();

};
}

/* زر إضافة عميل */

var addCustomerButton =
document.getElementById("add-customer");

if (addCustomerButton) {

addCustomerButton.onclick =
function() {

addNewCustomer();

};
}

/* البحث في العملاء */

var customerSearch =
document.getElementById(
"customer-search-input"
);

if (customerSearch) {

customerSearch.onkeyup =
function() {

displayCustomers();

};
}

/* حفظ اسم المحل */

var saveShopNameButton =
document.getElementById("save-shop-name");

if (saveShopNameButton) {

saveShopNameButton.onclick =
function() {

var input =
document.getElementById("shop-name-input");

var value = input.value;

value = value.replace(/^\s+|\s+$/g, "");

if (value == "") {

alert("أدخل اسم المحل");

return;
}

settings.shopName = value;

var addressInput =
document.getElementById("shop-address-input");

var phoneInput =
document.getElementById("shop-phone-input");

settings.shopAddress = addressInput ? addressInput.value : "";

settings.shopPhone = phoneInput ? phoneInput.value : "";

var rcInput = document.getElementById("shop-rc-input");

var artInput = document.getElementById("shop-art-input");

var noteInput = document.getElementById("shop-note-input");

settings.shopRC = rcInput ? rcInput.value : "";

settings.shopArt = artInput ? artInput.value : "";

settings.invoiceNote = noteInput ? noteInput.value : "";

saveSettings();

var shopNameElement =
document.getElementsByClassName("shop-name")[0];

if (shopNameElement) {

shopNameElement.innerHTML = settings.shopName;
}

alert("تم حفظ بيانات المحل");

};
}

/* زر إضافة مورد */

var addSupplierButton =
document.getElementById("add-supplier");

if (addSupplierButton) {

addSupplierButton.onclick =
function() {

addNewSupplier();

};
}

/* إلغاء تعديل مورد */

var cancelEditSupplierButton =
document.getElementById("cancel-edit-supplier");

if (cancelEditSupplierButton) {

cancelEditSupplierButton.onclick =
function() {

cancelEditSupplier();

};
}

/* البحث في الموردين */

var supplierSearch =
document.getElementById("supplier-search-input");

if (supplierSearch) {

supplierSearch.onkeyup =
function() {

displaySuppliers();

};
}

/* إلغاء تعديل سلعة */

var cancelEditProductButton =
document.getElementById("cancel-edit-product");

if (cancelEditProductButton) {

cancelEditProductButton.onclick =
function() {

cancelEditProduct();

};
}

/* إلغاء تعديل عميل */

var cancelEditCustomerButton =
document.getElementById("cancel-edit-customer");

if (cancelEditCustomerButton) {

cancelEditCustomerButton.onclick =
function() {

cancelEditCustomer();

};
}

/* اختيار سلعة من القائمة المنسدلة في المبيعات */

var saleProductSelect =
document.getElementById("sale-product-select");

if (saleProductSelect) {

saleProductSelect.onchange =
function() {

var barcode = saleProductSelect.value;

if (barcode == "") {
return;
}

var product = findProductByBarcode(barcode);

if (product) {

addProductToSale(product);
}

saleProductSelect.value = "";
};
}

/* اختيار سلعة من القائمة المنسدلة في المشتريات */

var purchaseProductSelect =
document.getElementById("purchase-product-select");

if (purchaseProductSelect) {

purchaseProductSelect.onchange =
function() {

var barcode = purchaseProductSelect.value;

if (barcode == "") {
return;
}

var product = findProductByBarcode(barcode);

if (product) {

addProductToPurchase(product);
}

purchaseProductSelect.value = "";
};
}

/* زر البحث بالباركود في المشتريات */

var purchaseBarcodeSearch =
document.getElementById("purchase-barcode-search");

if (purchaseBarcodeSearch) {

purchaseBarcodeSearch.onclick =
function() {

searchProductForPurchase();

};
}

/* زر دفع المبلغ بالكامل في فاتورة الشراء */

var purchasePaidFullBtn =
document.getElementById("purchase-paid-full-btn");

if (purchasePaidFullBtn) {

purchasePaidFullBtn.onclick =
function() {

var total = 0;

var i;

for (i = 0; i < purchaseItems.length; i++) {

total = total + (purchaseItems[i].quantity * purchaseItems[i].price);
}

var paidField = document.getElementById("purchase-paid");

if (paidField) {
paidField.value = total;
}
};
}

/* الضغط على Enter في باركود الشراء */

var purchaseBarcodeInput =
document.getElementById("purchase-barcode");

if (purchaseBarcodeInput) {

purchaseBarcodeInput.onkeydown =
function(event) {

if (event.keyCode == 13) {

searchProductForPurchase();

}

};
}

/* فاتورة شراء جديدة */

var newPurchaseButton =
document.getElementById("new-purchase");

if (newPurchaseButton) {

newPurchaseButton.onclick =
function() {

newPurchaseInvoice();

};
}

/* حفظ فاتورة الشراء */

var savePurchaseButton =
document.getElementById("save-purchase");

if (savePurchaseButton) {

savePurchaseButton.onclick =
function() {

savePurchaseInvoice();

};
}

/* إلغاء فاتورة الشراء */

var cancelPurchaseButton =
document.getElementById("cancel-purchase");

if (cancelPurchaseButton) {

cancelPurchaseButton.onclick =
function() {

cancelPurchaseInvoice();

};
}

/* عرض دين العميل المختار في شاشة التسديدات */

var settleCustomerSelect =
document.getElementById("settle-customer-select");

if (settleCustomerSelect) {

settleCustomerSelect.onchange =
function() {

var debtField = document.getElementById("settle-customer-debt");

if (!debtField) {
return;
}

if (settleCustomerSelect.value == "") {

debtField.value = "";

return;
}

var customer = findCustomerById(Number(settleCustomerSelect.value));

debtField.value = customer ? formatNumber(customer.debt) : "";

};
}

/* زر تسديد دين عميل */

var settleCustomerButton =
document.getElementById("settle-customer-btn");

if (settleCustomerButton) {

settleCustomerButton.onclick =
function() {

payCustomerDebt();

};
}

/* عرض دين المورد المختار في شاشة التسديدات */

var settleSupplierSelect =
document.getElementById("settle-supplier-select");

if (settleSupplierSelect) {

settleSupplierSelect.onchange =
function() {

var debtField = document.getElementById("settle-supplier-debt");

if (!debtField) {
return;
}

if (settleSupplierSelect.value == "") {

debtField.value = "";

return;
}

var supplier = findSupplierById(Number(settleSupplierSelect.value));

debtField.value = supplier ? formatNumber(supplier.debt) : "";

};
}

/* زر تسديد دين مورد */

var settleSupplierButton =
document.getElementById("settle-supplier-btn");

if (settleSupplierButton) {

settleSupplierButton.onclick =
function() {

paySupplierDebt();

};
}

/* زر طباعة كشف حساب العميل */

var printCustomerStatementBtn =
document.getElementById("print-customer-statement-btn");

if (printCustomerStatementBtn) {

printCustomerStatementBtn.onclick =
function() {

printCustomerStatement();

};
}

/* زر طباعة كشف حساب المورد */

var printSupplierStatementBtn =
document.getElementById("print-supplier-statement-btn");

if (printSupplierStatementBtn) {

printSupplierStatementBtn.onclick =
function() {

printSupplierStatement();

};
}

/* زر عرض سجل فواتير عميل */

var showCustomerHistoryBtn =
document.getElementById("show-customer-history-btn");

if (showCustomerHistoryBtn) {

showCustomerHistoryBtn.onclick =
function() {

showCustomerHistory();

};
}

/* زر عرض سجل فواتير مورد */

var showSupplierHistoryBtn =
document.getElementById("show-supplier-history-btn");

if (showSupplierHistoryBtn) {

showSupplierHistoryBtn.onclick =
function() {

showSupplierHistory();

};
}

/* زر مسح الباركود بالكاميرا في المبيعات */

var barcodeCameraBtn =
document.getElementById("barcode-camera-btn");

if (barcodeCameraBtn) {

barcodeCameraBtn.onclick =
function() {

openBarcodeScanner("barcode");

};
}

/* زر مسح الباركود بالكاميرا في المشتريات */

var purchaseBarcodeCameraBtn =
document.getElementById("purchase-barcode-camera-btn");

if (purchaseBarcodeCameraBtn) {

purchaseBarcodeCameraBtn.onclick =
function() {

openBarcodeScanner("purchase-barcode");

};
}

/* زر إغلاق نافذة المسح بالكاميرا */

var scannerCloseBtn =
document.getElementById("scanner-close-btn");

if (scannerCloseBtn) {

scannerCloseBtn.onclick =
function() {

closeBarcodeScanner();

};
}

/* زر إضافة سلعة لقائمة طباعة الباركود */

var addToBarcodeQueueBtn =
document.getElementById("add-to-barcode-queue");

if (addToBarcodeQueueBtn) {

addToBarcodeQueueBtn.onclick =
function() {

addToBarcodeQueue();

};
}

/* زر طباعة ملصقات الباركود */

var printBarcodeLabelsBtn =
document.getElementById("print-barcode-labels");

if (printBarcodeLabelsBtn) {

printBarcodeLabelsBtn.onclick =
function() {

printBarcodeLabels();

};
}

/* زر تفريغ قائمة الباركود */

var clearBarcodeQueueBtn =
document.getElementById("clear-barcode-queue");

if (clearBarcodeQueueBtn) {

clearBarcodeQueueBtn.onclick =
function() {

clearBarcodeQueue();

};
}

/* زر تصدير نسخة احتياطية */

var backupExportButton =
document.getElementById("backup-export-btn");

if (backupExportButton) {

backupExportButton.onclick =
function() {

exportBackup();

};
}

/* زر استيراد نسخة احتياطية (يفتح مربع اختيار الملف) */

var backupImportButton =
document.getElementById("backup-import-btn");

var backupImportInput =
document.getElementById("backup-import-input");

if (backupImportButton && backupImportInput) {

backupImportButton.onclick =
function() {

backupImportInput.click();

};

backupImportInput.onchange =
function() {

if (backupImportInput.files && backupImportInput.files.length > 0) {

importBackupFile(backupImportInput.files[0]);
}

backupImportInput.value = "";
};
}