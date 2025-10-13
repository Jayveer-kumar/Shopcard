// ============================================
// CART HANDLER - Complete Bidirectional Sync
// ============================================
class CartHandler {
  constructor() {
    this.isOpen = false;
    this.container = null;
    this.totalContainer = null;
    this.cartProducts = new Set(); // Track products in cart
    this.init();
  }

  init() {
    this.setupElements();
    this.attachEventListeners();
  }

  setupElements() {
    this.closeBtn = document.getElementById("close_userCard_container"); // Button for close user cart
    this.openBtn = document.querySelector(".user-card"); // Button for open user cart
    this.cartContainer = document.querySelector(".userCard_container"); // user Cart Container
    this.container = document.querySelector(".userCard_container_main"); // Container for user cart product 
    this.totalContainer = document.querySelector(".cart-total"); // user cart total ammount for checkout 
  }

  attachEventListeners() {
    // Open/Close cart buttons
    if (this.openBtn) {
      // call  toggleCart function only if open Button exist in the DOM
      this.openBtn.addEventListener("click", () => this.toggleCart());
    }

    if (this.closeBtn) {
      // call  closeCart function only if close Button exist in the DOM
      this.closeBtn.addEventListener("click", () => this.closeCart());
    }

    // Remove product button - event delegation
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("removeCardProduct")) {
        e.preventDefault();
        e.stopPropagation();
        const productId = e.target.dataset.id;
        this.removeProduct(productId, e.target);
      }
    });

    // Listen to product liked event - Add to cart dynamically
    const attachLikedListener = () => {
      if (window.eventManager && typeof window.eventManager.on === "function") {
        window.eventManager.on("product:liked", (data) => {
          this.handleProductLiked(data.productId);
        });
        return true;
      }
      return false;
    };

    // Listen to product unliked event - Remove from cart
    const attachUnlikedListener = () => {
      if (window.eventManager && typeof window.eventManager.on === "function") {
        window.eventManager.on("product:unliked", (data) => {
          this.handleProductUnliked(data.productId);
        });
        return true;
      }
      return false;
    };

    // Try to attach listeners immediately
    if (!attachLikedListener() || !attachUnlikedListener()) {
      // Retry after a delay if eventManager not ready
      setTimeout(() => {
        attachLikedListener();
        attachUnlikedListener();
      }, 500);
    }
  }

  async toggleCart() {
    if (this.isOpen) {
      this.closeCart();
    } else {
      await this.openCart();
    }
  }

  async openCart() {
    this.isOpen = true;
    if (this.cartContainer) {
      this.cartContainer.classList.add("openUserCardContainer");
    }
    await this.loadCartProducts();
  }

  closeCart() {
    this.isOpen = false;
    if (this.cartContainer) {
      this.cartContainer.classList.remove("openUserCardContainer");
    }
  }

  showSkeletons() {
    if (!this.container) return;

    this.container.innerHTML = "";
    if (this.totalContainer) {
      this.totalContainer.innerHTML =
        '<span class="cart-total-skeleton"></span>';
    }

    for (let i = 0; i < 4; i++) {
      const skeleton = document.createElement("div");
      skeleton.className = "skeleton_card";
      skeleton.innerHTML = `
        <div class="skeleton_image"></div>
        <div class="skeleton_text">
          <div class="skeleton_line short"></div>
          <div class="skeleton_line long"></div>
          <div class="skeleton_line discount"></div>
        </div>
      `;
      this.container.appendChild(skeleton);
    }
  }

  async loadCartProducts() {
    this.showSkeletons();

    try {
      const response = await fetch("/shopcard/liked-product");

      if (!response.ok) {
        throw new Error("Server Error!");
      }

      const data = await response.json();

      // Update cart products set
      this.cartProducts.clear(); // Update with latest liked product
      data.forEach((product) => this.cartProducts.add(product._id));
      
      // if no liked product
      if (data.length === 0) {
        this.showEmptyCart(); 
        return;
      }

      this.renderProducts(data);
    } catch (error) {
      this.showError();
      console.error("Cart load failed:", error);
    }
  }

  showEmptyCart() {
    if (!this.container) return;

    this.container.innerHTML = `
      <p style="color: var(--color-warning); text-align:center; padding:2em;">
        Your cart is empty! Add some products to see them here.
      </p>
    `;

    if (this.totalContainer) {
      this.totalContainer.innerHTML = "0";
    }

    if (typeof showLikeMessageBox === "function") {
      showLikeMessageBox("Your cart is empty!", "#f44336");
    }
  }

  showError() {
    if (!this.container) return;

    this.container.innerHTML = `
      <p style="color: var(--color-warning); text-align:center; padding:2em;">
        Oops! Something went wrong. Please try again later.
      </p>
    `;

    if (this.totalContainer) {
      this.totalContainer.innerHTML = "";
    }
  }

  renderProducts(products) {
    if (!this.container) return;

    this.container.innerHTML = "";
    let totalAmount = 0;

    products.forEach((product) => {
      const priceInfo = this.generateFakePrice(product.prize);
      totalAmount += priceInfo.discountedPrice;

      const card = this.createProductCard(product, priceInfo);
      this.container.appendChild(card);
    });

    if (this.totalContainer) {
      const formattedTotal = totalAmount.toLocaleString("en-IN");
      this.totalContainer.innerHTML = `<span>₹${formattedTotal}</span>`;
    }
  }

  createProductCard(product, priceInfo) {
    const { discountedPrice, fakeOriginalPrice, discountPercentage } =
      priceInfo;
    const youSave = fakeOriginalPrice - discountedPrice;

    const card = document.createElement("div");
    card.className = "user_add_toCard_Product_box";
    card.dataset.cartProductId = product._id;

    card.innerHTML = `
      <div class="user_add_toCard_image_desciption_box">
        <div class="user_add_toCard_image">
          <img src="${product.image[0]}" alt="${product.title}" />
        </div>
        <div class="user_add_toCard_description">
          <p class="user_add_toCard_des_me_title">${product.description}</p>
          <p class="user_add_toCard_quantity"><span>Quantity: 1</span></p>
          <div class="user_add_toCard_priceBox">
            <div class="user_add_toCard_price-details">
              <span class="user_add_toCard_discounted-price">₹${discountedPrice}</span>
              <span class="user_add_toCard_original-price">₹${fakeOriginalPrice}</span>
              <span class="user_add_toCard_discount-percent">${discountPercentage}% OFF</span>
            </div>
            <p class="user_add_toCard_you-save">You Save: ₹${youSave}</p>
          </div>
          <button class="removeCardProduct" data-id="${product._id}">Remove</button>
        </div>
      </div>
    `;

    return card;
  }

  async removeProduct(productId, button) {
    const productCard = button.closest(".user_add_toCard_Product_box");
    if (productCard) {
      productCard.style.opacity = "0.5";
      button.disabled = true;
    }

    try {
      const response = await fetch(`/shopcard/${productId}/like`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Remove failed");
      }

      const data = await response.json();

      // Remove from cart products set
      this.cartProducts.delete(productId);

      // Remove from DOM with animation
      if (productCard) {
        productCard.style.transition = "all 0.3s ease";
        productCard.style.opacity = "0";
        productCard.style.transform = "translateX(-100%)";

        setTimeout(() => {
          productCard.remove();
          this.recalculateTotal();

          // Check if cart is empty
          if (this.container && this.container.children.length === 0) {
            this.showEmptyCart();
          }
        }, 300);
      }

      // Emit event for like button sync across all pages
      if (
        window.eventManager &&
        typeof window.eventManager.emit === "function"
      ) {
        window.eventManager.emit("cart:productRemoved", { productId });
      }

      // Show success message
      if (typeof showLikeMessageBox === "function") {
        showLikeMessageBox(data.message || "Product removed from cart","#f44336");
      }
    } catch (error) {
      console.error("Remove product failed:", error);

      // Revert optimistic update
      if (productCard) {
        productCard.style.opacity = "1";
        button.disabled = false;
      }
    }
  }

  // Handle product liked - Add to cart dynamically
  async handleProductLiked(productId) {
    // Add to cart products set
    this.cartProducts.add(productId);

    // If cart is open, fetch product details and add to DOM
    if (this.isOpen && this.container) {
      try {
        const response = await fetch(`/shopcard/product/${productId}`);
        if (!response.ok) {
          console.error("Failed to fetch product details");
          return;
        }

        const product = await response.json();

        // Check if product already exists in cart DOM
        const existingCard = this.container.querySelector(
          `[data-cart-product-id="${productId}"]`
        );
        if (existingCard) {
          console.log("Product already in cart");
          return;
        }

        // Remove empty message if exists
        const emptyMessage = this.container.querySelector("p");
        if (
          emptyMessage &&
          emptyMessage.textContent.includes("Your cart is empty")
        ) {
          emptyMessage.remove();
        }

        // Create and add product card
        const priceInfo = this.generateFakePrice(product.prize);
        const card = this.createProductCard(product, priceInfo);

        // Add with animation
        card.style.opacity = "0";
        card.style.transform = "translateY(-20px)";
        this.container.appendChild(card);

        // Trigger animation
        setTimeout(() => {
          card.style.transition = "all 0.3s ease";
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 10);

        // Recalculate total
        this.recalculateTotal();
      } catch (error) {
        console.error("Failed to add product to cart:", error);
      }
    }
  }

  // Handle product unliked - Remove from cart dynamically
  handleProductUnliked(productId) {
    // Remove from cart products set
    this.cartProducts.delete(productId);

    // If cart is open, remove from DOM
    if (this.isOpen && this.container) {
      const productCard = this.container.querySelector(
        `[data-cart-product-id="${productId}"]`
      );

      if (productCard) {
        // Animate removal
        productCard.style.transition = "all 0.3s ease";
        productCard.style.opacity = "0";
        productCard.style.transform = "translateX(-100%)";

        setTimeout(() => {
          productCard.remove();
          this.recalculateTotal();

          // Check if cart is empty
          if (this.container.children.length === 0) {
            this.showEmptyCart();
          }
        }, 300);
      }
    }
  }

  recalculateTotal() {
    if (!this.container || !this.totalContainer) return;

    let totalAmount = 0;
    const productCards = this.container.querySelectorAll(
      ".user_add_toCard_Product_box"
    );

    productCards.forEach((card) => {
      const priceElement = card.querySelector(
        ".user_add_toCard_discounted-price"
      );
      if (priceElement) {
        const priceText = priceElement.textContent;  
        const price = parseInt(priceText.replace(/[₹,]/g, ""));
        if (!isNaN(price)) {
          totalAmount += price;
        }
      }
    });

    const formattedTotal = totalAmount.toLocaleString("en-IN");
    this.totalContainer.innerHTML = `<span>₹${formattedTotal}</span>`;
  }

  generateFakePrice(originalPrice) {
    // Ensure originalPrice is a number
    if (typeof originalPrice === "string") {
        // Remove ₹ and commas
        originalPrice = parseFloat(originalPrice.replace(/[^\d\.]/g, ""));
    }

    // Generate fake original price (originalPrice + random 10% to 50%)
    const fakeOriginalPrice = Math.round(originalPrice * (1 + Math.random() * 0.5));

    // Calculate discount percentage based on originalPrice vs fakeOriginalPrice
    const discountPercentage = Math.round(((fakeOriginalPrice - originalPrice) / fakeOriginalPrice) * 100);

    // Calculate discounted price = originalPrice
    const discountedPrice = originalPrice;

    return {
        discountedPrice,       // The actual price user pays
        fakeOriginalPrice,     // Inflated price to show discount
        discountPercentage
    };
}

}

// Export for global use
window.CartHandler = CartHandler;