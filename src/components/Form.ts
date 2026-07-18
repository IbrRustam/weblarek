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
        if (value) this._submit.removeAttribute('disabled');
        else this._submit.setAttribute('disabled', 'disabled');
    }

    set errors(value: string[]) {
        this._errors.textContent = value.filter(Boolean).join(', ');
    }

    clear() {
        this.container.reset();
    }
}

export interface IOrderForm {
    payment: string;
    address: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected _buttons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

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
        const input = this.container.elements.namedItem('address') as HTMLInputElement;
        if (input) input.value = value;
    }
}

export interface IContactsForm {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set email(value: string) {
        const input = this.container.elements.namedItem('email') as HTMLInputElement;
        if (input) input.value = value;
    }

    set phone(value: string) {
        const input = this.container.elements.namedItem('phone') as HTMLInputElement;
        if (input) input.value = value;
    }
}