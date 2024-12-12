export function convertingDay(day) {
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
