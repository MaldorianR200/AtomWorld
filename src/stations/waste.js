import { hazardTypes, shuffled, wasteItems } from '../data/gameData.js';
import { completionMarkup, enableDragToTargets, revealCompletion, signal, setFeedback } from '../modules/stationUi.js';

export function renderWasteStation(root, onComplete) {
  let selectedId = null;
  const sorted = new Set();
  const items = shuffled(wasteItems);

  root.innerHTML = `
    <div class="task-intro">
      <div><p class="eyebrow">Задание 03 · пять опасностей</p><h2>Сортируй без риска</h2></div>
      <p>Определи главный тип опасности каждого предмета. Ошибка не отнимет очки — используй подсказку и попробуй снова.</p>
    </div>
    <div class="waste-workspace">
      <section class="waste-items" aria-label="Отходы для сортировки">
        <div class="panel-label"><span data-counter>0 / ${items.length}</span> Рассортировано</div>
        <div class="waste-grid" data-items>
          ${items.map((item) => `
            <button class="waste-item" type="button" draggable="true" data-waste data-id="${item.id}" data-type="${item.type}">
              <span>${item.icon}</span><strong>${item.title}</strong>
            </button>
          `).join('')}
        </div>
      </section>
      <section class="hazard-bins" aria-label="Контейнеры по типам опасности">
        ${hazardTypes.map((type) => `
          <button class="hazard-bin" type="button" data-drop-target="${type.id}" style="--bin-color:${type.color}">
            <span class="hazard-bin__symbol">${type.symbol}</span>
            <span><strong>${type.title}</strong><small>опасность</small></span>
            <i data-bin-count="${type.id}">0</i>
          </button>
        `).join('')}
      </section>
    </div>
    <div class="feedback feedback--info" data-feedback role="status"><span>i</span><p>Выбери предмет, затем подходящий контейнер. Можно также перетаскивать.</p></div>
  `;

  function choose(button) {
    root.querySelectorAll('[data-waste]').forEach((item) => item.classList.remove('is-selected'));
    selectedId = button.dataset.id;
    button.classList.add('is-selected');
    setFeedback(root, `Куда отправить «${button.querySelector('strong').textContent}»?`, 'info');
  }

  function sortItem(id, type) {
    const item = root.querySelector(`[data-waste][data-id="${id}"]`);
    if (!item || sorted.has(id)) return;
    const expected = item.dataset.type;
    if (type !== expected) {
      const expectedType = hazardTypes.find((hazard) => hazard.id === expected);
      signal(root, 'error', `Не совсем так: ${expectedType.hint}.`);
      return;
    }
    sorted.add(id);
    item.classList.add('is-sorted');
    window.setTimeout(() => item.remove(), 320);
    const count = [...sorted].filter((sortedId) => wasteItems.find((candidate) => candidate.id === sortedId)?.type === type).length;
    root.querySelector(`[data-bin-count="${type}"]`).textContent = count;
    root.querySelector('[data-counter]').textContent = `${sorted.size} / ${items.length}`;
    selectedId = null;
    signal(root, 'click', 'Верно! Отход отправлен на безопасную переработку.');

    if (sorted.size === items.length) {
      window.setTimeout(() => {
        signal(root, 'success', 'Все отходы рассортированы безопасно!');
        window.setTimeout(() => {
          root.innerHTML = completionMarkup('Станция пройдена', 'Территория безопасна!', 'Разные типы опасных отходов нельзя смешивать: для каждого предусмотрены свои сбор, хранение и переработка.');
          root.querySelector('[data-next-station]').addEventListener('click', onComplete);
          revealCompletion(root);
        }, 500);
      }, 300);
    }
  }

  root.querySelectorAll('[data-waste]').forEach((button) => button.addEventListener('click', () => choose(button)));
  root.querySelectorAll('[data-drop-target]').forEach((bin) => {
    bin.addEventListener('click', () => {
      if (selectedId) sortItem(selectedId, bin.dataset.dropTarget);
      else setFeedback(root, 'Сначала выбери один из предметов слева.', 'info');
    });
  });
  enableDragToTargets(root, '[data-waste]', (id, type) => sortItem(id, type));
}

