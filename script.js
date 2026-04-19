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
  });
});

window.addEventListener("load", () => {
  // Səhifə həmişə yuxarıdan başlasın (hash yoxdursa)
  if (!location.hash) {
    window.scrollTo(0, 0);
  }

  // Reveal animasiyası
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      const el = entry.target;

      if (entry.isIntersecting) {
        el.classList.add("visible");
        obs.unobserve(el); // Element göründükdən sonra izləməni dayandır
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal").forEach((el) => {
    observer.observe(el);
  });

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
