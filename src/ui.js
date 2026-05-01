// UI 렌더링 — 상태를 읽어 DOM을 업데이트한다. 상태 변경은 main.js에서만 한다.

import { METRIC_META, METRIC_KEYS, SCENES } from './scenes.js';
import { buildReport, buildShareCardText } from './ending.js';

const CRITICAL_THRESHOLD = 30;

// ============== 공통: 화면 전환 ==============

const screens = {
  title:  document.getElementById('screen-title'),
  game:   document.getElementById('screen-game'),
  ending: document.getElementById('screen-ending'),
};

export function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    const isTarget = key === name;
    el.hidden = !isTarget;
    el.classList.toggle('is-active', isTarget);
  });
  // 화면 전환 시 상단으로 스크롤
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============== 지표 게이지 ==============

export function renderMeters(metrics, prevMetrics) {
  METRIC_KEYS.forEach((key) => {
    const value = metrics[key];
    const fillEl = document.querySelector(`[data-fill="${key}"]`);
    const valueEl = document.querySelector(`[data-value="${key}"]`);
    const meterEl = fillEl?.closest('.meter');
    if (!fillEl || !valueEl || !meterEl) return;

    fillEl.style.width = `${value}%`;
    valueEl.textContent = String(value);

    meterEl.classList.toggle('is-critical', value <= CRITICAL_THRESHOLD);

    if (prevMetrics && prevMetrics[key] !== undefined) {
      const diff = value - prevMetrics[key];
      meterEl.classList.toggle('is-changed-up', diff > 0);
      meterEl.classList.toggle('is-changed-down', diff < 0);
      if (diff !== 0) {
        setTimeout(() => {
          meterEl.classList.remove('is-changed-up', 'is-changed-down');
        }, 1200);
      }
    }
  });
}

// ============== 장면 ==============

export function renderScene(scene, onChoiceClick) {
  document.getElementById('scene-title').textContent = scene.title;
  document.getElementById('scene-time').textContent = scene.time;
  const imgEl = document.getElementById('scene-image');
  imgEl.src = scene.image;
  imgEl.alt = scene.title;
  document.getElementById('scene-narrative').textContent = scene.narrative;

  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';
  choicesEl.hidden = false;

  scene.choices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn';
    btn.dataset.idx = String(idx);
    btn.innerHTML = `
      <span class="choice-btn-num">${idx + 1}</span>
      <span class="choice-btn-text"></span>
    `;
    btn.querySelector('.choice-btn-text').textContent = choice.text;
    btn.addEventListener('click', () => onChoiceClick(idx, btn));
    choicesEl.appendChild(btn);
  });

  // 피드백 영역 초기화
  const feedbackEl = document.getElementById('feedback');
  feedbackEl.hidden = true;
  feedbackEl.classList.remove('is-correct', 'is-wrong');
}

export function showFeedback(choice, onNext) {
  const feedbackEl = document.getElementById('feedback');
  const titleEl = document.getElementById('feedback-title');
  const iconEl = document.getElementById('feedback-icon');
  const textEl = document.getElementById('feedback-text');
  const effectsEl = document.getElementById('feedback-effects');
  const nextBtn = document.getElementById('btn-next');

  feedbackEl.classList.toggle('is-correct', choice.isCorrect);
  feedbackEl.classList.toggle('is-wrong', !choice.isCorrect);

  titleEl.textContent = choice.isCorrect ? '좋은 선택!' : '아쉬운 선택';
  iconEl.src = choice.isCorrect
    ? 'assets/icons/icon_check.svg'
    : 'assets/icons/icon_cross.svg';
  iconEl.alt = choice.isCorrect ? '정답' : '오답';
  textEl.textContent = choice.feedback;

  effectsEl.innerHTML = '';
  METRIC_KEYS.forEach((key) => {
    const delta = choice.effects[key];
    if (delta === 0) return;
    const li = document.createElement('li');
    const sign = delta > 0 ? '+' : '';
    li.textContent = `${METRIC_META[key].label} ${sign}${delta}`;
    li.classList.add(delta > 0 ? 'is-up' : 'is-down');
    effectsEl.appendChild(li);
  });

  feedbackEl.hidden = false;

  // 선택 버튼 비활성화
  document.querySelectorAll('.choice-btn').forEach((btn) => {
    btn.disabled = true;
  });

  // "다음으로" 핸들러를 매번 새로 바인딩
  const newBtn = nextBtn.cloneNode(true);
  nextBtn.parentNode.replaceChild(newBtn, nextBtn);
  newBtn.addEventListener('click', onNext);
  newBtn.focus();
}

