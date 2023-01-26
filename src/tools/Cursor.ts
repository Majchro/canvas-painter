import Rectangle from "../elements/Rectangle";
import { Direction, ErrorReason, Point } from "../types";
import Store from "../utilities/Store";

type TransformData = {
  startPoint: Point | null;
  direction: Direction | null;
}

class Cursor {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private focusedElement: Rectangle | null = null;
  private readonly store: Store;
  private lastResizePoint: Point | null = null;
  private transformData = new Proxy<TransformData>({
    startPoint: null,
    direction: null,
  }, {
    set: (obj, prop, value) => {
      const key = prop as keyof TransformData;
      obj[key] = value;
      if (key !== 'direction') return true;
      switch(value) {
        case Direction.C:
          document.body.setAttribute('style', 'cursor: move');
          break;
        default:
          document.body.setAttribute('style', `cursor: ${value ? `${value}-resize` : 'default'}`);
          break;
      }
      return true;
    }
  });

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.store = new Store();
    const context = this.canvas.getContext('2d');
    if (!context) throw new Error(ErrorReason.NoContext);

    this.context = context;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.drawFocusedElement = this.drawFocusedElement.bind(this);
    this.storeFocusedElement = this.storeFocusedElement.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.initializeListeners();
  }

  destroy() {
    this.storeFocusedElement();
  }

  private storeFocusedElement() {
    if (!this.focusedElement) return;

    this.store.addElement(this.focusedElement);
    this.focusedElement = null;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private initializeListeners() {
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('keypress', this.handleKeyPress)
  }

  private handleMouseDown(ev: MouseEvent) {
    this.handleDropdownOpen(ev);
    this.handleResize(ev);
  }

  private handleMouseMove(ev: MouseEvent) {
    this.setCursor(ev);

    if (!this.focusedElement) return;
    if (!this.transformData.startPoint) return;
    if (!this.transformData.direction) return;

    if (this.transformData.direction !== Direction.C) {
      const value = this.getResizeValue(ev, this.lastResizePoint || this.transformData.startPoint);
      this.focusedElement.resize(this.transformData.direction, value);
    } else {
      const basePoints = this.lastResizePoint || this.transformData.startPoint;
      const x = ev.offsetX - basePoints.x;
      const y = ev.offsetY - basePoints.y;
      this.focusedElement.move(x, y)
    }
    this.drawFocusedElement();
    this.lastResizePoint = { x: ev.offsetX, y: ev.offsetY };
  }

  private setCursor(ev: MouseEvent) {
    if (!this.focusedElement) return;
    if (this.transformData.startPoint) return;

    const direction = this.focusedElement.getCursorDirection(ev.offsetX, ev.offsetY);
    this.transformData.direction = direction;
  }

  private handleResize(ev: MouseEvent) {
    if (!this.transformData.direction) return;
    if (this.transformData.startPoint) return;

    this.transformData.startPoint = { x: ev.offsetX, y: ev.offsetY };
  }

  private handleMouseUp(ev: MouseEvent) {
    if (!this.transformData.direction) return this.handleElementSelect(ev);
    if (!this.transformData.startPoint) return;
    if (!this.focusedElement) return;

    this.transformData.direction = null;
    this.transformData.startPoint = null;
    this.lastResizePoint = null;
  }

  private handleDropdownOpen(ev: MouseEvent) {
    if (ev.button !== 2) return;
    if (!this.focusedElement) return;
    if (!this.focusedElement.isPointInside(ev.offsetX, ev.offsetY)) return;

    console.log('open dropdown')
  }

  private handleElementSelect(ev: MouseEvent) {
    if (this.focusedElement) this.storeFocusedElement();
    const focusedElement = this.store.elements.find(element => element.isPointInside(ev.pageX, ev.pageY));
    if (!focusedElement) return;

    this.store.removeElement(focusedElement.id);
    this.focusedElement = focusedElement;
    this.drawFocusedElement();
  }

  private drawFocusedElement() {
    if (!this.focusedElement) return;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.focusedElement.draw(this.context, true)
  }

  private handleKeyPress(ev: KeyboardEvent) {
    if (ev.key !== 'Delete') return;
    if (!this.focusedElement) return;

    this.focusedElement = null;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private getResizeValue(ev: MouseEvent, resizePoint: Point): number {
    if (!this.transformData.direction) return 0;

    if (this.transformData.direction === Direction.N || this.transformData.direction === Direction.S) return ev.offsetY - resizePoint.y;

    if (this.transformData.direction === Direction.W || this.transformData.direction === Direction.E) return ev.offsetX - resizePoint.x;

    return 0;
  }
}

export default Cursor;