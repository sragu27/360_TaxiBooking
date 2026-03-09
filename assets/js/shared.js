/**
 * SWIFTRIDE — shared.js
 * ⚠️  NO SECRET KEYS HERE — keys are in config.js (gitignored)
 * This file is safe to push to GitHub
 */
'use strict';

// CONFIG is loaded from assets/js/config.js (gitignored)
// Make sure config.js is loaded BEFORE shared.js in HTML

/* ══════════════════════════════════════════
   STATE VARIABLES
══════════════════════════════════════════ */
let currentTrip  = 'oneway';
let pickupCoords = null;
let dropCoords   = null;
let debounceT    = {};
const todayStr   = new Date().toISOString().split('T')[0];

/* ══════════════════════════════════════════
   TAMIL NADU CITIES FALLBACK
══════════════════════════════════════════ */
const TN_CITIES = [
  // ── Major Cities ──────────────────────────────────────
  { name: 'Chennai',                          state: 'Tamil Nadu',     lat: 13.0827, lon: 80.2707 },
  { name: 'Coimbatore',                       state: 'Tamil Nadu',     lat: 11.0168, lon: 76.9558 },
  { name: 'Madurai',                          state: 'Tamil Nadu',     lat:  9.9252, lon: 78.1198 },
  { name: 'Trichy (Tiruchirappalli)',          state: 'Tamil Nadu',     lat: 10.7905, lon: 78.7047 },
  { name: 'Salem',                            state: 'Tamil Nadu',     lat: 11.6643, lon: 78.1460 },
  { name: 'Tirunelveli',                      state: 'Tamil Nadu',     lat:  8.7139, lon: 77.7567 },
  { name: 'Erode',                            state: 'Tamil Nadu',     lat: 11.3410, lon: 77.7172 },
  { name: 'Vellore',                          state: 'Tamil Nadu',     lat: 12.9165, lon: 79.1325 },
  { name: 'Thoothukudi (Tuticorin)',          state: 'Tamil Nadu',     lat:  8.7642, lon: 78.1348 },
  { name: 'Pondicherry',                      state: 'Puducherry',     lat: 11.9416, lon: 79.8083 },
  { name: 'Ooty (Udhagamandalam)',            state: 'Tamil Nadu',     lat: 11.4102, lon: 76.6950 },
  { name: 'Kodaikanal',                       state: 'Tamil Nadu',     lat: 10.2381, lon: 77.4892 },
  { name: 'Kanyakumari',                      state: 'Tamil Nadu',     lat:  8.0883, lon: 77.5385 },
  { name: 'Rameshwaram',                      state: 'Tamil Nadu',     lat:  9.2876, lon: 79.3129 },
  { name: 'Thanjavur',                        state: 'Tamil Nadu',     lat: 10.7870, lon: 79.1378 },
  { name: 'Kumbakonam',                       state: 'Tamil Nadu',     lat: 10.9617, lon: 79.3788 },
  { name: 'Chidambaram',                      state: 'Tamil Nadu',     lat: 11.3993, lon: 79.6927 },
  { name: 'Dindigul',                         state: 'Tamil Nadu',     lat: 10.3624, lon: 77.9695 },
  // ── More Tamil Nadu Cities ────────────────────────────
  { name: 'Nagercoil',                        state: 'Tamil Nadu',     lat:  8.1833, lon: 77.4119 },
  { name: 'Pollachi',                         state: 'Tamil Nadu',     lat: 10.6574, lon: 76.9974 },
  { name: 'Karur',                            state: 'Tamil Nadu',     lat: 10.9601, lon: 78.0766 },
  { name: 'Namakkal',                         state: 'Tamil Nadu',     lat: 11.2195, lon: 78.1675 },
  { name: 'Tiruvannamalai',                   state: 'Tamil Nadu',     lat: 12.2253, lon: 79.0747 },
  { name: 'Cuddalore',                        state: 'Tamil Nadu',     lat: 11.7447, lon: 79.7689 },
  { name: 'Nagapattinam',                     state: 'Tamil Nadu',     lat: 10.7672, lon: 79.8449 },
  { name: 'Hosur',                            state: 'Tamil Nadu',     lat: 12.7409, lon: 77.8253 },
  { name: 'Ambur',                            state: 'Tamil Nadu',     lat: 12.7936, lon: 78.7137 },
  { name: 'Ranipet',                          state: 'Tamil Nadu',     lat: 12.9246, lon: 79.3327 },
  { name: 'Sivakasi',                         state: 'Tamil Nadu',     lat:  9.4533, lon: 77.7899 },
  { name: 'Virudhunagar',                     state: 'Tamil Nadu',     lat:  9.5680, lon: 77.9624 },
  { name: 'Ramanathapuram',                   state: 'Tamil Nadu',     lat:  9.3762, lon: 78.8309 },
  { name: 'Pudukkottai',                      state: 'Tamil Nadu',     lat: 10.3797, lon: 78.8214 },
  { name: 'Krishnagiri',                      state: 'Tamil Nadu',     lat: 12.5186, lon: 78.2137 },
  { name: 'Dharmapuri',                       state: 'Tamil Nadu',     lat: 12.1277, lon: 78.1580 },
  { name: 'Villupuram',                       state: 'Tamil Nadu',     lat: 11.9395, lon: 79.4921 },
  { name: 'Tiruvallur',                       state: 'Tamil Nadu',     lat: 13.1439, lon: 79.9083 },
  { name: 'Kanchipuram',                      state: 'Tamil Nadu',     lat: 12.8333, lon: 79.7000 },
  { name: 'Mahabalipuram',                    state: 'Tamil Nadu',     lat: 12.6269, lon: 80.1927 },
  { name: 'Tiruchendur',                      state: 'Tamil Nadu',     lat:  8.4946, lon: 78.1204 },
  { name: 'Courtallam (Kutralam)',            state: 'Tamil Nadu',     lat:  8.9310, lon: 77.2754 },
  { name: 'Yelagiri',                         state: 'Tamil Nadu',     lat: 12.5833, lon: 78.6333 },
  { name: 'Yercaud',                          state: 'Tamil Nadu',     lat: 11.7745, lon: 78.2085 },
  { name: 'Valparai',                         state: 'Tamil Nadu',     lat: 10.3269, lon: 76.9551 },
  // ── Nearby States ─────────────────────────────────────
  { name: 'Bangalore',                        state: 'Karnataka',      lat: 12.9716, lon: 77.5946 },
  { name: 'Mysore',                           state: 'Karnataka',      lat: 12.2958, lon: 76.6394 },
  { name: 'Tirupati',                         state: 'Andhra Pradesh', lat: 13.6288, lon: 79.4192 },
  { name: 'Hyderabad',                        state: 'Telangana',      lat: 17.3850, lon: 78.4867 },
  { name: 'Thrissur',                         state: 'Kerala',         lat: 10.5276, lon: 76.2144 },
  { name: 'Kochi',                            state: 'Kerala',         lat:  9.9312, lon: 76.2673 },
  // ── Airports ──────────────────────────────────────────
  { name: 'Chennai International Airport',    state: 'Tamil Nadu',     lat: 12.9941, lon: 80.1709 },
  { name: 'Coimbatore International Airport', state: 'Tamil Nadu',     lat: 11.0300, lon: 77.0434 },
  { name: 'Madurai Airport',                  state: 'Tamil Nadu',     lat:  9.8345, lon: 78.0934 },
  { name: 'Trichy Airport',                   state: 'Tamil Nadu',     lat: 10.7654, lon: 78.7090 },
  { name: 'Tuticorin Airport',                state: 'Tamil Nadu',     lat:  8.7242, lon: 78.0258 },
  { name: 'Salem Airport',                    state: 'Tamil Nadu',     lat: 11.7833, lon: 78.0656 },
];

