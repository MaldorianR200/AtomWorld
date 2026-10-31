import './styles/main.css';
import { stations } from './data/gameData.js';
import { completeStation, getState, isUnlocked, resetProgress, subscribe, updateState } from './modules/store.js';
import { launchConfetti } from './modules/effects.js';
import { playSound } from './modules/sound.js';
import { renderAtomStation } from './stations/atom.js';
import { renderPlantStation } from './stations/plant.js';
import { renderWasteStation } from './stations/waste.js';
import { renderWaterStation } from './stations/water.js';
import { renderCareersStation } from './stations/careers.js';

const stationRenderers = {
  atom: renderAtomStation,
  plant: renderPlantStation,
  waste: renderWasteStation,
  water: renderWaterStation,
  careers: renderCareersStation,
};

const app = document.querySelector('#app');

app.innerHTML = `
  <div class="site-shell">
    <header class="site-header">
      <a class="brand" href="#top" aria-label="AtomWorld — на главную">
        <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><b></b></span>
        <span>ATOM<strong>WORLD</strong></span>
      </a>
      <nav aria-label="Основная навигация">
        <a href="#route">Маршрут</a>
        <a href="#about">Об игре</a>
      </nav>
      <button class="sound-toggle" type="button" data-sound aria-label="Выключить звук">
        <span aria-hidden="true">♪</span><b>Звук</b>
      </button>
    </header>

    <main id="top">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-stars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
        <div class="hero-copy">
          <p class="eyebrow"><span></span> Интерактивная экспедиция</p>
          <h1 id="hero-title">ПОКОРИ<br /><em>АТОМНЫЙ МИР</em></h1>
          <p class="hero-lead">Пройди пять научных станций, раскрой секреты атомной энергии и получи звание покорителя атома.</p>
          <div class="hero-actions">
            <button class="button button--primary button--large" type="button" data-start>Начать экспедицию <span aria-hidden="true">→</span></button>
            <span><b>5</b> станций<br /><small>≈ 15 минут</small></span>
          </div>
        </div>
        <div class="hero-visual" aria-hidden="true">
          <div class="hero-atom">
            <span class="hero-orbit hero-orbit--1"><i></i></span>
            <span class="hero-orbit hero-orbit--2"><i></i></span>
            <span class="hero-orbit hero-orbit--3"><i></i></span>
            <div class="hero-nucleus"><i></i><i></i><i></i><i></i></div>
          </div>
          <div class="data-chip data-chip--top"><span>U</span><p><b>92</b> Уран<br /><small>топливо для АЭС</small></p></div>
          <div class="data-chip data-chip--bottom"><span>⚡</span><p><b>0 CO₂</b><br /><small>при выработке энергии</small></p></div>
          <span class="coordinate coordinate--one">55°45′N</span>
          <span class="coordinate coordinate--two">37°37′E</span>
        </div>
        <div class="scroll-cue"><i></i><span>Листай к маршруту</span></div>
      </section>

      <section class="route-section" id="route" aria-labelledby="route-title">
        <div class="section-heading">
          <div><p class="eyebrow">Твоя экспедиция</p><h2 id="route-title">Маршрут покорителя</h2></div>
          <p>Станции открываются по порядку. Выполни задание — и двигайся дальше.</p>
        </div>
        <div class="route-map" data-route-map></div>
      </section>

      <section class="game-section" id="game" aria-live="polite">
        <div class="station-shell">
          <header class="station-header" data-station-header></header>
          <div class="station-content" data-station-content></div>
        </div>
      </section>

      <section class="about-section" id="about">
        <div class="about-card about-card--title">
          <p class="eyebrow">Зачем это нужно</p>
          <h2>Наука начинается<br />с любопытства</h2>
          <p>AtomWorld помогает увидеть сложные процессы через понятные игровые задания — без скучных определений и страха ошибиться.</p>
        </div>
        <article class="about-card"><span>01</span><h3>Исследуй</h3><p>Знакомься с устройством атома и принципами работы АЭС.</p></article>
        <article class="about-card"><span>02</span><h3>Экспериментируй</h3><p>Проверяй гипотезы и получай короткие подсказки после ошибок.</p></article>
        <article class="about-card"><span>03</span><h3>Выбирай будущее</h3><p>Открой профессии людей, которые создают безопасные технологии.</p></article>
      </section>
    </main>

    <footer class="site-footer">
      <a class="brand brand--footer" href="#top"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><b></b></span><span>ATOM<strong>WORLD</strong></span></a>
      <p>Образовательный проект об атомной отрасли<br />для школьников 8–9 классов.</p>
      <p class="developer">Разработчик: <strong>Станислав Зеленков</strong><br /><a href="https://github.com/MaldorianR200" target="_blank" rel="noreferrer">github.com/MaldorianR200 ↗</a></p>
    </footer>
  </div>
`;

const routeMap = app.querySelector('[data-route-map]');
const stationHeader = app.querySelector('[data-station-header]');
const stationContent = app.querySelector('[data-station-content]');
const soundButton = app.querySelector('[data-sound]');

