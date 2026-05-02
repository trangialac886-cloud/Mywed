
(function() {
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
        alert("Bạn không có quyền truy cập trang này!");
        window.location.href = 'index.html';
    }
})();


let searchTerm = "";
let sortOption = "none";
let products = JSON.parse(localStorage.getItem("admin_products")) || [];


if (products.length === 0) {
    fetch("products.json")
        .then(res => res.json())
        .then(data => {
            products = data;
            localStorage.setItem("admin_products", JSON.stringify(products));
            renderAdminTable();
        });
} else {
    renderAdminTable();
}

function renderAdminTable() {
    const tbody = document.getElementById("admin-product-list");
    if (!tbody) return;


    let filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.id.toString().includes(searchTerm)
    );

    
    if (sortOption === "price-asc") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === "stock-asc") {
        filteredProducts.sort((a, b) => (a.stock || 0) - (b.stock || 0));
    } else if (sortOption === "name-az") {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    
    if (filteredProducts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Không tìm thấy sản phẩm phù hợp</td></tr>`;
        return;
    }

    tbody.innerHTML = filteredProducts.map(p => `
        <tr>
            <td>${p.id}</td>
            <td><img src="${p.image}" width="50" height="50" style="object-fit: cover; border-radius: 4px;"></td>
            <td>${p.name}</td>
            <td>${Number(p.price).toLocaleString('vi-VN')} đ</td>
            <td><span class="stock-badge">${p.stock !== undefined ? p.stock : 0}</span></td>
            <td><span class="category-tag">${p.category}</span></td>
            <td>
                <button class="btn-edit" onclick="editProduct(${p.id})">Sửa</button>
                <button class="btn-delete" onclick="deleteProduct(${p.id})">Xóa</button>
            </td>
        </tr>
    `).join("");
}

document.getElementById("productForm").onsubmit = function(e) {
    e.preventDefault();
    const id = document.getElementById("prodId").value;
    const newProduct = {
    id: id ? parseInt(id) : Date.now(),
    name: document.getElementById("prodName").value,
    price: parseInt(document.getElementById("prodPrice").value),
    image: document.getElementById("prodImage").value,
    category: document.getElementById("prodCategory").value,
    description: document.getElementById("prodDesc").value,
    stock: parseInt(document.getElementById("prodStock").value) || 0
    };

    if (id) {
       
        const index = products.findIndex(p => p.id == id);
        products[index] = newProduct;
    } else {
     
        products.push(newProduct);
    }

    localStorage.setItem("admin_products", JSON.stringify(products));
    closeModal();
    renderAdminTable();
};


function deleteProduct(id) {
    if (confirm("Bạn có chắc chắn muốn xóa?")) {
        products = products.filter(p => p.id != id);
        localStorage.setItem("admin_products", JSON.stringify(products));
        renderAdminTable();
    }
}


function openModal() {
    document.getElementById("productForm").reset();
    document.getElementById("prodId").value = "";
    document.getElementById("modalTitle").innerText = "Thêm Sản Phẩm Mới";
    document.getElementById("productModal").style.display = "block";
}

function editProduct(id) {
    const p = products.find(prod => prod.id == id);
    document.getElementById("prodId").value = p.id;
    document.getElementById("prodName").value = p.name;
    document.getElementById("prodPrice").value = p.price;
    document.getElementById("prodImage").value = p.image;
    document.getElementById("prodCategory").value = p.category;
    document.getElementById("prodDesc").value = p.description;
    
    document.getElementById("modalTitle").innerText = "Sửa Sản Phẩm";
    document.getElementById("productModal").style.display = "block";
    document.getElementById("prodStock").value = p.stock || 0;
}

function closeModal() {
    document.getElementById("productModal").style.display = "none";
}


document.getElementById("admin-search")?.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderAdminTable();
});

document.getElementById("admin-sort")?.addEventListener("change", (e) => {
    sortOption = e.target.value;
    renderAdminTable();
});