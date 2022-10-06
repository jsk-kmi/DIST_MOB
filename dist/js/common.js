'use strict'; // = Common

/**
 * common variable
*/
// animation time

var ANI_TIME_300 = 301; // interval time

var INTERVAL_1 = 1;
var INTERVAL_1000 = 1000;
/**
 * resize event
*/

var rtime;
var timeout = false;
var DELTA = 10;
window.addEventListener('resize', function () {
  rtime = new Date();

  if (timeout === false) {
    timeout = true;
    setTimeout(resizeend, DELTA);
  }
});

function resizeend() {
  if (new Date() - rtime < DELTA) {
    setTimeout(resizeend, DELTA);
  } else {
    timeout = false; // resize end
    // full popup이 있을 경우 하단 버튼 scroll 체크

    fullPopupState();
  }
}
/**
 * 접근성 공통
*/
// #container -> aria-hidden: true || false


function containerHidden(_state) {
  var GNB_CONTAINER_EL = document.getElementById('container');

  if (GNB_CONTAINER_EL) {
    if (_state) GNB_CONTAINER_EL.setAttribute('aria-hidden', true);else GNB_CONTAINER_EL.setAttribute('aria-hidden', false);
  }
}
/**
 * GNB
*/


var GNB_ELEM = document.querySelectorAll('.btn-open-gnb');
if (GNB_ELEM.length > 0) for (var i = 0; i < GNB_ELEM.length; i++) {
  gnbComn(GNB_ELEM[i]);
} // + gnb common event

function gnbComn(_gnbEl) {
  // 접근성 적용: aria-expanded
  _gnbEl.setAttribute('aria-expanded', false); // 초기세팅


  var NAV_INIT = document.querySelector('.co-gnb');

  if (NAV_INIT) {
    popupStyle(NAV_INIT, 'hide');
    NAV_INIT.setAttribute('aria-hidden', true);
    var GNB_BG_INIT = NAV_INIT.querySelector('.gnb-bg');
    if (GNB_BG_INIT) popupStyle(GNB_BG_INIT, 'hide');
  } // gnb button click event


  _gnbEl.addEventListener('click', function () {
    // 접근성 적용: aria-expanded
    _gnbEl.setAttribute('aria-expanded', true); // 전체메뉴 hide / show


    var NAV = document.querySelector('.co-gnb');
    if (NAV) gnbClickEvent(NAV, _gnbEl);
  });
} // + gnb open button click event


function gnbClickEvent(_navEl, _gnbEl) {
  // 접근성 aria-hidden
  _navEl.setAttribute('aria-hidden', false);

  var GNB_CLOSE_BTN = _navEl.querySelector('.btn-close-gnb');

  var GNB_BG = _navEl.querySelector('.gnb-bg');

  var GNB_ACC = _navEl.querySelectorAll('.accordion');

  if (GNB_CLOSE_BTN && GNB_BG && GNB_ACC.length > 0) {
    // gnb 공통 event
    navComnEvent(_navEl, GNB_BG); // 접근성 focus

    setTimeout(function () {
      GNB_CLOSE_BTN.focus();
    }, INTERVAL_1); // 전체메뉴 닫기

    navCloseEvent(_navEl, _gnbEl, GNB_BG, GNB_CLOSE_BTN, GNB_ACC);
  }
} // + gnb 공통 event


function navComnEvent(_navEl, _bgEl) {
  if (!_navEl.classList.contains('show')) {
    popupStyle(_navEl, 'show');
    popupStyle(_bgEl, 'show');

    _navEl.classList.add('show'); // 접근성: gnb 오픈 시 #container focus 막기


    containerHidden(true);
  }
} // + 전체메뉴 닫기


function navCloseEvent(_navEl, _gnbEl, _gnbBgEl, _gnbCloseBtn, _gnbAcc) {
  // 전체메뉴 닫기 element 배열 - .btn-close-gnb || .gnb-bg
  var GNB_CLOSE_ARR = [_gnbBgEl, _gnbCloseBtn];

  for (var _i2 = 0; _i2 < GNB_CLOSE_ARR.length; _i2++) {
    GNB_CLOSE_ARR[_i2].addEventListener('click', function () {
      // 접근성 aria-hidden
      _navEl.setAttribute('aria-hidden', true);

      _navEl.classList.remove('show');

      _gnbEl.setAttribute('aria-expanded', false); // 접근성: gnb close 시 #container focus 풀기


      containerHidden(false); // setTimeout Event

      navTimeoutEvent(_navEl, _gnbBgEl, _gnbAcc, _gnbEl);
    }, false);
  }
} // + 전체메뉴 닫은 후 setTimeout Event


function navTimeoutEvent(_navEl, _gnbBgEl, _gnbAcc, _gnbEl) {
  setTimeout(function () {
    popupStyle(_navEl, 'hide');
    popupStyle(_gnbBgEl, 'hide'); // 아코디언 모두 닫힘

    accordionAllClose(_gnbAcc); // 접근성 focus

    setTimeout(function () {
      _gnbEl.focus();
    }, INTERVAL_1);
  }, ANI_TIME_300);
}
/**
 * tab
*/


var TAB_EL = document.querySelectorAll('ul.c-tab');
if (TAB_EL.length > 0) for (var _i3 = 0; _i3 < TAB_EL.length; _i3++) {
  tabCommonEvent(TAB_EL[_i3]);
} // tabCommonEvent

function tabCommonEvent(_elem) {
  // panel 내용이 바뀌는 방식의 tab 일 경우
  // 탭과 연동된 tab-click-list 모두 보임
  tabClickListAllShow(_elem); // 탭의 하단 bar가 animation되는 경우

  if (_elem.classList.contains('type-basic')) tabBarAnimation(_elem);

  var tabEl = _elem.querySelectorAll('li');

  if (tabEl.length > 0) for (var j = 0; j < tabEl.length; j++) {
    tabClickCheck(_elem, tabEl[j], j);
  }
} // + tab click check


