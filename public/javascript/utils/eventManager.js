// ============================================
// EVENT MANAGER - Reusable Event System
// ============================================
class EventManager {
  constructor() {
    this.events = {};
  }

  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => callback(data));
    } else {
      console.warn(`⚠️ EventManager: No listeners for "${eventName}"`);
    }
  }

  off(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    }
  }
}

// Global instance
window.eventManager = new EventManager();



// // ============================================
// // EVENT MANAGER - Reusable Event System
// // ============================================
// class EventManager {
//   constructor() {
//     this.events = {};
//   }

//   on(eventName, callback) {
//     if (!this.events[eventName]) {
//       this.events[eventName] = [];
//       console.log(`📝 EventManager: Registering new event "${eventName}"`);
//     }
//     this.events[eventName].push(callback);
//     console.log(`✅ EventManager: Listener added to "${eventName}" (Total: ${this.events[eventName].length})`);
//     console.log(`Event Name -> ${this.events[eventName]} , Callback Name ${callback}`);
//   }

//   emit(eventName, data) {
//     if (this.events[eventName]) {
//       console.log(`🔔 EventManager: Emitting "${eventName}" to ${this.events[eventName].length} listener(s)`);
//       this.events[eventName].forEach(callback => callback(data));
//     } else {
//       console.warn(`⚠️ EventManager: No listeners for "${eventName}"`);
//     }
//   }

//   off(eventName, callback) {
//     if (this.events[eventName]) {
//       this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
//     }
//   }
// }

// // Global instance
// window.eventManager = new EventManager();