import type {
    Surface,
    AdElement,
    ResolvedElement
} from "./types/layout";

import { overlaps } from "./utils/geometry";


// --------------------------------------------------
// 1. Calculate usable area
// --------------------------------------------------

export function calculateUsableArea(surface: Surface) {
    return {
        width:
            surface.width -
            surface.safeArea.left -
            surface.safeArea.right,

        height:
            surface.height -
            surface.safeArea.top -
            surface.safeArea.bottom
    };
}


// --------------------------------------------------
// 2. Generate degraded sizes
// --------------------------------------------------

export function getDegradedSizes(
    element: AdElement,
    surface: Surface
) {
    const surfaceMinSize =
        element.type === "button" && surface.touchOnly
            ? surface.minTapTarget
            : 0;

    const minTextSize =
        element.type === "text"
            ? surface.minTextSize
            : 0;

    const minWidth = Math.max(
        element.minWidth,
        surfaceMinSize
    );

    const minHeight = Math.max(
        element.minHeight,
        surfaceMinSize
    );

    const textScale =
        element.type === "text"
            ? minTextSize / element.fontSize
            : 0;

    const minScale = Math.max(
        minWidth / element.preferredWidth,
        minHeight / element.preferredHeight,
        textScale
    );

    const degradedSizes: {
        width: number;
        height: number;
        fontSize: number;
    }[] = [];

    let scale = 0.8;

    // Generate progressively smaller versions
    while (scale > minScale) {
        degradedSizes.push({
            width: element.preferredWidth * scale,
            height: element.preferredHeight * scale,
            fontSize:
                element.type === "text"
                    ? Math.max(
                        surface.minTextSize,
                        element.fontSize * scale
                    )
                    : 0
        });

        scale *= 0.8;
    }

    // Always include the smallest allowed size
    degradedSizes.push({
        width: element.preferredWidth * minScale,
        height: element.preferredHeight * minScale,
        fontSize:
            element.type === "text"
                ? Math.max(
                    surface.minTextSize,
                    element.fontSize * minScale
                )
                : 0
    });

    return degradedSizes;
}


// --------------------------------------------------
// 3. Decide whether text should be truncated
// --------------------------------------------------

function shouldTruncateText(
    element: AdElement,
    width: number,
    fontSize: number
): boolean {

    if (element.type !== "text") {
        return false;
    }

    // Primary content should be preserved
    if (element.priority === 1) {
        return false;
    }

    // Rough character-width estimation
    const characterWidth = fontSize * 0.5;

    const maxCharacters = Math.max(
        1,
        Math.floor(width / characterWidth)
    );

    return element.content.length > maxCharacters;
}


// --------------------------------------------------
// 4. Create hidden element
// --------------------------------------------------

function createHiddenElement(
    element: AdElement
): ResolvedElement {

    return {
        name: element.name,

        x: 0,
        y: 0,

        width: element.minWidth,
        height: element.minHeight,

        visible: false,

        fontSize: element.fontSize,

        type: element.type,

        content: element.content,

        truncated: false
    };
}


// --------------------------------------------------
// 5. Generate candidate positions
// --------------------------------------------------

function getCandidatePositions(
    size: {
        width: number;
        height: number;
    },
    surface: Surface,
    resolvedElements: ResolvedElement[]
): { x: number; y: number }[] {

    const usableArea = calculateUsableArea(surface);

    const gap = 20;

    const right =
        surface.safeArea.left +
        usableArea.width -
        size.width;

    const bottom =
        surface.safeArea.top +
        usableArea.height -
        size.height;

    const positions: { x: number; y: number }[] = [

        // Top-left
        {
            x: surface.safeArea.left,
            y: surface.safeArea.top
        },

        // Top-right
        {
            x: right,
            y: surface.safeArea.top
        },

        // Bottom-left
        {
            x: surface.safeArea.left,
            y: bottom
        },

        // Bottom-right
        {
            x: right,
            y: bottom
        }
    ];


    // Generate positions relative to
    // already placed elements
    for (const placed of resolvedElements) {

        if (!placed.visible) {
            continue;
        }

        // Right
        positions.push({
            x: placed.x + placed.width + gap,
            y: placed.y
        });

        // Below
        positions.push({
            x: placed.x,
            y: placed.y + placed.height + gap
        });

        // Left
        positions.push({
            x: placed.x - size.width - gap,
            y: placed.y
        });

        // Above
        positions.push({
            x: placed.x,
            y: placed.y - size.height - gap
        });

        // Same row, centered vertically
        positions.push({
            x: placed.x + placed.width + gap,
            y:
                placed.y +
                (placed.height - size.height) / 2
        });

        // Same column, centered horizontally
        positions.push({
            x:
                placed.x +
                (placed.width - size.width) / 2,

            y: placed.y + placed.height + gap
        });
    }

    return positions;
}