function tabClickCheck(_wrap, _elem, _j) {
  var ipt = _elem.querySelector('input[type="radio"]') || _elem.querySelector('a.tab');

  var ipt_checked = _elem.querySelector('input[type="radio"]:checked') || _elem.querySelector('a.tab.active');

  if (ipt) tabClickEvent(_wrap, ipt, _elem, _j, ipt_checked);
} // ++ tab Click Event


function tabClickEvent(_wrap, _ipt, _elem, _j, _ipt_checked) {
  // 접근성 : 대체텍스트 적용: 선택됨, 선택안됨
  tabAltTxtInit(_elem, _ipt, _ipt_checked); // tab 종류 체크

  var tabState = tabStateCheck(_wrap); // panel 내용이 바뀌는 방식의 tab 일 경우

  if (_wrap.classList.contains('type-move')) setTimeout(function () {
    tabStateMove(_elem);
  }, INTERVAL_1); // 탭 터치 event

  _ipt.addEventListener('click', function () {
    // 팝업에서 tab 터치 시 팝업 c-container 높이가 변할 경우
    // 애니메이션 타임: 100
    // setTimeout(() => { clkElClickPopupCheck(_elem) }, INTERVAL_1);
    setTimeout(function () {
      clkElClickPopupChk(_elem);
    }, INTERVAL_1); // 대체텍스트 적용

    if (_ipt.tagName !== 'A' && _ipt.tagName !== 'a') {
      var altEl = _wrap.querySelectorAll('.alt-txt');

      if (altEl.length > 0) applyTabAltText(altEl, _j);
    } // hide / show 방식의 tab 일 경우


    if (tabState === 'hide-type') tabStatePanel(_elem); // scroll 방식의 tab 일 경우

    if (tabState === 'scroll-type') tabStateScroll(_elem); // panel 내용이 바뀌는 방식의 tab 일 경우

    if (tabState === 'click-type') tabStateClick(_elem); // tab터치 시 tab의 하단 bar가 animation되는 경우

    if (_ipt.closest('.c-tab').classList.contains('type-basic')) tabBarTouchAnimation(_elem); // center 정렬 필요한 tab

    var centerType = tabCenterCheck(_wrap);
    if (centerType) tabCenterEvent(_wrap, _elem);
  });
} // +++ 탭 종류 체크


function tabStateCheck(_tabState) {
  var tabCase = _tabState.classList; // 탭 터치 시 페이지 이동되는 경우

  if (tabCase.contains('type-move')) return 'move-type'; // 탭 터치 시 스크롤 되는 경우: scroll-type

  if (tabCase.contains('type-scroll')) return 'scroll-type'; // 탭 터치 시 panel이 hide/show 되는 경우: hide-type

  if (tabCase.contains('type-panel')) return 'hide-type'; // 탭 터치 시 panel안의 내용이 바뀌는 경우

  if (tabCase.contains('type-click')) return 'click-type';
} // +++ 탭 터치 시 center 정렬 필요한 경우


function tabCenterCheck(_tabEl) {
  // a tag tab일 경우 실행 안함
  var A_TAG_CHECK = _tabEl.querySelectorAll('li a');

  if (A_TAG_CHECK.length > 0) return false;
  var tabCenterState = _tabEl.classList;
  if (tabCenterState.contains('type-basic') || tabCenterState.contains('type-move')) return false;
  return true;
} // +++ 터치 전 대체텍스트 적용 - 선택됨, 선택안됨


function tabAltTxtInit(_elem, _ipt, _ipt_checked) {
  var altElBefore = document.createElement('span');
  altElBefore.classList.add('alt-txt');
  altElBefore.innerText = '선택안됨';

  _elem.insertBefore(altElBefore, _ipt);

  if (_ipt_checked) _ipt_checked.parentElement.querySelector('.alt-txt').innerText = '선택됨';
} // +++ 터치 시 대체텍스트 적용 - 선택됨, 선택안됨


function applyTabAltText(_elem, _j) {
  for (var k = 0; k < _elem.length; k++) {
    _elem[k].innerText = '선택안됨';
  }

  _elem[_j].innerText = '선택됨';
} // +++ center 정렬 필요한 tab


function tabCenterEvent(_tabWrap, _tabEl) {
  _tabEl.addEventListener('click', function () {
    var SCROLL_WRAP = _tabEl.parentElement;
    if (SCROLL_WRAP) tabCenterComnEvent(_tabEl, _tabWrap, SCROLL_WRAP);
  });
} // +++ center정렬 common event


function tabCenterComnEvent(_tabEl, _tabWrap, _scrollWrap) {
  var tabLeft = _tabEl.offsetLeft;
  var tabStyle = _tabWrap.currentStyle || window.getComputedStyle(_tabWrap);
  var tabPadRes = parseInt(tabStyle.paddingLeft) + parseInt(tabStyle.paddingRight);
  var tabWidth = _scrollWrap.clientWidth - tabPadRes;
  var tabDiff = tabLeft - tabWidth / 2;

  _scrollWrap.scroll({
    left: tabDiff,
    behavior: 'smooth'
  });
} // +++ tab의 하단 bar가 animation되는 경우


function tabBarAnimation(_tabWrap) {
  var TAB_LI_ELEM = _tabWrap.querySelectorAll('li');

  var aniEl = 0;

  if (TAB_LI_ELEM.length > 0) {
    for (var _i4 = 0; _i4 < TAB_LI_ELEM.length; _i4++) {
      aniEl += 1;
    }

    _tabWrap.classList.add('tab-len-' + aniEl);

    aniEl = 0;

    for (var _i5 = 0; _i5 < TAB_LI_ELEM.length; _i5++) {
      tabBarAnimationComn(TAB_LI_ELEM[_i5], _i5);
    }
  }
} // +++ tabBarAnimation


