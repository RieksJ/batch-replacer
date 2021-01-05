"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RegexUtils_1 = require("./RegexUtils");
class StringUtils {
    static replaceAll(value, oldValue, newValue, asRegex, asCase) {
        if (!asRegex) {
            oldValue = RegexUtils_1.RegexUtils.escapeRegex(oldValue);
        }
        if (asRegex) {
            newValue = StringUtils.replaceAll(newValue, "\\r", "\r");
            newValue = StringUtils.replaceAll(newValue, "\\n", "\n");
            newValue = StringUtils.replaceAll(newValue, "\\t", "\t");
        }
        if (!asCase) {
            return value.replace(new RegExp(oldValue, "g"), newValue);
        }
        if (asCase) {
            switch (newValue) {
                case 'lowercase' /* convert to lowercase */:
                    return value.replace(new RegExp(oldValue, "g"), function (oldvalue) {
                        return oldvalue.toLowerCase();
                    } );
                break;
                case 'uppercase' /* convert to uppercase */:
                    return value.replace(new RegExp(oldValue, "g"), function(oldvalue) {
                        return oldvalue.toUpperCase() 
                    } );
                break;
                default:
                    return value.replace(new RegExp(oldValue, "g"), newValue);
            }
        }
    }
}
exports.StringUtils = StringUtils;
//# sourceMappingURL=StringUtils.js.map
