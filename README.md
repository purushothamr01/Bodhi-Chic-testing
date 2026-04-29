# Uttara Studios - Spiritual Guidance & Healing

*This website was built by **Bloomeor Company**.*

Welcome to the **Uttara Studios** website repository! This is a static web application designed for a spiritual and holistic healing center offering services and online classes.

## Overview

Uttara Studios is dedicated to providing profound spiritual guidance, energetic healing, and life-changing online courses. The website serves as a landing page, service directory, and booking portal for clients looking for transformative experiences.

**Key Offerings:**
- **Services:** Akashic Records, Reiki & Pranic Healing, Tarot Reading, Access Bars & Body Process.
- **Online Classes:** Reiki, Akashic Records, Angelic Healing, Tarot, Lenormand, Kipper, Vera Sibilla, Crystal Healing, and more.

## Tech Stack

This project is built as a highly responsive static website:
- **HTML5:** Semantic HTML for structure and accessibility.
- **CSS3:** Custom vanilla CSS (`css/style.css`) with rich aesthetics, modern typography (Montserrat, Playfair Display), particle backgrounds, and dynamic animations.
- **JavaScript:** Vanilla JS (`js/`) for interactivity, mobile menus, particles, booking buttons, and more.
- **Automation Scripts:** Several PowerShell (`.ps1`) and Node.js (`.js`) scripts are included to automate generating class pages, updating links, adjusting colors, and handling forms.

## Project Structure

- `index.html`: The main landing page with the hero section, services overview, and classes grid.
- `about.html`: Information about the studio and its founder.
- `*-healing.html` / `*.html` (e.g., `akashic-records.html`, `tarot-reading.html`): Dedicated service pages.
- `class-*.html`: Individual landing pages for various online classes.
- `css/`: Stylesheets containing all the styling, animations, and design tokens.
- `js/`: JavaScript files for frontend functionality.
- `images/`: Static image assets for the gallery, hero background, and class thumbnails.
- `assects/`: Additional assets.
- `*.ps1`: Utility scripts to streamline website maintenance.

## Features

- **Dynamic Design:** Vibrant color schemes, glassmorphism UI elements, hover effects, and micro-animations to create a premium feel.
- **Responsive Navigation:** A mobile-friendly navbar with an integrated booking CTA via WhatsApp.
- **Booking Integration:** Direct integration with WhatsApp to quickly connect with clients.
- **SEO Optimized:** Implements JSON-LD structured data and standard meta tags to ensure high visibility on search engines.

## Usage

Since this is a static site, you can view it directly by opening `index.html` in any modern web browser or serving it using a local development server such as Live Server or Python's `http.server`.

```bash
# Example using Python 3
python3 -m http.server
```

To book a session or explore the offerings, navigate to the **Services** or **Classes** section on the main page.

## Maintenance

To generate or update class pages, you can utilize the provided PowerShell scripts such as `generate_class_pages.ps1`. Ensure you have the required environment to run these scripts if you plan to update the site programmatically.