function tabBarAnimationComn(_tabLiEl, _i) {
  var tab_chked_ipt = _tabLiEl.querySelector('input[type="radio"]:checked');

  if (tab_chked_ipt) tab_chked_ipt.closest('.c-tab').classList.add('tab-active-' + _i);
} // ++ tab터치 시 tab의 하단 bar가 animation되는 경우


function tabBarTouchAnimation(_elem) {
  var el = _elem.parentElement;
  var prefix = 'tab-active-';
  var classes = el.className.split(' ').filter(function (c) {
    return c.lastIndexOf(prefix, 0) !== 0;
  });
  el.className = classes.join(' ').trim();
  var idx = Array.prototype.indexOf.call(el.children, _elem);
  el.classList.add('tab-active-' + idx);
} // +++ hide / show 방식의 tab 일 경우


function tabStatePanel(_elem) {
  // aria-labelledby element의 removeClass: show
  var tabList = [];

  var tabWrap = _elem.closest('.c-tab');

  var tabListEl = tabWrap.querySelectorAll('[role="tab"]');

  for (var _i6 = 0; _i6 < tabListEl.length; _i6++) {
    tabList.push(tabListEl[_i6].getAttribute('aria-controls'));
  }

  if (tabList.length > 0) tabStatePanelEvent(tabList); // 터치한 tab의 aria-controls와 동일한 aria-labelledby에게 addClass: show

  var AC = _elem.getAttribute('aria-controls');

  if (AC) {
    var activeAC = document.querySelector('[aria-labelledby=' + AC + ']');
    if (activeAC) activeAC.classList.add('show');
  }
}

function tabStatePanelEvent(_tabList) {
  for (var _i7 = 0; _i7 < _tabList.length; _i7++) {
    var panelEl = document.querySelector('[aria-labelledby="' + _tabList[_i7] + '"]');
    if (panelEl) if (panelEl.classList.contains('show')) panelEl.classList.remove('show');
  }
} // +++ scroll 방식의 tab 일 경우


function tabStateScroll(_elem) {// TODO - 검진 결과 디자인 완료 후 작업 예정
}

function clkElClickPopupChk(_elem) {
  var popHasElem = _elem.closest('.c-full-layer.show');

  if (popHasElem) {
    if (popHasElem.classList.contains('type-full')) clkElClickPopupChkFull(popHasElem);
    if (popHasElem.classList.contains('type-full-footer')) clkElClickPopupChkFullFooter(popHasElem);
  }
}

function clkElClickPopupChkFull(_popHasElem) {
  var TAB_POP_BODY_EL = _popHasElem.querySelector('.full-body');

  var TAB_POP_CONT_EL = _popHasElem.querySelector('.cont-box');

  var TAB_POP_BTN_EL = _popHasElem.querySelector('.btn-floating');

  if (TAB_POP_BODY_EL) TAB_POP_BODY_EL.classList.add('type-flex');
  if (TAB_POP_CONT_EL) if (TAB_POP_CONT_EL.classList.contains('type-btn-floating')) TAB_POP_BTN_EL.classList.remove('.type-btn-floating');
  if (TAB_POP_BTN_EL) if (TAB_POP_BTN_EL.classList.contains('isScroll')) TAB_POP_BTN_EL.classList.remove('isScroll');
  fullPopupScrollHeightCheck('full', _popHasElem);
}

function clkElClickPopupChkFullFooter(_popHasElem) {
  var TAB_POP_BTN_ELEM = _popHasElem.querySelector('.full-footer');

  if (TAB_POP_BTN_ELEM) if (TAB_POP_BTN_ELEM.classList.contains('scroll')) TAB_POP_BTN_ELEM.classList.remove('scroll');
  fullPopupScrollHeightChk('full-footer', popHasElem);
} // X XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// +++ 팝업에서 tab 터치 시 full 팝업 c-container 높이가 변할 경우


function clkElClickPopupCheck(_elem) {
  var popHasElem = _elem.closest('.c-full-layer.show');

  if (popHasElem) {
    var TAB_POP_BTN_ELEM = popHasElem.querySelector('.full-footer');
    if (TAB_POP_BTN_ELEM) if (TAB_POP_BTN_ELEM.classList.contains('scroll')) TAB_POP_BTN_ELEM.classList.remove('scroll');
    if (popHasElem.classList.contains('type-full')) fullPopupScrollHeightChk('full', popHasElem);
    if (popHasElem.classList.contains('type-full-footer')) fullPopupScrollHeightChk('full-footer', popHasElem);
  }
} // X XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// // 사용안함 +++ tab 터치 시 panel의 내용이 바뀌는 방식의 tab 일 경우


function tabStateClick(_elem) {
  // panel의 aria-labelledby를 터치한 탭의 aria-controls로 변경
  var TAB_ONE_WRAP = _elem.closest('.c-tab');

  if (TAB_ONE_WRAP) {
    var TAB_ONE_TAB = TAB_ONE_WRAP.dataset.onetab;

    if (TAB_ONE_TAB) {
      var TAB_ONE_PANEL = document.querySelector('[data-onepanel="' + TAB_ONE_TAB + '"]');

      if (TAB_ONE_PANEL) {
        var ONE_TARGET_TAB = _elem.getAttribute('aria-controls');

        if (ONE_TARGET_TAB) TAB_ONE_PANEL.setAttribute('aria-labelledby', ONE_TARGET_TAB);
      }
    }
  } // tab의 data-case에 해당하는 panel의 data-view가 보여짐


  var DATA_CASE = _elem.dataset["case"];

  var DATA_TAB_LIST = _elem.closest('.c-tab');

  if (DATA_CASE && DATA_TAB_LIST) {
    var DATA_VIEW = document.querySelectorAll('*[data-view="' + DATA_CASE + '"]');

    if (DATA_VIEW.length > 0) {
      var DATA_WRAP = DATA_VIEW[0].closest('.tab-click-list');

      if (DATA_WRAP) {
        var DATA_LIST = DATA_WRAP.querySelectorAll('[data-view]');

        if (DATA_LIST) {
          for (var _i8 = 0; _i8 < DATA_LIST.length; _i8++) {
            DATA_LIST[_i8].classList.remove('show');
          }

          for (var _i9 = 0; _i9 < DATA_VIEW.length; _i9++) {
            DATA_VIEW[_i9].classList.add('show');
          }
        }
      }
    } else {
      // 해당하는 리스트가 없는 경우
      var DATA_NULL_DATA = DATA_TAB_LIST.dataset.tablist;
      var DATA_NULL_WRAP = document.querySelector('[data-tabpanel="' + DATA_NULL_DATA + '"]');

      if (DATA_NULL_WRAP) {
        var DATA_NULL_LIST = DATA_NULL_WRAP.querySelectorAll('[data-view]');

        if (DATA_NULL_LIST.length > 0) {
          for (var _i10 = 0; _i10 < DATA_NULL_LIST.length; _i10++) {
            DATA_NULL_LIST[_i10].classList.remove('show');
          }
        } // 전체 tab click


        if (DATA_CASE === 'all') {
          for (var _i11 = 0; _i11 < DATA_NULL_LIST.length; _i11++) {
            DATA_NULL_LIST[_i11].classList.add('show');
          }
        }
      }
    }
  }
} // +++ tab 터치 시 페이지 이동하는 tab 일 경우


