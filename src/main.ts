import DrawLayer from "./layers/Draw";
import MainLayer from "./layers/Main";
import CursorTool from "./tools/Cursor";
import DrawTool from "./tools/Draw";
import { Tool } from "./types";
import Store from "./utilities/Store";

class App {
  private toolInstance: CursorTool | DrawTool | null = null

  constructor() {
    const store = new Store();
    store.observe('tool', () => {
      this.handleToolChange(store.tool);
    });

    document.querySelectorAll('.js-toolbar > *[data-tool]').forEach(tool => {
      tool.addEventListener('click', (ev) => {
        const toolElement = ev.currentTarget as HTMLElement;
        store.tool = toolElement.dataset.tool as Tool;
      });
    })

    new MainLayer();
  }

  handleToolChange(tool: Tool) {
    if (this.toolInstance) this.toolInstance.destroy();
    document.querySelectorAll('canvas:not(.js-main-layer)').forEach(canvas => canvas.remove());
    const canvasLayer = new DrawLayer();
    switch (tool) {
      case Tool.Cursor:
        this.toolInstance = new CursorTool(canvasLayer.canvas);
        return;
      case Tool.DrawRectangle:
        this.toolInstance = new DrawTool('rectangle', canvasLayer.canvas);
        return;
      case Tool.DrawCircle:
        this.toolInstance = new DrawTool('circle', canvasLayer.canvas);
        return;
    }
  }
}

export default App;

new App();