// --------------------------------------------------
// 6. Score candidate positions
// --------------------------------------------------

function scorePosition(
    position: { x: number; y: number },
    size: {
        width: number;
        height: number;
    },
    element: AdElement,
    resolvedElements: ResolvedElement[],
    surface: Surface
): number {

    let score = 0;

    const candidateCenterX =
        position.x + size.width / 2;

    const candidateCenterY =
        position.y + size.height / 2;


    // --------------------------------------------------
    // Prefer grouping elements together
    // --------------------------------------------------

    for (const placed of resolvedElements) {

        if (!placed.visible) {
            continue;
        }

        const placedCenterX =
            placed.x + placed.width / 2;

        const placedCenterY =
            placed.y + placed.height / 2;

        const distance =
            Math.abs(candidateCenterX - placedCenterX) +
            Math.abs(candidateCenterY - placedCenterY);

        // Closer elements receive a better score
        score += Math.max(
            0,
            1000 - distance
        );


        // --------------------------------------------------
        // Prefer horizontal alignment
        // --------------------------------------------------

        const sameRow =
            Math.abs(position.y - placed.y) < 10;

        if (sameRow) {
            score += 250;
        }


        // --------------------------------------------------
        // Prefer vertical alignment
        // --------------------------------------------------

        const sameColumn =
            Math.abs(position.x - placed.x) < 10;

        if (sameColumn) {
            score += 200;
        }


        // --------------------------------------------------
        // Prefer clean spacing
        // --------------------------------------------------

        const rightGap =
            Math.abs(
                position.x -
                (placed.x + placed.width + 20)
            );

        const belowGap =
            Math.abs(
                position.y -
                (placed.y + placed.height + 20)
            );

        if (rightGap < 10) {
            score += 300;
        }

        if (belowGap < 10) {
            score += 300;
        }
    }


    // --------------------------------------------------
    // Keep primary elements visually important
    // --------------------------------------------------

    if (element.priority === 1) {

        const surfaceCenterX =
            surface.width / 2;

        const surfaceCenterY =
            surface.height / 2;

        const centerDistance =
            Math.abs(
                candidateCenterX -
                surfaceCenterX
            ) +
            Math.abs(
                candidateCenterY -
                surfaceCenterY
            );

        score += Math.max(
            0,
            500 - centerDistance * 0.25
        );
    }


    // --------------------------------------------------
    // Prefer positions inside the safe area
    // --------------------------------------------------

    const safeCenterX =
        surface.safeArea.left +
        (
            surface.width -
            surface.safeArea.left -
            surface.safeArea.right
        ) / 2;

    const safeCenterY =
        surface.safeArea.top +
        (
            surface.height -
            surface.safeArea.top -
            surface.safeArea.bottom
        ) / 2;

    const safeDistance =
        Math.abs(candidateCenterX - safeCenterX) +
        Math.abs(candidateCenterY - safeCenterY);

    score += Math.max(
        0,
        200 - safeDistance * 0.1
    );


    return score;
}


// --------------------------------------------------
// 7. Resolve complete layout
// --------------------------------------------------

