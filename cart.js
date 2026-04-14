// Hàm hiển thị giỏ hàng
function renderCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const tbody = document.getElementById("cart-items");
    const totalEl = document.getElementById("grand-total");
    
    if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Giỏ hàng trống!</td></tr>';
        totalEl.innerText = "0";
        return;
    }

    let html = "";
    let grandTotal = 0;

    cart.forEach((item, index) => {
        let subtotal = item.price * item.quantity;
        grandTotal += subtotal;
        
       // Tìm dòng này trong cart.js và cập nhật template string
html += `
    <tr>
        <td>
            <div style="display: flex; align-items: center; gap: 15px;">
                <img src="${item.image}" class="cart-img">
                <span style="font-weight: bold;">${item.name}</span>
            </div>
        </td>
        <td>${Number(item.price).toLocaleString()} đ</td>
        <td>
            <div class="qty-controls">
                <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
        </td>
        <td style="color: #d4af37; font-weight: bold;">${subtotal.toLocaleString()} đ</td>
        <td><button class="btn-delete" onclick="removeItem(${index})">✖</button></td>
    </tr>
`;
    });

    tbody.innerHTML = html;
    totalEl.innerText = grandTotal.toLocaleString();
}

// Cập nhật số lượng
window.updateQuantity = function(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    cart[index].quantity += change;

    // Nếu số lượng nhỏ hơn 1 thì giữ nguyên là 1
    if (cart[index].quantity < 1) cart[index].quantity = 1;

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
};

// Xóa sản phẩm
window.removeItem = function(index) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (confirm("Bạn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
};

// Thanh toán (Giả lập)
window.checkout = function() {
    alert("Cảm ơn bạn đã mua hàng tại Nhím Billiards!");
    localStorage.removeItem("cart"); // Xóa giỏ sau khi mua
    window.location.href = "index.html";
};

// Chạy hàm render khi trang web tải xong
document.addEventListener("DOMContentLoaded", renderCart);

// Hàm mở Modal thanh toán
function openCheckout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }
    document.getElementById("checkout-modal").style.display = "block";
}

// Hàm đóng Modal
function closeCheckout() {
    document.getElementById("checkout-modal").style.display = "none";
}

// Xử lý sự kiện gửi form
const checkoutForm = document.getElementById("checkout-form");
if (checkoutForm) {
    checkoutForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const name = document.getElementById("customer-name").value;
        const phone = document.getElementById("customer-phone").value;
        const method = document.getElementById("payment-method").value;

        alert(`Cảm ơn ${name}! Đơn hàng của bạn đã được ghi nhận qua hình thức ${method.toUpperCase()}. Chúng tôi sẽ liên hệ qua số ${phone}.`);
        
        // Xóa giỏ hàng sau khi đặt hàng thành công
        localStorage.removeItem("cart");
        updateCartCount();
        window.location.href = "index.html"; 
    });
}

/// 1. Hàm mở Modal
function openCheckout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống! Vui lòng chọn sản phẩm trước khi thanh toán.");
        return;
    }
    document.getElementById("checkout-modal").style.display = "block";
}

// 2. Hàm đóng Modal
function closeCheckout() {
    document.getElementById("checkout-modal").style.display = "none";
}



// 4. Đóng modal khi click ra ngoài vùng màu đen
window.onclick = function(event) {
    const modal = document.getElementById("checkout-modal");
    if (event.target == modal) {
        closeCheckout();
    }
}