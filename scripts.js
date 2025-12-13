// scripts.js — обробка форми, кнопок "Поділитись", CTA, модалок та cookie-банера
(function () {
  var form = document.getElementById('contactForm');
  var phone = document.getElementById('phone');
  var feedback = document.getElementById('formFeedback');
  var policyCheckbox = document.getElementById('policy');

  // --- Утиліти модалок ---
  function openModalById(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    modal._previousActive = document.activeElement;
    var closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModalById(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (modal._previousActive) modal._previousActive.focus();
  }

  // --- Форма ---
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!phone.value.trim()) {
        feedback.textContent = "Будь ласка, вкажіть телефон для зв'язку.";
        feedback.style.color = '#b44';
        phone.focus();
        return;
      }

      if (!policyCheckbox || !policyCheckbox.checked) {
        feedback.textContent = "Будь ласка, підтвердіть згоду на обробку персональних даних.";
        feedback.style.color = '#b44';
        if (policyCheckbox) policyCheckbox.focus();
        return;
      }

      // Імітація відправки — замінити на реальний бекенд/сервіс
      feedback.textContent = "Дякуємо! Вашу заявку отримано. Ми зв'яжемося з вами найближчим часом.";
      feedback.style.color = '#2a6';
      form.reset();
    });
  }

  // --- Share buttons ---
  var shareButtons = document.querySelectorAll('.share-btn');
  shareButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var title = btn.dataset.title || document.title;
      var hash = btn.dataset.hash || '';
      var url = window.location.origin + window.location.pathname + hash;
      var text = title + ' — перегляньте на сайті';

      if (navigator.share) {
        navigator.share({ title: title, text: text, url: url }).catch(function (err) {
          console.log('Share failed:', err);
        });
      } else {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function () {
            alert('Посилання скопійовано в буфер обміну:\n' + url);
          }).catch(function () {
            alert('Скопіюйте посилання вручну:\n' + url);
          });
        } else {
          prompt('Скопіюйте посилання вручну:', url);
        }
      }
    });
  });

  // --- CTA ---
  function scrollToFormAndFocus() {
    var formSection = document.getElementById('form');
    if (!formSection) return;
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(function () {
      var phoneInput = document.getElementById('phone');
      if (phoneInput) phoneInput.focus();
    }, 600);
  }

  var applyBtn = document.querySelector('.cta-apply');
  if (applyBtn) applyBtn.addEventListener('click', scrollToFormAndFocus);
  var consultBtn = document.querySelector('.cta-consult');
  if (consultBtn) consultBtn.addEventListener('click', scrollToFormAndFocus);

  // --- Модалки: політика та cookie ---
  var openPolicy = document.getElementById('openPolicy');
  if (openPolicy) {
    openPolicy.addEventListener('click', function (e) {
      e.preventDefault();
      openModalById('policyModal');
    });
  }

  var openCookieModalLink = document.getElementById('openCookieModal');
  if (openCookieModalLink) {
    openCookieModalLink.addEventListener('click', function (e) {
      e.preventDefault();
      openModalById('cookieModal');
    });
  }

  // Закриття модалок по оверлею або кнопці з data-close
  document.addEventListener('click', function (e) {
    var target = e.target;
    if (target && target.dataset && target.dataset.close === 'true') {
      var modal = target.closest('.modal');
      if (modal) closeModalById(modal.id);
    }
    if (target && target.classList && target.classList.contains('modal-overlay')) {
      var modal = target.closest('.modal');
      if (modal) closeModalById(modal.id);
    }
  });

  // ESC для закриття
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var openModals = document.querySelectorAll('.modal[aria-hidden="false"]');
      openModals.forEach(function (m) {
        closeModalById(m.id);
      });
    }
  });

  // --- Cookie банер ---
  var cookieBanner = document.getElementById('cookieBanner');
  var acceptBtn = document.getElementById('acceptCookies');

  function showCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.setAttribute('aria-hidden', 'false');
  }
  function hideCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.setAttribute('aria-hidden', 'true');
  }

  try {
    var cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (cookiesAccepted !== 'true') {
      setTimeout(showCookieBanner, 600);
    }
  } catch (err) {
    setTimeout(showCookieBanner, 600);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', function () {
      try { localStorage.setItem('cookiesAccepted', 'true'); } catch (e) {}
      hideCookieBanner();
    });
  }

})();