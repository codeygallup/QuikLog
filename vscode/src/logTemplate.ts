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
    case "gherkin":
      template = `* print '${variable}: ', ${variable}`;
      break;
    case "c":
      template = `printf("%s: %d\\n", "${variable}", ${variable});`;
      break;
    case "cpp":
      template = `std::cout << "${variable}: " << ${variable} << std::endl;`;
      break;
    case "csharp":
      template = `Console.WriteLine("${variable}: " + ${variable});`;
      break;

    default:
      template = `${variable}`;
  }
  return template;
};

export { getLogTemplate };
