import { useState } from "react";

import { resolveLayout } from "./resolver";
import { validateLayout } from "./validation";
import { adSpec } from "./adSpec";
import { renderElement } from "./renderer-dom";

import {
  mobilePortrait,
  mobileLandscape,
  broadcastLowerThird,
  squareRetailKiosk,
} from "./surfaces";

import type { Surface } from "./types/layout";


function App() {
  const [surface, setSurface] =
    useState<Surface>(mobilePortrait);


  // Resolve the ad layout for the selected surface
  const resolvedLayout =
    resolveLayout(adSpec, surface);


  // Validate the resolved layout
  const validation =
    validateLayout(
      resolvedLayout,
      surface
    );


  // Scale large surfaces so they fit inside the browser preview
  const previewScale = Math.min(
    1,
    800 / surface.width,
    500 / surface.height
  );


  console.log("Validation:", validation);
  console.log("Resolved Layout:", resolvedLayout);


  return (
    <div>

      <h1>
        Adaptive Layout Engine
      </h1>


      <h2>
        {surface.name}
      </h2>


      <p>
        {surface.width} × {surface.height}
      </p>


      {/* Surface selection */}
      <div>

        <button
          onClick={() =>
            setSurface(mobilePortrait)
          }
        >
          Mobile Portrait
        </button>


        <button
          onClick={() =>
            setSurface(mobileLandscape)
          }
        >
          Mobile Landscape
        </button>


        <button
          onClick={() =>
            setSurface(broadcastLowerThird)
          }
        >
          Broadcast
        </button>


        <button
          onClick={() =>
            setSurface(squareRetailKiosk)
          }
        >
          Kiosk
        </button>

      </div>


      {/* Validation panel */}
      <div className="validation-panel">

        <h3>
          Resolution Details
        </h3>


        <p>
          Surface: {surface.name}
        </p>


        <p>
          Size: {surface.width} × {surface.height}
        </p>


        <h4>
          Constraints
        </h4>


        <p>
          {validation.noOverlap ? "✓" : "✕"}
          {" "}No Overlap
        </p>


        <p>
          {validation.insideSafeArea ? "✓" : "✕"}
          {" "}Safe Area
        </p>


        <p>
          {validation.validTapTargets ? "✓" : "✕"}
          {" "}CTA Tap Target
        </p>


        <p>
          {validation.validTextSizes ? "✓" : "✕"}
          {" "}Minimum Text Size
        </p>


        <h4>
          Elements
        </h4>


        {validation.elements.map((element) => {

          const resolvedElement =
            resolvedLayout.find(
              (item) =>
                item.name === element.name
            );


          return (
            <div
              key={element.name}
              className="element-result"
            >

              <p>
                {element.visible
                  ? "✓"
                  : "✕"}
                {" "}
                {element.name}

                {!element.visible &&
                  " — dropped"}
              </p>


              {resolvedElement?.visible && (
                <small>

                  Size:{" "}
                  {Math.round(
                    resolvedElement.width
                  )}
                  {" × "}
                  {Math.round(
                    resolvedElement.height
                  )}

                  <br />

                  Position: (
                  {Math.round(
                    resolvedElement.x
                  )}
                  ,{" "}
                  {Math.round(
                    resolvedElement.y
                  )}
                  )

                  {resolvedElement.truncated && (
                    <>
                      <br />

                      Text: truncated
                    </>
                  )}

                </small>
              )}

            </div>
          );
        })}


        <p>
          {validation.visibleCount} /{" "}
          {validation.totalCount} elements visible
        </p>


        <strong>
          Layout:{" "}
          {validation.isValid
            ? "VALID"
            : "INVALID"}
        </strong>

      </div>


      {/* Ad preview */}
      <div
        className="ad-canvas"
        style={{
          width: surface.width,
          height: surface.height,
          transform: `scale(${previewScale})`,
          transformOrigin: "top center"
        }}
      >

        {resolvedLayout.map(
          (element) =>
            renderElement(element)
        )}

      </div>

    </div>
  );
}


export default App;