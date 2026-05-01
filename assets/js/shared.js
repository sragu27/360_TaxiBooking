
/**
 * SWIFTRIDE — shared.js
 * Clean + Structured Version
 * ✔ Google Distance API → exact fare
 */
'use strict';

let fareChecked = false;

/* =========================================================
   CONFIG (loaded from config.js)
========================================================= */
let CABS = [];

/* =========================================================
   🚖 LOAD CAB DATA (Supabase)
========================================================= */
async function loadCabs() {
  try {

     const table =
      currentTrip === 'roundtrip'
        ? 'roundtrip_cabs'
        : 'oneway_cabs';


    const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/${table}?is_active=eq.true`, {
      headers: {
        apikey: CONFIG.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${CONFIG.SUPABASE_ANON_KEY}`
      }
    });

    const data = await res.json();
    CABS = data;

    renderCabs(data);
    updateFleetPrices(data);
    updateTariffPrices(data);
    await loadPopularRoutes();
    await loadHourlyPackages();
  } catch (err) {
    console.error('❌ Failed to load cabs', err);
  }
}

/* =========================================================
   🎨 RENDER CAB UI
========================================================= */
function renderCabs(cabs) {
  const cabGrid = document.getElementById('cabGrid');
    if (!cabGrid) return;

  cabGrid.innerHTML = '';

  cabs.forEach((cab, index) => {
    const label = document.createElement('label');
    label.className = 'cab-card' + (index === 0 ? ' active' : '');

    label.innerHTML = `
      <input type="radio" name="cabType"
        value="${cab.name}"
        data-rate="${cab.price_per_km}"
        data-base="${cab.driver_allowance}"
        data-min="${cab.min_km}"
        ${index === 0 ? 'checked' : ''} />

      <i class="fas fa-car"></i>
      <span class="cab-name">${cab.name}</span>
      <span class="cab-rate">₹${cab.price_per_km}/km</span>
    `;

    cabGrid.appendChild(label);
  });
}

// Fleet page dynamic prices
function updateFleetPrices(cabs) {

  cabs.forEach(cab => {

    const el = document.querySelector(
      `[data-cab="${cab.name}"]`
    );

    if (el) {
      el.innerHTML = `₹${cab.price_per_km} <small>/km</small>`;
    }

  });

}


/* =========================================================
   💰 TARIFF PAGE DYNAMIC PRICES
========================================================= */
function updateTariffPrices(cabs) {

  cabs.forEach(cab => {

    document
      .querySelectorAll(`[data-cab-price="${cab.name}"]`)
      .forEach(el => {
        el.innerHTML = `₹${cab.price_per_km}`;
      });

    document
      .querySelectorAll(`[data-cab-min="${cab.name}"]`)
      .forEach(el => {
        el.textContent = `₹${cab.min_fare}`;
      });

  });

}

/* =========================================================
   🛣️ POPULAR ROUTES TABLE
========================================================= */
async function loadPopularRoutes() {

  try {

    const res = await fetch(
      `${CONFIG.SUPABASE_URL}/rest/v1/popular_routes?is_active=eq.true&order=id.asc`,
      {
        headers: {
          apikey: CONFIG.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${CONFIG.SUPABASE_ANON_KEY}`
        }
      }
    );

    const routes = await res.json();

    renderPopularRoutes(routes);

  } catch (err) {

    console.error('❌ Failed to load routes', err);

  }

}

function renderPopularRoutes(routes) {

  const tbody = document.getElementById('popularRoutesBody');

  if (!tbody) return;

  tbody.innerHTML = '';

  // Find cab rates dynamically
  const sedan  = CABS.find(c => c.name.toLowerCase().includes('sedan'));
  const suv    = CABS.find(c => c.name.toLowerCase().includes('suv'));
  const innova = CABS.find(c => c.name.toLowerCase().includes('innova'));

  routes.forEach(route => {

    const sedanFare  = sedan
      ? route.distance_km * sedan.price_per_km
      : 0;

    const suvFare = suv
      ? route.distance_km * suv.price_per_km
      : 0;

    const innovaFare = innova
      ? route.distance_km * innova.price_per_km
      : 0;

    tbody.innerHTML += `
      <tr>

        <td class="route-col">
          ${route.from_city} → ${route.to_city}
        </td>

        <td class="km-col">
          ${route.distance_km} km
        </td>

        <td class="price-col">
          ₹${sedanFare.toLocaleString('en-IN')}
        </td>

        <td class="price-col">
          ₹${suvFare.toLocaleString('en-IN')}
        </td>

        <td class="price-col">
          ₹${innovaFare.toLocaleString('en-IN')}
        </td>

        <td>
          <button
            onclick="fillRoute('${route.from_city}','${route.to_city}')"
            class="btn-navy"
            style="font-size:.72rem;padding:.4rem 1rem;"
          >
            Book
          </button>
        </td>

      </tr>
    `;

  });

}

function fillRoute(from, to) {

  const pickup = document.getElementById('pickupInput');
  const drop   = document.getElementById('dropInput');

  if (pickup) pickup.value = from;
  if (drop) drop.value = to;

  window.location.href = 'index.html#booking';

}

/* =========================================================
   🕒 HOURLY PACKAGES
========================================================= */
async function loadHourlyPackages() {

  try {

    const res = await fetch(
      `${CONFIG.SUPABASE_URL}/rest/v1/hourly_packages?is_active=eq.true&order=hours.asc`,
      {
        headers: {
          apikey: CONFIG.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${CONFIG.SUPABASE_ANON_KEY}`
        }
      }
    );

    const data = await res.json();


    renderHourlyPackages(data);

    setTimeout(() => {
      document.querySelectorAll('#hourlyPackagesGrid .reveal-up')
      .forEach(el => el.classList.add('in-view'));
    }, 100);

  } catch (err) {

    console.error('❌ Failed to load hourly packages', err);

  }

}

