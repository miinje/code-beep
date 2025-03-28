import extractQuizAnswer from "./extractQuizAnswer";
import parsingCode from "./parsingCode";

export default function saveQuizAnswer(userRepoCodeData) {
  const code = userRepoCodeData.fileContent.split("\n");
  const funcStartIndex = code.findIndex(
    (str) => str.includes("function") || str.includes("=>")
  );
  let funcCode = code.slice(funcStartIndex).join("\n").trimEnd();

  if (funcCode.endsWith(";")) {
    funcCode = funcCode.slice(0, funcCode.length - 1);
  }

  if (
    !funcCode.startsWith("var") &&
    !funcCode.startsWith("let") &&
    !funcCode.startsWith("const") &&
    !funcCode.includes("=>")
  ) {
    funcCode = funcCode.slice(funcCode.indexOf("function"));
  }

  const ast = parsingCode(funcCode);

  if (!ast) {
    return {
      commitMessage: userRepoCodeData.commitMessage,
      repo: userRepoCodeData.repo,
      fileName: userRepoCodeData.fileName,
      url: userRepoCodeData.commitUrl,
    };
  } else {
    const result = extractQuizAnswer(ast);
    const blankCode =
      funcCode.slice(0, result.start) +
      "■".repeat(result.answer.length) +
      funcCode.slice(result.end);

    const codeArray = blankCode.split("\n");
    const answer = codeArray.filter((code) => code.includes("■"));

    if (
      codeArray.indexOf(answer[0]) !== 0 &&
      codeArray.indexOf(answer[0]) !== codeArray.length - 1
    ) {
      answer.shift("// ...");
      answer.push("// ...");
    } else if (codeArray.indexOf(answer[0]) === codeArray.length - 2) {
      answer.shift("// ...");
    } else if (codeArray.indexOf(answer[0]) === 0) {
      answer.push(" // ...");
      answer.push(codeArray[codeArray.length - 1]);
    }

    return {
      commitMessage: userRepoCodeData.commitMessage,
      answer: result.answer,
      quiz: answer,
      repo: userRepoCodeData.repo,
      fileName: userRepoCodeData.fileName,
      url: userRepoCodeData.commitUrl,
    };
  }
}