export function markChoiceSelected(btn) {
  btn.classList.add('is-selected');
}

// ============== 진행률 ==============

export function renderProgress(currentIndex, total) {
  const fill = document.getElementById('progress-fill');
  const count = document.getElementById('progress-count');
  fill.style.width = `${((currentIndex + 1) / total) * 100}%`;
  count.textContent = `${currentIndex + 1} / ${total}`;
}

// ============== 엔딩 ==============

export function renderEnding({ ending, total, metrics, history }) {
  const endingEl = document.getElementById('screen-ending');
  endingEl.classList.remove('is-master', 'is-pass', 'is-crisis');
  endingEl.classList.add(`is-${ending.key}`);

  const imgEl = document.getElementById('ending-image');
  imgEl.src = ending.image;
  imgEl.alt = ending.title;
  document.getElementById('ending-title').textContent = ending.title;
  document.getElementById('ending-summary').textContent = ending.summary;
  document.getElementById('ending-score-value').textContent = String(total);

  // 복기 리포트 — 잘못 선택한 항목 우선, 정답은 간략히
  const reportData = buildReport(history);
  const listEl = document.getElementById('report-list');
  listEl.innerHTML = '';

  reportData.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'report-item' + (item.isCorrect ? '' : ' is-wrong');
    li.innerHTML = `
      <img class="report-item-icon" alt="" src="${
        item.isCorrect ? 'assets/icons/icon_check.svg' : 'assets/icons/icon_warning.svg'
      }" />
      <div class="report-item-body">
        <p class="report-item-title"></p>
        <p class="report-item-text"></p>
      </div>
    `;
    li.querySelector('.report-item-title').textContent =
      `장면 ${item.sceneTitle} — ${item.isCorrect ? '잘 대응' : '복기 필요'}`;

    const text = item.isCorrect
      ? item.feedback
      : `선택한 행동: "${item.choiceText}"\n${item.feedback}`;
    li.querySelector('.report-item-text').textContent = text;

    if (!item.isCorrect) {
      const sourceEl = document.createElement('span');
      sourceEl.className = 'report-item-source';
      sourceEl.textContent = `참고 학습: ${item.learning} (${item.source})`;
      li.querySelector('.report-item-body').appendChild(sourceEl);
    }
    listEl.appendChild(li);
  });
}

// ============== 공유 카드 모달 ==============

export function openShareModal({ ending, total, metrics }) {
  const modalEl = document.getElementById('share-modal');
  const cardEl = document.getElementById('share-card');
  const text = buildShareCardText({ ending, total, metrics });
  cardEl.textContent = text;
  modalEl.hidden = false;

  const closeHandlers = modalEl.querySelectorAll('[data-close-modal]');
  closeHandlers.forEach((el) => {
    el.addEventListener('click', () => { modalEl.hidden = true; }, { once: true });
  });

  const copyBtn = document.getElementById('btn-copy');
  const newCopyBtn = copyBtn.cloneNode(true);
  copyBtn.parentNode.replaceChild(newCopyBtn, copyBtn);
  newCopyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text);
      newCopyBtn.textContent = '복사 완료!';
      setTimeout(() => { newCopyBtn.textContent = '텍스트 복사'; }, 1500);
    } catch {
      newCopyBtn.textContent = '복사 실패';
    }
  });
}

// SCENES 길이는 main에서도 쓰므로 한 번 export
export const TOTAL_SCENES = SCENES.length;
