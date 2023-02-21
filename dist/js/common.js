'use strict'; // = Common

/**
 * common variable
 */
// animation time

var ANI_TIME_300 = 301; // interval time

var INTERVAL_1 = 1;
var INTERVAL_100 = 100;
var INTERVAL_1000 = 1000; // scroll

var SHOW_HEADER_NUM = 100; // 이 숫자만큼 스크롤을 올려야 .co-header가 보임

var SCROLL_TIME = 0.5; // 초(second), 이 숫자만큼의 스피드로 scroll top 이동

var INVERTED = 55;
/**
 * common interface
 */
// POPUP

var IPOPUP = {
  iModal: {
    mAlert: 'mAlert',
    mHeader: 'mHeader'
  },
  iFull: {
    fLayer: 'fLayer',
    fFooter: 'fFooter'
  }
}; // ACCORDION

var IACCORDION = {
  iAll: 'iAll',
  iOne: 'iOne'
};
var ACC_ALT_TXT = {
  open: '버튼확장됨축소하려면이중탭하십시요',
  close: '버튼축소됨확장하려면이중탭하십시요'
}; // container

var elTopArr = [];
var elTopRes = 0;
/**
 * HTML element length check
 */

function elemLenCheck() {
  var okEl = 1;

  if (arguments.length > 0) {
    for (var i = 0; i < arguments.length; i++) {
      if (document.querySelectorAll(i < 0 || arguments.length <= i ? undefined : arguments[i]).length > 0) {
        okEl += 1;

        if (okEl === arguments.length) {
          okEl = 0;
          return true;
        }
      }

      return false;
    }
  }
}
/**
 * load event
 */


document.addEventListener('readystatechange', function (event) {
  // does same as:  ..addEventListener("DOMContentLoaded"..
  // When HTML/DOM elements are ready:
  if (event.target.readyState === 'interactive') {} // When window loaded ( external resources are loaded too- css, src, etc...)


  if (event.target.readyState === 'complete') {
    commonInit();
  }
});
/**
 * 접근성 공통
 */
// #container -> aria-hidden: true || false

function containerHidden(_state) {
  var GNB_CONTAINER_EL = document.getElementById('container');

  if (GNB_CONTAINER_EL) {
    if (_state) {
      GNB_CONTAINER_EL.setAttribute('aria-hidden', true);
    } else {
      var OPEN_POPUPS = document.querySelectorAll('.kmi-popup.show');
      if (OPEN_POPUPS.length == 0) GNB_CONTAINER_EL.setAttribute('aria-hidden', false);
    }
  }
}
/**
 * common function
 */


