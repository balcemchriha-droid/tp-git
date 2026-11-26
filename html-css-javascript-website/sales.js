
// Sweet Delights catalogue.
// These are example products and prices. Replace them with real bakery data.

const products = [
    {
        id: 1,
        name: "Butter Croissant",
        category: "viennoiseries",
        description: "A flaky, golden pastry with a delicate buttery centre.",
        price: 2.500,
        icon: "🥐"
    },
    {
        id: 2,
        name: "Chocolate Tart",
        category: "tarts",
        description: "A crisp pastry shell filled with smooth chocolate ganache.",
        price: 8.000,
        icon: "🍫"
    },
    {
        id: 3,
        name: "Strawberry Cake",
        category: "cakes",
        description: "Soft sponge, cream and a fresh strawberry finish.",
        price: 28.000,
        icon: "🍰"
    },
    {
        id: 4,
        name: "Vanilla Cupcake",
        category: "cupcakes",
        description: "A light vanilla cupcake topped with creamy frosting.",
        price: 4.000,
        icon: "🧁"
    },
    {
        id: 5,
        name: "Classic Cheesecake",
        category: "cheesecakes",
        description: "A smooth, creamy cheesecake on a buttery biscuit base.",
        price: 18.000,
        icon: "🍰"
    },
    {
        id: 6,
        name: "Raspberry Macarons",
        category: "macarons",
        description: "Delicate almond shells with a raspberry filling.",
        price: 3.500,
        icon: "🍥"
    },
    {
        id: 7,
        name: "Apple Pie",
        category: "pies",
        description: "A comforting pie with tender apples and a golden crust.",
        price: 16.000,
        icon: "🥧"
    },
    {
        id: 8,
        name: "Pain au Chocolat",
        category: "viennoiseries",
        description: "Buttery laminated pastry wrapped around dark chocolate.",
        price: 3.000,
        icon: "🥐"
    },
    {
        id: 9,
        name: "Mini Lemon Tart",
        category: "tarts",
        description: "A crisp little tart with bright, tangy lemon cream.",
        price: 5.000,
        icon: "🍋"
    }
];

// HTML elements
const container = document.getElementById("productsContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortProducts");
const resultsCount = document.getElementById("resultsCount");
const noResults = document.getElementById("noResults");
const modal = document.getElementById("productModal");

let selectedProduct = null;

// Category labels
const categoryNames = {
    pies: "Pies",
    cakes: "Cakes",
    tarts: "Tarts",
    cupcakes: "Cupcakes",
    cheesecakes: "Cheesecakes",
    macarons: "Macarons",
    viennoiseries: "Viennoiseries"
};

// Format product prices
function formatPrice(price) {
    return `${price.toFixed(3)} TND`;
}