function renderHourlyPackages(packages) {

  const grid = document.getElementById('hourlyPackagesGrid');

  if (!grid) return;

  grid.innerHTML = '';

  // Use Sedan extra/km dynamically
  const sedan = CABS.find(
    c => c.name.toLowerCase().includes('sedan')
  );

  const extraRate = sedan
    ? sedan.price_per_km
    : 12;

  packages.forEach((pkg, index) => {

    const featuredClass = pkg.is_featured
      ? 'featured'
      : '';

    const buttonClass = pkg.is_featured
      ? 'btn-gold'
      : 'btn-outline-navy';

    const delayClass =
      index === 0
        ? ''
        : `d${index}`;

    grid.innerHTML += `

      <div class="col-sm-6 col-lg-3 reveal-up ${delayClass}">

        <div class="cab-price-card ${featuredClass} text-center">

          ${
            pkg.is_featured
              ? `
                <div
                  style="
                    font-size:.6rem;
                    font-weight:800;
                    color:var(--gold);
                    margin-bottom:.5rem;
                    background:rgba(244,192,45,.15);
                    padding:.2rem .7rem;
                    border-radius:50px;
                    display:inline-block
                  "
                >
                  Best Value
                </div>
              `
              : ''
          }

          <div class="cab-type-name">
            ${pkg.title}
          </div>

          <div
            class="per-km"
            style="
              font-size:1.5rem;
              ${pkg.is_featured
                ? 'color:var(--gold)!important'
                : ''}
            "
          >
            ₹${pkg.base_price.toLocaleString('en-IN')}

            <small
              style="
                font-size:.9rem;
                font-weight:400;
                color:${pkg.is_featured
                  ? 'rgba(255,255,255,.6)'
                  : 'var(--text-light)'
                }
              "
            >
              Sedan
            </small>

          </div>

          <div
            class="per-km-label"
            style="
              ${pkg.is_featured
                ? 'color:rgba(255,255,255,.6)'
                : ''}
            "
          >
            ${pkg.included_km} km included
            · ₹${extraRate}/km extra
          </div>

          <a
            href="index.html#booking"
            class="${buttonClass} mt-3 w-100 justify-content-center"
          >
            Book ${pkg.hours}hr
          </a>

        </div>

      </div>

    `;

  });

}


