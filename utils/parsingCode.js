export default function parsingCode(code) {
  try {
    const parser = require("./parser/parser");
    const result = parser.parse(code);

    return result;
  } catch (err) {
    console.error(err);

    return undefined;
  }
}
