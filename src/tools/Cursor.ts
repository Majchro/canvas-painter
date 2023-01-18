import Rectangle from "../elements/Rectangle";
import { Direction, ErrorReason } from "../types";
import Store from "../utilities/Store";

type ResizeData = {
  startPoint: { x: number, y: number } | null;
  resizeDirection: Direction | null;
}

class Cursor {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private focusedElement: Rectangle | null = null;
  private readonly store: Store;
  private resizeData = new Proxy<ResizeData>({
    startPoint: null,
    resizeDirection: null,
  }, {
    set: (obj, prop, value) => {
      const key = prop as keyof ResizeData;
      obj[key] = value;
      if (key === 'resizeDirection') document.body.setAttribute('style', `cursor: ${value ? `${value}-resize` : 'default'}`);
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
    this.handleResize(ev);
  }

  private handleMouseMove(ev: MouseEvent) {
    this.setCursor(ev);
  }

  private setCursor(ev: MouseEvent) {
    if (!this.focusedElement) return;
    if (this.resizeData.startPoint) return;

    const direction = this.focusedElement.getCursorDirection(ev.offsetX, ev.offsetY);
    this.resizeData.resizeDirection = direction;
  }

  private handleResize(ev: MouseEvent) {
    if (!this.resizeData.resizeDirection) return;
    if (this.resizeData.startPoint) return;

    this.resizeData.startPoint = { x: ev.offsetX, y: ev.offsetY };
  }

  private handleMouseUp(ev: MouseEvent) {
    if (!this.resizeData.resizeDirection) return this.handleElementSelect(ev);
    if (!this.resizeData.startPoint) return;
    if (!this.focusedElement) return;

    let value = 0;
    if (this.resizeData.resizeDirection === Direction.N || this.resizeData.resizeDirection === Direction.S) value = ev.offsetY - this.resizeData.startPoint.y;
    if (this.resizeData.resizeDirection === Direction.W || this.resizeData.resizeDirection === Direction.E) value = ev.offsetX - this.resizeData.startPoint.x;

    this.focusedElement.resize(this.resizeData.resizeDirection, value);
    this.resizeData.resizeDirection = null;
    this.resizeData.startPoint = null;
    this.drawFocusedElement();
  }

  private handleElementSelect(ev: MouseEvent) {
    const focusedElement = this.store.elements.find(element => element.isPointInside(ev.pageX, ev.pageY));
    if (!focusedElement) return;

    console.log(focusedElement, this.focusedElement)
    if (this.focusedElement) this.storeFocusedElement();

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
}

export default Cursor;