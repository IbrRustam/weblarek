import { Api } from './base/Api';
import { IProductList, IOrder, IOrderResult } from '../types';

export interface ILarekApi {
    getProductList(): Promise<IProductList>;
    createOrder(order: IOrder): Promise<IOrderResult>;
}

export class LarekApi implements ILarekApi {
    protected _api: Api;

    constructor(api: Api) {
        this._api = api;
    }

    getProductList(): Promise<IProductList> {
        return this._api.get("/product") as Promise<IProductList>;
    }

    createOrder(order: IOrder): Promise<IOrderResult> {
        return this._api.post("/order", order) as Promise<IOrderResult>;
    }
}