# CODE BEEP

사용자가 알람 받길 원하는 시간을 지정하고, 지정된 시간에 알람이 울립니다. 사용자가 작성했던 코드들로 다양한 문제를 제공하여 잠을 깨워 줍니다.

# 목차

- [기획 동기](#기획-동기)
- [개발 환경](#개발-환경)
- [UI 미리보기](#ui-미리보기)
- [구현 기능](#구현-기능)
	- [1. 코드 분석을 통한 퀴즈 만들기](#1-코드-분석을-통한-퀴즈-만들기)
  	- [[1] 사용자의 리포지토리에서 파일 가져오기](#1-사용자의-리포지토리에서-파일-가져오기)
   		- [(1) 사용자의 리포지토리에서 파일 가져오기](#1-사용자의-리포지토리에서-파일-가져오기)
   		- [(2) REST API 사용량 제한 피하기](#2-REST-API-사용량-제한-피하기)
			- [(3) 파일 필터링 하기](#3-파일-필터링-하기)
		- [[2] 사용자 코드 분석하기](#2-사용자-코드-분석하기)
			- [(1) 파일에서 함수 분리하기](#1-파일에서-함수-분리하기)
			- [(2) 함수의 반환 값 추출하기](#2-함수의-반환-값-추출하기)
	- [2. 백그라운드에서 알람 시간 확인하기](#2-백그라운드에서-알람-시간-확인하기)
- [개선할 사항](#개선할-사항)
  - [1. 알람 시간을 어떻게 감지할 수 있을까](#1-알람-시간을-어떻게-감지할-수-있을까)
    - [1-1. Foreground Service를 이용해 알람 시간 확인하기](#1-1-foreground-service를-이용해-알람-시간-확인하기)
    - [1-2. Alarm Manager를 이용해 알람 예약하기](#1-2-alarm-manager를-이용해-알람-예약하기)

# 기획 동기

개발자들은 매일 코드를 작성하거나 수정하지만, 이전 작업을 돌아볼 기회는 많지 않습니다. 아침에 알람을 끌 때 전날 작성한 코드를 떠올리며 하루를 시작하면 작업의 흐름을 이어가는 데 도움이 될 것이라는 생각에서 이 프로젝트가 시작되었습니다. 
사용자의 깃허브에서 최신 작업을 가져와 빈칸 퀴즈 형태로 제공해, 알람 해제 과정에서 자연스럽게 코드를 복습할 수 있도록 기획했습니다. 


# 개발 환경

![React Native](https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![React](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37) ![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)

# UI 미리보기

![code beep ui preview](https://github.com/user-attachments/assets/44ecdc0d-cae2-4169-bf66-28dc8f8e519c)

# 구현 기능

## 1. 코드 분석을 통한 퀴즈 만들기
지정된 시간에 알람이 실행되면 사용자의 최근 작업을 바탕으로 출제된 퀴즈를 제공합니다. 사용자는 이 퀴즈를 통해 알람을 종료시킬 수 있습니다. 

이떄 퀴즈는 사용자의 깃허브에서 가장 최근 업데이트 된 리포지토리의 내부 코드를 활용해 만듭니다. 그러기 위해서 Github REST API를 활용해 사용자의 리포지토리에서 파일을 가져오고 코드를 분석해 조건에 맞는 퀴즈를 생성해야 합니다.

### [1] 사용자의 리포지토리에서 파일 가져오기
사용자의 리포지토리 안에 있는 파일을 가져오기 위해서는 아래와 같은 단계를 거쳐야 합니다.

#### (1) 사용자 토큰을 이용해 최근 리포지토리 파일 탐색하기

사용자가 깃허브 인증을 통해 로그인을 하게 되면, 이때 사용자의 토큰을 받아옵니다. 이 토큰을 이용해 사용자의 깃허브에서 리포지토리 등의 정보를 요청하게 됩니다.

그 다음, 토큰을 이용해 리포지토리를 가져옵니다. 이때 사용자의 깃허브에서 가장 최근 업데이트 된 리포지토리를 가져오도록 요청합니다. 이때 가져온 리포지토리의 정보 중 이름 값만 저장합니다.

<details>
<summary>가장 최근 리포지토리를 가져오도록 엔드포인트 지정하기</summary>

```js
const url = `https://api.github.com/users/${userName}/repos?sort=updated&direction=desc&per_page=1`;
```
- `sort=updated`: 리포지토리를 업데이트 된 시간 기준으로 정렬합니다.
- `direction=desc`: 내림차순으로 정렬하여 최신 리포지토리가 첫 번째로 오게 합니다.
- `per_page=1`: 가장 최신 리포지토리 한 개만 가지고 옵니다.

</details>

파일의 경우 한 파일 당 한 번의 요청을 보내야 합니다. 만약 리포지토리 내부 파일의 타입이 디렉토리일 경우 함수를 재귀적으로 호출하여 다시 탐색하도록 합니다. 이 과정을 반복하여 모든 디렉토리 내부의 파일을 가져와 저장합니다.

#### (2) REST API 사용량 제한 피하기

##### 깊은 리포지토리 탐색 시 요청량 초과 피하기

만약 리포지토리 내부에 탐색해야 하는 파일이 너무 많다면 Github API 요청 제한이 걸립니다. `REST API`의 경우 리포지토리의 모든 디렉토리를 탐색합니다.
만약 리포지토리에 `node_modules`와 같이 폴더에 내부 폴더가 많은 파일까지 탐색하게 된다면 API 요청 수가 급격히 증가하여 `403 Forbidden` 응답과 함께 `“API rate limit exceeded”` 메시지를 받게 됩니다.

이런 현상을 방지하기 위해 파일의 깊이를 제한하여 탐색하도록 했습니다. [리액트의 레거시 공식 문서](https://legacy.reactjs.org/docs/faq-structure.html#avoid-too-much-nesting)에서는 보통 3-4단계의 깊이를 유지하도록 권장하고 있습니다. 때문에 API가 탐색하는 최대 깊이는 4단계로 지정했습니다.

##### 이미 방문했던 경로의 재방문 막기

또한 이미 방문했던 경로이고, 가져온 이후에 마지막 커밋이 변경되지 않았다면 재탐색을 방지하는 로직을 설정하여 요쳥량 제한을 피하려고 노력했습니다.

#### (3) 파일 필터링 하기
이렇게 받아온 파일은 필터링을 해 필요한 파일만 데이터에 저장하게 됩니다. 이떄 필요한 파일이란 사용자가 작성한 코드가 있는 파일을 말합니다. 사용자가 작성한 코드를 직접적으로 알 수 없기 때문에 기준을 세워 최대한 가능성을 높이기 위해 노력했습니다. 그 기준은 아래와 같습니다.

1. `README.md`, `package.json`, `config.js` 등 설정 파일은 제외합니다.
2. `node_modules/`, `.github/`, `dist/` 등 불필요한 경로는 제외합니다.
3. 확장자가 `.js`, `.ts`, `.py` 등 프로그래밍 언어 확장자만 가지고 옵니다.

Github REST API에서는 이 파일에 대해 미리 필터링을 해 주지 않습니다.  모든 파일을 가져온 후, 설정 파일 및 불필요한 경로를 걸러내고 `.js`의 확장자를 활용해 실제 코드 파일만 남깁니다.

최종적으로 코드 파일 중에도 실제 코드 로직이 작성된 파일을 식별하기 위해 `function`, `class` 등의 코드 패턴을 포함한 파일을 데이터 베이스에 저장합니다.

### [2] 사용자의 코드 분석하기

사용자의 코드를 사용해 퀴즈를 낼 때 고려했던 것은 사용자가 답을 예측할 수 있는 퀴즈를 내는 것이었습니다. 단순히 코드를 일부 제거하는 것이 아니라, 맥락을 유지하면서 사용자가 충분히 이해할 수 있는 위치에서 빈칸을 생성해야 합니다. 그러기 위해서는 코드의 구조를 이해하고 의미 있는 부분을 추출하는 과정이 필요합니다. 

이를 위해 함수 단위로 코드를 분석하고, 단계적으로 문제를 생성하는 방식을 적용했습니다.

#### (1) 파일에서 함수 분리하기

함수는 대부분 자바스크립트에서 주요 동작을 담당하며, 내부에서 사용하는 변수나 조건식도 함수 내 또는 함수의 매개변수로 전달되기 때문에 사용자가 더 쉽게 맥락을 파악할 수 있을 것이라 생각했습니다. 

모든 내용을 담고 있는 최상위 함수 단위로 코드를 추출합니다. 함수의 범위를 찾기 위해 `function`이라는 키워드를 찾습니다. 이후 중괄호 `{}`를 기준으로 여닫는 횟수를 세어 스코프를 파악합니다.

```js
const functionIndex = code.indexOf('function');
const startIndex = code.indexOf('{', functionIndex);
let count = 0;
let endIndex = startIndex;

for (let i = startIndex; i < code.length; i++) {
	if (code[i] === '{') {
		count++; // 여는 중괄호일 때는 더합니다.
	} else if (code[i] === '}') {
		count--; // 닫는 중괄호라면 뺍니다.
	} 
	
	if (count === 0) {
	  endIndex = i; // 만약 count가 0이라면 최상위 함수의 스코프가 끝났다고 가정합니다.
	  
	  break;
	}
}

// startIndex과 endIndex + 1를 이용해 영역을 확인합니다.
```

#### (2) 함수의 반환 값 추출하기

퀴즈는 `return` 값을 기준으로 빈칸이 생성됩니다. `return` 구문은 함수의 주요 역할을 나타냅니다. 이를 퀴즈의 빈칸으로 설정하면 사용자가 함수의 동작을 파악하고 답을 예측하기 더 수월할 것이라 생각했습니다.

분리된 함수에서 `return` 값이 있는지 찾습니다. 만약 `return` 값이 없는 함수라면 문제에 적용시키지 않습니다. 값이 있다면 함수의 코드 블록 안에서 `return` 키워드가 포함된 줄을 찾습니다.

```js
  const returnStatements = [];
  const lines = functionCode.split('\n');

  for (const line of lines) {
    if (line.trim().startsWith('return')) { 
      returnStatements.push(line.trim()); // returnStatements = ["return sum;"]
    }
  }
```

이 코드에서는 `return sum;`을 반환 구문으로 추출합니다. 이렇게 추출된 반환 구문을 이용해 빈칸으로 변경하고, 데이터에 저장합니다.

# 개선할 사항

## 1. 알람 시간을 어떻게 감지할 수 있을까

제 앱에 주목적은 사용자 원하는 시간에 알람을 울려 주는 것입니다. 사용자가 등록한 시간에 이벤트를 실행하기 위해서는 앱의 상태와 상관없이 디바이스가 등록된 시간을 인지하고 있어야 합니다.

### 1-1. Foreground Service를 이용해 알람 시간 확인하기

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

### 1-2. Alarm Manager를 이용해 알람 예약하기

이를 해결하기 위해 [Alarm Manager API](https://developer.android.com/develop/background-work/services/alarms/schedule?hl=ko)를 사용하여 사용자가 등록한 알람 시간에 이벤트를 예약하는 방식이 적합하다고 판단했습니다. Alarm Manager는 시스템 알람 서비스에 대한 접근 권한을 제공하여 특정 시간에 애플리케이션을 실행하도록 예약할 수 있습니다.

이벤트를 예약하는 방식이기 때문에 백그라운드에서 시간을 계속 확인하지 않아도 됩니다. 이를 통해 백그라운드 스레드가 메인 스레드에 영향을 주지 않아 ANR 에러를 방지할 수 있습니다. Alarm Manager에서는 Doze 모드를 피할 수 있습니다. 또한 `setAlarmClock()` 및 `setExactAndAllowWhileIdle()` 메서드를 사용할 때 Doze 모드에서도 예외적으로 작업을 수행할 수 있도록 시스템에서 허용합니다.

이를 통해 현재 발생하고 있는 문제를 해결할 수 있을 것이라 생각합니다.

# 개인 회고
