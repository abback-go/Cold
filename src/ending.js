// 엔딩 분기 + 결과 리포트.
// cold.md §5: 합산 ≥320 마스터 / 200~319 통과 / <200 위기.

import { SCENES, METRIC_META, METRIC_KEYS, SOURCE_NOTE } from './scenes.js';

const ENDINGS = {
  master: {
    key: 'master',
    title: '생존 마스터',
    image: 'assets/endings/ending_master.svg',
    summary:
      '가족 모두 안전하게 한파를 넘겼다. 침착하고 정확한 판단의 연속이었다. ' +
      '이 정도면 친구들에게 한파 대비를 알려줄 만하다.',
  },
  pass: {
    key: 'pass',
    title: '무사 통과',
    image: 'assets/endings/ending_pass.svg',
    summary:
      '큰 위기 없이 한파를 넘겼지만, 몇 번의 시행착오가 있었다. ' +
      '아래 복기에서 어느 부분이 더 좋았을지 확인해 보자.',
  },
  crisis: {
    key: 'crisis',
    title: '위기 상황',
    image: 'assets/endings/ending_crisis.svg',
    summary:
      '한파 동안 가족이 적지 않은 위험에 노출됐다. ' +
      '아래 복기를 통해 어떤 선택이 위험했는지 함께 살펴보자. 한파는 다시 온다.',
  },
};

export function determineEnding(metrics) {
  const total = METRIC_KEYS.reduce((sum, key) => sum + metrics[key], 0);
  let endingKey;
  if (total >= 320)      endingKey = 'master';
  else if (total >= 200) endingKey = 'pass';
  else                   endingKey = 'crisis';
  return { ending: ENDINGS[endingKey], total };
}

// 플레이 이력(history)에서 잘못 고른 항목을 추려 복기 항목으로 변환
export function buildReport(history) {
  return history.map((entry) => {
    const scene = SCENES.find((s) => s.id === entry.sceneId);
    const choice = scene.choices[entry.choiceIndex];
    return {
      sceneTitle: scene.title,
      isCorrect: choice.isCorrect,
      choiceText: choice.text,
      feedback: choice.feedback,
      learning: scene.learning,
      source: SOURCE_NOTE,
    };
  });
}

// 공유 카드 텍스트 생성 — 한파 대비 체크리스트 형태
export function buildShareCardText({ ending, total, metrics }) {
  const meterLines = METRIC_KEYS
    .map((k) => `· ${METRIC_META[k].label}: ${metrics[k]}`)
    .join('\n');

  const checklist = [
    '재난문자가 오면 곧장 안전 점검부터',
    '실내 적정 온도 20~22℃, 환기·보온 동시 관리',
    '정전 대비: 손전등·휴대폰 완충·따뜻한 음식',
    '정전 시 촛불 금지, 한국전력 123에 신고',
    '동상은 미지근한 물(38~40℃)로 천천히, 마찰 금지',
    '얼어버린 수도관은 드라이어·미지근한 물수건으로 해동',
  ];

  return [
    `[콜드 서바이벌: 한파 72시간]`,
    `엔딩 — ${ending.title} (총 ${total} / 400점)`,
    ``,
    `▣ 최종 지표`,
    meterLines,
    ``,
    `▣ 한파 대비 체크리스트`,
    ...checklist.map((line, i) => `${i + 1}. ${line}`),
    ``,
    `출처: 행정안전부 국민재난안전포털 한파 행동요령`,
  ].join('\n');
}
