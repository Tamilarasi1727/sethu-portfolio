const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const sections = document.querySelectorAll('main section[id]');
const navItems = Array.from(document.querySelectorAll('.nav-links a'));
const heroText = document.getElementById('typed-text');
const form = document.getElementById('contact-form');
const formStatus = document.querySelector('.form-status');
const backToTop = document.querySelector('.back-to-top');
const progressBar = document.querySelector('.scroll-progress');
const loader = document.querySelector('.loader');
const revealItems = document.querySelectorAll('.reveal');
const skillBars = document.querySelectorAll('.progress-track span');

const phrases = [
  'Frontend Developer',
  'Learning Full-Stack Development',
  'Building modern web experiences'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeText() {
  const currentPhrase = phrases[phraseIndex];

  if (!heroText) return;

  heroText.textContent = currentPhrase.slice(0, charIndex);

  if (!isDeleting && charIndex < currentPhrase.length) {
    charIndex += 1;
    setTimeout(typeText, 90);
  } else if (isDeleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeText, 50);
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) {
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
    setTimeout(typeText, 900);
  }
}

function toggleMenu() {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
}

function setActiveLink() {
  const scrollY = window.scrollY + 140;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (scrollY >= top && scrollY < bottom) {
      navItems.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${section.id}`);
      });
    }
  });
}

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;

  backToTop.classList.toggle('show', scrollTop > 600);
}

function revealOnScroll() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          if (entry.target.classList.contains('skill-card')) {
            const bar = entry.target.querySelector('.progress-track span');
            if (bar && !bar.dataset.animated) {
              bar.style.width = `${bar.dataset.width}%`;
              bar.dataset.animated = 'true';
            }
          }
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function handleFormSubmit(event) {
  event.preventDefault();

  const name = form.querySelector('#name').value.trim();
  const email = form.querySelector('#email').value.trim();
  const subject = form.querySelector('#subject').value.trim();
  const message = form.querySelector('#message').value.trim();

  if (!name || !email || !subject || !message) {
    formStatus.textContent = 'Please fill in all fields before sending.';
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    formStatus.textContent = 'Please enter a valid email address.';
    return;
  }

  formStatus.textContent = 'Thanks for reaching out! Your message has been received.';
  form.reset();
}

function init() {
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  navItems.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  window.addEventListener('scroll', () => {
    setActiveLink();
    updateScrollProgress();
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  setActiveLink();
  updateScrollProgress();
  revealOnScroll();
  typeText();

  window.setTimeout(() => {
    loader.classList.add('hidden');
  }, 1200);
}

init();
