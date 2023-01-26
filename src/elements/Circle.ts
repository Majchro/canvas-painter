import constants from "../constants";
import { IElement } from "../types";
import Element from "./Element";

class Circle extends Element implements IElement {
  draw(context: CanvasRenderingContext2D, filled: boolean = false) {
    if (filled) {
      context.setLineDash([2]);
      context.fillStyle = constants.elementFillColor;
    }

    const radiusX = ((this.x + this.width) - this.x) / 2;
    const radiusY = ((this.y + this.height) - this.y) / 2;
    context.beginPath();
    context.ellipse(this.x + radiusX, this.y + radiusY, radiusX, radiusY, Math.PI, 0, 2 * Math.PI);
    context.stroke();
    if (filled) context.fill();
  }

  isPointInside(x: number, y: number): boolean {
    const radiusX = ((this.x + this.width) - this.x) / 2;
    const radiusY = ((this.y + this.height) - this.y) / 2;
    const centerX = this.x + radiusX;
    const centerY = this.y + radiusY;

    return (
      Math.pow((x - centerX), 2) / Math.pow(radiusX, 2) +
      Math.pow((y - centerY), 2) / Math.pow(radiusY, 2)
    ) <= 1
  }
}

export default Circle;