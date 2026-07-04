import { IProduct } from "../types";
import { IEvents } from "./base/Events";

export interface IBasketData {
    items: IProduct[];
    total: number;
    count: number;
    add(item: IProduct): void;
    remove(id: string): void;
    clear(): void;
    has(id: string): boolean;
}

export class BasketData implements IBasketData {
    protected _items: IProduct[] = [];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

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
            this.events.emit('basket:changed', { 
              items: this._items, 
              count: this.count,
              total: this.total              
            });
        }
      }

    remove(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
        this.events.emit('basket:changed', {
            items: this._items,
            count: this.count,
            total: this.total
        });
    }

    clear(): void {
        this._items = [];
        this.events.emit('basket:changed', {
            items: this._items,
            count: this.count,
            total: this.total
        });
    }

    has(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}