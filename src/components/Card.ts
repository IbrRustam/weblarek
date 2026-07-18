import { Component } from './base/Component';
import { IProduct } from '../types';
import { ensureElement } from '../utils/utils';
import { categoryMap } from '../utils/constants';

export class Card<T> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _priceValue: number | null = null;

    constructor(container: HTMLElement) {
        super(container);
        
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set price(value: number | null) {
        this._priceValue = value;
        this._price.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
    }

    get price(): number | null {
        return this._priceValue;
    }
}

export class CatalogCard extends Card<IProduct> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, actions?: { onClick: () => void }) {
        super(container);

        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
    }

    set category(value: string) {
        this._category.textContent = value;
        const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this._category.className = `card__category ${categoryClass}`;
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }
}

interface IPreviewCard extends IProduct {
    isOrdered: boolean;
}

export class PreviewCard extends Card<IPreviewCard> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    protected _text: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _isOrdered: boolean = false;

    constructor(container: HTMLElement, actions?: { onClick: () => void }) {
        super(container);

        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._text = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set category(value: string) {
        this._category.textContent = value;
        const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this._category.className = `card__category ${categoryClass}`;
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set description(value: string) {
        this._text.textContent = value;
    }

    set isOrdered(value: boolean) {
        this._isOrdered = value;
        this.updateButtonState();
    }

    protected updateButtonState() {
        if (this.price === null) {
            this._button.textContent = 'Недоступно';
            this._button.disabled = true;
        } else if (this._isOrdered) {
            this._button.textContent = 'Удалить из корзины';
            this._button.disabled = false;
        } else {
            this._button.textContent = 'В корзину';
            this._button.disabled = false;
        }
    }
}

interface IBasketCard extends IProduct {
    index: number;
}

export class BasketCard extends Card<IBasketCard> {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: { onClick: () => void }) {
        super(container);

        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        if (actions?.onClick) {
            this._deleteButton.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number) {
        this._index.textContent = String(value);
    }
}