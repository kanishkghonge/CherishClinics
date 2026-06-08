# Cherish Children's Clinic - Design System & Aesthetic Guidelines

This document serves as the aesthetic guide and design system specification for the Cherish Clinic website. It establishes design tokens, layout patterns, and interaction rules to maintain consistent premium aesthetics.

---

## 🎨 Color Palette (Luxury Earth Tones)
We avoid generic web colors in favor of a curated, comforting, and high-end natural palette:

| Color Token | Hex Code | Visual Role | Usage Examples |
| :--- | :--- | :--- | :--- |
| **Warm Oat** | `#faf7f2` | Primary Background | Body backdrops, container frames |
| **Warm Ivory** | `#f5f0e6` | Secondary Background | Section stripes, alternate cards |
| **Forest Sage** | `#3e5c4a` | Primary Brand / Positive | Active buttons, success alerts, Boy gender selector, healthy BMI |
| **Terracotta Rose** | `#c67b73` | Highlight / Warning | Section accents, warning badges, Girl gender selector, overweight BMI |
| **Crimson Coral** | `#a85650` | Critical Alert / Danger | Danger badges, obese BMI warning |
| **Charcoal Spruce** | `#2b332f` | Primary Typography | Headers, bold text, body copy |
| **Muted Sage** | `#55625c` | Secondary Typography | Subtitles, label rows, descriptive paragraphs |
| **Border Soft** | `rgba(62,92,74,0.08)` | Borders / Divides | Table borders, card outlines |

---

## ✍️ Typography & Font Scale
We load two modern typefaces from Google Fonts:
* **Headings**: `Outfit` (sans-serif) - chosen for its rounded, friendly, yet authoritative geometric structure.
* **Body Copy**: `Plus Jakarta Sans` (sans-serif) - optimized for high readability at small text sizes.

### Font Hierarchy:
* **Page Titles (h2)**: `2.5rem` / bold (`800`) / tracking `-0.5px`
* **Section Titles (h3)**: `1.8rem` / bold (`700`) / line-height `1.3`
* **Card Headings (h4)**: `1.25rem` / bold (`700`)
* **Standard Body**: `0.95rem` / regular (`400`) / line-height `1.6`
* **Caption/Meta Text**: `0.75rem` / extra-bold (`700`) / uppercase / tracking `1px`

---

## 🪟 Glassmorphism & Card Design
Cards use semi-transparent backdrops and high-fidelity blur effects:

```css
.glass-card {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
}
```

### Premium Border Glow (Composite Masking)
To elevate cards, we apply a subtle border overlay gradient using a composite mask:
```css
.resource-index-card::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 32px;
  padding: 1.5px;
  background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.1), rgba(62,92,74,0.15));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  pointer-events: none;
}
```

---

## 🚀 Micro-Animations & Interactions

### 1. Page Entry Transitions
All pages load with a smooth fade-in and slide-up combination:
```css
@keyframes pageFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 2. Floating Ambient Blobs
Soft colorful backdrops float dynamically in the background:
```css
@keyframes floatBlob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
  100% { transform: translate(0px, 0px) scale(1); }
}
```

### 3. Credit Card Flip Mechanic
Payment checkouts simulate a full 3D card rotation:
* **Trigger**: Focusing on the CVV input adds the `.flip` class.
* **Property**: `transform: rotateY(180deg)` on parent wrapper with `perspective: 1000px` and `transform-style: preserve-3d`.

### 4. Recalculation Loader Bar
BMI computations undergo a debounced 800ms loading sequence:
* Animate loading bar width from `0%` to `100%`.
* Show loader overlay and hide main result block to give the calculation weight and feel.
