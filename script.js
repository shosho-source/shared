/* ==========================================================================
   REELDROP — Minimal JavaScript Logic & WebGL Fluid Simulation
   ========================================================================== */

(function () {
  'use strict';

  // Target Google Drive Download URL
  const googleDriveDownloadUrl = "https://drive.google.com/file/d/1Rm2fKtTlNSowmuR-RE6mkI9M5l3ZBF-P/view?usp=sharing";

  // DOM Element References
  const loader = document.getElementById('loader');
  const fluidCanvas = document.getElementById('fluid-canvas');
  const logoBtn = document.getElementById('logo-btn');
  const downloadBtn = document.getElementById('download-btn');
  const downloadBtnText = document.getElementById('download-btn-text');

  /* --------------------------------------------------------------------------
     1. Loader Screen Timer & Safety Fallback
     -------------------------------------------------------------------------- */
  function hideLoader() {
    if (loader && !loader.classList.contains('fade-out')) {
      requestAnimationFrame(function () {
        loader.classList.add('fade-out');
      });
    }
  }

  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 150);
  } else {
    window.addEventListener('load', function () {
      setTimeout(hideLoader, 200);
    }, { once: true, passive: true });
    // Safety fallback
    setTimeout(hideLoader, 1200);
  }

  /* --------------------------------------------------------------------------
     2. WebGL Fluid Background Initialization (Device-Aware & Optimized)
     -------------------------------------------------------------------------- */
  let fluidInstance = null;

  function initFluid() {
    if (!fluidCanvas || !window.WebGLFluidCustom) return;

    try {
      const isMobile = window.innerWidth < 768 || (navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
      const simRes = isMobile ? 64 : 128;
      const dyeRes = isMobile ? 512 : 1024;

      fluidInstance = window.WebGLFluidCustom(fluidCanvas, {
        IMMEDIATE: true,
        TRIGGER: 'hover',
        SIM_RESOLUTION: simRes,
        DYE_RESOLUTION: dyeRes,
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 3.0,
        VELOCITY_DISSIPATION: 0.9,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 8,
        CURL: 35,
        SPLAT_RADIUS: 0.1,
        SPLAT_FORCE: 1200,
        SHADING: false,
        COLORFUL: true,
        GUI: false,
        PAUSED: false,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        TRANSPARENT: false,
        BLOOM: false,
        SUNRAYS: false,
      });

      // Initial subtle gesture trigger
      requestAnimationFrame(function () {
        const rect = fluidCanvas.getBoundingClientRect();
        window.dispatchEvent(
          new MouseEvent('mousemove', {
            clientX: rect.width * 0.5,
            clientY: rect.height * 0.35,
            bubbles: true,
          })
        );
      });
    } catch (e) {
      console.warn('Fluid simulation init note:', e);
    }
  }

  if (window.WebGLFluidCustom) {
    initFluid();
  } else {
    window.addEventListener('DOMContentLoaded', initFluid, { once: true, passive: true });
  }

  // Optimize background tab resources
  document.addEventListener('visibilitychange', function () {
    if (fluidInstance && typeof fluidInstance.pause === 'function') {
      if (document.hidden) {
        fluidInstance.pause();
      } else {
        fluidInstance.resume();
      }
    }
  }, { passive: true });

  /* --------------------------------------------------------------------------
     3. Navigation Logo Interaction (Click & Keyboard)
     -------------------------------------------------------------------------- */
  function handleLogoClick() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (logoBtn) {
    logoBtn.addEventListener('click', handleLogoClick);
    logoBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleLogoClick();
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. Download Button & Confetti Action
     -------------------------------------------------------------------------- */
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
      if (downloadBtnText) {
        downloadBtnText.textContent = 'OPENING GDRIVE...';
      }

      // Trigger Canvas Confetti if available
      if (typeof confetti === 'function') {
        try {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#000000', '#555555', '#999999', '#ffffff']
          });
        } catch (e) {
          // safe fallback
        }
      }

      // Open target Google Drive URL
      window.open(googleDriveDownloadUrl, '_blank', 'noopener,noreferrer');

      setTimeout(function () {
        if (downloadBtnText) {
          downloadBtnText.textContent = 'DOWNLOAD TORRENT';
        }
      }, 1200);
    });
  }

})();