function renderRoute() {
  const state = getState();
  const progress = (state.completed.length / stations.length) * 100;
  routeMap.innerHTML = `
    <div class="route-progress" aria-hidden="true"><i style="width:${progress}%;--mobile-progress:${progress}%"></i></div>
    ${stations.map((station, index) => {
      const unlocked = isUnlocked(index);
      const completed = state.completed.includes(station.id);
      const current = state.currentStation === station.id;
      return `
        <button class="route-stop${completed ? ' is-complete' : ''}${current ? ' is-current' : ''}"
          type="button" data-station="${station.id}" ${unlocked ? '' : 'disabled'}
          aria-label="${station.short}. ${completed ? 'Пройдено' : unlocked ? 'Доступно' : 'Заблокировано'}">
          <span class="route-stop__index">${completed ? '✓' : station.number}</span>
          <span class="route-stop__orb" style="--station-color:${station.color}"><b>${unlocked ? station.icon : '⌁'}</b></span>
          <strong>${station.short}</strong>
          <small>${completed ? 'Пройдено' : current ? 'Текущая станция' : unlocked ? 'Доступно' : 'Сначала пройди предыдущую'}</small>
        </button>
      `;
    }).join('')}
  `;

  routeMap.querySelectorAll('[data-station]:not([disabled])').forEach((button) => {
    button.addEventListener('click', () => openStation(button.dataset.station, true));
  });
}

function renderStationHeader(stationId) {
  const station = stations.find((item) => item.id === stationId);
  stationHeader.style.setProperty('--station-color', station.color);
  stationHeader.innerHTML = `
    <div class="station-identity">
      <span>${station.icon}</span>
      <div><small>${station.kicker}</small><strong>${station.title}</strong></div>
    </div>
    <div class="station-number"><span>${station.number}</span> / 05</div>
  `;
}

function openStation(stationId, scroll = false) {
  const index = stations.findIndex((station) => station.id === stationId);
  if (index < 0 || !isUnlocked(index)) return;
  updateState({ currentStation: stationId });
  renderStationHeader(stationId);
  stationContent.classList.remove('station-content--certificate');
  stationRenderers[stationId](stationContent, () => finishStation(stationId));
  if (scroll) app.querySelector('#game').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function finishStation(stationId) {
  const index = stations.findIndex((station) => station.id === stationId);
  completeStation(stationId);
  playSound('success', getState().sound);
  launchConfetti();
  if (index < stations.length - 1) {
    const nextId = stations[index + 1].id;
    window.setTimeout(() => openStation(nextId), 250);
  } else {
    renderCertificate();
  }
}

function renderCertificate() {
  const state = getState();
  stationHeader.style.setProperty('--station-color', '#ffcf5a');
  stationHeader.innerHTML = `
    <div class="station-identity"><span>★</span><div><small>Маршрут завершён</small><strong>Финал экспедиции</strong></div></div>
    <div class="station-number"><span>05</span> / 05</div>
  `;
  stationContent.classList.add('station-content--certificate');
  stationContent.innerHTML = `
    <section class="final-screen">
      <div class="final-rays" aria-hidden="true"></div>
      <p class="eyebrow">Экспедиция завершена</p>
      <h2>ТЫ — ПОКОРИТЕЛЬ<br /><em>АТОМНОГО МИРА!</em></h2>
      <p>Все пять станций пройдены. Ты умеешь собирать атом, понимаешь путь энергии на АЭС, знаешь правила безопасности, очистки воды и профессии отрасли.</p>
      <div class="certificate" id="certificate">
        <span class="certificate__mark">⚛</span>
        <p>Диплом</p>
        <h3>Покорителя атома</h3>
        <small>награждается</small>
        <strong data-certificate-name>${state.playerName || 'Юный исследователь'}</strong>
        <div class="certificate__line"></div>
        <p class="certificate__caption">за успешное прохождение образовательного маршрута AtomWorld</p>
        <div class="certificate__meta"><span>5 / 5 станций</span><span>${new Date().toLocaleDateString('ru-RU')}</span></div>
      </div>
      <label class="name-field">Имя для диплома<input type="text" maxlength="40" placeholder="Например, Алексей" value="${state.playerName.replaceAll('"', '&quot;')}" data-player-name /></label>
      <div class="final-actions">
        <button class="button button--primary" type="button" data-print>Распечатать диплом</button>
        <button class="button button--ghost" type="button" data-restart>Пройти заново</button>
      </div>
    </section>
  `;

  launchConfetti();
  const input = stationContent.querySelector('[data-player-name]');
  input.addEventListener('input', () => {
    const name = input.value.trim();
    stationContent.querySelector('[data-certificate-name]').textContent = name || 'Юный исследователь';
    updateState({ playerName: name });
  });
  stationContent.querySelector('[data-print]').addEventListener('click', () => window.print());
  stationContent.querySelector('[data-restart]').addEventListener('click', () => {
    if (!window.confirm('Начать экспедицию заново? Сохранённый прогресс будет очищен.')) return;
    resetProgress();
    openStation('atom');
  });
}

function syncSoundButton() {
  const enabled = getState().sound;
  soundButton.classList.toggle('is-muted', !enabled);
  soundButton.setAttribute('aria-label', enabled ? 'Выключить звук' : 'Включить звук');
  soundButton.querySelector('span').textContent = enabled ? '♪' : '×';
}

soundButton.addEventListener('click', () => {
  const sound = !getState().sound;
  updateState({ sound });
  if (sound) playSound('click', true);
});

app.querySelector('[data-start]').addEventListener('click', () => {
  const state = getState();
  const targetId = state.completed.length === stations.length ? 'certificate' : state.currentStation;
  if (targetId === 'certificate') renderCertificate();
  app.querySelector('#game').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

subscribe(() => {
  renderRoute();
  syncSoundButton();
});

renderRoute();
syncSoundButton();

const initialState = getState();
if (initialState.completed.length === stations.length) renderCertificate();
else openStation(initialState.currentStation);
