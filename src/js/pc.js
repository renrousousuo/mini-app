$(function() {
  var ie = document.all && document.attachEvent;
  var ie9plus = ie && window.XMLHttpRequest && window.addEventListener &&
    document.documentMode >= 9;
  $('#qrcodeTable').qrcode({
    render: ie && !ie9plus ? 'table' : 'canvas',
    text: base.format(
      '__homepage__', location
    ）
  });
});