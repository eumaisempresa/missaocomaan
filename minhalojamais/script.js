let products = [
    { id: 1, name: 'Bolsa Preta', price: 50, stock: 9, quantity: 0 }
    // Adicione mais produtos aqui se quiser
];

let cart = [];

function renderProducts() {
    const container = document.getElementById('products');
    container.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <h3>${product.name}</h3>
            <p>Preço: R$ ${product.price}</p>
            <p>Estoque disponível: <span id="stock-\( {product.id}"> \){product.stock}</span></p>
            <button onclick="addToCart(${product.id})">Comprar (+1)</button>
            <div id="qty-${product.id}" style="margin-top:8px; font-weight:bold;">Quantidade: 0</div>
        `;
        container.appendChild(div);
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (product.quantity < product.stock) {
        product.quantity++;
        updateProductDisplay(id);
        addToCartArray(product);
        updateCartCount();
    } else {
        alert('Estoque insuficiente!');
    }
}

function updateProductDisplay(id) {
    const product = products.find(p => p.id === id);
    document.getElementById(`qty-${id}`).textContent = `Quantidade: ${product.quantity}`;
    document.getElementById(`stock-${id}`).textContent = product.stock - product.quantity;
}

function addToCartArray(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity = product.quantity;
    } else {
        cart.push({ ...product });
    }
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function toggleCart() {
    const cartDiv = document.getElementById('cart');
    if (cartDiv.style.display === 'block') {
        cartDiv.style.display = 'none';
    } else {
        cartDiv.style.display = 'block';
        renderCart();
    }
}

function renderCart() {
    const container = document.getElementById('cart-items');
    container.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.style.margin = '12px 0';
        div.innerHTML = `
            <strong>\( {item.name}</strong> - R \) ${item.price} cada<br>
            Quantidade: 
            <button onclick="changeQuantity(${index}, -1)">–</button>
            <span style="font-size:18px; margin:0 8px;">${item.quantity}</span>
            <button onclick="changeQuantity(${index}, 1)">+</button>
            <span style="margin-left:15px;">Subtotal: R$ ${item.price * item.quantity}</span>
            <button onclick="removeFromCart(${index})" style="margin-left:15px; color:red;">Remover</button>
        `;
        container.appendChild(div);
        total += item.price * item.quantity;
    });

    document.getElementById('cart-total').textContent = total;
}

function changeQuantity(index, change) {
    const item = cart[index];
    const product = products.find(p => p.id === item.id);
    const newQty = item.quantity + change;

    if (newQty >= 0 && newQty <= product.stock) {
        item.quantity = newQty;
        product.quantity = newQty;
        renderCart();
        updateCartCount();
        updateProductDisplay(item.id);
    } else if (newQty > product.stock) {
        alert('Estoque insuficiente!');
    }
}

function removeFromCart(index) {
    const item = cart[index];
    const product = products.find(p => p.id === item.id);
    product.quantity = 0;
    cart.splice(index, 1);
    renderCart();
    updateCartCount();
    updateProductDisplay(item.id);
}

function showPaymentOptions() {
    alert('Opções de pagamento:\n\n• Cartão de Crédito\n• Pix\n• Boleto Bancário\n\n(Expanda isso depois com um modal bonito)');
}

function finalizePurchase() {
    if (cart.length === 0) {
        alert('Carrinho vazio!');
        return;
    }
    alert('Pedido finalizado com sucesso!\n\nO estoque será atualizado na planilha agora.');
    
    // Reset
    cart = [];
    products.forEach(p => p.quantity = 0);
    updateCartCount();
    renderProducts();
    toggleCart();
}

// Inicializa
renderProducts();
