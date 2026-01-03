/* ================= JAM & TANGGAL REALTIME ================= */
function updateClock() {
  const now = new Date();

  document.getElementById("clock").innerText = now.toLocaleTimeString("id-ID");

  document.getElementById("date").innerText = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

setInterval(updateClock, 1000);
updateClock();

/* ================= BACKGROUND OTOMATIS ================= */
const backgrounds = ["images/bg1.png", "images/bg2.png", "images/bg3.png"];

let bgIndex = 0;
const hero = document.querySelector(".hero");

function changeBackground() {
  hero.style.opacity = 0;

  setTimeout(() => {
    hero.style.backgroundImage = `url(${backgrounds[bgIndex]})`;
    hero.style.opacity = 1;
    bgIndex = (bgIndex + 1) % backgrounds.length;
  }, 600);
}

hero.style.transition = "opacity 0.6s ease-in-out";
changeBackground();
setInterval(changeBackground, 10000);

/* ================= JADWAL SHOLAT (API JONGGOL) ================= */
let prayerTimes = {};

fetch(
  "https://api.aladhan.com/v1/timings?latitude=-6.4846&longitude=107.0166&method=20"
)
  .then((res) => res.json())
  .then((data) => {
    const t = data.data.timings;

    prayerTimes = {
      Subuh: t.Fajr,
      Syuruq: t.Sunrise,
      Dzuhur: t.Dhuhr,
      Ashar: t.Asr,
      Maghrib: t.Maghrib,
      Isya: t.Isha,
    };

    document.getElementById("subuh").innerText = t.Fajr;
    document.getElementById("syuruq").innerText = t.Sunrise;
    document.getElementById("dzuhur").innerText = t.Dhuhr;
    document.getElementById("ashar").innerText = t.Asr;
    document.getElementById("maghrib").innerText = t.Maghrib;
    document.getElementById("isya").innerText = t.Isha;

    updateNextPrayerCountdown();
    setInterval(updateNextPrayerCountdown, 1000);
  })
  .catch(() => {
    console.error("Gagal mengambil jadwal sholat");
  });

/* ================= COUNTDOWN RAMADHAN ================= */
const ramadhanDate = new Date("2026-03-18");

function updateRamadhanCountdown() {
  const now = new Date();
  const diff = ramadhanDate - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  document.getElementById("ramadhanCountdown").innerText =
    days > 0
      ? `${days} Hari Menuju Bulan Suci Ramadhan`
      : "Ramadhan Telah Tiba";
}

updateRamadhanCountdown();

/* ================= COUNTDOWN SHOLAT TERDEKAT ================= */
function updateNextPrayerCountdown() {
  const now = new Date();

  for (const [name, time] of Object.entries(prayerTimes)) {
    const [h, m] = time.split(":");
    const prayerTime = new Date();
    prayerTime.setHours(h, m, 0);

    if (prayerTime > now) {
      const diff = prayerTime - now;

      const hLeft = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const mLeft = String(Math.floor((diff % 3600000) / 60000)).padStart(
        2,
        "0"
      );
      const sLeft = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");

      document.getElementById("nextPrayer").innerText = name;
      document.getElementById(
        "nextCountdown"
      ).innerText = `${hLeft}:${mLeft}:${sLeft}`;
      return;
    }
  }

  document.getElementById("nextPrayer").innerText = "Subuh";
  document.getElementById("nextCountdown").innerText = "--:--:--";
}

function highlightCurrentPrayer() {
  const now = new Date();
  const prayerMap = {
    subuh: document.getElementById("subuh").innerText,
    dzuhur: document.getElementById("dzuhur").innerText,
    ashar: document.getElementById("ashar").innerText,
    maghrib: document.getElementById("maghrib").innerText,
    isya: document.getElementById("isya").innerText,
  };

  document.querySelectorAll(".jadwal-item").forEach((el) => {
    el.classList.remove("active");
  });

  for (let key in prayerMap) {
    const [h, m] = prayerMap[key].split(":");
    const t = new Date();
    t.setHours(h, m, 0);
    if (now < t) {
      document.getElementById(key).parentElement.classList.add("active");
      break;
    }
  }
}

setInterval(highlightCurrentPrayer, 60000);
