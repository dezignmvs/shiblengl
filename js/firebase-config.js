/**
 * Firebase Configuration & Initialization Script
 * Uses Firebase Web SDK (v10 Compat)
 */

const firebaseConfig = {
  apiKey: "AIzaSyAvYJSaGLSqInY41ZD5GkCqnI2gh2OZYQ0",
  authDomain: "mediacap-1.firebaseapp.com",
  projectId: "mediacap-1",
  storageBucket: "mediacap-1.firebasestorage.app",
  messagingSenderId: "732036687295",
  appId: "1:732036687295:web:da3565e8a1a6590f64ad0a",
  measurementId: "G-PC6H12M9NQ"
};

// Global handles for Firebase services
let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;
let isFirebaseAvailable = false;

function initFirebase() {
  try {
    if (typeof firebase !== 'undefined') {
      firebaseApp = firebase.initializeApp(firebaseConfig);
      firebaseAuth = firebase.auth();
      firebaseDb = firebase.firestore();
      
      isFirebaseAvailable = true;
      console.log("Firebase initialized successfully with project:", firebaseConfig.projectId);

      // Trigger DB sync if DB service exists
      if (typeof db !== 'undefined' && db && typeof db.syncFromFirebase === 'function') {
        db.syncFromFirebase();
      }
    } else {
      console.warn("Firebase SDK script tag not detected. App running in Local Storage mode.");
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

// Auto-run initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFirebase);
} else {
  initFirebase();
}
