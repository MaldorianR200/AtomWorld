import { plantParts, shuffled } from '../data/gameData.js';
import { completionMarkup, revealCompletion, signal, setFeedback } from '../modules/stationUi.js';

function plantIcon(type) {
  const icons = {
    reactor: '<span class="plant-symbol plant-symbol--reactor"><i></i><i></i><i></i></span>',
    steam: '<span class="plant-symbol plant-symbol--steam">≋</span>',
    turbine: '<span class="plant-symbol plant-symbol--turbine">✣</span>',
    generator: '<span class="plant-symbol plant-symbol--generator">ϟ</span>',
    transformer: '<span class="plant-symbol plant-symbol--transformer">⌁</span>',
    grid: '<span class="plant-symbol plant-symbol--grid">⌂</span>',
  };
  return icons[type];
}

function ensureShuffled() {
  let result = shuffled(plantParts);
  if (result.every((part, index) => part.id === plantParts[index].id)) {
    result = [...result.slice(1), result[0]];
  }
  return result;
}

export function renderPlantStation(root, onComplete) {
  let order = ensureShuffled();
  let selectedIndex = null;

  root.innerHTML = `
    <div class="task-intro">
      <div><p class="eyebrow">Задание 02 · схема АЭС</p><h2>Проследи путь энергии</h2></div>
      <p>Расставь шесть элементов по порядку: от рождения тепла в реакторе до передачи электричества в город.</p>
    </div>
    <div class="plant-scene" aria-hidden="true">
      <div class="plant-scene__sun"></div><div class="cooling-tower"><i></i></div>
      <div class="reactor-dome"></div><div class="power-lines"><i></i><i></i><i></i></div>
      <div class="plant-scene__ground"></div>
    </div>
    <div class="sequence-head"><span>Начало: тепло</span><i></i><span>Результат: электричество</span></div>
    <div class="plant-puzzle" data-puzzle aria-label="Части АЭС. Выберите две карточки, чтобы поменять их местами"></div>
    <div class="feedback feedback--info" data-feedback role="status"><span>i</span><p>Выбери две карточки по очереди — они поменяются местами.</p></div>
    <div class="task-actions">
      <button class="button button--ghost" type="button" data-shuffle>Перемешать</button>
      <button class="button button--primary" type="button" data-check>Проверить схему <span aria-hidden="true">→</span></button>
    </div>
  `;

  const puzzle = root.querySelector('[data-puzzle]');

  function draw() {
    puzzle.innerHTML = order.map((part, index) => `
      <button class="plant-card${selectedIndex === index ? ' is-selected' : ''}" type="button" data-index="${index}">
        <span class="plant-card__number">${String(index + 1).padStart(2, '0')}</span>
        ${plantIcon(part.icon)}
        <strong>${part.name}</strong>
        <small>${part.caption}</small>
      </button>
    `).join('');

    puzzle.querySelectorAll('[data-index]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.index);
        if (selectedIndex === null) {
          selectedIndex = index;
          setFeedback(root, `Выбран элемент «${order[index].name}». Теперь выбери, с чем его поменять.`, 'info');
        } else if (selectedIndex === index) {
          selectedIndex = null;
        } else {
          [order[selectedIndex], order[index]] = [order[index], order[selectedIndex]];
          selectedIndex = null;
          signal(root, 'click', 'Элементы поменялись местами. Проверь всю цепочку.');
        }
        draw();
      });
    });
  }

  draw();

  root.querySelector('[data-shuffle]').addEventListener('click', () => {
    order = ensureShuffled();
    selectedIndex = null;
    draw();
    setFeedback(root, 'Схема перемешана. Начни с элемента, где выделяется тепло.', 'info');
  });

  root.querySelector('[data-check]').addEventListener('click', () => {
    const firstWrong = order.findIndex((part, index) => part.id !== plantParts[index].id);
    if (firstWrong === -1) {
      signal(root, 'success', 'Цепочка преобразования энергии собрана!');
      window.setTimeout(() => {
        root.innerHTML = completionMarkup('Станция пройдена', 'АЭС запущена!', 'На АЭС энергия деления ядер превращается в тепло, движение турбины, а затем — в электричество.');
        root.querySelector('[data-next-station]').addEventListener('click', onComplete);
        revealCompletion(root);
      }, 550);
    } else {
      const expected = plantParts[firstWrong];
      signal(root, 'error', `На позиции ${firstWrong + 1} должен быть другой элемент. Подсказка: здесь ${expected.caption}.`);
    }
  });
}

