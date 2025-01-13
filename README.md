# CODE BEEP

사용자가 알람 받길 원하는 시간을 지정하고, 지정된 시간에 알람이 울립니다. 사용자가 작성했던 코드들로 다양한 문제를 제공하여 잠을 깨워 줍니다.

## 목차

- [프로젝트 동기](#프로젝트-동기)
- [개발 환경](#개발-환경)
- [UI 미리보기](#ui-미리보기)
- [문제 해결하기](#문제-해결하기)
  - [1. 사용자의 리포지토리에서 특정 조건에 따라 파일 저장하기](#1-사용자의-리포지토리에서-특정-조건에-따라-파일-저장하기)
    - [1-1. 사용자의 깃허브에서 최근 업데이트 된 리포지토리 가져오기](#1-1-사용자의-깃허브에서-최근-업데이트-된-리포지토리-가져오기)
    - [1-2. 가져온 리포지토리 파일 필터링 하기](#1-2-가져온-리포지토리-파일-필터링-하기)
  - [2. 사용자의 코드 분석해 퀴즈 만들기](#2-사용자의-코드-분석해-퀴즈-만들기)
    - [2-1. 파일에서 함수 분리하기](#2-1-파일에서-함수-분리하기)
    - [2-2. 반환값 추출하기](#2-2-반환값-추출하기)
- [개선할 사항](#개선할-사항)
  - [1. 알람 시간을 어떻게 감지할 수 있을까](#1-알람-시간을-어떻게-감지할-수-있을까)
    - [1-1. Foreground Service를 이용해 알람 시간 확인하기](#1-1-foreground-service를-이용해-알람-시간-확인하기)
    - [1-2. Alarm Manager를 이용해 알람 예약하기](#1-2-alarm-manager를-이용해-알람-예약하기)

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

### 1. 사용자의 리포지토리에서 특정 조건에 따라 파일 저장하기

제 프로젝트에서는 사용자의 최근 작업을 바탕으로 퀴즈를 출제합니다. 이 기능의 의도는 사용자가 작성 중인 코드 내용을 기반으로 진행 중인 작업들을 상기시키기 것입니다. 이를 위해 사용자가 최근 작업한 리포지토리에서 코드 파일을 가져와야 합니다.

#### 1-1. 사용자의 깃허브에서 최근 업데이트 된 리포지토리 가져오기

REST API를 이용해 사용자의 리포지토리 안에 있는 파일을 가져오기 위해서는 아래와 같은 단계를 거쳐야 합니다.

1. 사용자의 토큰을 가져옵니다.
2. 토큰을 이용해 가장 최근 업데이트 된 리포지토리 한 개를 가져옵니다.
3. 리포지토리에서 모든 디렉토리를 탐지해 파일을 가져옵니다.

먼저 제 애플리케이션에서 사용자는 깃허브 인증을 통해 로그인을 하게 됩니다. 이때 토큰을 통해 리포지토리 등의 정보를 요청하기 때문에 사용자의 Github 토큰을 받아옵니다.

<details>
<summary style="color: gray;">사용자 토큰 받아오기</summary>

```js
export async function createTokenWithCode(code) {
  // code:
  const url = `https://github.com/login/oauth/access_token`;

  const bodyData = {
    client_id: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID,
    client_secret: process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET,
    code: code,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  });

  return response.json();
}
```

`useAuthRequest` 성공 시 `response` 객체에 담겨 있는 정보입니다.

</details>

그 다음, 사용자의 리포지토리를 가져옵니다. 이때 요청 엔드포인트에 가장 최근에 업데이트 된 리포지토리를 가져오도록 설정합니다. 이렇게 하면 사용자가 가장 최근 작업한 리포지토리의 정보를 가져오게 됩니다.

```js
// 가장 마지막 업데이트 리포지토리 가져오기
const url = `https://api.github.com/users/${userName}/repos?sort=updated&direction=desc&per_page=1`;
```

리포지토리의 이름을 받아오고, 이렇게 받아온 리포지토리의 내부 파일들을 탐색하려면 또 한 번 요청을 보내야 합니다. 파일에 대한 요청은 파일 단위로 이뤄지기 때문에 모든 디렉토리 파일을 탐색할 수 있도록 재귀적으로 작업합니다.

재귀적으로 탐색하기 위해 리포지토리에서 탐색된 파일이 디렉토리라면 함수를 재귀 호출하여 다시 탐색합니다. 이 과정을 반복하여 리포지토리 안에 모든 파일을 탐색하게 합니다.

```js
if (file.type === "dir") {
  const nestedFiles = await fetchFilesRecursive(
    accessToken,
    owner,
    repo,
    visitedPaths,
    file.path,
    depth + 1,
    maxDepth
  );
}
```

만약 리포지토리에 파일이 많다면 Github API의 사용량이 과도하게 많아지게 됩니다. 이렇게 되면 제대로 데이터를 받아오지 못 하는 문제가 생기기도 합니다. 이런 현상을 방지하기 위해 파일의 깊이를 제한하여 탐색했습니다. 보통의 파일인 경우 3단계를 넘지 않기 때문에 3 이상의 깊이가 됐다면 더 이상 탐색하지 않도록 했습니다.

```js
if (depth > maxDepth) return [];
```

또한 이미 방문한 경로라면 다시 방문하지 않도록 경로를 따로 저장해 둬 같은 리포지토리 재탐색을 방지했습니다.

```js
const visitedPaths = new Set();

if (visitedPaths.has(path)) {
  return [];
}

visitedPaths.add(path);
```

이렇게 받아온 파일을 필터링 해 필요한 파일만 데이터에 저장합니다.

#### 1-2. 가져온 리포지토리 파일 필터링 하기

필요한 파일이란 사용자가 작성한 코드가 있는 파일입니다. 사용자가 작성한 코드를 직접적으로 알 수 없기 때문에 기준을 세워 최대한 가능성을 높이기 위해 노력했습니다. 그 기준은 아래와 같습니다.

1. `README.md`, `package.json`, `config.js` 등 설정 파일은 제외한다.
2. `node_modules/`, `.github/`, `dist/` 등 불필요한 경로는 제외한다.
3. 확장자가 `.js`, `.ts`, `.py` 등 프로그래밍 언어 확장자만 가지고 온다.

Github REST API에서는 이 파일에 대해 미리 필터링을 해 주지 않습니다. 모든 파일을 가져온 후, 설정 파일 및 불필요한 경로를 걸러내어 실제 코드 파일만 남깁니다.

```js
const validExtensions = [".js", ".ts", ".py", ".java"];
if (!validExtensions.some((ext) => file.path.endsWith(ext))) {
  return; // 프로그래밍 언어가 아닌 경우 제외
}
```

최종적으로 코드 파일 중에도 실제 코드 로직이 작성된 파일을 식별하기 위해 `function`, `class` 등의 코드 패턴을 포함한 파일을 거친 후 남은 파일들을 데이터 베이스에 저장하게 됩니다.

```js
const fileContent = await fetchFileContent(fileUrl);

if (fileContent.includes("function") || fileContent.includes("class") || ...) {
  // 코드 로직이 포함된 파일만 추가
  filteredFiles.push(file);
}

```

이 과정을 통해 깃허브 리포지토리에서 불필요한 파일을 걸러내고, 사용자가 작성했을 가능성이 높은 파일들을 선별할 수 있었습니다.

### 2. 사용자의 코드 분석해 퀴즈 만들기

사용자의 코드를 사용해 퀴즈를 낼 때 고려했던 것은 사용자가 답을 예측할 수 있는 퀴즈를 내는 것이었습니다. 단순히 코드를 일부 제거하는 것이 아니라, 맥락을 유지하면서 사용자가 충분히 이해할 수 있는 위치에서 빈칸을 생성해야 합니다. 그러기 위해서는 코드의 구조를 이해하고 의미 있는 부분을 추출하는 과정이 필요합니다.

이를 위해 함수 단위로 코드를 분석하고, 단계적으로 문제를 생성하는 방식을 적용했습니다.

#### 2-1. 파일에서 함수 분리하기

함수는 대부분 자바스크립트에서 주요 동작을 담당하며, 내부에서 사용하는 변수나 조건식도 함수 내 또는 함수의 매개변수로 전달되기 때문에 사용자가 더 쉽게 맥락을 파악할 수 있을 것이라 생각했습니다.

모든 내용을 담고 있는 최상위 함수 단위로 코드를 추출합니다. 함수의 범위를 찾기 위해 `function`이라는 키워드를 찾습니다. 이후 중괄호 `{}`를 기준으로 여닫는 횟수를 세어 스코프를 파악합니다.

```js
const functionIndex = code.indexOf("function");
const startIndex = code.indexOf("{", functionIndex);
let count = 0;
let endIndex = startIndex;

for (let i = startIndex; i < code.length; i++) {
  if (code[i] === "{") {
    count++; // 여는 중괄호일 때는 더합니다.
  } else if (code[i] === "}") {
    count--; // 닫는 중괄호라면 뺍니다.
  }

  if (count === 0) {
    endIndex = i; // 만약 count가 0이라면 최상위 함수의 스코프가 끝났다고 가정합니다.

    break;
  }
}

// startIndex과 endIndex + 1를 이용해 영역을 확인합니다.
```

위 코드를 이용해 `function` 키워드를 기준으로 최상위 함수의 영역을 찾습니다.

#### 2-2. 반환값 추출하기

제 알고리즘에서는 `return` 값을 기준으로 빈칸이 생성됩니다. `return` 구문은 함수의 주요 역할을 나타냅니다. 이를 퀴즈의 빈칸으로 설정하면 사용자가 함수의 동작을 파악하고 답을 예측하기 더 수월할 것이라 생각했습니다.
분리된 함수에서 `return` 값이 있는지 찾습니다. 만약 `return` 값이 없는 함수라면 문제에 적용시키지 않습니다. 값이 있다면 함수의 코드 블록 안에서 `return` 키워드가 포함된 줄을 찾습니다.

```js
const returnStatements = [];
const lines = functionCode.split("\n");

for (const line of lines) {
  if (line.trim().startsWith("return")) {
    returnStatements.push(line.trim()); // returnStatements = ["return sum;"]
  }
}
```

이 코드에서는 `return sum;`을 반환 구문으로 추출합니다. 이렇게 추출된 반환 구문을 이용해 빈칸으로 변경하고, 데이터에 저장합니다.

```js
let quizCode = functionCode;

// 반환값을 빈칸으로 변경
for (const returnStatement of returnStatements) {
  quizCode = quizCode.replace(returnStatement, "return ___;");
}
```

이런 과정을 거쳐 사용자에게 제공될 퀴즈를 생성합니다. 만약 아래와 같은 함수를 추출했다고 가정한다면

```js
function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}
```

위 알고리즘을 통해 생성된 함수는 아래와 같은 방식으로 표기됩니다.

```js
function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return ___;
}
```

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
