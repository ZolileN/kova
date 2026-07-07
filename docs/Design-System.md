# Design System - Kova

This document specifies the design system token configurations, typography choices, color scales, layout rules, and motion curves for Kova. The implementation is based on **Tailwind CSS** and **shadcn/ui**, engineered to deliver a dark-mode-first aesthetic reminiscent of Linear, Stripe, and Apple.

---

## 1. Color Palette (HSL System)

We use curated HSL color scales designed to harmonize in both Dark Mode (default) and Light Mode.

```
Dark Background (zinc-950) | Accents (indigo-500, violet-500) | Borders (zinc-800)
```

### CSS Variables Mapping (`theme/variables.css`)

```css
:root {
  /* Core Brand Gradients */
  --brand-gradient: linear-gradient(135deg, hsl(263, 100%, 70%) 0%, hsl(244, 96%, 68%) 100%);
  
  /* Dark Mode Default Tokens */
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  
  --primary: 263.4 70% 50.4%;
  --primary-foreground: 210 20% 98%;
  
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 263.4 70% 50.4%;
  
  --radius: 0.75rem;
}
```

---

## 2. Typography

We use **Inter** for UI utility text, numbers, and inputs, and **Outfit** for headings, metrics, and hero elements.

- **Primary UI Font**: `Inter`, sans-serif.
- **Display/Heading Font**: `Outfit`, sans-serif.

### Type Scale
- **Display 1**: `3.75rem / 60px` | Bold | Heading display panels.
- **H1**: `2.25rem / 36px` | SemiBold | Pages primary title.
- **H2**: `1.5rem / 24px` | Medium | Module sections.
- **Body**: `0.875rem / 14px` | Regular | Body text and descriptions.
- **Caption**: `0.75rem / 12px` | Regular | Subtitles, helper text.

---

## 3. Spacing & Grids

Kova uses a strict **8px (0.5rem) grid system** to maintain consistent rhythm and alignment.

- `space-1` = `4px`
- `space-2` = `8px`
- `space-3` = `12px`
- `space-4` = `16px`
- `space-6` = `24px`
- `space-8` = `32px`
- `space-12` = `48px`

---

## 4. UI Polish & Visual Affordances

### 4.1 Glassmorphism & Translucency
To deliver a premium dashboard experience, borders and navigation headers utilize a backdrop-blur filter with a translucent background:
```css
.glass-panel {
  background: rgba(9, 9, 11, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(63, 63, 70, 0.4);
}
```

### 4.2 Micro-Animations (Framer Motion Curves)
Interactive elements use custom ease curves rather than standard linear progressions:
- **Hover Transitions**: `ease: [0.16, 1, 0.3, 1]`, `duration: 0.3` (Sleek custom ease-out).
- **Scale Factor**: Active buttons and cards scale down slightly on tap: `whileTap={{ scale: 0.98 }}`.
- **Page Transitions**: Slide up and fade: `initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}`.
