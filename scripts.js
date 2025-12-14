// scripts.js — обробка форми, кнопок "Поділитись", CTA, модалок та cookie-банера
(function () {
  var form = document.getElementById('contactForm');
  var phone = document.getElementById('phone');
  var feedback = document.getElementById('formFeedback');
  var policyCheckbox = document.getElementById('policy');
  var orderButtons = document.querySelectorAll('.order-btn');
  var orderProductInput = document.getElementById('orderProduct');
  var orderProductLabel = document.getElementById('orderProductLabel');
  var orderName = document.getElementById('orderName');
  var orderPhone = document.getElementById('orderPhone');
  var orderFeedback = document.getElementById('orderFeedback');
  var orderForm = document.getElementById('orderForm');

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

  // --- Модалка замовлення ---
  orderButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var product = btn.dataset.product || '';
      if (orderProductInput) orderProductInput.value = product;
      if (orderProductLabel) orderProductLabel.textContent = product || 'Оберіть товар, щоб оформити замовлення';
      openModalById('orderModal');
      if (orderName) orderName.focus();
    });
  });

  if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!orderPhone || !orderPhone.value.trim()) {
        if (orderFeedback) {
          orderFeedback.textContent = "Будь ласка, вкажіть телефон для зв'язку.";
          orderFeedback.style.color = '#b44';
        }
        if (orderPhone) orderPhone.focus();
        return;
      }

      var productName = orderProductInput && orderProductInput.value ? orderProductInput.value : 'Без вибору продукту';
      if (orderFeedback) {
        orderFeedback.textContent = 'Дякуємо! Ми прийняли замовлення на: ' + productName + '. Наш менеджер скоро звʼяжеться.';
        orderFeedback.style.color = '#2a6';
      }
      orderForm.reset();
      if (orderProductLabel) orderProductLabel.textContent = 'Оберіть товар, щоб оформити замовлення';
      if (orderProductInput) orderProductInput.value = '';
    });
  }

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