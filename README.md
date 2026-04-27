# Lawyer Landing Page

Static landing page project for a law office website.

## Project Structure

- `index.html` - Main page markup
- `styles.css` - Styling
- `script.js` - Client-side interactions
- `assets/` - Images and media
- `build.js` - Production build/minify script

## Setup

Install dependencies:

```bash
npm install
```

If you want to install exactly the packages manually:

```bash
npm install terser clean-css html-minifier-terser fs-extra
```

## Build for Production

Run:

```bash
npm run build
```

What it does:

- Removes and recreates `dist/`
- Copies `assets/` into `dist/assets/`
- Minifies `index.html`, `styles.css`, and `script.js`
- Writes minified files into `dist/`

## Clean Build Output

```bash
npm run clean
```