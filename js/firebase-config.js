// Firebase Configuration & Initialization Script
// Supporting standard Firebase Web SDK (v10 modular / compat API)

const firebaseConfig = {
  apiKey: "AIzaSyDEMO_KEY_REPLACE_WITH_YOURS",
  authDomain: "spoken-english-level1.firebaseapp.com",
  projectId: "spoken-english-level1",
  storageBucket: "spoken-english-level1.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Global handles for Firebase services
let firebaseApp = null;
let firebaseAuth = null;
let firebaseFirestore = null;
let isFirebaseAvailable = false;

function initFirebase() {
  try {
    if (typeof firebase !== 'undefined') {
      firebaseApp = firebase.initializeApp(firebaseConfig);
      firebaseAuth = firebase.auth();
      firebaseFirestore = firebase.firestore();
      
      // Check if real keys are provided (not demo string)
      if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('DEMO_KEY')) {
        isFirebaseAvailable = true;
        console.log("Firebase initialized successfully with live backend.");
      } else {
        console.log("Firebase initialized in Local/Demo Mode. Using browser storage backend.");
      }
    } else {
      console.warn("Firebase SDK script tag not detected. App running seamlessly in Local Storage mode.");
    }
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

// Auto-run initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFirebase);
} else {
  initFirebase();
}
