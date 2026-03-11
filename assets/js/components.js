const HEADER = `
    <div class="top-bar">
    <div class="container">
        <div class="top-bar-inner">
        <div class="top-bar-left">
            <span class="top-bar-item"><i class="fas fa-phone-alt"></i> <a href="tel:+919876543210">+91 98765 43210</a></span>
            <span class="top-bar-item"><i class="fas fa-envelope"></i> <a href="/cdn-cgi/l/email-protection#ddbfb2b2b6b4b3baae9daeaab4bba9afb4b9b8f3b4b3"><span class="__cf_email__" data-cfemail="791b16161210171e0a390a0e101f0d0b101d1c571017">[email&#160;protected]</span></a></span>
        </div>
        <div class="top-bar-right">
            <span class="top-bar-item"><i class="fas fa-clock"></i> Available 24/7</span>
            <span class="top-bar-item"><i class="fas fa-map-marker-alt"></i> Tamil Nadu, India</span>
        </div>
        </div>
    </div>
    </div>

<!-- NAVBAR -->
    <nav id="navbar" class="navbar navbar-expand-lg fixed-top">
        <div class="container">
            <a class="navbar-brand" href="index.html">
            <img class="navbar-logo" src="assets/images/logo.png" alt="">
            <!-- <div class="brand-logo"><i class="fas fa-bolt"></i></div>
            <div class="brand-text-wrap">
                <span class="brand-name">Swift<span>Ride</span></span>
                <span class="brand-tag">Outstation Taxi</span>
            </div> -->
            </a>
            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
            <i class="fas fa-bars" style="color:var(--navy)"></i>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navMenu">
            <ul class="navbar-nav align-items-lg-center gap-lg-1">
                <li class="nav-item"><a class="nav-link-custom nav-link" href="index.html">Home</a></li>
                <li class="nav-item"><a class="nav-link-custom nav-link" href="/pages/services.html">Services</a></li>
                <li class="nav-item"><a class="nav-link-custom nav-link" href="/pages/fleet.html">Fleet</a></li>
                <li class="nav-item"><a class="nav-link-custom nav-link" href="/pages/tariff.html">Tariff</a></li>
                <li class="nav-item"><a class="nav-link-custom nav-link" href="/pages/about.html">About</a></li>
                <li class="nav-item"><a class="nav-link-custom nav-link" href="/pages/contact.html">Contact</a></li>
                <li class="nav-item ms-lg-2"><a href="tel:+919876543210" class="nav-phone-btn"><i class="fas fa-phone-alt"></i> Call Now</a></li>
                <li class="nav-item ms-lg-1"><a href="#booking" class="nav-link nav-cta">Book Now</a></li>
            </ul>
            </div>
        </div>
    </nav>  
`;


const FOOTER = `
<footer class="site-footer">
  <div class="container">
    <div class="row g-4">
      <div class="col-lg-4">
        <div class="footer-brand">
          <img class="navbar-logo" src="/assets/images/logo.png" alt="">
          <!-- <div class="brand-logo"><i class="fas fa-bolt"></i></div>
          <div class="brand-text-wrap"><span class="brand-name" style="color:var(--white)">Swift<span>Ride</span></span>
            <span class="brand-tag">Outstation Taxi</span>
          </div> -->
        </div>
        <p class="footer-about">Tamil Nadu's trusted outstation cab service. Professional drivers, transparent fares, 24/7 availability across 150+ cities since 2019.</p>
        <div class="footer-social"><a href="#"><i class="fab fa-facebook-f"></i></a><a href="#"><i class="fab fa-instagram"></i></a><a href="https://wa.me/919876543210"><i class="fab fa-whatsapp"></i></a><a href="#"><i class="fab fa-youtube"></i></a></div>
      </div>
      <div class="col-sm-6 col-lg-2"><div class="footer-h">Pages</div>
      <ul class="footer-ul">
      <li><a href="/">Home</a></li>
      <li><a href="/pages/services.html">Services</a></li>
      <li><a href="/pages/fleet.html">Fleet</a></li>
      <li><a href="/pages/tariff.html">Tariff</a></li>
      <li><a href="/pages/about.html">About Us</a></li>
      <li><a href="/pages/contact.html">Contact</a></li>
      </ul>
      </div>
      <div class="col-sm-6 col-lg-3">
      <div class="footer-h">Popular Routes</div>
      <ul class="footer-ul"><li>Chennai → Pondicherry</li>
      <li>Chennai → Coimbatore</li><li>Chennai → Madurai</li><li>Coimbatore → Ooty</li>
      <li>Chennai → Bangalore</li><li>Trichy → Chennai</li></ul></div>
      <div class="col-lg-3">
      <div class="footer-h">Contact Us</div>
      <ul class="footer-ul">
      <li><i class="fas fa-phone-alt"></i><a href="tel:+919876543210">+91 98765 43210</a></li>
      <li><i class="fab fa-whatsapp"></i><a href="https://wa.me/919876543210">WhatsApp Us</a></li>
      <li><i class="fas fa-envelope"></i>
      <a href="/cdn-cgi/l/email-protection#264449494d4f4841556655514f4052544f4243084f48">
      <span class="__cf_email__" data-cfemail="83e1ecece8eaede4f0c3f0f4eae5f7f1eae7e6adeaed">
      [email&#160;protected]</span></a></li>
      <li><i class="fas fa-map-marker-alt"></i>No. 12, Anna Salai, Chennai - 600002</li>
      <li><i class="fas fa-clock"></i>Available 24 hours, 7 days</li>
      </ul>
      </div>
    </div>
    <hr class="footer-divider"/>
    <div class="footer-bottom">
    <span>© 2025 360 Cabs Taxi Services. All rights reserved.</span>
    <span><a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a></span>
    </div>
  </div>
</footer>`;


document.addEventListener("DOMContentLoaded", initLayout);

function initLayout() {

  // Inject header & footer
  document.getElementById("header").innerHTML = HEADER;
  document.getElementById("footer").innerHTML = FOOTER;

  // Run navbar scripts AFTER header exists
  initNavbar();
  highlightActivePage();

}

/* ---------------- NAVBAR EFFECT ---------------- */

function initNavbar() {

  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

}

/* ---------------- ACTIVE PAGE ---------------- */

function highlightActivePage() {

  const links = document.querySelectorAll(".nav-link-custom");
  const current = window.location.pathname;

  links.forEach(link => {

    const linkPath = new URL(link.href).pathname;

    if (
      current === linkPath ||
      (current === "/" && linkPath === "/")
    ) {
      link.classList.add("active-page");
    }

  });

}
