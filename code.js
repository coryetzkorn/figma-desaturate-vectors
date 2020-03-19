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
function getGrayscaleValue(colors) {
    return 0.3 * colors.r + 0.59 * colors.g + 0.11 * colors.b;
}
function convertToGrayscale(colors) {
    const grayValue = getGrayscaleValue(colors);
    colors.r = grayValue;
    colors.g = grayValue;
    colors.b = grayValue;
}
function desaturateFills(node) {
    const fills = clone(node.fills);
    fills.map(fill => {
        if (fill.color) {
            const color = fill.color;
            convertToGrayscale(color);
        }
    });
    node.fills = fills;
}
function desaturateStrokes(node) {
    const strokes = clone(node.strokes);
    strokes.map(stroke => {
        const color = stroke.color;
        convertToGrayscale(color);
    });
    node.strokes = strokes;
}
function desaturateNodes(selection) {
    for (const selectedNode of selection) {
        traverseNodes(selectedNode);
        console.log(filteredNodes);
        for (const filteredNode of filteredNodes) {
            filteredNode.fills && desaturateFills(filteredNode);
            filteredNode.strokes && desaturateStrokes(filteredNode);
        }
    }
}
desaturateNodes(figma.currentPage.selection);
figma.closePlugin();
