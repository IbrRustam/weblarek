import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { ProductsData } from './components/ProductsData';
import { BasketData } from './components/BasketData';
import { UserData } from './components/UserData';
import { API_URL } from './utils/constants';
import { IProduct } from './types';

const events = new EventEmitter();
const baseApi = new Api(API_URL);
const larekApi = new LarekApi(baseApi);

const productsData = new ProductsData(events);
const basketData = new BasketData(events);
const userData = new UserData(events);

events.on('products:changed', (data) => {
    console.log('Событие [products:changed] вызвано. Данные в модели обновлены:', data);
});

events.on('basket:changed', (data) => {
    console.log('Событие [basket:changed] вызвано. Текущее состояние корзины:', data);
});

events.on('orderForm:errors', (errors) => {
    console.log('Событие [orderForm:errors] вызвано. Ошибки формы заказа:', errors);
});

events.on('contactsForm:errors', (errors) => {
    console.log('Событие [contactsForm:errors] вызвано. Ошибки формы контактов:', errors);
});


const testProduct: IProduct = {
    id: 'test-id-123',
    description: 'Прекрасный тестовый товар для проверки архитектуры',
    image: 'test.jpg',
    title: 'Тестовый Скрипт',
    category: 'другое',
    price: 450
};

productsData.setProducts([testProduct]);

console.log('Список товаров из модели:', productsData.products);

console.log('Поиск товара по ID "test-id-123":', productsData.getProduct('test-id-123'));


basketData.add(testProduct);
console.log('Содержимое корзины (items):', basketData.items);
console.log('Количество (count):', basketData.count);
console.log('Итоговая стоимость (total):', basketData.total);
console.log('Проверка наличия по ID "test-id-123":', basketData.has('test-id-123'));


basketData.remove('test-id-123');
console.log('После удаления товара - количество:', basketData.count, 'Товары:', basketData.items);


userData.setField('payment', 'card');
userData.setField('address', 'г. Кокшетау, ул. Абая, д. 10');
console.log('Данные формы заказа:', userData.getUserData());
console.log('Ошибки первой формы (должны отсутствовать):', userData.formErrors);


userData.setField('email', '');
console.log('Ошибки после некорректного email:', userData.formErrors);


userData.clear();
console.log('Данные пользователя после вызова метода clear():', userData.getUserData());


larekApi.getProductList()
    .then((response) => {
        console.log('%cДанные успешно получены с сервера!', 'color: #00ff00;');
        console.log('Полученный с сервера объект:', response);         
        productsData.setProducts(response.items);        
        console.log('Товары в модели ProductsData после загрузки:', productsData.products);
    })
    .catch((error) => {
        console.error('%cОшибка при запросе к серверу:', 'color: #ff0000;', error);
    });