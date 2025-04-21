# Polaroid Camera Web App

A responsive, visually-accurate Polaroid camera web UI with real-time camera preview and true-to-life Polaroid photo proportions.

## Features
- Fully responsive camera layout for all screen sizes
- Camera design remains visually stable and proportionally correct
- Real-world Polaroid preview (3.6in x 4.5in white, 3.3in x 3.8in preview)
- Clean, modern CSS using width, aspect-ratio, percent-based sizing
- Mobile-optimized: camera and preview scale down together
- Simple, maintainable HTML and CSS structure
- Material Design filter navigation arrows
- Capture Polaroid: save the current preview (with white border and filter) as a high-res PNG
- Gallery modal: view, download (individually), and delete polaroids from browser cache
- Skew-free, high-quality image capture that matches the live preview exactly
- 10 advanced CSS filter effects (warm, cool, retro, vivid, sharp, B&W, night, glow, fade, none)
- Keyboard accessible controls for filter navigation and gallery
- Camera flip button for devices with multiple cameras
- iOS support: baked-in filters for saved images using context-filter-polyfill; Download All hidden on iOS

## How It Works
- Uses only width and aspect-ratio for scaling; no flexbox/transform scaling for responsiveness
- All internal elements use percent-based sizing
- Polaroid preview is centered using flexbox
- FAB is a direct child of `<body>`, always fixed to the viewport
- Layout is controlled by `.camera-parent` (camera area) and `.polaroid-parent` (preview area)

## Usage
1. Use the left/right arrows or keyboard arrow keys to change filters.
2. Click the red camera shutter button to capture the current photo (with frame and filter). The image is saved to the gallery.
3. Click the gallery FAB (bottom-right) to open the gallery modal and view/download your captured polaroids.
   - On iOS, long-press the image and choose "Save Image" to save. The "Download All" button is hidden on iOS.

All controls are keyboard accessible. Images are stored in browser cache (localStorage) until downloaded.

## File Structure
- `index.html`: Main HTML structure
- `style.css`: Layout, scaling, and Polaroid preview styles
- `cameracss.css`: Camera component and internal element styles
- `gallery.css`: Gallery modal and grid styles
- `ios.css`: iOS-specific CSS overrides
- `ios.js`: iOS detection and download logic
- `script.js`: Camera, gallery, and filter logic
- `Support/TASK.md`: Task tracking and project history
- `Support/PLANNING.md`: Design and architecture notes

## Setup
1. Open `index.html` in your browser (or use a local web server for full camera access).
2. Allow camera access for real-time preview.

## Final Status (2025-04-22)
- All planned features are complete and verified on desktop and iOS/mobile.
- Filters are now baked into saved/downloaded images on all platforms (thanks to context-filter-polyfill).
- Project is fully documented and code is DRY and modular.

## Project Complete
This project is now considered feature-complete. No further development is planned unless bugs are reported or dependencies change.

For more details, see `Support/TASK.md` and `Support/PLANNING.md`.

## GitHub Repository
[Polaroid](https://github.com/Shanmus4/Polaroid)

### Sensitive Files
Sensitive files such as `.windsurfrules` and any future API keys/secrets are protected by the `.gitignore` file and will not be uploaded to the repository.

## Contributing
This is currently a small personal project. Contributions are not expected at this time.

## License
*(No license specified yet)*
