module.exports = {
    name: "no_var",
    description: "Disallow var, use let/const instead",
    check(path, report) {
      if (path.node.type === "VariableDeclaration" && path.node.kind === "var") {
        report({
          message: "Avoid using 'var'. Use 'let' or 'const'.",
          loc: path.node.loc,
          fixable: true, 
          fix: () => {
            path.node.kind = "let";
          },
        });
      }
    },
  };
  