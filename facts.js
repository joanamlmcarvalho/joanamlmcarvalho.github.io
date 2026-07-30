// facts.js — distribui automaticamente os itens de cada ficha técnica
// (.facts) pelo número de colunas que deixa a grelha mais equilibrada,
// em vez de depender do auto-fit "adivinhar" consoante o espaço disponível.
//
// A primeira ficha de cada página (Unidade curricular / Ano / Equipa) tem
// tratamento próprio: a Unidade curricular costuma ter um nome bem mais
// comprido, por isso recebe uma coluna maior em vez de ficar igual às
// outras duas.
(function () {
  function isMetaBlock(block) {
    return Array.from(block.querySelectorAll('.fact .k')).some(function (k) {
      return k.textContent.trim() === 'Unidade curricular';
    });
  }

  // Para "n" itens, testa de "maxCols" até 2 colunas e devolve a primeira
  // divisão exata (resto 0). Se nenhuma for exata, devolve a que deixar
  // a última linha mais preenchida (menos espaços vazios).
  function bestColumnCount(n, maxCols) {
    var best = Math.min(n, maxCols);
    var bestFilled = -1;
    for (var c = Math.min(n, maxCols); c >= 2; c--) {
      var remainder = n % c;
      if (remainder === 0) return c;
      var filled = remainder;
      if (filled > bestFilled) {
        bestFilled = filled;
        best = c;
      }
    }
    return best;
  }

  function layoutFacts() {
    var narrow = window.innerWidth <= 600;
    document.querySelectorAll('.facts').forEach(function (block) {
      if (narrow) {
        block.style.gridTemplateColumns = '';
        return;
      }

      if (isMetaBlock(block)) {
        block.style.gridTemplateColumns = '2.4fr 1fr 1fr';
        return;
      }

      var items = block.querySelectorAll(':scope > .fact').length;
      if (items < 2) {
        block.style.gridTemplateColumns = '';
        return;
      }

      var cols = bestColumnCount(items, 4);
      block.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
    });
  }

  document.addEventListener('DOMContentLoaded', layoutFacts);
  window.addEventListener('resize', layoutFacts);
})();
