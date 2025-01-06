# CODE BEEP

사용자가 알람 받길 원하는 시간을 지정하고, 지정된 시간에 알람이 울립니다. 사용자가 작성했던 코드들로 다양한 문제를 제공하여 잠을 깨워 줍니다.

## 목차

- [프로젝트 동기](#프로젝트-동기)
- [개발 환경](#개발-환경)
- [UI 미리보기](#ui-미리보기)
- [문제 해결하기](#문제-해결하기)
  - [1.사용자의 리포지토리에서 특정 조건에 따라 코드 가져오기](#1-사용자의-리포지토리에서-특정-조건에-따라-코드-가져오기)
  - [2.다양한 언어의 코드 분석하기](#2-다양한-언어의-코드-분석하기)
- [개선할 사항](#개선할-사항)
  - [1. 알람 시간을 어떻게 감지할 수 있을까](#1-알람-시간을-어떻게-감지할-수-있을까)
    - [1-1. Foreground Service를 이용해 알람 시간 확인하기](#1-1-foreground-service를-이용해-알람-시간-확인하기)
    - [1-2. Alarm Manager를 이용해 알람 예약하기](#1-2-alarm-manager를-이용해-알람-예약하기)
- [개인 회고](#개인-회고)

## 프로젝트 동기

저는 알람이 울리면 알람을 끄고 다시 잠드는 습관이 있습니다. 이러한 습관이 하루를 효율적으로 시작하는 데 방해가 됩니다. 이를 해결하기 위해 일어날 때까지 알람이 울리는 기능이 있었으면 좋겠다고 생각했습니다.

또한, 아침에 일어나서 전날 작성했던 코드들을 간단히 리마인드할 수 있다면 하루를 더 효율적으로 시작할 수 있을 것 같다는 아이디어가 떠올랐습니다. 이렇게 하면 바로 개발 흐름을 이어갈 수 있어 시간을 절약하고 집중력을 높일 수 있을 것 같았습니다.

이런 생각들을 바탕으로, 아침을 깨우고 동시에 내가 작성한 코드도 확인할 수 있는 알람 앱을 만들어보자는 동기를 가지게 되었습니다.

## 개발 환경

![React Native](https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![React](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37) ![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)

## UI 미리보기

![code beep ui preview](https://github.com/user-attachments/assets/44ecdc0d-cae2-4169-bf66-28dc8f8e519c)

<div style="color:gray">1.로그인 화면 / 2-3.알람 리스트 화면 / 4-5.알람 등록 화면</div>

## 문제 해결하기

### 1. 사용자의 리포지토리에서 특정 조건에 따라 코드 가져오기

### 2. 다양한 언어의 코드 분석하기

## 개선할 사항

### 1. 알람 시간을 어떻게 감지할 수 있을까

제 앱에 주목적은 사용자 원하는 시간에 알람을 울려 주는 것입니다. 사용자가 등록한 시간에 이벤트를 실행하기 위해서는 앱의 상태와 상관없이 디바이스가 등록된 시간을 인지하고 있어야 합니다.

#### 1-1. Foreground Service를 이용해 알람 시간 확인하기

가장 처음 시도한 방법은 안드로이드 API인 [Foreground Service API](https://developer.android.com/develop/background-work/services/fgs?hl=ko)를 이용하는 것입니다. 앱이 꺼져 있더라도 백그라운드에서 시간을 계속 검사해야 한다고 생각했습니다. Foreground Service API는 앱이 백그라운드에 가거나, 종료되었을 때의 작업을 설정할 수 있습니다.

리액트 네이티브에서는 Foreground Service를 활용할 수 있도록 여러 라이브러리를 제공합니다. `react-native-background-actions`과 `react-native-background-fetch` 중 `react-native-background-actions`을 사용하게 되었습니다. `react-native-background-fetch`는 15분 단위로 백그라운드 요청을 보내는 제한이 있지만, `react-native-background-actions`은 이러한 시간제한 없이 작업을 실행할 수 있었기 때문입니다.

Foreground Service를 활용해 사용자가 알람 시간을 등록하면 해당 데이터를 데이터베이스에 저장하고, 저장된 데이터를 앱의 상태에 유지하며 현재 시각과 등록된 알람 시간을 지속적으로 비교하도록 설계했습니다. 이렇게 지정된 작업은 사용자가 첫 알람을 등록했을 때 실행되며, 앱이 꺼진 상태에서도 작업을 진행합니다.

<details>
<summary style="color: gray;">백그라운드에서 실행할 작업 설정하기</summary>

```js
const startBackgroundTask = async (allAlarmData) => {
	if (allAlarmData !== null) {
		const options = {
		// ...
		},
		color: "#404040",
		linkURL: "codebeep://ActionAlarm",
		parameters: { allAlarmData: allAlarmData, delay: 1000 },
		startForeground: true,
		allowExecutionInForeground: true,
	};

	try {
		await BackgroundService.start(checkTimeInBackground, options); // checkTimeInBackground: 백그라운드에서 실행할 함수
	} catch (error) {
		console.error(error.message);
	}
}
```

BackgroundService.start는 백그라운드 작업을 시작할 수 있도록 합니다.

</details>

<br />
그러나 이 접근 방식에서 문제가 발생했습니다. 앱이 켜진 채로 5분 이상이 지난다면 "앱 응답하지 않음"이라는 경고창이 뜨며, 버튼 등의 UI 상호작용이 되지 않는다는 것입니다.

<br />

<table style="border: 1px solid gray">
	<tr>
		<th>
		<img width="350" alt="오류 화면" src="https://github.com/user-attachments/assets/1cd6723a-9306-4f8d-ac60-47b7f18c31f0" />
		</th>
	</tr>
	<tr>
		<td>ANR 오류 화면</td>
	<tr>
</table>

<br />

로그캣을 확인한 결과, ANR 오류가 발생했음을 확인했으며, 이는 Foreground Service 작업이 제한 시간 내에 종료되지 않았기 때문입니다.

```bash
ANR in com.miinje.codeBeep
PID: 5472
Reason: A foreground service of FOREGROUND_SERVICE_TYPE_SHORT_SERVICE did not stop within a timeout: ComponentInfo{com.miinje.codeBeep/com.asterinet.react.bgactions.RNBackgroundActionsTask}
```

ANR(Application Not Responding) 오류는 일정 시간 동안 UI 스레드가 차단될 경우 발생하는 오류로, 일반적으로 5초 이상 UI 스레드가 응답하지 않으면 발생합니다.

`react-native-background-actions` 라이브러리로 작성된 코드는 실행된 위치와 관계없이 백그라운드 스레드에서 작업을 수행합니다. 현재 백그라운드에서는 사용자가 현재 시각을 지속적으로 확인합니다. 만약 등록된 시간과 현재 시각이 일치한다면 특정 동작을 수행하도록 합니다.

```javascript
while (true) {
  const currentTime = new Date();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentDays = currentTime.getDay();

  // ...

  if (
    convertedDays.includes(currentDays) &&
    convertedSelectedTime.getHours() === currentHours &&
    convertedSelectedTime.getMinutes() === currentMinutes
  ) {
    playAudio();
    sendLocalNotification();
  }
}
```

해당 작업을 종료시키지 않았기 때문에 과도하게 실행되어 메인(UI) 스레드까지 영향을 미치면서 ANR 오류가 발생했습니다.

하지만 현재 접근 방식에서는 알람 기능 특성상 지속적으로 시간을 확인해야 하므로 Foreground Service의 제한 시간 문제를 해결할 수 없었습니다. 이외에도 디바이스가 Doze(절전) 모드에 진입하는 경우 OS가 앱의 백그라운드 작업을 종료하기 때문에 이 경우에 대응하기 어렵습니다. 또한 지속적인 백그라운드 작업으로 인해 배터리 소모량이 매우 높아진다는 문제점도 있습니다.

이러한 문제점을 해결하기 위해 다른 방식을 사용해야 된다고 생각했습니다.

#### 1-2. Alarm Manager를 이용해 알람 예약하기

이를 해결하기 위해 [Alarm Manager API](https://developer.android.com/develop/background-work/services/alarms/schedule?hl=ko)를 사용하여 사용자가 등록한 알람 시간에 이벤트를 예약하는 방식이 적합하다고 판단했습니다. Alarm Manager는 시스템 알람 서비스에 대한 접근 권한을 제공하여 특정 시간에 애플리케이션을 실행하도록 예약할 수 있습니다.

이벤트를 예약하는 방식이기 때문에 백그라운드에서 시간을 계속 확인하지 않아도 됩니다. 이를 통해 백그라운드 스레드가 메인 스레드에 영향을 주지 않아 ANR 에러를 방지할 수 있습니다. Alarm Manager에서는 Doze 모드를 피할 수 있습니다. 또한 `setAlarmClock()` 및 `setExactAndAllowWhileIdle()` 메서드를 사용할 때 Doze 모드에서도 예외적으로 작업을 수행할 수 있도록 시스템에서 허용합니다.

이를 통해 현재 발생하고 있는 문제를 해결할 수 있을 것이라 생각합니다.

## 개인 회고
