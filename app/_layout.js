import { Slot } from "expo-router";
import * as SystemUI from "expo-system-ui";
import React, { useEffect } from "react";
import alarmStore from "../store/alarmStore";
import { playAudio } from "../utils/audioPlayer";

SystemUI.setBackgroundColorAsync("#404040");

export default function Layout() {
  const { isTimeMatched } = alarmStore();

  useEffect(() => {
    const playSound = async () => {
      await playAudio();
    };

    if (isTimeMatched) {
      playSound();
    }
  }, [isTimeMatched]);

  return <Slot />;
}
