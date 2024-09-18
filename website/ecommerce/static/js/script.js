// Sample Product Data (You'll get this from your backend)
const products = [
    {
        id: 1,
        name: "T-Shirt",
        category: "men",
        size: "M",
        color: "#008000",
        price: 49.99,
        imageUrl: "images/product-1.jpg"
    },
    {
        id: 2,
        name: "Dress",
        category: "women",
        size: "L",
        color: "#ff0000",
        price: 79.99,
        imageUrl: "images/product-2.jpg"
    },
    // ... more products ...
];

// Function to render products
function renderProducts(productsToDisplay) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = ''; // Clear existing products

    productsToDisplay.forEach(product => {
        const productElement = `
            <div class="product">
                <a href="product.html?id=${product.id}"> <img src="${product.imageUrl}" alt="${product.name}"></a>
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `;
        productGrid.innerHTML += productElement;
    });
}

// Initial rendering
renderProducts(products);

// Filter logic
const categoryFilter = document.getElementById('category-filter');
const sizeFilter = document.getElementById('size-filter');
const colorFilter = document.getElementById('color-filter');
const priceFilter = document.getElementById('price-filter');

function applyFilters() {
    const selectedCategory = categoryFilter.value;
    const selectedSize = sizeFilter.value;
    const selectedColors = Array.from(colorFilter.querySelectorAll('.color-swatch:checked'))
                        .map(swatch => swatch.dataset.color);
    const maxPrice = priceFilter.value;

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
        const matchesSize = selectedSize === '' || product.size === selectedSize;
        const matchesColor = selectedColors.length === 0 || selectedColors.includes(product.color);
        const matchesPrice = product.price <= maxPrice;

        return matchesCategory && matchesSize && matchesColor && matchesPrice;
    });

    renderProducts(filteredProducts);
}

// Event Listeners for filters
categoryFilter.addEventListener('change', applyFilters);
sizeFilter.addEventListener('change', applyFilters);
colorFilter.addEventListener('click', applyFilters);
priceFilter.addEventListener('input', applyFilters);