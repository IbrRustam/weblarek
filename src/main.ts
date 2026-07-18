import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { LarekApi } from './components/LarekApi';
import { ProductsData } from './components/ProductsData';
import { BasketData } from './components/BasketData';
import { UserData } from './components/UserData';

import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { CatalogCard, PreviewCard, BasketCard } from './components/Card';
import { Basket } from './components/Basket';
import { OrderForm, ContactsForm } from './components/Form';
import { Success } from './components/Success';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IBuyer } from './types';

const events = new EventEmitter();

const baseApi = new Api(API_URL);
const api = new LarekApi(baseApi);

const productsData = new ProductsData();
const basketData = new BasketData();
const userData = new UserData();

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);

events.on('items:changed', () => {
    const cardsArray = productsData.products.map(item => {
        const card = new CatalogCard(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            ...item,
            image: CDN_URL + item.image
        });
    });
    page.catalog = cardsArray;
});

events.on('card:select', (item: IProduct) => {
    const cardPreview = new PreviewCard(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (basketData.has(item.id)) {
                basketData.remove(item.id);
            } else {
                basketData.add(item);
            }
            page.counter = basketData.count;
            cardPreview.isOrdered = basketData.has(item.id);
        }
    });

    modal.render({
        content: cardPreview.render({
            ...item,
            image: CDN_URL + item.image,
            isOrdered: basketData.has(item.id)
        })
    });
});

events.on('basket:open', () => {
    const basketItems = basketData.items.map((item, index) => {
        const basketCard = new BasketCard(cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                basketData.remove(item.id);
                page.counter = basketData.count;
                events.emit('basket:open');
            }
        });
        return basketCard.render({
            title: item.title,
            price: item.price,
            index: index + 1
        });
    });

    modal.render({
        content: basketView.render({
            items: basketItems,
            total: basketData.total
        })
    });
});

events.on('order:open', () => {
    userData.clear();
    orderForm.clear();
    
    modal.render({
        content: orderForm.render({
            valid: false,
            errors: []
        })
    });
});

events.on<{ field: keyof IBuyer; value: string }>('order.payment:change', (data) => {
    userData.setField(data.field, data.value);
    orderForm.payment = userData.payment || '';
    validateOrderStep();
});

events.on<{ field: keyof IBuyer; value: string }>('order.address:change', (data) => {
    userData.setField(data.field, data.value);
    validateOrderStep();
});

function validateOrderStep() {
    const errors = userData.validate();
    orderForm.valid = !errors.payment && !errors.address;
    
    orderForm.errors = [errors.payment, errors.address].filter(Boolean) as string[];
}

events.on('order:submit', () => {
    contactsForm.clear();
    modal.render({
        content: contactsForm.render({
            valid: false,
            errors: []
        })
    });
});

events.on<{ field: keyof IBuyer; value: string }>('contacts.email:change', (data) => {
    userData.setField(data.field, data.value);
    validateContactsStep();
});

events.on<{ field: keyof IBuyer; value: string }>('contacts.phone:change', (data) => {
    userData.setField(data.field, data.value);
    validateContactsStep();
});

function validateContactsStep() {
    const errors = userData.validate();
    contactsForm.valid = !errors.email && !errors.phone;
    
    contactsForm.errors = [errors.email, errors.phone].filter(Boolean) as string[];
}

events.on('contacts:submit', () => {
    const finalOrder = {
        ...userData.getUserData(),
        items: basketData.items.map(item => item.id),
        total: basketData.total
    };

    contactsForm.valid = false;

    api.createOrder(finalOrder)
        .then((result) => {
            const successView = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                }
            });

            modal.render({
                content: successView.render({
                    total: result.total
                })
            });

            basketData.clear();
            userData.clear();
            page.counter = basketData.count;
        })
        .catch((error) => {
            console.error('Ошибка при оформлении заказа:', error);
            contactsForm.errors = ['Ошибка сервера. Попробуйте отправить форму ещё раз.'];
            contactsForm.valid = true;
        });
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

api.getProductList()
    .then((data) => {
        productsData.setProducts(data.items);
        events.emit('items:changed');
    })
    .catch((error) => {
        console.error('Не удалось загрузить товары с сервера:', error);
    });