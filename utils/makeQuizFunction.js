export function makeQuizFunction(code) {
  const lines = code.split("\n");
  const functionsDetails = [];
  let functionBody = [];
  let returnValues = [];
  let insideFunction = false;
  let braceCount = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!insideFunction) {
      if (
        trimmedLine.startsWith("function") ||
        trimmedLine.startsWith("export function")
      ) {
        insideFunction = true;
        functionBody = [];
        returnValues = [];
        braceCount = 0;

        functionBody.push(line);

        if (line.includes("{")) {
          braceCount++;
        }

        continue;
      }
    }

    if (insideFunction) {
      functionBody.push(line);

      for (const char of line) {
        if (char === "{") {
          braceCount++;
        } else if (char === "}") {
          braceCount--;
        }
      }

      if (trimmedLine.startsWith("return")) {
        const returnValue = trimmedLine
          .replace("return", "")
          .replace(";", "")
          .trim();

        returnValues.push(returnValue);
      }

      if (braceCount === 0) {
        functionsDetails.push({
          functionBody: functionBody.join("\n"),
          returnValues: returnValues,
        });

        insideFunction = false;
      }
    }
  }

  return functionsDetails;
}