const ROUTE_COORDS = {
  'Chennai':     { lat: 13.0827, lon: 80.2707 },
  'Pondicherry': { lat: 11.9416, lon: 79.8083 },
  'Coimbatore':  { lat: 11.0168, lon: 76.9558 },
  'Madurai':     { lat:  9.9252, lon: 78.1198 },
  'Ooty':        { lat: 11.4102, lon: 76.6950 },
  'Tirupati':    { lat: 13.6288, lon: 79.4192 },
  'Rameshwaram': { lat:  9.2876, lon: 79.3129 },
  'Bangalore':   { lat: 12.9716, lon: 77.5946 },
  'Trichy':      { lat: 10.7905, lon: 78.7047 },
  'Salem':       { lat: 11.6643, lon: 78.1460 },
  'Kumbakonam':  { lat: 10.9617, lon: 79.3788 },
  'Kanyakumari': { lat:  8.0883, lon: 77.5385 },
};

/* ══════════════════════════════════════════
   PURE FUNCTIONS
══════════════════════════════════════════ */
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371, toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
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

/* ══════════════════════════════════════════
   DOM FUNCTIONS
══════════════════════════════════════════ */
function getSelectedCab() {
  const r = document.querySelector('input[name="cabType"]:checked');
  return r ? { name: r.value, rate: parseInt(r.dataset.rate) } : { name: 'Sedan', rate: 12 };
}

