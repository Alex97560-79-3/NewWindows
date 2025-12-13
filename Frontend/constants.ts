
import { Category, Product, Order, Review, UserRole, User } from './types';

export const ROLE_TRANSLATIONS: Record<string, string> = {
    [UserRole.client]: 'Клиент',
    [UserRole.admin]: 'Администратор',
    [UserRole.assembler]: 'Сборщик',
    [UserRole.manager]: 'Менеджер'
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
        password_hash: "123",
        name: "Администратор",
        role: UserRole.admin,
        avatar_url: "https://i.pravatar.cc/150?u=admin"
    },
    {
        id: 2,
        email: "assembler@newwindows.com",
        password_hash: "123",
        name: "Сборщик Алексей",
        role: UserRole.assembler,
        avatar_url: "https://i.pravatar.cc/150?u=assembler"
    },
    {
        id: 3,
        email: "client@newwindows.com",
        password_hash: "123",
        name: "Иван Клиент",
        role: UserRole.client,
        avatar_url: "https://i.pravatar.cc/150?u=client"
    },
    {
        id: 4,
        email: "manager@newwindows.com",
        password_hash: "123",
        name: "Елена Менеджер",
        role: UserRole.manager,
        avatar_url: "https://i.pravatar.cc/150?u=manager"
    },
    {
        id: 5,
        email: "dmitry@example.com",
        password_hash: "123",
        name: "Дмитрий С.",
        role: UserRole.client,
        avatar_url: "https://i.pravatar.cc/150?u=dmitry"
    },
    {
        id: 6,
        email: "olga@example.com",
        password_hash: "123",
        name: "Ольга К.",
        role: UserRole.client,
        avatar_url: "https://i.pravatar.cc/150?u=olga"
    },
    {
        id: 7,
        email: "sergey@example.com",
        password_hash: "123",
        name: "Сергей В.",
        role: UserRole.client,
        avatar_url: "https://i.pravatar.cc/150?u=sergey"
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
        category_id: 1,
        name: "Окно ПВХ Rehau Blitz одностворчатое поворотное",
        description: "Энергоэффективное виниловое окно классического дизайна. Идеально подходит для традиционных домов.",
        base_price: 5600,
        discount: 55,
        width: 600,
        height: 900,
        frameMaterial: "ПВХ",
        glassType: "Двойной стеклопакет",
        chambersCount: 3,
        imageUrl: 'https://picsum.photos/400/400?random=1',
        rating: 4.8,
        reviewCount: 0,
        isOriginal: true,
        isSale: true,
        deliveryTime: "Завтра",
        article: 140501
    },
    {
        id: 2,
        category_id: 2,
        name: "Окно Деревянное Дуб Премиум 2-х створчатое",
        description: "Элегантное окно из деревянного профиля, обеспечивающее отличную вентиляцию и панорамный вид.",
        base_price: 25400,
        discount: 20,
        width: 1200,
        height: 1400,
        frameMaterial: "Дерево (Дуб)",
        glassType: "Тройной стеклопакет",
        chambersCount: 5,
        imageUrl: 'https://picsum.photos/400/400?random=2',
        rating: 4.9,
        reviewCount: 0,
        isOriginal: true,
        deliveryTime: "До 5 дней",
        article: 200342
    },
    {
        id: 3,
        category_id: 3,
        name: "Раздвижная система Alutech C48",
        description: "Изящное раздвижное окно из алюминиевого профиля, идеально для современной архитектуры.",
        base_price: 18900,
        width: 2000,
        height: 1500,
        frameMaterial: "Алюминий",
        glassType: "Закаленный двойной пакет",
        chambersCount: 4,
        imageUrl: 'https://picsum.photos/400/400?random=3',
        rating: 4.5,
        reviewCount: 0,
        isOriginal: true,
        deliveryTime: "До 3 дней",
        article: 304911
    },
    {
        id: 4,
        category_id: 1,
        name: "Балконный блок Veka Softline",
        description: "Высокоэффективное ПВХ окно, разработанное для максимальной теплоизоляции.",
        base_price: 15600,
        discount: 44,
        width: 1500,
        height: 2100,
        frameMaterial: "Усиленный ПВХ",
        glassType: "Тройной пакет",
        chambersCount: 6,
        imageUrl: 'https://picsum.photos/400/400?random=4',
        rating: 4.7,
        reviewCount: 0,
        isSale: true,
        deliveryTime: "Завтра",
        article: 110998
    },
    {
        id: 5,
        category_id: 2,
        name: "Глухое окно KBE Engine 58мм",
        description: "Глухое окно в индустриальном стиле с декоративной раскладкой.",
        base_price: 3200,
        discount: 28,
        width: 500,
        height: 500,
        frameMaterial: "ПВХ",
        glassType: "Прозрачный двойной пакет",
        chambersCount: 3,
        imageUrl: 'https://picsum.photos/400/400?random=5',
        rating: 4.6,
        reviewCount: 0,
        isOriginal: true,
        isSale: true,
        deliveryTime: "Сегодня",
        article: 150222
    },
     {
        id: 6,
        category_id: 5,
        name: "Москитная сетка рамочная (Стандарт)",
        description: "Защита от насекомых.",
        base_price: 850,
        discount: 30,
        width: 600,
        height: 1300,
        frameMaterial: "Алюминий",
        glassType: "Сетка",
        chambersCount: 0,
        imageUrl: 'https://picsum.photos/400/400?random=6',
        rating: 4.9,
        reviewCount: 0,
        isSale: true,
        deliveryTime: "Завтра",
        article: 500101
    },
    {
        id: 7,
        category_id: 6,
        name: "Монтаж 'Под ключ'",
        description: "Полный комплекс работ по установке окна.",
        base_price: 3500,
        discount: 12,
        width: 0,
        height: 0,
        frameMaterial: "Сервис",
        glassType: "Нет",
        chambersCount: 0,
        imageUrl: 'https://picsum.photos/400/400?random=7',
        rating: 4.8,
        reviewCount: 0,
        isSale: false,
        deliveryTime: "По записи",
        article: 600777
    },
    {
        id: 8,
        category_id: 7,
        name: "Подоконник ПВХ Белый 200мм",
        description: "Прочный пластиковый подоконник, устойчивый к царапинам.",
        base_price: 600,
        discount: 25,
        width: 200,
        height: 1500,
        frameMaterial: "ПВХ",
        glassType: "Нет",
        chambersCount: 0,
        imageUrl: 'https://picsum.photos/400/400?random=8',
        rating: 4.7,
        reviewCount: 0,
        isSale: true,
        deliveryTime: "Завтра",
        article: 700200
    },
    {
        id: 9,
        category_id: 8,
        name: "Наличник ПВХ 80мм",
        description: "Финишная отделка оконного проема, скрывает монтажный шов.",
        base_price: 150,
        width: 80,
        height: 2200,
        frameMaterial: "ПВХ",
        glassType: "Нет",
        chambersCount: 0,
        imageUrl: 'https://picsum.photos/400/400?random=9',
        rating: 4.5,
        reviewCount: 0,
        isSale: false,
        deliveryTime: "Завтра",
        article: 800101
    },
    {
        id: 10,
        category_id: 9,
        name: "Анкерная пластина 150мм",
        description: "Усиленная пластина для крепления оконных рам.",
        base_price: 25,
        width: 30,
        height: 150,
        frameMaterial: "Сталь",
        glassType: "Нет",
        chambersCount: 0,
        imageUrl: 'https://picsum.photos/400/400?random=10',
        rating: 5.0,
        reviewCount: 0,
        isSale: false,
        deliveryTime: "Сегодня",
        article: 900505
    },
    {
        id: 11,
        category_id: 10,
        name: "Монтажная пена Profi 65L",
        description: "Профессиональная зимняя монтажная пена с низким расширением.",
        base_price: 650,
        discount: 18,
        width: 0,
        height: 0,
        frameMaterial: "Химия",
        glassType: "Нет",
        chambersCount: 0,
        imageUrl: 'https://picsum.photos/400/400?random=11',
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