function tabStateMove(_elem) {
  var TAB_WRAP = _elem.closest('.c-tab');

  if (TAB_WRAP) tabStateMoveConm(TAB_WRAP);
}

function tabStateMoveConm(_tabWrap) {
  var TAB_MOVE_LIST = _tabWrap.querySelectorAll('li');

  if (TAB_MOVE_LIST.length > 0) tabStateMoveConmEvt(TAB_MOVE_LIST, _tabWrap);
}

function tabStateMoveConmEvt(_tabMoveList, _tabWrap) {
  for (var _i12 = 0; _i12 < _tabMoveList.length; _i12++) {
    var activeTab = _tabMoveList[_i12].querySelectorAll('a.tab.active');

    if (activeTab.length > 0) moveTabActivity(_tabWrap, _tabMoveList[_i12]);
  }
}

function moveTabActivity(_wrap, _tab) {
  if (_wrap && _tab) {
    var TAB_WRAP_NAME = _wrap.dataset.tablist;

    var TAB_ATTR = _tab.getAttribute('aria-controls');

    if (TAB_WRAP_NAME && TAB_ATTR) moveTabActivityComn(TAB_WRAP_NAME, TAB_ATTR, _wrap, _tab);
  }
}

function moveTabActivityComn(_tabWrapName, _tabAttr, _wrap, _tab) {
  var PANEL_SELECTOR = document.querySelector('[data-panelname="' + _tabWrapName + '"]');

  if (PANEL_SELECTOR) {
    PANEL_SELECTOR.setAttribute('aria-labelledby', _tabAttr); // 선택된 tab 중앙 이동

    moveTabCenterScroll(_wrap, _tab);
  }
} // 선택된 tab 중앙 이동 - 取捨選擇


function moveTabCenterScroll(_scrollBody, _activeEl) {
  if (_scrollBody && _activeEl) moveTabCenterScrollComn(_activeEl, _scrollBody);
}

function moveTabCenterScrollComn(_activeEl, _scrollBody) {
  var tabLeft = _activeEl.offsetLeft;
  var tabStyle = _scrollBody.currentStyle || window.getComputedStyle(_scrollBody);
  var tabPadRes = parseInt(tabStyle.paddingLeft) + parseInt(tabStyle.paddingRight);
  var tabWidth = _scrollBody.clientWidth - tabPadRes;
  var tabDiff = tabLeft - tabWidth / 2;

  _scrollBody.scroll({
    left: tabDiff,
    behavior: 'smooth'
  });
} // 사용안함
// panel 내용이 바뀌는 방식의 tab 일 경우
// 탭과 연동된 tab-click-list 모두 보임


function tabClickListAllShow(_tabWrap) {
  var dataTabList = _tabWrap.dataset.tablist;

  if (dataTabList) {
    var DATA_TAB_PANEL = document.querySelector('*[data-tabpanel="' + dataTabList + '"]');

    if (DATA_TAB_PANEL) {
      var PANEL_VIEW_LIST = DATA_TAB_PANEL.querySelectorAll('*[data-view]');

      if (PANEL_VIEW_LIST.length > 0) {
        for (var _i13 = 0; _i13 < PANEL_VIEW_LIST.length; _i13++) {
          PANEL_VIEW_LIST[_i13].classList.add('show');
        }
      }
    }
  }
}
/**
 * popup
*/
// 화면에 팝업이 있을 경우 공통 스타일 적용
// 팝업 필수 class: kmi-popup


var POPUP_ELEM = document.querySelectorAll('.kmi-popup'); // style

if (POPUP_ELEM.length > 0) for (var _i14 = 0; _i14 < POPUP_ELEM.length; _i14++) {
  popupStyle(POPUP_ELEM[_i14], 'hide');
} // 팝업 열림

var POPUP_BTN_ELEM = document.querySelectorAll('.btn-open-popup');

if (POPUP_BTN_ELEM.length > 0) {
  var _loop = function _loop(_i15) {
    // popup open button - click event
    POPUP_BTN_ELEM[_i15].addEventListener('click', function () {
      var TARGET = POPUP_BTN_ELEM[_i15].getAttribute('data-target');

      var CURRENT_POPUP = document.getElementById(TARGET);
      CURRENT_POPUP.classList.add('show');
      CURRENT_POPUP.setAttribute('aria-hidden', false); // 접근성: popup 오픈 시 #container focus 막기

      containerHidden(true); // 팝업 종류 체크

      var popupState = popupStateCheck(CURRENT_POPUP); // style

      popupStyle(CURRENT_POPUP, 'show'); // 접근성

      focusFirstBtn(popupState, CURRENT_POPUP); // 팝업 배경 click event
      // 220923 - 현업 요청으로 제거
      // popupBgClickEvt(CURRENT_POPUP);
      // full type: 스크롤 되는 경우

      popupScrollCase(popupState, CURRENT_POPUP);
    });
  };

  for (var _i15 = 0; _i15 < POPUP_BTN_ELEM.length; _i15++) {
    _loop(_i15);
  }
} // + 팝업 종류 체크


