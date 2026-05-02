let currentPage = 1;
const productsPerPage = 6; 
let allProducts = []; 

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


function handleDisplay() {
    const categoryType = document.body.getAttribute("data-category");
    const productListContainer = document.getElementById("product-list");

    if (!productListContainer) return;

    let filteredProducts = [];

    if (categoryType === "phukien") {
        filteredProducts = allProducts.filter(p => p.category === "Phụ kiện");
    } else if (categoryType === "co") {
        filteredProducts = allProducts.filter(p => p.category !== "Phụ kiện");
    } else {
        filteredProducts = allProducts;
    }

   
    renderPagination(filteredProducts);
}

function renderPagination(data) {
    const totalPages = Math.ceil(data.length / productsPerPage);
    
   
    if (currentPage > totalPages) currentPage = totalPages || 1;

   
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedItems = data.slice(start, end);

   
    displayProducts(paginatedItems);

    
    const paginationContainer = document.getElementById("pagination");
    if (!paginationContainer) return;

    let paginationHtml = "";
    for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">${i}</button>
        `;
    }
    paginationContainer.innerHTML = paginationHtml;
}


window.changePage = function(page) {
    currentPage = page;
    handleDisplay(); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
};

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
  localStorage.setItem("id", id); 
  window.location.href = "detail.html";
}

if (window.location.href.includes("detail.html")) {
  const id = localStorage.getItem("id"); 
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      let product = data.find((p) => p.id == id); 
      if (product) {
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
function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
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
    
    updateCartCount(); 
    
    alert("Đã thêm " + item.name + " vào giỏ hàng!");
}


document.addEventListener('DOMContentLoaded', () => {
    const productListContainer = document.getElementById('product-list');
    
    if (productListContainer) {
        handleDisplay(); 
    }
    updateCartCount(); 
});

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.innerText = total;
    }
}


const menu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelector(".nav-menu");

if (menu) {
  menu.onclick = () => {
    menu.classList.toggle("is-active"); 
    menuLinks.classList.toggle("active"); 
  };
}

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

const searchInput = document.getElementById("search-input");
const suggestionsBox = document.getElementById("search-suggestions");

if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const val = e.target.value.toLowerCase().trim();
        const products = JSON.parse(localStorage.getItem("admin_products")) || [];
        
        if (val.length < 1) {
            suggestionsBox.style.display = "none";
            displayProducts(products); 
            return;
        }

        const filtered = products.filter(p => p.name.toLowerCase().includes(val));

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


window.selectSuggestion = function(id) {
    const products = JSON.parse(localStorage.getItem("admin_products")) || [];
    const selectedProduct = products.find(p => p.id == id);
    
    if (selectedProduct) {
        searchInput.value = selectedProduct.name;
        suggestionsBox.style.display = "none";
        

        displayProducts([selectedProduct]); 
        
    }
};


document.addEventListener("click", (e) => {
    if (e.target !== searchInput) {
        suggestionsBox.style.display = "none";
    }
});


document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key.toLowerCase() === 'l') {
        window.location.href = 'login.html';
    }
});


