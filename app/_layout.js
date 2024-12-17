import { Slot } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import alarmStore from "../store/alarmStore";
import { playAudio } from "../utils/audioPlayer";
import * as SystemUI from "expo-system-ui";

SystemUI.setBackgroundColorAsync("#404040");

export default function Layout() {
  const appState = useRef(AppState.currentState);
  const { isTimeMatched } = alarmStore();
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const playSound = async () => {
      await playAudio();
    };

    if (isTimeMatched) {
      playSound();
    }
  }, [isTimeMatched]);

  useEffect(() => {
    AppState.addEventListener("change", (nextAppState) => {
      appState.current = nextAppState;

      setAppStateVisible(appState.current);
    });
  }, []);

  return <Slot />;
}
