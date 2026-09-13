# Architecture — Adaptive Layout Engine

## 1. Overview

The Adaptive Layout Engine uses a constraint-driven architecture to resolve advertisement layouts for different display surfaces.

The system separates:

- Advertisement specification
- Surface constraints
- Layout resolution
- Layout validation
- DOM rendering

The same advertisement specification can therefore be resolved for different surfaces without writing separate layout logic for each surface.

## 2. System Pipeline

```text
+-----------------------------+
|     Advertisement Spec      |
|                             |
| Headline                    |
| Product Image               |
| Price                       |
| CTA                         |
| Logo                        |
+-------------+---------------+
              |
              |
              v
+-----------------------------+
|      Surface Profile        |
|                             |
| Width / Height              |
| Safe Area                   |
| Minimum Text Size           |
| Minimum Tap Target          |
| Touch / Non-touch           |
+-------------+---------------+
              |
              v
+-----------------------------+
|      Constraint Resolver    |
|                             |
| Priority Ordering           |
| Size Degradation            |
| Candidate Positions         |
| Boundary Checks             |
| Overlap Checks              |
| Tap Target Checks           |
+-------------+---------------+
              |
              v
+-----------------------------+
|       Resolved Layout       |
|                             |
| x / y                       |
| width / height              |
| visibility                  |
| font size                   |
| truncation                  |
+-------------+---------------+
              |
              +------------------+
              |                  |
              v                  v
+----------------------+  +----------------------+
| Layout Validation    |  |   DOM Renderer       |
|                      |  |                      |
| No Overlap           |  | Text                 |
| Safe Area            |  | Image                |
| CTA Tap Target       |  | Button               |
| Minimum Text Size    |  |                      |
+----------------------+  +----------------------+