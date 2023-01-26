import constants from "../constants";
import { IElement } from "../types";
import Element from "./Element";

class Rectangle extends Element implements IElement {
  draw(context: CanvasRenderingContext2D, filled: boolean = false) {
    if (filled) {
      context.setLineDash([2]);
      context.fillStyle = constants.elementFillColor;
      context.fillRect(this.x, this.y, this.width, this.height);
    }
    context.strokeRect(this.x, this.y, this.width, this.height);
  }

  isPointInside(x: number, y: number): boolean {
    if (x < this.x) return false;
    if (x > this.x + this.width) return false;
    if (y < this.y) return false;
    if (y > this.y + this.height) return false;

    return true;
  }
}

export default Rectangle;