function recalcFare() {
  const fareBox = document.getElementById('fareBox');
  if (!fareBox) return null;
  if (currentTrip === 'hourly' || !pickupCoords || !dropCoords) {
    fareBox.style.display = 'none'; return null;
  }
  const dist = Math.round(haversineKm(pickupCoords.lat, pickupCoords.lon, dropCoords.lat, dropCoords.lon) * 1.3);
  const cab  = getSelectedCab();
  let fare   = Math.max(dist * cab.rate, CONFIG.MIN_FARE);
  if (currentTrip === 'roundtrip') fare = Math.round(fare * 2 * 0.9);
  document.getElementById('fareDistance').textContent = `~${dist} km`;
  document.getElementById('fareAmount').textContent   = `₹${fare.toLocaleString('en-IN')}`;
  fareBox.style.display = 'block';
  return { dist, fare, cab: cab.name };
}

function showToast() {
  const t = document.getElementById('successToast');
  if (t) { t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 6000); }
}
function closeToast() { document.getElementById('successToast')?.classList.remove('show'); }

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

function fillRoute(from, to) {
  const pi = document.getElementById('pickupInput');
  const di = document.getElementById('dropInput');
  if (pi) pi.value = from;
  if (di) di.value = to;
  pickupCoords = ROUTE_COORDS[from] || null;
  dropCoords   = ROUTE_COORDS[to]   || null;
  recalcFare();
  const navbar = document.getElementById('navbar');
  const target = document.getElementById('bookingWidget') || document.getElementById('booking');
  if (target) {
    const off = (navbar ? navbar.offsetHeight : 0) + 10;
    window.scrollTo({ top: target.offsetTop - off, behavior: 'smooth' });
  }
}

/* ══════════════════════════════════════════
   LOCATION AUTOCOMPLETE
══════════════════════════════════════════ */
async function getPlaceSuggestions(query) {
  if (query.length < 2) return [];
  // if (CONFIG.GOOGLE_API_KEY && CONFIG.GOOGLE_API_KEY !== 'YOUR_GOOGLE_PLACES_API_KEY') {
  //   try {
  //     const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&components=country:in&types=(cities)&key=${CONFIG.GOOGLE_API_KEY}`;
  //     const res  = await fetch(url);
  //     const data = await res.json();
  //     if (data.status === 'OK') return data.predictions;
  //   } catch(e) { console.warn('Google Places error, using fallback'); }
  // }
  const q = query.toLowerCase();
  return TN_CITIES
    .filter(c => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q))
    .map(c => ({ description: `${c.name}, ${c.state}`, _coords: { lat: c.lat, lon: c.lon } }));
}

