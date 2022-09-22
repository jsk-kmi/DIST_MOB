'use strict'; // = Common

/**
 * resize event
*/

window.addEventListener('resize', function () {
  // full popup이 있을 경우 하단 버튼 scroll 체크
  fullPopupState();
});
/**
 * tab 접근성
 * tab list의 aria-controls와 같은 aria-labelledby panel을 보여줌
*/

var TAB_EL = document.querySelectorAll('ul.c-tab');

if (TAB_EL.length > 0) {
  var _loop = function _loop(i) {
    var tabEl = TAB_EL[i].querySelectorAll('li');
    var altEl = TAB_EL[i].querySelectorAll('.skip');

    if (tabEl.length > 0) {
      var _loop2 = function _loop2(j) {
        var ipt = tabEl[j].querySelector('input[type="radio"]');

        if (ipt) {
          ipt.addEventListener('click', function () {
            if (altEl) {
              for (var k = 0; k < tabEl.length; k++) {
                altEl[k].innerText = '선택안됨';
              }

              altEl[j].innerText = '선택됨';
            }

            var activeTab = document.querySelector('.tab-panel.show');
            if (activeTab) activeTab.classList.remove('show');
            var AC = tabEl[j].getAttribute('aria-controls');

            if (AC) {
              var activeAC = document.querySelector('[aria-labelledby=' + AC + ']');
              if (activeAC) activeAC.classList.add('show');
            }
          });
        }
      };

      for (var j = 0; j < tabEl.length; j++) {
        _loop2(j);
      }
    }
  };

  for (var i = 0; i < TAB_EL.length; i++) {
    _loop(i);
  }
}
/**
 * popup
*/
// 화면에 팝업이 있을 경우 공통 스타일 적용


var POPUP_ELEM = document.querySelectorAll('.c-layer-popup');

if (POPUP_ELEM.length > 0) {
  for (var _i = 0; _i < POPUP_ELEM.length; _i++) {
    // style
    popupStyle(POPUP_ELEM[_i], 'hide');
  }
} // 팝업 열림


var POPUP_BTN_ELEM = document.querySelectorAll('.btn-open-popup');

if (POPUP_BTN_ELEM.length > 0) {
  var _loop3 = function _loop3(_i2) {
    // popup open button - click event
    POPUP_BTN_ELEM[_i2].addEventListener('click', function () {
      var TARGET = POPUP_BTN_ELEM[_i2].getAttribute('data-target');

      var CURRENT_POPUP = document.getElementById(TARGET);
      CURRENT_POPUP.classList.add('show');
      CURRENT_POPUP.setAttribute('aria-hidden', false); // 팝업 종류 체크

      var popupState = popupStateCheck(CURRENT_POPUP); // 접근성

      focusFirstBtn(popupState, CURRENT_POPUP); // style

      popupStyle(CURRENT_POPUP, 'show'); // full popup scroll height check

      fullPopupScrollHeightChk(popupState, CURRENT_POPUP); // full popup scroll check

      fullPopupScrollChk(popupState, CURRENT_POPUP); // popup background - click event

      var POPUP_BG_ELEM = document.querySelectorAll('.popup-bg');

      if (POPUP_BG_ELEM.length > 0) {
        for (var j = 0; j < POPUP_BG_ELEM.length; j++) {
          POPUP_BG_ELEM[j].addEventListener('click', function () {
            // 팝업 닫힘
            CURRENT_POPUP.classList.remove('show');
            CURRENT_POPUP.setAttribute('aria-hidden', true); // style - 사라지는 animation을 위해 setTimeout 사용

            setTimeout(function () {
              popupStyle(CURRENT_POPUP, 'hide');
            }, 200);
          });
        }
      }
    });
  };

  for (var _i2 = 0; _i2 < POPUP_BTN_ELEM.length; _i2++) {
    _loop3(_i2);
  }
} // 팝업 닫힘 - 닫힘버튼 class: popup-btn-close


var POPUP_CLOSE_ELEM = document.querySelectorAll('.popup-btn-close');

