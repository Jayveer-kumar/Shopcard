// ============================================
// LIKE HANDLER - Centralized Like System (FIXED)
// ============================================
class LikeHandler {
  constructor() {
    this.likedProducts = new Set();
    this.init();
  }

  init() {
    this.loadInitialState();  // To store already liked product in likedProduct Set
    this.attachEventListeners(); // To Add Event Listner for Like Button 
    this.listenToCartEvents(); // To Listen Cart Event (Product Remove Button Event)
  }

  loadInitialState() {
    // Load initial liked products from DOM
    document.querySelectorAll('.listing_item_likeBtn.activeLikeBtn').forEach(btn => {
      const productId = btn.dataset.productId;
      if (productId) {
        this.likedProducts.add(productId);
      }
    });

    // Also load from search route cards if they exist
    document.querySelectorAll('.search_route_card_like_box.activeLikeBtn').forEach(btn => {
      const productId = btn.dataset.productId;
      if (productId) {
        this.likedProducts.add(productId);
      }
    });
  }

  attachEventListeners() {
    // Event delegation for all like buttons
    document.addEventListener('click', (e) => {
      // Home page & product detail like buttons
      const likeBtn = e.target.closest('.listing_item_likeBtn');
      if (likeBtn) {
        e.preventDefault();
        e.stopPropagation(); // IMPORTANT: Stop event from bubbling to parent link
        this.toggleLike(likeBtn);
        return;
      }

      // Search page like buttons
      const searchLikeBtn = e.target.closest('.search_route_card_like_box');
      if (searchLikeBtn) {
        e.preventDefault();
        e.stopPropagation(); // IMPORTANT: Stop event from bubbling to parent link
        this.toggleLike(searchLikeBtn);
        return;
      }
    });
  }

  async toggleLike(likeBtn) {
    const productId = likeBtn.dataset.productId;
    
    if (!productId) {
      console.error('Product ID not found');
      return;
    }

    const isCurrentlyLiked = likeBtn.classList.contains('activeLikeBtn')

    // Optimistic UI update
    this.updateSingleButton(likeBtn, !isCurrentlyLiked);

    try {
      const method = isCurrentlyLiked ? 'DELETE' : 'POST';
      
      const response = await fetch(`/shopcard/${productId}/like`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ productId }),
        redirect: 'manual',
      });

      // Handle authentication redirect
      if (response.status === 401) {
        window.location.href = '/shopcard/authenticate/register?action=login';
        return;
      }

      if (!response.ok) {
        // Revert optimistic update
        this.updateSingleButton(likeBtn, isCurrentlyLiked);
        throw new Error('Server Error!');
      }

      const data = await response.json();

      if (isCurrentlyLiked) {
        // Unlike (and delete from likedProduct Set)
        this.likedProducts.delete(productId);
        this.updateAllButtons(productId, false);
        
        // Emit event (Safe check)
        if (window.eventManager && typeof window.eventManager.emit === 'function') {
          window.eventManager.emit('product:unliked', { productId });
        }
        
        this.showMessage(data.message, '#f44336');
      } else {
        // Like (and add into likedProduct Set)
        this.likedProducts.add(productId);
        this.updateAllButtons(productId, true);
        
        // Emit event (Safe check)
        if (window.eventManager && typeof window.eventManager.emit === 'function') {
          window.eventManager.emit('product:liked', { productId });
        }
        
        this.showMessage(data.message, '#4caf50');
      }

    } catch (error) {
      console.error('Like toggle failed:', error);
      this.showMessage('Something went wrong!', '#f44336');
      
      // Revert optimistic update on error
      this.updateSingleButton(likeBtn, isCurrentlyLiked);
    }
  }

  updateSingleButton(btn, isLiked) {
    if (btn.classList.contains('listing_item_likeBtn')) {
      const svg = btn.querySelector('svg');
      // Home/product page style
      if (isLiked) {
        btn.classList.add('activeLikeBtn');
        svg.classList.add("activeLikeSVG");
      } else {
        btn.classList.remove('activeLikeBtn');
        svg.classList.remove("activeLikeSVG");
      }
    } else if (btn.classList.contains('search_route_card_like_box')) {
      const svg = btn.querySelector('svg');
      // Search page style
      if (isLiked) {
        btn.classList.add("activeLikeBtn");
        svg.classList.add("activeLikeSVG");
      } else {
        btn.classList.remove("activeLikeBtn");
        svg.classList.remove("activeLikeSVG");
      }
    }
    
    btn.dataset.isLiked = isLiked.toString();
  }

  updateAllButtons(productId, isLiked) {
    // Update all instances across the page
    
    // Home page & product detail buttons
    document.querySelectorAll(`[data-product-id="${productId}"].listing_item_likeBtn`).forEach(btn => {
      const svg = btn.querySelector('svg');
      if (isLiked) {
        btn.classList.add('activeLikeBtn');
        svg.classList.add("activeLikeSVG");
      } else {
        btn.classList.remove('activeLikeBtn');
        svg.classList.remove("activeLikeSVG");
      }
      btn.dataset.isLiked = isLiked.toString();
    });

    // Search page buttons
    document.querySelectorAll(`[data-product-id="${productId}"].search_route_card_like_box`).forEach(btn => {
      const svg = btn.querySelector('svg');
      if (isLiked) {
        btn.classList.add("activeLikeBtn");
        svg.classList.add("activeLikeSVG");
      } else {
        btn.classList.remove("activeLikeBtn");
        svg.classList.remove("activeLikeSVG");
      }
      btn.dataset.isLiked = isLiked.toString();
    });
  }

  listenToCartEvents() {
    // Cart se product remove hone par listen
    // Retry logic if eventManager not ready yet
    const attachListener = () => {
      if (window.eventManager && typeof window.eventManager.on === 'function') {
        window.eventManager.on('cart:productRemoved', (data) => {
          const { productId } = data;
          this.likedProducts.delete(productId); // Delet from  likedProduct Set
          this.updateAllButtons(productId, false); // Update Button liked class in Frontend UI
        });
        return true;
      }
      return false;
    };

    // Try immediately
    if (!attachListener()) {
      // Retry after a short delay
      setTimeout(() => {
        if (!attachListener()) {
          console.warn('EventManager not available, cart sync may not work');
        }
      }, 500);
    }
  }

  showMessage(message, color) {
    if (typeof showLikeMessageBox === 'function') {
      showLikeMessageBox(message, color);
    } else {
      console.log(message);
    }
  }

  isProductLiked(productId) {
    return this.likedProducts.has(productId);
  }
}

// Export for global use
window.LikeHandler = LikeHandler;