const getLogTemplate = (language: string, variable: string): string => {
  let template;
  switch (language) {
    case "javascript":
    case "javascriptreact":
    case "typescript":
    case "typescriptreact":
      template = `console.log('${variable}: ', ${variable});`;
      break;
    case "java":
      template = `System.out.println("${variable}: " + ${variable});`;
      break;
    case "python":
      template = `print('${variable}: ', ${variable})`;
      break;
    case "feature":
      template = `* print '${variable}: ', ${variable}`;
      break;
    default:
      template = `${variable}`;
  }
  return template;
};

export { getLogTemplate };
