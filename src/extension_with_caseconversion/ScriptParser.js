"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Patterns_1 = require("./Patterns");
const RegexUtils_1 = require("./RegexUtils");
const ResultUtils_1 = require("./ResultUtils");
const StringUtils_1 = require("./StringUtils");
const Tokens_1 = require("./Tokens");
const Verify_1 = require("./Verify");
class ScriptParser {
    static tryParseScript(text) {
        const variablesByName = new Map();
        const replaceCommands = [];
        const lines = text.split(/\r?\n/);
        let asRegex = false;
        let asCase = false;
        let filter = undefined;
        let _in = undefined;
        let replace = undefined;
        let _with = undefined;
        let lineNumber = 0;
        for (let line of lines) {
            lineNumber++;
            line = line.trim();
            if (line === "") {
                continue;
            }
            if (line.startsWith(Tokens_1.Tokens.comment)) {
                continue;
            }
            const parseResult = this.parseLine(line);
            switch (parseResult.kind) {
                case 0 /* Filter */:
                    if (filter !== undefined) {
                        return ResultUtils_1.ResultUtils.failure(`Unexpected 'filter' instruction at line ${lineNumber}: ${line}`);
                    }
                    if (!parseResult.filter) {
                        return ResultUtils_1.ResultUtils.failure(`Invalid 'filter' instruction at line ${lineNumber}: ${line}`);
                    }
                    filter = parseResult.filter;
                    break;
                case 1 /* In */:
                    if (_in !== undefined || replace !== undefined || _with !== undefined) {
                        return ResultUtils_1.ResultUtils.failure(`Unexpected 'in' instruction at line ${lineNumber}: ${line}`);
                    }
                    if (!parseResult.in) {
                        return ResultUtils_1.ResultUtils.failure(`Invalid 'in' instruction at line ${lineNumber}: ${line}`);
                    }
                    _in = parseResult.in;
                    break;
                case 2 /* Replace */:
                    if (replace !== undefined || _with !== undefined) {
                        return ResultUtils_1.ResultUtils.failure(`Unexpected 'replace' instruction at line ${lineNumber}: ${line}`);
                    }
                    replace = parseResult.replace;
                    break;
                case 3 /* ReplaceRegex */:
                    if (replace !== undefined || _with !== undefined) {
                        return ResultUtils_1.ResultUtils.failure(`Unexpected 'replace-regex' instruction at line ${lineNumber}: ${line}`);
                    }
                    replace = parseResult.replaceRegex;
                    asRegex = true;
                    break;
                case 5 /* With */:
                    if (replace === undefined || _with !== undefined) {
                        return ResultUtils_1.ResultUtils.failure(`Unexpected 'with' instruction at line ${lineNumber}: ${line}`);
                    }
                    _with = parseResult.with;
                    break;
                case 7 /* WithCase */:
                    if (replace === undefined || _with !== undefined) {
                        return ResultUtils_1.ResultUtils.failure(`Unexpected 'replace-case' instruction at line ${lineNumber}: ${line}`);
                    }
                    _with = parseResult.withCase;
                    asCase = true;
                    break;
                case 4 /* Variable */:
                    if (_in !== undefined ||
                        replace !== undefined ||
                        _with !== undefined ||
                        replaceCommands.length > 0) {
                        return ResultUtils_1.ResultUtils.failure(`Unexpected variable at line ${lineNumber}: ${line}`);
                    }
                    const variable = parseResult.variable;
                    variable.value = this.resolveVariables(variable.value, variablesByName.values());
                    variablesByName.set(variable.name, variable);
                    break;
                case 6 /* Unrecognized */:
                    return ResultUtils_1.ResultUtils.failure(`Unrecognized instruction at line ${lineNumber}: ${line}`);
                default:
                    Verify_1.Verify.isNever(parseResult);
            }
            if (replace !== undefined && _with !== undefined) {
                replaceCommands.push({
                    in: _in || this.defaultFilePattern,
                    asRegex,
                    asCase,
                    replace,
                    with: _with
                });
                _in = undefined;
                asRegex = false;
                asCase = false;
                replace = undefined;
                _with = undefined;
            }
        }
        for (const replaceCommand of replaceCommands) {
            replaceCommand.replace = this.resolveVariables(replaceCommand.replace, variablesByName.values());
        }
        return ResultUtils_1.ResultUtils.success({
            filter: filter || this.defaultFilePattern,
            replaceCommands
        });
    }
    static parseLine(line) {
        {
            const filterMatchGroups = RegexUtils_1.RegexUtils.extractWithRegex(line, Patterns_1.Patterns.filter);
            if (filterMatchGroups) {
                return {
                    kind: 0 /* Filter */,
                    filter: filterMatchGroups[0].trim()
                };
            }
        }
        {
            const inMatchGroups = RegexUtils_1.RegexUtils.extractWithRegex(line, Patterns_1.Patterns.in);
            if (inMatchGroups) {
                return {
                    kind: 1 /* In */,
                    in: inMatchGroups[0].trim()
                };
            }
        }
        {
            const replaceMatchGroups = RegexUtils_1.RegexUtils.extractWithRegex(line, Patterns_1.Patterns.replace);
            if (replaceMatchGroups) {
                return {
                    kind: 2 /* Replace */,
                    replace: replaceMatchGroups[0]
                };
            }
        }
        {
            const replaceRegexMatchGroups = RegexUtils_1.RegexUtils.extractWithRegex(line, Patterns_1.Patterns.replaceRegex);
            if (replaceRegexMatchGroups) {
                return {
                    kind: 3 /* ReplaceRegex */,
                    replaceRegex: replaceRegexMatchGroups[0]
                };
            }
        }
        {
            const withMatchGroups = RegexUtils_1.RegexUtils.extractWithRegex(line, Patterns_1.Patterns.with);
            if (withMatchGroups) {
                return {
                    kind: 5 /* With */,
                    with: withMatchGroups[0]
                };
            }
        }
        {
            const withCaseMatchGroups = RegexUtils_1.RegexUtils.extractWithRegex(line, Patterns_1.Patterns.withCase);
            if (withCaseMatchGroups) {
                return {
                    kind: 7 /* WithCase */,
                    withCase: withCaseMatchGroups[0]
                };
            }
        }
        {
            const variableMatchGroups = RegexUtils_1.RegexUtils.extractWithRegex(line, Patterns_1.Patterns.variable);
            if (variableMatchGroups) {
                return {
                    kind: 4 /* Variable */,
                    variable: {
                        name: variableMatchGroups[0],
                        value: variableMatchGroups[1]
                    }
                };
            }
        }
        return {
            kind: 6 /* Unrecognized */
        };
    }
    static resolveVariables(value, variables) {
        for (const variable of variables) {
            value = StringUtils_1.StringUtils.replaceAll(value, `%{${variable.name}}`, variable.value);
        }
        return value;
    }
}
exports.ScriptParser = ScriptParser;
ScriptParser.defaultFilePattern = "**/*";
//# sourceMappingURL=ScriptParser.js.map