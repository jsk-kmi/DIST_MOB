"use strict";

$.datepicker.setDefaults({
  closeText: '닫기',
  prevText: '이전 달',
  nextText: '다음 달',
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  yearNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일', '월', '화', '수', '목', '금', '토'],
  dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
  weekHeader: '주',
  yearSuffix: '년',
  dateFormat: 'yy-mm-dd',
  showMonthAfterYear: true,
  showOtherMonths: true,
  autoSize: true,
  showButtonPanel: false,
  duration: 100 // buttonImageOnly: true,
  // minDate: 0,

});
$('#c-datepicker').datepicker({});
$(document).on('click', '.ui-datepicker-next, .ui-datepicker-prev', function () {
  var dateHeaderTitle = $(this).siblings('.ui-datepicker-title').html(),
      dateHeaderText = $(this).siblings('.ui-datepicker-title').text(); // Year Title Control

  if (dateHeaderTitle.match('ui-datepicker-yearpicker')) {
    $('.ui-datepicker-yearpicker').text(dateHeaderText + '년');
  }
});
//# sourceMappingURL=maps/date.js.map
