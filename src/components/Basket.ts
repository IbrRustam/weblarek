import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/Events';

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        this._button.addEventListener('click', () => {
            this.events.emit('order:open');
        });

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length > 0) {
            this._list.replaceChildren(...items);
            this._button.removeAttribute('disabled'); 
        } else {
            const placeholder = document.createElement('p');
            placeholder.textContent = 'Корзина пуста';
            placeholder.className = 'basket__text'; 
            this._list.replaceChildren(placeholder);
            this._button.setAttribute('disabled', 'disabled');
        }
    }

    set total(value: number) {
        this._total.textContent = `${value} синапсов`;
    }
}