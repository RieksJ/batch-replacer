"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ScriptParser_1 = require("./ScriptParser");
const StringUtils_1 = require("./StringUtils");
class BatchReplacer {
    static batchReplace(host) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!host.hasOpenFolders()) {
                host.showErrorMessage("There are no open folders. " +
                    "Make sure to open at least one folder in Visual Studio Code. " +
                    "The script will perform the replacements in the files in the open folders.");
                return;
            }
            const scriptTextResult = host.tryGetScriptText();
            if (!scriptTextResult.success) {
                host.showErrorMessage(scriptTextResult.errorMessage);
                return;
            }
            const scriptText = scriptTextResult.value;
            const scriptResult = ScriptParser_1.ScriptParser.tryParseScript(scriptText);
            if (!scriptResult.success) {
                host.showErrorMessage("Failed to parse the script. " + scriptResult.errorMessage);
                return;
            }
            const script = scriptResult.value;
            const filteredFilePaths = yield host.findFilePaths(script.filter);
            const rewriteInstructionsByFilePath = new Map();
            for (const command of script.replaceCommands) {
                const inFilePaths = yield host.findFilePaths(command.in);
                for (const filePath of inFilePaths) {
                    if (filteredFilePaths.has(filePath)) {
                        const currentRewriteInstruction = rewriteInstructionsByFilePath.get(filePath);
                        const currentText = currentRewriteInstruction ?
                            currentRewriteInstruction.newText :
                            host.readFile(filePath);
                        const newText = StringUtils_1.StringUtils.replaceAll(currentText, command.replace, command.with, command.asRegex, command.asCase);
                        if (newText != currentText) {
                            rewriteInstructionsByFilePath.set(filePath, {
                                newText
                            });
                        }
                    }
                }
            }
            for (const filePath of rewriteInstructionsByFilePath.keys()) {
                const rewriteInstruction = rewriteInstructionsByFilePath.get(filePath);
                host.writeFile(filePath, rewriteInstruction.newText);
            }
            host.showInformationMessage(`Batch replace completed: ${rewriteInstructionsByFilePath.size} file(s) modified.`);
        });
    }
}
exports.BatchReplacer = BatchReplacer;
//# sourceMappingURL=BatchReplacer.js.map