/* =========================================================
   💰 FARE INQUIRY TELEGRAM
========================================================= */
async function sendFareInquiry(name, phone, pickup, drop, tripType, fare, dist) {
  try {
    const text = [
      `💰 <b>FARE INQUIRY — 360 Cabs</b>`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `👤 <b>Name:</b> ${name}`,
      `📞 <b>Phone:</b> ${phone}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📍 <b>Pickup:</b> ${pickup}`,
      `📍 <b>Drop:</b> ${drop}`,
      `🗺️ <b>Trip:</b> ${tripType}`,
      `📏 <b>Distance:</b> ~${dist} km`,
      `💰 <b>Quoted Fare:</b> ~₹${fare.toLocaleString('en-IN')}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `⚠️ <b>Not booked yet!</b>`,
      `📞 <b>Call now to convert!</b>`,
    ].filter(Boolean).join('\n');

    await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id:    CONFIG.TELEGRAM_CHAT_ID,
        parse_mode: 'HTML',
        text:       text
      })
    });
    console.log('✅ Fare inquiry sent');
  } catch(e) {
    console.warn('❌ Fare inquiry failed:', e);
  }
}




/* =========================================================
   📍 STATE VARIABLES
========================================================= */
let currentTrip = 'oneway';
let pickupCoords = null;
let dropCoords = null;
const todayStr = new Date().toISOString().split('T')[0];

/* =========================================================
   🌍 GOOGLE DISTANCE (REAL DISTANCE)
========================================================= */
/* async function getDistanceKm(origin, destination) {
  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lon}&destinations=${destination.lat},${destination.lon}&units=metric&key=${CONFIG.GOOGLE_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK") throw new Error();

    const meters = data.rows[0].elements[0].distance.value;

    return Math.round(meters / 1000); // ✅ closest to Maps UI

  } catch (err) {
    console.warn("⚠️ Distance Matrix failed → fallback used");

    return Math.round(
      haversineKm(origin.lat, origin.lon, destination.lat, destination.lon) * 1.2
    );
  }
} */

async function getDistanceKm(origin, destination) {

  try {

    const directionsService =
      new google.maps.DirectionsService();

    const result = await directionsService.route({
      origin: {
        lat: origin.lat,
        lng: origin.lon
      },

      destination: {
        lat: destination.lat,
        lng: destination.lon
      },

      travelMode: google.maps.TravelMode.DRIVING
    });

    const route = result.routes[0];

    const meters = route.legs.reduce(
      (sum, leg) => sum + leg.distance.value,
      0
    );

    return Math.round(meters / 1000);

  } catch (err) {

    console.warn(
      "⚠️ Directions API failed → fallback used"
    );

    return Math.round(
      haversineKm(
        origin.lat,
        origin.lon,
        destination.lat,
        destination.lon
      ) * 1.15
    );

  }

}

 

/* =========================================================
   📐 FALLBACK DISTANCE (Haversine)
========================================================= */
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = d => d * Math.PI / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* =========================================================
   🚕 GET SELECTED CAB
========================================================= */
function getSelectedCab() {
  const r = document.querySelector('input[name="cabType"]:checked');

  return r ? {
    name: r.value,
    rate: parseFloat(r.dataset.rate) || 0,
    allowance: parseFloat(r.dataset.base) || 0,
    minKm: parseFloat(r.dataset.min) || 0
  } : null;
}

/* =========================================================
   💰 CALCULATE FARE (GOOGLE BASED)
========================================================= */
/* async function recalcFare() {
  const fareBox = document.getElementById('fareBox');

  if (!pickupCoords || !dropCoords || currentTrip === 'hourly' || !fareChecked) {
    fareBox.style.display = 'none';
    return null;
  }

  const cab = getSelectedCab();
  if (!cab) return null;

  const dist = await getDistanceKm(pickupCoords, dropCoords);

  const billableKm = Math.max(dist, cab.minKm);

  let fare = (billableKm * cab.rate) + cab.allowance;


  if (currentTrip === 'roundtrip') {
    fare = Math.ceil(fare * 2);
  }

  document.getElementById('fareDistance').textContent = `~${dist} km`;
  document.getElementById('fareMinKm').textContent = `~${cab.minKm} km `;
  document.getElementById('fareAllowance').textContent = `₹${cab.allowance.toLocaleString('en-IN')}`;
  document.getElementById('fareAmount').textContent = `₹${fare.toLocaleString('en-IN')}`;

  fareBox.style.display = 'block';

  return { dist, fare, cab: cab.name };
} */

  async function recalcFare() {

  const fareBox = document.getElementById('fareBox');

  if (
    !pickupCoords ||
    !dropCoords ||
    currentTrip === 'hourly' ||
    !fareChecked
  ) {
    fareBox.style.display = 'none';
    return null;
  }

  const cab = getSelectedCab();

  if (!cab) return null;

  // One-way distance from Google
  const dist = await getDistanceKm(
    pickupCoords,
    dropCoords
  );

  let totalDays = 1;
  let billableKm = dist;
  let allowance = cab.allowance;

  // ROUNDTRIP LOGIC
  if (currentTrip === 'roundtrip') {

    const travelDate =
      document.getElementById('travelDate')?.value;

    const returnDate =
      document.getElementById('returnDate')?.value;

    // Calculate total days
    if (travelDate && returnDate) {

      const start = new Date(travelDate);

      const end = new Date(returnDate);

      totalDays = Math.floor((end - start) /(1000 * 60 * 60 * 24)) + 1;

      // Safety fallback
      if (totalDays < 1) {
        totalDays = 1;
      }

    }

    // Actual travel km (up + down)
    const actualRoundtripKm =
      dist * 2;

    // Minimum km policy
    const minimumTripKm = cab.minKm * totalDays;

    // Professional commercial billing
    billableKm = Math.max(
      actualRoundtripKm,
      minimumTripKm
    );

    // Driver allowance per day
    allowance = cab.allowance * totalDays;

  }

  // ONEWAY LOGIC
  else {

    billableKm = Math.max(
      dist,
      cab.minKm
    );

  }

  // FINAL FARE
  let fare = (billableKm * cab.rate) + allowance;

  fare = Math.ceil(fare);

  // UI UPDATE
  /* document.getElementById('fareDistance').textContent =
    `~${dist} km`;

  document.getElementById('fareMinKm').textContent =
    currentTrip === 'roundtrip'
      ? `${cab.minKm} km/day`
      : `${cab.minKm} km`;

  document.getElementById(
    'fareAllowance'
  ).textContent =
    `₹${allowance.toLocaleString('en-IN')}`;

  document.getElementById(
    'fareAmount'
  ).textContent =
    `₹${fare.toLocaleString('en-IN')}`; */

    // Trip labels
const tripLabels = {
  oneway: 'One Way',
  roundtrip: 'Round Trip',
  airport: 'Airport Transfer',
  hourly: 'Hourly Rental'
};

// Input text
const pickupText =
  document.getElementById('pickupInput')?.value || '—';

const dropText =
  document.getElementById('dropInput')?.value || '—';

// UI UPDATE
document.getElementById('fareCabType').textContent =
  cab.name;

document.getElementById('fareTripType').textContent =
  tripLabels[currentTrip] || currentTrip;

document.getElementById('fareRoute').textContent =
  `${pickupText} → ${dropText}`;

document.getElementById('fareDistance').textContent =
  `~${dist} km`;

document.getElementById('fareAmount').textContent =
  `₹${fare.toLocaleString('en-IN')}`;

// Hidden future fields
document.getElementById('fareMinKm').textContent =
  currentTrip === 'roundtrip'
    ? `${cab.minKm} km/day`
    : `${cab.minKm} km`;

document.getElementById('fareAllowance').textContent =
  `₹${allowance.toLocaleString('en-IN')}`;

  fareBox.style.display = 'block';

  return {
    dist,
    fare,
    cab: cab.name,
    totalDays,
    billableKm
  };

}




/* =========================================================
   📍 GOOGLE AUTOCOMPLETE
========================================================= */
/* function setupGoogleAutocomplete(inputId, setter) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const auto = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: "in" }
  });

  auto.addListener("place_changed", async  () => {
    const place = auto.getPlace();
    if (!place.geometry) return;

    const coords = {
      lat: place.geometry.location.lat(),
      lon: place.geometry.location.lng()
    };

    setter(coords);
    //await recalcFare();
    if (fareChecked) await recalcFare();
  });
} */

 

  function setupGoogleAutocomplete(inputId, setter) {

  const input = document.getElementById(inputId);

  if (!input) return;

  const autocomplete = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: "in" },
    fields: ["geometry", "formatted_address", "name"]
  });

  autocomplete.addListener("place_changed", async () => {

    const place = autocomplete.getPlace();

    if (!place.geometry) return;

    const coords = {
      lat: place.geometry.location.lat(),
      lon: place.geometry.location.lng()
    };

    setter(coords);

    // show selected address
    input.value =
      place.formatted_address ||
      place.name;

    if (fareChecked) {
      await recalcFare();
    }

  });

}

/* =========================================================
   📦 BOOKING SAVE FLOW
========================================================= */
async function saveToSupabase(b) {
  try {
    const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        CONFIG.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
        'Prefer':        'return=minimal'
      },
      body: JSON.stringify({
        name:          b.name,
        phone:         b.phone,
        email:         b.email,
        trip_type:     b.tripType,
        pickup:        b.pickup,
        drop_location: b.drop,
        date:          b.date,
        time:          b.time,
        return_date:   b.returnDate,
        cab_type:      b.cabType,
        fare:          b.fare,
      })
    });
    if (res.ok) console.log('✅ Saved to Supabase');
    else console.warn('❌ Supabase error:', await res.text());
  } catch(e) {
    console.warn('❌ Supabase failed:', e);
  }
}
async function sendTelegram(b) {

  try {
    const text = [
      `🚖 <b>NEW BOOKING — 360 Cabs</b>`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `👤 <b>Name:</b> ${b.name}`,
      `📞 <b>Phone:</b> ${b.phone}`,
      b.email ? `📧 <b>Email:</b> ${b.email}` : '',
      `━━━━━━━━━━━━━━━━━━━━`,
      `🗺️ <b>Trip:</b> ${b.tripType}`,
      `📍 <b>Pickup:</b> ${b.pickup}`,
      `📍 <b>Drop:</b> ${b.drop}`,
      `📅 <b>Date:</b> ${b.date} @ ${b.time}`,
      b.returnDate !== 'N/A' ? `🔄 <b>Return:</b> ${b.returnDate}` : '',
      `🚗 <b>Cab:</b> ${b.cabType}`,
      `💰 <b>Fare:</b> ${b.fare}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `⏰ <b>Booked:</b> ${b.timestamp}`,
    ].filter(Boolean).join('\n');

    const res = await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id:    CONFIG.TELEGRAM_CHAT_ID,
        parse_mode: 'HTML',
        text:       text
      })
    });
    if (res.ok) console.log('✅ Telegram sent');
    else console.warn('❌ Telegram error:', await res.text());
  } catch(e) {
    console.warn('❌ Telegram failed:', e);
  }
 }

