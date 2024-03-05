/* eslint-disable operator-linebreak */
/* eslint-disable no-inner-declarations */

const viewportFix = (width) => {
  const meta = document.querySelector('meta[name="viewport"]');
  meta.setAttribute('content', `user-scalable=no, width=${screen.width <= width ? width : 'device-width'}`);
};

viewportFix(428);

window.addEventListener('resize', function () {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
});

document.addEventListener('DOMContentLoaded', function () {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);

  Fancybox.bind('[data-fancybox]', {
    dragToClose: false,
    autoFocus: false,
    placeFocusBack: false,
  });

  const maskOptions = {
    mask: '+7 (000) 000-00-00',
    onFocus: function () {
      if (this.value === '') this.value = '+7 ';
    },
    onBlur: function () {
      if (this.value === '+7 ') this.value = '';
    },
  };

  const maskedElements = document.querySelectorAll('.masked');
  maskedElements.forEach((item) => new IMask(item, maskOptions));

  let lastScrollTop = 0;
  const header = document.querySelector('.header');
  const headerMobile = document.querySelector('.header-mobile');

  window.onscroll = function () {
    let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop > lastScrollTop) {
      // Scroll Down
      if (window.innerWidth > 1024) {
        header.classList.toggle('fixed', currentScrollTop > 0);
      } else {
        headerMobile.classList.toggle('fixed', currentScrollTop > 20);
      }
    } else {
      // Scroll Up
      if (window.innerWidth > 1024) {
        header.classList.toggle('fixed', currentScrollTop > 0);
      } else {
        headerMobile.classList.toggle('fixed', currentScrollTop > 20);
      }
    }

    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
  };

  if (window.innerWidth > 1024) {
    const programmSlider = new Swiper('.programm-slider', {
      autoHeight: true,
      spaceBetween: '14px',
      pagination: {
        el: '.programm-dots',
        clickable: true,
        renderBullet: function (index, className) {
          return `<span class="${className}"></span>`;
        },
      },
    });

    const updateSwiperHeight = () => {
      programmSlider.updateAutoHeight();
    };

    const accordionItems = document.querySelectorAll('.programm-accordion');
    accordionItems.forEach((item) => {
      const title = item.querySelector('.programm-accordion__title');
      const content = item.querySelector('.programm-accordion__main');

      title.addEventListener('click', () => {
        title.classList.toggle('open');
        content.classList.toggle('open');
        content.style.height = content.classList.contains('open') ? `${content.scrollHeight}px` : null;

        updateSwiperHeight();
      });

      content.addEventListener('transitionend', () => {
        updateSwiperHeight();
      });
    });

    const dayTabs = document.querySelectorAll('.programm-days li');

    const updateActiveTab = (index) => {
      dayTabs.forEach((tab, idx) => {
        if (idx === index) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
    };

    updateActiveTab(programmSlider.activeIndex);

    programmSlider.on('slideChange', () => {
      updateSwiperHeight();
      updateActiveTab(programmSlider.activeIndex);
    });

    document.querySelectorAll('.programm-days li').forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.programm-days li').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        programmSlider.slideTo(idx);
      });
    });

    const prevButton = document.querySelector('.programm-prev');
    const nextButton = document.querySelector('.programm-next');

    const updateControlButtons = () => {
      if (programmSlider.isBeginning) {
        prevButton.classList.add('disabled');
      } else {
        prevButton.classList.remove('disabled');
      }

      if (programmSlider.isEnd) {
        nextButton.classList.add('disabled');
      } else {
        nextButton.classList.remove('disabled');
      }
    };

    prevButton.addEventListener('click', () => {
      programmSlider.slidePrev();
    });

    nextButton.addEventListener('click', () => {
      programmSlider.slideNext();
    });

    programmSlider.on('slideChange', () => {
      updateControlButtons();
    });

    updateControlButtons();
  }

  const reviewsSlider = new Swiper('.reviews-slider', {
    loop: true,
    loopAddBlankSlides: true,
    slidesPerView: 'auto',
    spaceBetween: '10px',
    breakpoints: {
      1024: {
        centeredSlides: true,
        spaceBetween: '20px',
        slidesPerView: 3,
        slidesPerGroup: 1,
        pagination: {
          el: '.reviews-dots',
          clickable: true,
          renderBullet: function (index, className) {
            return `<span class="${className}"></span>`;
          },
        },
      },
    },
  });

  reviewsSlider.on('slideChange', function () {
    reviewsSlider.slides.forEach((slide) => {
      slide.classList.remove('prev', 'next');
    });

    const activeIndex = reviewsSlider.activeIndex;

    for (let i = 0; i < activeIndex; i++) {
      reviewsSlider.slides[i].classList.add('prev');
    }

    for (let i = activeIndex + 1; i < reviewsSlider.slides.length; i++) {
      reviewsSlider.slides[i].classList.add('next');
    }
  });

  reviewsSlider.emit('slideChange');

  const faq = document.querySelector('.faq');
  if (faq) {
    faq.querySelectorAll('.faq-item').forEach((item) => {
      const title = item.querySelector('.faq-item__title');
      if (title) {
        const content = item.querySelector('.faq-item__main');
        title.addEventListener('click', () => {
          content.classList.toggle('open');
          title.classList.toggle('open');
          content.style.maxHeight = content.classList.contains('open') ? `${content.scrollHeight}px` : null;
        });
      }
    });
  }

  const listItems = document.querySelectorAll('.programm-list li');
  listItems.forEach((item) => {
    item.addEventListener('click', function () {
      const day = this.getAttribute('data-day');
      const targetElement = document.querySelector(`.programm-slider .programm-day[data-day="${day}"]`);

      if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth', inline: 'start' });

      listItems.forEach((li) => li.classList.remove('active'));
      this.classList.add('active');
    });
  });

  const price = document.querySelector('.price');
  if (price) {
    price.querySelectorAll('.price-accordion').forEach((item) => {
      const title = item.querySelector('.price-accordion__title');
      if (title) {
        const content = item.querySelector('.price-accordion__wrapper');
        title.addEventListener('click', () => {
          const transition = content.scrollHeight / 1000 > 0.25 ? content.scrollHeight / 1000 : 0.25;
          content.classList.toggle('open');
          title.classList.toggle('open');
          content.style.cssText = content.classList.contains('open')
            ? `--transition: ${transition}s; max-height: ${content.scrollHeight}px;`
            : null;
        });
      }
    });
  }

  document.querySelector('body').addEventListener('click', (e) => {
    const isBurgerIcon = e.target.closest('.header-mobile__burger');
    const isBurgerNavItem = e.target.closest('.burger-nav li a');
    if (isBurgerIcon || isBurgerNavItem) {
      document.querySelector('.burger').classList.toggle('show');
      document.querySelector('body').classList.toggle('no-scroll');
      document.querySelector('.header-mobile').classList.toggle('burger-show');
      document.querySelector('.header-mobile__burger').classList.toggle('open');
    }
  });

  document.querySelectorAll('.tour-form select[name="people"], .popup-payment select[name="people"]').forEach((selectElement) => {
    const isPopup = selectElement.closest('.popup-payment');
    const totalPriceElement = isPopup ? document.querySelector('.popup-total h4') : document.querySelector('.tour-form__total h4');
    const totalTextElement = isPopup ? document.querySelector('.popup-total p') : document.querySelector('.tour-form__total p');

    selectElement.addEventListener('change', function () {
      const pricePerPerson = this.dataset.price;
      const numberOfPeople = this.value;
      const textPeople = numberOfPeople === '11' ? 'больше 10 человек' : getPeopleText(numberOfPeople);
      const totalPrice = pricePerPerson * numberOfPeople;

      totalTextElement.innerHTML = `Сумма предоплаты<br> за ${textPeople}`;
      totalPriceElement.innerHTML = `${totalPrice.toLocaleString('ru-RU')}₽`;
    });
  });

  function getPeopleText(n) {
    if (n > 10) return 'человек';
    const lastDigit = n % 10;
    if (lastDigit === 1) return `${n} человека`;
    if (lastDigit >= 2 && lastDigit <= 4) return `${n} человека`;
    return `${n} человек`;
  }

  let previousScrollPosition = pageYOffset;
  window.addEventListener('scroll', function () {
    const currentScrollPosition = pageYOffset;

    if (currentScrollPosition > previousScrollPosition && currentScrollPosition > 250) {
      headerMobile.classList.add('hide');
      header.classList.add('hide');
    } else {
      headerMobile.classList.remove('hide');
      header.classList.remove('hide');
    }

    previousScrollPosition = currentScrollPosition;
  });
});
