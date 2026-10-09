/**
 * PARTH VARIYA — PORTFOLIO
 * Liquid Glass Studio & Creative Experience
 * Features: Responsive Parallax, macOS Dock Magnification, Studio Theme Switcher,
 * Smooth Navigation & Liquid Glass Micro-Interactions
 */

(function () {
  'use strict';

  // State
  let isSoundEnabled = true;

  // Web Audio API for subtle tactile feedback
  let audioCtx = null;
  function playClickSound(freq = 600, duration = 0.04) {
    if (!isSoundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.035, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio not supported or blocked by browser policy
    }
  }

  // =========================================================================
  // 1. PARALLAX PHYSICS FOR HERO SECTION
  // =========================================================================
  function initParallax() {
    const stage = document.getElementById('heroStage');
    const centerSubject = document.getElementById('centerSubject');
    const floorShadow = document.querySelector('.subject-floor-shadow');
    const typoWrap = document.querySelector('.giant-typography-wrap');
    const cardLeft = document.getElementById('cardLeft');
    const cardRight = document.getElementById('cardRight');

    if (!stage || !centerSubject) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const lerp = 0.08;

    function onMouseMove(e) {
      const rect = stage.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // Normalized between -1 and 1
      targetX = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)));
      targetY = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));
    }

    function onMouseLeave() {
      targetX = 0;
      targetY = 0;
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    stage.addEventListener('mouseleave', onMouseLeave);

    // Continuous Animation Loop
    function renderParallax() {
      currentX += (targetX - currentX) * lerp;
      currentY += (targetY - currentY) * lerp;

      // 1. Center subject 3D Tilt
      const rotY = currentX * 14; // degrees
      const rotX = -currentY * 12; // degrees
      const transX = currentX * 18;
      const transY = currentY * 12;

      centerSubject.style.transform = `translate3d(${transX}px, ${transY}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`;

      // Floor Shadow shift
      if (floorShadow) {
        const shadowX = -currentX * 22;
        const shadowScale = 1 - Math.abs(currentY) * 0.15;
        floorShadow.style.transform = `translateX(calc(-50% + ${shadowX}px)) scale(${shadowScale})`;
      }

      // 2. Giant Typography Background Parallax (Counter-drift)
      if (typoWrap) {
        const typoX = -currentX * 16;
        const typoY = -currentY * 10;
        typoWrap.style.transform = `translate3d(${typoX}px, ${typoY}px, 0)`;
      }

      // 3. Floating Left Glass Card
      if (cardLeft && window.innerWidth > 992) {
        const leftX = currentX * 26;
        const leftY = currentY * 20;
        const leftRotX = -currentY * 6;
        const leftRotY = currentX * 6;
        cardLeft.style.transform = `translate3d(${leftX}px, ${leftY}px, 20px) rotateX(${leftRotX}deg) rotateY(${leftRotY}deg)`;
      }

      // 4. Floating Right Glass Card
      if (cardRight && window.innerWidth > 992) {
        const rightX = currentX * 28;
        const rightY = currentY * 22;
        const rightRotX = -currentY * 7;
        const rightRotY = currentX * 7;
        cardRight.style.transform = `translate3d(${rightX}px, ${rightY}px, 25px) rotateX(${rightRotX}deg) rotateY(${rightRotY}deg)`;
      }

      requestAnimationFrame(renderParallax);
    }

    renderParallax();
  }

  // =========================================================================
  // 2. MACOS FLOATING DOCK MAGNIFICATION
  // =========================================================================
  function initDockMagnification() {
    const dock = document.querySelector('.floating-dock-glass');
    if (!dock) return;

    const apps = dock.querySelectorAll('.dock-app');
    const maxScale = 1.35;
    const baseScale = 1.0;
    const maxDistance = 90; // pixels

    dock.addEventListener('mousemove', (e) => {
      apps.forEach((app) => {
        const rect = app.getBoundingClientRect();
        const appCenter = rect.left + rect.width / 2;
        const distance = Math.abs(e.clientX - appCenter);

        if (distance < maxDistance) {
          const ratio = (maxDistance - distance) / maxDistance;
          const scale = baseScale + (maxScale - baseScale) * Math.sin((ratio * Math.PI) / 2);
          const translateY = -10 * ratio;
          app.style.transform = `translateY(${translateY}px) scale(${scale})`;
        } else {
          app.style.transform = `translateY(0) scale(1)`;
        }
      });
    });

    dock.addEventListener('mouseleave', () => {
      apps.forEach((app) => {
        app.style.transform = `translateY(0) scale(1)`;
      });
    });

    apps.forEach((app) => {
      app.addEventListener('click', () => {
        playClickSound(800, 0.05);
      });
    });
  }

  // =========================================================================
  // 3. STUDIO THEME TOGGLE (LIGHT / DARK)
  // =========================================================================
  function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    // Check localStorage or preferred scheme
    const savedTheme = localStorage.getItem('pv_studio_theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('studio-dark');
      document.body.classList.remove('studio-light');
    }

    btn.addEventListener('click', () => {
      playClickSound(850, 0.04);
      if (document.body.classList.contains('studio-dark')) {
        document.body.classList.remove('studio-dark');
        document.body.classList.add('studio-light');
        localStorage.setItem('pv_studio_theme', 'light');
      } else {
        document.body.classList.add('studio-dark');
        document.body.classList.remove('studio-light');
        localStorage.setItem('pv_studio_theme', 'dark');
      }
    });
  }

  // =========================================================================
  // 4. NAVIGATION, PAGINATION & SCROLL SPY
  // =========================================================================
  function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const paginationDots = document.querySelectorAll('.pagination-dots .dot');
    const sections = document.querySelectorAll('section[id], footer[id]');

    function updateActiveNav() {
      const scrollPos = window.scrollY + 220;
      sections.forEach((sec) => {
        const id = sec.getAttribute('id');
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach((l) => {
            if (l.getAttribute('href') === `#${id}`) {
              l.classList.add('active');
            } else {
              l.classList.remove('active');
            }
          });

          paginationDots.forEach((dot) => {
            if (dot.getAttribute('data-target') === id) {
              dot.classList.add('active');
            } else {
              dot.classList.remove('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    paginationDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const targetId = dot.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
          playClickSound(650, 0.04);
        }
      });
    });

    const exploreBtn = document.getElementById('btnExploreWork');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        playClickSound(700, 0.05);
      });
    }

    // Add subtle click feedback to all project links
    document.querySelectorAll('.view-project-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        playClickSound(750, 0.05);
      });
    });
  }

  // =========================================================================
  // 5. LIQUID GLASS SCROLL-STACKING ANIMATION & 3D PROJECT LAB
  // =========================================================================
  function initProjectCardsInteractive() {
    const cards = Array.from(document.querySelectorAll('.stack-card'));
    if (!cards.length) return;

    // A. Scroll-driven card stacking scale & depth
    function onScrollStacking() {
      const windowHeight = window.innerHeight;
      cards.forEach((card, idx) => {
        // Look at the card directly following this one
        const nextCard = cards[idx + 1];
        if (!nextCard) return;

        const nextRect = nextCard.getBoundingClientRect();
        const nextStickyTop = parseInt(window.getComputedStyle(nextCard).top, 10) || (135 + idx * 55);

        // When the next card reaches its sticky threshold, the current card gets scaled slightly
        if (nextRect.top <= nextStickyTop + 60) {
          const depth = cards.length - 1 - idx;
          const scale = Math.max(0.93, 1 - depth * 0.02);
          const brightness = Math.max(0.88, 1 - depth * 0.035);
          card.style.transform = `scale(${scale})`;
          card.style.filter = `brightness(${brightness})`;
        } else {
          card.style.transform = 'scale(1)';
          card.style.filter = 'brightness(1)';
        }
      });
    }

    window.addEventListener('scroll', onScrollStacking, { passive: true });
    onScrollStacking();

    // B. Dynamic ASCII Live Preview for Project 4
    initAsciiGenerator();
  }

  // Live ASCII Art Matrix Stream Generator
  function initAsciiGenerator() {
    const box = document.getElementById('asciiMockCanvas');
    if (!box) return;

    const asciiFrames = [
`  .---.  ASCII MATRIX LAB  .---.
 /     \\   [LIVE BITSTREAM] /     \\
| () () |   FRAME 0108 //  | () () |
 \\  ^  /    SHADOW BUFFER   \\  ^  /
  |||||     ================ ||||| 
  '---'     RESOLUTION: 140c '---' `,
`  .---.  ASCII MATRIX LAB  .---.
 /  o  \\   [LIVE BITSTREAM] /  o  \\
|       |   FRAME 0109 //  |       |
 \\  =  /    SHADOW BUFFER   \\  =  /
  |||||     ================ ||||| 
  '---'     RESOLUTION: 140c '---' `,
`  .---.  ASCII MATRIX LAB  .---.
 /  ^  \\   [LIVE BITSTREAM] /  ^  \\
| (o o) |   FRAME 0110 //  | (o o) |
 \\  -  /    SHADOW BUFFER   \\  -  /
  |||||     ================ ||||| 
  '---'     RESOLUTION: 140c '---' `
    ];

    let frameIndex = 0;
    setInterval(() => {
      frameIndex = (frameIndex + 1) % asciiFrames.length;
      box.textContent = asciiFrames[frameIndex];
    }, 1200);
  }

  // =========================================================================
  // 6. LIQUID GLASS CUSTOM CURSOR WITH DOTTED HOVER RING
  // =========================================================================
  function initLiquidGlassCursor() {
    // Only run on desktop devices with fine pointer
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const wrapper = document.getElementById('liquidCursor');
    const follower = document.getElementById('cursorFollower');
    const dot = document.getElementById('cursorDot');
    const orb = document.getElementById('glassOrb');
    if (!wrapper || !follower || !dot) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let followerX = targetX;
    let followerY = targetY;
    let dotX = targetX;
    let dotY = targetY;
    let isVisible = false;

    // Fluid requestAnimationFrame render loop with liquid spring physics
    function loop() {
      // Fluid physics: follower has liquid spring lag
      followerX += (targetX - followerX) * 0.16;
      followerY += (targetY - followerY) * 0.16;

      // Inner dot has fast tactile response
      dotX += (targetX - dotX) * 0.75;
      dotY += (targetY - dotY) * 0.75;

      // Liquid stretch deformation based on motion velocity
      const vx = targetX - followerX;
      const vy = targetY - followerY;
      const speed = Math.sqrt(vx * vx + vy * vy);
      const angle = Math.atan2(vy, vx) * (180 / Math.PI);
      const stretch = Math.min(speed * 0.002, 0.22);

      follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
      if (orb) {
        orb.style.transform = `rotate(${angle}deg) scale(${1 + stretch}, ${1 - stretch * 0.5})`;
      }
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        wrapper.classList.add('is-active');
      }
    });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      wrapper.classList.remove('is-active');
    });

    document.addEventListener('mouseenter', () => {
      isVisible = true;
      wrapper.classList.add('is-active');
    });

    window.addEventListener('mousedown', () => {
      follower.classList.add('is-clicking');
      dot.classList.add('is-clicking');
    });

    window.addEventListener('mouseup', () => {
      follower.classList.remove('is-clicking');
      dot.classList.remove('is-clicking');
    });

    // Elements that trigger the hover ring (like in the video reference)
    const interactiveQuery = 'a, button, .dock-app, .liquid-card, .stat-box, .social-tag, .skill-pill-item, input, textarea, select, [role="button"], .dot, .scroll-down-hint, .view-project-btn, .status-pill, .resume-btn, .nav-brand, .outreach-channel-link, .stat-glass-tile';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveQuery)) {
        follower.classList.add('is-hovering');
        dot.classList.add('is-hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveQuery)) {
        if (!e.relatedTarget || !e.relatedTarget.closest(interactiveQuery)) {
          follower.classList.remove('is-hovering');
          dot.classList.remove('is-hovering');
        }
      }
    });
  }

  // Initialize all subsystems on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    initDockMagnification();
    initThemeToggle();
    initNavigation();
    initProjectCardsInteractive();
    initLiquidGlassCursor();
  });
})();