async function sendEmail(b) { 
  if (!b.email) return;

  try {
    const res = await fetch(CONFIG.RESEND_EMAIL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': CONFIG.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(b),
    });

    if (res.ok) {
      console.log('✅ Email sent');
    } else {
      console.warn('❌ Email failed');
      console.log(await res.text());
    }
  } catch (e) {
    console.warn('❌ Error sending email:', e);
  }

 }


 function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const inc    = target / (2000 / 16);
  let cur = 0;
  const t = setInterval(() => {
    cur += inc;
    if (cur >= target) { cur = target; clearInterval(t); }
    el.textContent = Math.floor(cur).toLocaleString('en-IN') + suffix;
  }, 16);
}



function showToast() {
  const t = document.getElementById('successToast');
  if (t) { t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 6000); }
}

function closeToast() { 
  document.getElementById('successToast')?.classList.remove('show'); 
}

function showAlert(msg, type) {
  document.querySelector('.booking-alert')?.remove();
  const el = document.createElement('div');
  el.className = 'booking-alert';
  el.style.cssText = `padding:.75rem 1rem;margin-bottom:1rem;border-radius:8px;font-size:.82rem;
    background:${type==='error'?'#fff5f5':'#f0fdf4'};
    border:2px solid ${type==='error'?'#feb2b2':'#86efac'};
    color:${type==='error'?'#c53030':'#166534'};font-weight:600;`;
  el.innerHTML = `<i class="fas fa-${type==='error'?'exclamation-circle':'check-circle'} me-2"></i>${msg}`;
  const btn = document.getElementById('bookBtn');
  if (btn) btn.parentNode.insertBefore(el, btn);
  setTimeout(() => el.remove(), 5000);
}