function popupStateCheck(_popState) {
  var popCase = _popState.classList; // 모달 팝업: modal

  if (popCase.contains('type-modal')) return 'modal'; // 푸터 없는 풀팝업: full
  else if (popCase.contains('type-full')) return 'full'; // 푸터 있는 풀팝업: full-footer
  else if (popCase.contains('type-full-footer')) return 'full-footer';
} // + 팝업 style - top, z-index, visibility


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
} // + 팝업 배경 click event


function popupBgClickEvt(_elem) {
  var POPUP_BG_ELEM = _elem.querySelector('.popup-bg');

  if (POPUP_BG_ELEM) {
    POPUP_BG_ELEM.addEventListener('click', function () {
      // 팝업 닫힘
      _elem.classList.remove('show');

      _elem.setAttribute('aria-hidden', true); // style - 사라지는 animation을 위해 setTimeout 사용


      setTimeout(function () {
        popupStyle(_elem, 'hide');
      }, ANI_TIME_300);
    });
  }
} // + full type: 스크롤 되는 경우 check


function popupScrollCase(_state, _elem) {
  // if (_state === 'full') fullScrollCheck(_elem);
  if (_state === 'full') fullScrollChk(_elem);
  if (_state === 'full-footer') fullFooterScrollCheck(_elem);
}

function fullScrollChk(_elem) {
  var F_CONTAINER = _elem.querySelector('.c-container');

  if (F_CONTAINER) {
    var F_HEADER = F_CONTAINER.querySelector('.full-header');
    var F_BODY = F_CONTAINER.querySelector('.full-body');
    var F_BUTTON = F_CONTAINER.querySelector('.btn-floating');
    if (F_HEADER && F_BODY && F_BUTTON) fullScrollEvt(F_CONTAINER, F_HEADER, F_BODY, F_BUTTON);
  }
}

function fullScrollEvt(_container, _header, _body, _fBtn) {
  _body.classList.add('type-flex');

  if (_body.scrollHeight > _body.clientHeight) {
    _body.classList.remove('type-flex');

    _fBtn.classList.add('isScroll');

    _body.addEventListener('scroll', function () {
      // scroll end check
      var scrollRes = _body.offsetHeight + _body.scrollTop; // scroll down end

      if (scrollRes >= _body.scrollHeight) _fBtn.classList.add('isScrollEnd');else _fBtn.classList.remove('isScrollEnd');
    });
  } else {
    _fBtn.classList.remove('isScroll');
  }
} // X XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// ++ full type 일 경우


function fullScrollCheck(_elem) {
  var F_CONTAINER = _elem.querySelector('.c-container');

  if (F_CONTAINER) {
    var F_HEADER = F_CONTAINER.querySelector('.full-header');
    var F_BODY = F_CONTAINER.querySelector('.full-body');
    var F_FOOTER = F_CONTAINER.querySelector('.full-footer'); // full-body가 스크롤 되는지 체크

    if (F_HEADER && F_BODY && F_FOOTER) fullScrollEvent(F_CONTAINER, F_HEADER, F_BODY, F_FOOTER);
  }
} // +++ full type의 container가 스크롤 될 경우


function fullScrollEvent(_container, _header, _body, _footer) {
  var bStyle = _body.currentStyle || window.getComputedStyle(_body);
  var cHeight = _container.clientHeight;
  var hHeight = _header.clientHeight; // let bHeight = _body.scrollHeight;

  var bhInit = parseInt(bStyle.paddingBottom);
  var bHeight = _body.clientHeight + bhInit > _body.scrollHeight ? _body.clientHeight + bhInit : _body.scrollHeight;
  var fHeight = _footer.clientHeight; // 100px || 72px

  var hRes = cHeight - (hHeight + 72);

  if (bHeight > hRes) {
    // bottom fixed 버튼: 애니메이션 제거
    // _footer.style.transition = 'none';
    // footer addClass: scroll
    _footer.classList.add('scroll'); // scroll end event check


    fullScrollEndEvent(_container, _body, _footer);
  }
} // ++++ scroll end event check


function fullScrollEndEvent(_scrollContainer, _scrollBody, _buttonEl) {
  // let scrollInit = 0;
  _scrollBody.addEventListener('scroll', function () {
    // bottom fixed 버튼: 애니메이션 적용
    // _buttonEl.style.transition = 'padding .1s ease-in-out';
    // scroll up
    if (!timeout) {
      // scroll end check
      var scrollRes = _scrollBody.offsetHeight + _scrollBody.scrollTop; // scroll down end

      if (scrollRes >= _scrollBody.scrollHeight) _buttonEl.classList.remove('scroll');
      if (scrollRes < _scrollBody.scrollHeight - 28) _buttonEl.classList.add('scroll');
    }
  });
} // X XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// ++ full footer type 일 경우


function fullFooterScrollCheck(_elem) {
  var FF_CONTAINER = _elem.querySelector('.c-container');

  if (FF_CONTAINER) {
    var FF_HEADER = FF_CONTAINER.querySelector('.full-header');
    var FF_BODY = FF_CONTAINER.querySelector('.full-body');
    var FF_BUTTON = FF_CONTAINER.querySelector('.full-footer');
    var FF_FOOTER = FF_CONTAINER.querySelector('.footer'); // fixed 버튼 있는 full-body가 스크롤 되는지 체크

    if (FF_HEADER && FF_BODY && FF_BUTTON && FF_FOOTER) fullFooterScrollEvent(_elem, FF_CONTAINER, FF_HEADER, FF_BODY, FF_BUTTON, FF_FOOTER); // fixed 버튼 없는 full-body가 스크롤 되는지 체크

    if (FF_HEADER && FF_BODY && FF_FOOTER) fullNoFooterScrollEvent(_elem, FF_CONTAINER, FF_HEADER, FF_BODY, FF_FOOTER);
  }
} // +++ fixed 버튼 없는 full-body가 스크롤 되는지 체크


