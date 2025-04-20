# Polaroid Camera Project Planning

## Project Goal
Create a visually appealing and interactive simulation of a Polaroid camera using HTML, CSS, and JavaScript. The focus is on realistic appearance and simple, satisfying animations for user interactions.

## Architecture
-   **HTML (`index.html`):** Provides the semantic structure for the camera components.
-   **CSS (`cameracss.css`):** Handles all visual styling of the camera, aiming for a photorealistic look using gradients, shadows, and positioning. No CSS frameworks will be used.
-   **CSS (`style.css`):** Handles the layout of the page and the Polaroid filter.
-   **CSS (`preview-enhanced.css`):** Contains UI enhancements made on April 20, 2025.
-   **JavaScript (`script.js`):** Adds interactivity to camera elements (e.g., shutter button click, animations) and camera access. Keep JS vanilla (no external libraries unless absolutely necessary).

## Style & Conventions
-   **CSS:** Use descriptive class names matching the camera parts. Rely heavily on CSS gradients and box-shadows for visual effects. Keep CSS organized and readable.
-   **JavaScript:** Use modern JS features (ES6+). Add comments for complex logic. Ensure code is modular where possible.
-   **File Structure:** Maintain a flat structure for now (`index.html`, `style.css`, `script.js` in the root).

## UI Enhancements (2025-04-20)
- Camera is now wrapped in `.camera-parent` (50vh height), centered and scaled to 0.5x for a modern, responsive look.
- Layout is top-down: camera in upper half, preview in lower half, both centered.
- All layout/scaling changes are in `index.html` and `style.css` (no changes to cameracss.css).
- Camera preview now scales edge-to-edge with rounded corners and shadow.
- Filter button replaced by 5 live filter selectors below preview, each showing a mini live preview.
- Selecting a filter updates the main preview instantly.
- All enhancements are in `preview-enhanced.css` and JS.

## Version Control

- The project is now tracked on GitHub at [Polaroid Camera](https://github.com/Shanmus4/Polaroid-Camera).
- Sensitive files (e.g., `.windsurfrules`, API keys) are excluded from version control using `.gitignore`.

## Constraints
-   Keep animations simple and performant.
-   Avoid external libraries/frameworks if possible.
-   Ensure compatibility with modern web browsers.
-   Do not add features beyond simple visual interactions (e.g., no actual image processing).
