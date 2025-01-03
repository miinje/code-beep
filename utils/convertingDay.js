export function convertingNumberDay(day) {
  let dayValue = "";

  switch (day) {
    case "월":
      dayValue = 1;
      break;
    case "화":
      dayValue = 2;
      break;
    case "수":
      dayValue = 3;
      break;
    case "목":
      dayValue = 4;
      break;
    case "금":
      dayValue = 5;
      break;
    case "토":
      dayValue = 6;
      break;
    case "일":
      dayValue = 0;
      break;
    default:
      dayValue = day;
      break;
  }

  return dayValue;
}

export function convertingStringDay(day) {
  let dayValue = "";

  switch (day) {
    case 1:
      dayValue = "월";
      break;
    case 2:
      dayValue = "화";
      break;
    case 3:
      dayValue = "수";
      break;
    case 4:
      dayValue = "목";
      break;
    case 5:
      dayValue = "금";
      break;
    case 6:
      dayValue = "토";
      break;
    case 0:
      dayValue = "일";
      break;
    default:
      dayValue = day;
      break;
  }

  return dayValue;
}
