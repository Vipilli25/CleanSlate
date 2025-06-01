const traverse = require("@babel/traverse").default;
const fs = require("fs");
const path = require("path");
const { getFixSuggestion } = require("./utils/AIFix");
const { reportIssue } = require("./utils/reporter");

const rulesDir = path.join(__dirname, "rules");

const rules = fs
  .readdirSync(rulesDir)
  .filter((file) => file.endsWith(".js"))
  .map((file) => require(path.join(rulesDir, file)));

async function applyRules(ast, filePath, options = { fix: true }) {
  const issues = [];
  const aiFixTasks = []; 

  const code = fs.readFileSync(filePath, "utf8");
  const lines = code.split("\n");

  traverse(ast, {
    enter(path) {
      let fixApplied = false; 

      for (const rule of rules) {
        rule.check(path, (issue) => {
          const startLine = path.node.loc?.start?.line ?? -1;
          const originalLine = lines[startLine - 1] || "<no line found>";

          const issueRecord = {
            line: startLine,
            ruleName: rule.name,
            originalLine,
            fixable: issue.fixable || false, // Track if rule is fixable
            aiFix: null,
          };

          // If the rule is fixable and has a fix function, apply it
          if (options.fix && issue.fixable && issue.fix) {
            issue.fix();
            fixApplied = true; // Mark that a fix was applied
            issueRecord.fixable = true;
            issues.push({ ...issue, rule: rule.name, line: startLine });
            reportIssue(issueRecord); // Report the auto-fix
          }
        });
      }

      // If no fix was applied by the rules, attempt an AI fix
      if (!fixApplied) {
        const startLine = path.node.loc?.start?.line ?? -1;
        const originalLine = lines[startLine - 1] || "<no line found>";

        const aiTask = getFixSuggestion(originalLine)
          .then((aiFixSuggestion) => {
            // Only call AI fix if no auto-fix was applied
            const issueRecord = {
              line: startLine,
              ruleName: "AI Fix", // AI is the rule here
              originalLine,
              fixable: false, // Mark it as non-fixable for AI
              aiFix: aiFixSuggestion,
            };
            reportIssue(issueRecord); // Report AI fix suggestion
          })
          .catch((err) => {
            console.error(`❌ Failed to get AI fix for line ${startLine}:`, err.message);
          });

        aiFixTasks.push(aiTask);
      }
    },
  });

  // Ensure AI tasks finish before returning the issues
  await Promise.all(aiFixTasks);

  return issues;
}

module.exports = applyRules;
