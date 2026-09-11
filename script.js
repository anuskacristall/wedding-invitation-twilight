// script.js – Classic Wedding Website

// ---- AOS Animations Init ----
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    once: true,
    offset: 50,
    duration: 800,
    easing: 'ease-out-cubic',
  });
});

// ---- Interactive Envelope ----
const envelopeScreen = document.getElementById('envelope-screen');
const envelope = document.getElementById('envelope');
const envelopeWrapper = document.getElementById('envelope-wrapper') || envelope;
const mainContent = document.getElementById('main-content');
const tapText = document.getElementById('tap-text');
const musicToggleBtn = document.getElementById('music-toggle');

envelope.addEventListener('click', () => {
  if (envelopeWrapper.classList.contains('open')) return; // Prevent double clicks
  
  envelopeWrapper.classList.add('open');
  document.getElementById('tap-text').style.opacity = '0';
  document.querySelector('.volume-text').style.opacity = '0';

  document.body.classList.remove('noscroll');
  mainContent.style.display = 'block';

  // Autoplay music upon clicking the envelope
  bgMusic.play().then(() => {
    musicToggleBtn.classList.add('playing');
    isPlaying = true;
  }).catch(e => console.log('Audio play failed: ', e));

  // Fade out envelope screen
  setTimeout(() => {
    envelopeScreen.classList.add('hide');
  }, 2200);

  setTimeout(() => {
    envelopeScreen.style.display = 'none';
    AOS.refresh(); // Refresh animations since content just appeared
  }, 3500);
});

// ---- Floating Music Player ----
const bgMusic = document.getElementById('bg-music');
let isPlaying = false;

musicToggleBtn.addEventListener('click', () => {
  if (isPlaying) {
    bgMusic.pause();
    musicToggleBtn.classList.remove('playing');
  } else {
    bgMusic.play().then(() => {
      musicToggleBtn.classList.add('playing');
    }).catch(error => {
      console.log('Erro ao tocar música: ', error);
      alert("Seu navegador bloqueou o áudio. Verifique suas permissões.");
    });
  }
  isPlaying = !isPlaying;
});

// ---- Countdown Logic ----
const targetDate = new Date("August 13, 2006 16:00:00").getTime();
let simulatedNow = new Date("May 10, 2006 12:00:00").getTime();

const countdownInterval = setInterval(function() {
  // Avance o tempo simulado em 1 segundo a cada segundo real
  simulatedNow += 1000;
  
  const distance = targetDate - simulatedNow;

  if (distance < 0) {
    clearInterval(countdownInterval);
    document.getElementById("countdown").innerHTML = "<h3 class='cursive-subtitle'>Today is the day!</h3>";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("cd-days").innerText = days.toString().padStart(2, '0');
  document.getElementById("cd-hours").innerText = hours.toString().padStart(2, '0');
  document.getElementById("cd-minutes").innerText = minutes.toString().padStart(2, '0');
  document.getElementById("cd-seconds").innerText = seconds.toString().padStart(2, '0');
}, 1000);


// ---------- Form Validation & Logic ----------
const form = document.getElementById('rsvp-form');
const messageEl = document.getElementById('form-message');
const countrySelect = document.getElementById('country');
const phoneInput = document.getElementById('phone');

function showMessage(msg, success = false) {
  messageEl.textContent = msg;
  messageEl.style.color = success ? 'green' : 'red';
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^\+?\d{1,4}?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{0,9}$/;
  return re.test(phone);
}

if (countrySelect && phoneInput) {
  countrySelect.addEventListener('change', function() {
    const selectedOption = countrySelect.options[countrySelect.selectedIndex];
    const dialCode = selectedOption.getAttribute('data-code');
    if (dialCode) {
      phoneInput.value = dialCode + " ";
      phoneInput.focus();
    } else {
      phoneInput.value = "";
    }
  });
}

if(form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const country = form.country.value;
    const phone = form.phone.value.trim();
    const attendance = form.attendance.value;

    if (!name) { showMessage('Please enter your full name.'); return; }
    if (!validateEmail(email)) { showMessage('Invalid email address.'); return; }
    if (!country) { showMessage('Please select your country.'); return; }
    if (!validatePhone(phone)) { showMessage('Invalid phone number.'); return; }
    if (!attendance) { showMessage('Please indicate your attendance.'); return; }

    showMessage('RSVP sent successfully! We look forward to seeing you.', true);
    form.reset();
  });
}
