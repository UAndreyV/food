'use strict';

window.addEventListener("DOMContentLoaded", () => {

    //burger
    const burger = document.querySelector('.top__burger'),
        topMenu = document.querySelector('.top__menu'),
        parentMenuItem = document.querySelector('.top__menu-items');

    burger.addEventListener('click', () => {
        topMenu.classList.toggle('top__menu-show');
        document.body.classList.toggle('body_over');
    });

    parentMenuItem.addEventListener('click', (e) => {
        const target = e.target;
        if (target != parentMenuItem) {
            topMenu.classList.remove('top__menu-show');
        }
    });

    //tabs
    const tabs = document.querySelectorAll('.program__tabs-item'),
        tabsContent = document.querySelectorAll('.program__content-item'),
        tabsParent = document.querySelector('.program__tabs');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('program__content-hide');
            item.classList.remove('program__content-item', 'program__content-fade');
        });

        tabs.forEach(item => {
            item.classList.remove('program__tabs-item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('program__content-item', 'program__content-fade');
        tabsContent[i].classList.remove('program__content-hide');
        tabs[i].classList.add('program__tabs-item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        const target = e.target;

        if (target && target.classList.contains('program__tabs-item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    //timer
    const deadLine = '2021-11-01';

    function getTimRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minuts = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minuts': minuts,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endTime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minuts = timer.querySelector('#minuts'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updataClock, 1000);

        updataClock();

        function updataClock() {
            const t = getTimRemaining(endTime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minuts.innerHTML = getZero(t.minuts);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadLine);

    //modal
    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    function toggleModal() {
        modal.classList.toggle('show');
        document.body.classList.toggle('body_over');
        clearInterval(modalTimerId);
    }

    modalTrigger.forEach(item => {
        item.addEventListener('click', () => {
            toggleModal();
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            toggleModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            toggleModal();
        }
    });

    const modalTimerId = setTimeout(toggleModal, 10000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 20) {
            toggleModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    //class

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 75;
            this.changeToRU();
        }

        changeToRU() {
            this.price = this.price * this.transfer;
        }
        render() {
            const element = document.createElement('li');
            element.classList.add('menu__item');
            element.innerHTML = `            
                            <img src=${this.src} alt=${this.alt}>
                            <h3 class="menu__item-subtitle">${this.title}</h3>
                            <p class="menu__item-descr">${this.descr}</p>
                            <div class="menu__item-price">
                                <span class="menu__item-cost">Цена:</span>
                                <p class="menu__item-total"><span>${this.price}</span> руб/день</p>
                            </div>                       
            `;
            this.parent.append(element);
        }
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        `Меню "Фитнес"`,
        `Меню "Фитнес" - это новый подход к приготовлению блюд: больше
                                  свежих
                                  овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с
                                  оптимальной
                                  ценой и высоким качеством!`,
        45,
        `.menu .menu__container`
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        `Меню “Премиум”`,
        `В меню “Премиум” мы используем не только красивый дизайн
          упаковки, но
          и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню
          без похода
          в ресторан!`,
        50,
        `.menu .menu__container`
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        `Меню "Постное"`,
        `Меню “Постное” - это тщательный подбор ингредиентов: полное
          отсутствие
          продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки,
          правильное
          количество белков за счет тофу и импортных вегетарианских стейков.`,
        55,
        `.menu .menu__container`
    ).render();

    // Slider

    let offset = 0;
    let slideIndex = 1;

    const slides = document.querySelectorAll('.slider__item'),
        slider = document.querySelector('.offer__info-slider'),
        prev = document.querySelector('.slider__arrow-left'),
        next = document.querySelector('.slider__arrow-right'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.slider__wrapper'),
        width = window.getComputedStyle(slidesWrapper).width,
        slidesField = document.querySelector('.slider__inner');

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slides.length + '%';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    const indicators = document.createElement('ol'),
        dots = [];
    indicators.classList.add('slider__indicators');
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('slider__indicators-item');
        if (i == 0) {
            dot.classList.add('slider__indicators_active');
        }
        indicators.append(dot);
        dots.push(dot);
    }

    next.addEventListener('click', () => {
        if (offset == (+width.slice(0, width.length - 2) * (slides.length - 1))) {
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }

        dots.forEach(dot => dot.style.cssText = `
        list-style: none;
        width: 10px;
        height: 10px;
        background-color: white;
        border: white 2px solid;
        border-radius: 50%;
        cursor: pointer;
        margin: 0px 10px 0px 0px;
    `);
        dots[slideIndex - 1].style.cssText = `
        list-style: none;
        width: 25px;
        height: 10px;
        background-color: #ff643c;
        border: #ff643c 2px solid;
        border-radius: 12px;
    `;
    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }

        dots.forEach(dot => dot.style.cssText = `
        list-style: none;
        width: 10px;
        height: 10px;
        background-color: white;
        border: white 2px solid;
        border-radius: 50%;
        cursor: pointer;
        margin: 0px 10px 0px 0px;
    `);
        dots[slideIndex - 1].style.cssText = `
        list-style: none;
        width: 25px;
        height: 10px;
        background-color: #ff643c;
        border: #ff643c 2px solid;
        border-radius: 12px;
    `;
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = +width.slice(0, width.length - 2) * (slideTo - 1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            if (slides.length < 10) {
                current.textContent = `0${slideIndex}`;
            } else {
                current.textContent = slideIndex;
            }

            dots.forEach(dot => dot.style.cssText = `
        list-style: none;
        width: 10px;
        height: 10px;
        background-color: white;
        border: white 2px solid;
        border-radius: 50%;
        cursor: pointer;
        margin: 0px 10px 0px 0px;
    `);
            dots[slideIndex - 1].style.cssText = `
        list-style: none;
        width: 25px;
        height: 10px;
        background-color: #ff643c;
        border: #ff643c 2px solid;
        border-radius: 12px;
    `;
        });
    });

    // Calculator

    const result = document.querySelector('.calc__result');

    let sex, height, weight, age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    //1
    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return;
        }
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender', 'calc__item_active');
    initLocalSettings('.calc__field-subtitle div', 'calc__item_active');

    //2
    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {

                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }
                console.dir(e.target);
                elements.forEach(elem => {
                    elem.nextElementSibling.classList.remove(activeClass);
                });

                e.target.nextElementSibling.classList.add(activeClass);

                calcTotal();
            });
        });
    }

    getStaticInformation('#gender input', 'calc__item_active');
    getStaticInformation('.calc__activity input', 'calc__item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            if (input.value.match(/\D/g)) {
                input.style.border = "3px solid red";
            } else {
                input.style.border = 'border: #ff643c 2px solid';
            }
            switch (input.getAttribute('id')) {
                case "height":
                    height = +input.value;
                    break;
                case "weight":
                    weight = +input.value;
                    break;
                case "age":
                    age = +input.value;
                    break;
            }

            calcTotal();
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');

});