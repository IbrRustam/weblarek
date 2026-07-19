import { Component } from './base/Component'; 
import { IEvents } from './base/Events'; 
import { ensureElement } from '../utils/utils'; 

interface IFormState { 
    valid: boolean; 
    errors: string[]; 
} 

export class Form<T> extends Component<IFormState> { 
    protected _submit: HTMLButtonElement; 
    protected _errors: HTMLElement; 

    constructor(protected container: HTMLFormElement, protected events: IEvents) { 
        super(container); 
        this._submit = ensureElement<HTMLButtonElement>('button[type="submit"]', container); 
        this._errors = ensureElement<HTMLElement>('.form__errors', container); 
        
        this.container.addEventListener('input', (e: Event) => { 
            const target = e.target as HTMLInputElement; 
            const field = target.name as keyof T; 
            const value = target.value; 
            this.events.emit(`${this.container.name}.${String(field)}:change`, { 
                field, 
                value 
            }); 
        }); 
        
        this.container.addEventListener('submit', (e: Event) => { 
            e.preventDefault(); 
            this.events.emit(`${this.container.name}:submit`); 
        }); 
    } 

    set valid(value: boolean) { 
        this._submit.disabled = !value;
    } 

    set errors(value: string[]) { 
        this._errors.textContent = value.filter(Boolean).join(', '); 
    } 
} 

export interface IOrderForm { 
    payment: string; 
    address: string; 
} 

export class OrderForm extends Form<IOrderForm> { 
    protected _buttons: HTMLButtonElement[]; 
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) { 
        super(container, events); 
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this._buttons = Array.from(container.querySelectorAll('.button_alt')); 
        
        this._buttons.forEach(button => { 
            button.addEventListener('click', () => { 
                const name = button.name; 
                this.events.emit('order.payment:change', { 
                    field: 'payment', 
                    value: name 
                }); 
            }); 
        }); 
    } 

    set payment(value: string) { 
        this._buttons.forEach(button => { 
            if (button.name === value) { 
                button.classList.add('button_alt-active'); 
            } else { 
                button.classList.remove('button_alt-active'); 
            } 
        }); 
    } 

    set address(value: string) { 
        this._addressInput.value = value; 
    } 
} 

export interface IContactsForm { 
    email: string; 
    phone: string; 
} 

export class ContactsForm extends Form<IContactsForm> { 
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) { 
        super(container, events); 
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
    } 

    set email(value: string) { 
        this._emailInput.value = value; 
    } 

    set phone(value: string) { 
        this._phoneInput.value = value; 
    } 
}