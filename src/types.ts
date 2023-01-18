export enum Tool {
  Cursor = 'cursor',
  DrawRectangle = 'draw-rectangle',
  DrawCircle = 'draw-circle',
}

export enum ErrorReason {
  WrongElementPoints = 'wrong-element-points',
  NoContext = 'no-context',
}

export type PartialKey<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>

export enum Direction {
  N = 'n',
  NE = 'ne',
  E = 'e',
  SE = 'se',
  S = 's',
  SW = 'sw',
  W = 'w',
  NW = 'nw',
}

export interface Element {
  id: string;
  setStartPoint(x: number, y: number): void;
  setEndPoint(x: number, y: number): void;
  draw(context: CanvasRenderingContext2D, filled: boolean): void;
  isValid(): boolean;
  isPointInside(x: number, y: number): boolean;
  getCursorDirection(x: number, y: number): Direction | null;
  resize(direction: Direction, value: number): void;
}