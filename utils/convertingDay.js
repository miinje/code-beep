export function convertingNumberDay(day) {
  const dayToNumberMap = {
    월: 1,
    화: 2,
    수: 3,
    목: 4,
    금: 5,
    토: 6,
    일: 0,
  };

  return dayToNumberMap[day];
}

export function convertingStringDay(day) {
  const numberToDayMap = {
    1: "월",
    2: "화",
    3: "수",
    4: "목",
    5: "금",
    6: "토",
    0: "일",
  };

  return numberToDayMap[day];
}

export function convertingDay(day) {
  const dayToNumberMap = {
    월: 1,
    화: 2,
    수: 3,
    목: 4,
    금: 5,
    토: 6,
    일: 0,
  };

  const numberToDayMap = Object.fromEntries(
    Object.entries(dayMap).map(([key, value]) => [value, key])
  );

  return dayToNumberMap[day] ?? numberToDayMap[day];
}
