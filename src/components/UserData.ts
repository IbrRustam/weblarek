import { IBuyer, TPayment } from '../types';
import { IEvents } from './base/Events';

export type FormErrors = Partial<Record<keyof IBuyer, string>>;

export interface IUserData {
    payment: TPayment | '';
    address: string;
    email: string;
    phone: string;
    formErrors: FormErrors;
    setField(field: keyof IBuyer, value: string): void;
    getUserData(): IBuyer;
    clear(): void;
    validateOrder(): boolean;
    validateContacts(): boolean;
}

export class UserData implements IUserData {
    payment: TPayment | '' = '';
    address: string = '';
    email: string = '';
    phone: string = '';
    formErrors: FormErrors = {};

    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setField(field: keyof IBuyer, value: string): void {
        if (field === 'payment') {
            this.payment = value as TPayment;
        } else {
            this[field] = value;
        }

        if (field === "payment" || field === "address") {
            this.validateOrder();
        } else if (field === "email" || field === "phone") {
            this.validateContacts();
        }
    }

    getUserData(): IBuyer {
        return {
            payment: this.payment as TPayment,
            address: this.address,
            email: this.email,
            phone: this.phone,
        };
    }

    clear(): void {
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
        this.formErrors = {};
    }

    validateOrder(): boolean {
        const errors: FormErrors = {};

        if (!this.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }
        if (!this.address.trim()) {
            errors.address = 'Необходимо указать адрес доставки';
        }

        this.formErrors = {...this.formErrors, ...errors};
        
        if(this.payment) delete this.formErrors.payment;
        if(this.address.trim()) delete this.formErrors.address;

        this.events.emit('orderForm:errors', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validateContacts(): boolean {
        const errors: FormErrors = {};

        if (!this.email.trim()) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.phone.trim()) {
            errors.phone = 'Необходимо указать номер телефона';
        }
        this.formErrors = {...this.formErrors, ...errors};

        if(this.email.trim()) delete this.formErrors.email;
        if(this.phone.trim()) delete this.formErrors.phone;

        this.events.emit('contactsForm:errors', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}