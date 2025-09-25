// --- Edit these ---
window.CONF = {
  API_URL: "https://script.google.com/macros/s/AKfycbyz0Rmdrej8FAamqVtqr9-mFdKIWnEFYFfyTznsrcirUXPt-_5TmhSYcwqHL29gT-Kd/exec", // <— from Apps Script
  EVENT_NAME: "Mortality Meeting - 26th of September",
  // The following are informational for the UI; the server is the source of truth.
  VENUE: {
    LAT: 30.0730394,
    LNG: 31.2788604,
    RADIUS_M: 150 // match your server during testing; tighten on-site
  }
};