/* =========================================================
   🚀 INIT APP
========================================================= */
document.addEventListener('DOMContentLoaded', function () {

 const needsCabData =
  document.getElementById('cabGrid') ||
  document.querySelector('[data-cab]') ||
  document.querySelector('[data-cab-price]') ||
  document.querySelector('[data-cab-min]') ||
  document.getElementById('hourlyPackagesGrid');

  //console.log(needsCabData);

if (needsCabData) {
  loadCabs();
}

  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('sticky', window.scrollY > 80);
    }, { passive: true });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const off = (navbar ? navbar.offsetHeight : 0) + 10;
      window.scrollTo({ top: target.offsetTop - off, behavior: 'smooth' });
      const navMenu = document.getElementById('navMenu');
      if (navMenu?.classList.contains('show')) bootstrap.Collapse.getInstance(navMenu)?.hide();
    });
  });

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

  window.addEventListener('load', () => {
    document.querySelectorAll('.hero-animate').forEach((el, i) => {
      setTimeout(() => el.classList.add('in-view'), 150 + i * 120);
    });
  });

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link-custom').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('active-page');
    }
  });

  // Booking widget interactions

  const tripTabsEl = document.querySelector('.trip-tabs');
  if (tripTabsEl) {
    tripTabsEl.addEventListener('click', async function (e) {
      const tab = e.target.closest('.trip-tab');
      if (!tab) return;
      document.querySelectorAll('.trip-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTrip = tab.dataset.trip;

      await loadCabs();
      await recalcFare();

      const returnWrap = document.getElementById('returnDateWrap');
      const dropWrap   = document.getElementById('dropWrap');
      const swapRow    = document.getElementById('swapRow');
      if (returnWrap) returnWrap.style.display = (currentTrip === 'roundtrip') ? 'block' : 'none';
      if (dropWrap)   dropWrap.style.display   = (currentTrip === 'hourly')    ? 'none'  : 'block';
      if (swapRow)    swapRow.style.display    = (currentTrip === 'hourly')    ? 'none'  : 'flex';
      const dropInput = document.getElementById('dropInput');
      if (dropInput) {
        dropInput.placeholder = (currentTrip === 'airport')
          ? 'Enter airport (e.g. Chennai Airport)'
          : 'Enter destination city or address';
      }
      await recalcFare();
    });
  }

 /*  const cabGridEl = document.querySelector('.cab-grid');
  if (cabGridEl) {
    cabGridEl.addEventListener('click', async function (e) {
      const card = e.target.closest('.cab-card');
      if (!card) return;
      document.querySelectorAll('.cab-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
       await recalcFare();
    });
  } */ 

  document.addEventListener('change', async (e) => {

  if (e.target.matches('input[name="cabType"]')) {

    document.querySelectorAll('.cab-card')
      .forEach(c => c.classList.remove('active'));

    e.target.closest('.cab-card')
      ?.classList.add('active');

    if (fareChecked) {
      await recalcFare();
    }

  }

});

 

  const swapBtn = document.getElementById('swapBtn');
  if (swapBtn) {
    swapBtn.addEventListener('click', async () => {
      const pi = document.getElementById('pickupInput');
      const di = document.getElementById('dropInput');
      if (!pi || !di) return;
      [pi.value, di.value] = [di.value, pi.value];
      [pickupCoords, dropCoords] = [dropCoords, pickupCoords];
      await recalcFare();
    });
  }

  ['travelDate', 'returnDate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.min = todayStr; if (id === 'travelDate') el.value = todayStr; }
  });


  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name   = document.getElementById('passengerName')?.value.trim();
      const phone  = document.getElementById('passengerPhone')?.value.trim();
      const email  = document.getElementById('passengerEmail')?.value.trim() || '';
      const pickup = document.getElementById('pickupInput')?.value.trim();
      const drop   = document.getElementById('dropInput')?.value.trim();
      const date   = document.getElementById('travelDate')?.value;
      const time   = document.getElementById('travelTime')?.value;
      const ret    = document.getElementById('returnDate')?.value || '';

      if (!name || !phone || !pickup || !date || !time) {
        showAlert('Please fill all required fields.', 'error'); return;
      }
      if (currentTrip !== 'hourly' && !drop) {
        showAlert('Please enter drop location.', 'error'); return;
      }

      const fareInfo  = await recalcFare();
      const cab       = getSelectedCab();
      const tripLabel = {
        oneway: 'One Way Drop', roundtrip: 'Round Trip',
        airport: 'Airport Transfer', hourly: 'Hourly Package'
      }[currentTrip];

      const booking = {
        name, phone, email, pickup,
        drop:       drop || 'N/A',
        tripType:   tripLabel,
        date, time,
        returnDate: ret || 'N/A',
        cabType:    cab.name,
        fare:       fareInfo
                      ? `~₹${fareInfo.fare.toLocaleString('en-IN')} (~${fareInfo.dist} km)`
                      : 'To be confirmed',
        timestamp:  new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      };

      const btn = document.getElementById('bookBtn');
      if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Confirming...'; }

      await Promise.allSettled([
        saveToSupabase(booking),
        sendTelegram(booking),
        sendEmail(booking),
      ]);

      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-bolt me-2"></i>Book Now — Instant Confirm'; }

      showToast();
      this.reset();
      pickupCoords = dropCoords = null;
      currentTrip = 'oneway';

      fareChecked = false; // ← reset flag
      const checkFareBtnEl = document.getElementById('checkFareBtn');
      const bookBtnEl = document.getElementById('bookBtn');

      if (checkFareBtnEl) {
        checkFareBtnEl.style.display = 'block';
        checkFareBtnEl.disabled = false;
        checkFareBtnEl.innerHTML = '<i class="fas fa-calculator me-2"></i>Check Fare & Proceed';
      }
    if (bookBtnEl) {
       bookBtnEl.style.display = 'none';
    }


      document.querySelectorAll('.trip-tab').forEach(t => t.classList.remove('active'));
      document.querySelector('.trip-tab[data-trip="oneway"]')?.classList.add('active');
      document.querySelectorAll('.cab-card').forEach(c => c.classList.remove('active'));
      document.querySelector('.cab-card:first-child')?.classList.add('active');
      const fareBox = document.getElementById('fareBox');
      if (fareBox) fareBox.style.display = 'none';
      const tdEl = document.getElementById('travelDate');
      if (tdEl) tdEl.value = todayStr;
    });
  }


  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));


  /* ── Check Fare Button ── */
