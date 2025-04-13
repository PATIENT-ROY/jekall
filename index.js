
document.addEventListener('DOMContentLoaded', () => {
});
function resetPage() {
    window.location.reload(); // Или сброс полей вручную
}
// Обновление текущего года в футере
document.getElementById('year').textContent = new Date().getFullYear();

// Поиск товаров
const searchInput = document.querySelector('.search input');
const searchButton = document.getElementById('search-button'); // Получаем кнопку
const products = document.querySelectorAll('.product');
const noResultsMessage = document.getElementById('no-results-message');
const productsSection = document.getElementById('products');
const showMoreButton = document.getElementById('show-more');

if (searchInput && searchButton && productsSection) {
    // Поиск при нажатии кнопки
    searchButton.addEventListener('click', () => {
        performSearch();
    });

    // Опционально: поиск при нажатии Enter в поле ввода
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const query = searchInput.value.toLowerCase();
    let foundProducts = 0;

    if (query.trim() !== "") {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    products.forEach(product => {
        const title = product.querySelector('h2').textContent.toLowerCase();
        if (title.includes(query)) {
            product.style.display = 'block';
            foundProducts++;
        } else {
            product.style.display = 'none';
        }
    });

    noResultsMessage.style.display = foundProducts === 0 ? 'block' : 'none';
    showMoreButton.style.display = 'none';

    // Очистка поля ввода после выполнения поиска
    searchInput.value = '';
}


// Смена изображений при наведении
document.querySelectorAll('.main-image').forEach(img => {
    try {
        // Проверяем наличие data-images
        if (!img.dataset.images) {
            console.error('Атрибут data-images отсутствует у элемента:', img);
            return;
        }

        const images = JSON.parse(img.dataset.images);
        
        // Проверяем, что images - массив и не пустой
        if (!Array.isArray(images) || images.length === 0) {
            console.error('Некорректный формат данных в data-images:', img.dataset.images);
            return;
        }

        let currentIndex = 0;
        let interval;

        // Предзагрузка изображений
        images.forEach(src => new Image().src = src);

        img.addEventListener('mouseenter', () => {
            interval = setInterval(() => {
                currentIndex = (currentIndex + 1) % images.length;
                img.src = images[currentIndex];
            }, 1000);
        });

        img.addEventListener('mouseleave', () => {
            clearInterval(interval);
            img.src = images[0]; // Возвращаем первое изображение
        });

    } catch (e) {
        console.error('Ошибка в обработчике изображения:', e);
    }
});

// Меню
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Прокрутка к элементу
function scrollToElement(targetId, highlightColor = "#25D366") {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        targetElement.style.border = `2px solid ${highlightColor}`;
        setTimeout(() => {
            targetElement.style.border = "2px solid transparent";
        }, 2000);
    } else {
        console.warn(`Элемент с id="${targetId}" не найден`);
    }
}

document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        scrollToElement(targetId);
    });
});

// // Фильтры
document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', () => {
        const filterValue = button.getAttribute('data-filter');
        const noResultsMessage = document.getElementById('no-results-message');
        const products = Array.from(document.querySelectorAll('.product'));
        const showMoreButton = document.getElementById('show-more');
        
        // Сброс предыдущего состояния кнопок
        document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Фильтрация товаров
        let filteredProducts = filterValue 
            ? products.filter(product => product.id === filterValue)
            : products;

        // Установка количества товаров для показа (все отфильтрованные товары)
        const productsToShow = filteredProducts.length;

        // Скрытие всех товаров
        products.forEach(product => (product.style.display = 'none'));

        // Показ всех отфильтрованных товаров
        filteredProducts.slice(0, productsToShow).forEach(product => (product.style.display = 'block'));

        // Управление сообщением "нет результатов" и кнопкой "Показать еще"
        noResultsMessage.style.display = filteredProducts.length === 0 ? 'block' : 'none';
        showMoreButton.style.display = 'none'; // Скрываем кнопку "Показать ещё", так как показываем все товары

        // Прокрутка
        if (filteredProducts.length === 0) {
            noResultsMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (filterValue) {
            filteredProducts[0]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


// Слайдер
const totalSlides = document.querySelectorAll('.trailer-slide').length;
const trailerContainer = document.querySelector('.trailer-container');
let currentSlide = 0;

if (trailerContainer && totalSlides > 0) {
    const showNextSlide = () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        const offset = -currentSlide * 100;
        trailerContainer.style.transform = `translateX(${offset}%)`;
    };

    setInterval(showNextSlide, 5000);

    document.querySelector('.trailer-prev')?.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        const offset = -currentSlide * 100;
        trailerContainer.style.transform = `translateX(${offset}%)`;
    });

    document.querySelector('.trailer-next')?.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        const offset = -currentSlide * 100;
        trailerContainer.style.transform = `translateX(${offset}%)`;
    });
}

