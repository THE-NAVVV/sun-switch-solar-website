/* ============================================
   Sun Switch Solar — Script
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Preloader ---------- */
  (function () {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    document.documentElement.classList.add('has-preloader');

    var MIN_DISPLAY_MS = 2700; // 
    var startTime = performance.now();

    var fill = preloader.querySelector('.pl-bar-fill');
    var ringFill = preloader.querySelector('.pl-ring-fill');
    var RING_CIRCUMFERENCE = 327; // 

    var pageReady = false;
    var rafId = null;
    var finished = false;

    function paint(p) {
      if (fill) fill.style.width = p + '%';
      if (ringFill) ringFill.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - p / 100);
    }

    
    function loop(now) {
      var elapsed = now - startTime;
      var t = Math.min(elapsed / MIN_DISPLAY_MS, 1);

      
      var cap = pageReady ? 1 : 0.96;
      var capped = Math.min(t, cap);

     
      var eased = 1 - Math.pow(1 - capped, 2);
      paint(eased * 100);

      if (capped >= 1 && t >= 1 && pageReady && !finished) {
        finished = true;
        finish();
        return;
      }
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    function finish() {
      cancelAnimationFrame(rafId);
      paint(100);
      setTimeout(function () {
        preloader.classList.add('pl-hide');
        document.documentElement.classList.remove('has-preloader');
        document.body.classList.remove('is-loading');
        setTimeout(function () {
          if (preloader && preloader.parentNode) {
            preloader.parentNode.removeChild(preloader);
          }
        }, 650);
      }, 200);
    }

    
    var settled = false;
    function onReady() {
      if (settled) return;
      settled = true;
      pageReady = true;
    }

    if (document.readyState === 'complete') {
      onReady();
    } else {
      window.addEventListener('load', onReady);
    }
    setTimeout(onReady, 4500); // safety cap
  })();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  var navBackdrop = document.querySelector('.nav-backdrop');

  if (navToggle && navLinks) {

    function openMenu() {
      navLinks.classList.add('open');
      navToggle.classList.add('active');
      if (navBackdrop) navBackdrop.classList.add('open');
    }

    function closeMenu() {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      if (navBackdrop) navBackdrop.classList.remove('open');
    }

    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (navLinks.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Tap on the dimmed backdrop closes the menu
    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeMenu);
    }

    
    document.addEventListener('click', function (e) {
      if (!navLinks.classList.contains('open')) return;
      var clickedInsideMenu = navLinks.contains(e.target);
      var clickedToggle = navToggle.contains(e.target);
      if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
      }
    });

    
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMenu();
      }
    });

    // Close menu after clicking a link (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });
  }

  /* ---------- Service cards "Read More" toggle (no WhatsApp redirect) ---------- */
  document.querySelectorAll('.rm-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var more = btn.previousElementSibling;
      var isOpen = more && more.classList.contains('open');
      if (more && more.classList.contains('scard-more')) {
        more.classList.toggle('open', !isOpen);
      }
      btn.setAttribute('aria-expanded', (!isOpen).toString());
      btn.textContent = isOpen ? '→ Read More' : '↑ Read Less';
    });
  });

  /* ---------- Services accordion (Engineering excellence list) ---------- */
  var sviGroup = document.querySelector('.svi-group');
  if (sviGroup) {
    var sviButtons = Array.prototype.slice.call(sviGroup.querySelectorAll('.svi'));

    function setSviOpen(btn, open) {
      var body = btn.nextElementSibling;
      var arrow = btn.querySelector('.svi-arr');
      btn.classList.toggle('act', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (arrow) arrow.textContent = open ? '↑' : '↓';
      if (body && body.classList.contains('svi-body')) {
        body.classList.toggle('svi-body-open', open);
      }
    }

    sviButtons.forEach(function (btn) {
     
      btn.addEventListener('click', function () {
        var alreadyOpen = btn.classList.contains('act');
        sviButtons.forEach(function (b) { setSviOpen(b, false); });
        if (!alreadyOpen) setSviOpen(btn, true);
      });

      // Arrow-key navigation between items
      btn.addEventListener('keydown', function (e) {
        var idx = sviButtons.indexOf(btn);
        var nextIdx = null;

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          nextIdx = (idx + 1) % sviButtons.length;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          nextIdx = (idx - 1 + sviButtons.length) % sviButtons.length;
        } else if (e.key === 'Home') {
          nextIdx = 0;
        } else if (e.key === 'End') {
          nextIdx = sviButtons.length - 1;
        }

        if (nextIdx !== null) {
          e.preventDefault();
          sviButtons[nextIdx].focus();
        }
      });
    });
  }

  /* ---------- Accordion (Core Principles) ---------- */
  var accItems = document.querySelectorAll('.acc-item');
  accItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var body = item.nextElementSibling;
      var arrow = item.querySelector('.arr2');
      var isOpen = body && body.classList.contains('acc-body-open');

      // Close all
      document.querySelectorAll('.acc-body-open').forEach(function (openBody) {
        openBody.classList.remove('acc-body-open');
        openBody.style.display = 'none';
      });
      document.querySelectorAll('.acc-item .arr2').forEach(function (a) {
        a.textContent = '↓';
      });

      if (body && body.classList.contains('acc-body') && !isOpen) {
        body.style.display = 'block';
        body.classList.add('acc-body-open');
        if (arrow) arrow.textContent = '↑';
      }
    });
  });

  /* ---------- WhatsApp auto-message ---------- */
  
  var WHATSAPP_NUMBER = '918209873910';
  var WHATSAPP_MESSAGE = "Hi, I want to install a solar panel. Could you please share details on packages, pricing, and the next steps?";

  function buildWhatsAppLink() {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE);
  }

  document.querySelectorAll('.js-whatsapp-link').forEach(function (el) {
    el.setAttribute('href', buildWhatsAppLink());
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });

  /* ---------- Contact form -> sends via WhatsApp ---------- */
  var contactForm = document.querySelector('.contact-form');
  if (contactForm) {

    /* Customer type pills (Home / Industry / Consultancy) */
    var selectedType = 'Residential / Home';
    var ctypeBtns = contactForm.querySelectorAll('.ctype-btn');
    var capacityRow = contactForm.querySelector('#capacityRow');
    var unitBtns = contactForm.querySelectorAll('.unit-btn');
    var selectedUnit = 'kW';

    function setUnit(unit) {
      selectedUnit = unit;
      unitBtns.forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-unit') === unit);
      });
    }

    ctypeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        ctypeBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        selectedType = btn.getAttribute('data-type');

        
        if (capacityRow) {
          capacityRow.style.display = (selectedType.indexOf('Consultancy') !== -1) ? 'none' : 'flex';
        }
        // Sensible default unit per type (user can still override)
        setUnit(selectedType.indexOf('Industrial') !== -1 ? 'MW' : 'kW');
      });
    });

    /* kW / MW unit toggle */
    unitBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setUnit(btn.getAttribute('data-unit'));
      });
    });

    
    var useLocationBtn = contactForm.querySelector('#useLocationBtn');
    var locationInput = contactForm.querySelector('#locationInput');

    if (useLocationBtn && locationInput) {
      useLocationBtn.addEventListener('click', function () {
        if (!navigator.geolocation) {
          locationInput.placeholder = 'Location not supported on this browser';
          return;
        }
        useLocationBtn.classList.add('locating');
        var originalLabel = useLocationBtn.innerHTML;
        useLocationBtn.textContent = 'Locating…';

        navigator.geolocation.getCurrentPosition(function (pos) {
          var lat = pos.coords.latitude.toFixed(5);
          var lon = pos.coords.longitude.toFixed(5);

          
          fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon)
            .then(function (res) { return res.json(); })
            .then(function (data) {
              locationInput.value = (data && data.display_name) ? data.display_name : (lat + ', ' + lon);
            })
            .catch(function () {
              locationInput.value = lat + ', ' + lon;
            })
            .finally(function () {
              useLocationBtn.classList.remove('locating');
              useLocationBtn.innerHTML = originalLabel;
            });
        }, function () {
          useLocationBtn.classList.remove('locating');
          useLocationBtn.innerHTML = originalLabel;
          locationInput.placeholder = 'Could not get location — type it manually';
        });
      });
    }

    
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = contactForm.querySelector('[name="name"]').value.trim();
      var phone = contactForm.querySelector('[name="phone"]').value.trim();
      var message = contactForm.querySelector('[name="message"]').value.trim();
      var capacity = contactForm.querySelector('[name="capacity"]').value.trim();
      var budget = contactForm.querySelector('[name="budget"]').value.trim();
      var location = contactForm.querySelector('[name="location"]').value.trim();

      var lines = [
        "Hi, I want to install a solar panel.",
        "Name: " + (name || '-'),
        "Phone: " + (phone || '-'),
        "Customer type: " + selectedType
      ];

      if (capacity && selectedType.indexOf('Consultancy') === -1) {
        lines.push("Estimated capacity needed: " + capacity + " " + selectedUnit);
      }
      if (budget) lines.push("Estimated budget: " + budget);
      if (location) lines.push("Location: " + location);
      lines.push("Message: " + (message || '-'));

      var text = lines.join('\n');
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  /* ---------- Header background on scroll (optional polish) ---------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var lastState = false;
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY > 40;
      if (scrolled !== lastState) {
        nav.style.background = scrolled ? 'rgba(13,30,53,0.85)' : 'transparent';
        nav.style.backdropFilter = scrolled ? 'blur(10px)' : 'none';
        lastState = scrolled;
      }
    });
  }

});