function fullNoFooterScrollEvent(_popEl, _container, _header, _body, _footer) {
  var cHeight = _container.clientHeight;
  var hHeight = _header.clientHeight;
  var bHeight = _body.scrollHeight;
  var fHeight = _footer.clientHeight;
  var hRes = cHeight - (hHeight + fHeight);
  if (bHeight > hRes) _popEl.classList.add('type-scroll');
} // +++ fixed 버튼 있는 full-body가 스크롤 되는지 체크


function fullFooterScrollEvent(_popEl, _container, _header, _body, _btnEl, _footer) {
  var cHeight = _container.clientHeight;
  var hHeight = _header.clientHeight;
  var bHeight = _body.scrollHeight;
  var btnHeight = _btnEl.clientHeight; // 72px || 100px

  var fHeight = _footer.clientHeight;
  var hRes = cHeight - (hHeight + fHeight + btnHeight);

  if (bHeight > hRes) {
    // popup addClass: type-scroll
    _popEl.classList.add('type-scroll'); // fixed button addClass: scroll


    _btnEl.classList.add('scroll');

    _container.scrollTop = 1;
    setTimeout(function () {
      _container.scrollTop = 0;
    }, INTERVAL_1); // scroll end event check

    fullFooterScrollEndEvent(_container, _btnEl, _footer);
  }
} // ++++ scroll end event check


function fullFooterScrollEndEvent(_scrollContainer, _buttonEl, _footerEl) {
  _scrollContainer.addEventListener('scroll', function () {
    // scroll end check
    var scrollRes = _scrollContainer.offsetHeight + _scrollContainer.scrollTop + 50;
    var scrollRight = _scrollContainer.scrollHeight - _footerEl.clientHeight; // scroll down end

    if (scrollRes >= scrollRight) if (_buttonEl.classList.contains('scroll')) _buttonEl.classList.remove('scroll'); // scroll up

    var scrollResUp = _scrollContainer.scrollHeight - _footerEl.clientHeight;
    if (scrollRes < scrollResUp) if (!_buttonEl.classList.contains('scroll')) _buttonEl.classList.add('scroll');
  });
} // 팝업 닫힘 - 닫힘버튼 class: popup-btn-close


var POPUP_CLOSE_ELEM = document.querySelectorAll('.popup-btn-close');

if (POPUP_CLOSE_ELEM.length > 0) {
  var _loop2 = function _loop2(_i16) {
    // popup close button - click event
    POPUP_CLOSE_ELEM[_i16].addEventListener('click', function () {
      var TARGET = POPUP_CLOSE_ELEM[_i16].closest('.kmi-popup');

      TARGET.classList.remove('show');
      TARGET.setAttribute('aria-hidden', true); // 접근성: popup close 시 #container focus 풀기

      containerHidden(false); // style - 사라지는 animation을 위해 setTimeout 사용

      setTimeout(function () {
        popupStyle(TARGET, 'hide');
        focusCloseState(TARGET);
      }, ANI_TIME_300);
    });
  };

  for (var _i16 = 0; _i16 < POPUP_CLOSE_ELEM.length; _i16++) {
    _loop2(_i16);
  }
} // 팝업: 접근성
// + 팝업 닫을 때 열었던 버튼에 focus 시키기


function focusCloseState(_elem) {
  setTimeout(function () {
    var FOCUS_ELEM = document.querySelector("[data-target=\"".concat(_elem.id, "\"]"));
    if (FOCUS_ELEM) FOCUS_ELEM.focus();
  }, INTERVAL_1);
} // + modal type 이면 X 버튼에 focus 시키기
// + full type 이면 뒤로가기 버튼에 focus 시키기


function focusFirstBtn(_state, _elem) {
  setTimeout(function () {
    var focus_el = new Object();
    if (_state === 'full-footer' || _state === 'full') focus_el = _elem.querySelectorAll('.btn-go-back');else if (_state === 'modal') focus_el = _elem.querySelectorAll('.popup-btn-close');
    if (focus_el) setTimeout(function () {
      focus_el[0].focus();
    }, INTERVAL_1);
  }, INTERVAL_1);
} // DOM에 풀팝업이 있을 경우 


function fullPopupState() {
  var FULL_POP_ELEM = document.querySelectorAll('.c-full-layer.show');

  if (FULL_POP_ELEM.length > 0) {
    for (var _i17 = 0; _i17 < FULL_POP_ELEM.length; _i17++) {
      if (FULL_POP_ELEM[_i17].classList.contains('type-full')) fullPopupScrollHeightCheck('full', FULL_POP_ELEM[_i17]);
      if (FULL_POP_ELEM[_i17].classList.contains('type-full-footer')) fullPopupScrollHeightChk('full-footer', FULL_POP_ELEM[_i17]);
    }
  }
} // + resize: DOM에 팝업이 있는 경우


function fullPopupScrollHeightCheck(_type, _popEl) {
  var F_CONTAINER = _popEl.querySelector('.c-container');

  if (F_CONTAINER) {
    var F_HEADER = F_CONTAINER.querySelector('.full-header');
    var F_BODY = F_CONTAINER.querySelector('.full-body');
    var F_BUTTON = F_CONTAINER.querySelector('.btn-floating');
    if (F_HEADER && F_BODY && F_BUTTON) if (_type === 'full') fullScrollEvt(F_CONTAINER, F_HEADER, F_BODY, F_BUTTON);
  }
} // X XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// + resize: DOM에 팝업이 있는 경우