// Read basket from localStorage
function getCart() {
    try {
        const value = JSON.parse(localStorage.getItem("panier")) || [];
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

// Save basket
function saveCart(cart) {
    localStorage.setItem("panier", JSON.stringify(cart));
    updateCartCount();
}

// Update basket counter
function updateCartCount() {
    const badge = document.getElementById("cart-count");

    if (!badge) return;

    const total = getCart().reduce(
        (sum, item) => sum + (Number(item.quantity) || 1),
        0
    );

    badge.textContent = total;
}

// Add a product to the basket
function addToCart(product) {
    const cart = getCart();

    const existing = cart.find(
        item => String(item.id) === String(product.id)
    );

    if (existing) {
        existing.quantity = (Number(existing.quantity) || 1) + 1;
    } else {
        cart.push({
            id: product.id,
            nom: product.name,
            prix: product.price,
            quantity: 1
        });
    }

    saveCart(cart);
}

// Search, filter and sort products
function getFilteredProducts() {
    const term = (searchInput?.value || "").trim().toLowerCase();
    const category = categoryFilter?.value || "all";

    let list = products.filter(product => {
        const matchesCategory =
            category === "all" || product.category === category;

        const matchesSearch =
            `${product.name} ${product.description} ${product.category}`
            .toLowerCase()
            .includes(term);

        return matchesCategory && matchesSearch;
    });

    switch (sortSelect?.value) {
        case "price-low":
            list.sort((a, b) => a.price - b.price);
            break;

        case "price-high":
            list.sort((a, b) => b.price - a.price);
            break;

        case "name":
            list.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }

    return list;
}

// Display products
function renderProducts() {
    const list = getFilteredProducts();

    container.innerHTML = "";

    resultsCount.textContent =
        `${list.length} product${list.length === 1 ? "" : "s"} found`;

    noResults.hidden = list.length !== 0;

    list.forEach(product => {
        const card = document.createElement("article");

        card.className = "product-card";

        card.innerHTML = `
            <button class="product-art"
                    type="button"
                    data-details="${product.id}"
                    aria-label="View ${product.name}">
                <span aria-hidden="true">${product.icon}</span>
            </button>

            <div class="product-details">
                <span class="product-category">
                    ${categoryNames[product.category] || product.category}
                </span>

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="product-card-bottom">
                    <strong class="product-price">
                        ${formatPrice(product.price)}
                    </strong>

                    <button type="button" data-add="${product.id}">
                        Add +
                    </button>
                </div>

                <button type="button"
                        class="details-button"
                        data-details="${product.id}">
                    View details →
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

// Open product details
function openProduct(productId) {
    selectedProduct = products.find(
        product => product.id === Number(productId)
    );

    if (!selectedProduct) return;

    document.getElementById("modalVisual").textContent =
        selectedProduct.icon;

    document.getElementById("modalCategory").textContent =
        categoryNames[selectedProduct.category] || selectedProduct.category;

    document.getElementById("modalName").textContent =
        selectedProduct.name;

    document.getElementById("modalDescription").textContent =
        selectedProduct.description;

    document.getElementById("modalPrice").textContent =
        formatPrice(selectedProduct.price);

    // Find related products
    const related = products.filter(product =>
        product.id !== selectedProduct.id &&
        product.category === selectedProduct.category
    ).slice(0, 3);

    const relatedContainer =
        document.getElementById("relatedProducts");

    relatedContainer.innerHTML = "";

    related.forEach(product => {
        const button = document.createElement("button");

        button.className = "related-item";
        button.type = "button";
        button.textContent = `${product.icon} ${product.name}`;

        button.addEventListener("click", () => {
            openProduct(product.id);
        });

        relatedContainer.appendChild(button);
    });

    // If there are no products in the same category,
    // suggest other products instead.
    if (!related.length) {
        const suggestions = products
            .filter(product => product.id !== selectedProduct.id)
            .slice(0, 3);

        suggestions.forEach(product => {
            const button = document.createElement("button");

            button.className = "related-item";
            button.type = "button";
            button.textContent = `${product.icon} ${product.name}`;

            button.addEventListener("click", () => {
                openProduct(product.id);
            });

            relatedContainer.appendChild(button);
        });
    }

    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    document.getElementById("closeModal").focus();
}

// Close product modal
function closeProductModal() {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    selectedProduct = null;
}

// Handle product card clicks
container.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add]");
    const detailsButton = event.target.closest("[data-details]");

    if (addButton) {
        const product = products.find(
            item => item.id === Number(addButton.dataset.add)
        );

        if (product) {
            addToCart(product);

            const previous = addButton.textContent;
            addButton.textContent = "Added ✓";

            window.setTimeout(() => {
                addButton.textContent = previous;
            }, 900);
        }
    } else if (detailsButton) {
        openProduct(detailsButton.dataset.details);
    }
});

// Search and filter events
searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
sortSelect.addEventListener("change", renderProducts);

// Modal events
document.getElementById("closeModal")
    .addEventListener("click", closeProductModal);

modal.addEventListener("click", event => {
    if (event.target.matches("[data-close-modal]")) {
        closeProductModal();
    }
});

// Close modal with Escape
document.addEventListener("keydown", event => {
    if (
        event.key === "Escape" &&
        modal.getAttribute("aria-hidden") === "false"
    ) {
        closeProductModal();
    }
});

// Add product from modal
document.getElementById("modalAddToCart")
    .addEventListener("click", () => {
        if (selectedProduct) {
            addToCart(selectedProduct);

            const button =
                document.getElementById("modalAddToCart");

            button.textContent = "Added to basket ✓";

            window.setTimeout(() => {
                button.textContent = "Add to basket";
            }, 1000);
        }
    });

// Initial rendering
renderProducts();
updateCartCount();
