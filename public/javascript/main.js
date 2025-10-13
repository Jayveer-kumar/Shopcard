// ============================================
// MAIN INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize systems in order
  console.log('Initializing Shop Cart System...');
  
  try {
    // 1. Initialize Like Handler
    if (typeof LikeHandler !== 'undefined') {
      window.likeHandler = new LikeHandler();
    }
    
    // 2. Initialize Cart Handler
    if (typeof CartHandler !== 'undefined') {
      window.cartHandler = new CartHandler();
    }
    
  } catch (error) {
    console.error(' Initialization Error:', error);
  }
});