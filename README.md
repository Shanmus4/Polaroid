# Polaroid Camera Web App

A responsive, visually-accurate Polaroid camera web UI with real-time camera preview and true-to-life Polaroid photo proportions.

## Features
- Fully responsive camera layout that scales smoothly on all screen sizes
- Camera design remains visually stable and proportionally correct—no element shuffling or squishing
- Real-world Polaroid preview (3.6in x 4.5in white, 3.3in x 3.8in preview)
- Clean, modern CSS using only width, aspect-ratio, and percent-based sizing
- Mobile-optimized: camera and preview scale down together
- Simple, maintainable HTML and CSS structure

## New Features
- Material Design filter navigation arrows with smooth interactivity.
- Capture Polaroid: Click the camera shutter to save the current preview (with white border and filter) as a high-res PNG.
- **Gallery FAB:** Floating action button (gallery icon, Material Design, always fixed 24px from screen corner, never overlaps camera/polaroid). Now ready for future gallery features.
- Skew-free, high-quality image capture that matches the live preview exactly.

## How It Works
- The camera and preview use only width and aspect-ratio for scaling; no flexbox or transform scaling is used for responsiveness
- All internal elements use percent-based sizing for perfect proportionality
- The Polaroid preview is centered in its parent container using flexbox
- The FAB is a direct child of `<body>`, always fixed to the viewport for correct placement
- Layout is controlled by `.camera-parent` (camera area) and `.polaroid-parent` (preview area)

## Usage
1. Use the left/right arrows to change filters on the Polaroid preview.
2. Click the red camera shutter button to capture the current photo (with frame and filter).
3. Click the gallery FAB (bottom-right) for future gallery features (currently shows a stub alert).

All controls are keyboard accessible. Images are stored in browser cache (localStorage) until downloaded.

## File Structure
- `index.html`: Main HTML structure
- `style.css`: Layout, scaling, and Polaroid preview styles
- `cameracss.css`: Camera component and internal element styles
- `script.js`: Camera access and preview logic
- `Support/TASK.md`: Task tracking and project history
- `Support/PLANNING.md`: Design and architecture notes

## Setup
1. Open `index.html` in your browser (or use a local web server for full camera access).
2. Allow camera access for real-time preview.

## Recent Changes (2025-04-21)
- Gallery grid system fully rewritten: uses CSS grid for desktop (auto-fit, minmax), always wraps to new rows, large images, fixed gap. Mobile grid is always 2 columns, responsive, never overflows.
- Polaroid capture logic now guarantees the saved/downloaded image matches the live preview exactly, with correct cropping, no stretching, and includes the full white frame with thick bottom border.
- All layout, scaling, and stacking bugs resolved for both camera and gallery views.
- All CSS and JS files updated and thoroughly tested for mobile and desktop.

## TODO / Roadmap
- [x] Implement robust, responsive gallery grid (desktop: large images, wraps to new rows; mobile: always 2 columns).
- [x] Guarantee high-res, pixel-perfect polaroid capture (matches preview, includes border).
- [x] Refactor layout for maintainability and modularity.
- [x] Update documentation and planning files for all recent changes.
- [ ] Improve accessibility and add tests.

---

For more details, see `Support/TASK.md` and `Support/PLANNING.md`.

## GitHub Repository

This project is now available on GitHub: [Polaroid Camera](https://github.com/Shanmus4/Polaroid-Camera)

### Sensitive Files
Sensitive files such as `.windsurfrules` and any future API keys/secrets are protected by the `.gitignore` file and will not be uploaded to the repository.

## Contributing
This is currently a small personal project. Contributions are not expected at this time.

## License
*(No license specified yet)*
