function clone(val) {
  return JSON.parse(JSON.stringify(val))
}

type EditableNode =
  | VectorNode
  | StarNode
  | LineNode
  | EllipseNode
  | PolygonNode
  | RectangleNode
  | TextNode

let includesBitmap = false

const filteredNodes: EditableNode[] = []

function traverseNodes(parentNode: SceneNode) {
  if (
    parentNode.type === "VECTOR" ||
    parentNode.type === "STAR" ||
    parentNode.type === "LINE" ||
    parentNode.type === "ELLIPSE" ||
    parentNode.type === "POLYGON" ||
    parentNode.type === "RECTANGLE" ||
    parentNode.type === "TEXT"
  ) {
    filteredNodes.push(parentNode)
  }
  if ("children" in parentNode) {
    for (const child of parentNode.children) {
      traverseNodes(child)
    }
  }
}

interface Color {
  r: number
  g: number
  b: number
}

/**
 * Account for luminosity
 * https://www.tutorialspoint.com/dip/grayscale_to_rgb_conversion.htm
 */
function getGrayscaleValue(colors: Color): number {
  return 0.3 * colors.r + 0.59 * colors.g + 0.11 * colors.b
}

function convertToGrayscale(colors: Color) {
  const grayValue = getGrayscaleValue(colors)
  colors.r = grayValue
  colors.g = grayValue
  colors.b = grayValue
}

function desaturateGradient(fill: GradientPaint) {
  const fillClone = clone(fill)
  fill.gradientStops.map(gradientStop => {
    convertToGrayscale(gradientStop.color)
  })
  fill = fillClone
}

function desaturateFills(node: EditableNode) {
  const fillsClone: Paint[] = clone(node.fills)
  fillsClone.map(fill => {
    if (fill.type === "SOLID") {
      convertToGrayscale(fill.color)
    } else if (fill.type === "IMAGE") {
      includesBitmap = true
    } else if (
      fill.type === "GRADIENT_RADIAL" ||
      fill.type === "GRADIENT_LINEAR" ||
      fill.type === "GRADIENT_ANGULAR" ||
      fill.type === "GRADIENT_DIAMOND"
    ) {
      desaturateGradient(fill)
    }
  })
  node.fills = fillsClone
}

function desaturateStrokes(node: EditableNode) {
  const strokes = clone(node.strokes)
  strokes.map(stroke => {
    const color = stroke.color
    convertToGrayscale(color)
  })
  node.strokes = strokes
}

function desaturateNodes(selection) {
  for (const selectedNode of selection) {
    traverseNodes(selectedNode)
    console.log(filteredNodes)
    for (const filteredNode of filteredNodes) {
      filteredNode.fills && desaturateFills(filteredNode)
      filteredNode.strokes && desaturateStrokes(filteredNode)
    }
  }
}

function getMessage() {
  if (includesBitmap) {
    return "Only vector objects can be desaturated."
  }
}

desaturateNodes(figma.currentPage.selection)

figma.closePlugin(getMessage())
