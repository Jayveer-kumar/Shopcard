// ============================================
// MESSAGE BOX - Notification System
// ============================================

/**
 * Shows a message notification to the user
 * @param {string} message - The message to display
 * @param {string} color - The color of the message box (hex code)
 * @param {number} duration - How long to show the message (ms)
 */
function showLikeMessageBox(message, color = '#4caf50', duration = 3000) {
  const msgBox = document.getElementById('userlikeMsgBox');
  
  if (!msgBox) {
    console.warn('Message box element not found');
    return;
  }

  // Set message and color
  msgBox.textContent = message;
  // msgBox.style.backgroundColor = color;
  
  // Remove hidden class to show
  msgBox.classList.remove('userLikehidden');
  
  // Auto hide after duration
  setTimeout(() => {
    msgBox.classList.add('userLikehidden');
  }, duration);
}

/**
 * Alternative function with predefined types
 * @param {string} message - The message to display
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 */
function showMessage(message, type = 'success') {
  const colors = {
    success: '#4caf50',  // Green
    error: '#f44336',    // Red
    warning: '#ff9800',  // Orange
    info: '#2196f3'      // Blue
  };
  
  const color = colors[type] || colors.success;
  showLikeMessageBox(message, color);
}

// Make functions globally available
window.showLikeMessageBox = showLikeMessageBox;
window.showMessage = showMessage;