function commonInit() {
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

      fullPopupState(); // modal header popup: header shadow

      modalHeaderPopupShadow(); // full layer popup: resize scrollbar

      fullPopupResizeScrollbar(); // container resize scrollbar

      containerResizeScrollbar(); // container resize bottom floating button

      containerResizeFloatingBtn();
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

    var tabState = tabStateCheck(_wrap); // panel 내용이 바뀌는 방식의 tab 일 경우 + scroll Type

    if (_wrap.classList.contains('type-move')) {
      setTimeout(function () {
        tabStateMove(_elem);
      }, INTERVAL_1);
    } // [Mod [230220]]


    if (_wrap.classList.contains('type-scroll')) {
      setTimeout(function () {
        tabScrollEvt();
      }, INTERVAL_1);
    } // talkback event listener
    // + 탭 터치 event


    if (_ipt.tagName !== 'A' && _ipt.tagName !== 'a') {
      _ipt.parentElement.addEventListener('click', function () {
        _ipt.checked = true;
        tabClickComn(_wrap, _elem, _ipt, tabState, _j);
      });
    } else {
      _ipt.addEventListener('click', function () {
        tabClickComn(_wrap, _elem, _ipt, tabState, _j);
      });
    }
  } // ++ tab click common


  function tabClickComn(_wrap, _elem, _ipt, _tabState, _j) {
    // focus 제거
    var FOCUS_INPUT = document.querySelectorAll('.input-focus');
    if (FOCUS_INPUT.length > 0) for (var _i4 = 0; _i4 < FOCUS_INPUT.length; _i4++) {
      FOCUS_INPUT[_i4].classList.remove('input-focus');
    } // 팝업에서 tab 터치 시 팝업 c-container 높이가 변할 경우
    // 애니메이션 타임: 100
    // setTimeout(() => { clkElClickPopupCheck(_elem) }, INTERVAL_1);

    setTimeout(function () {
      clkElClickPopupChk(_elem);
    }, INTERVAL_1); // 대체텍스트 적용

    if (_ipt.tagName !== 'A' && _ipt.tagName !== 'a') {
      var altEl = _wrap.querySelectorAll('.alt-txt');

      if (altEl.length > 0) applyTabAltText(_ipt, altEl, _j);
    } // hide / show 방식의 tab 일 경우


    if (_tabState === 'hide-type') tabStatePanel(_elem); // scroll 방식의 tab 일 경우

    if (_tabState === 'scroll-type') tabStateScroll(_elem); // panel 내용이 바뀌는 방식의 tab 일 경우

    if (_tabState === 'click-type') tabStateClick(_elem); // tab터치 시 tab의 하단 bar가 animation되는 경우

    if (_ipt.closest('.c-tab').classList.contains('type-basic')) tabBarTouchAnimation(_elem); // center 정렬 필요한 tab

    var centerType = tabCenterCheck(_wrap);
    if (centerType) tabCenterEvent(_wrap, _elem);
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

    if (_ipt.tagName == 'A') {
      if (_elem.closest('.c-tab').classList.contains('type-step')) {
        altElBefore.innerText = '선택안됨페이지이동안됨이중탭하면팝업열림';
        if (_ipt.classList.contains('active')) _ipt.setAttribute('title', '기능없는버튼');else _ipt.setAttribute('title', '팝업열림');
      } else {
        altElBefore.innerText = '선택안됨이중탭시페이지이동';
        if (_ipt.classList.contains('active')) _ipt.setAttribute('title', '기능없는버튼');else _ipt.setAttribute('title', '페이지이동');
      }
    } else {
      altElBefore.innerText = '선택안됨';
    } // if (_ipt.classList.contains('is-disable')) altElBefore.innerText = '선택안됨비활성화됨';


    if (_ipt.classList.contains('is-disable')) {
      altElBefore.innerText = '이중탭하면팝업열림';

      _ipt.setAttribute('title', '팝업열림');
    }

    if (_ipt.classList.contains('is-save-data')) {
      altElBefore.innerText = '이중탭하면페이지이동';

      _ipt.setAttribute('title', '페이지이동');
    }

    _elem.insertBefore(altElBefore, _ipt);

    if (_ipt_checked) _ipt_checked.parentElement.querySelector('.alt-txt').innerText = '선택됨';
  } // +++ 터치 시 대체텍스트 적용 - 선택됨, 선택안됨


  function applyTabAltText(_ipt, _elem, _j) {
    HTMLElement.prototype.index = function () {
      var self = this.parentNode;
      var parent = self.parentNode;
      var i = 0;

      while (self.previousElementSibling) {
        i++;
        self = self.previousElementSibling;
      }

      return this.parentNode === parent.children[i] ? i : -1;
    };

    var indexRes = Number(_ipt.index() - 1);

    if (_ipt.closest('.c-tab').querySelector('.ico-plus')) {
      // 탭 제일 왼쪽에 +버튼이 있는 경우
      for (var k = 0; k < _elem.length; k++) {
        _elem[k].innerText = '선택안됨';
      }

      _elem[indexRes].innerText = '선택됨';
    } else {
      for (var _k = 0; _k < _elem.length; _k++) {
        _elem[_k].innerText = '선택안됨';
      }

      _elem[_j].innerText = '선택됨';
    }
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
      for (var _i5 = 0; _i5 < TAB_LI_ELEM.length; _i5++) {
        aniEl += 1;
      }

      _tabWrap.classList.add('tab-len-' + aniEl);

      aniEl = 0;

      for (var _i6 = 0; _i6 < TAB_LI_ELEM.length; _i6++) {
        tabBarAnimationComn(TAB_LI_ELEM[_i6], _i6);
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

    for (var _i7 = 0; _i7 < tabListEl.length; _i7++) {
      tabList.push(tabListEl[_i7].getAttribute('aria-controls'));
    }

    if (tabList.length > 0) tabStatePanelEvent(tabList); // 터치한 tab의 aria-controls와 동일한 aria-labelledby에게 addClass: show

    var AC = _elem.getAttribute('aria-controls');

    if (AC) {
      var activeAC = document.querySelector('[aria-labelledby=' + AC + ']');
      if (activeAC) activeAC.classList.add('show'); // .tabpanel.show에 있는 아코디언

      if (activeAC) tabAccInit(activeAC);
    }
  }

  function tabStatePanelEvent(_tabList) {
    for (var _i8 = 0; _i8 < _tabList.length; _i8++) {
      var panelEl = document.querySelector('[aria-labelledby="' + _tabList[_i8] + '"]');
      if (panelEl) if (panelEl.classList.contains('show')) panelEl.classList.remove('show');
    }
  }

  function tabAccInit(_panelEl) {
    if (_panelEl) {
      var ACC_EL = _panelEl.querySelectorAll('.accordion');

      if (ACC_EL.length > 0) {
        for (var _i9 = 0; _i9 < ACC_EL.length; _i9++) {
          var ACC_HEADER = ACC_EL[_i9].querySelector('.accordion-header');

          var ACC_BODY = ACC_EL[_i9].querySelector('.accordion-body');

          if (ACC_BODY && ACC_HEADER) {
            if (ACC_EL[_i9].classList.contains('open')) ACC_BODY.style.maxHeight = ACC_BODY.scrollHeight + 'px';else tabAccClickEvt(ACC_EL[_i9], ACC_HEADER, ACC_BODY);
          }
        }
      }
    }
  }

  function tabAccClickEvt(_accEl, _accHead, _accBody) {
    _accHead.addEventListener('click', function (e) {
      var accordionType = accordionTypeCheck(_accEl);
      var bodyHeight = _accBody.scrollHeight;
      accButtonClickEvtComn(e, accordionType, _accEl, _accBody, bodyHeight);
    });
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

    if (TAB_POP_BTN_EL) {
      if (TAB_POP_BTN_EL.classList.contains('isScroll')) TAB_POP_BTN_EL.classList.remove('isScroll');
      if (TAB_POP_BTN_EL.classList.contains('isScrollEnd')) TAB_POP_BTN_EL.classList.remove('isScrollEnd');
    }

    fullPopupScrollHeightCheck('full', _popHasElem);
  }

  function clkElClickPopupChkFullFooter(_popHasElem) {
    var TAB_POP_BTN_ELEM = _popHasElem.querySelector('.full-footer');

    if (TAB_POP_BTN_ELEM) if (TAB_POP_BTN_ELEM.classList.contains('scroll')) TAB_POP_BTN_ELEM.classList.remove('scroll');
    fullPopupScrollHeightChk('full-footer', _popHasElem);
  } // X XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  // +++ 팝업에서 tab 터치 시 full 팝업 c-container 높이가 변할 경우
  // function clkElClickPopupCheck(_elem) {
  //   let popHasElem = _elem.closest('.c-full-layer.show');
  //   if (popHasElem) {
  //     const TAB_POP_BTN_ELEM = popHasElem.querySelector('.full-footer');
  //     if (TAB_POP_BTN_ELEM) if (TAB_POP_BTN_ELEM.classList.contains('scroll')) TAB_POP_BTN_ELEM.classList.remove('scroll');
  //     if (popHasElem.classList.contains('type-full')) fullPopupScrollHeightChk('full', popHasElem);
  //     if (popHasElem.classList.contains('type-full-footer')) fullPopupScrollHeightChk('full-footer', popHasElem);
  //   }
  // }
  // X XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  // // 사용안함 +++ tab 터치 시 panel의 내용이 바뀌는 방식의 tab 일 경우


  function tabStateClick(_elem) {
    // panel의 aria-labelledby를 터치한 탭의 aria-controls로 변경
    var TAB_ONE_WRAP = _elem.closest('.c-tab');

    if (TAB_ONE_WRAP) tabStateClickAraiControls(TAB_ONE_WRAP); // 사용안함
    // tab의 data-case에 해당하는 panel의 data-view가 보여짐

    var DATA_CASE = _elem.dataset["case"];

    var DATA_TAB_LIST = _elem.closest('.c-tab');

    if (DATA_CASE && DATA_TAB_LIST) {
      var DATA_VIEW = document.querySelectorAll('*[data-view="' + DATA_CASE + '"]');

      if (DATA_VIEW.length > 0) {
        var DATA_WRAP = DATA_VIEW[0].closest('.tab-click-list');

        if (DATA_WRAP) {
          var DATA_LIST = DATA_WRAP.querySelectorAll('[data-view]');

          if (DATA_LIST) {
            for (var _i10 = 0; _i10 < DATA_LIST.length; _i10++) {
              DATA_LIST[_i10].classList.remove('show');
            }

            for (var _i11 = 0; _i11 < DATA_VIEW.length; _i11++) {
              DATA_VIEW[_i11].classList.add('show');
            }
          }
        }
      } else {
        // 해당하는 리스트가 없는 경우
        var DATA_NULL_DATA = DATA_TAB_LIST.dataset.tablist;
        var DATA_NULL_WRAP = document.querySelector('[data-tabpanel="' + DATA_NULL_DATA + '"]');

        if (DATA_NULL_WRAP) {
          var DATA_NULL_LIST = DATA_NULL_WRAP.querySelectorAll('[data-view]');
          if (DATA_NULL_LIST.length > 0) for (var _i12 = 0; _i12 < DATA_NULL_LIST.length; _i12++) {
            DATA_NULL_LIST[_i12].classList.remove('show');
          } // 전체 tab click

          if (DATA_CASE === 'all') for (var _i13 = 0; _i13 < DATA_NULL_LIST.length; _i13++) {
            DATA_NULL_LIST[_i13].classList.add('show');
          }
        }
      }
    }
  }

  function tabStateClickAraiControls() {
    var TAB_ONE_TAB = TAB_ONE_WRAP.dataset.onetab;

    if (TAB_ONE_TAB) {
      var TAB_ONE_PANEL = document.querySelector('[data-onepanel="' + TAB_ONE_TAB + '"]');

      if (TAB_ONE_PANEL) {
        var ONE_TARGET_TAB = _elem.getAttribute('aria-controls');

        if (ONE_TARGET_TAB) TAB_ONE_PANEL.setAttribute('aria-labelledby', ONE_TARGET_TAB);
      }
    }
  } // +++ tab 터치 시 페이지 이동하는 tab 일 경우 or scroll 이동


  function tabStateMove(_elem) {
    var TAB_WRAP = _elem.closest('.c-tab');

    if (TAB_WRAP) tabStateMoveConm(TAB_WRAP);
  }

  function tabStateMoveConm(_tabWrap) {
    var TAB_MOVE_LIST = _tabWrap.querySelectorAll('li');

    if (TAB_MOVE_LIST.length > 0) tabStateMoveConmEvt(TAB_MOVE_LIST, _tabWrap);
  }

  function tabStateMoveConmEvt(_tabMoveList, _tabWrap) {
    for (var _i14 = 0; _i14 < _tabMoveList.length; _i14++) {
      var activeTab = _tabMoveList[_i14].querySelectorAll('a.tab.active');

      if (activeTab.length > 0) moveTabActivity(_tabWrap, _tabMoveList[_i14]);
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
  } // + tab Click 시 스크롤 이동


  function tabStateMoveConm(_tabWrap) {
    var TAB_MOVE_LIST = _tabWrap.querySelectorAll('li');

    if (TAB_MOVE_LIST.length > 0) tabStateMoveConmEvt(TAB_MOVE_LIST, _tabWrap);
  } // 선택된 tab 중앙 이동


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
        if (PANEL_VIEW_LIST.length > 0) for (var _i15 = 0; _i15 < PANEL_VIEW_LIST.length; _i15++) {
          PANEL_VIEW_LIST[_i15].classList.add('show');
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

  if (POPUP_ELEM.length > 0) for (var _i16 = 0; _i16 < POPUP_ELEM.length; _i16++) {
    popupStyle(POPUP_ELEM[_i16], 'hide');
  } // 팝업 열림

  var POPUP_BTN_ELEM = document.querySelectorAll('.btn-open-popup'); // popup open button - click event

  if (POPUP_BTN_ELEM.length > 0) {
    var _loop = function _loop(_i17) {
      POPUP_BTN_ELEM[_i17].addEventListener('click', function () {
        popupOpenEvent(POPUP_BTN_ELEM[_i17], _i17);
      });
    };

    for (var _i17 = 0; _i17 < POPUP_BTN_ELEM.length; _i17++) {
      _loop(_i17);
    }
  } // + popup open button click event


  function popupOpenEvent(_btnElem) {
    var OPENSTATE_POPUP = document.querySelectorAll('.kmi-popup.show');
    if (OPENSTATE_POPUP.length > 0) for (var _i18 = 0; _i18 < OPENSTATE_POPUP.length; _i18++) {
      OPENSTATE_POPUP[_i18].setAttribute('aria-hidden', true);
    }

    var TARGET = _btnElem.getAttribute('data-target');

    var CURRENT_POPUP = document.getElementById(TARGET);
    CURRENT_POPUP.classList.add('show');
    CURRENT_POPUP.setAttribute('aria-hidden', false); // 접근성: popup 오픈 시 #container focus 막기

    containerHidden(true); // 팝업 종류 체크

    var popupState = popupStateCheck(CURRENT_POPUP); // style

    var btnArr = 0;
    if (OPENSTATE_POPUP.length > 0) btnArr = OPENSTATE_POPUP.length;

    for (var _len = arguments.length, _i = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      _i[_key - 1] = arguments[_key];
    }

    if (_i.length > 0) btnArr = _i.map(function (idx) {
      return idx;
    });
    popupStyle(CURRENT_POPUP, 'show', _i.length > 0 ? btnArr[0] : btnArr); // 접근성

    focusFirstBtn(popupState, CURRENT_POPUP); // 팝업 배경 click event
    // 220923 - 현업 요청으로 제거
    // popupBgClickEvt(CURRENT_POPUP);
    // modal header type

    popupModalHeader(popupState, CURRENT_POPUP); // full type: floating tab 있는 full type 팝업이 스크롤 되는 경우

    popupScrollTabCase(popupState, CURRENT_POPUP); // full type: floating 버튼있는 full type 팝업이 스크롤 되는 경우

    popupScrollCase(popupState, CURRENT_POPUP);
  } // + 팝업 종류 체크


  function popupStateCheck(_popState) {
    var popCase = _popState.classList; // 모달 팝업: modal

    if (popCase.contains('type-modal')) return 'modal'; // 푸터 없는 풀팝업: full
    else if (popCase.contains('type-full')) return 'full'; // 푸터 있는 풀팝업: full-footer
    else if (popCase.contains('type-full-footer')) return 'full-footer';
  } // + 팝업 style - top, z-index, visibility


  function popupStyle(_elem, _state) {
    var indexRes = 0;
    if ((arguments.length <= 2 ? 0 : arguments.length - 2) > 0) for (var _i19 = 0; _i19 < (arguments.length <= 2 ? 0 : arguments.length - 2); _i19++) {
      indexRes = _i19 + 2 < 2 || arguments.length <= _i19 + 2 ? undefined : arguments[_i19 + 2];
    }

    switch (_state) {
      case 'show':
        _elem.style.top = 0;
        _elem.style.zIndex = 2000 + indexRes;
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
  }

  function popupScrollTabCase(_state, _elem) {
    if (_state === 'full') fullTabScrollChk(_elem);
  }

  function fullTabScrollChk(_elem) {
    var F_CONTAINER = _elem.querySelector('.c-container');

    if (F_CONTAINER) {
      var F_Tab = F_CONTAINER.querySelector('.tab-floating');
      var F_HEADER = F_CONTAINER.querySelector('.full-header');
      var F_BODY = F_CONTAINER.querySelector('.full-body');
      if (F_HEADER && F_BODY && F_Tab) fullTabScrollEvt(F_CONTAINER, F_Tab, F_HEADER, F_BODY);
    }
  }

  function fullTabScrollEvt(_container, _tab, _header, _body) {
    // scroll end check
    var headerHeight = _header.clientHeight;
    var lastScrollTop = 0;
    var scrollArr = [];
    var isScrolling;

    _body.addEventListener('scroll', function () {
      var CONT_BOX = _container.querySelector('.cont-box');

      var TIT = _container.querySelector('.top-title-box');

      if (CONT_BOX && TIT) {
        var contBoxStyle = CONT_BOX.currentStyle || window.getComputedStyle(CONT_BOX);
        var contBoxStyleRes = parseInt(contBoxStyle.paddingTop);
        var scrollRes = this.clientHeight + _header.clientHeight + _tab.clientHeight + TIT.clientHeight + contBoxStyleRes;

        if (this.scrollHeight > scrollRes) {
          _container.closest('.kmi-popup.show').classList.add('type-floating');

          if (this.scrollTop > headerHeight) {
            var st = this.pageYOffset || this.scrollTop;

            if (st > lastScrollTop) {
              // SCROLL: DOWN
              _container.classList.add('scroll-hide');

              console.log(' scroll down');
            } else {
              // SCROLL: UP
              scrollArr.push(st);
              console.log('scroll up');
              window.clearTimeout(isScrolling);
              isScrolling = setTimeout(function () {
                scrollArr = [];
              }, 66);

              if (Math.max.apply(Math, scrollArr) - Math.min.apply(Math, scrollArr) > SHOW_HEADER_NUM) {
                _container.classList.remove('scroll-hide');

                scrollArr = [];
              }
            }

            lastScrollTop = st <= 0 ? 0 : st;
            console.log('🚀 ~ file: common.js:796 ~ lastScrollTop', lastScrollTop);
          }

          if (this.scrollTop > TIT.clientHeight + _tab.clientHeight) _container.classList.add('isTop');else _container.classList.remove('isTop');

          if (this.scrollTop <= 0) {
            _container.classList.remove('scroll-hide');

            scrollArr = [];
          }
        } else _container.closest('.kmi-popup.show').classList.remove('type-floating');
      }
    });
  } // + full type: 스크롤 되는 경우 check


  function popupScrollCase(_state, _elem) {
    // if (_state === 'full') fullScrollCheck(_elem);
    if (_state === 'full') fullScrollChk(_elem);
    if (_state === 'full-footer') fullFooterScrollCheck(_elem); // scroll event

    if (_state === 'full' || _state === 'full-footer') customScrollbar(_elem, _state);
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
    // scroll end check
    _body.classList.add('type-flex');

    _fBtn.classList.remove('isScrollEnd');

    if (_body.offsetHeight + _body.scrollTop >= _body.scrollHeight) _fBtn.classList.add('isScrollEnd');

    if (_body.scrollHeight > _body.clientHeight + 72) {
      _body.classList.remove('type-flex');

      _fBtn.classList.add('isScroll');

      _body.addEventListener('scroll', function () {
        var SCROLL_WRAP = document.querySelector('.c-full-layer.kmi-popup.show');
        if (SCROLL_WRAP) fullScrollEvtInit(SCROLL_WRAP, _fBtn);
      });
    } else {
      _fBtn.classList.remove('isScroll');
    }
  }

  function fullScrollEvtInit(_scrollWrap, _fBtn) {
    var SCROLL_BODY = _scrollWrap.querySelector('.full-body');

    if (SCROLL_BODY) fullScrollEvtScroll(SCROLL_BODY, _fBtn);
  }

  function fullScrollEvtScroll(_scrollBody, _fBtn) {
    // scroll end check
    var scrollRes = _scrollBody.offsetHeight + _scrollBody.scrollTop + 30; // scroll down end

    if (scrollRes >= _scrollBody.scrollHeight) _fBtn.classList.add('isScrollEnd');else _fBtn.classList.remove('isScrollEnd');
  } // X XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  // ++ full type 일 경우
  // function fullScrollCheck(_elem) {
  //   const F_CONTAINER = _elem.querySelector('.c-container');
  //   if (F_CONTAINER) {
  //     const F_HEADER = F_CONTAINER.querySelector('.full-header');
  //     const F_BODY = F_CONTAINER.querySelector('.full-body');
  //     const F_FOOTER = F_CONTAINER.querySelector('.full-footer');
  //     // full-body가 스크롤 되는지 체크
  //     if (F_HEADER && F_BODY && F_FOOTER) fullScrollEvent(F_CONTAINER, F_HEADER, F_BODY, F_FOOTER);
  //   }
  // }
  // +++ full type의 container가 스크롤 될 경우
  // function fullScrollEvent(_container, _header, _body, _footer) {
  //   let bStyle = _body.currentStyle || window.getComputedStyle(_body);
  //   let cHeight = _container.clientHeight;
  //   let hHeight = _header.clientHeight;
  //   // let bHeight = _body.scrollHeight;
  //   let bhInit = parseInt(bStyle.paddingBottom);
  //   let bHeight = (_body.clientHeight + bhInit) > _body.scrollHeight ? _body.clientHeight + bhInit : _body.scrollHeight;
  //   let fHeight = _footer.clientHeight; // 100px || 72px
  //   let hRes = cHeight - (hHeight + 72);
  //   if (bHeight > hRes) {
  //     // bottom fixed 버튼: 애니메이션 제거
  //     // _footer.style.transition = 'none';
  //     // footer addClass: scroll
  //     _footer.classList.add('scroll');
  //     // scroll end event check
  //     fullScrollEndEvent(_container, _body, _footer);
  //   }
  // }
  // ++++ scroll end event check
  // function fullScrollEndEvent(_scrollContainer, _scrollBody, _buttonEl) {
  //   // let scrollInit = 0;
  //   _scrollBody.addEventListener('scroll', () => {
  //     // bottom fixed 버튼: 애니메이션 적용
  //     // _buttonEl.style.transition = 'padding .1s ease-in-out';
  //     // scroll up
  //     if (!timeout) {
  //       // scroll end check
  //       let scrollRes = _scrollBody.offsetHeight + _scrollBody.scrollTop;
  //       // scroll down end
  //       if (scrollRes >= _scrollBody.scrollHeight) _buttonEl.classList.remove('scroll');
  //       if (scrollRes < _scrollBody.scrollHeight - 28) _buttonEl.classList.add('scroll');
  //     }
  //   });
  // }
  // X XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
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
  } // + modal header type


  function popupModalHeader(_state, _popupEl) {
    if (_state === 'modal') setTimeout(popupModalHeaderScroll, ANI_TIME_300, _popupEl, _state);
  } // ++ modal header type의 modal-field가 스크롤 되는지 체크


  function popupModalHeaderScroll(_popEl, _state) {
    var SCROLL_ELEM = _popEl.querySelector('.modal-field');

    if (SCROLL_ELEM) {
      var POP_HEADER = SCROLL_ELEM.querySelector('.c-modal-header');

      if (POP_HEADER) {
        if (SCROLL_ELEM.scrollHeight > SCROLL_ELEM.clientHeight) {
          // scrollbar design
          customScrollbar(_popEl, _state); // scroll event

          popupModalHeaderScrollEvt(SCROLL_ELEM, POP_HEADER);
        }
      }
    }
  } // +++ modal header type의 modal-field가 스크롤 되는 경우


  function popupModalHeaderScrollEvt(_scrollEl, _popHeader) {
    _scrollEl.addEventListener('scroll', function () {
      if (this.scrollTop <= 0) _popHeader.classList.remove('isScroll');else _popHeader.classList.add('isScroll');
    });
  } // 팝업 닫힘 - 닫힘버튼 class: popup-btn-close


  var POPUP_CLOSE_ELEM = document.querySelectorAll('.popup-btn-close');
  if (POPUP_CLOSE_ELEM.length > 0) popupCloseComn(POPUP_CLOSE_ELEM); // + popup close

  function popupCloseComn(_popupCloseEl) {
    var _loop2 = function _loop2(_i20) {
      // popup close button - click event
      _popupCloseEl[_i20].addEventListener('click', function () {
        var CLOSESTATE_POPUP = document.querySelectorAll('.kmi-popup.show');
        if (CLOSESTATE_POPUP.length > 0) for (var _i21 = 0; _i21 < CLOSESTATE_POPUP.length; _i21++) {
          CLOSESTATE_POPUP[_i21].setAttribute('aria-hidden', false);
        }

        var TARGET = _popupCloseEl[_i20].closest('.kmi-popup');

        TARGET.classList.remove('show');
        TARGET.setAttribute('aria-hidden', true); // 접근성: popup close 시 #container focus 풀기

        containerHidden(false); // style - 사라지는 animation을 위해 setTimeout 사용

        setTimeout(function () {
          popupCloseTimeout(TARGET);
        }, ANI_TIME_300);
      });
    };

    for (var _i20 = 0; _i20 < _popupCloseEl.length; _i20++) {
      _loop2(_i20);
    }
  }

  function popupCloseTimeout(_target) {
    popupStyle(_target, 'hide');
    focusCloseState(_target);
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
      if (_state === 'full-footer' || _state === 'full') focus_el = _elem.querySelectorAll('.btn-go-back');
      if (_state === 'modal') focus_el = _elem.querySelectorAll('.popup-cls-btn.popup-btn-close');
      if (focus_el.length > 0) setTimeout(function () {
        focus_el[0].focus();
      }, INTERVAL_1);
    }, ANI_TIME_300);
  } // DOM에 풀팝업이 있을 경우


  function fullPopupState() {
    var FULL_POP_ELEM = document.querySelectorAll('.c-full-layer.show');

    if (FULL_POP_ELEM.length > 0) {
      for (var _i22 = 0; _i22 < FULL_POP_ELEM.length; _i22++) {
        if (FULL_POP_ELEM[_i22].classList.contains('type-full')) fullPopupScrollHeightCheck('full', FULL_POP_ELEM[_i22]);
        if (FULL_POP_ELEM[_i22].classList.contains('type-full-footer')) fullPopupScrollHeightChk('full-footer', FULL_POP_ELEM[_i22]);
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
  } // + resize: DOM에 팝업이 있는 경우


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
  } // resize: modal header popup shadow


  function modalHeaderPopupShadow() {
    var MODAL_HEADER_POPUP = document.querySelectorAll('.c-layer-popup.kmi-popup.type-modal.show');
    if (MODAL_HEADER_POPUP.length > 0) for (var _i23 = 0; _i23 < MODAL_HEADER_POPUP.length; _i23++) {
      customScrollbar(MODAL_HEADER_POPUP[_i23], 'modal');
    }
  } // resize: full popup


  function fullPopupResizeScrollbar() {
    var FULL_POPUP = document.querySelectorAll('.c-full-layer.kmi-popup.show');

    if (FULL_POPUP.length > 0) {
      for (var _i24 = 0; _i24 < FULL_POPUP.length; _i24++) {
        if (FULL_POPUP[_i24].classList.contains('type-full')) customScrollbar(FULL_POPUP[_i24], 'full');
        if (FULL_POPUP[_i24].classList.contains('type-full-footer')) customScrollbar(FULL_POPUP[_i24], 'full-footer');
      }
    }
  } // 팝업 열림 버튼을 직접 click할 경우


  function popupDirectClick(_popupBtnEl) {
    popupOpenEvent(_popupBtnEl);
  }
  /**
   * accordion
   */


  var ACCORDION_ELEM = document.querySelectorAll('.accordion');

  if (ACCORDION_ELEM.length > 0) {
    for (var _i25 = 0; _i25 < ACCORDION_ELEM.length; _i25++) {
      // 아코디언 타입체크
      var accordionType = accordionTypeCheck(ACCORDION_ELEM[_i25]); // 접근성

      accordionAltTxt(ACCORDION_ELEM[_i25]);
      accordionAccessibility(ACCORDION_ELEM[_i25]);

      var BTN_OPEN = ACCORDION_ELEM[_i25].querySelectorAll('.accordion-header'); // acc button click event


      if (BTN_OPEN.length > 0) accButtonClickEvent(ACCORDION_ELEM[_i25], BTN_OPEN[0], accordionType);
    }
  } // + 아코디언 타입 체크: 하나만 보이는 타입, 모두 보이는 타입


  function accordionTypeCheck(_accEl) {
    if (_accEl.classList.contains('type-open-one')) return 'type-one-open';
    return 'type-multi-open';
  } // + 접근성: 대체텍스트


  function accordionAltTxt(_elem) {
    if (_elem.classList.contains('type-inner-btn')) {
      var altElTxt = document.createElement('em');
      altElTxt.classList.add('alt-txt');
      altElTxt.setAttribute('role', 'button');

      var header = _elem.querySelector('.accordion-header');

      var accTit = header.querySelector('.acc-tit');
      header.insertBefore(altElTxt, accTit);
      _elem.classList.contains('open') ? altElTxt.innerHTML = ACC_ALT_TXT.open : altElTxt.innerHTML = ACC_ALT_TXT.close;
    }
  } // + 접근성: 아코디언 터치 시 대체텍스트


  function accordionAltTxtTouch(_altEl, _state) {
    switch (_state) {
      case true:
        _altEl.innerHTML = ACC_ALT_TXT.open;
        break;

      default:
        _altEl.innerHTML = ACC_ALT_TXT.close;
        break;
    }
  } // + 접근성: aria-expanded


  function accordionAccessibility(_elem) {
    if (_elem.classList.contains('open')) {
      _elem.querySelector('.accordion-header').setAttribute('aria-expanded', true);

      _elem.querySelector('.accordion-body').setAttribute('tabindex', 0);

      _elem.querySelector('.accordion-body').setAttribute('aria-hidden', false);

      if (_elem.classList.contains('type-inner-btn')) if (_elem.querySelector('.alt-txt')) accordionAltTxtTouch(_elem.querySelector('.alt-txt'), true);
    } else {
      _elem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');

      _elem.querySelector('.accordion-body').setAttribute('tabindex', -1);

      _elem.querySelector('.accordion-body').setAttribute('aria-hidden', true);

      if (_elem.classList.contains('type-inner-btn')) if (_elem.querySelector('.alt-txt')) accordionAltTxtTouch(_elem.querySelector('.alt-txt'), false);
    }
  } // + acc button click event


  function accButtonClickEvent(_accWrap, _elem, _accType) {
    var bodyHeight = 0;
    setTimeout(function () {
      var accBodyEl = _accWrap.querySelector('.accordion-body');

      bodyHeight = accBodyEl.scrollHeight; // 열려있는 아코디언이 있을 경우

      if (_accWrap.classList.contains('open')) _accWrap.querySelector('.accordion-body').style.maxHeight = bodyHeight + 'px';

      _elem.onclick = function (e) {
        accButtonClickEvtComn(e, _accType, _accWrap, accBodyEl, bodyHeight);
      };
    }, INTERVAL_100);
  }

  function accButtonClickEvtComn(_e, _accType, _accWrap, _accBodyEl, _bodyHeight) {
    // 터치하는 영역이 '비교하기' 버튼이 아닐 경우 - 아코디언 hide / show
    // 터치하는 영역이 물음표 아이콘이 아닐 경우 - 아코디언 hide / show
    if (!_e.target.parentElement.classList.contains('co-btn') && !_e.target.classList.contains('co-btn') && !_e.target.classList.contains('ico-ques')) {
      accButtonTypeOneOpen(_accType, _accWrap);
      accButtonOpenClose(_accWrap, _accBodyEl); // 접근성

      accordionAccessibility(_accWrap); // btn-bottom-floating check

      setTimeout(function () {
        var CONTAINER_EL = document.getElementById('container');
        if (CONTAINER_EL) scrollTopFake(CONTAINER_EL);
      }, ANI_TIME_300);
    }
  }

  function accButtonTypeOneOpen(_accType, _accWrap) {
    // 터치 시 하나만 보이는 타입
    if (_accType === 'type-one-open') {
      // 아코디언이 열려있으면
      if (!_accWrap.classList.contains('open')) accButtonTypeOneOpenAllClose(_accWrap);
    }
  }

  function accButtonTypeOneOpenAllClose(_accWrap) {
    var ACC_WRAP = _accWrap.closest('.accordion-list');

    if (ACC_WRAP) {
      // 아코디언 모두 닫기
      var accOneList = ACC_WRAP.querySelectorAll('.accordion');

      for (var _i26 = 0; _i26 < accOneList.length; _i26++) {
        accOneList[_i26].classList.remove('open');

        accOneList[_i26].querySelector('.accordion-body').style.maxHeight = 0;

        accOneList[_i26].querySelector('.accordion-body').setAttribute('tabindex', -1);

        accOneList[_i26].querySelector('.accordion-body').setAttribute('aria-hidden', true);

        accOneList[_i26].querySelector('.accordion-header').setAttribute('aria-expanded', false);
      }
    }
  }

  function accButtonOpenClose(_accWrap, _accBodyEl) {
    if (_accWrap.classList.contains('open')) {
      _accWrap.classList.remove('open');

      _accBodyEl.style.maxHeight = 0;
    } else {
      _accWrap.classList.add('open');

      _accBodyEl.style.maxHeight = _accBodyEl.scrollHeight + 'px';
    }
  } // + 아코디언 모두닫힘


  function accordionAllClose(_accEl) {
    for (var _i27 = 0; _i27 < _accEl.length; _i27++) {
      _accEl[_i27].classList.remove('open');

      _accEl[_i27].querySelector('.accordion-body').setAttribute('tabindex', -1);

      _accEl[_i27].querySelector('.accordion-body').setAttribute('aria-hidden', true);

      _accEl[_i27].querySelector('.accordion-body').style.maxHeight = 0;
    }
  }
  /**
   * terms
   */


  var TERMS_ELEM = document.querySelectorAll('.terms-box');
  if (TERMS_ELEM.length > 0) termsComn(TERMS_ELEM); // + 약관이 있으면

  function termsComn(_elem) {
    for (var _i28 = 0; _i28 < TERMS_ELEM.length; _i28++) {
      var TERMS_INNER = TERMS_ELEM[_i28].querySelectorAll('.inner');

      termsInner(TERMS_INNER, TERMS_ELEM[_i28]);
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
   * textarea
   */


  var TEXTAREA_ELEM = document.querySelectorAll('textarea');
  if (TEXTAREA_ELEM.length > 0) for (var _i29 = 0; _i29 < TEXTAREA_ELEM.length; _i29++) {
    textareaComn(TEXTAREA_ELEM[_i29]);
  } // + textarea가 있으면

  function textareaComn(_elem) {
    if (_elem.scrollHeight > _elem.clientHeight) textareaScrollbar(_elem); // add scrollbar

    _elem.addEventListener('input', function () {
      if (this.scrollHeight > this.clientHeight) textareaScrollbar(_elem);
    });
  } // + create textarea scrollbar


  function textareaScrollbar(_elem) {
    if (_elem.parentElement.querySelector('.textarea-scroll')) {// has scrollbar
    } else {
      // null scrollbar
      var scrollEl = document.createElement('div');
      var scrollInner = document.createElement('span');
      scrollEl.classList.add('textarea-scroll');
      scrollEl.setAttribute('aria-hidden', true);
      scrollEl.appendChild(scrollInner);

      _elem.parentElement.appendChild(scrollEl); // 스크롤바 scroll event


      termsScrollEvent(_elem, scrollEl, scrollInner);
    }
  }
  /**
   * input
   */


  var INPUT_ELEM = document.querySelectorAll('input');
  if (INPUT_ELEM.length > 0) for (var _i30 = 0; _i30 < INPUT_ELEM.length; _i30++) {
    inputComn(INPUT_ELEM[_i30]);
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
    if (_inputState === 'default') inputFocusEvtComn(_inputEl);
  }

  function inputFocusEvtComn(_inputEl) {
    _inputEl.addEventListener('focus', function () {
      inputFocusEvtFloating(_inputEl);
      inputFocusEvtModal();
      var elTop = 0;
      setTimeout(function () {
        var elTopElem = _inputEl.closest('*[class^="c-input-"]');

        if (elTopElem) {
          elTop = elTopElem.offsetTop; // type-fulld

          var PARENT_EL_FULL = _inputEl.closest('.c-container');

          if (PARENT_EL_FULL) {
            var PARENT_EL_HEADER = PARENT_EL_FULL.querySelector('.full-header');
            if (PARENT_EL_HEADER) PARENT_EL_FULL.scrollTop = elTop - PARENT_EL_HEADER.clientHeight;
          } // type-modal


          var PARENT_EL_MODAL = _inputEl.closest('.c-layer-popup.kmi-popup.type-modal.show');

          if (PARENT_EL_MODAL) {
            var MODAL_INNER = PARENT_EL_MODAL.querySelector('.modal-field');

            if (MODAL_INNER) {
              var MODAL_HEADER = MODAL_INNER.querySelector('.c-modal-header');
              if (MODAL_HEADER) MODAL_INNER.scrollTop = elTop - MODAL_HEADER.clientHeight;
            }
          }

          elTop = 0;
        }
      }, INTERVAL_100);
      return false;
    });

    _inputEl.addEventListener('blur', function () {
      // type-full
      var floatinPopup = _inputEl.closest('.c-full-layer.kmi-popup.show');

      if (floatinPopup) {
        var floatingContainer = floatinPopup.querySelector('.c-container');

        if (floatingContainer) {
          var SCROLL_ELEM = floatingContainer.querySelector('.full-body');

          if (SCROLL_ELEM) {
            var floatingBtn = SCROLL_ELEM.querySelector('.btn-floating');
            floatinPopup.classList.remove('input-focus');

            if (floatinPopup.classList.contains('input-focus')) {
              floatinPopup.classList.remove('input-focus');
            }

            if (SCROLL_ELEM.scrollHeight - 72 > SCROLL_ELEM.clientHeight) floatingBtn.classList.add('isScroll');
          }
        }
      }

      return false;
    });
  } // ++ floating 버튼 있는 full 팝업


  function inputFocusEvtFloating(_inputEl) {
    var floatinPopup = document.querySelector('.c-full-layer.kmi-popup.show');

    if (floatinPopup) {
      var floatingContainer = floatinPopup.querySelector('.c-container');
      var floatingBtn = floatinPopup.querySelector('.btn-floating');
      if (floatingContainer && floatingBtn) inputFocusEvtFloatingBtn(floatinPopup, floatingContainer, floatingBtn, _inputEl);
    }
  }

  function inputFocusEvtFloatingBtn(_floatinPopup, _floatingContainer, _floatingBtn, _inputEl) {
    if (_floatinPopup.classList.contains('input-focus')) {//
    } else {
      _floatinPopup.classList.add('input-focus');
    }
  } // ++ modal 팝업


  function inputFocusEvtModal() {// let modalPopup = document.querySelector('.c-layer-popup.kmi-popup.show');
    // if (modalPopup) {
    //   modalPopup.classList.add('input-focus');
    //   this.addEventListener('blur', () => {
    //     modalPopup.classList.remove('input-focus');
    //   });
    // }
  }
  /**
   * #container scroll event
   */


  var CONTAINER_ELEM = document.querySelector('#container');

  if (CONTAINER_ELEM) {
    var FLEX_ELEM = CONTAINER_ELEM.querySelector('.flex-wrap');

    if (!FLEX_ELEM.classList.contains('type-tab-scroll')) {
      console.log('type tab scrol x');
      var MOVE_HEADER = CONTAINER_ELEM.querySelector('.header.co-header');
      if (MOVE_HEADER) containerScrollEvent(MOVE_HEADER, CONTAINER_ELEM);
    } else if (FLEX_ELEM.classList.contains('type-tab-scroll')) {
      console.log('type tab scroll 0');

      var _MOVE_HEADER = CONTAINER_ELEM.querySelector('.header.co-header');

      if (_MOVE_HEADER) containerTabScrollEvent(_MOVE_HEADER, CONTAINER_ELEM);
    } // custom 스크롤바 만들기


    customScrollbar(CONTAINER_ELEM);
  }

  function containerScrollEvent(_moveHeader, _scrollEl) {
    var headerHeight = _moveHeader.clientHeight;
    var lastScrollTop = 0;
    var scrollArr = [];
    var isScrolling;

    var BTN_BOTTOM_FLOATING = _scrollEl.querySelector('.btn-bottom-floating');

    var CONTAINER_FOOTER = _scrollEl.querySelector('.footer');

    var FLOATING_BLOCK_ARR = ['rv-block', 'rc-block'];

    if (BTN_BOTTOM_FLOATING) {
      var MARGIN_EL = BTN_BOTTOM_FLOATING.previousSibling.previousElementSibling;
      if (MARGIN_EL) MARGIN_EL.style.marginBottom = '3.75rem';
      FLOATING_BLOCK_ARR.map(function (el) {
        var blockEl = document.querySelector('.' + el);
        if (blockEl) blockEl.classList.add('type-floating-btn');
      });
      if (CONTAINER_FOOTER) floatingBtnComn(_scrollEl, CONTAINER_FOOTER);else floatingBtnComn(_scrollEl);
    } // move top button


    var MOVE_TOP_BTN_ELEM = document.querySelector('.btn-move-top');

    _scrollEl.addEventListener('scroll', function (e) {
      if (this.scrollTop > headerHeight) {
        var st = this.pageYOffset || this.scrollTop;

        if (st > lastScrollTop) {
          // SCROLL: DOWN
          // console.log('SCROLL DOWN');
          _moveHeader.classList.add('scroll-hide');

          if (document.querySelector('.flex-wrap').classList.contains('type-tab-scroll')) {
            _moveHeader.classList.remove('scroll-hide');
          } // _moveHeader.classList.add('scroll-hide');
          //}

        } else {
          // SCROLL: UP
          scrollArr.push(st);
          window.clearTimeout(isScrolling);
          isScrolling = setTimeout(function () {
            scrollArr = [];
          }, 66);

          if (Math.max.apply(Math, scrollArr) - Math.min.apply(Math, scrollArr) > SHOW_HEADER_NUM) {
            _moveHeader.classList.remove('scroll-hide');

            scrollArr = [];
            console.log('scroll up ');
          }
        }

        lastScrollTop = st <= 0 ? 0 : st;
      }

      if (this.scrollTop <= _moveHeader.clientHeight) {
        _moveHeader.classList.remove('scroll-hide');

        scrollArr = [];
      }

      if (MOVE_TOP_BTN_ELEM) {
        if (this.scrollTop <= 0) MOVE_TOP_BTN_ELEM.classList.add('hide');else MOVE_TOP_BTN_ELEM.classList.remove('hide');
      } // 하단 고정 버튼이 있는 경우


      if (BTN_BOTTOM_FLOATING) scrollingFloatingBtn(BTN_BOTTOM_FLOATING, this, CONTAINER_FOOTER);
    }, false);
  } // [Mod 230220]
  // + touch move


  function containerTabScrollEvent(_moveHeader, _scrollEl) {
    var headerHeight = _moveHeader.clientHeight;
    var lastScrollTop = 0;
    var scrollArr = [];
    var isScrolling;

    var BTN_BOTTOM_FLOATING = _scrollEl.querySelector('.btn-bottom-floating');

    var CONTAINER_FOOTER = _scrollEl.querySelector('.footer');

    var FLOATING_BLOCK_ARR = ['rv-block', 'rc-block'];

    if (BTN_BOTTOM_FLOATING) {
      var MARGIN_EL = BTN_BOTTOM_FLOATING.previousSibling.previousElementSibling;
      if (MARGIN_EL) MARGIN_EL.style.marginBottom = '3.75rem';
      FLOATING_BLOCK_ARR.map(function (el) {
        var blockEl = document.querySelector('.' + el);
        if (blockEl) blockEl.classList.add('type-floating-btn');
      });
      if (CONTAINER_FOOTER) floatingBtnComn(_scrollEl, CONTAINER_FOOTER);else floatingBtnComn(_scrollEl);
    } // move top button


    var MOVE_TOP_BTN_ELEM = document.querySelector('.btn-move-top');

    _scrollEl.addEventListener('touchmove', function (e) {
      var SHOW_HEADER_NUM = '10';

      if (this.scrollTop > headerHeight) {
        var st = this.pageYOffset || this.scrollTop; // 현재 위치

        if (st > lastScrollTop) {
          // SCROLL: DOWN
          console.log('touch move scroll down');

          _moveHeader.classList.add('scroll-hide');
        } else {
          // SCROLL: UP
          scrollArr.push(st);
          window.clearTimeout(isScrolling);
          isScrolling = setTimeout(function () {
            scrollArr = [];
          }, 66);

          if (Math.max.apply(Math, scrollArr) - Math.min.apply(Math, scrollArr) > SHOW_HEADER_NUM) {
            _moveHeader.classList.remove('scroll-hide'); // console.log('Math.max.apply(Math, scrollArr)' + Math.max.apply(Math, scrollArr));
            // console.log('Math.min.apply(Math, scrollArr)' + Math.min.apply(Math, scrollArr));
            // console.log('SHOW_HEADER_NUM: ' + SHOW_HEADER_NUM);


            console.log('touch move scroll up 여부');
            scrollArr = [];
          }
        }

        lastScrollTop = st <= 0 ? 0 : st;
      } // if (this.scrollTop <= _moveHeader.clientHeight) {
      //   _moveHeader.classList.remove('scroll-hide');
      //   scrollArr = [];
      // }


      if (MOVE_TOP_BTN_ELEM) {
        if (this.scrollTop <= 0) MOVE_TOP_BTN_ELEM.classList.add('hide');else MOVE_TOP_BTN_ELEM.classList.remove('hide');
      } // 하단 고정 버튼이 있는 경우


      if (BTN_BOTTOM_FLOATING) scrollingFloatingBtn(BTN_BOTTOM_FLOATING, this, CONTAINER_FOOTER);
    }, false);
  }

  function floatingBtnComn(_scrollBody) {
    for (var _len2 = arguments.length, _footer = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      _footer[_key2 - 1] = arguments[_key2];
    }

    if (_footer.length > 0) {
      // console.log(_scrollBody.scrollHeight);
      // console.log(_scrollBody.clientHeight + _footer[0].clientHeight + INVERTED);
      if (_scrollBody.scrollHeight > _scrollBody.clientHeight + _footer[0].clientHeight + INVERTED) floatingBtnInner(true, _scrollBody);else floatingBtnInner(false, _scrollBody);
    } else {
      if (_scrollBody.scrollHeight > _scrollBody.clientHeight + INVERTED) floatingBtnInner(true, _scrollBody);else floatingBtnInner(false, _scrollBody);
    }
  }

  function floatingBtnInner(_state, _el) {
    switch (_state) {
      case true:
        _el.classList.add('isFloatingScroll');

        scrollTopFake(_el);
        break;

      default:
        _el.classList.remove('isFloatingScroll');

        break;
    }
  }

  function scrollingFloatingBtn(_floatingBtn, _this, _footer) {
    var S_HEADER = _this.querySelector('.header.co-header');

    var S_BTN = _this.querySelector('.btn-bottom-floating');

    if (elTopArr.length < 10) {
      elTopArr.push(_floatingBtn.offsetTop);
      elTopArr.sort(function (a, b) {
        if (a > b) return 1;
        if (a === b) return 0;
        if (a < b) return -1;
      });
    }

    var min = 0;

    if (_this.scrollTop <= 0) {
      min = Math.min.apply(Math, elTopArr);
    } else {
      if (S_HEADER && S_BTN) {
        min = _this.clientHeight - S_HEADER.clientHeight - S_BTN.clientHeight;
      }
    }

    elTopRes = Math.ceil(_floatingBtn.offsetTop - _this.scrollTop);

    if (min > elTopRes) {
      _this.classList.remove('isFloatingScroll');
    } else {
      if (_footer) if (_this.scrollHeight - _this.clientHeight - INVERTED > _footer.clientHeight) _this.classList.add('isFloatingScroll');else _this.classList.add('isFloatingScroll');
    }
  }

  function scrollTopFake(_scrollBody) {
    _scrollBody.scrollTop += 1;
    _scrollBody.scrollTop -= 1;
  } // container scrollbar resize


  function containerResizeScrollbar() {
    var CONTAINER_ELEM = document.getElementById('container');
    if (CONTAINER_ELEM) customScrollbar(CONTAINER_ELEM);
  } // container bottom floating button


  function containerResizeFloatingBtn() {
    elTopArr = [];
    var CONTAINER_ELEM = document.getElementById('container');

    if (CONTAINER_ELEM) {
      var CONTAINER_HEADER = CONTAINER_ELEM.querySelector('.header.co-header');
      var CONTAINER_BTN = document.querySelector('.btn-bottom-floating');

      if (CONTAINER_HEADER && CONTAINER_BTN) {
        if (CONTAINER_ELEM.scrollHeight > CONTAINER_ELEM.clientHeight) {
          var lRes = CONTAINER_ELEM.clientHeight - CONTAINER_HEADER.clientHeight - CONTAINER_BTN.clientHeight;
          var rRes = Math.ceil(CONTAINER_BTN.offsetTop - CONTAINER_ELEM.scrollTop);
          if (lRes > rRes) CONTAINER_ELEM.classList.remove('isFloatingScroll');else CONTAINER_ELEM.classList.add('isFloatingScroll');
        }
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
        scrollToItemId(SCROLLING_ELEM.id);
      });
    }
  } // + pure js animate


  function scrollToItemId(containerId) {
    var scrollContainer = document.getElementById(containerId);
    var from = scrollContainer.scrollTop;
    var by = scrollContainer.scrollTop * -1;
    var currentIteration = 0;
    var animIterations = Math.round(60 * SCROLL_TIME);

    (function scroll() {
      var value = easeOutCubic(currentIteration, from, by, animIterations);
      scrollContainer.scrollTop = value;
      currentIteration++;
      if (currentIteration < animIterations) requestAnimationFrame(scroll);
    })();
  } // ++ linearEase


  function linearEase(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * currentIteration / totalIterations + startValue;
  } // ++ easeOutCubic


  function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
  }
  /**
   * floating tab
   */


  var STICKYELM = document.querySelector('.tab-floating');

  if (STICKYELM) {
    var scrollEl = document.querySelector('#container');

    if (scrollEl) {
      var tabOffsetTop = STICKYELM.offsetTop;
      scrollEl.addEventListener('scroll', function () {
        stickyElComn(STICKYELM, tabOffsetTop);
      });
    }
  }

  function stickyElComn(_el, _top) {
    // scrolling
    var tabOffsetTopScroll = _el.offsetTop;
    if (tabOffsetTopScroll <= _top) _el.classList.remove('isScroll');else _el.classList.add('isScroll');
  }
  /**
   * custom scrollbar
   */
  // common formula
  // + popup: modal header


  var scrollElHeight = function scrollElHeight(_body, _header) {
    return parseFloat(_body.clientHeight - _header.clientHeight - 20) + 'px';
  };

  var scrollStyleTop = function scrollStyleTop(_header) {
    return parseFloat(_header.clientHeight) + 'px';
  };

  var innerStyleHeight = function innerStyleHeight(_body, _header) {
    return (_body.clientHeight - _header.clientHeight) * ((_body.clientHeight - _header.clientHeight) / (_body.scrollHeight - _header.clientHeight)) + 'px';
  }; // + popup: full


  var innerStyleHeightFull = function innerStyleHeightFull(_body, _header) {
    return (_body.clientHeight - _header.clientHeight) * ((_body.clientHeight - _header.clientHeight) / (_body.scrollHeight - _header.clientHeight)) + 'px';
  }; // + popup: full footer


  var innerStyleHeightFooter = function innerStyleHeightFooter(_body, _header) {
    return (_body.clientHeight - _header.clientHeight) * ((_body.clientHeight - _header.clientHeight) / (_body.scrollHeight - _header.clientHeight)) + 'px';
  }; // + container


  var scrollElHeightCon = function scrollElHeightCon(_body) {
    return _body.clientHeight - 24 + 'px';
  };

  var innerStyleHeightCon = function innerStyleHeightCon(_body) {
    return _body.clientHeight * _body.clientHeight / _body.scrollHeight + 'px';
  }; // common create scrollbar


  function customScrollbar(_elem) {
    if ((arguments.length <= 1 ? 0 : arguments.length - 1) > 0) {
      // popup - modal: .modal-field
      if ((arguments.length <= 1 ? undefined : arguments[1]) === 'modal') scrollDesignPopModalHeader(_elem); // popup - full: .full-body

      if ((arguments.length <= 1 ? undefined : arguments[1]) === 'full') scrollDesignPopFullLayer(_elem); // popup - full-footer: c-container

      if ((arguments.length <= 1 ? undefined : arguments[1]) === 'full-footer') scrollDesignPopFullFooter(_elem);
    } else {
      // container
      scrollDesignContainer(_elem);
    }
  } // container


  function scrollDesignContainer(_container) {
    var CUSTOMER_SCROLL = _container.querySelector('.kmi-scroll');

    if (CUSTOMER_SCROLL) {
      var CUSTOMER_SCROLL_INNER = CUSTOMER_SCROLL.querySelector('span');
      if (CUSTOMER_SCROLL_INNER) addStyle('container', CUSTOMER_SCROLL, CUSTOMER_SCROLL_INNER, _container);
    } else {
      scrollbarCreate(_container);
    }
  } // popup: full


  function scrollDesignPopFullLayer(_elem) {
    var POPUP_SCROLL_ELEM = _elem.querySelector('.c-container');

    if (POPUP_SCROLL_ELEM) {
      var POPUP_HEADER = POPUP_SCROLL_ELEM.querySelector('.full-header');
      var POPUP_BODY = POPUP_SCROLL_ELEM.querySelector('.full-body');
      var CUSTOMER_SCROLL = POPUP_SCROLL_ELEM.querySelector('.kmi-scroll');
      if (POPUP_HEADER && POPUP_BODY) fullLayerScrollbarComn(POPUP_BODY, CUSTOMER_SCROLL, POPUP_HEADER);
    }
  } // popup: full footer


  function scrollDesignPopFullFooter(_elem) {
    var POPUP_SCROLL_ELEM = _elem.querySelector('.c-container');

    if (POPUP_SCROLL_ELEM) {
      var POPUP_HEADER = POPUP_SCROLL_ELEM.querySelector('.full-header');
      var POPUP_BODY = POPUP_SCROLL_ELEM.querySelector('.full-body');
      var CUSTOMER_SCROLL = POPUP_SCROLL_ELEM.querySelector('.kmi-scroll');
      if (POPUP_HEADER && POPUP_BODY) fullLayerScrollbarComn(POPUP_SCROLL_ELEM, CUSTOMER_SCROLL, POPUP_HEADER);
    }
  } // popup: modal header


  function scrollDesignPopModalHeader(_elem) {
    var POPUP_SCROLL_ELEM = _elem.querySelector('.modal-field');

    if (POPUP_SCROLL_ELEM) {
      var POPUP_HEADER = POPUP_SCROLL_ELEM.querySelector('.c-modal-header');
      var POPUP_BODY = POPUP_SCROLL_ELEM.querySelector('.c-modal-body');
      var CUSTOMER_SCROLL = POPUP_SCROLL_ELEM.querySelector('.kmi-scroll');
      if (POPUP_HEADER && POPUP_BODY) modalHeaderScrollbarComn(POPUP_SCROLL_ELEM, CUSTOMER_SCROLL, POPUP_HEADER);
    }
  } // + modal heder create scrollbar comn


  function modalHeaderScrollbarComn(_wrap, _scrollEl, _header) {
    if (_scrollEl) {
      var CUSTOMER_SCROLL_INNER = _scrollEl.querySelector('span'); // add style


      if (CUSTOMER_SCROLL_INNER) addStyle('modal', _scrollEl, CUSTOMER_SCROLL_INNER, _wrap, _header);
    } else {
      // create element
      scrollbarCreate(_wrap, _header);
    } // scroll event: isScroll check


    popupModalHeaderScrollEvt(_wrap, _header);
  } // + full layer create scrollbar comn


  function fullLayerScrollbarComn(_wrap, _scrollEl, _header) {
    if (_scrollEl) {
      var CUSTOMER_SCROLL_INNER = _scrollEl.querySelector('span');

      if (CUSTOMER_SCROLL_INNER) {
        // add style
        addStyle('full', _scrollEl, CUSTOMER_SCROLL_INNER, _wrap, _header);
      }
    } else {
      // create element
      scrollbarCreate(_wrap, _header);
    }
  } // ++ create element


  function scrollbarCreate(_scrollEl, _popHeader) {
    var scrollEl = document.createElement('div');
    var scrollInner = document.createElement('span');
    scrollEl.classList.add('kmi-scroll');
    scrollEl.setAttribute('aria-hidden', true);
    scrollEl.appendChild(scrollInner);

    _scrollEl.appendChild(scrollEl); // add style
    // modal


    if (scrollEl.closest('.type-modal')) {
      addStyle('modal', scrollEl, scrollInner, _scrollEl, _popHeader);
    } // full
    else if (scrollEl.closest('.type-full')) {
      addStyle('full', scrollEl, scrollInner, _scrollEl, _popHeader);
    } // full-footer
    else if (scrollEl.closest('.type-full-footer')) {
      addStyle('full-footer', scrollEl, scrollInner, _scrollEl, _popHeader);
    } // container
    else {
      addStyle('container', scrollEl, scrollInner, _scrollEl);
    }
  } // ++ add style


  function addStyle(_type, _scrollEl, _scrollInner, _popScrollEl, _popHeader) {
    setTimeout(function () {
      if (_type === 'modal') {
        _scrollEl.style.height = scrollElHeight(_popScrollEl, _popHeader);
        _scrollEl.style.top = scrollStyleTop(_popHeader);
        _scrollInner.style.height = innerStyleHeight(_popScrollEl, _popHeader);
      }

      if (_type === 'full') {
        _scrollInner.style.height = innerStyleHeightFull(_popScrollEl, _popHeader);
      }

      if (_type === 'full-footer') {
        _scrollInner.style.height = innerStyleHeightFooter(_popScrollEl, _popHeader);
      }

      if (_type === 'container') {
        _scrollEl.style.height = scrollElHeightCon(_popScrollEl);
        _scrollInner.style.height = innerStyleHeightCon(_popScrollEl);
      } // scroll event


      scrollDesignScrollEvt(_type, _popScrollEl, _scrollEl, _scrollInner);
    }, INTERVAL_1);
  } // +++ scroll event


  function scrollDesignScrollEvt(_type, _sclBody, _sclBar, _sclThum) {
    var sclBarTop = parseInt(_sclBar.style.top);
    var isScrolling;

    _sclBody.addEventListener('scroll', function () {
      if (this.scrollTop > 0) {
        if (_type === 'modal') _sclBar.style.top = parseFloat(sclBarTop + this.scrollTop) + 'px';

        _sclBar.classList.add('show');

        _sclThum.style.top = this.scrollTop / ((this.scrollHeight - this.clientHeight + _sclBar.clientHeight) / 100) + '%';
      } else {
        if (_type === 'modal') _sclBar.style.top = sclBarTop + 'px';
        _sclThum.style.top = '0';
      } // scroll stop event


      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(function () {
        if (_sclBar.classList.contains('show')) _sclBar.classList.remove('show');
      }, INTERVAL_1000);
    });
  }
}
//# sourceMappingURL=maps/common.js.map
