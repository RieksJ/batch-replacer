"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResultUtils {
    static failure(errorMessage) {
        return {
            success: false,
            errorMessage
        };
    }
    static success(value) {
        return {
            success: true,
            value
        };
    }
}
exports.ResultUtils = ResultUtils;
//# sourceMappingURL=ResultUtils.js.map