"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// [add (230220)]
// +++ scroll 방식의 tab 일 경우
// + tab Scroll Type Click
function tabStateScroll(_elem) {
  var tabScrollList = document.querySelectorAll('.tab-scroll-item');

  var _iterator = _createForOfIteratorHelper(tabScrollList),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var scrollTab = _step.value;
      scrollTab.addEventListener('click', function (e) {
        e.preventDefault();
        var nowTab = this.getAttribute('aria-controls'),
            offset = document.querySelector('.header').offsetHeight,
            elementPos = document.querySelector("#".concat(nowTab)).offsetTop,
            flexContainer = document.querySelector('#container');

        if (nowTab) {
          document.querySelector('.header').classList.remove('scroll-hide');
        }

        flexContainer.scrollTo({
          top: elementPos - offset,
          behavior: 'smooth'
        });
      });
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
} // + tab Scroll Type Scroll


var _moveHeader = document.querySelector('#container').querySelector('.header.co-header');

var lastScrollTop = 0;

function tabScrollEvt() {
  var _activeEl = 0;
  var tabLeft = 0;
  document.querySelector('#container').addEventListener('scroll', function () {
    var tabWrap = document.querySelector('.c-tab');
    var navbarlinks = document.querySelectorAll('.tab-scroll-item'),
        tabField = document.querySelector('.scroll-tab-field'),
        firstTab = tabField.querySelectorAll('[role="tabpanel"]');
    navbarlinks.forEach(function (navbarlink) {
      var position = document.querySelector('#container').scrollTop + 100;
      var nowTab = navbarlink.getAttribute('aria-controls'),
          rdoChk = navbarlink.querySelector('input');
      var section = document.querySelector("#".concat(nowTab));
      if (!navbarlink) return;
      if (!section) return;

      if (position < firstTab.offsetTop) {
        document.querySelector('.tab-scroll-item').querySelector('input').checked = true;
      }

      if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
        rdoChk.checked = true;
        _activeEl = rdoChk.parentNode;
      } else {
        rdoChk.checked = false;
      }
    });
    tabLeft = _activeEl.offsetLeft;
    var tabStyle = tabWrap.currentStyle || window.getComputedStyle(tabWrap);
    var tabPadRes = parseInt(tabStyle.paddingLeft) + parseInt(tabStyle.paddingRight);
    var tabWidth = tabWrap.clientWidth - tabPadRes;
    var tabDiff = tabLeft - tabWidth / 2;
    tabWrap.scroll({
      left: tabDiff,
      behavior: 'smooth'
    });
  });
}
//# sourceMappingURL=maps/common02.js.map
