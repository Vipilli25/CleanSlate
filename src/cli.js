const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const parseCode = require("./parser");
const applyRules = require("./transformer");
const printReport = require("./utils/reporter");
const generator = require("@babel/generator").default;
require("dotenv").config();

async function main() {
  const filePath = process.argv[2];

  if (!filePath || !fs.existsSync(filePath)) {
    console.error(chalk.red("❌ Please provide a valid file path."));
    process.exit(1);
  }

  const fileName = path.basename(filePath);
  const code = fs.readFileSync(filePath, "utf-8");

  console.log(chalk.blue(`🔍 Original Code (${fileName}):\n`));
  console.log(code);

  const ast = parseCode(code);

  try {
    const issues = await applyRules(ast, filePath, { fix: true });

    console.log(chalk.green("\n✅ Cleaned Code:\n"));
    console.log(generator(ast).code);

    console.log(chalk.yellow("\n📋 Lint Report:\n"));
    // printReport(issues);
  } catch (error) {
    console.error(chalk.red("❌ Error during linting:"), error.message);
  }
}

main();
