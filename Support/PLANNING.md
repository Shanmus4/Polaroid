# Polaroid Camera Project Planning

## Project Goal
Create a visually appealing and interactive simulation of a Polaroid camera using HTML, CSS, and JavaScript. The focus is on realistic appearance and simple, satisfying animations for user interactions.

## Architecture
-   **HTML (`index.html`):** Provides the semantic structure for the camera components.
-   **CSS (`cameracss.css`):** Handles all visual styling of the camera, aiming for a photorealistic look using gradients, shadows, and positioning. No CSS frameworks will be used.
-   **CSS (`style.css`):** Handles the layout of the page and the Polaroid filter.
-   **CSS (`preview-enhanced.css`):** Contains UI enhancements made on April 20, 2025.
-   **JavaScript (`script.js`):** Adds interactivity to camera elements (e.g., shutter button click, animations) and camera access. Keep JS vanilla (no external libraries unless absolutely necessary).

## Project Architecture & Layout Decisions

### Camera & Preview Layout
- The camera is wrapped in a `.camera-parent` container, which is sized via `height: 58vh` (or as needed) and centered using `position: relative`.
- The camera itself (`.camera`) uses only `width`, `aspect-ratio`, and absolute positioning for scaling. All internal elements use percentage-based heights (e.g., `.top { height: 68%; }`, `.bottom { height: 32%; }`).
- No flexbox or transform-based scaling is used for the camera layout. All scaling is handled by changing the width and letting the aspect-ratio set the height.
- On mobile, the camera is centered and scaled down using `transform: translate(-50%, -50%) scale(...)` for visual balance.

### Polaroid Preview
- The Polaroid preview is wrapped in a `.polaroid-parent` container (`height: 42vh`), which uses flexbox to center its child both vertically and horizontally.
- The `.polaroid-preview-container` is sized in real-world units (3.6in x 4.5in, converted to px at 72dpi), and the preview area inside uses exact padding and sizing for realism.

### Sizing & Responsiveness
- All sizing for camera and preview is controlled by width and aspect-ratio, with no fixed heights except for container sections.
- Internal elements use only percent-based sizing and positioning for perfect proportionality.
- Mobile responsiveness is handled by adjusting width and scale in media queries, never by changing internal layout logic.

## CSS & HTML Structure
- `.camera-parent` (camera area, absolute/relative positioning)
- `.camera` (main camera body, aspect-ratio, percent-based children)
- `.polaroid-parent` (preview area, flex centering)
- `.polaroid-preview-container` (real-world Polaroid sizing)
- `.polaroid-white` (white border, padding)
- `#camera-view` (live video preview)

## Design Principles
- **Single source of truth for scaling:** Only the camera's width and aspect-ratio control its size; all children scale proportionally.
- **No element movement:** All elements maintain their relative positions regardless of screen size.
- **Maintainability:** CSS is clean, modular, and uses only necessary layout properties.

## Style & Conventions
-   **CSS:** Use descriptive class names matching the camera parts. Rely heavily on CSS gradients and box-shadows for visual effects. Keep CSS organized and readable.
-   **JavaScript:** Use modern JS features (ES6+). Add comments for complex logic. Ensure code is modular where possible.
-   **File Structure:** Maintain a flat structure for now (`index.html`, `style.css`, `script.js` in the root).

## UI Enhancements (2025-04-21)
- Gallery FAB (floating action button) is now a direct child of <body>, always fixed 24px from the bottom-right of the viewport, never overlaps the polaroid or camera.
- Layout and stacking context bugs fully resolved: FAB is never affected by flexbox or absolute parents.
- Camera and polaroid always maintain proportional scaling and spacing, with robust gap and padding logic.
- Download logic removed from FAB; it is now a gallery stub for future features.
- All layout, spacing, and stacking context issues addressed for desktop and mobile.
- All files and fixes are now tracked and synced on GitHub.
- **Gallery grid system completely rewritten for 2025-04-21:** Uses CSS grid for desktop (auto-fit, minmax), always wraps to new rows, large images, fixed gap. Mobile grid is always 2 columns, responsive, never overflows.
- **Polaroid capture logic now matches live preview exactly, with correct cropping, no stretching, and includes the full white frame with thick bottom border.**
- **All CSS and JS files updated and thoroughly tested for mobile and desktop.**

## Gallery Modal (2025-04-21)
- Gallery opens as a modal/overlay on FAB click, displaying all images saved in browser cache (localStorage).
- Each image is shown in a grid with its own download button.
- A "Download All" button allows downloading all images as a ZIP.
- Gallery can be closed via an X button or clicking outside.
- All UI/logic is modular and testable.
- Tests and documentation updated for this feature.

## Version Control

- The project is now tracked on GitHub at [Polaroid Camera](https://github.com/Shanmus4/Polaroid-Camera).
- Sensitive files (e.g., `.windsurfrules`, API keys) are excluded from version control using `.gitignore`.

## Constraints
-   Keep animations simple and performant.
-   Avoid external libraries/frameworks if possible.
-   Ensure compatibility with modern web browsers.
-   Do not add features beyond simple visual interactions (e.g., no actual image processing).

## Future Enhancements
- Add interactive features (capture, effects, etc.)
- Improve accessibility and add automated tests

## Recent/Final Architecture & Major Features (2025-04-21)
- 10 advanced polaroid filter effects, all visually rich and confined to the image preview area only.
- Gallery modal: view, download (individually or all), and delete polaroids from browser cache.
- Download All now saves each image as a separate PNG, not a ZIP.
- Filter logic refactored to use CSS classes for maintainability and scalability.
- All features tested on both desktop and mobile, with robust layout and scaling.

---

This planning document reflects the current, finalized architecture for the Polaroid Camera project as of 2025-04-20.
