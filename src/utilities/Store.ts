import { Tool } from "../types";
import { v4 } from 'uuid';
import produce from "immer";
import Rectangle from "../elements/Rectangle";
import Circle from "../elements/Circle";

type StoreType = {
  tool: Tool;
  elements: Array<Rectangle | Circle>;
}

const defaultStore: StoreType = {
  tool: Tool.Cursor,
  elements: [],
}

type Observer = {
  id: string;
  key: keyof StoreType;
  callback: () => void;
}

class Store {
  private static instance: Store;
  private observers: Array<Observer> = [];
  private store = new Proxy(defaultStore, {
    set: (obj, prop, value) => {
      const key = prop as keyof StoreType;
      obj[key] = value;
      this.delegateChange(key);
      return true;
    }
  });

  constructor() {
    if (Store.instance) {
      return Store.instance;
    }

    Store.instance = this;
  }

  get tool() {
    return this.store.tool;
  }

  set tool(tool: Tool) {
    this.store.tool = tool;
  }

  get elements() {
    return this.store.elements;
  }

  addElement(element: Rectangle | Circle) {
    this.store.elements = produce(this.store.elements, draft => {
      draft.push(element);
    });
  }

  removeElement(id: string) {
    this.store.elements = this.elements.filter(element => element.id !== id);
  }

  private delegateChange(key: keyof StoreType) {
    this.observers.forEach(observer => {
      if (observer.key !== key) return;

      observer.callback();
    })
  }

  observe(key: keyof StoreType, callback: () => void) {
    const observer = { id: v4(), key, callback };
    this.observers = produce(this.observers, draft => {
      draft.push(observer);
    });
    return {
      remove: () => this.removeObserver(observer.id)
    };
  }

  private removeObserver(id: Observer['id']) {
    this.observers = this.observers.filter(observer => observer.id !== id)
  }
}

export default Store;