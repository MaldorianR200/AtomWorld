import { stations } from '../data/gameData.js';

const STORAGE_KEY = 'atomworld-progress-v1';

const initialState = {
  completed: [],
  currentStation: 'atom',
  sound: true,
  playerName: '',
};

function sanitize(value) {
  const completed = Array.isArray(value?.completed)
    ? value.completed.filter((id) => stations.some((station) => station.id === id))
    : [];

  return {
    ...initialState,
    ...value,
    completed: [...new Set(completed)],
  };
}

function load() {
  try {
    return sanitize(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  } catch {
    return { ...initialState };
  }
}

let state = load();
const listeners = new Set();

function emit() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  listeners.forEach((listener) => listener(getState()));
}

export function getState() {
  return { ...state, completed: [...state.completed] };
}

export function updateState(patch) {
  state = sanitize({ ...state, ...patch });
  emit();
}

export function completeStation(stationId) {
  if (state.completed.includes(stationId)) return;
  updateState({ completed: [...state.completed, stationId] });
}

export function resetProgress() {
  state = { ...initialState, sound: state.sound };
  emit();
}

export function isUnlocked(index) {
  return index === 0 || state.completed.includes(stations[index - 1].id);
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

