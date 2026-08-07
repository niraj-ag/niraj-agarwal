# Features

A feature-by-feature walkthrough of the Niraj portfolio site, with the implementation files, behavior, and screenshots. Everything is inferred from the source code.

- [Feature Matrix](#feature-matrix)
- [1. Hero and Interactive Mirror Cube](#1-hero-and-interactive-mirror-cube)
- [2. Section-Aware Scroll Indicators](#2-section-aware-scroll-indicators)
- [3. The Builder Principles](#3-the-builder-principles)
- [4. Selected Work with Project Cards](#4-selected-work-with-project-cards)
- [5. Video Walkthroughs on Scroll](#5-video-walkthroughs-on-scroll)
- [6. Project Modal with Focus Trap](#6-project-modal-with-focus-trap)
- [7. Lightbox Gallery](#7-lightbox-gallery)
- [8. Tools of Choice (Tech Stack)](#8-tools-of-choice-tech-stack)
- [9. Current Chapter Timeline](#9-current-chapter-timeline)
- [10. Beyond The Screen](#10-beyond-the-screen)

---

## Feature Matrix

| # | Feature | Files | Interactive | Notes |
|---|---|---|---|---|
| 1 | Hero + Mirror Cube | `Hero.tsx`, `MirrorCube.tsx`, `CubeController.tsx` | Yes (drag, click, gyro) | Signature 3D cube, 26 cubies |
| 2 | Scroll indicators | `Header`, `App.tsx`, `CubeController.tsx` | Yes (auto-highlight) | Observes section visibility |
| 3 | The Builder | `Builder.tsx` | No | 3 principles, stagger reveal |
| 4 | Project cards | `Work.tsx`, `ProjectShowcaseCard.tsx` | Yes (hover, click) | 5 projects in 2 groups |
| 5 | Video previews | `ProjectShowcaseCard.tsx`, `ProjectVisual.tsx` | Yes (auto play/pause) | WebM, plays at 40% visibility |
| 6 | Project modal | `ProjectModal.tsx` | Yes (Escape, click-out, focus trap) | Full project details |
| 7 | Lightbox gallery | `ProjectGallery.tsx` | Yes (arrows, Esc) | WebP screenshots per project |
| 8 | Tools of Choice | `TechStack.tsx`, `Brands.tsx` | No | Simple Icons CDN logos |
| 9 | Current Chapter | `Timeline.tsx` | No | Career timeline data |
| 10 | Beyond The Screen | `BeyondScreen.tsx` | No | Passions + impact |

---

## 1. Hero and Interactive Mirror Cube

**Files:** `src/components/Hero.tsx`, `src/components/MirrorCube.tsx`, `src/components/CubeController.tsx`

The opening section. Two rows of typography ("NIRAJ — Product / Software / Design" eyebrow, huge name, role line), a CTA ("Let's talk"), and the Mirror Cube on the right.

The cube is the interactive centerpiece:

- **26 cubies** (3×3×3 minus center), each with an inner mirrored face — 156 faces total, 78 mirrored.
- Rotation driven by a **spring-lerp** inside `useAnimationFrame`, independent of framerate.
- **Drag** (mouse/touch) rotates; movement eases back with spring physics.
- **Click/tap** performs a 90° slice turn and returns to rest.
- **Idle behavior:** auto-rotates after ~30 s of inactivity.
- **Gyroscope (mobile):** relative device tilt mapped to rotation — gated behind an iOS permission request (via `requestGyroPermission`, triggered by user gesture).
- The cube is a "mirror" — mirrored inner faces reflect the environment (per the source comment, it is a visual metaphor for the brand).

The cube's rotation state is **global** (`CubeProvider`), so the cube reacts to scroll section and hovered project.

**Screenshots:** The hero cannot be captured from `public/` because the cube is rendered live — `public/` only contains project media. See [Known Limitations](../README.md#known-limitations).

---

## 2. Section-Aware Scroll Indicators

**Files:** `src/components/Header.tsx`, `src/App.tsx`, `src/components/CubeController.tsx`

The fixed header shows the active section name; the navigation highlights the section currently in view. An `IntersectionObserver` inside `CubeProvider` watches every section and publishes `activeSection`. The nav links scroll to `#hero`, `#work`, etc. via anchor + `scrollIntoView`.

Also published into the cube context, so the cube's slice offsets change per section (per `SECTION_OFFSETS` in `MirrorCube.tsx`).

---

## 3. The Builder Principles

**Files:** `src/components/Builder.tsx`

A content section titled "The Builder" with three principles ("Ship the prototype first", "Own the outcome", "Design is a conversation" — as present in the source). Cards fade/stagger in via Framer Motion. No interaction beyond reveal.

---

## 4. Selected Work with Project Cards

**Files:** `src/sections/Work.tsx`, `src/components/ProjectShowcaseCard.tsx`

The portfolio: **5 projects** in two groups:

| Group | Projects |
|---|---|
| Enterprise AI | Hivemind (production AI ops), Aether AI (finance research agent) |
| Commercial | Freshera Studio, Freshera Console, Ivy Hotel |

Each card shows:

- Project name, description, tags (tech pills), company badge.
- A **visual** — video preview (webm) or branded tile.
- **Hover behavior:** parallax image tilt, and the **cube in the hero** rotates to the project's offset (the `hoveredProjectIndex` → cube link).
- Click opens the full modal.

**Data:** all from `src/data/portfolio.ts`.

**Screenshot:** freshera-studio.webm, freshera-console.webm, ivy-hotel.webm (see [Screenshots](../README.md#screenshots)).

---

## 5. Video Walkthroughs on Scroll

**Files:** `src/components/ProjectShowcaseCard.tsx`, `src/components/ProjectVisual.tsx`

Muted, looped, `preload="metadata"` `.webm` videos. An `IntersectionObserver` starts/stops playback when the card is ~40% in view. Video is the primary preview; the `.webp` files act as posters/fallbacks.

**Screenshots:** freshera-studio.webm, freshera-console.webm, ivy-hotel.webm.

---

## 6. Project Modal with Focus Trap

**Files:** `src/components/ProjectModal.tsx`

Opened from a showcase card. Features:

- **Focus trap** — Tab cycles within the modal; focus returns to the trigger on close.
- Close via **Escape** or click-outside; locks body scroll while open.
- Content: description, company, tags, links (website/GitHub when present), and the project gallery.
- Rendered through `AnimatePresence` with fade/scale.

---

## 7. Lightbox Gallery

**Files:** `src/components/ProjectGallery.tsx`

Each project has a thumbnail strip (from the `gallery` field in `portfolio.ts`). Clicking a thumbnail opens a **lightbox** with previous/next arrows, Escape-to-close, and keyboard support. All images are WebP from `public/`.

**Screenshots:** freshera-studio-1..3.webp, freshera-console-1..2.webp, ivy-hotel-1..2.webp.

---

## 8. Tools of Choice (Tech Stack)

**Files:** `src/components/TechStack.tsx`, `src/components/Brands.tsx`

"Tools of Choice" — a grid of logos fetched from the **Simple Icons CDN** (`cdn.simpleicons.org`) using brand slugs from `src/data/brands.ts`. Each logo is tinted with its brand color; failures fall back to a monogram letter. Includes `TechPill` and `CompanyBadge` presentational helpers.

---

## 9. Current Chapter Timeline

**Files:** `src/components/Timeline.tsx`, `src/data/timeline.ts`

A vertical timeline of career chapters (company, role, dates, highlights) driven by `timeline.ts`. Static; reveals on scroll.

---

## 10. Beyond The Screen

**Files:** `src/components/BeyondScreen.tsx`

A closing personal section ("Beyond The Screen") — what Niraj does outside software: product thinking, design, impact. Framer Motion reveal. Static content.

---

> Next: [API](api.md) · [Back to README](../README.md)
