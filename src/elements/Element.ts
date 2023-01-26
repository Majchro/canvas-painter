import { v4 } from "uuid";
import constants from "../constants";
import { Direction, ErrorReason } from "../types";

class Element {
  id: string;
  protected x: number = 0;
  protected y: number = 0;
  protected width: number = 0;
  protected height: number = 0;

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

  isValid(): boolean {
    if (this.width <= 0) return false;
    if (this.height <= 0) return false

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

    if (
      y > this.y + constants.borderHoverOffset &&
      y < this.y + this.height - constants.borderHoverOffset &&
      x > this.x + constants.borderHoverOffset &&
      x < this.x + this.width - constants.borderHoverOffset
    ) return Direction.C;

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

  move(x: number, y: number): void {
    this.x = this.x + x;
    this.y = this.y + y;
  }
}

export default Element;