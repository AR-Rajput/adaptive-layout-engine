import type { ResolvedElement } from "./types/layout";

export function renderElement(element: ResolvedElement) {
    if (!element.visible) {
        return null;
    }
    
    const style = {
    position: "absolute" as const,
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height
    };

    switch (element.type) {
        case "text":
            return (
                <div
                    style={{
                        ...style,
                        fontSize: element.fontSize,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: element.truncated ? "nowrap" : "normal"
                    }}
                >
                    {element.truncated
                        ? `${element.content.slice(
                            0,
                            Math.max(1, Math.floor(element.width / (element.fontSize * 0.5)) - 3)
                        )}...`
                        : element.content}
                </div>
            );

        case "image":
            return (
                <img
                    src={element.content}
                    alt={element.name}
                    style={style}
                />
            );

        case "button":
            return <button style={style}>{element.content}</button>;

        default:
            return null;
    }
}