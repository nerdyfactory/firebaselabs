"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
exports = module.exports = functions.https.onRequest((request, response) => {
    response.send("TypeScript Hello from Firebase!");
});
//# sourceMappingURL=helloWorldTS.js.map