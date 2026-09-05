/**
 * PocketBase Configuration & Initialization Script
 * Official PocketBase Web SDK Integration (https://pocketbase.io)
 */

// Default PocketBase Server Endpoint (Change this to your live PocketBase URL, e.g., https://my-app.pockethost.io)
const POCKETBASE_URL = "http://127.0.0.1:8090";

let pb = null;
let isPocketBaseAvailable = false;

function initPocketBase() {
  try {
    if (typeof PocketBase !== 'undefined') {
      pb = new PocketBase(POCKETBASE_URL);
      
      // Auto-cancellation disable for batch client requests
      pb.autoCancellation(false);

      // Ping health check to verify if live server is reachable
      pb.health.check().then(() => {
        isPocketBaseAvailable = true;
        console.log(`PocketBase connected successfully to ${POCKETBASE_URL}`);
      }).catch(() => {
        console.log(`PocketBase server at ${POCKETBASE_URL} unreachable. Operating in persistent local storage mode.`);
      });
    } else {
      console.warn("PocketBase SDK script not detected. Operating in persistent local storage mode.");
    }
  } catch (error) {
    console.error("PocketBase initialization error:", error);
  }
}

// Auto-run initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPocketBase);
} else {
  initPocketBase();
}