if (POPUP_CLOSE_ELEM.length > 0) {
  var _loop4 = function _loop4(_i3) {
    // popup close button - click event
    POPUP_CLOSE_ELEM[_i3].addEventListener('click', function () {
      var TARGET = POPUP_CLOSE_ELEM[_i3].closest('.c-layer-popup') || POPUP_CLOSE_ELEM[_i3].closest('.c-full-layer');

      TARGET.classList.remove('show');
      TARGET.setAttribute('aria-hidden', true); // style - 사라지는 animation을 위해 setTimeout 사용

      setTimeout(function () {
        popupStyle(TARGET, 'hide');
        focusCloseState(TARGET);
      }, 200);
    });
  };

  for (var _i3 = 0; _i3 < POPUP_CLOSE_ELEM.length; _i3++) {
    _loop4(_i3);
  }
} // 팝업 종류 체크


function popupStateCheck(_popState) {
  var popCase = _popState.classList;

  if (popCase.contains('c-full-layer') && popCase.contains('type-footer')) {
    // 푸터 있는 풀팝업: full-footer
    return 'full-footer';
  } else if (popCase.contains('c-full-layer')) {
    // 푸터 없는 풀팝업: full
    return 'full';
  } else if (popCase.contains('c-layer-popup')) {
    // 모달 팝업: modal
    return 'modal';
  }
} // 팝업 style - top, z-index, visibility


function popupStyle(_elem, _state) {
  switch (_state) {
    case 'show':
      _elem.style.top = 0;
      _elem.style.zIndex = '2000';
      _elem.style.visibility = 'visible';
      break;

    case 'hide':
      _elem.style.top = window.innerHeight + 'px';
      _elem.style.zIndex = '-1';
      _elem.style.visibility = 'hidden';
      break;

    default:
      _elem.style.top = window.innerHeight + 'px';
      _elem.style.zIndex = '-1';
      _elem.style.visibility = 'hidden';
      break;
  }
} // 풀팝업 스크롤 height 체크


function fullPopupScrollHeightChk(_state, _elem) {
  var winHeight = window.innerHeight;

  if (_state === 'full') {
    var FULL_HEADER = _elem.querySelector('.full-header');

    var FULL_BODY = _elem.querySelector('.full-body');

    var FULL_FOOTER = _elem.querySelector('.full-footer');

    if (FULL_HEADER && FULL_BODY && FULL_FOOTER) {
      var computedStyle = getComputedStyle(FULL_BODY);
      var bodyPb = parseFloat(computedStyle.paddingBottom);
      var hHeight = FULL_HEADER.offsetHeight;
      var bHeight = FULL_BODY.scrollHeight;
      var fHeight = FULL_FOOTER.offsetHeight;
      var hRes = winHeight - hHeight - fHeight; // console.log(parseFloat(computedStyle.paddingBottom));

      if (bHeight > hRes) {
        FULL_FOOTER.classList.add('scroll');
      } else {
        FULL_FOOTER.classList.remove('scroll');
      }
    }
  }

  if (_state === 'full-footer') {
    var SCROLL_ELEM = document.querySelector('.c-full-layer.type-footer.show');

    var _FULL_HEADER = _elem.querySelector('.full-header');

    var _FULL_BODY = _elem.querySelector('.full-body');

    var _FULL_FOOTER = _elem.querySelector('.full-footer');

    var FOOTER = _elem.querySelector('.footer.type-default');

    if (SCROLL_ELEM && _FULL_HEADER && _FULL_BODY && _FULL_FOOTER && FOOTER) {
      // let computedStyle = getComputedStyle(FULL_BODY);
      // let bodyPb = parseFloat(computedStyle.paddingBottom);
      // let winHeight = window.innerHeight;
      // let hHeight = FULL_HEADER.offsetHeight;
      // let bHeight = FULL_BODY.scrollHeight;
      // let fHeight = FULL_FOOTER.offsetHeight;
      // let hRes = winHeight - hHeight - fHeight;
      var sHeight = parseFloat(SCROLL_ELEM.clientHeight);
      var fhHeight = parseFloat(_FULL_HEADER.clientHeight);
      var fbHeight = parseFloat(_FULL_BODY.clientHeight);
      var ffHeight = parseFloat(_FULL_FOOTER.clientHeight);

      var _fHeight = parseFloat(FOOTER.clientHeight);

      var _hRes = winHeight - fhHeight - ffHeight - _fHeight;

      console.log('hRes : ', _hRes);
      console.log('fbHeight : ', fbHeight);

      if (_hRes > fbHeight) {
        _FULL_FOOTER.classList.remove('scroll');
      } else {
        _FULL_FOOTER.classList.add('scroll');
      }
    }
  }
} // 풀팝업 스크롤 체크


