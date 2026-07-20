/* Galeria "justificada": todas as imagens de uma linha ficam com a mesma
   altura e a linha preenche a largura toda disponível, sem cortar nada —
   a largura de cada imagem ajusta-se à sua proporção original.
   Não precisa de nenhuma configuração; corre automaticamente em todos os
   elementos com a classe .gallery. */
(function () {
  var TARGET_HEIGHT = 170; // altura-base de cada linha, em pixels
  var GAP = 14;             // tem de bater certo com o "gap" definido no CSS do .gallery

  function flushRow(row, containerWidth, isLastRow) {
    if (!row.length) return;
    var gaps = GAP * (row.length - 1);
    var available = containerWidth - gaps;
    var naturalRowWidth = row.reduce(function (sum, item) { return sum + item.naturalWidth; }, 0);

    // Na última linha, só esticamos se ela já quase preenchia a largura;
    // caso contrário, ficaria com imagens enormes por terem poucas na linha.
    var scale = 1;
    if (!isLastRow || naturalRowWidth > available * 0.55) {
      scale = available / naturalRowWidth;
    }

    row.forEach(function (item) {
      var h = TARGET_HEIGHT * scale;
      var w = item.naturalWidth * scale;
      item.img.style.height = h + 'px';
      item.img.style.width = w + 'px';
      item.figure.style.width = w + 'px';
    });
  }

  function justify(gallery) {
    var figures = Array.prototype.slice.call(gallery.children).filter(function (el) {
      return el.tagName === 'FIGURE' && el.querySelector('img');
    });
    if (!figures.length) return;

    var containerWidth = gallery.clientWidth;
    var row = [];
    var rowWidth = 0;

    figures.forEach(function (figure) {
      var img = figure.querySelector('img');
      if (!img.naturalWidth || !img.naturalHeight) return;
      var scaledWidth = img.naturalWidth * (TARGET_HEIGHT / img.naturalHeight);

      if (row.length && rowWidth + scaledWidth + GAP * row.length > containerWidth) {
        flushRow(row, containerWidth, false);
        row = [];
        rowWidth = 0;
      }
      row.push({ img: img, figure: figure, naturalWidth: scaledWidth });
      rowWidth += scaledWidth;
    });
    flushRow(row, containerWidth, true);
  }

  function justifyAll() {
    document.querySelectorAll('.gallery').forEach(justify);
  }

  function onImagesReady() {
    var imgs = document.querySelectorAll('.gallery img');
    if (!imgs.length) return;
    var remaining = imgs.length;

    function done() {
      remaining--;
      if (remaining <= 0) justifyAll();
    }

    imgs.forEach(function (img) {
      if (img.complete && img.naturalWidth) {
        done();
      } else {
        img.addEventListener('load', done);
        img.addEventListener('error', done);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', onImagesReady);

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(justifyAll, 150);
  });
})();
