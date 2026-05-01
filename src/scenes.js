// 시나리오 데이터 — cold.md §4 의 6개 장면을 그대로 따른다.
// 모든 effects 객체는 4개 키(temp, sibling, info, house)를 포함하며,
// 변동이 없는 항목도 0으로 명시한다.

export const SCENES = [
  {
    id: 1,
    title: '하교길',
    time: '오후 3시, 금요일',
    image: 'assets/scenes/scene_01_school.svg',
    narrative:
      '학교를 나서니 휴대폰에 재난문자가 울린다.\n' +
      '"내일 오전부터 한파특보, 최저 영하 17도 예상."\n\n' +
      '친구가 PC방에 같이 가자고 한다.',
    learning: '재난문자 인지 시 우선순위 판단, 사전 대비 물품 구비',
    choices: [
      {
        text: 'PC방에 잠깐 들렀다 간다',
        effects: { temp: 0, sibling: -5, info: -10, house: 0 },
        feedback:
          '재난문자가 왔다면 곧장 안전을 점검해야 한다. 동생이 혼자 있는 시간이 길어졌고, 정보 갱신도 늦었다.',
        isCorrect: false,
        next: 2,
      },
      {
        text: '곧장 집에 가서 동생을 챙긴다',
        effects: { temp: 0, sibling: 10, info: 0, house: 0 },
        feedback:
          '동생을 빨리 챙긴 건 좋은 판단이다. 다만 비상 물품 점검까지 같이 했다면 더 든든했을 것이다.',
        isCorrect: false,
        next: 2,
      },
      {
        text: '마트에 들러 비상식량과 핫팩을 산다',
        effects: { temp: 0, sibling: 0, info: 5, house: 0 },
        feedback:
          '한파 예보를 확인한 즉시 비상 물품을 챙긴 모범 대응. 핫팩과 즉석식품은 정전 시 큰 도움이 된다.',
        isCorrect: true,
        next: 2,
      },
    ],
  },

  {
    id: 2,
    title: '집 도착',
    time: '오후 4시 30분',
    image: 'assets/scenes/scene_02_home.svg',
    narrative:
      '집에 오니 동생이 추워하며 거실에서 게임 중이다.\n' +
      '보일러가 꺼져 있고, 베란다 창문이 살짝 열려 있다.',
    learning: '적정 실내온도(20~22℃), 환기와 보온의 균형',
    choices: [
      {
        text: '보일러를 최고 온도로 켜고 창문 닫기',
        effects: { temp: 10, sibling: 0, info: 0, house: -5 },
        feedback:
          '몸은 빨리 따뜻해지지만 보일러 과부하로 집 상태가 나빠진다. 한파 시에는 적정 온도로 꾸준히 켜는 것이 더 효율적이다.',
        isCorrect: false,
        next: 3,
      },
      {
        text: '보일러를 적정 온도(20~22도)로 켜고 창문을 닫는다',
        effects: { temp: 10, sibling: 0, info: 0, house: 5 },
        feedback:
          '권장 실내온도(20~22℃)와 환기 차단을 동시에 해결한 모범 답안. 보일러 과부하도 막을 수 있다.',
        isCorrect: true,
        next: 3,
      },
      {
        text: '전기장판만 켜고 보일러는 끈다',
        effects: { temp: 5, sibling: 0, info: 0, house: -5 },
        feedback:
          '난방비를 아끼는 듯하지만 실내 전체 온도가 낮아 수도관 동파 위험이 커진다. 한파에는 보일러도 함께 켜야 한다.',
        isCorrect: false,
        next: 3,
      },
    ],
  },

  {
    id: 3,
    title: '저녁',
    time: '오후 8시 · 기온 영하 12도',
    image: 'assets/scenes/scene_03_evening.svg',
    narrative:
      '엄마에게서 전화가 왔다.\n' +
      '"눈이 너무 와서 오늘 늦을 것 같아. 동생 저녁 좀 챙겨줘."\n\n' +
      '그때 갑자기 거실 불이 깜빡인다.',
    learning: '정전 대비, 보호자 역할, 충전·비상용품 점검',
    choices: [
      {
        text: '라면을 끓여 먹고 TV를 본다',
        effects: { temp: 0, sibling: 0, info: -5, house: 0 },
        feedback:
          '평소라면 괜찮지만, 불이 깜빡인 건 정전 신호일 수 있다. 비상 대비를 못 한 채 시간이 흘러갔다.',
        isCorrect: false,
        next: 4,
      },
      {
        text: '따뜻한 국과 밥을 챙기고 손전등·휴대폰 충전을 확인한다',
        effects: { temp: 0, sibling: 10, info: 10, house: 0 },
        feedback:
          '정전 전조를 정확히 읽어낸 모범 대응. 따뜻한 음식·손전등·완충 휴대폰 세 가지는 한파 정전의 필수 키트다.',
        isCorrect: true,
        next: 4,
      },
      {
        text: '동생과 함께 이불 속에 들어가 잔다',
        effects: { temp: 5, sibling: 0, info: 0, house: 0 },
        feedback:
          '잠시 따뜻하지만, 정전이 오면 식사도 연락도 못 한 채 깨어나야 한다. 미리 점검할 시간을 놓쳤다.',
        isCorrect: false,
        next: 4,
      },
    ],
  },

  {
    id: 4,
    title: '한밤중 정전',
    time: '밤 11시 · 기온 영하 17도',
    image: 'assets/scenes/scene_04_blackout.svg',
    narrative:
      '갑자기 집 안 모든 전등이 꺼졌다. 보일러도 멈췄다.\n' +
      '동생이 무서워하며 운다. 창밖으로 옆집들도 어둡다.',
    learning: '정전 신고처(한국전력 123), 화기 사용 금지, 침착한 대응',
    choices: [
      {
        text: '촛불을 켜서 분위기를 밝힌다',
        effects: { temp: 0, sibling: -10, info: 0, house: -20 },
        feedback:
          '정전 시 촛불은 화재 위험이 가장 큰 행동이다. 어두워도 손전등이나 휴대폰 라이트를 사용해야 한다.',
        isCorrect: false,
        next: 5,
      },
      {
        text: '손전등을 켜고 동생을 안심시킨 뒤 한국전력(123)에 신고, 가족·이웃에 연락',
        effects: { temp: 0, sibling: 10, info: 15, house: 0 },
        feedback:
          '정확한 신고처(한국전력 123)와 침착한 대응을 모두 해낸 모범 답안. 정전 범위 확인은 단지 차원 정전인지 우리집 차단기 문제인지 가른다.',
        isCorrect: true,
        next: 5,
      },
      {
        text: '일단 두꺼운 옷을 입고 기다린다',
        effects: { temp: -5, sibling: 0, info: 0, house: 0 },
        feedback:
          '추위는 막을 수 있지만 신고가 늦으면 복구도 늦어진다. 정전은 발견 즉시 한전 123에 알려야 한다.',
        isCorrect: false,
        next: 5,
      },
    ],
  },

  {
    id: 5,
    title: '새벽 위기',
    time: '새벽 3시',
    image: 'assets/scenes/scene_05_dawn.svg',
    narrative:
      '정전이 길어지며 실내온도가 급격히 떨어진다.\n' +
      '동생이 "형(누나), 손가락이 안 움직여"라고 말한다.\n' +
      '얼굴이 창백하고 떨고 있다.',
    learning: '동상 응급처치 원칙(급격한 온도변화·마찰 금지), 119 판단 기준',
    choices: [
      {
        text: '뜨거운 물로 손을 씻긴다',
        effects: { temp: 0, sibling: -20, info: 0, house: 0 },
        feedback:
          '동상 부위에 뜨거운 물은 절대 금지다. 급격한 온도 변화는 조직 손상을 키운다.',
        isCorrect: false,
        next: 6,
      },
      {
        text: '미지근한 물에 담그거나 체온으로 천천히 녹이고, 담요로 감싼 뒤 119 신고',
        effects: { temp: 0, sibling: 20, info: 0, house: 0 },
        feedback:
          '동상 응급처치의 정석이다. 미지근한 물(38~40℃) 또는 체온으로 천천히 녹이고, 자가 판단이 어렵다면 즉시 119에 신고한다.',
        isCorrect: true,
        next: 6,
      },
      {
        text: '손가락을 세게 주물러 혈액순환을 돕는다',
        effects: { temp: 0, sibling: -15, info: 0, house: 0 },
        feedback:
          '동상 부위 마찰은 피부와 조직을 더 손상시킨다. 비비거나 주무르지 말고 미지근한 온도로 천천히 녹여야 한다.',
        isCorrect: false,
        next: 6,
      },
    ],
  },

  {
    id: 6,
    title: '다음 날 아침',
    time: '오전 8시',
    image: 'assets/scenes/scene_06_morning.svg',
    narrative:
      '전기가 돌아왔다. 부엌 수도꼭지를 트니 물이 안 나온다.\n' +
      '수도관이 얼었다. 엄마는 아직 못 돌아오셨고,\n' +
      '학교에서 휴교 안내가 왔다.',
    learning: '동파 해동 요령, 관리주체 신고',
    choices: [
      {
        text: '뜨거운 물을 수도관에 직접 붓는다',
        effects: { temp: 0, sibling: 0, info: 0, house: -25 },
        feedback:
          '얼어붙은 수도관에 뜨거운 물을 부으면 온도 차이로 관이 파열될 수 있다. 가장 비싼 실수다.',
        isCorrect: false,
        next: null,
      },
      {
        text: '헤어드라이어나 미지근한 물수건으로 천천히 녹이고, 안 되면 관리실에 연락',
        effects: { temp: 0, sibling: 0, info: 0, house: 15 },
        feedback:
          '동파 해동의 정석이다. 미지근한 물수건이나 드라이어 약풍으로 노출된 관 부분부터 녹이고, 자력으로 어려우면 관리실·전문가의 도움을 받는다.',
        isCorrect: true,
        next: null,
      },
      {
        text: '그냥 물을 사 먹고 기다린다',
        effects: { temp: 0, sibling: 0, info: -5, house: 0 },
        feedback:
          '당장은 편하지만 동파 상태가 길어지면 관 자체가 파열될 위험이 커진다. 적극적인 해동이 필요하다.',
        isCorrect: false,
        next: null,
      },
    ],
  },
];

// 학습 출처 — 잘못된 선택 복기 시 표시
export const SOURCE_NOTE = '행정안전부 국민재난안전포털 한파 행동요령 기준';

// 초기 지표값
export const INITIAL_METRICS = {
  temp: 100,
  sibling: 100,
  info: 100,
  house: 100,
};

// 지표 메타데이터 (UI 라벨용)
export const METRIC_META = {
  temp:    { label: '체온',       icon: 'assets/icons/icon_temp.svg' },
  sibling: { label: '동생 안전도', icon: 'assets/icons/icon_sibling.svg' },
  info:    { label: '정보력',     icon: 'assets/icons/icon_info.svg' },
  house:   { label: '집 상태',    icon: 'assets/icons/icon_house.svg' },
};

export const METRIC_KEYS = ['temp', 'sibling', 'info', 'house'];
