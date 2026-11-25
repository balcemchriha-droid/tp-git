
// PRODUCT DATA
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "electronics",
        description: "Enjoy clear sound and comfortable listening.",
        price: 120,
        image: "🎧"
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "electronics",
        description: "Track your activities and stay connected.",
        price: 180,
        image: "⌚"
    },
    {
        id: 3,
        name: "Classic Backpack",
        category: "accessories",
        description: "A stylish backpack for everyday use.",
        price: 85,
        image: "🎒"
    },
    {
        id: 4,
        name: "Desk Lamp",
        category: "office",
        description: "Brighten your workspace with elegant lighting.",
        price: 65,
        image: "💡"
    },
    {
        id: 5,
        name: "Wireless Mouse",
        category: "electronics",
        description: "Work comfortably with precise control.",
        price: 45,
        image: "🖱️"
    },
    {
        id: 6,
        name: "Leather Wallet",
        category: "accessories",
        description: "A simple and elegant everyday accessory.",
        price: 55,
        image: "👛"
    }
];


// SELECT ELEMENTS
const productsGrid = document.getElementById("products-grid");
const searchInput = document.getElementById("product-search");
const filterButtons = document.querySelectorAll(".filter-btn");
const productCount = document.getElementById("product-count");

let selectedCategory = "all";


// DISPLAY PRODUCTS
function displayProducts(list) {
    productsGrid.innerHTML = "";

    productCount.textContent = `${list.length} products`;

    if (list.length === 0) {
        productsGrid.innerHTML = "<p>No products found.</p>";
        return;
    }

    list.forEach(product => {
        const card = document.createElement("article");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">${product.image}</div>

            <div class="product-info">
                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-bottom">
                    <span class="product-price">
                        ${product.price} TND
                    </span>

                    <button class="add-to-cart" data-id="${product.id}">
                        Add to cart +
                    </button>
                </div>
            </div>
        `;

        productsGrid.appendChild(card);
    });
}


// SEARCH AND FILTER
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredProducts = products.filter(product => {
        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    displayProducts(filteredProducts);
}


// CATEGORY BUTTONS
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        filterProducts();
    });
});


// SEARCH INPUT
searchInput.addEventListener("input", filterProducts);


// ADD TO CART
productsGrid.addEventListener("click", event => {
    const button = event.target.closest(".add-to-cart");

    if (!button) return;

    const productId = Number(button.dataset.id);

    const product = products.find(item => item.id === productId);

    if (!product) return;

    let cart = JSON.parse(localStorage.getItem("panier")) || [];

    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
        cart.push({
            id: product.id,
            nom: product.name,
            prix: product.price,
            quantity: 1
        });
    }

    localStorage.setItem("panier", JSON.stringify(cart));

    updateCartCount();

    button.textContent = "Added ✓";

    setTimeout(() => {
        button.textContent = "Add to cart +";
    }, 1000);
});


// CART COUNT
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("panier")) || [];

    const count = cart.reduce(
        (total, item) => total + (item.quantity || 1),
        0
    );

    document.getElementById("cart-count").textContent = count;
}


// INITIALIZE
displayProducts(products);
updateCartCount();
