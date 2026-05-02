
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


window.updateQuantity = function(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    cart[index].quantity += change;


    if (cart[index].quantity < 1) cart[index].quantity = 1;

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
};


window.removeItem = function(index) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (confirm("Bạn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
};


window.checkout = function() {
    alert("Cảm ơn bạn đã mua hàng tại Nhím Billiards!");
    localStorage.removeItem("cart"); 
    window.location.href = "index.html";
};


document.addEventListener("DOMContentLoaded", renderCart);



const checkoutForm = document.getElementById("checkout-form");
if (checkoutForm) {
    checkoutForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const name = document.getElementById("customer-name").value;
        const phone = document.getElementById("customer-phone").value;
        const method = document.getElementById("payment-method").value;

    
        alert(`Cảm ơn ${name}! Đơn hàng của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ qua số ${phone}.`);
        

        localStorage.removeItem("cart");

       
        if (typeof updateCartCount === "function") {
            updateCartCount();
        }

     
        window.location.href = "index.html"; 
    });
}

function openCheckout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống! Vui lòng chọn sản phẩm trước khi thanh toán.");
        return;
    }
    document.getElementById("checkout-modal").style.display = "block";
}

function closeCheckout() {
    document.getElementById("checkout-modal").style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById("checkout-modal");
    if (event.target == modal) {
        closeCheckout();
    }
}