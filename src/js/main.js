/* eslint-disable operator-linebreak */
/* eslint-disable no-inner-declarations */

const viewportFix = (width) => {
  const meta = document.querySelector('meta[name="viewport"]');
  meta.setAttribute('content', `user-scalable=no, width=${screen.width <= width ? width : 'device-width'}`);
};

viewportFix(420);

document.addEventListener('DOMContentLoaded', function () {
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

  window.onscroll = function () {
    const header = document.querySelector('.header');
    if (window.pageYOffset > 0) {
      header.classList.add('fixed');
    } else {
      header.classList.remove('fixed');
    }
  };

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
});
