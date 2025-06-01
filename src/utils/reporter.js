function reportIssue({ line, ruleName, originalLine, fixable, aiFix }) {
  console.log(`\n📍 Line ${line}: ${originalLine}`);
  console.log(`⚠️ Issue [${ruleName}]`);

  if (fixable) {
    console.log("✅ Auto-fixed.");
  } 
  else if (aiFix) {
    console.log("🧠 AI Suggestion:");
    console.log("📝 Explanation:", aiFix.explanation);
    console.log("🔁 Fixed Version:\n", aiFix.fixedCode);
  } else {
    console.log("❌ No fix available.");
  }
}

module.exports = { reportIssue };
