/* ============================================
   STARTUPSPHERE - script.js
   Theme Toggle + Scroll Reveal + Counters
   ============================================ */

/* ── 1. THEME TOGGLE ─────────────────────────── */
function toggleTheme() {
  const body = document.body;
  const isDark = body.getAttribute('data-theme') !== 'light';
  const newTheme = isDark ? 'light' : 'dark';

  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('ss-theme', newTheme);

  // Update all toggle buttons emoji
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.textContent = newTheme === 'light' ? '☀️' : '🌙';
  });
}

// Apply saved theme on page load
(function () {
  const saved = localStorage.getItem('ss-theme') || 'dark';
  document.body.setAttribute('data-theme', saved);

  // Sync button emoji after DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.textContent = saved === 'light' ? '☀️' : '🌙';
    });
  });
})();


/* ── 2. SCROLL REVEAL ────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger cards inside a row
        const siblings = entry.target.parentElement.querySelectorAll(
          '[data-reveal], .glass-card'
        );
        let delay = 0;
        siblings.forEach((el, idx) => {
          if (el === entry.target) delay = idx * 80;
        });

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  // Observe all glass-cards and data-reveal elements
  document.querySelectorAll('.glass-card, [data-reveal]').forEach(el => {
    revealObserver.observe(el);
  });


  /* ── 3. COUNTER ANIMATION ──────────────────── */
  function animateCounter(el, target, duration = 1800) {
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        if (counter.dataset.done) return;
        counter.dataset.done = '1';
        const target = parseInt(counter.dataset.target, 10);
        animateCounter(counter, target);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.counter[data-target]').forEach(el => {
    counterObserver.observe(el);
  });


  /* ── 4. CATEGORY CHIP FILTER ───────────────── */
  const chips = document.querySelectorAll('.category-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });


  /* ── 5. SEARCH FILTER (ideas.html) ─────────── */
  const searchInput = document.querySelector('input[placeholder="Search startup ideas..."]');
  const ideaCards   = document.querySelectorAll('.idea-card');

  if (searchInput && ideaCards.length) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      ideaCards.forEach(card => {
        const title = card.querySelector('h5')?.textContent.toLowerCase() || '';
        const desc  = card.querySelector('p')?.textContent.toLowerCase()  || '';
        card.style.display = (title.includes(query) || desc.includes(query)) ? '' : 'none';
      });
    });
  }


  /* ── 6. NAVBAR ACTIVE LINK ──────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
  });


  /* ── 7. FORM SUBMIT FEEDBACK ────────────────── */
  document.querySelectorAll('form button[type="button"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const form = btn.closest('form');
      if (!form) return;

      // Simple required-field check
      const inputs = form.querySelectorAll('input[type="text"], input[type="email"], textarea');
      let allFilled = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#ef4444';
          input.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.18)';
          allFilled = false;
          setTimeout(() => {
            input.style.borderColor = '';
            input.style.boxShadow   = '';
          }, 2000);
        }
      });

      if (allFilled) {
        btn.textContent = '✅ Submitted!';
        btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
        setTimeout(() => {
          btn.textContent = btn.dataset.original || btn.textContent;
          btn.style.background = '';
        }, 2500);
      }
    });

    // Store original text
    btn.dataset.original = btn.textContent;
  });

});


/* ── 8. SMOOTH PAGE TRANSITION ──────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 30);
});