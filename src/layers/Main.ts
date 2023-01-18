import constants from "../constants";
import Rectangle from "../elements/Rectangle";
import { ErrorReason } from "../types";
import Store from "../utilities/Store";

class Main {
  constructor() {
    const canvas = this.createCanvas();
    const context = canvas.getContext('2d');
    if (!context) throw new Error(ErrorReason.NoContext);

    const store = new Store();
    store.observe('elements', () => {
      console.log('rysuj', store.elements)
      context?.clearRect(0, 0, canvas.width, canvas.height);
      store.elements.forEach(element => {
        if (element instanceof Rectangle) return element.draw(context);
      });
    });
  }

  createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.classList.add('js-main-layer');
    canvas.width = constants.canvasWidthPx;
    canvas.height = constants.canvasHeightPx;
    canvas.style.zIndex = '1';
    document.querySelector(constants.canvasMountSelector)?.appendChild(canvas);
    return canvas;
  }
}

export default Main;