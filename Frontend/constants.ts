
import { Category, Product, Order, Review, UserRole, User } from './types';
import product1 from './img/product/product1.png';
import product2 from './img/product/product2.webp';
import product3 from './img/product/product3.jpg';
import product4 from './img/product/product4.jpg';
import product5 from './img/product/product5.jpg';
import product6 from './img/product/product6.jpg';
import product7 from './img/product/product7.jpg';
import product8 from './img/product/product8.jpg';
import product9 from './img/product/product9.jpg';
import product10 from './img/product/product10.jpg';
import product11 from './img/product/product11.jpg';

export const ROLE_TRANSLATIONS: Record<UserRole, string> = {
    [UserRole.GUEST]: 'Гость',
    [UserRole.CLIENT]: 'Клиент',
    [UserRole.ADMIN]: 'Администратор',
    [UserRole.ASSEMBLER]: 'Сборщик',
    [UserRole.MANAGER]: 'Менеджер'
};

export const STATUS_TRANSLATIONS: Record<string, string> = {
    'Pending': 'Ожидает',
    'Processing': 'В работе',
    'Completed': 'Выполнен',
    'Cancelled': 'Отменен'
};

export const ACCEPTANCE_TRANSLATIONS: Record<string, string> = {
    'Pending': 'Ожидает',
    'Accepted': 'Принят',
    'Rejected': 'Отклонен'
};

export const MOCK_USERS: User[] = [
    {
        id: 1,
        email: "admin@newwindows.com",
        password: "123",
        name: "Администратор",
        role: UserRole.ADMIN,
        avatarUrl: "https://i.pravatar.cc/150?u=admin"
    },
    {
        id: 2,
        email: "assembler@newwindows.com",
        password: "123",
        name: "Сборщик Алексей",
        role: UserRole.ASSEMBLER,
        avatarUrl: "https://i.pravatar.cc/150?u=assembler"
    },
    {
        id: 3,
        email: "client@newwindows.com",
        password: "123",
        name: "Иван Клиент",
        role: UserRole.CLIENT,
        avatarUrl: "https://i.pravatar.cc/150?u=client"
    },
    {
        id: 4,
        email: "manager@newwindows.com",
        password: "123",
        name: "Елена Менеджер",
        role: UserRole.MANAGER,
        avatarUrl: "https://i.pravatar.cc/150?u=manager"
    },
    {
        id: 5,
        email: "dmitry@example.com",
        password: "123",
        name: "Дмитрий С.",
        role: UserRole.CLIENT,
        avatarUrl: "https://i.pravatar.cc/150?u=dmitry"
    },
    {
        id: 6,
        email: "olga@example.com",
        password: "123",
        name: "Ольга К.",
        role: UserRole.CLIENT,
        avatarUrl: "https://i.pravatar.cc/150?u=olga"
    },
    {
        id: 7,
        email: "sergey@example.com",
        password: "123",
        name: "Сергей В.",
        role: UserRole.CLIENT,
        avatarUrl: "https://i.pravatar.cc/150?u=sergey"
    }
];

export const CATEGORIES: Category[] = [
    { id: 1, name: "Пластиковые окна", description: "Классические вертикально-сдвижные окна." },
    { id: 2, name: "Деревянные окна", description: "Окна с боковыми петлями, открывающиеся наружу." },
    { id: 3, name: "Алюминиевые окна", description: "Горизонтально-раздвижные окна для широких проемов." },
    { id: 4, name: "Фурнитура", description: "Ручки, замки и механизмы для окон." },
    { id: 5, name: "Москитные сетки", description: "Защита от насекомых для любых типов окон." },
    { id: 6, name: "Монтаж", description: "Материалы и наборы для профессионального монтажа." },
    { id: 7, name: "Подоконники", description: "Пластиковые, деревянные и каменные подоконники." },
    { id: 8, name: "Наличники", description: "Декоративное оформление оконного проема." },
    { id: 9, name: "Крепежные изделия", description: "Анкеры, саморезы и пластины." },
    { id: 10, name: "Расходные материалы", description: "Пены, герметики и очистители." },
];

