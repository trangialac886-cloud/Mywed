let allProducts = []; 

// Lấy dữ liệu từ localStorage hoặc fetch từ file JSON
let dataLocal = JSON.parse(localStorage.getItem("admin_products"));

if (dataLocal && dataLocal.length > 0) {
    allProducts = dataLocal;
    handleDisplay();
} else {
    fetch("products.json")
        .then((res) => res.json())
        .then((data) => {
            allProducts = data;
            localStorage.setItem("admin_products", JSON.stringify(data));
            handleDisplay();
        });
}

// Hàm điều phối hiển thị dựa trên trang hiện tại
function handleDisplay() {
    // Lấy loại danh mục từ thuộc tính data-category của body
    const categoryType = document.body.getAttribute("data-category");
    const productListContainer = document.getElementById("product-list");

    if (!productListContainer) return;

    if (categoryType === "phukien") {
       const accessories = allProducts.filter(p => p.category === "Phụ kiện");
    displayProducts(accessories);
    } else if (categoryType === "co") {
        // Lọc các sản phẩm thuộc các loại cơ (không phải Phụ kiện)
        const cues = allProducts.filter(p => p.category !== "Phụ kiện");
        displayProducts(cues);
    } else {
        // Trang chủ hoặc các trang khác: Hiển thị tất cả
        displayProducts(allProducts);
    }
}

function displayProducts(data) {
    let html = "";
    if (data.length === 0) {
        html = "<p style='text-align:center; width:100%;'>Chưa có sản phẩm nào trong mục này.</p>";
    } else {
        data.forEach((product) => {
            html += `
                <div class="product">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${Number(product.price).toLocaleString("vi-VN")} VNĐ</p>
                    <button onclick="viewDetails(${product.id})">Chi tiết</button>
                    <button onclick="addToCart(${product.id})">Mua ngay</button>
                </div>`;
        });
    }
    
    const list = document.getElementById("product-list");
    if (list) list.innerHTML = html;
}

function viewDetails(id) {
  localStorage.setItem("id", id); // lưu id vào localStorage
  // chuyển hướng sang trang detail.html
  window.location.href = "detail.html";
}
// hiển thị chi tiết sản phẩm
if (window.location.href.includes("detail.html")) {
  // nếu url có chứa detail.html thì mới thực hiện hiển thị chi tiết sản phẩm
  // lấy id từ localStorage
  const id = localStorage.getItem("id"); // lấy số 3
  // lấy dữ liệu từ file JSON
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      let product = data.find((p) => p.id == id); // tìm sản phẩm có id bằng 3
      if (product) {
        // Trong phần hiển thị chi tiết sản phẩm của main.js
        let html = `
    <div class="product-detail-container">
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" style="max-width: 400px; border-radius: 10px;">
        </div>
        <div class="product-info">
            <h2>${product.name}</h2>
            <p>Tình trạng: ${product.stock > 0 ? `Còn hàng (${product.stock})` : "Hết hàng"}</p>
            <span class="price">${product.price.toLocaleString("vi-VN")} VNĐ</span>
            <p class="description">${product.description}</p>
            <div class="product-actions">
                <button class="btn-buy" onclick="addToCart(${product.id})">Mua ngay</button>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">Thêm vào giỏ hàng</button>
            </div>
        </div>
    </div>
`;
        document.getElementById("detail-content").innerHTML = html;
      }
    })
    .catch((error) => {
      console.error("Lỗi:", error);
    });
}
// phương thức thêm sản phẩm vào giỏ hàng
function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Lấy danh sách sản phẩm hiện tại (từ admin hoặc mặc định)
    let allProducts = JSON.parse(localStorage.getItem("admin_products")) || [];
    let item = allProducts.find((p) => p.id == id);

    if (!item) return;

    let existing = cart.find((c) => c.id == id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    
    // GỌI HÀM NÀY ĐỂ SỐ NHẢY NGAY LẬP TỨC
    updateCartCount(); 
    
    alert("Đã thêm " + item.name + " vào giỏ hàng!");
}

// 3. Tự động chạy khi load trang để hiển thị số lượng cũ
// main.js
// Tìm đoạn này ở gần cuối file main.js
document.addEventListener('DOMContentLoaded', () => {
    const productListContainer = document.getElementById('product-list');
    
    if (productListContainer) {
        handleDisplay(); // Đổi từ renderProducts thành handleDisplay
    }
    updateCartCount(); // Cập nhật số lượng giỏ hàng luôn
});

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Tính tổng số lượng (quantity) của tất cả sản phẩm
    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.innerText = total;
    }
}

// Lấy các phần tử từ HTML
const menu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelector(".nav-menu");

// Kiểm tra nếu tồn tại nút menu thì mới gán sự kiện
if (menu) {
  menu.onclick = () => {
    menu.classList.toggle("is-active"); // Hiệu ứng xoay nút
    menuLinks.classList.toggle("active"); // Hiện menu
  };
}

// Đóng menu khi người dùng nhấn vào một đường link
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.onclick = () => {
    if (menu) {
      menu.classList.remove("is-active");
      menuLinks.classList.remove("active");
    }
  };
});

function goToDetail(id) {
  window.location.href = `detail.html?id=${id}`;
}

// 3. Tìm kiếm thời gian thực (Input Event)
const searchInput = document.getElementById("search-input");
const suggestionsBox = document.getElementById("search-suggestions");

if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const val = e.target.value.toLowerCase().trim();
        // Lấy dữ liệu mới nhất từ local hoặc biến allProducts
        const products = JSON.parse(localStorage.getItem("admin_products")) || [];
        
        if (val.length < 1) {
            suggestionsBox.style.display = "none";
            displayProducts(products); // Hiện lại toàn bộ nếu xóa trắng
            return;
        }

        const filtered = products.filter(p => p.name.toLowerCase().includes(val));

        // Hiển thị gợi ý
        if (filtered.length > 0) {
            suggestionsBox.innerHTML = filtered.map(p => `
                <div class="suggestion-item" onclick="selectSuggestion(${p.id})">
                    <img src="${p.image}" alt="">
                    <span>${p.name}</span>
                </div>
            `).join("");
            suggestionsBox.style.display = "block";
        } else {
            suggestionsBox.innerHTML = '<div class="suggestion-item">Không tìm thấy kết quả</div>';
            suggestionsBox.style.display = "block";
        }
    });
}

// Hàm xử lý khi nhấn vào một gợi ý
window.selectSuggestion = function(id) {
    const products = JSON.parse(localStorage.getItem("admin_products")) || [];
    const selectedProduct = products.find(p => p.id == id);
    
    if (selectedProduct) {
        searchInput.value = selectedProduct.name;
        suggestionsBox.style.display = "none";
        
        // Chỉ hiển thị sản phẩm được chọn trên trang chủ
        displayProducts([selectedProduct]); 
        
        // Nếu muốn nhảy thẳng vào trang chi tiết, có thể dùng:
        // viewDetails(id); 
    }
};

// Đóng gợi ý khi nhấn ra ngoài
document.addEventListener("click", (e) => {
    if (e.target !== searchInput) {
        suggestionsBox.style.display = "none";
    }
});

// Nhấn phím 'L' (viết tắt của Login) đồng thời giữ phím Alt để vào trang login
document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key.toLowerCase() === 'l') {
        window.location.href = 'login.html';
    }
});


