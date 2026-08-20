/* ==========================================================================
   REELDROP — Minimal JavaScript Logic & WebGL Fluid Simulation
   ========================================================================== */

(function () {
  'use strict';

  // Target Google Drive Download URL
  const googleDriveDownloadUrl = "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing";

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
      loader.classList.add('fade-out');
    }
  }

  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 300);
  } else {
    window.addEventListener('load', function () {
      setTimeout(hideLoader, 500);
    });
    // Fallback in case window load event already fired or is delayed
    setTimeout(hideLoader, 2000);
  }

  /* --------------------------------------------------------------------------
     2. WebGL Fluid Background Initialization
     -------------------------------------------------------------------------- */
  function initFluid() {
    if (!fluidCanvas || !window.WebGLFluidCustom) return;

    try {
      window.WebGLFluidCustom(fluidCanvas, {
        IMMEDIATE: true,
        TRIGGER: 'hover',
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 3.0,
        VELOCITY_DISSIPATION: 0.9,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 10,
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
      setTimeout(function () {
        const rect = fluidCanvas.getBoundingClientRect();
        window.dispatchEvent(
          new MouseEvent('mousemove', {
            clientX: rect.width * 0.5,
            clientY: rect.height * 0.35,
            bubbles: true,
          })
        );
      }, 300);
    } catch (e) {
      console.warn('Fluid simulation init note:', e);
    }
  }

  if (window.WebGLFluidCustom) {
    initFluid();
  } else {
    window.addEventListener('DOMContentLoaded', function () {
      setTimeout(initFluid, 400);
    });
  }

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
