import { v4 } from "uuid";
import constants from "../constants";
import { Direction, Element, ErrorReason } from "../types";

class Rectangle implements Element {
  id: string;
  private x: number = 0;
  private y: number = 0;
  private width: number = 0;
  private height: number = 0;

  constructor() {
    this.id = v4();
  }

  setStartPoint(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setEndPoint(x: number, y: number, lastChange: boolean = false) {
    let width = x - this.x;
    let height = y - this.y;
    if (!lastChange) {
      this.width = width;
      this.height = height;
      return;
    }

    if (width === 0 || height === 0) throw new Error(ErrorReason.WrongElementPoints);

    if (width < 0) {
      this.x = this.x + width;
      width = Math.abs(width);
    }

    if (height < 0) {
      this.y = this.y + height;
      height = Math.abs(height);
    }

    this.width = width;
    this.height = height;
  }

  draw(context: CanvasRenderingContext2D, filled: boolean = false) {
    if (filled) {
      context.setLineDash([2]);
      context.fillStyle = constants.elementFillColor;
      context.fillRect(this.x, this.y, this.width, this.height);
    }
    context.strokeRect(this.x, this.y, this.width, this.height);
  }

  isValid(): boolean {
    if (this.width <= 0) return false;
    if (this.height <= 0) return false

    return true;
  }

  isPointInside(x: number, y: number): boolean {
    if (x < this.x) return false;
    if (x > this.x + this.width) return false;
    if (y < this.y) return false;
    if (y > this.y + this.height) return false;

    return true;
  }

  getCursorDirection(x: number, y: number): Direction | null {
    if (
      x > this.x &&
      x < this.x + this.width &&
      y > this.y - constants.borderHoverOffset &&
      y < this.y + constants.borderHoverOffset
    ) return Direction.N;

    if (
      x > this.x &&
      x < this.x + this.width &&
      y > this.y + this.height - constants.borderHoverOffset &&
      y < this.y + this.height + constants.borderHoverOffset
    ) return Direction.S;

    if (
      y > this.y &&
      y < this.y + this.height &&
      x > this.x - constants.borderHoverOffset &&
      x < this.x + constants.borderHoverOffset
    ) return Direction.W;

    if (
      y > this.y &&
      y < this.y + this.height &&
      x > this.x + this.width - constants.borderHoverOffset &&
      x < this.x + this.width + constants.borderHoverOffset
    ) return Direction.E;

    return null;
  }

  resize(direction: Direction, value: number): void {
    switch (direction) {
      case Direction.N:
        this.y = this.y + value;
        this.height = this.height - value;
        break;
      case Direction.S:
        this.height = this.height + value;
        break;
      case Direction.W:
        this.x = this.x + value;
        this.width = this.width - value;
        break;
      case Direction.E:
        this.width = this.width + value;
        break;
    }
  }
}

export default Rectangle;