/**
 * 
 *
 * @param {string} code - JavaScript code snippet needing improvement.
 * @param {string} issue - The type of issue (e.g., "no-var").
 * @returns {string} - A formatted prompt string.
 */
function generatePrompt(code) {
    return `
  You are a helpful AI code reviewer.
  Given the following JavaScript code and the issue , suggest a better way to write it with explanation and fixed version.
  
  Code:
  \`\`\`js
  ${code}
  \`\`\`
  
  Respond in this JSON format:
  {
    "explanation": "...",
    "fixedCode": "..."
  }`;
  }
  
  module.exports = generatePrompt;
  