function fullPopupScrollHeightChk(_type, _popEl) {
  var FULL_CONTAINER = _popEl.querySelector('.c-container');

  if (FULL_CONTAINER) {
    var FULL_HEADER = FULL_CONTAINER.querySelector('.full-header');
    var FULL_BODY = FULL_CONTAINER.querySelector('.full-body');
    var FULL_FOOTER = FULL_CONTAINER.querySelector('.full-footer'); // full type

    if (_type === 'full') fullResizeEvent(FULL_CONTAINER, FULL_HEADER, FULL_BODY, FULL_FOOTER);
  }
} // ++ reize check


function fullResizeEvent(_container, _header, _body, _footer) {
  var bStyle = _body.currentStyle || window.getComputedStyle(_body);
  var cHeight = _container.clientHeight;
  var hHeight = _header.clientHeight;
  var bhInit = parseInt(bStyle.paddingBottom);
  var bHeight = _body.clientHeight + bhInit > _body.scrollHeight ? _body.clientHeight + bhInit : _body.scrollHeight; // let fHeight = _footer.clientHeight; // 100px || 72px

  var fHeight = 72;
  var hRes = cHeight - (hHeight + fHeight); // footer addClass: scroll

  if (bHeight > hRes) _footer.classList.add('scroll'); // footer removeClass: scroll
  else _footer.classList.remove('scroll'); // reisze 했을 때 scroll이 최하단일 경우

  if (_body.offsetHeight + _body.scrollTop >= _body.scrollHeight) _footer.classList.remove('scroll');
} // X XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

/**
 * accordion
*/


var ACCORDION_ELEM = document.querySelectorAll('.accordion');

if (ACCORDION_ELEM.length > 0) {
  for (var _i18 = 0; _i18 < ACCORDION_ELEM.length; _i18++) {
    // 아코디언 타입체크
    var accordionType = accordionTypeCheck(ACCORDION_ELEM[_i18]); // 접근성

    accordionAccessibility(ACCORDION_ELEM[_i18]);

    var BTN_OPEN = ACCORDION_ELEM[_i18].querySelectorAll('.accordion-header'); // acc button click event


    if (BTN_OPEN.length > 0) accButtonClickEvent(ACCORDION_ELEM[_i18], BTN_OPEN[0], accordionType);
  }
} // + 아코디언 타입 체크: 하나만 보이는 타입, 모두 보이는 타입


function accordionTypeCheck(_accEl) {
  if (_accEl.classList.contains('type-open-one')) return 'type-one-open';
  return 'type-multi-open';
} // + 접근성: aria-expanded


function accordionAccessibility(_elem) {
  if (_elem.classList.contains('open')) {
    _elem.querySelector('.accordion-header').setAttribute('aria-expanded', true);

    _elem.querySelector('.accordion-body').setAttribute('tabindex', 0);

    _elem.querySelector('.accordion-body').setAttribute('aria-hidden', false);
  } else {
    _elem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');

    _elem.querySelector('.accordion-body').setAttribute('tabindex', -1);

    _elem.querySelector('.accordion-body').setAttribute('aria-hidden', true);
  }
} // + acc button click event


function accButtonClickEvent(_accWrap, _elem, _accType) {
  var accBodyEl = _accWrap.querySelector('.accordion-body');

  var bodyHeight = accBodyEl.scrollHeight; // 열려있는 아코디언이 있을 경우

  if (_accWrap.classList.contains('open')) {
    _accWrap.querySelector('.accordion-body').style.maxHeight = bodyHeight + 'px';
  }

  _elem.addEventListener('click', function (e) {
    // 터치하는 영역이 '비교하기' 버튼이 아닐 경우 - 아코디언 hide / show
    if (!e.target.parentElement.classList.contains('co-btn')) {
      // 터치 시 하나만 보이는 타입
      if (_accType === 'type-one-open') {
        // 아코디언이 열려있으면
        if (!_accWrap.classList.contains('open')) {
          var ACC_WRAP = _accWrap.closest('.accordion-list');

          if (ACC_WRAP) {
            // 아코디언 모두 닫기
            var accOneList = ACC_WRAP.querySelectorAll('.accordion');

            for (var _i19 = 0; _i19 < accOneList.length; _i19++) {
              accOneList[_i19].classList.remove('open');

              accOneList[_i19].querySelector('.accordion-body').style.maxHeight = 0;

              accOneList[_i19].querySelector('.accordion-body').setAttribute('tabindex', -1);

              accOneList[_i19].querySelector('.accordion-body').setAttribute('aria-hidden', true);

              accOneList[_i19].querySelector('.accordion-header').setAttribute('aria-expanded', false);
            }
          }
        }
      }

      if (_accWrap.classList.contains('open')) {
        _accWrap.classList.remove('open');

        accBodyEl.style.maxHeight = 0;
      } else {
        _accWrap.classList.add('open');

        accBodyEl.style.maxHeight = bodyHeight + 'px';
      } // 접근성


      accordionAccessibility(_accWrap);
    }
  });
} // + 아코디언 모두닫힘


function accordionAllClose(_accEl) {
  for (var _i20 = 0; _i20 < _accEl.length; _i20++) {
    _accEl[_i20].classList.remove('open');

    _accEl[_i20].querySelector('.accordion-body').setAttribute('tabindex', -1);

    _accEl[_i20].querySelector('.accordion-body').setAttribute('aria-hidden', true);

    _accEl[_i20].querySelector('.accordion-body').style.maxHeight = 0;
  }
}
/**
 * terms
*/


var TERMS_ELEM = document.querySelectorAll('.terms-box');
if (TERMS_ELEM.length > 0) termsComn(TERMS_ELEM); // + 약관이 있으면

function termsComn(_elem) {
  for (var _i21 = 0; _i21 < TERMS_ELEM.length; _i21++) {
    var TERMS_INNER = TERMS_ELEM[_i21].querySelectorAll('.inner');

    termsInner(TERMS_INNER, TERMS_ELEM[_i21]);
  }
}

function termsInner(_inner, _elem) {
  if (_inner.length > 0) for (var j = 0; j < _inner.length; j++) {
    temrsRow(_inner[j], _elem);
  }
} // ++ 약관에 내용이 있으면


