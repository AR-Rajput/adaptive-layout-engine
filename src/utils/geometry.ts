export type Rectangle = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export function overlaps(a: Rectangle, b: Rectangle): boolean {
    return !(
        a.x + a.width <= b.x || //A left of B
        b.x + b.width <= a.x || // B left of A
        a.y + a.height <= b.y || // A above B
        b.y + b.height <= a.y //B above A
    );
}

