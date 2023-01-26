import { describe, expect, it } from 'vitest';
import Rectangle from '../elements/Rectangle';
import { Direction, ErrorReason } from '../types';

const isCanvasBlank = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('2d');
  if (!context) return false;

  return !context.getImageData(0, 0, canvas.width, canvas.height)
    .data
    .some(channel => channel !== 0);
}

describe('Rectangle', () => {
  it('can create instance', async () => {
    const rectangle = new Rectangle;
    expect(rectangle).toBeInstanceOf(Rectangle);
  });

  it('can set start point', async () => {
    const rectangle = new Rectangle;
    rectangle.setStartPoint(10, 10);
    expect(rectangle).toHaveProperty('x', 10);
    expect(rectangle).toHaveProperty('y', 10);
  });

  it('can set end points', async () => {
    const rectangle = new Rectangle;
    rectangle.setStartPoint(10, 10);
    rectangle.setEndPoint(30, 30);
    expect(rectangle).toHaveProperty('width', 20);
    expect(rectangle).toHaveProperty('height', 20);
  });

  it('cannot set end points with same values as start points', async () => {
    const rectangle = new Rectangle;
    rectangle.setStartPoint(10, 10);
    expect(() => rectangle.setEndPoint(10, 10, true)).toThrowError(ErrorReason.WrongElementPoints);
  });

  it('will change start points when end points are negative', async () => {
    const rectangle = new Rectangle;
    rectangle.setStartPoint(10, 10);
    rectangle.setEndPoint(5, 5, true);
    expect(rectangle).toHaveProperty('x', 5);
    expect(rectangle).toHaveProperty('y', 5);
    expect(rectangle).toHaveProperty('width', 5);
    expect(rectangle).toHaveProperty('height', 5);
  });

  // @vitest-environment jsdom
  it('will draw element on canvas', async () => {
    const rectangle = new Rectangle;
    rectangle.setStartPoint(10, 10);
    rectangle.setEndPoint(30, 30, true);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    rectangle.draw(context as CanvasRenderingContext2D, true);
    expect(isCanvasBlank(canvas)).toBeFalsy();
  });

  it('can will return true if element has valid points', async () => {
    const rectangle = new Rectangle;
    rectangle.setStartPoint(10, 10);
    rectangle.setEndPoint(30, 30, true);
    expect(rectangle.isValid()).toBeTruthy();
  });

  it('can will return true if point is inside element', async () => {
    const rectangle = new Rectangle;
    rectangle.setStartPoint(10, 10);
    rectangle.setEndPoint(30, 30, true);
    expect(rectangle.isPointInside(20, 20)).toBeTruthy();
  });

  it('can return valid cursor direction', async () => {
    const rectangle = new Rectangle;
    rectangle.setStartPoint(10, 10);
    rectangle.setEndPoint(30, 30, true);
    expect(rectangle.getCursorDirection(30, 15)).toBe(Direction.E);
  });

  it('can resize element', async () => {
    const rectangle = new Rectangle;
    rectangle.setStartPoint(10, 10);
    rectangle.setEndPoint(20, 20, true);
    rectangle.resize(Direction.W, -5);
    expect(rectangle).toHaveProperty('x', 5);
    expect(rectangle).toHaveProperty('y', 10);
    expect(rectangle).toHaveProperty('width', 15);
    expect(rectangle).toHaveProperty('height', 10);
  });
});