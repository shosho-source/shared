/* ==========================================================================
   MOODFLIX — Minimal JavaScript Logic & WebGL Fluid Simulation
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

  // Auth DOM Elements
  const authView = document.getElementById('auth-view');
  const downloadView = document.getElementById('download-view');
  const tutorialView = document.getElementById('tutorial-view');
  const backToDownloadBtn = document.getElementById('back-to-download-btn');
  const googleLoginBtn = document.getElementById('google-login-btn');
  const loginBtnText = document.getElementById('login-btn-text');
  const userProfile = document.getElementById('user-profile');
  const userEmailSpan = document.getElementById('user-email');
  const signoutBtn = document.getElementById('signout-btn');

  // In-Page Retro Modal DOM Elements
  const gdriveModal = document.getElementById('gdrive-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const proceedTutorialBtn = document.getElementById('proceed-tutorial-btn');
  const modalFrameLoader = document.getElementById('modal-frame-loader');
  const gdriveIframe = document.getElementById('gdrive-iframe');

  // Watch Trailer Modal DOM Elements
  const trailerModal = document.getElementById('trailer-modal');
  const trailerBtn = document.getElementById('trailer-btn');
  const trailerBtnText = document.getElementById('trailer-btn-text');
  const closeTrailerModalBtn = document.getElementById('close-trailer-modal-btn');
  const trailerModalBackdrop = document.getElementById('trailer-modal-backdrop');
  const closeTrailerBtnBottom = document.getElementById('close-trailer-btn-bottom');
  const trailerIframe = document.getElementById('trailer-iframe');
  const trailerFrameLoader = document.getElementById('trailer-frame-loader');

  // Supabase Configuration
  const SUPABASE_URL = "https://qtrbwgglmqydfpnwupkm.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0cmJ3Z2dsbXF5ZGZwbnd1cGttIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDY5NTgzMSwiZXhwIjoyMTAwMjcxODMxfQ.TQsJu25lOHoB3JjuRFeWb9tPXSbslSw-d9T3VSa1uq8";
  let supabaseClient = null;

  try {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
  } catch (e) {
    console.warn('Supabase init note:', e);
  }

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
     Universal Text Scramble System (Auto-resolves within 1 second)
     -------------------------------------------------------------------------- */
  const scrambleChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function scrambleText(element, targetText, duration) {
    if (!element) return;
    const dur = duration || 800;
    const target = targetText || element.getAttribute('data-original-text') || element.textContent.trim();
    if (element._scrambleInterval) clearInterval(element._scrambleInterval);

    let frame = 0;
    const totalFrames = Math.floor(dur / 25);

    element._scrambleInterval = setInterval(function () {
      frame++;
      const progress = frame / totalFrames;
      const revealedLength = Math.floor(target.length * progress);

      let output = '';
      for (let i = 0; i < target.length; i++) {
        if (target[i] === ' ' || target[i] === '\n') {
          output += target[i];
        } else if (i < revealedLength) {
          output += target[i];
        } else {
          output += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }
      }

      element.textContent = output;

      if (frame >= totalFrames) {
        element.textContent = target;
        clearInterval(element._scrambleInterval);
        element._scrambleInterval = null;
      }
    }, 25);
  }

  function attachCursorScramble(element) {
    if (!element) return;

    if (!element.getAttribute('data-original-text')) {
      element.setAttribute('data-original-text', element.textContent.trim());
    }

    let isScrambling = false;
    let loopInterval = null;
    let maxTimeout = null;
    let hoverRatio = 0.5;

    function stopAndResolve() {
      if (loopInterval) {
        clearInterval(loopInterval);
        loopInterval = null;
      }
      if (maxTimeout) {
        clearTimeout(maxTimeout);
        maxTimeout = null;
      }
      const targetText = element.getAttribute('data-original-text') || element.textContent.trim();
      scrambleText(element, targetText, 400);
      isScrambling = false;
    }

    element.addEventListener('mouseenter', function (e) {
      if (isScrambling) return;
      isScrambling = true;

      const targetText = element.getAttribute('data-original-text') || element.textContent.trim();
      const rect = element.getBoundingClientRect();
      if (rect.width > 0) hoverRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

      loopInterval = setInterval(function () {
        const len = targetText.length;
        const focusIndex = Math.floor(hoverRatio * len);

        let output = '';
        for (let i = 0; i < len; i++) {
          if (targetText[i] === ' ' || targetText[i] === '\n') {
            output += targetText[i];
            continue;
          }
          const dist = Math.abs(i - focusIndex);
          if (dist <= 3 || Math.random() < 0.35) {
            output += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          } else {
            output += targetText[i];
          }
        }
        element.textContent = output;
      }, 30);

      // Auto-stop after 1.0 second max, even if mouse stays on the text
      maxTimeout = setTimeout(function () {
        stopAndResolve();
      }, 850);
    });

    element.addEventListener('mousemove', function (e) {
      if (!isScrambling) return;
      const rect = element.getBoundingClientRect();
      if (rect.width > 0) hoverRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    });

    element.addEventListener('mouseleave', function () {
      if (isScrambling) {
        stopAndResolve();
      }
    });
  }

  function initUniversalTextScramble() {
    const selectors = [
      '.logo-title',
      '.status-text',
      '.hero-headline span',
      '.hero-subtitle',
      '.cta-title',
      '.user-email',
      '.footer-copyright',
      '.footer-tagline',
      '.loader-title',
      '.loader-subtitle',
      '.tutorial-headline',
      '.tutorial-subtitle',
      '.step-title',
      '.app-title'
    ];

    selectors.forEach(function (sel) {
      const elements = document.querySelectorAll(sel);
      elements.forEach(function (el) {
        attachCursorScramble(el);
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. Authentication & View State Logic (Google Log In -> Download -> Tutorial)
     -------------------------------------------------------------------------- */
  function resetScroll() {
    const mainContainer = document.querySelector('.site-main');
    if (mainContainer) mainContainer.scrollTop = 0;
    if (tutorialView) tutorialView.scrollTop = 0;
  }

  function showAuthView() {
    if (authView) authView.classList.remove('view-hidden');
    if (downloadView) downloadView.classList.add('view-hidden');
    if (tutorialView) tutorialView.classList.add('view-hidden');
    if (userProfile) userProfile.classList.add('hidden');
    if (loginBtnText) loginBtnText.textContent = 'CONTINUE WITH GOOGLE';
    resetScroll();
  }

  async function recordLoginLog(user) {
    if (!supabaseClient || !user) return;
    try {
      const logKey = 'logged_in_recorded_' + (user.id || user.email || 'user');
      if (sessionStorage.getItem(logKey)) return;

      await supabaseClient.from('login_logs').insert([
        {
          user_id: user.id || null,
          email: user.email || 'unknown',
          user_agent: navigator.userAgent
        }
      ]);

      sessionStorage.setItem(logKey, 'true');
    } catch (e) {
      console.warn('Could not record login log:', e);
    }
  }

  function showDownloadView(user) {
    if (authView) authView.classList.add('view-hidden');
    if (downloadView) downloadView.classList.remove('view-hidden');
    if (tutorialView) tutorialView.classList.add('view-hidden');
    if (userProfile) {
      userProfile.classList.remove('hidden');
      if (userEmailSpan) {
        const email = (user && user.email) ? user.email : 'USER';
        userEmailSpan.textContent = email.split('@')[0].toUpperCase();
      }
    }
    if (user) {
      recordLoginLog(user);
    }
    resetScroll();
  }

  function showTutorialView() {
    if (authView) authView.classList.add('view-hidden');
    if (downloadView) downloadView.classList.add('view-hidden');
    if (tutorialView) tutorialView.classList.remove('view-hidden');
    if (userProfile) userProfile.classList.remove('hidden');
    resetScroll();
  }

  async function checkSession() {
    // 1. Check Supabase session
    if (supabaseClient) {
      try {
        const { data } = await supabaseClient.auth.getSession();
        if (data && data.session && data.session.user) {
          showDownloadView(data.session.user);
          return;
        }
      } catch (e) {
        console.warn('Supabase session check note:', e);
      }
    }

    // 2. Check local fallback session
    try {
      const cached = localStorage.getItem('moodflix_auth_user');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.email) {
          showDownloadView(parsed);
          return;
        }
      }
    } catch (e) {
      // LocalStorage fallback
    }

    // 3. Default to Google Log In page
    showAuthView();
  }

  async function handleGoogleLogin() {
    if (loginBtnText) {
      scrambleText(loginBtnText, 'CONNECTING TO GOOGLE...', 600);
    }

    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
        return;
      } catch (err) {
        console.error('Supabase Google Auth Error:', err);
      }
    }

    // Fallback if Supabase OAuth unavailable
    const fallbackUser = { email: 'user@google.com', name: 'Google User' };
    try {
      localStorage.setItem('moodflix_auth_user', JSON.stringify(fallbackUser));
    } catch (e) {}
    setTimeout(function () {
      showDownloadView(fallbackUser);
    }, 400);
  }

  async function handleSignOut() {
    if (supabaseClient) {
      try {
        await supabaseClient.auth.signOut();
      } catch (e) {}
    }
    try {
      localStorage.removeItem('moodflix_auth_user');
    } catch (e) {}
    showAuthView();
  }

  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', handleGoogleLogin);
  }

  if (signoutBtn) {
    signoutBtn.addEventListener('click', handleSignOut);
  }

  // Initialize Universal Text Scramble on all body text
  if (document.readyState === 'complete') {
    initUniversalTextScramble();
  } else {
    window.addEventListener('DOMContentLoaded', initUniversalTextScramble, { once: true, passive: true });
  }

  // Listen for Supabase auth changes
  if (supabaseClient) {
    try {
      supabaseClient.auth.onAuthStateChange(function (event, session) {
        if (session && session.user) {
          showDownloadView(session.user);
        } else if (event === 'SIGNED_OUT') {
          showAuthView();
        }
      });
    } catch (e) {}
  }

  // Check auth status on start
  if (document.readyState === 'complete') {
    checkSession();
  } else {
    window.addEventListener('DOMContentLoaded', checkSession, { once: true, passive: true });
  }

  /* --------------------------------------------------------------------------
     4. Navigation Logo Interaction (Click & Keyboard)
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
     5. In-Page Retro Modal & Download Action
     -------------------------------------------------------------------------- */
  function openGDriveModal() {
    if (gdriveModal) {
      gdriveModal.classList.remove('hidden');
    }

    // Reset iframe loader state
    if (modalFrameLoader) {
      modalFrameLoader.classList.remove('fade-out');
    }

    if (gdriveIframe) {
      gdriveIframe.classList.add('iframe-loading');

      let loaderTimeout = null;
      function hideLoader() {
        if (loaderTimeout) clearTimeout(loaderTimeout);
        if (modalFrameLoader) modalFrameLoader.classList.add('fade-out');
        if (gdriveIframe) gdriveIframe.classList.remove('iframe-loading');
      }

      gdriveIframe.onload = hideLoader;
      // Fallback timer to reveal iframe if onload event is delayed
      loaderTimeout = setTimeout(hideLoader, 2200);
    }
  }

  function closeGDriveModalAndGoToTutorial() {
    if (gdriveModal) {
      gdriveModal.classList.add('hidden');
    }
    showTutorialView();
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
      if (downloadBtnText) {
        scrambleText(downloadBtnText, 'INITIATING DOWNLOAD...', 800);
      }

      // Open in-page retro modal popup inside same tab
      setTimeout(function () {
        if (downloadBtnText) {
          downloadBtnText.textContent = 'DOWNLOAD TORRENT';
        }
        openGDriveModal();
      }, 500);
    });
  }

  // Modal Action Event Listeners
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeGDriveModalAndGoToTutorial);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeGDriveModalAndGoToTutorial);
  if (proceedTutorialBtn) proceedTutorialBtn.addEventListener('click', closeGDriveModalAndGoToTutorial);

  /* --------------------------------------------------------------------------
     6. Watch Trailer Modal Popup (Leave No Trace Official Trailer)
     -------------------------------------------------------------------------- */
  const TRAILER_YOUTUBE_URL = "https://www.youtube.com/embed/of00RzVENT8?autoplay=1&controls=1&rel=0&modestbranding=1";

  function openTrailerModal() {
    if (trailerModal) {
      if (trailerFrameLoader) {
        trailerFrameLoader.classList.remove('fade-out');
      }
      if (trailerIframe) {
        trailerIframe.classList.add('iframe-loading');
        trailerIframe.src = TRAILER_YOUTUBE_URL;

        let trailerLoaderTimeout = null;
        function hideTrailerLoader() {
          if (trailerLoaderTimeout) clearTimeout(trailerLoaderTimeout);
          if (trailerFrameLoader) trailerFrameLoader.classList.add('fade-out');
          if (trailerIframe) trailerIframe.classList.remove('iframe-loading');
        }

        trailerIframe.onload = hideTrailerLoader;
        // Fallback timer to reveal iframe if onload event is delayed
        trailerLoaderTimeout = setTimeout(hideTrailerLoader, 2000);
      }
      trailerModal.classList.remove('hidden');
    }
  }

  function closeTrailerModal() {
    if (trailerModal) {
      trailerModal.classList.add('hidden');
    }
    if (trailerIframe) {
      trailerIframe.src = "";
    }
  }

  if (trailerBtn) {
    trailerBtn.addEventListener('click', function () {
      if (trailerBtnText) {
        scrambleText(trailerBtnText, 'OPENING TRAILER...', 600);
      }
      setTimeout(function () {
        if (trailerBtnText) {
          trailerBtnText.textContent = 'WATCH TRAILER';
        }
        openTrailerModal();
      }, 400);
    });
  }

  if (closeTrailerModalBtn) closeTrailerModalBtn.addEventListener('click', closeTrailerModal);
  if (trailerModalBackdrop) trailerModalBackdrop.addEventListener('click', closeTrailerModal);
  if (closeTrailerBtnBottom) closeTrailerBtnBottom.addEventListener('click', closeTrailerModal);

  if (backToDownloadBtn) {
    backToDownloadBtn.addEventListener('click', function () {
      showDownloadView();
    });
  }

})();
