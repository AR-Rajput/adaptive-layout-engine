# Adaptive Layout Engine for Multi-Surface Ads

## Links

- **Live Demo:** https://frabjous-gumption-4d8fef.netlify.app/
- **GitHub Repository:** https://github.com/AR-Rajput/adaptive-layout-engine

A constraint-driven layout engine that dynamically resolves the position, size, visibility, and degradation of advertisement elements for different display surfaces.

The same advertisement specification is passed to a generic constraint resolver along with the target surface constraints. The resolver produces a valid layout without requiring surface-specific layout logic.

## Features

- Supports multiple display surfaces using surface profiles.
- Resolves element positions and sizes dynamically.
- Prevents element overlap.
- Keeps elements inside the defined safe area.
- Enforces minimum CTA tap targets on touch surfaces.
- Enforces minimum text sizes.
- Uses element priorities for graceful degradation.
- Shrinks elements when space is constrained.
- Truncates secondary text when necessary.
- Drops lower-priority elements when no valid placement is possible.
- Uses the same resolver for all surfaces.

## Supported Surfaces

The demo includes four required surfaces:

1. Mobile Portrait
2. Mobile Landscape
3. Broadcast Lower Third
4. Square Retail Kiosk

Each surface is represented by a profile containing its dimensions and constraints.

## Architecture

The engine follows this pipeline:

    Ad Specification + Surface Profile
                    |
                    v
            Constraint Resolver
                    |
                    v
             Resolved Layout
                    |
                    v
              DOM Renderer

### Main Components

- `adSpec.ts`
  - Defines the advertisement elements.
  - Contains properties such as priority, preferred size, minimum size, content, and element type.

- `surfaces.ts`
  - Defines the supported surface profiles.
  - Contains dimensions, orientation, safe-area margins, minimum tap target, and minimum text size.

- `resolver.ts`
  - Core layout resolution algorithm.
  - Places elements according to priority.
  - Generates candidate sizes and positions.
  - Rejects invalid positions.
  - Handles degradation when space is constrained.

- `validation.ts`
  - Validates the resolved layout.
  - Checks overlap, safe-area boundaries, CTA tap targets, and minimum text sizes.

- `renderer-dom.tsx`
  - Converts the resolved layout into rendered DOM elements.

- `utils/geometry.ts`
  - Contains rectangle geometry utilities used for overlap detection.

## Constraint Resolution

Elements are resolved according to priority:

    Priority 1
    Headline
    Product Image

    Priority 2
    CTA
    Price

    Priority 3
    Logo

Higher-priority elements are resolved first so that they are preserved when the available space becomes limited.

For each element, the resolver:

1. Tries the preferred size.
2. Generates progressively smaller sizes.
3. Generates possible positions.
4. Rejects positions outside the safe area.
5. Rejects positions that overlap existing elements.
6. Checks CTA minimum tap-target requirements.
7. Selects the best valid candidate.
8. Hides the element if no valid placement exists.

This allows the same resolver to adapt the advertisement to different surfaces.

## Graceful Degradation

When the available space is insufficient, the engine degrades elements while respecting their priorities.

The general strategy is:

    Preferred size
          ↓
    Smaller size
          ↓
    Text truncation for secondary text
          ↓
    Drop lower-priority element

Higher-priority content is preserved before lower-priority branding elements.

## Validation

The demo displays the validation status of the resolved layout.

The following constraints are checked:

- No Overlap
- Safe Area
- CTA Tap Target
- Minimum Text Size

A layout is marked `VALID` only when all required constraints pass.

## Technology Stack

- React
- TypeScript
- Vite
- CSS

No backend is required.

## Running the Project

Install dependencies:

    npm install

Start the development server:

    npm run dev

The application can then be opened using the local development URL shown by Vite.

## Production Build

To create a production build:

    npm run build

The generated production files are placed in the `dist` directory.

## Adding a New Surface

A new surface can be added by defining another surface profile in `surfaces.ts`.

The resolver does not need to be modified.

Example:

    export const newSurface: Surface = {
      name: "New Surface",
      width: 1200,
      height: 800,
      orientation: "landscape",
      touchOnly: false,
      minTapTarget: 0,
      minTextSize: 24,
      safeArea: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
    };

This demonstrates the surface-agnostic architecture of the layout engine.