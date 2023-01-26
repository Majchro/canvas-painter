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
  C = 'c',
}

export interface IElement {
  draw(context: CanvasRenderingContext2D, filled: boolean): void;
  isPointInside(x: number, y: number): boolean;
}

export type Point = {
  x: number;
  y: number;
}