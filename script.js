// Brauzer əvvəlki scroll yerini xatırlamasın
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// Səhifə yeniləndiyi an yuxarıdan başlasın
if (!location.hash) {
  window.scrollTo(0, 0);
}

document.addEventListener("DOMContentLoaded", () => {
  // İframe-lərin səbəb olduğu qəfil donma və "sanki yenilənmə" hissinin yekun həlli:
  // Layihələr eyni anda yüklənib saytı dondurmasın deyə, içəridəki saytları (iframe)
  // yalnız istifadəçi mausu layihənin üzərinə gətirəndə (hover) və ya toxunanda yükləyirik.
  document.querySelectorAll(".project-card").forEach((card) => {
    const iframe = card.querySelector("iframe");
    if (iframe && iframe.src) {
      iframe.dataset.src = iframe.src; 
      iframe.removeAttribute("src");
      
      // Sayt anidən qırpılmasın deyə zərif görünmə (Fade-in) effekti tətbiq edirik
      iframe.style.opacity = "0";
      iframe.style.transition = "opacity 0.6s ease-in-out";

      const loadIframe = () => {
        if (iframe.dataset.src) {
          iframe.src = iframe.dataset.src;
          iframe.removeAttribute("data-src");
          iframe.onload = () => { iframe.style.opacity = "1"; }; // Tam yüklənəndə göstər
        }
      };

      // İstəkdən asılı olaraq animasiyalı yüklənmə
      card.addEventListener("mouseenter", loadIframe, { once: true });
      card.addEventListener("touchstart", loadIframe, { once: true, passive: true });
    }

    // 3D Tilt Animasiyası
    if (window.matchMedia("(pointer: fine)").matches) { // Yalnız mausla işləyən cihazlarda
      let bounds;
      card.addEventListener("mouseenter", () => { bounds = card.getBoundingClientRect(); });
      
      card.addEventListener("mousemove", (e) => {
        if (!bounds) bounds = card.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;
        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -6; // Maksimum 6 dərəcə fırlanma
        const rotateY = ((x - centerX) / centerX) * 6;
        
        card.style.transition = "transform 0.1s ease-out";
        card.style.transform = `perspective(1000px) scale(1.02) translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transition = ""; // CSS-dəki orijinal transition-a qayıt
        card.style.transform = ""; // CSS-dəki orijinal transform-a qayıt
        bounds = null;
      });
    }
  });
});

window.addEventListener("load", () => {
  // Səhifə həmişə yuxarıdan başlasın (hash yoxdursa)
  if (!location.hash) {
    window.scrollTo(0, 0);
  }

  // Reveal animasiyası
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -20px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;

      if (entry.isIntersecting) {
        el.classList.add("visible");
      } else {
        el.classList.remove("visible"); // Element ekrandan çıxanda görünməz olsun, bir daha gələndə animasiya yenidən işləsin
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal").forEach((el) => {
    observer.observe(el);
  });

  // Cursor Animasiyası Məntiqi
  const cursor = document.querySelector('.custom-cursor');
  const trail = document.querySelector('.cursor-trail');

  if (cursor && trail) {
    let mouseX = -100;
    let mouseY = -100;
    let isCursorMoving = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isCursorMoving) {
        isCursorMoving = true;
        requestAnimationFrame(() => {
          cursor.style.setProperty('--tx', `${mouseX - 4}px`);
          cursor.style.setProperty('--ty', `${mouseY - 4}px`);
          trail.style.setProperty('--tx', `${mouseX - 16}px`);
          trail.style.setProperty('--ty', `${mouseY - 16}px`);
          isCursorMoving = false;
        });
      }
    }, { passive: true });

    // Aktiv elementlərin üzərinə gələndə effekt
    const interactables = 'a, button, .card, .project-card, .nav-toggle, input, textarea';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactables)) trail.classList.add('hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactables)) trail.classList.remove('hover');
    });
  }

  // Footer ili
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Mobil menyu
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");

  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      nav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
      });
    });
  }
});
