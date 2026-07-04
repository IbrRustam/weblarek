import { IBuyer, IUserData, FormErrors, TPayment } from '../types';

export class UserData implements IUserData {
    protected _payment: TPayment | null = null;
    protected _address: string = '';
    protected _email: string = '';
    protected _phone: string = '';
    protected _formErrors: FormErrors = {};

    constructor() {}

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

    get formErrors(): FormErrors {
        return this._formErrors;
    }

    setField(field: keyof IBuyer, value: string): void {
        if (field === 'payment') {
            if (value === 'card' || value === 'cash') {
                this._payment = value;
            } else {
                this._payment = null;
            }
        } else if (field === 'address') {
            this._address = value;
        } else if (field === 'email') {
            this._email = value;
        } else if (field === 'phone') {
            this._phone = value;
        }
    }

    getUserData(): IBuyer {
        return {
            payment: this._payment,
            address: this._address,
            email: this._email,
            phone: this._phone,
        };
    }

   clear(): void {
        this._payment = null;
        this._address = '';
        this._email = '';
        this._phone = '';
        this._formErrors = {};
    }

   validate(): FormErrors {
        const errors: FormErrors = {};

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

        this._formErrors = errors;
        return errors;
    }
}