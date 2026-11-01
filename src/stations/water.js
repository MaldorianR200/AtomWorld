import { shuffled, waterSteps } from '../data/gameData.js';
import { completionMarkup, revealCompletion, signal, setFeedback } from '../modules/stationUi.js';

function initialOrder() {
  let result = shuffled(waterSteps);
  if (result.every((step, index) => step.id === waterSteps[index].id)) result.reverse();
  return result;
}

export function renderWaterStation(root, onComplete) {
  let order = initialOrder();
  let selectedIndex = null;

  root.innerHTML = `
    <div class="task-intro">
      <div><p class="eyebrow">Задание 04 · очистка воды</p><h2>Верни воде чистоту</h2></div>
      <p>Выстрой технологическую цепочку от грубой очистки до финального обеззараживания.</p>
    </div>
    <div class="water-lab">
      <div class="water-meter" aria-label="Путь воды">
        <span class="water-meter__dirty">Грязная вода</span><i><b></b></i><span class="water-meter__clean">Чистая вода</span>
      </div>
      <div class="water-steps" data-water-steps></div>
    </div>
    <div class="feedback feedback--info" data-feedback role="status"><span>i</span><p>Нажми на два этапа, чтобы поменять их местами.</p></div>
    <div class="task-actions">
      <button class="button button--ghost" type="button" data-shuffle>Перемешать</button>
      <button class="button button--primary" type="button" data-check>Запустить очистку <span aria-hidden="true">→</span></button>
    </div>
  `;

  const list = root.querySelector('[data-water-steps]');

  function draw() {
    list.innerHTML = order.map((step, index) => `
      <button class="water-step${selectedIndex === index ? ' is-selected' : ''}" type="button" data-index="${index}">
        <span class="water-step__index">${index + 1}</span>
        <span class="water-step__icon">${step.icon}</span>
        <span><strong>${step.title}</strong><small>${step.text}</small></span>
        <span class="water-step__grip" aria-hidden="true">⠿</span>
      </button>
    `).join('');
    list.querySelectorAll('[data-index]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.index);
        if (selectedIndex === null) {
          selectedIndex = index;
          setFeedback(root, `Выбран этап «${order[index].title}». Теперь выбери вторую позицию.`, 'info');
        } else if (selectedIndex === index) {
          selectedIndex = null;
        } else {
          [order[selectedIndex], order[index]] = [order[index], order[selectedIndex]];
          selectedIndex = null;
          signal(root, 'click', 'Этапы поменялись местами.');
        }
        draw();
      });
    });
  }

  draw();

  root.querySelector('[data-shuffle]').addEventListener('click', () => {
    order = initialOrder();
    selectedIndex = null;
    draw();
  });

  root.querySelector('[data-check]').addEventListener('click', () => {
    const wrong = order.findIndex((step, index) => step.id !== waterSteps[index].id);
    if (wrong === -1) {
      root.querySelector('.water-meter b').classList.add('is-flowing');
      signal(root, 'success', 'Цепочка работает — вода очищена!');
      window.setTimeout(() => {
        root.innerHTML = completionMarkup('Станция пройдена', 'Вода снова чистая!', 'Многоступенчатая система последовательно удаляет крупный мусор, частицы, растворённые примеси и микроорганизмы.');
        root.querySelector('[data-next-station]').addEventListener('click', onComplete);
        revealCompletion(root);
      }, 900);
    } else {
      const expected = waterSteps[wrong];
      signal(root, 'error', `На шаге ${wrong + 1} нужен этап «${expected.title}»: ${expected.text.toLowerCase()}.`);
    }
  });
}