function temrsRow(_row, _elem) {
  if (_row.scrollHeight > _elem.clientHeight + 2) {
    var TERMS_ROW = _row.querySelectorAll('.terms-row');

    termsAppend(TERMS_ROW, _elem, _row);
  }
} // +++ 약관에 내용이 길면


function termsAppend(_row, _elem, _rowEl) {
  if (_row.length > 0) {
    var scrollEl = document.createElement('div');
    var scrollInner = document.createElement('span');
    scrollEl.classList.add('terms_scroll');
    scrollEl.setAttribute('aria-hidden', true);
    scrollEl.appendChild(scrollInner); // 스크롤바 element 만들기

    _elem.appendChild(scrollEl); // 스크롤바 scroll event


    termsScrollEvent(_rowEl, scrollEl, scrollInner);
  }
} // ++++ 스크롤바 scroll event


function termsScrollEvent(_scrollBody, _scrollWrap, _scrollElem) {
  var scrollRes = 0;
  var isScrolling;

  _scrollBody.addEventListener('scroll', function () {
    window.clearTimeout(isScrolling);

    if (this.scrollTop > 0) {
      _scrollWrap.classList.add('show');

      scrollRes = (100 - _scrollElem.clientHeight) / (this.scrollHeight - this.clientHeight) * this.scrollTop;
      _scrollElem.style.top = "".concat(scrollRes, "%");
    } else {
      _scrollElem.style.top = '0';
    } // scroll stop event


    isScrolling = setTimeout(function () {
      if (_scrollWrap.classList.contains('show')) _scrollWrap.classList.remove('show');
    }, INTERVAL_1000);
  });
}
/**
 * input
*/


var INPUT_ELEM = document.querySelectorAll('input');

if (INPUT_ELEM.length > 0) {
  for (var _i22 = 0; _i22 < INPUT_ELEM.length; _i22++) {
    inputComn(INPUT_ELEM[_i22]);
  }
} // input 공통 scritp


function inputComn(_elem) {
  var inputTypeState = inputTypeCase(_elem);
  inputFocusEvent(_elem, inputTypeState);
} // + input type check


function inputTypeCase(_input) {
  var inputCase = _input.type;

  switch (inputCase) {
    case 'text':
    case 'password':
    case 'number':
      return 'default';
      break;

    default:
      break;
  }
} // + input [text, password, number] focus event


function inputFocusEvent(_inputEl, _inputState) {
  if (_inputState === 'default') {
    _inputEl.addEventListener('focus', function () {
      // floating 버튼 있는 full 팝업
      var floatinPopup = document.querySelector('.c-full-layer.kmi-popup.show');

      if (floatinPopup) {
        var floatinBtn = floatinPopup.querySelector('.full-footer.scroll');

        if (floatinBtn) {
          floatinPopup.classList.add('input-focus');
          floatinBtn.classList.remove('scroll');
          this.addEventListener('blur', function () {
            floatinBtn.classList.add('scroll');
            floatinPopup.classList.remove('input-focus');
          });
        }
      } // modal 팝업


      var modalPopup = document.querySelector('.c-layer-popup.kmi-popup.show');

      if (modalPopup) {
        modalPopup.classList.add('input-focus');
        this.addEventListener('blur', function () {
          modalPopup.classList.remove('input-focus');
        });
      }
    });
  }
}
/**
 * #container scroll event
*/


var CONTAINER_ELEM = document.querySelector('#container');

if (CONTAINER_ELEM) {
  var FLEX_ELEM = CONTAINER_ELEM.querySelector('.flex-wrap');

  if (FLEX_ELEM) {
    var MOVE_HEADER = FLEX_ELEM.querySelector('.header.co-header');

    if (MOVE_HEADER) {
      var headerHeight = MOVE_HEADER.clientHeight;
      var lastScrollTop = 0; // move top button

      var MOVE_TOP_BTN_ELEM = document.querySelector('.btn-move-top');
      CONTAINER_ELEM.addEventListener('scroll', function () {
        if (this.scrollTop > headerHeight) {
          var st = this.pageYOffset || this.scrollTop; // SCROLL: DOWN

          if (st > lastScrollTop) MOVE_HEADER.classList.add('scroll-hide'); // SCROLL: UP 
          else MOVE_HEADER.classList.remove('scroll-hide');
          lastScrollTop = st <= 0 ? 0 : st;
        }

        if (this.scrollTop <= 0) MOVE_HEADER.classList.remove('scroll-hide');

        if (MOVE_TOP_BTN_ELEM) {
          if (this.scrollTop <= 0) MOVE_TOP_BTN_ELEM.classList.add('hide');else MOVE_TOP_BTN_ELEM.classList.remove('hide');
        }
      }, false);
    }
  }
}
/**
 * 최상단 스크롤 이동 버튼 click event
*/


var BTN_MOVE_TOP_ELEM = document.querySelector('.btn-move-top');

if (BTN_MOVE_TOP_ELEM) {
  var SCROLLING_ELEM = document.getElementById('container');

  if (SCROLLING_ELEM) {
    if (SCROLLING_ELEM.scrollTop <= 0) BTN_MOVE_TOP_ELEM.classList.add('hide');
    BTN_MOVE_TOP_ELEM.addEventListener('click', function () {
      SCROLLING_ELEM.scrollTop = 0;
    });
  }
}
/**
 * floating tab
*/


var STICKYELM = document.querySelector('.c-tab.type-floating');

if (STICKYELM) {
  var scrollEl = document.querySelector('#container');

  if (scrollEl) {
    var tabOffsetTop = STICKYELM.offsetTop;
    scrollEl.addEventListener('scroll', function () {
      // scrolling
      var tabOffsetTopScroll = STICKYELM.offsetTop;
      if (tabOffsetTop == tabOffsetTopScroll) STICKYELM.classList.remove('isScroll');else STICKYELM.classList.add('isScroll');
    });
  }
}
//# sourceMappingURL=maps/common.js.map
