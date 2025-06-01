const parser = require("@babel/parser");

function parseCode(code) {
  return parser.parse(code, {
    sourceType: "module",
    plugins: [
      "jsx", 
      "typescript", 
      "classProperties",
      "optionalChaining",
      "nullishCoalescingOperator",
    ],
  });
}

module.exports = parseCode;
