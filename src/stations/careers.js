import { careerQuestions, professions } from '../data/gameData.js';
import { completionMarkup, signal } from '../modules/stationUi.js';

export function renderCareersStation(root, onComplete) {
  let questionIndex = 0;
  let correctAnswers = 0;

  root.innerHTML = `
    <div class="task-intro">
      <div><p class="eyebrow">Задание 05 · профессии Росатома</p><h2>Собери команду будущего</h2></div>
      <p>Атомная отрасль объединяет тысячи специалистов. Определи, кто лучше всего справится с каждой задачей.</p>
    </div>
    <div class="career-quiz">
      <div class="quiz-progress"><span data-progress-label>Задача 1 из ${careerQuestions.length}</span><i><b data-progress-bar></b></i></div>
      <section class="mission-card" aria-live="polite">
        <span class="mission-card__badge">Ваша миссия</span>
        <p data-question></p>
      </section>
      <div class="profession-grid" data-professions></div>
    </div>
    <div class="feedback feedback--info" data-feedback role="status"><span>i</span><p>Выбери специалиста, чьи знания подходят для этой задачи.</p></div>
  `;

  const question = root.querySelector('[data-question]');
  const grid = root.querySelector('[data-professions]');
  const label = root.querySelector('[data-progress-label]');
  const bar = root.querySelector('[data-progress-bar]');

  function draw() {
    const current = careerQuestions[questionIndex];
    question.textContent = current.task;
    label.textContent = `Задача ${questionIndex + 1} из ${careerQuestions.length}`;
    bar.style.width = `${(correctAnswers / careerQuestions.length) * 100}%`;
    grid.innerHTML = professions.map((profession) => `
      <button class="profession-card" type="button" data-profession="${profession.id}">
        <span>${profession.icon}</span><strong>${profession.title}</strong><i aria-hidden="true">→</i>
      </button>
    `).join('');
    grid.querySelectorAll('[data-profession]').forEach((button) => {
      button.addEventListener('click', () => answer(button));
    });
  }

  function answer(button) {
    const current = careerQuestions[questionIndex];
    if (button.dataset.profession !== current.answer) {
      button.classList.add('is-wrong');
      window.setTimeout(() => button.classList.remove('is-wrong'), 650);
      signal(root, 'error', current.hint);
      return;
    }
    button.classList.add('is-correct');
    signal(root, 'success', 'Точно! Этот специалист подходит для задачи.');
    correctAnswers += 1;
    bar.style.width = `${(correctAnswers / careerQuestions.length) * 100}%`;
    window.setTimeout(() => {
      questionIndex += 1;
      if (questionIndex >= careerQuestions.length) {
        root.innerHTML = completionMarkup('Финальная станция пройдена', 'Команда собрана!', 'Оператор, проектировщик, физик, специалист по безопасности и эколог вместе создают безопасные атомные технологии.');
        root.querySelector('[data-next-station]').textContent = 'Получить звание →';
        root.querySelector('[data-next-station]').addEventListener('click', onComplete);
      } else {
        draw();
      }
    }, 650);
  }

  draw();
}
