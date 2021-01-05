"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RegexUtils {
    static escapeRegex(value) {
        return value.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }
    // The pattern should contain groups.
    // If the pattern matches, this method will return the content of each group.
    //
    // Example: extractWithRegex("abc 123 def", "(\\d+)") === ["123"]
    // Example: extractWithRegex("abc = 123", "(.*) = (.*)") === ["abc", "123"]
    static extractWithRegex(value, pattern) {
        const regex = RegExp(pattern, "g");
        const result = regex.exec(value);
        if (result == null) {
            return undefined;
        }
        return result.splice(1);
    }
}
exports.RegexUtils = RegexUtils;
//# sourceMappingURL=RegexUtils.js.map