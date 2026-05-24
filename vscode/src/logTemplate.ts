type Language =
  | "javascript"
  | "javascriptreact"
  | "typescript"
  | "typescriptreact"
  | "java"
  | "python"
  | "feature"
  | "gherkin"
  | "c"
  | "cpp"
  | "csharp";

type TemplateMap = Record<Language, (variable: string) => string>;

const TEMPLATE_MAP: TemplateMap = {
  javascript:       (v) => `console.log('${v}: ', ${v});`,
  javascriptreact:  (v) => `console.log('${v}: ', ${v});`,
  typescript:       (v) => `console.log('${v}: ', ${v});`,
  typescriptreact:  (v) => `console.log('${v}: ', ${v});`,
  java:             (v) => `System.out.println("${v}: " + ${v});`,
  python:           (v) => `print('${v}: ', ${v})`,
  feature:          (v) => `* print '${v}: ', ${v}`,
  gherkin:          (v) => `* print '${v}: ', ${v}`,
  c:                (v) => `printf("%s: %d\\n", "${v}", ${v});`,
  cpp:              (v) => `std::cout << "${v}: " << ${v} << std::endl;`,
  csharp:           (v) => `Console.WriteLine("${v}: " + ${v});`,
};

export const getLogTemplate = (language: string, variable: string): string =>
  (TEMPLATE_MAP[language as Language] ?? ((v: string) => v))(variable);