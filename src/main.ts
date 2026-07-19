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

const productsData = new ProductsData(events); 
const basketData = new BasketData(events); 
const userData = new UserData(events);

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

const cardPreview = new PreviewCard(cloneTemplate(cardPreviewTemplate), {
    onClick: () => events.emit('card:preview-toggle')
});

const successView = new Success(cloneTemplate(successTemplate), {
    onClick: () => events.emit('success:close')
});

let currentPreviewItem: IProduct | null = null;

events.on('items:changed', () => { 
    page.catalog = productsData.products.map(item => { 
        const card = new CatalogCard(cloneTemplate(cardCatalogTemplate), { 
            onClick: () => events.emit('card:select', item) 
        }); 
        return card.render(item); 
    }); 
}); 

events.on('card:select', (item: IProduct) => { 
    currentPreviewItem = item;
    events.emit('preview:changed', item);
}); 

events.on('preview:changed', (item: IProduct) => {
    modal.render({ 
        content: cardPreview.render({ 
            ...item, 
            isOrdered: basketData.has(item.id) 
        }) 
    }); 
});

events.on('card:preview-toggle', () => {
    if (!currentPreviewItem) return;
    
    if (basketData.has(currentPreviewItem.id)) { 
        basketData.remove(currentPreviewItem.id); 
    } else { 
        basketData.add(currentPreviewItem); 
    } 
    modal.close();
    events.emit('basket:changed');
});

events.on('basket:open', () => { 
    modal.render({ 
        content: basketView.render()
    }); 
    events.emit('basket:changed');
}); 

events.on('basket:changed', () => {
    page.counter = basketData.count; 
    
    const basketItems = basketData.items.map((item, index) => { 
        const basketCard = new BasketCard(cloneTemplate(cardBasketTemplate), { 
            onClick: () => events.emit('basket:delete-item', item)
        }); 
        return basketCard.render({ 
            title: item.title, 
            price: item.price, 
            index: index + 1 
        }); 
    }); 

    basketView.render({ 
        items: basketItems, 
        total: basketData.total 
    });
});

events.on('basket:delete-item', (item: IProduct) => {
    basketData.remove(item.id);
    events.emit('basket:changed');
});

events.on('order:open', () => { 
    modal.render({ 
        content: orderForm.render({ 
            valid: false, 
            errors: [] 
        }) 
    }); 
    events.emit('buyer:changed');
}); 

events.on<{ field: keyof IBuyer; value: string }>('order.payment:change', (data) => { 
    userData.setField(data.field, data.value); 
}); 

events.on<{ field: keyof IBuyer; value: string }>('order.address:change', (data) => { 
    userData.setField(data.field, data.value); 
}); 

events.on('order:submit', () => { 
    modal.render({ 
        content: contactsForm.render({ 
            valid: false, 
            errors: [] 
        }) 
    }); 
    events.emit('buyer:changed');
}); 

events.on<{ field: keyof IBuyer; value: string }>('contacts.email:change', (data) => { 
    userData.setField(data.field, data.value); 
}); 

events.on<{ field: keyof IBuyer; value: string }>('contacts.phone:change', (data) => { 
    userData.setField(data.field, data.value); 
}); 

events.on('buyer:changed', () => {
    const errors = userData.validate(); 
    
    orderForm.payment = userData.payment || '';
    orderForm.address = userData.address || '';
    orderForm.valid = !errors.payment && !errors.address; 
    orderForm.errors = [errors.payment, errors.address].filter(Boolean) as string[]; 

    contactsForm.email = userData.email || '';
    contactsForm.phone = userData.phone || '';
    contactsForm.valid = !errors.email && !errors.phone; 
    contactsForm.errors = [errors.email, errors.phone].filter(Boolean) as string[];
});

events.on('contacts:submit', () => { 
    const finalOrder = { 
        payment: userData.payment,
        address: userData.address,
        email: userData.email,
        phone: userData.phone,
        items: basketData.items.map(item => item.id), 
        total: basketData.total 
    }; 
    
    contactsForm.valid = false; 
    
    api.createOrder(finalOrder) 
        .then((result) => { 
            modal.render({ 
                content: successView.render({ 
                    total: result.total 
                }) 
            }); 
            basketData.clear(); 
            userData.clear(); 
            events.emit('basket:changed');
        }) 
        .catch((error) => { 
            console.error('Ошибка при оформлении заказа:', error); 
            contactsForm.errors = ['Ошибка сервера. Попробуйте отправить форму ещё раз.']; 
            contactsForm.valid = true; 
        }); 
}); 

events.on('success:close', () => {
    modal.close();
});

events.on('modal:open', () => { 
    page.locked = true; 
}); 
events.on('modal:close', () => { 
    page.locked = false; 
}); 

api.getProductList() 
    .then((data) => { 
        const preparedProducts = data.items.map(item => ({
            ...item,
            image: CDN_URL + item.image
        }));
        productsData.setProducts(preparedProducts); 
    }) 
    .catch((error) => { 
        console.error('Не удалось загрузить товары с сервера:', error); 
    });