import { particleTypes, shuffled } from '../data/gameData.js';
import { completionMarkup, enableDragToTargets, revealCompletion, signal, setFeedback } from '../modules/stationUi.js';

const particles = [
  { id: 'p1', type: 'proton' }, { id: 'p2', type: 'proton' },
  { id: 'n1', type: 'neutron' }, { id: 'n2', type: 'neutron' },
  { id: 'e1', type: 'electron' }, { id: 'e2', type: 'electron' },
];

function particleMarkup(particle) {
  const type = particleTypes[particle.type];
  return `
    <button class="particle ${type.className}" type="button" draggable="true"
      data-particle data-id="${particle.id}" data-type="${particle.type}"
      aria-label="${type.label}. Выбрать частицу">
      <span>${type.symbol}</span><small>${type.label}</small>
    </button>
  `;
}

export function renderAtomStation(root, onComplete) {
  const placement = new Map();
  let selectedId = null;

  root.innerHTML = `
    <div class="task-intro">
      <div>
        <p class="eyebrow">Задание 01 · атом гелия</p>
        <h2>Помоги атому обрести форму</h2>
      </div>
      <p>Перенеси <strong>2 протона</strong> и <strong>2 нейтрона</strong> в ядро, а <strong>2 электрона</strong> — на электронную оболочку.</p>
    </div>

    <div class="atom-lab">
      <section class="particle-tray" aria-label="Частицы для сборки">
        <div class="panel-label"><span>01</span> Частицы</div>
        <div class="particle-list" data-particle-list>
          ${shuffled(particles).map(particleMarkup).join('')}
        </div>
        <p class="microcopy">Перетаскивай частицы или выбирай их нажатием.</p>
      </section>

      <section class="atom-builder" aria-label="Модель атома">
        <div class="atom-orbits" data-drop-target="shell" tabindex="0" role="button" aria-label="Электронная оболочка">
          <span class="orbit orbit--one"></span>
          <span class="orbit orbit--two"></span>
          <span class="orbit orbit--three"></span>
          <div class="electron-slots" data-shell-slots></div>
          <div class="nucleus" data-drop-target="nucleus" tabindex="0" role="button" aria-label="Ядро атома">
            <span class="nucleus__label">Ядро</span>
            <div class="nucleus__slots" data-nucleus-slots></div>
          </div>
        </div>
        <div class="atom-legend">
          <span><i class="dot dot--proton"></i> протон +</span>
          <span><i class="dot dot--neutron"></i> нейтрон 0</span>
          <span><i class="dot dot--electron"></i> электрон −</span>
        </div>
      </section>
    </div>

    <div class="feedback feedback--info" data-feedback role="status"><span>i</span><p>Ядро находится в центре, а электроны движутся вокруг него.</p></div>
    <div class="task-actions">
      <button class="button button--ghost" type="button" data-reset>Собрать заново</button>
      <button class="button button--primary" type="button" data-check>Проверить атом <span aria-hidden="true">→</span></button>
    </div>
  `;

  const list = root.querySelector('[data-particle-list]');
  const nucleusSlots = root.querySelector('[data-nucleus-slots]');
  const shellSlots = root.querySelector('[data-shell-slots]');

  function selectParticle(button) {
    root.querySelectorAll('[data-particle]').forEach((item) => item.classList.remove('is-selected'));
    if (!button || placement.has(button.dataset.id)) {
      selectedId = null;
      return;
    }
    selectedId = button.dataset.id;
    button.classList.add('is-selected');
    setFeedback(root, `Выбрана частица «${particleTypes[button.dataset.type].label}». Теперь выбери область атома.`, 'info');
  }

  function place(id, zone) {
    const button = root.querySelector(`[data-id="${id}"]`);
    if (!button) return;
    const type = button.dataset.type;
    const correctZone = type === 'electron' ? 'shell' : 'nucleus';
    if (zone !== correctZone) {
      signal(root, 'error', type === 'electron'
        ? 'Электроны находятся не в ядре, а на электронной оболочке.'
        : 'Протоны и нейтроны образуют ядро в центре атома.');
      return;
    }
    const destination = zone === 'nucleus' ? nucleusSlots : shellSlots;
    if ((zone === 'nucleus' && destination.children.length >= 4) || (zone === 'shell' && destination.children.length >= 2)) {
      signal(root, 'error', 'Эта область уже заполнена. Проверь количество частиц.');
      return;
    }
    placement.set(id, zone);
    button.classList.remove('is-selected');
    button.classList.add('is-placed');
    destination.append(button);
    selectedId = null;
    signal(root, 'click', 'Отлично, частица заняла своё место. Продолжай сборку!');
  }

  root.querySelectorAll('[data-particle]').forEach((button) => {
    button.addEventListener('click', () => selectParticle(button));
  });

  root.querySelectorAll('[data-drop-target]').forEach((target) => {
    target.addEventListener('click', (event) => {
      if (event.target.closest('[data-particle]')) return;
      if (selectedId) {
        event.stopPropagation();
        place(selectedId, target.dataset.dropTarget);
      }
    });
    target.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && selectedId) {
        event.preventDefault();
        place(selectedId, target.dataset.dropTarget);
      }
    });
  });

  enableDragToTargets(root, '[data-particle]', (id, zone) => place(id, zone));

  root.querySelector('[data-reset]').addEventListener('click', () => {
    placement.clear();
    selectedId = null;
    list.innerHTML = shuffled(particles).map(particleMarkup).join('');
    renderAtomStation(root, onComplete);
  });

  root.querySelector('[data-check]').addEventListener('click', () => {
    const protons = [...placement.keys()].filter((id) => id.startsWith('p')).length;
    const neutrons = [...placement.keys()].filter((id) => id.startsWith('n')).length;
    const electrons = [...placement.keys()].filter((id) => id.startsWith('e')).length;
    if (protons === 2 && neutrons === 2 && electrons === 2) {
      signal(root, 'success', 'Атом гелия собран правильно!');
      window.setTimeout(() => {
        root.innerHTML = completionMarkup('Станция пройдена', 'Малыш Атом готов!', 'В ядре гелия находятся два протона и два нейтрона, а вокруг движутся два электрона.');
        root.querySelector('[data-next-station]').addEventListener('click', onComplete);
        revealCompletion(root);
      }, 550);
    } else {
      signal(root, 'error', `Пока не хватает частиц: в модели ${protons}/2 протонов, ${neutrons}/2 нейтронов и ${electrons}/2 электронов.`);
    }
  });
}

