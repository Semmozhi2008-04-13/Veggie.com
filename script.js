refs
const productsEl = document.getElementById('products') const searchEl = document.getElementById('search') const categoryFilter = document.getElementById('categoryFilter') const sortSelect = document.getElementById('sortSelect') const cartBtn = document.getElementById('cartBtn') const cartCountEl = document.getElementById('cart-count') const productModal = document.getElementById('productModal') const closeModal = document.getElementById('closeModal') const modalImage = document.getElementById('modalImage') const modalTitle = document.getElementById('modalTitle') const modalDesc = document.getElementById('modalDesc') const modalPrice = document.getElementById('modalPrice') const modalQty = document.getElementById('modalQty') const addToCartModal = document.getElementById('addToCartModal') const cartDrawer = document.getElementById('cartDrawer') const cartItemsEl = document.getElementById('cartItems') const cartTotalEl = document.getElementById('cartTotal') const checkoutBtn = document.getElementById('checkoutBtn') const closeCart = document.getElementById('closeCart')

let state = {
    products: products.slice(),
    cart: JSON.parse(localStorage.getItem('veggie_cart') || '[]'),
    modalProduct: null
}

function saveCart() {
    localStorage.setItem('veggie_cart', JSON.stringify(state.cart))
}

function updateCartCount() {
    const count = state.cart.reduce((s, i) => s + i.qty, 0) cartCountEl.textContent = count
}

function renderProducts() {
    const q = searchEl.value.trim().toLowerCase() let list = state.products.filter(p => {
        if (categoryFilter.value !== 'all' && p.category !== categoryFilter.value) return false
        if (!q) return true
        return p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
    }) if (sortSelect.value === 'price-asc') list.sort((a, b) => a.price - b.price) if (sortSelect.value === 'price-desc') list.sort((a, b) => b.price - a.price)

    productsEl.innerHTML = ''
    list.forEach(p => {
        const card = document.createElement('article') card.className = 'card'
        card.innerHTML = < img src = "${p.image}"
        alt = "${p.name}" / > < h3 > $ {
            p.name
        } < /h3>       <p>${p.desc}</p > < div style = "margin-top:auto;display:flex;justify-content:space-between;align-items:center" > < div class = "price" > $$ {
            p.price.toFixed(2)
        }
        /kg</div > < div > < button class = "btn ghost"
        data - id = "${p.id}"
        data - action = "view" > View < /button>           <button class="btn primary" data-id="${p.id}" data-action="add">Add</button > < /div>       </div > productsEl.appendChild(card)
    })
}

function openProductModal(id) {
    const p = state.products.find(x => x.id === id) if (!p) return state.modalProduct = p modalImage.src = p.image modalTitle.textContent = p.name modalDesc.textContent = p.desc modalPrice.textContent = p.price.toFixed(2) modalQty.value = 1 productModal.classList.remove('hidden')
}

function closeProductModal() {
    productModal.classList.add('hidden') state.modalProduct = null
}

function addToCart(id, qty = 1) {
    qty = Number(qty) const p = state.products.find(x => x.id === id) if (!p) return const existing = state.cart.find(i => i.id === id) if (existing) existing.qty += qty
    else state.cart.push({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        qty
    }) saveCart();
    updateCartCount()
}

function renderCart() {
    cartItemsEl.innerHTML = ''
    let total = 0 state.cart.forEach(item => {
                const row = document.createElement('div') row.className = 'cart-item'
                row.innerHTML = < img src = "${item.image}"
                alt = "${item.name}" / > < div style = "flex:1" > < strong > $ {
                    item.name
                } < /strong>         <div>$${item.price.toFixed(2)} /
                kg < /div>         <div>Qty: <input type="number" min="1" value="${item.qty}" data-id="${item.id}" class="cart-qty" style="width:64px"/ > < /div>       </div > < div > < div > $$ {
                    (item.price * item.qty).toFixed(2)
                } < /div>         <button class="btn" data-id="${item.id}" data-action="remove">Remove</button > < /div>     cartItemsEl.appendChild(row) total += item.price * item.qty }) cartTotalEl.textContent = total.toFixed(2) }

                // Event delegation for product actions productsEl.addEventListener('click', e=>{ const btn = e.target.closest('button') if(!btn) return const id = Number(btn.dataset.id) const action = btn.dataset.action if(action==='view') openProductModal(id) if(action==='add') { addToCart(id,1); alert('Added to cart') } })

                // modal controls closeModal.addEventListener('click', closeProductModal) addToCartModal.addEventListener('click', ()=>{ if(!state.modalProduct) return addToCart(state.modalProduct.id, Number(modalQty.value)||1) closeProductModal() })

                // search + filters searchEl.addEventListener('input',()=>renderProducts()) categoryFilter.addEventListener('change',()=>renderProducts()) sortSelect.addEventListener('change',()=>renderProducts())

                // cart drawer cartBtn.addEventListener('click', ()=>{ cartDrawer.classList.remove('hidden') renderCart() }) closeCart.addEventListener('click', ()=>cartDrawer.classList.add('hidden'))

                // cart item actions cartItemsEl.addEventListener('click', e=>{ const btn = e.target.closest('button') if(!btn) return const id = Number(btn.dataset.id) const action = btn.dataset.action if(action==='remove'){ state.cart = state.cart.filter(i=>i.id!==id) saveCart(); renderCart(); updateCartCount() } })

                cartItemsEl.addEventListener('change', e => {
                    const input = e.target.closest('.cart-qty') if (!input) return const id = Number(input.dataset.id) const val = Number(input.value) || 1
                    const item = state.cart.find(i => i.id === id) if (item) {
                        item.qty = val;
                        saveCart();
                        renderCart();
                        updateCartCount()
                    }
                })

                checkoutBtn.addEventListener('click', () => {
                            if (state.cart.length === 0) {
                                alert('Cart empty');
                                return
                            } // simple mock checkout alert('Thank you! Your order has been placed (mock).') state.cart = [] saveCart(); renderCart(); updateCartCount(); cartDrawer.classList.add('hidden') })

                            // init renderProducts(); updateCartCount();
