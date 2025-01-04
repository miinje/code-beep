export default function onScroll(event, time, setFunction) {
  const offsetY = event.nativeEvent.contentOffset.y;
  const ITEM_HEIGHT = 40;
  const index = Math.round(offsetY / ITEM_HEIGHT);

  setFunction(time[index % time.length]);
}