function fullPopupScrollChk(_state, _elem) {
  var FULL_FOOTER = _elem.querySelector('.full-footer');

  var leftRes = 0;
  var rightRes = 0;

  if (_state === 'full') {
    var FULL_BODY = _elem.querySelector('.full-body');

    if (FULL_BODY) {
      // .full-body scroll event
      FULL_BODY.addEventListener('scroll', function () {
        if (FULL_FOOTER) {
          // FULL_FOOTER.style.transition = 'padding .1s ease-in-out';
          leftRes = FULL_BODY.offsetHeight + FULL_BODY.scrollTop;
          rightRes = FULL_BODY.scrollHeight;

          if (leftRes < rightRes) {
            FULL_FOOTER.classList.add('scroll');
          }

          if (leftRes >= rightRes) {
            FULL_FOOTER.classList.remove('scroll');
          }
        }
      });
    }
  }

  if (_state === 'full-footer') {
    var SCROLL_BODY = _elem.querySelector('.c-container');

    var _FULL_BODY2 = _elem.querySelector('.full-body');

    var _FULL_FOOTER2 = _elem.querySelector('.full-footer');

    var FOOTER = _elem.querySelector('.footer.type-default');

    if (SCROLL_BODY && _FULL_BODY2 && _FULL_FOOTER2 && FOOTER) {
      var footerHeight = parseFloat(FOOTER.clientHeight);
      var fullFooterHeight = parseFloat(_FULL_FOOTER2.clientHeight); // .c-full-layer.type-footer.show scroll event

      SCROLL_BODY.addEventListener('scroll', function () {
        leftRes = SCROLL_BODY.offsetHeight + SCROLL_BODY.scrollTop;
        rightRes = SCROLL_BODY.scrollHeight - footerHeight - fullFooterHeight;

        if (_FULL_FOOTER2) {
          if (leftRes < rightRes) {
            _FULL_FOOTER2.classList.add('scroll');
          }

          if (leftRes >= rightRes) {
            _FULL_FOOTER2.classList.remove('scroll');
          }
        }
      });
    }
  }
} // 팝업 - 접근성
// basic type 이면 X 버튼에 focus 시키기
// full type 이면 뒤로가기 버튼에 focus 시키기


function focusFirstBtn(_state, _elem) {
  setTimeout(function () {
    var focus_el = new Object();

    if (_state === 'full-footer' || _state === 'full') {
      focus_el = _elem.querySelectorAll('.btn-go-back');
    } else if (_elem.classList.contains('c-layer-popup')) {
      focus_el = _elem.querySelectorAll('.popup-btn-close');
    }

    if (focus_el) {
      setTimeout(function () {
        focus_el[0].focus();
      }, 1);
    }
  }, 1);
} // 팝업 - 접근성 - 팝업 닫을 때 열었던 버튼에 focus 시키기


function focusCloseState(_elem) {
  setTimeout(function () {
    var FOCUS_ELEM = document.querySelector("[data-target=\"".concat(_elem.id, "\"]"));
    if (FOCUS_ELEM) FOCUS_ELEM.focus();
  }, 1);
} // DOM에 풀팝업이 있을 경우 


function fullPopupState() {
  var FULL_POPUP_ELEM = document.querySelector('.c-full-layer.show');

  if (FULL_POPUP_ELEM) {
    fullPopupScrollHeightChk('full', FULL_POPUP_ELEM);
  }
}
//# sourceMappingURL=maps/common.js.map
