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

    // B. Interactive 3D Canvas for Project 4 (3D CV & Gesture Lab)
    init3DCVLabCanvas();

    // C. Dynamic ASCII Live Preview for Project 5
    initAsciiGenerator();
  }

  // 3D Computer Vision Wireframe & Landmark Simulation
  function init3DCVLabCanvas() {
    const canvas = document.getElementById('cv3dCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 3D Landmark Nodes (Simulating 3D hand tracking landmarks)
    const nodes = [
      { x: 0, y: 35, z: 0 },    // 0: Wrist
      { x: -28, y: 20, z: -5 }, // 1: Thumb CMC
      { x: -38, y: 0, z: -8 },  // 2: Thumb MCP
      { x: -44, y: -15, z: -10 },// 3: Thumb IP
      { x: -48, y: -30, z: -12 },// 4: Thumb Tip
      { x: -16, y: -10, z: 0 }, // 5: Index MCP
      { x: -18, y: -32, z: 2 }, // 6: Index PIP
      { x: -19, y: -50, z: 4 }, // 7: Index DIP
      { x: -20, y: -64, z: 5 }, // 8: Index Tip
      { x: 2, y: -12, z: 0 },   // 9: Middle MCP
      { x: 2, y: -36, z: 3 },   // 10: Middle PIP
      { x: 2, y: -56, z: 5 },   // 11: Middle DIP
      { x: 2, y: -72, z: 6 },   // 12: Middle Tip
      { x: 18, y: -10, z: 0 },  // 13: Ring MCP
      { x: 20, y: -30, z: 2 },  // 14: Ring PIP
      { x: 21, y: -48, z: 4 },  // 15: Ring DIP
      { x: 22, y: -62, z: 5 },  // 16: Ring Tip
      { x: 32, y: 2, z: -2 },   // 17: Pinky MCP
      { x: 36, y: -16, z: 0 },  // 18: Pinky PIP
      { x: 38, y: -30, z: 1 },  // 19: Pinky DIP
      { x: 40, y: -44, z: 2 }   // 20: Pinky Tip
    ];

    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [5, 9], [9, 10], [10, 11], [11, 12],
      [9, 13], [13, 14], [14, 15], [15, 16],
      [13, 17], [17, 18], [18, 19], [19, 20],
      [0, 17]
    ];

    let angleX = 0.2;
    let angleY = 0;
    let isMouseOver = false;
    let targetAngleY = 0;

    const wrapper = canvas.closest('.cv3d-visual-wrapper');
    if (wrapper) {
      wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        targetAngleY = ((e.clientX - rect.left) / rect.width - 0.5) * 1.5;
        isMouseOver = true;
      });
      wrapper.addEventListener('mouseleave', () => {
        isMouseOver = false;
      });
    }

    function render3D() {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h);

      if (isMouseOver) {
        angleY += (targetAngleY - angleY) * 0.08;
      } else {
        angleY += 0.012;
      }

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      const fov = 180;
      const cx = w / 2;
      const cy = h / 2 + 10;

      // Project 3D nodes
      const projected = nodes.map((node) => {
        // Rotate around Y
        const rx = node.x * cosY - node.z * sinY;
        const rz = node.x * sinY + node.z * cosY;
        // Rotate around X
        const ry = node.y * cosX - rz * sinX;
        const rz2 = node.y * sinX + rz * cosX;

        const distance = fov + rz2;
        const scale = fov / Math.max(distance, 10);
        return {
          x: cx + rx * scale,
          y: cy + ry * scale,
          z: rz2,
          scale: scale
        };
      });

      // Draw Connections (Bone Links)
      ctx.lineWidth = 1.8;
      connections.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        grad.addColorStop(0, 'rgba(59, 130, 246, 0.7)');
        grad.addColorStop(1, 'rgba(96, 165, 250, 0.5)');
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Draw 3D Landmark Nodes
      projected.forEach((p, idx) => {
        const radius = (idx === 4 || idx === 8 || idx === 12 || idx === 16 || idx === 20) ? 4.5 : 3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        if (idx === 8) {
          // Index tip (drawing stylus)
          ctx.fillStyle = '#10b981';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = '#60a5fa';
          ctx.shadowColor = '#3b82f6';
          ctx.shadowBlur = 6;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(render3D);
    }

    render3D();
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
    const interactiveQuery = 'a, button, .dock-app, .liquid-card, .stat-box, .social-tag, .skill-pill-item, input, textarea, select, [role="button"], .dot, .scroll-down-hint, .view-project-btn, .status-pill, .resume-btn, .nav-brand';

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
