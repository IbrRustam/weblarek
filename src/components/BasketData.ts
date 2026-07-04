import { IProduct, IBasketData } from '../types';

export class BasketData implements IBasketData {
    protected _items: IProduct[] = [];

    constructor() {}

    get items(): IProduct[] {
        return this._items;
    }

    get total(): number {
        return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    get count(): number {
        return this._items.length;
    }

    add(item: IProduct): void {
        if (!this.has(item.id)) {
            this._items.push(item);
        }
    }

    remove(id: string): void {
        this._items = this._items.filter((item) => item.id !== id);
    }

    clear(): void {
        this._items = [];
    }

    has(id: string): boolean {
        return this._items.some((item) => item.id === id);
    }
}