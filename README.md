# Interactive Polaroid Camera Simulation

This project is a web-based simulation of a classic Polaroid camera, built using HTML, CSS, and vanilla JavaScript. It aims for a visually appealing, photorealistic look with simple, satisfying interactions.

## Features
-   Detailed visual representation of a Polaroid camera using CSS gradients and shadows.
-   Live camera view with Polaroid filter toggle.

## Getting Started
1.  Clone this repository (or download the files).
2.  Open the `index.html` file in your web browser.

You may need to grant permission for the website to access your camera.

## Project Structure
-   `index.html`: Contains the HTML structure of the camera and camera view.
-   `cameracss.css`: Defines the visual appearance and layout of the Polaroid camera.
-   `style.css`: Defines the layout of the page and the Polaroid filter.
-   `preview-enhanced.css`: Defines the enhanced camera preview and filter button styles.
-   `script.js`: Handles user interactions and camera access.
-   `PLANNING.md`: Outlines the project goals, architecture, and conventions.
-   `TASK.md`: Tracks completed, current, and future tasks.

## Changelog
### [2025-04-20] Camera UI Layout & Scaling Overhaul
- Camera is now wrapped in a `.camera-parent` div that takes up 50% of the viewport height.
- The camera design is perfectly centered and scaled down to 0.5x for a balanced, responsive look.
- The layout is now top-down: camera on top, live preview below, both centered.
- All changes are in `index.html` and `style.css` (no changes to `cameracss.css`).

### [2025-04-20] Enhanced Camera Preview UI
- Camera preview on the right redesigned: borders removed, corners more rounded, soft ambient shadow added.
- Filter button is now visually enhanced with gradient, icon, and click animation.
- All new styles are in `preview-enhanced.css` (no changes to cameracss.css).

### [2025-04-20] Live Filter Selector
- Camera preview now scales perfectly to fill the preview container.
- The filter button has been replaced by a set of 5 round live filter selectors below the preview.
- Each filter selector shows a live mini-preview of the camera with a different filter.
- Clicking a selector updates the main preview in real time.
- All new styles and logic are in `preview-enhanced.css` and updated JS.

## GitHub Repository

This project is now available on GitHub: [Polaroid Camera](https://github.com/Shanmus4/Polaroid-Camera)

### Sensitive Files
Sensitive files such as `.windsurfrules` and any future API keys/secrets are protected by the `.gitignore` file and will not be uploaded to the repository.

## Contributing
This is currently a small personal project. Contributions are not expected at this time.

## License
*(No license specified yet)*
