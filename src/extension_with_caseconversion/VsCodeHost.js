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
const FS = require("fs");
const vscode = require("vscode");
const ResultUtils_1 = require("./ResultUtils");
class VsCodeHost {
    findFilePaths(filePattern) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield vscode.workspace.findFiles(filePattern);
            return new Set(files.map(file => file.fsPath));
        });
    }
    hasOpenFolders() {
        return !!vscode.workspace.workspaceFolders;
    }
    readFile(filePath) {
        return FS.readFileSync(filePath, "utf8");
    }
    showErrorMessage(errorMessage) {
        vscode.window.showErrorMessage(errorMessage);
    }
    showInformationMessage(informationMessage) {
        vscode.window.showInformationMessage(informationMessage);
    }
    tryGetScriptText() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return ResultUtils_1.ResultUtils.failure("There is no active text editor. " +
                "Make sure to run the command when your script is in the active text editor.");
        }
        const document = editor.document;
        return ResultUtils_1.ResultUtils.success(document.getText());
    }
    writeFile(filePath, content) {
        FS.writeFileSync(filePath, content, "utf8");
    }
}
exports.VsCodeHost = VsCodeHost;
//# sourceMappingURL=VsCodeHost.js.map