// График работы
const openingHours = [
    { day: "Воскресенье", hours: "закрыто", open: false }, // 0
    { day: "Понедельник", hours: "08:00-17:00", open: true, start: 8, end: 17 }, // 1
    { day: "Вторник", hours: "08:00-17:00", open: true, start: 8, end: 17 }, // 2
    { day: "Среда", hours: "08:00-17:00", open: true, start: 8, end: 17 }, // 3
    { day: "Четверг", hours: "08:00-17:00", open: true, start: 8, end: 17 }, // 4
    { day: "Пятница", hours: "08:00-17:00", open: true, start: 8, end: 17 }, // 5
    { day: "Суббота", hours: "09:00-16:30", open: true, start: 9, end: 16.5 }, // 6
];

// Функция для обновления текущего времени
function updateCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeElement = document.getElementById('current-time');

    if (currentTimeElement) {
        currentTimeElement.textContent = `${hours}:${minutes}`;
    } else {
        console.error("Элемент #current-time не найден.");
    }
}

// Функция для обновления статуса
function getTodayStatus() {
    const today = new Date();
    const currentHour = today.getHours();
    const currentMinutes = today.getMinutes();
    const statusElement = document.getElementById('status');
    const todayHours = openingHours[today.getDay()];

    if (statusElement && todayHours) {
        if (todayHours.open) {
            const currentTime = currentHour + currentMinutes / 60;
            const isOpen = currentTime >= todayHours.start && currentTime < todayHours.end;
            statusElement.textContent = isOpen ? "Открыто" : "Закрыто";
            statusElement.style.color = isOpen ? "#25D366" : "#ff4d4d";
        } else {
            statusElement.textContent = "Закрыто";
            statusElement.style.color = "#ff4d4d";
        }
    } else {
        // console.error("Элемент #status не найден или данные о часах работы отсутствуют.");
    }
}


// Функция для получения часов работы на сегодня
function getTodayHours() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const todayHours = openingHours[dayOfWeek];

    if (todayHours) {
        // Здесь вы можете добавить код, который будет обрабатывать часы работы
        // Например, обновить интерфейс или выполнять другие действия
    } else {
        // Если данные о часах работы отсутствуют, вы можете обработать это по-другому
        // Например, показать уведомление пользователю или установить значение по умолчанию
    }
}


// Функция для обновления всего
function updateAll() {
    updateCurrentTime();
    getTodayStatus();
    getTodayHours();
}

// Обновляем время и статус каждую минуту
setInterval(updateAll, 60000);

// Вызываем функции при загрузке страницы
document.addEventListener('DOMContentLoaded', updateAll);

document.addEventListener('DOMContentLoaded', () => {
    const products = document.querySelectorAll('.product');
    const showMoreButton = document.getElementById('show-more');
    let visibleProducts = 4; // Начальное количество видимых продуктов

    // Проверяем, если количество продуктов больше 4
    if (products.length > visibleProducts) {
        showMoreButton.style.display = 'block';
    } else {
        showMoreButton.style.display = 'none';
    }

    // Добавляем обработчик события для кнопки "Показать еще ..."
    showMoreButton.addEventListener('click', () => {
        const additionalProducts = 2; // Количество дополнительных продуктов для показа
        
        // Показываем следующие additionalProducts продуктов
        for (let i = 0; i < additionalProducts; i++) {
            if (visibleProducts + i < products.length) {
                products[visibleProducts + i].style.display = 'block';
            }
        }
        
        visibleProducts += additionalProducts;

        // Если все продукты показаны, скрываем кнопку
        if (visibleProducts >= products.length) {
            showMoreButton.style.display = 'none';
        }
    });

    // Изначально скрываем все продукты, кроме первых 4
    products.forEach((product, index) => {
        if (index >= visibleProducts) {
            product.style.display = 'none';
        }
    });
});


