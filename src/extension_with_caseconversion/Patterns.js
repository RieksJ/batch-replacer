"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Patterns {
}
exports.Patterns = Patterns;
Patterns.filter = '^filter\\s+"(.*)"$';
Patterns.in = '^in\\s+"(.*)"$';
Patterns.replace = '^replace\\s+"(.*)"$';
Patterns.replaceRegex = '^replace-regex\\s+"(.*)"$';
Patterns.variable = '^(\\w+)\\s*=\\s*"(.*)"$';
Patterns.with = '^with\\s+"(.*)"$';
Patterns.withCase = '^with-case\\s+"(lowercase|uppercase)"$';
//# sourceMappingURL=Patterns.js.map