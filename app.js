(function () {
  const API_URL = window.CONF.API_URL;
  const EVENT_NAME = window.CONF.EVENT_NAME;

  const eventLabel = document.getElementById("eventLabel");
  const locStatusEl = document.getElementById("locStatus");
  const retryBtn = document.getElementById("retryBtn");
  const formSection = document.getElementById("formSection");
  const submitBtn = document.getElementById("submitBtn");
  const msgEl = document.getElementById("msg");
  const titleEl = document.getElementById("title");

  // UI init
  titleEl.textContent = "Attendance Check";
  eventLabel.textContent = `Event: ${EVENT_NAME}`;

  let gps = { lat: null, lon: null };

  window.addEventListener("load", getLocation);
  retryBtn.addEventListener("click", getLocation);
  submitBtn.addEventListener("click", submitAttendance);

  function getLocation() {
    clearMsg();
    retryBtn.classList.add("hidden");
    locStatusEl.textContent = "Requesting your location… please allow access.";
    formSection.classList.add("hidden");
    submitBtn.disabled = true;

    if (!("geolocation" in navigator)) {
      locStatusEl.innerHTML = err("Geolocation not supported on this device.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        gps.lat = pos.coords.latitude;
        gps.lon = pos.coords.longitude;
        locStatusEl.innerHTML = ok("Location confirmed. Please fill the form.");
        formSection.classList.remove("hidden");
        submitBtn.disabled = false;
      },
      (e) => {
        locStatusEl.innerHTML = err(`Location failed: ${e && e.message ? e.message : "Unknown error"}`) +
          `<br><span class="muted">Enable Location Services and allow the browser to access your location, then tap Retry.</span>`;
        retryBtn.classList.remove("hidden");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }

  function sanitize(s) {
    return (s || "").replace(/\s+/g, " ").trim();
  }

  function submitAttendance() {
    const name = sanitize(document.getElementById("name").value);
    const yearBatch = sanitize(document.getElementById("yearBatch").value);

    if (!name) return setMsg(err("Please enter your name."));
    if (!yearBatch) return setMsg(err("Please enter your year batch."));

    submitBtn.disabled = true;
    setMsg("Submitting…");

    // Avoid CORS preflight: send as text/plain
    const payload = { name, yearBatch, lat: gps.lat, lon: gps.lon, event: EVENT_NAME };
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
      cache: "no-store",
      keepalive: false
    })
    .then(r => r.json())
    .then(res => {
      if (res && res.status === "success") {
        setMsg(ok(res.message));
        formSection.classList.add("hidden");
        try { localStorage.setItem(`attendance_${EVENT_NAME}::${name.toLowerCase()}`, "1"); } catch (_) {}
      } else {
        submitBtn.disabled = false;
        setMsg(err(res && res.message ? res.message : "Submission failed."));
      }
    })
    .catch(e => {
      submitBtn.disabled = false;
      setMsg(err(`Error: ${String(e)}`));
    });
  }

  function ok(t) { return `<span class="ok">${t}</span>`; }
  function err(t) { return `<span class="err">${t}</span>`; }
  function setMsg(html) { msgEl.innerHTML = html; }
  function clearMsg() { msgEl.innerHTML = ""; }
})();
