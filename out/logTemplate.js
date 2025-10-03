"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogTemplate = void 0;
const getLogTemplate = (language, variable) => {
    let template;
    switch (language) {
        case "javascript":
        case "typescript":
            template = `console.log('${variable}: ', ${variable});`;
            break;
        case "java":
            template = `System.out.println("${variable}: " + ${variable});`;
            break;
        case "python":
            template = `print('${variable}: ', ${variable})`;
            break;
        case "feature":
            template = `print '${variable}: ', ${variable}`;
            break;
        default:
            template = `${variable}`;
    }
    return template;
};
exports.getLogTemplate = getLogTemplate;
//# sourceMappingURL=logTemplate.js.map