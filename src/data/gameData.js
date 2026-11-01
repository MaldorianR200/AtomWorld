export const stations = [
  {
    id: 'atom',
    number: '01',
    short: 'Малыш Атом',
    title: 'Собери малыша Атома',
    kicker: 'Устройство вещества',
    icon: '⚛',
    color: '#6ee7c4',
    description: 'Разберись, из чего состоит атом, и собери устойчивый атом гелия.',
  },
  {
    id: 'plant',
    number: '02',
    short: 'Атомная станция',
    title: 'Энергия в деталях',
    kicker: 'Как работает АЭС',
    icon: '⌁',
    color: '#55b8ff',
    description: 'Восстанови путь энергии и узнай основные части атомной электростанции.',
  },
  {
    id: 'waste',
    number: '03',
    short: 'Опасные отходы',
    title: 'Сортировка без риска',
    kicker: 'Экология и безопасность',
    icon: '♻',
    color: '#ffcf5a',
    description: 'Определи пять типов опасности и отправь каждый предмет в нужный контейнер.',
  },
  {
    id: 'water',
    number: '04',
    short: 'Чистая вода',
    title: 'Путь чистой воды',
    kicker: 'Современная очистка',
    icon: '◉',
    color: '#75d8ff',
    description: 'Расположи этапы очистки так, чтобы вода снова стала безопасной.',
  },
  {
    id: 'careers',
    number: '05',
    short: 'Мир профессий',
    title: 'Команда будущего',
    kicker: 'Профессии Росатома',
    icon: '✦',
    color: '#c7a6ff',
    description: 'Подбери специалиста для каждой важной задачи атомной отрасли.',
  },
];

export const particleTypes = {
  proton: { label: 'Протон', symbol: 'p⁺', className: 'particle--proton' },
  neutron: { label: 'Нейтрон', symbol: 'n⁰', className: 'particle--neutron' },
  electron: { label: 'Электрон', symbol: 'e⁻', className: 'particle--electron' },
};

export const plantParts = [
  { id: 'reactor', name: 'Реактор', caption: 'деление ядер выделяет тепло', icon: 'reactor' },
  { id: 'steam', name: 'Парогенератор', caption: 'тепло превращает воду в пар', icon: 'steam' },
  { id: 'turbine', name: 'Турбина', caption: 'пар вращает лопатки', icon: 'turbine' },
  { id: 'generator', name: 'Генератор', caption: 'вращение становится током', icon: 'generator' },
  { id: 'transformer', name: 'Трансформатор', caption: 'напряжение повышается', icon: 'transformer' },
  { id: 'grid', name: 'Электросеть', caption: 'энергия приходит в города', icon: 'grid' },
];

export const hazardTypes = [
  { id: 'radioactive', title: 'Радиационная', symbol: '☢', color: '#ffe066', hint: 'ищи знак радиации или источники излучения' },
  { id: 'toxic', title: 'Токсическая', symbol: '☠', color: '#85e6c4', hint: 'ядовитые вещества требуют герметичной утилизации' },
  { id: 'flammable', title: 'Пожарная', symbol: '◆', color: '#ff8a6b', hint: 'горючие материалы нельзя смешивать с обычным мусором' },
  { id: 'biological', title: 'Биологическая', symbol: '☣', color: '#d8a9ff', hint: 'медицинские и биологические материалы обеззараживают' },
  { id: 'electrical', title: 'Электронная', symbol: 'ϟ', color: '#75cfff', hint: 'техника и батареи отправляются на специальную переработку' },
];

export const wasteItems = [
  { id: 'dosimeter', title: 'Старый источник излучения', icon: '☢', type: 'radioactive' },
  { id: 'isotope', title: 'Контейнер с изотопом', icon: '▣', type: 'radioactive' },
  { id: 'solvent', title: 'Банка растворителя', icon: '⚗', type: 'toxic' },
  { id: 'mercury', title: 'Ртутная лампа', icon: '⌇', type: 'toxic' },
  { id: 'oil', title: 'Промасленная ветошь', icon: '♨', type: 'flammable' },
  { id: 'fuel', title: 'Остатки топлива', icon: '▰', type: 'flammable' },
  { id: 'gloves', title: 'Медицинские перчатки', icon: '✋', type: 'biological' },
  { id: 'culture', title: 'Лабораторная посуда', icon: '◌', type: 'biological' },
  { id: 'battery', title: 'Литиевая батарея', icon: '▥', type: 'electrical' },
  { id: 'circuit', title: 'Плата управления', icon: '▦', type: 'electrical' },
];

export const waterSteps = [
  { id: 'screen', title: 'Механическая решётка', text: 'Задерживает крупный мусор', icon: '▥' },
  { id: 'settle', title: 'Отстаивание', text: 'Тяжёлые частицы оседают на дно', icon: '⌄' },
  { id: 'filter', title: 'Песчаный фильтр', text: 'Убирает мелкие взвеси', icon: '≋' },
  { id: 'sorb', title: 'Сорбционная очистка', text: 'Активированный уголь забирает примеси', icon: '⬡' },
  { id: 'uv', title: 'УФ-обеззараживание', text: 'Ультрафиолет обезвреживает микроорганизмы', icon: '✦' },
];

export const careerQuestions = [
  {
    task: 'Управлять реакторной установкой и следить за её параметрами в режиме реального времени.',
    answer: 'operator',
    hint: 'Этот специалист работает на блочном щите управления.',
  },
  {
    task: 'Проектировать новые энергоблоки и рассчитывать надёжность сложных конструкций.',
    answer: 'engineer',
    hint: 'Нужен человек, который превращает расчёты в чертежи и цифровые модели.',
  },
  {
    task: 'Исследовать свойства атомных ядер и создавать новые реакторные технологии.',
    answer: 'physicist',
    hint: 'Его главный инструмент — фундаментальная наука об атомном ядре.',
  },
  {
    task: 'Контролировать дозы излучения и организовывать безопасную работу персонала.',
    answer: 'safety',
    hint: 'Этот специалист отвечает за правила радиационной защиты.',
  },
  {
    task: 'Проверять влияние предприятия на воду, воздух и живые организмы.',
    answer: 'ecologist',
    hint: 'Он защищает окружающую среду и ведёт экологический мониторинг.',
  },
];

export const professions = [
  { id: 'safety', title: 'Инженер по радиационной безопасности', icon: '◉' },
  { id: 'physicist', title: 'Физик-ядерщик', icon: '⚛' },
  { id: 'ecologist', title: 'Инженер-эколог', icon: '♧' },
  { id: 'operator', title: 'Оператор АЭС', icon: '⌁' },
  { id: 'engineer', title: 'Инженер-проектировщик', icon: '△' },
];

export function shuffled(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

