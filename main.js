import { createIcons, Menu, X, ArrowRight, Play, Plus } from 'lucide';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

// Initialize Icons
createIcons({
  icons: {
    Menu,
    X,
    ArrowRight,
    Play,
    Plus
  }
});

// Smooth Scrolling with Lenis
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Smooth scroll for anchor links using Lenis
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    if (target) {
      lenis.scrollTo(target, { 
        offset: 0, 
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    }
  });
});

// Mobile Menu Logic
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
let isMenuOpen = false;

menuToggle.addEventListener('click', () => {
  isMenuOpen = !isMenuOpen;
  
  if (isMenuOpen) {
    mobileMenu.classList.add('active');
    // Update icon to X
    menuToggle.innerHTML = '<i data-lucide="x"></i>';
    createIcons({ icons: { X } });
    lenis.stop(); // Prevent scrolling when menu is open
  } else {
    mobileMenu.classList.remove('active');
    // Update icon back to Menu
    menuToggle.innerHTML = '<i data-lucide="menu"></i>';
    createIcons({ icons: { Menu } });
    lenis.start();
  }
});

// Close menu on link click
document.querySelectorAll('.mobile-link, .mobile-menu .btn').forEach(link => {
  link.addEventListener('click', () => {
    isMenuOpen = false;
    mobileMenu.classList.remove('active');
    menuToggle.innerHTML = '<i data-lucide="menu"></i>';
    createIcons({ icons: { Menu } });
    lenis.start();
  });
});

// Accordion Logic
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
  const header = item.querySelector('.accordion-header');
  const content = item.querySelector('.accordion-content');
  
  if (item.classList.contains('active')) {
    content.style.maxHeight = content.scrollHeight + "px";
  }

  header.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    
    // Close all
    accordionItems.forEach(otherItem => {
      otherItem.classList.remove('active');
      otherItem.querySelector('.accordion-content').style.maxHeight = null;
    });

    // Open clicked if it wasn't already open
    if (!isActive) {
      item.classList.add('active');
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

// --- GSAP Animations ---

// Initial load animation for Hero
const tl = gsap.timeline();

tl.to('.reveal-text span', {
  y: '0%',
  opacity: 1,
  duration: 1,
  stagger: 0.15,
  ease: 'power4.out',
  delay: 0.2
})
.fromTo('.reveal-text-delay', 
  { y: 30, opacity: 0 }, 
  { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 
  "-=0.6"
)
.fromTo('.reveal-fade', 
  { y: 20, opacity: 0 }, 
  { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 
  "-=0.6"
);

// Scroll Animations for Sections
const sections = document.querySelectorAll('.work, .services, .footer');

sections.forEach(section => {
  gsap.fromTo(section,
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
      }
    }
  );
});

// Video carousels are animated with pure CSS in style.css

// Sales Popup Logic
const salesNames = ["Ana Luiza", "Marcos V.", "Juliana C.", "Pedro H.", "Fernanda S.", "Lucas M.", "Beatriz T.", "Rafael D.", "Camila R.", "Thiago L.", "Letícia F.", "João G.", "Mariana P.", "Gabriel A.", "Amanda S.", "Felipe N.", "Bruna E.", "Gustavo C.", "Isabela B.", "Rodrigo M."];
const salesPopup = document.getElementById('salesPopup');
const buyerNameEl = document.getElementById('buyerName');

function showSalesPopup() {
  const randomName = salesNames[Math.floor(Math.random() * salesNames.length)];
  
  if(buyerNameEl) {
    buyerNameEl.textContent = randomName;
  }
  
  salesPopup.classList.add('active');
  
  setTimeout(() => {
    salesPopup.classList.remove('active');
  }, 6000);
}

if (salesPopup) {
  setTimeout(() => {
    showSalesPopup();
    setInterval(showSalesPopup, 40000);
  }, 5000); // Initial pop after 5 seconds
}

// Countdown Timer Logic
const hoursEl = document.getElementById('timerHours');
const minutesEl = document.getElementById('timerMinutes');
const secondsEl = document.getElementById('timerSeconds');

if (hoursEl && minutesEl && secondsEl) {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  let targetTime = localStorage.getItem('offerTargetTime');

  if (!targetTime || new Date().getTime() > targetTime) {
    targetTime = new Date().getTime() + TWENTY_FOUR_HOURS;
    localStorage.setItem('offerTargetTime', targetTime);
  }

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetTime - now;

    if (distance < 0) {
      targetTime = now + TWENTY_FOUR_HOURS;
      localStorage.setItem('offerTargetTime', targetTime);
    } else {
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      hoursEl.innerText = hours.toString().padStart(2, '0');
      minutesEl.innerText = minutes.toString().padStart(2, '0');
      secondsEl.innerText = seconds.toString().padStart(2, '0');
    }
  }

  setInterval(updateTimer, 1000);
  updateTimer();
}