async function getPlaceCoords(placeId) {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${CONFIG.GOOGLE_API_KEY}`;
    const res  = await fetch(url);
    const data = await res.json();
    if (data.result?.geometry?.location) {
      return { lat: data.result.geometry.location.lat, lon: data.result.geometry.location.lng };
    }
  } catch(e) {}
  return null;
}

function renderSuggestions(items, boxEl, inputEl, coordSetter) {
  boxEl.innerHTML = '';
  if (!items.length) { boxEl.classList.remove('open'); return; }
  items.forEach(item => {
    const div   = document.createElement('div');
    div.className = 'sugg-item';
    const desc  = item.description || '';
    const parts = desc.split(',');
    const main  = parts[0];
    const sub   = parts.slice(1).join(',').trim();
    div.innerHTML = `<i class="fas fa-map-marker-alt"></i><div><div class="sugg-item-main">${main}</div>${sub ? `<div class="sugg-item-sub">${sub}</div>` : ''}</div>`;
    // div.addEventListener('mousedown', async (e) => {
    //   e.preventDefault();
    //   inputEl.value = desc;
    //   boxEl.classList.remove('open');
    //   if (item._coords) {
    //     coordSetter(item._coords);
    //   } else if (item.place_id) {
    //     const coords = await getPlaceCoords(item.place_id);
    //     if (coords) coordSetter(coords);
    //   }
    //   recalcFare();
    // });
    div.addEventListener('mousedown', async (e) => {
      e.preventDefault();
      inputEl.value = desc;
      boxEl.classList.remove('open');
      if (item._coords) {
        coordSetter(item._coords);
        recalcFare(); // ← coords ready, calc immediately
      } else if (item.place_id) {
        const coords = await getPlaceCoords(item.place_id);
        if (coords) {
          coordSetter(coords);
          recalcFare(); // ← coords ready after await, then calc
        }
      }
    });
    boxEl.appendChild(div);
  });
  boxEl.classList.add('open');
}

function setupAutocomplete(inputId, boxId, coordSetter) {
  const input = document.getElementById(inputId);
  const box   = document.getElementById(boxId);
  if (!input || !box) return;
  input.addEventListener('input', () => {
    clearTimeout(debounceT[inputId]);
    const q = input.value.trim();
    if (q.length < 2) { box.classList.remove('open'); return; }
    box.innerHTML = '<div class="sugg-loading"><i class="fas fa-spinner fa-spin me-2"></i>Searching...</div>';
    box.classList.add('open');
    debounceT[inputId] = setTimeout(async () => {
      const results = await getPlaceSuggestions(q);
      renderSuggestions(results, box, input, coordSetter);
    }, 320);
  });
  input.addEventListener('blur', () => setTimeout(() => box.classList.remove('open'), 200));
  input.addEventListener('keydown', e => { if (e.key === 'Escape') box.classList.remove('open'); });
}

/* ══════════════════════════════════════════
   SUPABASE — save booking to database
══════════════════════════════════════════ */
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

/* ══════════════════════════════════════════
   TELEGRAM — instant owner notification
══════════════════════════════════════════ */
async function sendTelegram(b) {
  try {
    const text = [
      `🚖 <b>NEW BOOKING — SwiftRide</b>`,
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

/* ══════════════════════════════════════════
   EMAILJS — customer confirmation email
══════════════════════════════════════════ */
async function sendEmail(b) {
  if (!b.email) { console.warn('No customer email'); return; }
  try {
    if (typeof emailjs !== 'undefined') {
      emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);
      await emailjs.send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, {
        passenger_name:  b.name,
        passenger_phone: b.phone,
        passenger_email: b.email,
        trip_type:       b.tripType,
        pickup_location: b.pickup,
        drop_location:   b.drop,
        travel_date:     b.date,
        travel_time:     b.time,
        return_date:     b.returnDate,
        cab_type:        b.cabType,
        estimated_fare:  b.fare,
        booking_time:    b.timestamp,
      });
      console.log('✅ Email sent to customer');
    }
  } catch(e) {
    console.warn('❌ EmailJS failed:', e);
  }
}

/* ══════════════════════════════════════════
   DOM — DOMContentLoaded
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

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

  const tripTabsEl = document.querySelector('.trip-tabs');
  if (tripTabsEl) {
    tripTabsEl.addEventListener('click', function (e) {
      const tab = e.target.closest('.trip-tab');
      if (!tab) return;
      document.querySelectorAll('.trip-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTrip = tab.dataset.trip;
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
      recalcFare();
    });
  }

  const cabGridEl = document.querySelector('.cab-grid');
  if (cabGridEl) {
    cabGridEl.addEventListener('click', function (e) {
      const card = e.target.closest('.cab-card');
      if (!card) return;
      document.querySelectorAll('.cab-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      recalcFare();
    });
  }

  setupAutocomplete('pickupInput', 'pickupBox', c => { pickupCoords = c; });
  setupAutocomplete('dropInput',   'dropBox',   c => { dropCoords   = c; });

  const swapBtn = document.getElementById('swapBtn');
  if (swapBtn) {
    swapBtn.addEventListener('click', () => {
      const pi = document.getElementById('pickupInput');
      const di = document.getElementById('dropInput');
      if (!pi || !di) return;
      [pi.value, di.value] = [di.value, pi.value];
      [pickupCoords, dropCoords] = [dropCoords, pickupCoords];
      recalcFare();
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

      const fareInfo  = recalcFare();
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

  console.log('%c✅ SwiftRide — Ready!', 'color:#336184;font-weight:bold;font-size:14px;');
});
