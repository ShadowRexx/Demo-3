// ============================================
// RN SPORTS HUB — Firebase Setup
// Replace config values after client Firebase project is created
// ============================================

let db = null;
let isConfigured = false;

const firebaseConfig = {
  apiKey: "REPLACE_WITH_CLIENT_API_KEY",
  authDomain: "REPLACE_WITH_CLIENT_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_CLIENT_PROJECT_ID",
  storageBucket: "REPLACE_WITH_CLIENT_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_CLIENT_SENDER_ID",
  appId: "REPLACE_WITH_CLIENT_APP_ID"
};

// Only try to connect if config has been filled in
if (!firebaseConfig.apiKey.includes("REPLACE_WITH")) {
  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
    const { getFirestore } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isConfigured = true;
    console.log("[Firebase] Connected successfully.");
  } catch (err) {
    console.warn("[Firebase] Init failed, running with dummy data:", err.message);
  }
} else {
  console.info("[Firebase] Config not set. Running in demo mode with dummy products.");
}

export { db, isConfigured };
