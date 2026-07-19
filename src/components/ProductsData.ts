import { IProduct, IProductsData } from '../types';
import { IEvents } from './base/Events';

export class ProductsData implements IProductsData {
    protected _products: IProduct[] = [];
    protected _preview: IProduct | null = null;

    constructor(protected events: IEvents) {}
    setProducts(products: IProduct[]): void {        
        this._products = products;
        this.events.emit('items:changed');
    }

    get products(): IProduct[] {
        return this._products;
    }

    getProduct(productId: string): IProduct | undefined {
        return this._products.find((item) => item.id === productId);
    }

   get preview(): IProduct | null {
        return this._preview;
    }

    set preview(product: IProduct | null) {
        this._preview = product;
        this.events.emit('preview:changed');
    }
}
