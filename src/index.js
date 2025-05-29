import Alpine from 'alpinejs';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

// Alpine.js setup
window.Alpine = Alpine;
Alpine.start();

document.addEventListener('DOMContentLoaded', () => {
  const thumbSwiperEl = document.querySelector('.thumb-swiper');
  const mainSwiperEl = document.querySelector('.main-swiper');

  // Safeguard for pages that don't include Swiper
  if (!thumbSwiperEl || !mainSwiperEl) return;

  const thumbSwiper = new Swiper(thumbSwiperEl, {
    spaceBetween: 10,
    slidesPerView: 3,
    freeMode: true,
    watchSlidesProgress: true,
    breakpoints: {
      768: {
        direction: 'vertical',
        slidesPerView: 4,
      },
    },
  });

  new Swiper(mainSwiperEl, {
    spaceBetween: 10,
    thumbs: {
      swiper: thumbSwiper,
    },
  });
});
