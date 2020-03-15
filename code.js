function clone(val) {
    return JSON.parse(JSON.stringify(val));
}
for (const node of figma.currentPage.selection) {
    console.log(node);
    if (node.type === "VECTOR") {
        const fills = clone(node.fills);
        const color = fills[0].color;
        const averageFill = (color.r + color.g + color.b) / 3;
        color.r = averageFill;
        color.g = averageFill;
        color.b = averageFill;
        node.fills = fills;
    }
}
figma.closePlugin();
