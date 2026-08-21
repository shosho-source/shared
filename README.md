# MOODFLIX — Retro Modern Movie Archive

A lightweight, pure **Vanilla HTML, CSS, and JavaScript** web application for sharing movie files with an interactive WebGL fluid background simulation and retro 1-bit typography aesthetic.

## 🚀 Features

- **Pure Vanilla Tech Stack**: Built entirely with standard HTML5, CSS3, and ES6 JavaScript — zero framework overhead.
- **Interactive WebGL Fluid Simulation**: Dynamic liquid physics canvas responding to mouse hover & movements.
- **Retro Modern Aesthetics**: Solid offset box-shadows (`6px 6px 0px #000`), custom monospace scrollbars, curated color scheme (`#fffff0` cream & black).
- **Responsive Layout**: Designed for mobile, tablet, and desktop viewports with flexbox & grid.
- **Confetti Download Feedback**: Instant particle effects when clicking `DOWNLOAD TORRENT`.
- **One-Click Clipboard Copying**: Copies Google Drive download links with real-time button feedback.
- **Archive Specifications Modal**: Displays file size, 1080p remaster format, and clean scan status.
- **Access Passport Modal**: Simulated Google OAuth / Demo Account session manager using browser `localStorage`.

## 🛠 Project Structure

```
share/
├── index.html        # Main HTML structure & modals
├── style.css         # Pure Vanilla CSS design system & animations
├── script.js         # ES6 JavaScript logic, modals & fluid simulation
├── images/           # Retro cassette tape illustration assets
├── vercel.json       # Vercel deployment & routing configuration
└── package.json      # Minimal static server config
```

## 📦 Getting Started

To launch locally:

```bash
# Option 1: Using npx serve
npx serve . -p 8080

# Option 2: Double-click index.html to open directly in any web browser!
```

Open `http://localhost:8080` in your browser.
