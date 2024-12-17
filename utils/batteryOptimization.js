import { Alert, Linking } from "react-native";

export const requestIgnoreBatteryOptimizations = async () => {
  try {
    Alert.alert(
      "알람을 정상적으로 받기 위해서는 배터리 최적화에 관련한 권한이 필요합니다.",
      "배터리 ➡️ 제한 없음을 선택해 주세요.",
      [
        {
          text: "취소",
          onPress: () => console.log("취소됨"),
          style: "cancel",
        },
        {
          text: "확인",
          onPress: async () => {
            try {
              await Linking.openSettings();
            } catch (err) {
              console.error("설정 열기 실패:", err);
            }
          },
        },
      ]
    );
  } catch (error) {
    console.error(error.message);
  }
};
