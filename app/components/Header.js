import { useRouter } from "expo-router";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../../components/CustomText";
import alarmStore from "../../store/alarmStore";

export default function Header({ setDeletedAlarms }) {
  const { isActivateEdit, setIsActivateEdit, setIsDeleteAlarm } = alarmStore();
  const router = useRouter();

  const handleClickEditButton = () => {
    if (!isActivateEdit) {
      setIsActivateEdit(true);
    } else {
      Alert.alert("알람을 삭제하시겠습니까?", "이 과정은 되돌릴 수 없습니다", [
        {
          text: "취소",
          onPress: () => {
            setIsActivateEdit(false);
            setDeletedAlarms([]);
          },
          style: "cancel",
        },
        {
          text: "확인",
          onPress: async () => {
            setIsDeleteAlarm(true);
            setIsActivateEdit(false);
          },
        },
      ]);
    }
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleClickEditButton}
        >
          <CustomText size={20} text={!isActivateEdit ? "편집" : "삭제"} />
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

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "top",
    pointerEvents: "auto",
  },
  editButton: {
    width: 40,
    height: 40,
  },
  addButton: {
    width: 40,
    height: 40,
    textAlign: "auto",
    marginTop: -15,
  },
});
