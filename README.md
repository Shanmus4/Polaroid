# Polaroid Camera Web App

A responsive, visually-accurate Polaroid camera web UI with real-time camera preview and true-to-life Polaroid photo proportions.

## Features
- Fully responsive camera layout that scales smoothly on all screen sizes
- Camera design remains visually stable and proportionally correct—no element shuffling or squishing
- Real-world Polaroid preview (3.6in x 4.5in white, 3.3in x 3.8in preview)
- Clean, modern CSS using only width, aspect-ratio, and percent-based sizing
- Mobile-optimized: camera and preview scale down together
- Simple, maintainable HTML and CSS structure

## How It Works
- The camera and preview use only width and aspect-ratio for scaling; no flexbox or transform scaling is used for responsiveness
- All internal elements use percent-based sizing for perfect proportionality
- The Polaroid preview is centered in its parent container using flexbox
- Layout is controlled by `.camera-parent` (camera area) and `.polaroid-parent` (preview area)

## File Structure
- `index.html`: Main HTML structure
- `style.css`: Layout, scaling, and Polaroid preview styles
- `cameracss.css`: Camera component and internal element styles
- `script.js`: Camera access and preview logic
- `TASK.md`: Task tracking and project history
- `PLANNING.md`: (If present) Design and architecture notes

## Setup
1. Open `index.html` in your browser
2. Allow camera access for real-time preview

## TODO / Roadmap
- Add interactive features (e.g., capture, filter effects)
- Improve accessibility and add tests

---

For more details, see `TASK.md` and `PLANNING.md`.

## GitHub Repository

This project is now available on GitHub: [Polaroid Camera](https://github.com/Shanmus4/Polaroid-Camera)

### Sensitive Files
Sensitive files such as `.windsurfrules` and any future API keys/secrets are protected by the `.gitignore` file and will not be uploaded to the repository.

## Contributing
This is currently a small personal project. Contributions are not expected at this time.

## License
*(No license specified yet)*
