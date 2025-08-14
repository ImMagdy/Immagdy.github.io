// --- Edit these ---
window.CONF = {
  API_URL: "https://script.google.com/macros/s/AKfycbxR2DQkYYIQME0A3PbgAYDk50R5p2H7Iapdxgf37ghGxRaCoztl_pbjRMZw8_qXY2DS/exec", // <— from Apps Script
  EVENT_NAME: "Morbidity and Mortality — Aug 15, 2025",
  // The following are informational for the UI; the server is the source of truth.
  VENUE: {
    LAT: 30.0768402,
    LNG: 31.2907355,
    RADIUS_M: 9000 // match your server during testing; tighten on-site
  }
};
