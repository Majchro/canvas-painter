import { describe, expect, it } from 'vitest';
import Rectangle from '../elements/Rectangle';
import { Tool } from '../types';
import Store from './Store';

describe('Store', () => {
  it('can initialize Store', async () => {
    const store = new Store;
    expect(store).toBeInstanceOf(Store);
  });

  it('is singleton', async () => {
    const firstStore = new Store;
    const secondStore = new Store;
    expect(firstStore).toBe(secondStore);
  });

  it('default tool is Cursor', async () => {
    const store = new Store;
    expect(store.tool).toBe(Tool.Cursor)
  });

  it('can change tool', async () => {
    const store = new Store;
    store.tool = Tool.DrawCircle;
    expect(store.tool).toBe(Tool.DrawCircle);
  });

  it('can add and remove element', async () => {
    const store = new Store;
    const rectangle = new Rectangle;
    store.addElement(rectangle);
    expect(store.elements).length(1);
    store.removeElement(rectangle.id);
    expect(store.elements).length(0);
  });

  it('can observe changes', async () => {
    const store = new Store;
    let isChanged = false;
    store.observe('tool', () => isChanged = true);
    expect(isChanged).toBeFalsy();
    store.tool = Tool.DrawCircle;
    expect(isChanged).toBeTruthy();
  });

  it ('can remove observer', async () => {
    const store = new Store;
    let isChanged = false;
    const observer = store.observe('tool', () => isChanged = !isChanged);
    expect(isChanged).toBeFalsy();
    store.tool = Tool.DrawCircle;
    expect(isChanged).toBeTruthy();
    observer.remove();
    store.tool = Tool.Cursor;
    expect(isChanged).toBeTruthy();
  });
});