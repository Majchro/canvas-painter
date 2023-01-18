import constants from "../constants";

class Draw {
  readonly canvas: HTMLCanvasElement;

  constructor() {
    this.canvas = this.createCanvas();
  }

  createCanvas() {
    let canvas = document.querySelector('canvas.js-draw-layer') as HTMLCanvasElement;
    if (canvas) canvas.remove();

    canvas = document.createElement('canvas');
    canvas.classList.add('js-draw-layer');
    canvas.width = constants.canvasWidthPx;
    canvas.height = constants.canvasHeightPx;
    canvas.style.zIndex = '2';
    document.querySelector(constants.canvasMountSelector)?.appendChild(canvas);
    return canvas;
  }
}

export default Draw;