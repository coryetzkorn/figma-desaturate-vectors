function clone(val) {
    return JSON.parse(JSON.stringify(val));
}
const filteredNodes = [];
function traverseNodes(parentNode) {
    if (parentNode.type === "VECTOR" ||
        parentNode.type === "STAR" ||
        parentNode.type === "LINE" ||
        parentNode.type === "ELLIPSE" ||
        parentNode.type === "POLYGON" ||
        parentNode.type === "RECTANGLE" ||
        parentNode.type === "TEXT") {
        filteredNodes.push(parentNode);
    }
    if ("children" in parentNode) {
        for (const child of parentNode.children) {
            traverseNodes(child);
        }
    }
}
/**
 * Account for luminosity
 * https://www.tutorialspoint.com/dip/grayscale_to_rgb_conversion.htm
 */
function getGrayscaleValue(r, g, b) {
    return 0.3 * r + 0.59 * g + 0.11 * b;
}
function desaturateFills(node) {
    const fills = clone(node.fills);
    fills.map(fill => {
        if (fill.color) {
            const color = fill.color;
            const averageFill = getGrayscaleValue(color.r, color.g, color.b);
            color.r = averageFill;
            color.g = averageFill;
            color.b = averageFill;
        }
        return fill;
    });
    node.fills = fills;
}
function desaturateStrokes(node) {
    const strokes = clone(node.strokes);
    strokes.map(stroke => {
        const color = stroke.color;
        const averageFill = getGrayscaleValue(color.r, color.g, color.b);
        color.r = averageFill;
        color.g = averageFill;
        color.b = averageFill;
        return stroke;
    });
    node.strokes = strokes;
}
function desaturateNodes(selection) {
    for (const selectedNode of selection) {
        traverseNodes(selectedNode);
        for (const filteredNode of filteredNodes) {
            filteredNode.fills && desaturateFills(filteredNode);
            filteredNode.strokes && desaturateStrokes(filteredNode);
        }
    }
}
desaturateNodes(figma.currentPage.selection);
figma.closePlugin();
