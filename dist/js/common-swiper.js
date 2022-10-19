'use strict'; // = Common swiper

var swiper = new Object();
var autoPlayState = true;
/**
 * swiper
*/
// swiper 공통 event
// + init

function swiperInitEvt(_elem) {
  swiper = _elem;
  swiperInitAriaExpanded(_elem);
} // 접근성: aria-expanded, aria-hidden


function swiperInitAriaExpanded(_elem) {
  setTimeout(function () {
    // slide
    slide(_elem); // dot

    dot(_elem); // left, right Arrow

    arrow(_elem);
  }, 1);
} // + transition end event


function swiperTransitionEndEvt(_elem) {
  _elem.on('slideChangeTransitionEnd', function () {
    setTimeout(function () {
      swiperInitAriaExpanded(_elem);
    }, 1);
  });
} // + slide


function slide(_slide) {
  var SlideEls = _slide.$el[0].querySelectorAll('.swiper-slide');

  var currentSlide = _slide.$el[0].querySelector('.swiper-slide-active');

  if (SlideEls && currentSlide) {
    for (var i = 0; i < SlideEls.length; i++) {
      SlideEls[i].setAttribute('aria-expanded', false);
      SlideEls[i].setAttribute('aria-hidden', true);
      SlideEls[i].setAttribute('tabindex', '-1');
    }

    currentSlide.setAttribute('aria-expanded', true);
    currentSlide.setAttribute('aria-hidden', false);
    currentSlide.setAttribute('tabindex', '0');
  }
} // + dot


function dot(_dot) {
  var dotWrap = _dot.$el[0].querySelector('.swiper-pagination');

  if (dotWrap) {
    var allDot = dotWrap.querySelectorAll('.swiper-pagination-bullet');
    var currentDot = dotWrap.querySelector('.swiper-pagination-bullet-active');

    if (allDot && currentDot) {
      for (var i = 0; i < allDot.length; i++) {
        allDot[i].setAttribute('aria-label', "\uD130\uCE58 \uC2DC ".concat(i + 1, "\uBC88 \uC2AC\uB77C\uC774\uB4DC\uB85C \uC774\uB3D9"));
      }

      currentDot.setAttribute('aria-label', "\uD604\uC7AC ".concat(_dot.realIndex + 1, "\uBC88 \uC2AC\uB77C\uC774\uB4DC"));
    }
  }
} // left, right Arrow


function arrow(_arrow) {
  var arrPrev = _arrow.$el[0].querySelector('.swiper-button-prev');

  var arrNext = _arrow.$el[0].querySelector('.swiper-button-next');

  if (arrPrev) arrPrev.setAttribute('aria-label', '이전 슬라이드로 이동');
  if (arrNext) arrNext.setAttribute('aria-label', '다음 슬라이드로 이동');
} // button: rolling swiper


function stopSwiper(_this) {
  if (autoPlayState) {
    swiper.autoplay.stop();

    _this.setAttribute('aria-label', '자동롤링이정지되어있는리스트입니다터치시자동롤링이플레이됩니다');

    autoPlayState = false;
  } else {
    swiper.autoplay.start();

    _this.setAttribute('aria-label', '자동롤링되있는리스트입니다터치시자동롤링이멈춥니다');

    autoPlayState = true;
  }
}
//# sourceMappingURL=maps/common-swiper.js.map
