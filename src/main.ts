import './scss/styles.scss';
import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { ProductsData } from './components/ProductsData';
import { BasketData } from './components/BasketData';
import { UserData } from './components/UserData';
import { API_URL } from './utils/constants';

const baseApi = new Api(API_URL);
const larekApi = new LarekApi(baseApi);

const productsData = new ProductsData();
const basketData = new BasketData();
const userData = new UserData();

larekApi.getProductList()
    .then((res) => {
        console.log('=== ТЕСТИРОВАНИЕ ProductsData ===');
        
         productsData.setProducts(res.items);
        console.log('Товары успешно сохранены в модель. Список товаров:', productsData.products);

        if (productsData.products.length > 0) {
            const testProduct = productsData.products[0]; 

            const foundProduct = productsData.getProduct(testProduct.id);
            console.log(`Получение товара по ID (${testProduct.id}):`, foundProduct);

            productsData.setPreview(testProduct);
            console.log('Установлен товар в превью:', productsData.getPreview());
            
            productsData.setPreview(null);
            console.log('Превью успешно очищено:', productsData.getPreview());


            console.log('\n=== ТЕСТИРОВАНИЕ BasketData ===');
            
            console.log('Начальное состояние корзины -> Количество:', basketData.count, 'Сумма:', basketData.total);

            basketData.add(testProduct);
            console.log('Товар добавлен в корзину. Количество:', basketData.count, 'Товары в корзине:', basketData.items);
            console.log('Проверка метода has (ожидается true):', basketData.has(testProduct.id));
            console.log('Текущая общая стоимость корзины:', basketData.total);

            basketData.add(testProduct);
            console.log('Попытка добавить дубликат. Количество элементов (не должно измениться):', basketData.count);

            basketData.remove(testProduct.id);
            console.log('Товар удален из корзины. Количество:', basketData.count, 'Товары в корзине:', [...basketData.items]);
            console.log('Проверка метода has после удаления (ожидается false):', basketData.has(testProduct.id));

            basketData.add(testProduct);
            console.log('Товар добавлен снова для теста очистки. Количество перед очисткой:', basketData.count);
            
            basketData.clear();
            console.log('Вызван метод basketData.clear(). Состояние после очистки -> Количество:', basketData.count, 'Товары:', basketData.items);
        } else {
            console.log('Внимание: Сервер вернул пустой список товаров. Тестирование корзины невозможно.');
        }


        console.log('\n=== ТЕСТИРОВАНИЕ UserData ===');

        userData.setField('payment', 'card');
        userData.setField('address', 'г. Кокшетау, ул. Абая, д. 102, кв. 45');
        userData.setField('email', 'buyer@example.com');
        userData.setField('phone', '+77771112233');

        console.log('Данные пользователя успешно установлены:', userData.getUserData());
        
        console.log('Явный вызов validate() для корректных данных (ожидается пустой объект ошибок):', userData.validate());

       userData.setField('email', '');
        userData.setField('address', '');
        
        const validationErrors = userData.validate();
        console.log('Явный вызов validate() после удаления email и адреса (ожидаются ошибки):', validationErrors);
        console.log('Проверка сохраненного объекта ошибок через геттер formErrors:', userData.formErrors);

        userData.clear();
        console.log('Вызван метод clear() для пользователя. Текущие данные:', userData.getUserData());
    })
    .catch((err) => {
        console.error('Произошла ошибка при выполнении запроса или тестировании модулей:', err);
    });