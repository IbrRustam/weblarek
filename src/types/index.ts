export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash' ;

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}

export interface IProductList {
    total: number;
    items: IProduct[];
}

export interface IOrder extends IBuyer {
    items: string[];
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type BuyerErrors = Partial<Record<keyof IBuyer, string>>;

export interface IProductsData {
    products: IProduct[];
    preview: IProduct | null; 
    setProducts(products: IProduct[]): void;
    getProduct(productId: string): IProduct | undefined;    
}

export interface IBasketData {
    items: IProduct[];
    total: number;
    count: number;
    add(item: IProduct): void;
    remove(id: string): void;
    clear(): void;
    has(id: string): boolean;
}

export interface IUserData {
    payment: TPayment | null;
    address: string;
    email: string;
    phone: string;
    setField(field: keyof IBuyer, value: string): void;
    clear(): void;
    validate(): BuyerErrors; 
}

export interface ILarekApi {
    getProductList(): Promise<IProductList>;
    createOrder(order: IOrder): Promise<IOrderResult>;
}