import { IApi, IProductList, IOrder, IOrderResult, ILarekApi } from '../types';

export class LarekApi implements ILarekApi {
    protected _api: IApi;

    constructor(api: IApi) {
        this._api = api;
    }

    getProductList(): Promise<IProductList> {
        return this._api.get<IProductList>('/product');
    }

    createOrder(order: IOrder): Promise<IOrderResult> {
        return this._api.post<IOrderResult>('/order', order);
    }
}