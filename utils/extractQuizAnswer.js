export default function extractQuizAnswer(ast) {
  const result = [];
  const resultLocation = {};
  const stack = [{ node: ast, parentKey: null }];

  while (stack.length > 0) {
    const { node, parentKey } = stack.pop();

    if (typeof node === "object" && node !== null) {
      if (node.type === "Identifier" && parentKey === "name") {
        result.push(node.name);
        resultLocation[node.name] = { start: node.start, end: node.end };
      }

      if (parentKey === "parameters" && Array.isArray(node)) {
        node.forEach((param) => {
          if (param !== null && param.name) {
            result.push(param.name);
            resultLocation[param.name] = { start: param.start, end: param.end };
          }
        });
      }

      for (const key in node) {
        stack.push({ node: node[key], parentKey: key });
      }
    }
  }
  const randomIndex = Math.floor(Math.random() * result.length);
  const answer = result[randomIndex];
  const location = resultLocation[answer];

  return {
    answer: answer,
    start: location.start,
    end: location.end,
  };
}