export function resolveLayout(
    elements: AdElement[],
    surface: Surface
): ResolvedElement[] {

    const usableArea =
        calculateUsableArea(surface);


    // --------------------------------------------------
    // Higher priority elements are resolved first
    // --------------------------------------------------

    const sortedElements =
        [...elements].sort(
            (a, b) =>
                a.priority - b.priority
        );


    const resolvedElements:
        ResolvedElement[] = [];


    // --------------------------------------------------
    // Resolve each element
    // --------------------------------------------------

    for (const element of sortedElements) {

        // Generate degraded versions
        const degradedSizes =
            getDegradedSizes(
                element,
                surface
            );


        // Try preferred size first
        const sizesToTry = [
            {
                width: element.preferredWidth,
                height: element.preferredHeight,
                fontSize: element.fontSize
            },

            ...degradedSizes
        ];


        let resolvedElement:
            ResolvedElement | null = null;


        // --------------------------------------------------
        // Try every size
        // --------------------------------------------------

        for (const size of sizesToTry) {

            const candidatePositions =
                getCandidatePositions(
                    size,
                    surface,
                    resolvedElements
                );


            const validCandidates:
                {
                    element: ResolvedElement;
                    score: number;
                }[] = [];


            // --------------------------------------------------
            // Evaluate every candidate position
            // --------------------------------------------------

            for (const position of candidatePositions) {

                const candidateFontSize =
                    element.type === "text"
                        ? Math.max(
                            surface.minTextSize,
                            size.fontSize
                        )
                        : 0;


                const candidate:
                    ResolvedElement = {

                    name: element.name,

                    x: position.x,
                    y: position.y,

                    width: size.width,
                    height: size.height,

                    visible: false,

                    fontSize:
                        candidateFontSize,

                    type: element.type,

                    content: element.content,

                    truncated:
                        shouldTruncateText(
                            element,
                            size.width,
                            candidateFontSize
                        )
                };


                // --------------------------------------------------
                // Check horizontal boundary
                // --------------------------------------------------

                const fitsHorizontally =
                    candidate.x >=
                        surface.safeArea.left &&

                    candidate.x +
                        candidate.width <=
                        surface.safeArea.left +
                        usableArea.width;


                // --------------------------------------------------
                // Check vertical boundary
                // --------------------------------------------------

                const fitsVertically =
                    candidate.y >=
                        surface.safeArea.top &&

                    candidate.y +
                        candidate.height <=
                        surface.safeArea.top +
                        usableArea.height;


                const fits =
                    fitsHorizontally &&
                    fitsVertically;


                // --------------------------------------------------
                // Check CTA tap target
                // --------------------------------------------------

                const meetsTapTarget =
                    element.type !== "button" ||
                    !surface.touchOnly ||
                    (
                        candidate.width >=
                            surface.minTapTarget &&

                        candidate.height >=
                            surface.minTapTarget
                    );


                // Reject invalid candidate
                if (!fits || !meetsTapTarget) {
                    continue;
                }


                // --------------------------------------------------
                // Check overlap
                // --------------------------------------------------

                const hasOverlap =
                    resolvedElements.some(
                        (placed) =>
                            placed.visible &&
                            overlaps(
                                candidate,
                                placed
                            )
                    );


                if (hasOverlap) {
                    continue;
                }


                // --------------------------------------------------
                // Candidate is valid
                // --------------------------------------------------

                const score =
                    scorePosition(
                        position,
                        size,
                        element,
                        resolvedElements,
                        surface
                    );


                validCandidates.push({
                    element: candidate,
                    score
                });
            }


            // --------------------------------------------------
            // Choose best valid candidate
            // --------------------------------------------------

            if (validCandidates.length > 0) {

                validCandidates.sort(
                    (a, b) =>
                        b.score - a.score
                );

                resolvedElement =
                    validCandidates[0].element;

                break;
            }
        }


        // --------------------------------------------------
        // Add resolved element
        // --------------------------------------------------

        if (resolvedElement) {

            resolvedElement.visible = true;

            resolvedElements.push(
                resolvedElement
            );

        } else {

            // No valid placement exists
            // so degrade by hiding the element

            resolvedElements.push(
                createHiddenElement(
                    element
                )
            );
        }
    }


    return resolvedElements;
}