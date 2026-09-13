import type {
  Surface,
  ResolvedElement
} from "./types/layout";

import { overlaps } from "./utils/geometry";


export type ElementValidation = {
  name: string;
  visible: boolean;
  status: "visible" | "dropped";
};


export type LayoutValidation = {
  noOverlap: boolean;
  insideSafeArea: boolean;
  validTapTargets: boolean;
  validTextSizes: boolean;

  visibleCount: number;
  totalCount: number;

  elements: ElementValidation[];

  isValid: boolean;
};


export function validateLayout(
  elements: ResolvedElement[],
  surface: Surface
): LayoutValidation {

  const usableWidth =
    surface.width -
    surface.safeArea.left -
    surface.safeArea.right;

  const usableHeight =
    surface.height -
    surface.safeArea.top -
    surface.safeArea.bottom;


  const visibleElements =
    elements.filter(
      (element) => element.visible
    );


  // Check that visible elements do not overlap.
  let noOverlap = true;

  for (
    let i = 0;
    i < visibleElements.length;
    i++
  ) {
    for (
      let j = i + 1;
      j < visibleElements.length;
      j++
    ) {
      if (
        overlaps(
          visibleElements[i],
          visibleElements[j]
        )
      ) {
        noOverlap = false;
      }
    }
  }


  // Check safe-area boundaries.
  const insideSafeArea =
    visibleElements.every(
      (element) =>
        element.x >=
          surface.safeArea.left &&

        element.y >=
          surface.safeArea.top &&

        element.x +
          element.width <=
          surface.safeArea.left +
          usableWidth &&

        element.y +
          element.height <=
          surface.safeArea.top +
          usableHeight
    );


  // Check CTA minimum tap target.
  const validTapTargets =
    visibleElements.every(
      (element) =>
        element.type !== "button" ||
        !surface.touchOnly ||
        (
          element.width >=
            surface.minTapTarget &&

          element.height >=
            surface.minTapTarget
        )
    );


  // Check minimum text size.
  const validTextSizes =
    visibleElements.every(
      (element) =>
        element.type !== "text" ||
        element.fontSize >=
          surface.minTextSize
    );


  // Record which elements survived resolution.
  const elementResults: ElementValidation[] =
  elements.map(
    (element) => ({
      name: element.name,
      visible: element.visible,
      status: element.visible
        ? "visible"
        : "dropped"
    })
  );

  return {
    noOverlap,

    insideSafeArea,

    validTapTargets,

    validTextSizes,

    visibleCount:
      visibleElements.length,

    totalCount:
      elements.length,

    elements:
      elementResults,

    isValid:
      noOverlap &&
      insideSafeArea &&
      validTapTargets &&
      validTextSizes
  };
}