export const PRODUCTS: Product[] = [
    {
        id: 1,
        categoryId: 1,
        name: "Окно ПВХ Rehau Blitz одностворчатое поворотное",
        description: "Энергоэффективное виниловое окно классического дизайна. Идеально подходит для традиционных домов.",
        basePrice: 5600,
        oldPrice: 12500,
        discount: 55,
        width: 600,
        height: 900,
        frameMaterial: "ПВХ",
        glassType: "Двойной стеклопакет",
        chambersCount: 3,
        imageUrl: product1,
        rating: 4.8,
        reviewCount: 0,
        isOriginal: true,
        isSale: true,
        deliveryTime: "Завтра",
        article: 140501
    },
    {
        id: 2,
        categoryId: 2,
        name: "Окно Деревянное Дуб Премиум 2-х створчатое",
        description: "Элегантное окно из деревянного профиля, обеспечивающее отличную вентиляцию и панорамный вид.",
        basePrice: 25400,
        oldPrice: 32000,
        discount: 20,
        width: 1200,
        height: 1400,
        frameMaterial: "Дерево (Дуб)",
        glassType: "Тройной стеклопакет",
        chambersCount: 5,
        imageUrl: product2,
        rating: 4.9,
        reviewCount: 0,
        isOriginal: true,
        deliveryTime: "До 5 дней",
        article: 200342
    },
    {
        id: 3,
        categoryId: 3,
        name: "Раздвижная система Alutech C48",
        description: "Изящное раздвижное окно из алюминиевого профиля, идеально для современной архитектуры.",
        basePrice: 18900,
        width: 2000,
        height: 1500,
        frameMaterial: "Алюминий",
        glassType: "Закаленный двойной пакет",
        chambersCount: 4,
        imageUrl: product3,
        rating: 4.5,
        reviewCount: 0,
        isOriginal: true,
        deliveryTime: "До 3 дней",
        article: 304911
    },
    {
        id: 4,
        categoryId: 1,
        name: "Балконный блок Veka Softline",
        description: "Высокоэффективное ПВХ окно, разработанное для максимальной теплоизоляции.",
        basePrice: 15600,
        oldPrice: 28000,
        discount: 44,
        width: 1500,
        height: 2100,
        frameMaterial: "Усиленный ПВХ",
        glassType: "Тройной пакет",
        chambersCount: 6,
        imageUrl: product4,
        rating: 4.7,
        reviewCount: 0,
        isSale: true,
        deliveryTime: "Завтра",
        article: 110998
    },
    {
        id: 5,
        categoryId: 2,
        name: "Глухое окно KBE Engine 58мм",
        description: "Глухое окно в индустриальном стиле с декоративной раскладкой.",
        basePrice: 3200,
        oldPrice: 4500,
        discount: 28,
        width: 500,
        height: 500,
        frameMaterial: "ПВХ",
        glassType: "Прозрачный двойной пакет",
        chambersCount: 3,
        imageUrl: product5,
        rating: 4.6,
        reviewCount: 0,
        isOriginal: true,
        isSale: true,
        deliveryTime: "Сегодня",
        article: 150222
    },
     {
        id: 6,
        categoryId: 5,
        name: "Москитная сетка рамочная (Стандарт)",
        description: "Защита от насекомых.",
        basePrice: 850,
        oldPrice: 1200,
        discount: 30,
        width: 600,
        height: 1300,
        frameMaterial: "Алюминий",
        glassType: "Сетка",
        chambersCount: 0,
        imageUrl: product6,
        rating: 4.9,
        reviewCount: 0,
        isSale: true,
        deliveryTime: "Завтра",
        article: 500101
    },
    {
        id: 7,
        categoryId: 6,
        name: "Монтаж 'Под ключ'",
        description: "Полный комплекс работ по установке окна.",
        basePrice: 3500,
        oldPrice: 4000,
        discount: 12,
        width: 0,
        height: 0,
        frameMaterial: "Сервис",
        glassType: "Нет",
        chambersCount: 0,
        imageUrl: product7,
        rating: 4.8,
        reviewCount: 0,
        isSale: false,
        deliveryTime: "По записи",
        article: 600777
    },
    {
        id: 8,
        categoryId: 7,
        name: "Подоконник ПВХ Белый 200мм",
        description: "Прочный пластиковый подоконник, устойчивый к царапинам.",
        basePrice: 600,
        oldPrice: 800,
        discount: 25,
        width: 200,
        height: 1500,
        frameMaterial: "ПВХ",
        glassType: "Нет",
        chambersCount: 0,
        imageUrl: product8,
        rating: 4.7,
        reviewCount: 0,
        isSale: true,
        deliveryTime: "Завтра",
        article: 700200
    },
    {
        id: 9,
        categoryId: 8,
        name: "Наличник ПВХ 80мм",
        description: "Финишная отделка оконного проема, скрывает монтажный шов.",
        basePrice: 150,
        width: 80,
        height: 2200,
        frameMaterial: "ПВХ",
        glassType: "Нет",
        chambersCount: 0,
        imageUrl: product9,
        rating: 4.5,
        reviewCount: 0,
        isSale: false,
        deliveryTime: "Завтра",
        article: 800101
    },
    {
        id: 10,
        categoryId: 9,
        name: "Анкерная пластина 150мм",
        description: "Усиленная пластина для крепления оконных рам.",
        basePrice: 25,
        width: 30,
        height: 150,
        frameMaterial: "Сталь",
        glassType: "Нет",
        chambersCount: 0,
        imageUrl: product10,
        rating: 5.0,
        reviewCount: 0,
        isSale: false,
        deliveryTime: "Сегодня",
        article: 900505
    },
    {
        id: 11,
        categoryId: 10,
        name: "Монтажная пена Profi 65L",
        description: "Профессиональная зимняя монтажная пена с низким расширением.",
        basePrice: 650,
        oldPrice: 800,
        discount: 18,
        width: 0,
        height: 0,
        frameMaterial: "Химия",
        glassType: "Нет",
        chambersCount: 0,
        imageUrl: product11,
        rating: 4.9,
        reviewCount: 0,
        isSale: true,
        deliveryTime: "Сегодня",
        article: 100999
    }
];