const checkFareBtn = document.getElementById('checkFareBtn');
if (checkFareBtn) {
  checkFareBtn.addEventListener('click', async function () {

    const name   = document.getElementById('passengerName')?.value.trim();
    const phone  = document.getElementById('passengerPhone')?.value.trim();
    const pickup = document.getElementById('pickupInput')?.value.trim();
    const drop   = document.getElementById('dropInput')?.value.trim();

    const termsAccepted =
    document.getElementById('termsAccept')?.checked;

    if (!termsAccepted) {
      showAlert(
        'Please accept Terms & Privacy Policy before proceeding.',
        'error'
      );
      return;
    }

    // Validate
    if (!name || !phone) {
      showAlert('Please enter your name and phone number first.', 'error');
      return;
    }
    if (!pickup || !pickupCoords) {
      showAlert('Please select pickup location from dropdown.', 'error');
      return;
    }
    if (currentTrip !== 'hourly' && (!drop || !dropCoords)) {
      showAlert('Please select drop location from dropdown.', 'error');
      return;
    }

    // Show loading
    checkFareBtn.disabled = true;
    checkFareBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Calculating fare...';

    fareChecked = true;

    // Calculate fare
    const fareInfo = await recalcFare();

    if (!fareInfo) {
      checkFareBtn.disabled = false;
      checkFareBtn.innerHTML = '<i class="fas fa-calculator me-2"></i>Check Fare & Proceed';
      showAlert('Could not calculate fare. Please try again.', 'error');
      return;
    }

    const tripLabel = {
      oneway: 'One Way Drop', roundtrip: 'Round Trip',
      airport: 'Airport Transfer', hourly: 'Hourly Package'
    }[currentTrip];

    // Send inquiry to Telegram
    await sendFareInquiry(
      name, phone, pickup, drop || 'N/A',
      tripLabel, fareInfo.fare, fareInfo.dist
    );

    // Show Book Now button
    document.getElementById('bookBtn').style.display = 'block';

    // Hide Check Fare button
    checkFareBtn.style.display = 'none';

    // Show success message
    showAlert('Fare calculated! Proceed to book below.', 'success');
  });


}

 /* =========================================================
    AUTO RECALCULATE FARE ON FIELD CHANGE
========================================================= */

[
  'travelDate',
  'returnDate',
  'travelTime'
].forEach(id => {

  const el = document.getElementById(id);

  if (!el) return;

  el.addEventListener('change', async () => {

    if (fareChecked) {
      await recalcFare();
    }

  });

});



});



function initAutocomplete() {
  setupGoogleAutocomplete('pickupInput', c => { pickupCoords = c; });
  setupGoogleAutocomplete('dropInput',   c => { dropCoords   = c; });
}


window.initGoogleMaps = function () {
  initAutocomplete();
};

// contact page FAQ
function toggleFaq(el) {

  const item = el.parentElement;

  document.querySelectorAll('.faq-item').forEach(faq => {

    if (faq !== item) {
      faq.classList.remove('active');
    }

  });

  item.classList.toggle('active');

}




















