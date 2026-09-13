import type { Surface } from "./types/layout";

export const mobilePortrait: Surface = {
    name: "Mobile Portrait",
    width: 390,
    height: 844,
    orientation: "portrait",
    touchOnly: true,
    minTapTarget: 48,
    minTextSize: 16,
    safeArea: {        // defining 20px as protected margin
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    }
};

export const mobileLandscape: Surface = {
    name: "Mobile Landscape",
    width: 844,
    height: 390,
    orientation: "landscape",
    touchOnly: true,
    minTapTarget: 48,
    minTextSize: 16,
    safeArea: {        
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    }
};

export const broadcastLowerThird: Surface = {
    name: "Broadcast Lower Third",
    width: 1920,
    height: 1080,
    orientation: "landscape",
    touchOnly: false,
    minTapTarget: 0,
    minTextSize: 32,
    safeArea: {        
        top: 40,
        right: 40,
        bottom: 80,
        left: 40
    }
};

export const squareRetailKiosk: Surface = {
    name: "Square Retail Kiosk",
    width: 1080,
    height: 1080,
    orientation: "square",
    touchOnly: true,
    minTapTarget: 48,
    minTextSize: 16,
    safeArea: {        
        top: 40,
        right: 40,
        bottom: 40,
        left: 40
    }
};

export const tinyTestSurface: Surface = {
  name: "Tiny Test Surface",
  width: 250,
  height: 300,
  orientation: "portrait",
  touchOnly: true,
  minTapTarget: 48,
  minTextSize: 16,
  safeArea: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  }
};

export const ultraWideDisplay: Surface = {
  name: "Ultra Wide Display",
  width: 1600,
  height: 500,
  orientation: "landscape",
  touchOnly: false,
  minTapTarget: 0,
  minTextSize: 24,
  safeArea: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
  }
};