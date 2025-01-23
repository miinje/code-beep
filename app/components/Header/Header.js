import { useRouter } from "expo-router";
import { Alert, TouchableOpacity, View } from "react-native";
import alarmStore from "../../../store/alarmStore";
import CustomText from "../CustomText/CustomText";
import styles from "./styles";

export default function Header({ deletedAlarms, setDeletedAlarms }) {
  const { isActivateEdit, setIsActivateEdit, setIsDeleteAlarm } = alarmStore();
  const router = useRouter();

  const handleClickEditButton = () => {
    if (!isActivateEdit) {
      setIsActivateEdit(true);
    } else {
      if (deletedAlarms.length === 0) {
        setIsActivateEdit(false);
      } else {
        Alert.alert(
          "알람을 삭제하시겠습니까?",
          "이 과정은 되돌릴 수 없습니다",
          [
            {
              text: "취소",
              onPress: () => {
                setIsActivateEdit(false);
                setDeletedAlarms([]);
              },
              style: "cancel",
            },
            {
              text: "삭제",
              onPress: async () => {
                setIsDeleteAlarm(true);
                setIsActivateEdit(false);
              },
            },
          ]
        );
      }
    }
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleClickEditButton}
        >
          <CustomText size={25} text={!isActivateEdit ? "편집" : "삭제"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/AddAlarm")}
        >
          <CustomText size={40} text="+" />
        </TouchableOpacity>
      </View>
    </>
  );
}