export const REVIEWS: Review[] = [
    { id: 1, productId: 1, authorName: "Дмитрий С.", rating: 5, text: "Отличное соотношение цены и качества. Легко установили.", createdAt: "2025-01-15" },
    { id: 2, productId: 2, authorName: "Ольга К.", rating: 4, text: "Выглядят потрясающе, но доставка заняла время.", createdAt: "2025-02-02" },
    { id: 3, productId: 1, authorName: "Сергей В.", rating: 5, text: "Очень теплые окна, спасибо!", createdAt: "2025-03-05" },
    { id: 4, productId: 4, authorName: "Иван Клиент", rating: 5, text: "Балконный блок просто супер, стало гораздо тише.", createdAt: "2025-03-10" },
    { id: 5, productId: 6, authorName: "Дмитрий С.", rating: 4, text: "Сетка нормальная, но крепления могли быть лучше.", createdAt: "2025-04-15" },
    { id: 6, productId: 1, authorName: "Елена Менеджер", rating: 5, text: "Рекомендую всем своим клиентам, проверенный вариант.", createdAt: "2025-01-20" },
];

export const MOCK_ORDERS: Order[] = [
    {
        id: 1001,
        customerName: "Иван Клиент",
        customerPhone: "+7 999 000-01-23",
        status: 'Processing',
        totalAmount: 25000,
        createdAt: "2025-05-01 10:30",
        items: [
             { ...PRODUCTS[0], quantity: 2 },
             { ...PRODUCTS[7], quantity: 2 }
        ],
        comments: [
            { id: 1, author: "Сборщик Алексей", text: "Уточнить размеры проема у клиента", isInternal: true, createdAt: "2025-05-01 11:00" },
            { id: 2, author: "Иван Клиент", text: "Прошу доставить в первой половине дня", isInternal: false, createdAt: "2025-05-01 10:35" }
        ],
        assemblerId: 2,
        acceptanceStatus: 'Accepted',
        estimatedCompletionDate: '2025-05-05'
    },
    {
        id: 1002,
        customerName: "Ольга К.",
        customerPhone: "+7 999 000-98-76",
        status: 'Completed',
        totalAmount: 15400,
        createdAt: "2025-04-20 14:15",
        items: [
            { ...PRODUCTS[3], quantity: 1 }
        ],
        comments: []
    }
];
