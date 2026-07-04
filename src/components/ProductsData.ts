import { IProduct } from '../types';
import { IEvents } from './base/Events';


export interface IProductsData {
    products: IProduct[];
    setProducts(products: IProduct[]): void;
    getProduct(productId: string): IProduct | undefined;
}

export class ProductsData implements IProductsData {    
    protected _products: IProduct[] = [];    
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }
    
    setProducts(products: IProduct[]): void {
        this._products = products;        
        this.events.emit('products:changed', { products: this._products });
    }

    get products(): IProduct[] {
        return this._products;
    }

    getProduct(productId: string): IProduct | undefined {
        return this._products.find((item) => item.id === productId);
    }
}