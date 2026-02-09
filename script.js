/**
 * Kit de Contratos Imobiliários - Landing Page
 * JavaScript para animações e interatividade
 */

document.addEventListener('DOMContentLoaded', function() {
  // =========================
  // SCROLL ANIMATIONS
  // =========================
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        
        setTimeout(() => {
          entry.target.classList.add('animate-visible');
        }, delay);
        
        // Unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(el => observer.observe(el));
  
  // =========================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // =========================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // =========================
  // DYNAMIC YEAR IN FOOTER
  // =========================
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // =========================
  // BUTTON CLICK TRACKING
  // =========================
  const ctaButtons = document.querySelectorAll('.btn');
  
  ctaButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Add ripple effect
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
  
  // =========================
  // PARALLAX EFFECT FOR HERO
  // =========================
  const heroImage = document.querySelector('.hero-image-desktop img');
  
  if (heroImage && window.innerWidth > 1024) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.05;
      heroImage.style.transform = `translateY(${rate}px)`;
    }, { passive: true });
  }
  
  // =========================
  // NAVBAR BACKGROUND ON SCROLL
  // =========================
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow to sections when scrolling
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        section.style.opacity = '1';
      }
    });
    
    lastScroll = currentScroll;
  }, { passive: true });
  
  // =========================
  // LAZY LOAD IMAGES
  // =========================
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '50px' });
  
  images.forEach(img => imageObserver.observe(img));
  
  // =========================
  // FORM VALIDATION (if needed)
  // =========================
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });
      
      if (!isValid) {
        e.preventDefault();
      }
    });
  });
  
  // =========================
  // COUNTDOWN TIMER (optional)
  // =========================
  function startCountdown(endDate, elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    function updateCountdown() {
      const now = new Date().getTime();
      const distance = endDate - now;
      
      if (distance < 0) {
        element.innerHTML = 'Oferta encerrada';
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      element.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
  
  // Example: Start countdown for 7 days from now
  // const endDate = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
  // startCountdown(endDate, 'countdown');
  
  // =========================
  // ANALYTICS TRACKING
  // =========================
  // Track CTA clicks
  const ctaHero = document.getElementById('cta-hero');
  const ctaFinal = document.getElementById('cta-final');
  
  if (ctaHero) {
    ctaHero.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          event_category: 'CTA',
          event_label: 'Hero Button'
        });
      }
      
      if (typeof fbq !== 'undefined') {
        fbq('track', 'InitiateCheckout');
      }
    });
  }
  
  if (ctaFinal) {
    ctaFinal.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          event_category: 'CTA',
          event_label: 'Final Button'
        });
      }
      
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Purchase', { value: 187, currency: 'BRL' });
      }
    });
  }
  
  // =========================
  // PERFORMANCE OPTIMIZATION
  // =========================
  // Preload critical resources
  const preloadLinks = [
    'img/leo-hero-desktop.png',
    'img/leo-hero-mobile.png'
  ];
  
  preloadLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = href;
    document.head.appendChild(link);
  });
  
  console.log('🚀 Landing Page Loaded Successfully!');
});

// =========================
// CSS ANIMATION KEYFRAMES (injected via JS)
// =========================
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;
document.head.appendChild(style);

