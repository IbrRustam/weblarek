import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLButtonElement;
    protected _description: HTMLElement;

    constructor(container: HTMLElement, actions?: { onClick: () => void }) {
        super(container);

        this._close = ensureElement<HTMLButtonElement>('.order-success__close', container);
        this._description = ensureElement<HTMLElement>('.order-success__description', container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    set total(value: number) {
        this._description.textContent = `Списано ${value} синапсов`;
    }
}