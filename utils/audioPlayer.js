import { Audio } from "expo-av";

let soundObject;

export async function playAudio() {
  try {
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    if (!soundObject) {
      soundObject = new Audio.Sound();
      await soundObject.loadAsync(require("../assets/K.K.House.mp3"));
      await soundObject.playAsync();
    } else {
      await soundObject.playAsync();
    }
  } catch (error) {
    console.error("오디오 재생 오류:", error);
  }
}

export async function pauseAudio() {
  try {
    if (soundObject) {
      await soundObject.pauseAsync();
    }
  } catch (error) {
    console.error("오디오 중단 오류:", error);
  }
}

export async function stopAudio() {
  try {
    if (soundObject) {
      await soundObject.stopAsync();
    }
  } catch (error) {
    console.error("오디오 종료 오류:", error);
  }
}
