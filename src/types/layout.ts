export type Surface = {
    name: string;
    width: number;
    height: number;
    orientation: "portrait" | "landscape" | "square";
    touchOnly: boolean;
    minTapTarget: number;
    minTextSize: number;
    safeArea: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
};

export type ElementType = "text" | "image" | "button";

export type AdElement = {
    name: string;
    priority: number;
    preferredWidth: number;
    preferredHeight: number;
    minWidth: number;
    minHeight: number;
    content: string;
    type: ElementType;
    fontSize:number;
};

export type ResolvedElement = {
    name: string,
    x: number;
    y: number;
    width: number;
    height: number;
    visible: boolean;
    fontSize: number;
    type: ElementType;
    content: string;
    truncated:boolean;
};