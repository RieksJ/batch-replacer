"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const BatchReplacer_1 = require("./BatchReplacer");
const VsCodeHost_1 = require("./VsCodeHost");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand("batchReplacer.batchReplace", () => BatchReplacer_1.BatchReplacer.batchReplace(new VsCodeHost_1.VsCodeHost())));
}
exports.activate = activate;
//# sourceMappingURL=Extension.js.map