import { IProduct, IProductsData } from '../types';

export class ProductsData implements IProductsData {
    protected _products: IProduct[] = [];
    protected _preview: IProduct | null = null;

    constructor() {}

   setProducts(products: IProduct[]): void {
        this._products = products;
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
    
    setPreview(product: IProduct | null): void {
        this._preview = product;
    }

    getPreview(): IProduct | null {
        return this._preview;
    }
}