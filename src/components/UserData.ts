import { IBuyer, IUserData, BuyerErrors, TPayment } from '../types'; 

export class UserData implements IUserData { 
    protected _payment: TPayment | null = null; 
    protected _address: string = ''; 
    protected _email: string = ''; 
    protected _phone: string = ''; 

    constructor(protected events?: { emit: (event: string, data?: any) => void }) {} 

    get payment(): TPayment | null { 
        return this._payment; 
    } 
    get address(): string { 
        return this._address; 
    } 
    get email(): string { 
        return this._email; 
    } 
    get phone(): string { 
        return this._phone; 
    } 

    setField(field: keyof IBuyer, value: string): void { 
        if (field === 'payment') { 
            this._payment = (value === 'card' || value === 'cash') ? value : null; 
        } else if (field === 'address') { 
            this._address = value; 
        } else if (field === 'email') { 
            this._email = value; 
        } else if (field === 'phone') { 
            this._phone = value; 
        }
        this.events?.emit('buyer:changed');
    }    

    clear(): void { 
        this._payment = null; 
        this._address = ''; 
        this._email = ''; 
        this._phone = ''; 
        this.events?.emit('buyer:changed');
    } 

    validate(): BuyerErrors { 
        const errors: BuyerErrors = {}; 
        if (!this._payment) { 
            errors.payment = 'Необходимо выбрать способ оплаты'; 
        } 
        if (!this._address.trim()) { 
            errors.address = 'Необходимо указать адрес доставки'; 
        } 
        if (!this._email.trim()) { 
            errors.email = 'Необходимо указать email'; 
        } 
        if (!this._phone.trim()) { 
            errors.phone = 'Необходимо указать телефон'; 
        } 
        return errors; 
    } 
}