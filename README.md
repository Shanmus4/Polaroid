# Polaroid Camera Web App

A responsive, visually-accurate Polaroid camera web UI with real-time camera preview and true-to-life Polaroid photo proportions.

## Features
- Fully responsive camera layout that scales smoothly on all screen sizes
- Camera design remains visually stable and proportionally correct—no element shuffling or squishing
- Real-world Polaroid preview (3.6in x 4.5in white, 3.3in x 3.8in preview)
- Clean, modern CSS using only width, aspect-ratio, and percent-based sizing
- Mobile-optimized: camera and preview scale down together
- Simple, maintainable HTML and CSS structure
- Material Design filter navigation arrows with smooth interactivity
- Capture Polaroid: Click the camera shutter to save the current preview (with white border and filter) as a high-res PNG
- Gallery modal: view, download (individually), and delete polaroids from browser cache
- Skew-free, high-quality image capture that matches the live preview exactly
- 10 advanced CSS filter effects (warm, cool, retro, vivid, sharp, B&W, night, glow, fade, none)
- Keyboard accessible controls for filter navigation and gallery
- Camera flip button for devices with multiple cameras
- iOS-specific logic for downloads: instructs user to long-press image to save; disables "Download All" on iOS

## How It Works
- The camera and preview use only width and aspect-ratio for scaling; no flexbox or transform scaling is used for responsiveness
- All internal elements use percent-based sizing for perfect proportionality
- The Polaroid preview is centered in its parent container using flexbox
- The FAB is a direct child of `<body>`, always fixed to the viewport for correct placement
- Layout is controlled by `.camera-parent` (camera area) and `.polaroid-parent` (preview area)

## Usage
1. Use the left/right arrows or keyboard arrow keys to change filters on the Polaroid preview.
2. Click the red camera shutter button to capture the current photo (with frame and filter). The image is saved to the gallery.
3. Click the gallery FAB (bottom-right) to open the gallery modal and view/download your captured polaroids.
   - On iOS, long-press the image and choose "Save Image" to save. The "Download All" button is hidden on iOS.

All controls are keyboard accessible. Images are stored in browser cache (localStorage) until downloaded.

## File Structure
- `index.html`: Main HTML structure
- `style.css`: Layout, scaling, and Polaroid preview styles
- `cameracss.css`: Camera component and internal element styles
- `gallery.css`: Gallery modal and grid styles
- `ios.css`: iOS-specific CSS overrides (placeholder)
- `ios.js`: iOS detection and download logic
- `script.js`: Camera, gallery, and filter logic
- `Support/TASK.md`: Task tracking and project history
- `Support/PLANNING.md`: Design and architecture notes

## Setup
1. Open `index.html` in your browser (or use a local web server for full camera access).
2. Allow camera access for real-time preview.

## Recent Changes (2025-04-21)
- 10 advanced, visually rich polaroid filter effects (all CSS-based, no CamanJS)
- Gallery modal: view, download (individually), and delete polaroids from browser cache
- "Download All" saves each image as a separate PNG (not ZIP); hidden on iOS
- iOS download button now instructs users to long-press image and choose "Save Image"
- All gallery, filter, and capture features tested and verified to work on both desktop and mobile

## TODO / Roadmap
- [x] Implement robust, responsive gallery grid (desktop: large images, wraps to new rows; mobile: always 2 columns)
- [x] Guarantee high-res, pixel-perfect polaroid capture (matches preview, includes border)
- [x] Refactor layout for maintainability and modularity
- [x] Update documentation and planning files for all recent changes
- [x] Gallery modal now updates immediately when a new image is captured
- [x] Arrow keys (left/right) and arrow buttons now switch filters for live preview and capture
- [ ] Improve accessibility and add tests
- [ ] Implement photo printing animation triggered by shutter click
- [ ] Add interactivity to other camera elements (e.g., flash toggle, power button)
- [ ] Refine existing animations and styles

---

For more details, see `Support/TASK.md` and `Support/PLANNING.md`.

## GitHub Repository

This project is now available on GitHub: [Polaroid](https://github.com/Shanmus4/Polaroid)

### Sensitive Files
Sensitive files such as `.windsurfrules` and any future API keys/secrets are protected by the `.gitignore` file and will not be uploaded to the repository.

## Contributing
This is currently a small personal project. Contributions are not expected at this time.

## License
*(No license specified yet)*
