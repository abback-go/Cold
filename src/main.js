// 게임 루프 + 상태 관리. 단방향 데이터 흐름의 유일한 변경 지점.

import { SCENES, INITIAL_METRICS, METRIC_KEYS } from './scenes.js';
import {
  showScreen,
  renderMeters,
  renderScene,
  renderProgress,
  showFeedback,
  markChoiceSelected,
  renderEnding,
  openShareModal,
  TOTAL_SCENES,
} from './ui.js';
import { determineEnding } from './ending.js';

// ============== 상태 ==============

const state = {
  metrics: { ...INITIAL_METRICS },
  currentSceneIndex: 0,
  history: [],
};

// ============== 유틸 ==============

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function applyEffects(effects) {
  const next = { ...state.metrics };
  METRIC_KEYS.forEach((key) => {
    next[key] = clamp(next[key] + (effects[key] ?? 0), 0, 100);
  });
  return next;
}

// ============== 게임 흐름 ==============

function startGame() {
  state.metrics = { ...INITIAL_METRICS };
  state.currentSceneIndex = 0;
  state.history = [];
  showScreen('game');
  renderMeters(state.metrics);
  enterCurrentScene();
}

function enterCurrentScene() {
  const scene = SCENES[state.currentSceneIndex];
  renderScene(scene, handleChoice);
  renderProgress(state.currentSceneIndex, TOTAL_SCENES);
}

function handleChoice(choiceIndex, btnEl) {
  const scene = SCENES[state.currentSceneIndex];
  const choice = scene.choices[choiceIndex];
  if (!choice) return;

  const prevMetrics = { ...state.metrics };
  state.metrics = applyEffects(choice.effects);
  state.history.push({ sceneId: scene.id, choiceIndex });

  markChoiceSelected(btnEl);
  renderMeters(state.metrics, prevMetrics);
  showFeedback(choice, () => goNext(scene, choice));
}

function goNext(scene, choice) {
  // 마지막 장면이거나 next가 null이면 엔딩으로
  const isLast = state.currentSceneIndex >= TOTAL_SCENES - 1 || choice.next === null;
  if (isLast) {
    finishGame();
    return;
  }

  // next 값이 있으면 해당 id의 인덱스로 이동, 없으면 다음 인덱스
  if (typeof choice.next === 'number') {
    const idx = SCENES.findIndex((s) => s.id === choice.next);
    state.currentSceneIndex = idx >= 0 ? idx : state.currentSceneIndex + 1;
  } else {
    state.currentSceneIndex += 1;
  }
  enterCurrentScene();
}

function finishGame() {
  const { ending, total } = determineEnding(state.metrics);
  showScreen('ending');
  renderEnding({
    ending,
    total,
    metrics: state.metrics,
    history: state.history,
  });

  document.getElementById('btn-restart').onclick = startGame;
  document.getElementById('btn-share').onclick = () =>
    openShareModal({ ending, total, metrics: state.metrics });
}

// ============== 부트스트랩 ==============

function init() {
  document.getElementById('btn-start').addEventListener('click', startGame);
  // 초기 화면은 타이틀
  showScreen('title');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
