import { ErrorReason } from "../types";
import Store from "../utilities/Store";
import Circle from "../elements/Circle";
import Rectangle from "../elements/Rectangle";

type ElementType = Circle | Rectangle;

class Draw {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private element: ElementType | null = null;
  private readonly store: Store;
  private readonly tool;

  constructor(tool: 'circle' | 'rectangle', canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.tool = tool;
    this.store = new Store();

    const context = this.canvas.getContext('2d')
    if (!context) throw new Error(ErrorReason.NoContext);
    this.context = context;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.setElement = this.setElement.bind(this);
    this.addElementToStore = this.addElementToStore.bind(this);

    this.initializeListeners();
  }

  destroy() {
    console.log('destroy');
  }

  private initializeListeners() {
    this.canvas.addEventListener('mousedown', this.handleMouseDown)
    this.canvas.addEventListener('mouseup', this.handleMouseUp)
    this.canvas.addEventListener('mousemove', this.handleMouseMove)
  }

  private handleMouseDown(ev: MouseEvent) {
    this.element = this.getToolInstance();
    this.element.setStartPoint(ev.offsetX, ev.offsetY);
  }

  private handleMouseUp(ev: MouseEvent) {
    this.setElement(ev, true);
    this.addElementToStore();
  }

  private handleMouseMove(ev: MouseEvent) {
    if (ev.buttons !== 1) return;
    if (!this.canvas) return;

    this.setElement(ev, false);
    if (!this.element) return;

    this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.element.draw(this.context);
  }

  private setElement(ev: MouseEvent, isMouseUp: boolean) {
    if (!this.element) return;

    this.element.setEndPoint(ev.offsetX, ev.offsetY, isMouseUp)
  }

  private addElementToStore() {
    if (!this.element) return;
    if (!this.element.isValid()) return;

    this.store.addElement(this.element);
    this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.element = null;
  }

  private getToolInstance() {
    switch(this.tool) {
      case 'circle': return new Circle;
      case 'rectangle': return new Rectangle;
    }
  }
}

export default Draw;